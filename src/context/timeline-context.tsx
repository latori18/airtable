import React, { ReactNode, useCallback, useMemo } from "react";
import { TimelineContextType, TimelineItem } from "../types/timeline";
import { addDays, getEffectiveEndDate, isOverlapping } from "../utils/date";
import { TimelineItem as TimelineItemType } from "../types/timeline";
import { parseISO } from "date-fns";

export const TimelineContext = React.createContext<TimelineContextType>(null!);

interface TimelineProviderProps {
    children: ReactNode;
    itemsWithLanes: TimelineItem[][];
}

export function TimelineProvider({ children, itemsWithLanes }: TimelineProviderProps) {
    const [lanesWithItems, setLanesWithItems] = React.useState<TimelineItem[][]>(itemsWithLanes);
    const [zoom, setZoom] = React.useState<number>(
        Number(localStorage.getItem("zoom")) || 10
    );
    const [editingTask, setEditingTask] = React.useState<number | null>(null);

    const handleZoomChange = useCallback((newZoom: number): void => {
        setZoom(newZoom);
        localStorage.setItem("zoom", String(newZoom));
    }, []);

    const handleItemUpdate = useCallback((id: number, deltaDays: number) => {
        setLanesWithItems((prevLanes) => {
            const flatItems = prevLanes.flat();

            const target = flatItems.find(item => item.id === id);
            if (!target) return prevLanes;

            const movedItem = {
                ...target,
                start: addDays(target.start, deltaDays),
                end: addDays(target.end, deltaDays),
            };

            const others = flatItems.filter(item => item.id !== id);

            others.sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

            const lanes: TimelineItemType[][] = [];

            for (const item of others) {
                let lane = 0;
                while (
                    lanes[lane]?.some(laneItem => isOverlapping(laneItem, item))
                ) {
                    lane++;
                }
                if (!lanes[lane]) lanes[lane] = [];
                lanes[lane].push(item);
            }

            let newLane = 0;
            while (
                lanes[newLane]?.some(laneItem => isOverlapping(laneItem, movedItem))
            ) {
                newLane++;
            }
            if (!lanes[newLane]) lanes[newLane] = [];
            lanes[newLane].push({ ...movedItem, lane: newLane });

            for (let i = 0; i < lanes.length; i++) {
                lanes[i] = lanes[i].map(item => ({ ...item, lane: i }));
            }

            return lanes;
        });
    }, []);

    const toggleItemNameUpdate = useCallback((id: number | null) => {
        setEditingTask(id);
    }, []);

    const handleItemNameUpdate = useCallback((id: number, newName: string) => {
        setLanesWithItems((prevLanes) => {
            return prevLanes.map((laneItems) =>
                laneItems.map((item) =>
                    item.id === id ? { ...item, name: newName } : item
                )
            );
        });
    }, []);

    const contextValue = useMemo((): TimelineContextType => ({
        zoom,
        setZoom: handleZoomChange,
        onUpdate: handleItemUpdate,
        onNameUpdate: handleItemNameUpdate,
        lanes: lanesWithItems,
        editingTask,
        toggleItemNameUpdate,
    }), [zoom, handleZoomChange, handleItemUpdate, handleItemNameUpdate, lanesWithItems, editingTask, toggleItemNameUpdate]);

    return (
        <TimelineContext.Provider value={contextValue}>
            {children}
        </TimelineContext.Provider>
    );
}




