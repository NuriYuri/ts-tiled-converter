import uniq from 'lodash.uniq';
import { LayerSplittedFromSpecialLayers, LayersWithTileCommandCollection } from './types';

export const buildLayerWithTileCommandCollection = (splittedLayers: LayerSplittedFromSpecialLayers): LayersWithTileCommandCollection => {
  const passages = splittedLayers.specialLayers.find(({ name }) => name === 'passages')?.layer || [];
  const systemTags = splittedLayers.specialLayers.find(({ name }) => name === 'systemtags')?.layer || [];
  const systemTagsBridge1 = splittedLayers.specialLayers.find(({ name }) => name === 'systemtags_bridge1')?.layer || [];
  const systemTagsBridge2 = splittedLayers.specialLayers.find(({ name }) => name === 'systemtags_bridge2')?.layer || [];
  const terrainTags = splittedLayers.specialLayers.find(({ name }) => name === 'terrain_tag')?.layer || [];
  const priorities = [0, 1, 2, 3, 4, 5].map((priority) => ({ priority }));

  return {
    commands: {
      passages: uniq(passages).map((passage) => ({ passage })),
      systemTags: uniq(systemTags.concat(systemTagsBridge1).concat(systemTagsBridge2)).map((systemTag) => ({ systemTag })),
      terrainTags: uniq(terrainTags).map((terrainTag) => ({ terrainTag })),
      priorities,
    },
    passages,
    systemTags,
    systemTagsBridge1,
    systemTagsBridge2,
    terrainTags,
  };
};
