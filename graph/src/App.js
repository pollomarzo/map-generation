import React, { useEffect, useState, useMemo } from 'react';
import MapView from './MapView';
import { nodes, labels } from './conf';
import { TimeoutModal } from './modal';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'


export default function App() {
  // all possible nodes
  const [elements, setElements] = useState(nodes);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);
  // when timer expires
  const [expired, setExpired] = useState(false);
  // modal for timer expired
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const checkNodes = () => { };

  return (<>
    <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
      <MapView
        allElements={elements}
        nodes={nodes}
        labels={labels}
        shouldLayout={shouldLayout}
        setShouldLayout={setShouldLayout}
        expired={expired} />
      <div
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          // TODO: what to we wanna do? above? below?
        }}>
        <CountdownCircleTimer
          isPlaying={true}
          duration={2}
          colors={[
            ['#004777', 0.33],
            ['#F7B801', 0.33],
            ['#A30000', 0.33],
          ]}
          onComplete={() => {
            setExpired(true);
            checkNodes();
            setModalIsOpen(true);
          }}
          style={{
            zIndex: '5',
          }}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60)
            const seconds = remainingTime % 60

            return `${minutes}:${seconds}`
          }}
        </CountdownCircleTimer>
      </div>
      <TimeoutModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </div>
  </>
  );
}

