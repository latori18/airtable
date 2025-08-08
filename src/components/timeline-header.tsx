import React, { useMemo } from "react";
import { format, addDays, getDay } from "date-fns";

interface TimelineHeaderProps {
    startDate: Date;
    endDate: Date;
    zoom: number;
    daysVisible: number;
    maxWidth?: number;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
    startDate,
    zoom,
    daysVisible,
    maxWidth
}) => {

    const labels = useMemo(() => {
        const result = [];
        for (let i = 0; i < daysVisible; i++) {
            const date = addDays(startDate, i);
            if (getDay(date) === 1) {
                result.push({
                    date,
                    label: format(date, "MMM d"),
                    left: i * zoom,
                });
            }
        }
        return result;
    }, [startDate, daysVisible, zoom]);

    const containerStyle = useMemo(() => ({
        width: daysVisible * zoom,
        maxWidth
    }), [daysVisible, zoom, maxWidth]);

    return (
        <div
            className="relative border-gray-300 h-8"
            style={containerStyle}
        >
            {labels.map(({ date, label, left }) => (
                <div
                    key={date.toISOString()}
                    className="absolute text-xs text-gray-700"
                    style={{ left, width: zoom, textAlign: "center" }}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};
