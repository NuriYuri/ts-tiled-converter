/**
 * Constant holding the list of attributes that should be parsed as number
 */
export const XML_NUMERIC_ATTRIBUTES = [
  'compressionlevel',
  'width',
  'height',
  'x',
  'y',
  'tilewidth',
  'tileheight',
  'infinite',
  'nextlayerid',
  'nextobjectid',
  'firstgid',
  'id',
  'offsetx',
  'offsety',
  'parallaxx',
  'parallaxy',
  'hexsidelength',
];
/**
 * Constant holding the translation from XML attribute to JSON attribute name
 */
export const XML_TO_JSON_ATTRIBUTES: Record<string, string> = {
  tilewidth: 'tileWidth',
  tileheight: 'tileHeight',
  tiledversion: 'tiledVersion',
  renderorder: 'renderOrder',
  compressionlevel: 'compressionLevel',
  hexsidelength: 'hexSideLength',
  staggeraxis: 'staggerAxis',
  staggerindex: 'staggerIndex',
  parallaxoriginx: 'parallaxOriginX',
  parallaxoriginy: 'parallaxOriginY',
  nextlayerid: 'nextLayerId',
  nextobjectid: 'nextObjectId',
  propertytype: 'propertyType',
  firstgid: 'firstGlobalId',
  tintcolor: 'tintColor',
  offsetx: 'offsetX',
  offsety: 'offsetY',
  parallaxx: 'parallaxX',
  parallaxy: 'parallaxY',
  draworder: 'drawOrder',
  repeatx: 'repeatX',
  repeaty: 'repeatY',
};

export type TiledXMLGroupProperty = {
  id: number;
  name: string;
  class: string;
  offsetX?: number;
  offsetY?: number;
  parallaxX?: number;
  parallaxY?: number;
  opacity?: number;
  visible?: 0 | 1;
  tintColor?: string;
};

export type TiledXMLImageProperty = {
  format: 'png' | 'gif' | 'jpg' | 'bmp';
  source: string;
  trans?: string;
  width?: number;
  height?: number;
};

export type TiledXMLImageLayerProperty = {
  id: number;
  name: string;
  class: string;
  offsetX: number;
  offsetY: number;
  parallaxX: number;
  parallaxY: number;
  opacity?: number;
  visible?: 0 | 1;
  tintColor?: string;
  repeatX?: boolean;
  repeatY?: boolean;
};

export type TiledXMLObjectProperty = {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  gid?: number;
  visible: 0 | 1;
  template?: string;
};

export type TiledXMLObjectGroupProperty = {
  id: number;
  name: string;
  class: string;
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  opacity?: number;
  visible?: 0 | 1;
  tintColor?: string;
  offsetX?: number;
  offsetY?: number;
  parallaxX?: number;
  parallaxY?: number;
  drawOrder: 'index' | 'topdown';
};

export type TiledXMLDataProperty = {
  encoding?: 'base64' | 'csv';
  compression?: 'gzip' | 'zlib' | 'zstd';
};

export type TiledXMLLayerProperty = {
  id: number;
  name: string;
  class: string;
  x?: number;
  y?: number;
  width: number;
  height: number;
  opacity?: number;
  visible?: 0 | 1;
  tintColor?: string;
  offsetX?: number;
  offsetY?: number;
  parallaxX?: number;
  parallaxY?: number;
};

export type TiledXMLPropertyProperty = {
  name: string;
  type: 'string' | 'int' | 'float' | 'bool' | 'color' | 'file' | 'object' | 'class';
  propertyType?: string;
  value: string;
};

export type TiledXMLMapTilesetProperty = {
  firstGlobalId: number;
  source: string;
};

export type TiledXMLMapProperty = {
  version: string;
  tiledVersion: string;
  orientation: 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
  renderOrder: 'right-down' | 'right-up' | 'left-down' | 'left-up';
  compressionLevel: number;
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  hexSideLength?: number;
  staggerAxis?: 'x' | 'y';
  staggerIndex?: 'even' | 'odd';
  parallaxOriginX?: number;
  parallaxOriginY?: number;
  nextLayerId: number;
  nextObjectId: number;
  infinite: 0 | 1;
};
