import { TiledXMLMap, getXMLProperties } from './tiledXML/objects';

export const assertMapValidity = (map: TiledXMLMap): Error | boolean => {
  if (getXMLProperties(map).infinite !== 0) return new Error('Infinite maps are not supported.');

  return true;
};
