import type {
  TiledXMLDataProperty,
  TiledXMLFrameProperty,
  TiledXMLGridProperty,
  TiledXMLGroupProperty,
  TiledXMLImageLayerProperty,
  TiledXMLImageProperty,
  TiledXMLLayerProperty,
  TiledXMLMapProperty,
  TiledXMLMapTilesetProperty,
  TiledXMLObjectGroupProperty,
  TiledXMLObjectProperty,
  TiledXMLPropertyProperty,
  TiledXMLTileOffsetProperty,
  TiledXMLTileProperty,
  TiledXMLTilesetProperty,
  TiledXMLTransformationsProperty,
  TiledXMLWangColorProperty,
  TiledXMLWangSetProperty,
  TiledXMLWangTileProperty,
} from './properties';

type XMLObject<Name extends string, Properties extends Record<string, unknown>, ChildrenObjects> = Record<Name, ChildrenObjects[]> & {
  ':@': Properties;
};
type XMLObjectWithoutChildren<Name extends string, Properties extends Record<string, unknown>> = Record<Name, []> & {
  ':@': Properties;
};

export const getXMLProperties = <Properties extends Record<string, unknown>>(object: { ':@': Properties }) => object[':@'];

export type TiledXMLProperties = { properties: XMLObject<'property', TiledXMLPropertyProperty, TiledXMLProperties> };
export type TiledXMLMapTileset = XMLObjectWithoutChildren<'tileset', TiledXMLMapTilesetProperty>;
export type TiledXMLData = XMLObject<'data', TiledXMLDataProperty, { rawData: string }>;
export type TiledXMLLayer = XMLObject<'layer', TiledXMLLayerProperty, TiledXMLProperties | TiledXMLData>;
export type TiledXMLObject = XMLObject<'object', TiledXMLObjectProperty, unknown>;
export type TiledXMLObjectGroup = XMLObject<'objectgroup', TiledXMLObjectGroupProperty, TiledXMLProperties | TiledXMLObject>;
export type TiledXMLImage = XMLObjectWithoutChildren<'image', TiledXMLImageProperty>;
export type TiledXMLImageLayer = XMLObject<'imagelayer', TiledXMLImageLayerProperty, TiledXMLProperties | TiledXMLImage>;
export type TiledXMLGroup = {
  group: (TiledXMLProperties | TiledXMLLayer | TiledXMLObjectGroup | TiledXMLImageLayer | TiledXMLGroup)[];
  ':@': TiledXMLGroupProperty;
};
export type TiledXMLMap = XMLObject<
  'map',
  TiledXMLMapProperty,
  TiledXMLProperties | TiledXMLMapTileset | TiledXMLLayer | TiledXMLObjectGroup | TiledXMLImageLayer | TiledXMLGroup
>;

export type TiledXMLFrame = XMLObjectWithoutChildren<'frame', TiledXMLFrameProperty>;
export type TiledXMLAnimation = XMLObject<'animation', {}, TiledXMLFrame>;
export type TiledXMLTile = XMLObject<'tile', TiledXMLTileProperty, TiledXMLProperties | TiledXMLImage | TiledXMLObjectGroup | TiledXMLAnimation>;
export type TiledXMLTileOffset = XMLObjectWithoutChildren<'tileoffset', TiledXMLTileOffsetProperty>;
export type TiledXMLGrid = XMLObjectWithoutChildren<'grid', TiledXMLGridProperty>;
export type TiledXMLWangTile = XMLObjectWithoutChildren<'wangtile', TiledXMLWangTileProperty>;
export type TiledXMLWangColor = XMLObject<'wangcolor', TiledXMLWangColorProperty, TiledXMLProperties>;
export type TiledXMLWangSet = XMLObject<'wangset', TiledXMLWangSetProperty, TiledXMLProperties | TiledXMLWangColor | TiledXMLWangTile>;
export type TiledXMLWangSets = XMLObject<'wangsets', {}, TiledXMLWangSet>;
export type TiledXMLTransformations = XMLObjectWithoutChildren<'transformations', TiledXMLTransformationsProperty>;
export type TiledXMLTileset = XMLObject<
  'tileset',
  TiledXMLTilesetProperty,
  TiledXMLImage | TiledXMLTileOffset | TiledXMLGrid | TiledXMLProperties | TiledXMLWangSets | TiledXMLTransformations | TiledXMLTile
>;
