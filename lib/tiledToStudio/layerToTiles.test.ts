import { readMap } from '../reader/readMap';
import type { TileMetaData } from '../types';
import { layerToTiles } from './layerToTiles';
import { TiledXMLLayer, TiledXMLMap } from '../tiledXML/objects';

const maps = (() => {
  const base64Gzip = readMap('lib/mockData/base64Gzip.tmx');
  const base64Uncompressed = readMap('lib/mockData/base64Uncompressed.tmx');
  const base64Zlib = readMap('lib/mockData/base64Zlib.tmx');
  const base64ZStd = readMap('lib/mockData/base64ZStd.tmx');
  const csv = readMap('lib/mockData/csv.tmx');
  const tsv = readMap('lib/mockData/tsv.tmx');
  if (
    base64Gzip instanceof Error ||
    base64Uncompressed instanceof Error ||
    base64Zlib instanceof Error ||
    base64ZStd instanceof Error ||
    csv instanceof Error ||
    tsv instanceof Error
  )
    throw new Error();
  return { base64Gzip, base64Uncompressed, base64ZStd, base64Zlib, csv, tsv };
})();
const getLayer = ({ map }: TiledXMLMap): TiledXMLLayer => {
  const layer = map.find((v): v is TiledXMLLayer => 'layer' in v);
  if (!layer) throw new Error();
  return layer;
};
const cache = new Map<number, TileMetaData | null>();

const expectation = [
  { globalId: 1, transformId: 0 },
  { globalId: 7, transformId: 0 },
  { globalId: 62, transformId: 0 },
  null,
  { globalId: 23, transformId: 0 },
  { globalId: 61, transformId: 0 },
  { globalId: 61, transformId: 0 },
  null,
  null,
  null,
  null,
  null,
  null,
  { globalId: 61, transformId: 0 },
  { globalId: 23, transformId: 0 },
  null,
  null,
  { globalId: 61, transformId: 0 },
  null,
  null,
  { globalId: 23, transformId: 0 },
  null,
  null,
  null,
  { globalId: 61, transformId: 0 },
];

describe('layerToTiles', () => {
  it('decodes a CSV map Properly', () => expect(layerToTiles(getLayer(maps.csv.map), cache)).toEqual(expectation));

  it('decodes a base64Uncompressed map Properly', () => expect(layerToTiles(getLayer(maps.base64Uncompressed.map), cache)).toEqual(expectation));

  it('decodes a base64Gzip map Properly', () => expect(layerToTiles(getLayer(maps.base64Gzip.map), cache)).toEqual(expectation));

  it('decodes a base64Zlib map Properly', () => expect(layerToTiles(getLayer(maps.base64Zlib.map), cache)).toEqual(expectation));

  it('decodes throws an error when trying to decode a base64ZStd map', () => {
    expect(layerToTiles(getLayer(maps.base64ZStd.map), cache)).toEqual(new Error('Unsupported layer data compression'));
  });

  it('decodes throws an error when trying to decode a TSV map', () => {
    expect(layerToTiles(getLayer(maps.tsv.map), cache)).toEqual(new Error('Unsupported layer data encoding'));
  });

  it('throws an error if the layer is mal-formatted', () => {
    expect(layerToTiles({ layer: [], ':@': getLayer(maps.csv.map)[':@'] }, cache)).toEqual(new Error('Failed to find data in layer'));
  });

  it('throws an error if the data is mal-formatted', () => {
    expect(layerToTiles({ layer: [{ data: [], ':@': {} }], ':@': getLayer(maps.csv.map)[':@'] }, cache)).toEqual(
      new Error('Failed to find content in data layer'),
    );
  });
});
