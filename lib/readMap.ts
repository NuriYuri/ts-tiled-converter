import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import crypto from 'crypto';

const NUMERIC_ATTRIBUTES = [
  'compressionlevel',
  'width',
  'height',
  'tilewidth',
  'tileheight',
  'infinite',
  'nextlayerid',
  'nextobjectid',
  'firstgid',
  'id',
];

const ARRAY_TAGS = ['tilesets', 'groups', 'layers'];

const TAG_NAME_DICTIONARY = {
  tileset: 'tilesets',
  group: 'groups',
  layer: 'layers',
} as Record<string, string>;

const ATTRIBUTE_NAME_DICTIONARY = {
  tilewidth: 'tileWidth',
  tileheight: 'tileHeight',
  nextlayerid: 'nextLayerId',
  nextobjectid: 'nextObjectId',
  firstgid: 'firstGlobalId',
  compressionlevel: 'compressionLevel',
} as Record<string, string>;

export type TMXData = {
  tilesets: { firstGlobalId: number; source: string }[];
  groups: { id: number; name: string }[];
  layers: {
    id: number;
    name: string;
    width: number;
    height: number;
    data: {
      encoding: 'base64' | 'csv';
      compression?: 'gzip' | 'zlib' | 'zstd';
      rawData: string;
    };
  };
  version: string;
  tiledversion: string;
  orientation: 'orthogonal';
  renderorder: 'right-down';
  compressionLevel: number;
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  infinite: number;
  nextLayerId: number;
  nextObjectId: number;
  sha1: string;
};

export const readMap = (path: string) => {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      ignorePiTags: true,
      textNodeName: 'rawData',
      transformTagName: (name) => TAG_NAME_DICTIONARY[name] || name,
      transformAttributeName: (name) => ATTRIBUTE_NAME_DICTIONARY[name] || name,
      attributeValueProcessor: (attrName, value) => (NUMERIC_ATTRIBUTES.includes(attrName) ? Number(value) : undefined),
      isArray: (name) => ARRAY_TAGS.includes(name),
    });
    const fileData = fs.readFileSync(path);
    const result = parser.parse(fileData);
    return { groups: [], layers: [], tilesets: [], ...result.map, sha1: crypto.createHash('sha1').update(fileData).digest('hex') } as TMXData;
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
