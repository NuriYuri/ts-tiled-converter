import type {
  TiledXMLDataProperty,
  TiledXMLGroupProperty,
  TiledXMLImageLayerProperty,
  TiledXMLImageProperty,
  TiledXMLLayerProperty,
  TiledXMLMapProperty,
  TiledXMLMapTilesetProperty,
  TiledXMLObjectGroupProperty,
  TiledXMLObjectProperty,
  TiledXMLPropertyProperty,
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
