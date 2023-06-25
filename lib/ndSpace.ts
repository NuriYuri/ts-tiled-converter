/*
 * This file defines a data structure helping us to map collection of tiles to integer IDs in a somewhat stable manner.
 * Why is it implemented?
 * 1. During conversion, only 1 reference of a same `TileMetaData` exists (thanks to cache of `mapToTileLayersWithMetaData`)
 * 2. Two arrays containing the same TileMetaData are never equal because Array are compared by reference in Maps.
 * 3. Too lazy to spend time finding a library doing what we need.
 */
type RecursiveMap<TData, TDeadEnd> = Map<TData | TDeadEnd, RecursiveMap<TData, TDeadEnd>>;

type NDSpace<TData, TDeadEnd> = {
  deadEnd: TDeadEnd;
  recursiveMap: RecursiveMap<TData, TDeadEnd>;
  itemsOrderedByIds: TData[][];
};

export const initNDSpace = <TData, TDeadEnd>(deadEnd: Exclude<TDeadEnd, TData>): NDSpace<TData, TDeadEnd> => ({
  deadEnd,
  recursiveMap: new Map<TData | TDeadEnd, RecursiveMap<TData, TDeadEnd>>(),
  itemsOrderedByIds: [],
});

export const resolveNDSpaceId = <TData, TDeadEnd>(ndSpace: NDSpace<TData, TDeadEnd>, items: TData[]) => {
  let currentMap = ndSpace.recursiveMap;
  items.forEach((item) => {
    let nextMap = currentMap.get(item);
    if (!nextMap) {
      nextMap = new Map();
      currentMap.set(item, nextMap);
    }
    currentMap = nextMap;
  });
  const ending = currentMap.get(ndSpace.deadEnd);
  if (ending !== undefined) return ending as unknown as number;

  const newEnding = ndSpace.itemsOrderedByIds.length;
  currentMap.set(ndSpace.deadEnd, newEnding as unknown as RecursiveMap<TData, TDeadEnd>);
  ndSpace.itemsOrderedByIds.push(items);
  return newEnding;
};
