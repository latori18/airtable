import { TimelineItem } from "./types/timeline";

/**
 * Takes an array of items and assigns them to lanes based on start/end dates.
 * @returns an array of arrays containing items.
 */
export function assignLanes(items: TimelineItem[]): TimelineItem[][] {
  const sortedItems = items.sort((a, b) =>
      new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const lanes: TimelineItem[][] = [];

  function assignItemToLane(item: TimelineItem): void {
      for (const lane of lanes) {
          if (new Date(lane[lane.length - 1].end).getTime() < new Date(item.start).getTime()) {
              lane.push({ ...item, lane: lanes.indexOf(lane) });
              return;
          }
      }
      lanes.push([{ ...item, lane: lanes.length }]);
  }

  for (const item of sortedItems) {
      assignItemToLane(item);
  }
  return lanes;
}
