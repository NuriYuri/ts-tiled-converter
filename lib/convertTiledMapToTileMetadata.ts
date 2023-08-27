import { assertTilesetValidity } from './assertTilesetValidity';
import { buildLayerWithTileCommandCollection } from './buildLayerWithTileCommandCollection';
import { compressLayersTile } from './compressLayersTile';
import { mapToTileLayersWithMetaData } from './mapToTileLayersWithMetaData';
import { initNDSpace } from './ndSpace';
import { readMap } from './readMap';
import { splitSpecialAndRegularLayers } from './splitSpecialAndRegularLayers';
import { getXMLProperties } from './tiledXML/objects';
import type { PartialStudioMap, TileCommand, TileMetaData } from './types';
import { filterTileset, throwIfError, toError } from './util';

export const convertTiledMapToTileMetadata = (mapPath: string): PartialStudioMap | Error => {
  try {
    const mapData = throwIfError(readMap(mapPath));
    throwIfError(assertTilesetValidity(mapData.map));
    const layerWithMetadata = throwIfError(mapToTileLayersWithMetaData(mapData.map));
    const { length } = layerWithMetadata[0].layer;
    const { width, height } = getXMLProperties(mapData.map);
    if (length !== width * height) throw Error('Invalid map size');

    const split = throwIfError(splitSpecialAndRegularLayers(mapData.map, layerWithMetadata));
    const layerWithCommands = buildLayerWithTileCommandCollection(split);
    const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
    const layerData = Array.from({ length }, (_, tileIndex) => compressLayersTile(tileIndex, split.regularLayers, layerWithCommands, cache));

    return {
      sha1: mapData.sha1,
      tileMetadata: {
        width,
        height,
        tilesets: mapData.map.map.filter(filterTileset).map(getXMLProperties),
        tileByTileId: cache.itemsOrderedByIds,
        layerData,
      },
    };
  } catch (error) {
    return toError(error);
  }
};
