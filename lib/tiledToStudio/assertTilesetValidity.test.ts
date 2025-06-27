import { readMap } from '../reader/readMap';
import { throwIfError } from '../util';
import { assertTilesetValidity } from './assertTilesetValidity';

describe('assertTilesetValidity', () => {
  it('returns an error if tilesets are invalid', () => {
    const map = throwIfError(readMap('lib/mockData/embeddedTileset.tmx'));
    expect(assertTilesetValidity(map.map)).toEqual(new Error('Embedded tilesets are not supported.'));
  });

  it('returns true otherwise', () => {
    const map = throwIfError(readMap('lib/mockData/base64Gzip.tmx'));
    expect(assertTilesetValidity(map.map)).toEqual(true);
  });
});
