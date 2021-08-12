import React, { useEffect, useState, useMemo } from 'react';
import MapView from './MapView';
import { nodes, labels } from './conf';
import { TimeoutModal } from './modal';
import Modal from 'react-modal';
import { NodeProvider } from './NodeContext';
import { Timer } from './Timer';


Modal.setAppElement(document.getElementById('root'));

export default function App() {
  // state context
  const state = {
    navigation: 0,
  };
  // all possible nodes
  const [elements, setElements] = useState(nodes);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);
  // modal for timer expired
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // needed for rerendering "new" timer
  const [timerKey, setTimerKey] = useState(0);
  // once timer is reset, put in new duration and switch key
  const [duration, setDuration] = useState(10);

  const checkNodes = () => { };

  return (
    <NodeProvider state={state}>
      <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
        <MapView
          allElements={elements}
          nodes={nodes}
          labels={labels}
          shouldLayout={shouldLayout}
          setShouldLayout={setShouldLayout} />
        <Timer
          timerKey={timerKey}
          duration={duration}
          onComplete={() => {
            checkNodes();
            setModalIsOpen(true);
          }}
        />
        <TimeoutModal
          isOpen={modalIsOpen}
          onClose={() => {
            setModalIsOpen(false);
            setDuration(20);
            setTimerKey(1);
          }}
        />
      </div>
    </NodeProvider>
  );
}

