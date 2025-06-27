import { readTileset } from './readTileset';

describe('readTileset', () => {
  it('reads map', () => {
    expect(readTileset('lib/mockData/Atori_systemtags.tsx')).toEqual({
      ':@': {
        columns: 8,
        name: 'Atori_systemtags',
        tileCount: 128,
        tileHeight: 32,
        tileWidth: 32,
        tiledVersion: '1.3.0',
        version: '1.2',
      },
      tileset: [
        {
          ':@': {
            height: 512,
            source: 'prio_w.png',
            trans: 'f05ba1',
            width: 256,
          },
          image: [],
        },
      ],
    });
  });
});
