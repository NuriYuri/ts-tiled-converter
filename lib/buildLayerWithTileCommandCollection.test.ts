import { mapToTileLayersWithMetaData } from './mapToTileLayersWithMetaData';
import { readMap } from './readMap';
import { splitSpecialAndRegularLayers } from './splitSpecialAndRegularLayers';
import { buildLayerWithTileCommandCollection } from './buildLayerWithTileCommandCollection';

describe('buildTileCommandCollection', () => {
  it('build tile command collection properly', () => {
    const map = readMap('lib/mockData/annoyingData.tmx');
    if (map instanceof Error) throw map;

    const layers = mapToTileLayersWithMetaData(map.map);
    if (layers instanceof Error) throw map;

    const splitted = splitSpecialAndRegularLayers(map.map, layers);
    if (splitted instanceof Error) throw splitted;

    expect(buildLayerWithTileCommandCollection(splitted)).toMatchSnapshot();
  });
});
