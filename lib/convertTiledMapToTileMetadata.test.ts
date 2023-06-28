import { convertTiledMapToTileMetadata } from './convertTiledMapToTileMetadata';
describe('convertTiledMapToTileMetadata', () => {
  it('works', () => {
    expect(convertTiledMapToTileMetadata('lib/mockData/annoyingData.tmx')).toMatchSnapshot();
  });
});
