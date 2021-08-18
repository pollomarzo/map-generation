import React, { useState } from 'react';
import MapView from './graphs/MapView';
import {
  nodes, labels, decoyNodes,
  correctElements, creationDuration,
  reviewDuration
} from './conf';
import { TimeoutModal } from './modal';
import Modal from 'react-modal';
import { NodeProvider } from './NodeContext';
import { Timer } from './Timer';
import { correct } from './graphs/graph_utils';


Modal.setAppElement(document.getElementById('root'));

export default function App() {
  // navigation starts from zero
  const navigationStart = 0;
  // all possible nodes
  const [elements, setElements] = useState([]);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);
  // modal for timer expired
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // needed for rerendering "new" timer
  const [timerKey, setTimerKey] = useState(0);
  // once timer is reset, put in new duration and switch key
  const [duration, setDuration] = useState(creationDuration);

  const checkNodes = () => {
    setElements((els) => {
      // dunno if we need to do something with missing stuff
      const { nodes, edges, missingNodes, missingEdges } = correct(els, correctElements.nodes, correctElements.edges);
      return [...nodes, ...edges]
    }
    );
  };

  return (
    <NodeProvider state={navigationStart}>
      <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
        <MapView
          nodes={[...nodes, ...decoyNodes]}
          labels={labels}
          shouldLayout={shouldLayout}
          setShouldLayout={setShouldLayout}
          elements={elements}
          setElements={setElements}
        />
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
            setDuration(reviewDuration);
            setTimerKey(1);
          }}
        />
      </div>
    </NodeProvider>
  );
}

