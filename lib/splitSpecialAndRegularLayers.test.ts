import { mapToTileLayersWithMetaData } from './mapToTileLayersWithMetaData';
import { readMap } from './readMap';
import { splitSpecialAndRegularLayers } from './splitSpecialAndRegularLayers';

describe('splitSpecialAndRegularLayers', () => {
  it('maps data properly', () => {
    const map = readMap('lib/mockData/annoyingData.tmx');
    if (map instanceof Error) throw map;

    const layers = mapToTileLayersWithMetaData(map.map);
    if (layers instanceof Error) throw map;

    const result = splitSpecialAndRegularLayers(map.map, layers);
    if (result instanceof Error) throw result;

    expect(result.regularLayers).toHaveLength(75);
    expect(result.specialLayers).toMatchSnapshot();
  });
});
