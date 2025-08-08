import React, { useMemo } from "react";
import "../app.css";
import { TimelineContext } from "../context/timeline-context";
import { TimelineItem } from "./timeline-item";
import { TimelineItem as TimelineItemType } from "../types/timeline";
import { TimelineHeader } from "./timeline-header";
import { parseISO, differenceInCalendarDays } from "date-fns";

export default function Timeline() {
    const { lanes, zoom, editingTask } = React.useContext(TimelineContext);
    const timelineRef = React.useRef<HTMLDivElement>(null);

    const allItems = useMemo(() => lanes.reduce(
        (acc, lane) => acc.concat(lane),
        [] as TimelineItemType[]
    ), [lanes]);

    const startDate = useMemo(() => allItems.reduce(
        (min: string, item: TimelineItemType) =>
            item.start < min ? item.start : min,
        allItems[0].start
    ), [allItems]);

    const dateCalculations = useMemo(() => {
        const sortedItems = allItems.sort((a, b) => (a.end > b.end ? -1 : 1));
        const start = parseISO(sortedItems[sortedItems.length - 1].start);
        const end = parseISO(sortedItems[0].end);
        const totalDays = differenceInCalendarDays(end, start) + 1;
        const totalTimelineWidth = totalDays * zoom;
        
        return { start, end, totalDays, totalTimelineWidth };
    }, [allItems, zoom]);

    return (
        <div
            ref={timelineRef}
            className="overflow-x-auto border border-gray-300 rounded-lg shadow-md"
            style={{ height: 500 }}
        >
            <div style={{ minWidth: dateCalculations.totalTimelineWidth }}>
                <TimelineHeader
                    daysVisible={dateCalculations.totalDays}
                    startDate={dateCalculations.start}
                    endDate={dateCalculations.end}
                    zoom={zoom}
                />
                <div className="relative" style={{ height: 450 }}>
                    {lanes.map((laneItems, laneIndex) =>
                        laneItems.map(item => (
                            <TimelineItem
                                key={item.id}
                                item={item}
                                startDate={dateCalculations.start}
                                laneIndex={laneIndex}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
