export type StudioMap = {
  sha1: string;
};

export type TileMetaData = {
  /** Global ID without flip data */
  globalId: number;
  /** Flip data on a 4bit number */
  transformId: number;
};

export type LayerWithMetaData = {
  z: number;
  name: string;
  layer: (TileMetaData | null)[];
};
