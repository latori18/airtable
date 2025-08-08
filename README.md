
# Airtable Timeline Component

  

A React TypeScript timeline component for visualizing items with start and end dates across multiple lanes, similar to project management tools like Gantt charts.

  

## Features

  

This timeline component supports drag and drop functionality, allowing users to move timeline items horizontally to adjust dates. Items can be edited inline by clicking on their names, and the zoom level is adjustable through a slider control. Zoom is also saved as a preference for user convenience. The system automatically assigns items to lanes to prevent overlapping, with a little bit of leeway to deal with larger names on shorter time periods. The timeline also has a time ruler that adjusts with the zoom to improve the experience

  

## What I Like About This Implementation

**Architecture & Code Quality**  
Uses TypeScript typing to catch errors early and improve dev experience. Separates data (React Context), UI, and utils clearly. Performance improved with `useMemo`, `useCallback`, and memoization to reduce re-renders. Components have single responsibility and defined props.

**User Experience**  
Interactions include drag to move, click to edit, with cues for editing and hover. Zoom updates in real time and saves settings in localStorage. Keyboard support for Enter and Escape in editing.

**Technical Implementation**  
Uses `date-fns` for date calculations. Auto lane assignment prevents overlapping timeline items. State management with React Context. Styling combines Tailwind CSS when possible with inline styles when dynamic values are required (such as in changing widths according to zoom).

## What I Would Change


### Performance

For larger datasets , we would probably need some optimization like only rendering items that are currently visible.

### Features & UX

Drag-and-drop feels a little clunky because I had to handle vertical repositioning to avoid overlaps, which is tricky under the time constraint. Adding multi-select for bulk actions and resize handles on items to adjust duration would improve usability. Better mobile support with touch gestures and responsive design is needed.


## Design Decisions & Inspiration

### Technical Choices

TypeScript was used from the start to improve developer experience—catching errors early and making refactoring safer. 

React Context avoids some of the prop drilling and also allows for better interaction between the components.

Tailwind CSS speeds up development with a consistent design system and flexible styling.

  


## Testing Strategy

Testing would cover unit tests for components like `TimelineItem` position logic, drag handling, and edit mode. The drag and drop update algorithm needs thorough tests for overlaps and edge cases. Integration tests would check timeline updates with context changes and zoom adjustments. 

Tools like Cypress or Playwright could be really useful when dealing with testing in a complex scenario like this one.

## Getting Started

```bash

npm  install

npm  start

```

  

The application will open at `http://localhost:1234` with a working timeline displaying sample data.