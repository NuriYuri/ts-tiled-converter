import { readMap } from './readMap';
import { throwIfError } from './util';
import { assertMapValidity } from './assertMapValidity';

describe('assertMapValidity', () => {
  it('returns an error if the map is infinite', () => {
    const map = throwIfError(readMap('lib/mockData/infiniteMap.tmx'));
    expect(assertMapValidity(map.map)).toEqual(new Error('Infinite maps are not supported.'));
  });

  it('returns true otherwise', () => {
    const map = throwIfError(readMap('lib/mockData/base64Gzip.tmx'));
    expect(assertMapValidity(map.map)).toEqual(true);
  });
});
