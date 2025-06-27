import fs from 'fs';
import crypto from 'crypto';
import { decodeXML } from '../tiledXML/decodeXML';
import type { TiledXMLMap } from '../tiledXML/objects';

export const readMap = (path: string) => {
  try {
    const fileData = fs.readFileSync(path);
    const map = decodeXML(fileData)[0] as TiledXMLMap;
    return {
      map,
      sha1: crypto.createHash('sha1').update(fileData).digest('hex'),
    };
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
