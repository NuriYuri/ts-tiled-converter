import { TiledXMLMapTilesetProperty } from './tiledXML/properties';

export type PartialStudioMap = {
  sha1: string;
  tileMetadata: {
    width: number;
    height: number;
    tilesets: TiledXMLMapTilesetProperty[];
    tileByTileId: (TileMetaData | TileCommand)[][];
    layerData: number[][];
  };
};

export type TileMetaData = {
  /** Global ID without flip data */
  globalId: number;
  /** Flip data on a 4bit number */
  transformId: number;
};

export type LayersWithTileCommandCollection = {
  commands: TileCommandCollection;
  passages: number[];
  systemTags: number[];
  systemTagsBridge1: number[];
  systemTagsBridge2: number[];
  terrainTags: number[];
};

export type TileCommandCollection = {
  passages: { passage: number }[];
  systemTags: { systemTag: number }[];
  priorities: { priority: number }[];
  terrainTags: { terrainTag: number }[];
};

export type TileCommand = TileCommandCollection[keyof TileCommandCollection][number];

export type LayerWithMetaData = {
  z: number;
  name: string;
  layer: (TileMetaData | null)[];
};

export type SpecialLayer = {
  name: string;
  layer: number[];
};

export type LayerSplittedFromSpecialLayers = {
  regularLayers: LayerWithMetaData[];
  specialLayers: SpecialLayer[];
};
