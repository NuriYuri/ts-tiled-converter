export type StudioMap = {
  sha1: string;
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
};

export type TileCommandCollection = {
  passages: { passage: number }[];
  systemTags: { systemTag: number }[];
  priorities: { priority: number }[];
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
