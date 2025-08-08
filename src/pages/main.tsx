import React, { useMemo } from "react";
import timelineItems from "../timelineItems";
import { assignLanes } from "../assignLanes";
import Timeline from "../components/timeline";
import { TimelineProvider } from "../context/timeline-context";
import { ZoomSlider } from "../components/zoom-slider";

export default function App() {
  const itemsWithLanes = useMemo(() => assignLanes(timelineItems), []);
  return (
    <TimelineProvider itemsWithLanes={itemsWithLanes}>
      <div>
        <h2>Good luck with your assignment! ✨</h2>
        <h3>{itemsWithLanes.length} timeline items to render</h3>

        <ZoomSlider />
        <Timeline />
      </div>
    </TimelineProvider>
  );
}
