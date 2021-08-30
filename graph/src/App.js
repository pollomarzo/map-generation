import React, { useState } from 'react';
import MapView from './graphs/MapView';
import {
  nodes, labels, decoyNodes,
  correctElements, NAV
} from './conf';
import { TimeoutModal } from './modal';
import Modal from 'react-modal';
import { NodeProvider } from './NodeContext';
import { Timer } from './Timer';
import { correct } from './graphs/graph_utils';
import { useNavigationContext } from './NavigationContext';

Modal.setAppElement(document.getElementById('root'));

export default function App() {
  // all possible nodes
  const [elements, setElements] = useState([]);
  // modal for timer expired
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // needed for rerendering "new" timer
  const [timerKey, setTimerKey] = useState(0);
  // once timer is reset, put in new duration and switch key
  const [duration, setDuration] = useState(0);
  // we'll keep navigation state here
  const { navigationState, setNavigationState } = useNavigationContext();

  const checkNodes = () => {
    setElements((els) => {
      // dunno if we need to do something with missing stuff
      const { nodes, edges, missingNodes, missingEdges } = correct(els, correctElements.nodes, correctElements.edges);
      return [...nodes, ...edges]
    }
    );
  };

  return (
    <NodeProvider>
      <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
        <MapView
          nodes={[...nodes, ...decoyNodes].sort((a, b) =>
            a.data.label.localeCompare(b.data.label, 'en', { 'sensitivity': 'base' }))}
          labels={labels.sort((a, b) =>
            a.data.label.localeCompare(b.data.label, 'en', { 'sensitivity': 'base' }))}
          elements={elements}
          setElements={setElements}
          editable={(navigationState === NAV.CREATE || navigationState === NAV.RECREATE)}
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
          nextSection={(duration) => {
            setModalIsOpen(false);
            setDuration(duration);
            setTimerKey(key => key + 1);
            setNavigationState(navigation => {
              // this is ugly. I really don't like it but have no better idea.
              if (navigation === NAV.REVIEW) {
                setElements([]);
                // REMEMBER TO SAVE GRAPH SOMEWHERE!
              }
              return navigation
            })
          }}
          setNavigationState={setNavigationState}
          navigationState={navigationState}
        />
      </div>
    </NodeProvider>
  );
}

