import { TiledXMLMap, getXMLProperties } from '../tiledXML/objects';
import { filterTileset } from '../util';

export const assertTilesetValidity = ({ map }: TiledXMLMap): Error | boolean => {
  const invalidTilesets = map.filter(filterTileset).filter((tileset) => !getXMLProperties(tileset).source || tileset.tileset.length !== 0);
  if (invalidTilesets.length > 0) return new Error('Embedded tilesets are not supported.');

  return true;
};
