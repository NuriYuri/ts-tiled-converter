import { TiledXMLMap, TiledXMLMapTileset } from './tiledXML/objects';

export const throwIfError = <T>(e: T | Error): T => {
  if (e instanceof Error) throw e;
  return e;
};

export const toError = (error: unknown) => (error instanceof Error ? error : new Error(`Invalid Error type: ${error}`));

export const filterTileset = (entity: TiledXMLMap['map'][number]): entity is TiledXMLMapTileset => 'tileset' in entity;
