import { layerToTiles } from './layerToTiles';
import { TiledXMLGroup, TiledXMLLayer, TiledXMLMap, getXMLProperties } from './tiledXML/objects';
import { LayerWithMetaData, TileMetaData } from './types';

let cache: Map<number, TileMetaData | null>;

export const mapToTileLayersWithMetaData = ({ map }: TiledXMLMap): LayerWithMetaData[] | Error => {
  try {
    cache = new Map<number, TileMetaData | null>();
    return filterAndFlatten(map, 0).map(mapLayerToTileLayers);
  } catch (error) {
    return error instanceof Error ? error : new Error(`Invalid Error type: ${error}`);
  }
};

type AnyMapOrGroupChild = (TiledXMLMap['map'] | TiledXMLGroup['group'])[number];
type LayerWithGroupZIndex = { z: number; name: string; entity: TiledXMLLayer };

const filterLayerOrGroup = (entity: AnyMapOrGroupChild): entity is TiledXMLLayer | TiledXMLGroup => 'layer' in entity || 'group' in entity;

const filterAndFlatten = (e: AnyMapOrGroupChild[], groupZIndex: number) => e.filter(filterLayerOrGroup).flatMap(mapGroupOrLayerToLayers(groupZIndex));

const flattenGroup = (group: TiledXMLGroup, groupZIndex: number): LayerWithGroupZIndex[] => {
  const { name } = getXMLProperties(group);
  return filterAndFlatten(group.group, name.startsWith('z=') ? Number(name.split('=')[1]) - 1 : groupZIndex);
};

const mapGroupOrLayerToLayers = (groupZIndex: number) => (entity: TiledXMLLayer | TiledXMLGroup) => {
  if ('group' in entity) return flattenGroup(entity, groupZIndex);

  const { name } = getXMLProperties(entity);
  const regMatch = name.match(/([1-6])$/);
  return { z: regMatch ? Number(regMatch[0]) - 1 : groupZIndex, name, entity };
};

const mapLayerToTileLayers = ({ z, name, entity }: LayerWithGroupZIndex) => ({ z, name, layer: throwIfError(layerToTiles(entity, cache)) });

const throwIfError = <T>(e: T | Error): T => {
  if (e instanceof Error) throw e;
  return e;
};
