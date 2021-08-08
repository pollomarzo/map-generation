import React, { useEffect, useState, useMemo } from 'react';
import TestView from './TestView';
import nodes from './nodes.json';


export default function App() {

  // all possible nodes
  const [elements, setElements] = useState(nodes);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);

  return (
    <div style={{ height: '80vh', width: '100%', position: 'relative' }}>
      <TestView
        allElements={elements}
        shouldLayout={shouldLayout}
        setShouldLayout={setShouldLayout} />
    </div>
  );
}

