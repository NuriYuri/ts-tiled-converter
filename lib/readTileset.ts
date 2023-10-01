import fs from 'fs';
import { decodeXML } from './tiledXML/decodeXML';
import type { TiledXMLTileset } from './tiledXML/objects';

export const readTileset = (path: string) => {
  try {
    const fileData = fs.readFileSync(path);
    return decodeXML(fileData)[0] as TiledXMLTileset;
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
