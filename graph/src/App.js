import React, { useState } from 'react';
import MapView from './graphs/MapView';
import {
  nodes, labels, decoyNodes,
  correctElements, NAV, URL
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

  const [results, setResults] = useState({});

  const checkNodes = (els) => correct(els, correctElements.nodes, correctElements.edges);

  const saveResults = () => {
    setResults(res => {
      fetch(URL.SAVE_RESULTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results: res,
        }),
      });
      console.log("SAVED!")
      return res;
    })
  }

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
            let returnData = {};
            setElements(els => {
              returnData = checkNodes(els);
              // update elements with verified nodes
              return [...returnData.nodes, ...returnData.edges]
            });
            setModalIsOpen(true);
            setNavigationState(navigation => {
              // this is ugly. I really don't like it but have no better idea.
              if (navigation === NAV.REVIEW) {
                // reset elements after saving result
                setElements(elements => {
                  setResults(results => ({
                    ...results,
                    createdGraph: {
                      elements: elements,
                      missing: [...returnData.missingNodes, ...returnData.missingEdges],
                    },
                  }));
                  return []
                });
              } else if (navigation === NAV.RECREATE) {
                // save results but leave elements (using callback to ensure updated elements)
                setElements(elements => {
                  setResults(results => ({
                    ...results,
                    recreatedGraph: {
                      elements: elements,
                      missing: [...returnData.missingNodes, ...returnData.missingEdges],
                    }
                  }));
                  // since they're complete send them uppp
                  saveResults();
                  return elements
                })
              }
              return navigation
            })
          }}
        />
        <TimeoutModal
          isOpen={modalIsOpen}
          nextSection={(duration) => {
            setModalIsOpen(false);
            setDuration(duration);
            setTimerKey(key => key + 1);
          }}
          setNavigationState={setNavigationState}
          navigationState={navigationState}
        />
      </div>
    </NodeProvider>
  );
}

