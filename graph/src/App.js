import React, { useEffect, useState, useMemo } from 'react';
import MapView from './MapView';
import { nodes, labels } from './conf';
import { TimeoutModal } from './modal';
import Modal from 'react-modal';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

Modal.setAppElement(document.getElementById('root'));

export default function App() {
  // all possible nodes
  const [elements, setElements] = useState(nodes);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);
  // when timer expires
  const [inCreation, setInCreation] = useState(true);
  // modal for timer expired
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // needed for rerendering "new" timer
  const [timerKey, setTimerKey] = useState(0);
  // once timer is reset, put in new duration and switch key
  const [duration, setDuration] = useState(10);

  const checkNodes = () => { };

  return (<>
    <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
      <MapView
        allElements={elements}
        nodes={nodes}
        labels={labels}
        shouldLayout={shouldLayout}
        setShouldLayout={setShouldLayout}
        inCreation={inCreation} />
      <div
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          // TODO: what to we wanna do? above? below?
        }}>
        <CountdownCircleTimer
          key={timerKey}
          isPlaying={true}
          duration={duration}
          colors={[
            ['#004777', 0.33],
            ['#F7B801', 0.33],
            ['#A30000', 0.33],
          ]}
          onComplete={() => {
            setInCreation(false);
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
        onClose={() => {
          setModalIsOpen(false);
          setDuration(20);
          setTimerKey(1);
        }}
      />
    </div>
  </>
  );
}

