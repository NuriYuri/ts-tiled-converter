import type { TileMetaData } from './types';
import { initNDSpace, resolveNDSpaceId } from './ndSpace';

describe('ndSpace', () => {
  let tiles: TileMetaData[] = [
    { globalId: 0, transformId: 1 },
    { globalId: 1, transformId: 0 },
    { globalId: 2, transformId: 0 },
    { globalId: 3, transformId: 0 },
    { globalId: 0, transformId: 0 }, // This on is different from first one because it's rotated differently
  ];

  it('resolve ids in a stable manner', () => {
    const cache = initNDSpace<TileMetaData, 0>(0);
    // First initialization
    expect(resolveNDSpaceId(cache, [tiles[0]])).toEqual(0);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[2]])).toEqual(1);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[1]])).toEqual(2);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[2], tiles[3]])).toEqual(3);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[2], tiles[3], tiles[4]])).toEqual(4);
    expect(resolveNDSpaceId(cache, [tiles[4]])).toEqual(5);
    // Similar instances
    expect(resolveNDSpaceId(cache, [tiles[0]])).toEqual(0);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[2]])).toEqual(1);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[1]])).toEqual(2);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[2], tiles[3]])).toEqual(3);
    expect(resolveNDSpaceId(cache, [tiles[0], tiles[2], tiles[3], tiles[4]])).toEqual(4);
    expect(resolveNDSpaceId(cache, [tiles[4]])).toEqual(5);
    // Test itemsOrderedByIds
    expect(cache.itemsOrderedByIds).toEqual([
      [tiles[0]],
      [tiles[0], tiles[2]],
      [tiles[0], tiles[1]],
      [tiles[0], tiles[2], tiles[3]],
      [tiles[0], tiles[2], tiles[3], tiles[4]],
      [tiles[4]],
    ]);
  });
});
