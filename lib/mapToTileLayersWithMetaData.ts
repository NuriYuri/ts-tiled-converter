import { layerToTiles } from './layerToTiles';
import { TiledXMLGroup, TiledXMLLayer, TiledXMLMap, getXMLProperties } from './tiledXML/objects';
import type { LayerWithMetaData, TileMetaData } from './types';
import { throwIfError, toError } from './util';

let cache: Map<number, TileMetaData | null>;

export const mapToTileLayersWithMetaData = ({ map }: TiledXMLMap): LayerWithMetaData[] | Error => {
  try {
    cache = new Map<number, TileMetaData | null>();
    return filterAndFlatten(map, 0).map(mapLayerToTileLayers);
  } catch (error) {
    return toError(error);
  }
};

type AnyMapOrGroupChild = (TiledXMLMap['map'] | TiledXMLGroup['group'])[number];
type LayerWithZIndex = { z: number; name: string; entity: TiledXMLLayer };

const filterLayerOrGroup = (entity: AnyMapOrGroupChild): entity is TiledXMLLayer | TiledXMLGroup => 'layer' in entity || 'group' in entity;

const filterAndFlatten = (e: AnyMapOrGroupChild[], groupZIndex: number) => e.filter(filterLayerOrGroup).flatMap(mapGroupOrLayerToLayers(groupZIndex));

const flattenGroup = (group: TiledXMLGroup, groupZIndex: number): LayerWithZIndex[] => {
  const { name } = getXMLProperties(group);
  return filterAndFlatten(group.group, name.startsWith('z=') ? Number(name.split('=')[1]) - 1 : groupZIndex);
};

const mapGroupOrLayerToLayers = (groupZIndex: number) => (entity: TiledXMLLayer | TiledXMLGroup) => {
  if ('group' in entity) return flattenGroup(entity, groupZIndex);

  const { name } = getXMLProperties(entity);
  const regMatch = name.match(/([1-6])$/);
  return { z: regMatch ? Number(regMatch[0]) - 1 : groupZIndex, name, entity };
};

const mapLayerToTileLayers = ({ z, name, entity }: LayerWithZIndex) => ({ z, name, layer: throwIfError(layerToTiles(entity, cache)) });
