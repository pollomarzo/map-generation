import React, { useEffect, useState, useMemo } from 'react';
import MapView from './MapView';
import { nodes, labels } from './conf';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'


export default function App() {
  // all possible nodes
  const [elements, setElements] = useState(nodes);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);

  return (<>
    <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
      <MapView
        allElements={elements}
        nodes={nodes}
        labels={labels}
        shouldLayout={shouldLayout}
        setShouldLayout={setShouldLayout} />
      <div
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          // TODO: what to we wanna do? above? below?
          zIndex: '1000',
        }}>
        <CountdownCircleTimer
          isPlaying={false}
          duration={10}
          colors={[
            ['#004777', 0.33],
            ['#F7B801', 0.33],
            ['#A30000', 0.33],
          ]}
          onComplete={() => { alert('done') }}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60)
            const seconds = remainingTime % 60

            return `${minutes}:${seconds}`
          }}
        </CountdownCircleTimer>
      </div>
    </div>
  </>
  );
}

