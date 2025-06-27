import fs from 'fs';
import { TiledXMLImage, TiledXMLMap, getXMLProperties } from './tiledXML/objects';
import { decodeXML } from './tiledXML/decodeXML';
import { filterTileset, throwIfError } from './util';
import { basename, dirname } from 'path';
import { readTileset } from './reader/readTileset';

export const listResources = (path: string, knownTilesetFilenames: string[]) => {
  try {
    const fileData = fs.readFileSync(path);
    const map = decodeXML(fileData)[0] as TiledXMLMap;
    const tilesetSources = map.map
      .filter(filterTileset)
      .filter((tileset) => !knownTilesetFilenames.includes(basename(getXMLProperties(tileset).source || '')))
      .map((tileset) => getXMLProperties(tileset).source);
    const mapDirName = dirname(path);
    const assetSources = tilesetSources.flatMap((src) => {
      const tilesetPath = `${mapDirName}/${src}`;
      const tileset = throwIfError(readTileset(tilesetPath));
      const tilesetDirName = dirname(tilesetPath);
      return tileset.tileset
        .filter((i): i is TiledXMLImage => 'image' in i)
        .map((i) => getXMLProperties(i).source)
        .map((i) => ({
          inTileset: i,
          pathIncludingMapDirname: `${tilesetDirName}/${i}`,
        }));
    });

    return { tilesetSources, assetSources, mapDirName };
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
