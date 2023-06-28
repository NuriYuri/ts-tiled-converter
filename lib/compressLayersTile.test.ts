import { compressLayersTile } from './compressLayersTile';
import { initNDSpace } from './ndSpace';
import type { LayerWithMetaData, LayersWithTileCommandCollection, TileCommand, TileMetaData } from './types';

const tiles: TileMetaData[] = [
  { globalId: 0, transformId: 0 },
  { globalId: 1, transformId: 0 },
  { globalId: 2, transformId: 0 },
  { globalId: 3, transformId: 0 },
  { globalId: 4, transformId: 0 },
  { globalId: 5, transformId: 0 },
];

const priorities = [0, 1, 2, 3, 4, 5].map((priority) => ({ priority }));
const terrainTags = [{ terrainTag: 1 }];

describe('compressLayersTile', () => {
  describe('compressTilesWithNoZ', () => {
    it('works as expected with 3 tiles', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 0, name: '', layer: [tiles[2]] },
            { z: 0, name: '', layer: [tiles[3]] },
            { z: 0, name: '', layer: [tiles[4]] },
            { z: 0, name: '', layer: [tiles[5]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], tiles[2], tiles[3]],
        [tiles[4]],
        [tiles[5], { systemTag: 384 }, { passage: 15 }],
      ]);
    });

    it('works as expected with 2 tiles', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([[tiles[0]], [tiles[1], { systemTag: 384 }, { passage: 15 }]]);
    });

    it('works as expected with 1 tile', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0]);
      expect(cache.itemsOrderedByIds).toEqual([[tiles[0], { systemTag: 384 }, { passage: 15 }]]);
    });

    it('ignores bridge tiles', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 0, name: '', layer: [tiles[2]] },
            { z: 0, name: '', layer: [tiles[3]] },
            { z: 0, name: '', layer: [tiles[4]] },
            { z: 0, name: '', layer: [tiles[5]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [384],
            systemTagsBridge2: [384],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([[tiles[0], tiles[1], tiles[2], tiles[3]], [tiles[4]], [tiles[5], { passage: 15 }]]);
    });

    it('works as expected with 3 tiles (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 0, name: '', layer: [tiles[2]] },
            { z: 0, name: '', layer: [tiles[3]] },
            { z: 0, name: '', layer: [tiles[4]] },
            { z: 0, name: '', layer: [tiles[5]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([[tiles[0], tiles[1], tiles[2], tiles[3]], [tiles[4]], [tiles[5], { passage: 15 }]]);
    });

    it('works as expected with 2 tiles (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([[tiles[0]], [tiles[1], { passage: 15 }]]);
    });

    it('works as expected with 1 tile (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 1, name: '', layer: [null] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [1],
          },
          cache,
        ),
      ).toEqual([0]);
      expect(cache.itemsOrderedByIds).toEqual([[tiles[0], { terrainTag: 1 }, { passage: 15 }]]);
    });
  });

  describe('compressTilesWithBridge', () => {
    it('works as expected with 1 bridge tile (bridge1)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 1, name: '', layer: [tiles[2]] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 385 }, { systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [385],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], { systemTag: 384 }, { passage: 15 }],
        [priorities[3], tiles[2], { systemTag: 385 }],
      ]);
    });

    it('works as expected with 1 bridge tile (bridge2)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 5, name: '', layer: [tiles[2]] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 385 }, { systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [385],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], { systemTag: 384 }, { passage: 15 }],
        [priorities[5], tiles[2], { systemTag: 385 }],
      ]);
    });

    it('works as expected with 2 bridge tiles', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 3, name: '', layer: [tiles[2]] },
            { z: 5, name: '', layer: [tiles[3]] },
          ],
          {
            commands: {
              passages: [{ passage: 15 }],
              systemTags: [{ systemTag: 385 }, { systemTag: 384 }, { systemTag: 386 }],
              priorities,
              terrainTags,
            },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [386],
            systemTagsBridge2: [385],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], { systemTag: 384 }, { passage: 15 }],
        [priorities[3], tiles[2], { systemTag: 386 }],
        [priorities[5], tiles[3], { systemTag: 385 }],
      ]);
    });

    it('works as expected if no ground tiles were added', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 3, name: '', layer: [tiles[2]] },
            { z: 5, name: '', layer: [tiles[3]] },
          ],
          {
            commands: {
              passages: [{ passage: 15 }],
              systemTags: [{ systemTag: 385 }, { systemTag: 384 }, { systemTag: 386 }],
              priorities,
              terrainTags,
            },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [386],
            systemTagsBridge2: [385],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[2], { systemTag: 384 }, { passage: 15 }],
        [priorities[3], tiles[2], { systemTag: 386 }],
        [priorities[5], tiles[3], { systemTag: 385 }],
      ]);
    });

    it('works as expected if no ground tiles were added and bridge1 is not defined', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [{ z: 5, name: '', layer: [tiles[3]] }],
          {
            commands: {
              passages: [{ passage: 15 }],
              systemTags: [{ systemTag: 385 }, { systemTag: 384 }, { systemTag: 386 }],
              priorities,
              terrainTags,
            },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [385],
            terrainTags: [1],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[3], { systemTag: 384 }, { terrainTag: 1 }, { passage: 15 }],
        [priorities[5], tiles[3], { systemTag: 385 }],
      ]);
    });

    it('works as expected with 1 bridge tile (bridge1) (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 1, name: '', layer: [tiles[2]] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 385 }, { systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [385],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], { passage: 15 }],
        [priorities[3], tiles[2], { systemTag: 385 }],
      ]);
    });

    it('works as expected with 1 bridge tile (bridge2) (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 5, name: '', layer: [tiles[2]] },
            { z: 2, name: '', layer: [null] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 385 }, { systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [385],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], { passage: 15 }],
        [priorities[5], tiles[2], { systemTag: 385 }],
      ]);
    });

    it('works as expected with 2 bridge tiles (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 3, name: '', layer: [tiles[2]] },
            { z: 5, name: '', layer: [tiles[3]] },
          ],
          {
            commands: {
              passages: [{ passage: 15 }],
              systemTags: [{ systemTag: 385 }, { systemTag: 384 }, { systemTag: 386 }],
              priorities,
              terrainTags,
            },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [386],
            systemTagsBridge2: [385],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1], { passage: 15 }],
        [priorities[3], tiles[2], { systemTag: 386 }],
        [priorities[5], tiles[3], { systemTag: 385 }],
      ]);
    });

    it('works as expected if no ground tiles were added (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 3, name: '', layer: [tiles[2]] },
            { z: 5, name: '', layer: [tiles[3]] },
          ],
          {
            commands: {
              passages: [{ passage: 15 }],
              systemTags: [{ systemTag: 385 }, { systemTag: 384 }, { systemTag: 386 }],
              priorities,
              terrainTags,
            },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [386],
            systemTagsBridge2: [385],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[2], { passage: 15 }],
        [priorities[3], tiles[2], { systemTag: 386 }],
        [priorities[5], tiles[3], { systemTag: 385 }],
      ]);
    });

    it('works as expected if no ground tiles were added and bridge1 is not defined (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [{ z: 5, name: '', layer: [tiles[3]] }],
          {
            commands: {
              passages: [{ passage: 15 }],
              systemTags: [{ systemTag: 385 }, { systemTag: 384 }, { systemTag: 386 }],
              priorities,
              terrainTags,
            },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [385],
            terrainTags: [1],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[3], { terrainTag: 1 }, { passage: 15 }],
        [priorities[5], tiles[3], { systemTag: 385 }],
      ]);
    });
  });

  describe('compressTiles', () => {
    it('puts last ground on layer 2, combines priority tags and use highest priority', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 0, name: '', layer: [tiles[2]] },
            { z: 1, name: '', layer: [tiles[3]] },
            { z: 4, name: '', layer: [tiles[4]] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1]],
        [tiles[2], { systemTag: 384 }, { passage: 15 }],
        [priorities[4], tiles[3], tiles[4]],
      ]);
    });

    it('works with only one ground, combines priority tags and use highest priority', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 1, name: '', layer: [tiles[3]] },
            { z: 4, name: '', layer: [tiles[4]] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], { systemTag: 384 }, { passage: 15 }],
        [priorities[4], tiles[3], tiles[4]],
      ]);
    });

    it('works with no ground, combines priority tags and prevents bullshit priority', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 1, name: '', layer: [tiles[3]] },
            { z: 6, name: '', layer: [tiles[4]] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [{ systemTag: 384 }], priorities, terrainTags },
            passages: [15],
            systemTags: [384],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [1],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[3], { systemTag: 384 }, { terrainTag: 1 }, { passage: 15 }],
        [priorities[5], tiles[3], tiles[4]],
      ]);
    });

    it('puts last ground on layer 2, combines priority tags and use highest priority (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 0, name: '', layer: [tiles[1]] },
            { z: 0, name: '', layer: [tiles[2]] },
            { z: 1, name: '', layer: [tiles[3]] },
            { z: 4, name: '', layer: [tiles[4]] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1, 2]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], tiles[1]],
        [tiles[2], { passage: 15 }],
        [priorities[4], tiles[3], tiles[4]],
      ]);
    });

    it('works with only one ground, combines priority tags and use highest priority (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 0, name: '', layer: [tiles[0]] },
            { z: 1, name: '', layer: [tiles[3]] },
            { z: 4, name: '', layer: [tiles[4]] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [0],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[0], { passage: 15 }],
        [priorities[4], tiles[3], tiles[4]],
      ]);
    });

    it('works with no ground, combines priority tags and prevents bullshit priority (no system tag)', () => {
      const cache = initNDSpace<TileMetaData | TileCommand, 0>(0);
      expect(
        compressLayersTile(
          0,
          [
            { z: 1, name: '', layer: [tiles[3]] },
            { z: 6, name: '', layer: [tiles[4]] },
          ],
          {
            commands: { passages: [{ passage: 15 }], systemTags: [], priorities, terrainTags },
            passages: [15],
            systemTags: [0],
            systemTagsBridge1: [0],
            systemTagsBridge2: [0],
            terrainTags: [1],
          },
          cache,
        ),
      ).toEqual([0, 1]);
      expect(cache.itemsOrderedByIds).toEqual([
        [tiles[3], { terrainTag: 1 }, { passage: 15 }],
        [priorities[5], tiles[3], tiles[4]],
      ]);
    });
  });
});
