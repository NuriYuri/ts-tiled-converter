import { TiledXMLMap, TiledXMLMapTileset, getXMLProperties } from './tiledXML/objects';
import { LayerWithMetaData, TileMetaData } from './types';
import { throwIfError, toError } from './util';

export const splitSpecialAndRegularLayers = (map: TiledXMLMap, layers: LayerWithMetaData[]) => {
  try {
    return {
      regularLayers: layers.filter(filterRegularLayers),
      specialLayers: getSpecialLayerAsMetaLayer(map, layers),
    };
  } catch (error) {
    return toError(error);
  }
};

const SPECIAL_LAYER_TILESETS: Record<string, string | undefined> = {
  passages: 'passages.tsx',
  systemtags: 'systemtags.tsx',
  systemtags_bridge1: 'systemtags.tsx',
  systemtags_bridge2: 'systemtags.tsx',
  terrain_tag: 'terrain_tag.tsx',
};
const TILESET_GID_OFFSET: Record<string, number | undefined> = {
  'systemtags.tsx': -384, // 0 must be equal to 384: (gid+1) - (gid+offset) = (885) - (884-384) = 885 - 884 + 384 = 1 + 384 = 385
};

const findTilesetGID = (layer: LayerWithMetaData, tilesets: TiledXMLMapTileset[]) => {
  const tilesetName = SPECIAL_LAYER_TILESETS[layer.name];
  if (!tilesetName) return new Error(`Failed to find tileset name for special layer ${layer.name}`);

  const tileset = tilesets.find((tileset) => getXMLProperties(tileset).source.endsWith(tilesetName));
  if (!tileset) return new Error(`Failed to find tileset: ${tilesetName}`);

  return getXMLProperties(tileset).firstGlobalId + (TILESET_GID_OFFSET[tilesetName] || 0);
};

const filterTileset = (entity: TiledXMLMap['map'][number]): entity is TiledXMLMapTileset => 'tileset' in entity;
const filterSpecialLayers = (layer: LayerWithMetaData) => layer.name in SPECIAL_LAYER_TILESETS;
const filterRegularLayers = (layer: LayerWithMetaData) => !(layer.name in SPECIAL_LAYER_TILESETS);
const tilesToMetadata = (gid: number) => (tile: TileMetaData | null) => tile ? tile.globalId - gid : 0;
const mapSpecialLayerToMetadata = ({ name, layer }: LayerWithMetaData, gid: number) => ({ name, layer: layer.map(tilesToMetadata(gid)) });
const getSpecialLayerAsMetaLayer = ({ map }: TiledXMLMap, layers: LayerWithMetaData[]) => {
  const preSpecialLayers = layers.filter(filterSpecialLayers);
  const tilesets = map.filter(filterTileset);
  const specialLayerGID = preSpecialLayers.map((layer) => throwIfError(findTilesetGID(layer, tilesets)));
  return preSpecialLayers.map((layer, index) => mapSpecialLayerToMetadata(layer, specialLayerGID[index] || 0));
};
