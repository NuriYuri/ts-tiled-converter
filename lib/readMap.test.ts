import { readMap } from './readMap';

describe('mapReader', () => {
  it('reads map', () => {
    expect(readMap('lib/mockData/Blank map.tmx')).toEqual({
      compressionLevel: 0,
      groups: [],
      height: 32,
      infinite: 0,
      layers: [
        {
          data: {
            encoding: 'csv',
            rawData: 'someCSVDATA(UNPARSED)',
          },
          height: 32,
          id: 1,
          name: 'Borders',
          width: 32,
        },
      ],
      nextLayerId: 183,
      nextObjectId: 1,
      orientation: 'orthogonal',
      renderorder: 'right-down',
      sha1: '66c05bdd7c72b80f00661780981217c615d5ebae',
      tileHeight: 32,
      tileWidth: 32,
      tiledversion: '1.4.3',
      tilesets: [
        {
          firstGlobalId: 1,
          source: '../Tilesets/Atori_borders.tsx',
        },
        {
          firstGlobalId: 361,
          source: '../Tilesets/Atori_Urban.tsx',
        },
        {
          firstGlobalId: 9577,
          source: '../Tilesets/Atori_systemtags.tsx',
        },
        {
          firstGlobalId: 9705,
          source: '../Tilesets/Atori_Nature.tsx',
        },
        {
          firstGlobalId: 15664,
          source: '../Tilesets/Atori_passages.tsx',
        },
        {
          firstGlobalId: 15680,
          source: '../Tilesets/Atori_Mounts.tsx',
        },
      ],
      version: '1.4',
      width: 32,
    });
  });
});
