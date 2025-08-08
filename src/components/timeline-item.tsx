import React, { useRef, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { parseISO } from "date-fns";
import { dateToX, daysBetween } from "../utils/date";
import { TimelineContext } from "../context/timeline-context";
import { TimelineItem as TimelineItemType } from "../types/timeline";

interface TimelineItemProps {
    item: TimelineItemType;
    startDate: Date;
    laneIndex: number;
}

export function TimelineItem({ item, startDate, laneIndex }: TimelineItemProps) {
    const { zoom, onUpdate, onNameUpdate, editingTask, toggleItemNameUpdate } = useContext(TimelineContext);
    const textRef = useRef<HTMLSpanElement>(null);
    const [dragging, setDragging] = useState(false);
    const dragStartX = useRef(0);
    const [textWidth, setTextWidth] = useState(100);

    const parsedStartDate = useMemo(() => parseISO(item.start), [item.start]);
    const parsedEndDate = useMemo(() => parseISO(item.end), [item.end]);

    const position = useMemo(() => ({
        left: Math.round(dateToX(parsedStartDate, startDate, zoom)),
        top: laneIndex * 40
    }), [parsedStartDate, startDate, zoom, laneIndex]);

    const dimensions = useMemo(() => {
        const dateRangeWidth = daysBetween(parsedStartDate, parsedEndDate) * zoom;
        const width = Math.max(textWidth, dateRangeWidth);
        return { width, dateRangeWidth };
    }, [parsedStartDate, parsedEndDate, zoom, textWidth]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        setDragging(true);
        dragStartX.current = e.clientX;
        e.preventDefault();
    }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging) return;
        const deltaX = e.clientX - dragStartX.current;
        const deltaDays = Math.round(deltaX / zoom);
        if (deltaDays !== 0) {
            onUpdate(item.id, deltaDays);
            dragStartX.current = e.clientX;
        }
    }, [dragging, zoom, onUpdate, item.id]);

    const onMouseUp = useCallback(() => {
        setDragging(false);
    }, []);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onNameUpdate(item.id, e.target.value);
    }, [onNameUpdate, item.id]);

    const handleEditToggle = useCallback(() => {
        toggleItemNameUpdate(item.id);
    }, [toggleItemNameUpdate, item.id]);

    const handleEditCancel = useCallback(() => {
        toggleItemNameUpdate(null);
    }, [toggleItemNameUpdate]);

    const handleNameClick = useCallback(() => {
        toggleItemNameUpdate(item.id);
    }, [toggleItemNameUpdate, item.id]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            return () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };
        }
    }, [dragging, onMouseMove, onMouseUp]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Enter") toggleItemNameUpdate(null);
        if (e.key === "Escape") toggleItemNameUpdate(null);
    }, [toggleItemNameUpdate]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (textRef.current) {
            setTextWidth(textRef.current.clientWidth + 36);
        }
    }, [item.name]);

    const isEditing = useMemo(() => editingTask === item.id, [editingTask, item.id]);

    return (
        <>
            <div
                className="absolute h-10 bg-blue-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap overflow-hidden text-ellipsis border border-red-500 z-10 cursor-grab"
                style={{ left: position.left, width: dimensions.width, top: position.top }}
                onMouseDown={onMouseDown}
                title={item.name}
            >
                {isEditing ? (
                    <div>
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                value={item.name}
                                onChange={handleNameChange}
                                autoFocus
                                className="bg-transparent text-white underlined outline-none w-full"
                            />
                            <button
                                type="button"
                                className="ml-2"
                                onClick={handleEditCancel}
                                aria-label="Confirm edit"
                            >
                                ✅
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <span onClick={handleNameClick} ref={textRef}>
                            {item.name}
                        </span>
                        <button
                            type="button"
                            className="ml-2"
                            onClick={handleEditToggle}
                            aria-label="Edit name"
                        >
                            ✏️
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
