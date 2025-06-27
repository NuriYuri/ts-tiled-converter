# ts-tiled-converter

Library allowing to read and convert maps from tiled to a Pokémon Studio suitable format.

## Functions

### convertTiledMapToTileMetadata

Function that converts a `.tmx` map (from path) to a `PartialStudioMap`. This function checks for map validity, flattens the map to 3 layers (for RMXP compat) and returns all the instructions to build the tileset and the map.

Example:

```ts
const partialMap = convertTiledMapToTileMetadata('some_path_to_.tmx');
```

### listResources

Function listing all the resources from a map to ease copy from a source folder to a structured target folder.

Example:

```ts
const resourcesOrError = listResources('some_path_to_.tmx');
if (resourcesOrError instanceof Error) throw resourcesOrError;

const { tilesetSources, assetSources, mapDirName } = resourcesOrError;
```

The output properties are:

- `tilesetSources`: Array of string listing all the tilesets (tsx) included in the map.
- `assetSources`: Array of `{ inTileset: string, pathIncludingMapDirname: string }` describing each tileset asset paths used by the map.
- `mapDirName`: string providing the directory path to the `.tmx` file.

### getTilesetImageAndAnimatedTiles

Function that list all the assets and animated tiles from a `.tsx` file.

Example:

```ts
const tilesOrError = getTilesetImageAndAnimatedTiles('some_path_to_.tsx');
if (tilesOrError instanceof Error) return;

const { assetSource, animatedTiles } = tilesOrError;
```

The output properties are:

- `assetSource`: object describing the the location and information about the tileset image.
  - `inTileset`: path of the asset from tileset location.
  - `pathIncludingMapDirname`: path including the tileset dirname.
  - `transparency`: hex color for the transparency color of the tileset image.
- `animatedTiles`: Array of object describing animated tiles.
  - `tileId`: ID of the tile in the tileset
  - `frames`: Array of properties of [`<frame>`](https://doc.mapeditor.org/en/stable/reference/tmx-map-format/#tmx-frame)
    - `tileId`: ID of the tile in tileset for that frame
    - `duration`: number of milliseconds this frame is displayed
