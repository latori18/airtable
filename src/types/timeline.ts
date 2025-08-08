export interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
  lane?: number;
}

export interface TimelineContextType {
  zoom: number;
  setZoom: (zoom: number) => void;
  onUpdate: (id: number, deltaDays: number) => void;
  onNameUpdate: (id: number, newName: string) => void;
  lanes: TimelineItem[][];
  editingTask: number | null;
  toggleItemNameUpdate: (taskId: number | null) => void;
}
