import { unzipSync } from 'zlib';
import { TiledXMLData, TiledXMLLayer, getXMLProperties } from './tiledXML/objects';
import type { TileMetaData } from './types';

export const layerToTiles = (layer: TiledXMLLayer, cache: Map<number, TileMetaData | null>) => {
  cache.set(0, null);
  const data = decodeLayer(layer);
  if (data instanceof Error) return data;

  return data.map((v) => {
    const tileData = cache.get(v);
    if (tileData !== undefined) return tileData;

    const newTileData: TileMetaData = {
      globalId: v & 0x0fffffff,
      transformId: (v >> 28) & 0xf,
    };
    cache.set(v, newTileData);
    return newTileData;
  });
};

const decodeLayer = ({ layer }: TiledXMLLayer) => {
  const data = layer.find((v): v is TiledXMLData => 'data' in v);
  if (!data) return new Error('Failed to find data in layer');
  if (!data.data[0] || !('rawData' in data.data[0])) return new Error('Failed to find content in data layer');

  const { encoding, compression } = getXMLProperties(data);
  if (encoding === 'csv') return decodeCSVLayer(data);
  if (encoding !== 'base64') return new Error('Unsupported layer data encoding');

  if (compression === 'gzip' || compression === 'zlib') return decodeCompressedLayer(data);
  if (compression !== 'zstd') return decodeBuffer(Buffer.from(data.data[0].rawData, 'base64'));

  return new Error('Unsupported layer data compression');
};

const decodeCSVLayer = ({ data }: TiledXMLData) => data[0].rawData.split(',').map(Number);
const decodeCompressedLayer = ({ data }: TiledXMLData) => decodeBuffer(unzipSync(Buffer.from(data[0].rawData, 'base64')));

const decodeBuffer = (buffer: Buffer) => {
  const dwordLength = Math.floor(buffer.length / 4);
  const returnArray = Array<number>(dwordLength);
  for (let i = 0; i < dwordLength; i++) returnArray[i] = buffer.readUint32LE(i * 4);
  return returnArray;
};
