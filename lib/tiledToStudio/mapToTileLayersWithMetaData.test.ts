import { readMap } from '../reader/readMap';
import { mapToTileLayersWithMetaData } from './mapToTileLayersWithMetaData';

describe('mapToTileLayersWithMetaData', () => {
  it('maps data properly', () => {
    const map = readMap('lib/mockData/mapToTileLayersWithMetaData.tmx');
    if (map instanceof Error) throw map;

    expect(mapToTileLayersWithMetaData(map.map)).toMatchSnapshot();
  });
});
