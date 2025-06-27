import { readMap } from './readMap';

describe('mapReader', () => {
  it('reads map', () => {
    expect(readMap('lib/mockData/Blank map.tmx')).toEqual({
      map: {
        ':@': {
          compressionLevel: 0,
          height: 32,
          infinite: 0,
          nextLayerId: 183,
          nextObjectId: 1,
          orientation: 'orthogonal',
          renderOrder: 'right-down',
          tileHeight: 32,
          tileWidth: 32,
          tiledVersion: '1.4.3',
          version: '1.4',
          width: 32,
        },
        map: [
          {
            ':@': {
              firstGlobalId: 1,
              source: '../Tilesets/Atori_borders.tsx',
            },
            tileset: [],
          },
          {
            ':@': {
              firstGlobalId: 361,
              source: '../Tilesets/Atori_Urban.tsx',
            },
            tileset: [],
          },
          {
            ':@': {
              firstGlobalId: 9577,
              source: '../Tilesets/Atori_systemtags.tsx',
            },
            tileset: [],
          },
          {
            ':@': {
              firstGlobalId: 9705,
              source: '../Tilesets/Atori_Nature.tsx',
            },
            tileset: [],
          },
          {
            ':@': {
              firstGlobalId: 15664,
              source: '../Tilesets/Atori_passages.tsx',
            },
            tileset: [],
          },
          {
            ':@': {
              firstGlobalId: 15680,
              source: '../Tilesets/Atori_Mounts.tsx',
            },
            tileset: [],
          },
          {
            ':@': {
              height: 32,
              id: 1,
              name: 'Borders',
              width: 32,
            },
            layer: [
              {
                ':@': {
                  encoding: 'csv',
                },
                data: [
                  {
                    rawData: 'someCSVDATA(UNPARSED)',
                  },
                ],
              },
            ],
          },
        ],
      },
      sha1: '66c05bdd7c72b80f00661780981217c615d5ebae',
    });
  });
});
