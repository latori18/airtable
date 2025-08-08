import React, { useCallback } from "react";
import { TimelineContext } from "../context/timeline-context";
import { TimelineContextType } from "../types/timeline";

export function ZoomSlider() {
    const { zoom, setZoom }: TimelineContextType = React.useContext(TimelineContext);

    const handleZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setZoom(Number(e.target.value));
    }, [setZoom]);

    return (
        <input
            type="range"
            min="10"
            max="20"
            value={zoom}
            onChange={handleZoomChange}
            className="zoom-slider"
        />
    );
}