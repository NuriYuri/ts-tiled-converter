import groupBy from 'lodash.groupby';
import { NDSpace, resolveNDSpaceId } from '../ndSpace';
import type { LayerWithMetaData, LayersWithTileCommandCollection, TileCommand, TileMetaData } from '../types';

type LayerWithOnlyMetaData = Omit<LayerWithMetaData, 'layer'> & { layer: TileMetaData[] };
type LayerTile = TileMetaData | TileCommand;
type LayerTileCache = NDSpace<LayerTile, 0>;

export const compressLayersTile = (
  tileIndex: number,
  regularLayers: LayerWithMetaData[],
  layerWithCommands: LayersWithTileCommandCollection,
  cache: LayerTileCache,
): number[] => {
  const context = getContext(tileIndex, regularLayers, layerWithCommands);
  if (context.layers.length === 0) return [];

  const hasZ = context.layers.some(({ z }) => z > 0);
  if (!hasZ) {
    // Compress tiles with no tiles on top (water case) => bottom => water => stuff on top of water
    return compressTilesWithNoZ(context, cache);
  }
  if (context.bridge1 || context.bridge2) {
    return compressTilesWithBridge(context, cache);
  }

  return compressTiles(context, cache);
};

type Context = {
  tileIndex: number;
  systemTag: TileCommand | undefined;
  bridge1: TileCommand | undefined;
  bridge2: TileCommand | undefined;
  terrainTag: TileCommand | undefined;
  passage: TileCommand;
  priorities: TileCommand[];
  layers: LayerWithOnlyMetaData[];
};

const getContext = (tileIndex: number, regularLayers: LayerWithMetaData[], layerWithCommands: LayersWithTileCommandCollection): Context => {
  const systemTag = layerWithCommands.systemTags[tileIndex] || 0;
  const bridge1 = layerWithCommands.systemTagsBridge1[tileIndex] || 0;
  const bridge2 = layerWithCommands.systemTagsBridge2[tileIndex] || 0;
  const passage = layerWithCommands.passages[tileIndex] || 0;
  const terrainTag = layerWithCommands.terrainTags[tileIndex] || 0;
  const layers = regularLayers.filter((layer): layer is LayerWithOnlyMetaData => !!layer.layer[tileIndex]);
  const { commands } = layerWithCommands;
  return {
    tileIndex,
    systemTag: systemTag !== 0 ? commands.systemTags.find((v) => v.systemTag === systemTag) : undefined,
    bridge1: bridge1 !== 0 ? commands.systemTags.find((v) => v.systemTag === bridge1) : undefined,
    bridge2: bridge2 !== 0 ? commands.systemTags.find((v) => v.systemTag === bridge2) : undefined,
    terrainTag: terrainTag !== 0 ? commands.terrainTags.find((v) => v.terrainTag === terrainTag) : undefined,
    passage: commands.passages.find((v) => v.passage === passage)!,
    priorities: commands.priorities,
    layers,
  };
};

const compressTilesWithNoZ = (context: Context, cache: LayerTileCache) => {
  const { tileIndex, layers, passage } = context;
  const mapToTile = toTileByIndex(tileIndex);

  return [
    layers.slice(0, -2).map(mapToTile),
    layers.slice(-2, -1).map(mapToTile),
    [...layers.slice(-1).map(mapToTile), context.systemTag, context.terrainTag, passage].filter(excludeUndefined),
  ]
    .filter(filterOutEmptyArrays)
    .map(mapToTileId(cache));
};

const GROUP_BY_Z = ['ground', 'bridge1Layer', 'bridge1Layer', 'bridge1Layer', 'bridge2Layer', 'bridge2Layer'];

const compressTilesWithBridge = (context: Context, cache: LayerTileCache) => {
  const { tileIndex, layers, systemTag, terrainTag, passage, bridge1, bridge2, priorities } = context;
  const mapToTile = toTileByIndex(tileIndex);
  const { ground, bridge1Layer, bridge2Layer } = groupBy(layers, ({ z }) => GROUP_BY_Z[z] || GROUP_BY_Z[5]);
  const tileLayers: LayerTile[][] = [
    ground && ground.length !== 0 ? ground.map(mapToTile) : [mapToTile(layers[0])],
    bridge1Layer && bridge1Layer.length > 0 ? [priorities[3], ...bridge1Layer.map(mapToTile)] : [],
    bridge2Layer && bridge2Layer.length > 0 ? [priorities[5], ...bridge2Layer.map(mapToTile)] : [],
  ];

  if (systemTag) tileLayers[0].push(systemTag);
  if (terrainTag) tileLayers[0].push(terrainTag);
  tileLayers[0].push(passage);

  if (bridge1 && tileLayers[1].length) tileLayers[1].push(bridge1);
  if (bridge2 && tileLayers[2].length) tileLayers[2].push(bridge2);

  return tileLayers.filter(filterOutEmptyArrays).map(mapToTileId(cache));
};

const GROUND = 'ground';
const PRIORITY_OVER_PLAYER = 'priorityOverPlayer';
const PRIORITY = 'priority';

const compressTiles = (context: Context, cache: LayerTileCache) => {
  const { tileIndex, layers } = context;
  const mapToTile = toTileByIndex(tileIndex);
  const { ground, priorityOverPlayer, priority } = groupBy(layers, ({ z }) => (z === 0 ? GROUND : z === 1 ? PRIORITY_OVER_PLAYER : PRIORITY));

  const tileLayers =
    !ground || ground.length === 0
      ? tileLayersWithNoGrounds(priorityOverPlayer, priority, context, mapToTile)
      : tileLayersWithGrounds(priorityOverPlayer, priority, ground, context, mapToTile);

  return tileLayers.filter(filterOutEmptyArrays).map(mapToTileId(cache));
};

const highestPriority = (priority: LayerWithOnlyMetaData[]) => Math.max(...priority.map(({ z }) => z));

const tileLayersWithNoGrounds = (
  priorityOverPlayer: LayerWithOnlyMetaData[] | undefined,
  priority: LayerWithOnlyMetaData[] | undefined,
  context: Context,
  mapToTile: (layer: LayerWithOnlyMetaData) => TileMetaData,
) => {
  const { priorities } = context;
  if (priorityOverPlayer && priorityOverPlayer.length > 0) {
    return [
      getPriorityTileWithContext(mapToTile(priorityOverPlayer[0]), context),
      [priorities[1], ...priorityOverPlayer.map(mapToTile)],
      priority && priority.length > 0 ? [priorities[highestPriority(priority)] || priorities[5], ...priority.map(mapToTile)] : [],
    ];
  }

  if (!priority || priority.length === 0) {
    // This condition is impossible in theory
    return [[{ globalId: 1, transformId: 0 }, context.systemTag, context.terrainTag, context.passage].filter(excludeUndefined)];
  }

  return [
    getPriorityTileWithContext(mapToTile(priority[0]), context),
    [priorities[highestPriority(priority)] || priorities[5], ...priority.map(mapToTile)],
  ];
};

const tileLayersWithGrounds = (
  priorityOverPlayer: LayerWithOnlyMetaData[] | undefined,
  priority: LayerWithOnlyMetaData[] | undefined,
  ground: LayerWithOnlyMetaData[],
  context: Context,
  mapToTile: (layer: LayerWithOnlyMetaData) => TileMetaData,
) => {
  const { priorities } = context;

  if (priorityOverPlayer && priorityOverPlayer.length > 0) {
    if (priority && priority.length > 0) {
      return [
        getGroundTile(ground, context, mapToTile),
        [priorities[1], ...priorityOverPlayer.map(mapToTile)],
        [priorities[highestPriority(priority)] || priorities[5], ...priority.map(mapToTile)],
      ];
    }

    return [
      ground.slice(0, -1).map(mapToTile),
      getGroundTile(ground.slice(-1), context, mapToTile),
      [priorities[1], ...priorityOverPlayer.map(mapToTile)],
    ];
  }

  return [
    ground.slice(0, -1).map(mapToTile),
    getGroundTile(ground.slice(-1), context, mapToTile),
    priority && priority.length > 0 ? [priorities[highestPriority(priority)] || priorities[5], ...priority.map(mapToTile)] : [],
  ];
};

const getGroundTile = (ground: LayerWithOnlyMetaData[], context: Context, mapToTile: (layer: LayerWithOnlyMetaData) => TileMetaData) =>
  [...ground.map(mapToTile), context.systemTag, context.terrainTag, context.passage].filter(excludeUndefined);

const getPriorityTileWithContext = (tile: TileMetaData, context: Context) =>
  [tile, context.systemTag, context.terrainTag, context.passage].filter(excludeUndefined);

const toTileByIndex = (tileIndex: number) => (layer: LayerWithOnlyMetaData) => layer.layer[tileIndex];
const filterOutEmptyArrays = <T>({ length }: T[]) => length !== 0;
const mapToTileId = (cache: LayerTileCache) => (layer: LayerTile[]) => resolveNDSpaceId(cache, layer);
const excludeUndefined = <T>(v: T): v is Exclude<T, undefined> => v as boolean;
