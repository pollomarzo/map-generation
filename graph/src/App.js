import React, { useState } from 'react';
import MapView from './graphs/MapView';
import {
  nodes, labels, decoyNodes,
  correctElements, TEXT, NAV
} from './conf';
import { TimeoutModal } from './modal';
import Modal from 'react-modal';
import { NodeProvider } from './NodeContext';
import { Timer } from './Timer';
import { correct } from './graphs/graph_utils';
import YAI from './YAI';
import { useNavigationContext } from './NavigationContext';
const SCRIPTS = [
  "/yai/js/lib/jquery-3.5.1.min.js",
  // "/yai/js/lib/vue-2.6.14.min.js",
  "/yai/js/lib/vue-2.6.14.min.js",
  "/yai/js/lib/bootstrap-vue-2.16.0.min.js",
  // "/yai/js/lib/apexcharts-3.27.3.min.js",
  // "/yai/js/lib/vue-apexcharts-1.6.2.min.js",
  "https://cdn.jsdelivr.net/npm/apexcharts",
  "https://cdn.jsdelivr.net/npm/vue-apexcharts",
  "https://d3js.org/d3.v4.js",
  "/yai/js/lib/common_fn.js",
  "/yai/js/template/template_lib.js",
  "/yai/js/template/template.js",
  "/yai/js/template/jsonld_handler.js",
  "/yai/js/stage_builder/item_stage_builder.js",
  "/yai/js/stage_builder/domain_stage_builder.js",
  "/yai/js/stage_builder/api_lib.js",
  "/yai/js/vue_component/explanation_components.js",
]



Modal.setAppElement(document.getElementById('root'));

export default function App() {
  React.useEffect(() => {
    SCRIPTS.forEach(script => {
      const js = document.createElement('script');
      js.src = script;
      js.async = true;
      document.head.appendChild(js);
    });
  }, []);
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
        {navigationState !== NAV.YAI ? <MapView
          nodes={[...nodes, ...decoyNodes]}
          labels={labels}
          elements={elements}
          setElements={setElements}
          editable={(navigationState === NAV.CREATE || navigationState === NAV.RECREATE)}
        /> :
          <YAI />
        }
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
              // maybe include it on first render of YAI by passing setElements?
              if (navigation === NAV.YAI) {
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

