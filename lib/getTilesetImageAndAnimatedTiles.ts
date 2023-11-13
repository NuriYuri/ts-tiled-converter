import { dirname } from 'path';
import { readTileset } from './readTileset';
import { TiledXMLAnimation, TiledXMLImage, TiledXMLTile, getXMLProperties } from './tiledXML/objects';
import { throwIfError } from './util';

export const getTilesetImageAndAnimatedTiles = (path: string) => {
  try {
    const tileset = throwIfError(readTileset(path));
    const tilesetImage = tileset.tileset.filter((i): i is TiledXMLImage => 'image' in i)[0];
    if (!tilesetImage) throw new Error('Tileset without image');

    const tilesetAnimatedTiles = tileset.tileset.filter((i): i is TiledXMLTile => 'tile' in i).filter((i) => i.tile.some((j) => 'animation' in j));
    const animatedTiles = tilesetAnimatedTiles.map((tile) => {
      const animation = tile.tile.find((i): i is TiledXMLAnimation => 'animation' in i)!;
      return {
        tileId: getXMLProperties(tile).id,
        frames: animation.animation.map(getXMLProperties),
      };
    });

    const tilesetDirName = dirname(path);
    const { source, trans } = getXMLProperties(tilesetImage);
    return {
      assetSource: {
        inTileset: source,
        pathIncludingMapDirname: `${tilesetDirName}/${source}`,
        transparency: trans,
      },
      animatedTiles,
    };
  } catch (error) {
    if (error instanceof Error) return error;
    return new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
