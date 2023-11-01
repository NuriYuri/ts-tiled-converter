import { getTilesetImageAndAnimatedTiles } from './getTilesetImageAndAnimatedTiles';

describe('getTilesetImageAndAnimatedTiles', () => {
  it('loads data even if tileset does not contain any animation', () => {
    expect(getTilesetImageAndAnimatedTiles('lib/mockData/Atori_systemtags.tsx')).toEqual({
      animatedTiles: [],
      assetSource: {
        inTileset: 'prio_w.png',
        pathIncludingMapDirname: 'lib/mockData/prio_w.png',
      },
    });
  });

  it('loads data even and animations properly', () => {
    expect(getTilesetImageAndAnimatedTiles('lib/mockData/Animated.tsx')).toEqual({
      animatedTiles: [
        {
          frames: [
            {
              duration: 100,
              tileId: 5091,
            },
            {
              duration: 100,
              tileId: 5092,
            },
            {
              duration: 100,
              tileId: 5192,
            },
            {
              duration: 100,
              tileId: 5193,
            },
          ],
          tileId: 5091,
        },
        {
          frames: [
            {
              duration: 100,
              tileId: 5093,
            },
            {
              duration: 100,
              tileId: 5094,
            },
            {
              duration: 100,
              tileId: 5194,
            },
            {
              duration: 100,
              tileId: 5195,
            },
          ],
          tileId: 5093,
        },
      ],
      assetSource: {
        inTileset: 'Nature.png',
        pathIncludingMapDirname: 'lib/mockData/Nature.png',
      },
    });
  });
});
