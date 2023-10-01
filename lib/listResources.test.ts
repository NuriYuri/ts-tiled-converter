import { listResources } from './listResources';

describe('listResources', () => {
  it('list resources properly', () => {
    expect(listResources('lib/mockData/test_resources.tmx', [])).toEqual({
      assetSources: [
        {
          inTileset: 'prio_w.png',
          pathIncludingMapDirname: 'lib/mockData/../mockData/prio_w.png',
        },
      ],
      mapDirName: 'lib/mockData',
      tilesetSources: ['../mockData/Atori_systemtags.tsx'],
    });
  });

  it('list resources and ignore tileset from which we already know resources', () => {
    expect(listResources('lib/mockData/test_resources.tmx', ['Atori_systemtags.tsx'])).toEqual({
      assetSources: [],
      mapDirName: 'lib/mockData',
      tilesetSources: [],
    });
  });
});
