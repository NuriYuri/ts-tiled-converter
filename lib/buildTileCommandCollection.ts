import uniq from 'lodash.uniq';
import { LayerSplittedFromSpecialLayers, TileCommandCollection } from './types';

export const buildTileCommandCollection = (splittedLayers: LayerSplittedFromSpecialLayers): TileCommandCollection => {
  const priorities = uniq(splittedLayers.regularLayers.map(({ z }) => z)).map((priority) => ({ priority }));
  const passages = uniq(splittedLayers.specialLayers.find(({ name }) => name === 'passages')?.layer || []).map((passage) => ({ passage }));
  const systemTags = uniq(
    (splittedLayers.specialLayers.find(({ name }) => name === 'systemtags')?.layer || [])
      .concat(splittedLayers.specialLayers.find(({ name }) => name === 'systemtags_bridge1')?.layer || [])
      .concat(splittedLayers.specialLayers.find(({ name }) => name === 'systemtags_bridge2')?.layer || []),
  ).map((systemTag) => ({ systemTag }));

  return {
    priorities,
    passages,
    systemTags,
  };
};
