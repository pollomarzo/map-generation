import React, { useEffect, useState } from 'react';
import {
  getOutgoers,
  ReactFlowProvider,
} from 'react-flow-renderer';
import LayoutFlow from './LayoutFlow';
import { questionToElements, decisionToElements, GET_DATA_URL } from './utils';
import axios from 'axios';
import TestFlow from './TestFlow';
import ViewFlow from './ViewFlow';


export default function App() {

  const [elements, setElements] = useState([]);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);
  const [testShouldLayout, setTestShouldLayout] = useState(true);
  const [test, setTest] = useState(false);
  // TODO: does this need to exist?
  const [testRoot, setTestRoot] = useState();

  const prepareForTest = () => {
    // TODO: move this into a new component inside provider, so that on change graph
    // we can fitViewAction({ padding: 0.5 }); (useStoreActions((actions) => actions.fitView);)
    console.log("preparing for test!");
    setTest(!test);
    // randomElement = array[Math.floor(Math.random() * array.length)];
    let target = elements.find((e) => e.id === 'my:risk-What?');
    target = {
      ...target,
      data: {
        ...target.data,
        open: true,
      }
    }
    setTestRoot(target);
  };

  // fetch initial data and parse it into a graph 
  useEffect(() => {
    axios.get(GET_DATA_URL)
      .then(res => {
        console.log("parsing elements..");
        const { is_approved, questions, factors, abstracts } = res.data;
        // convert HTML strings to nodes, inflate with abstracts when you have them
        // starting node and decision factors
        console.log("creating decision elements...");
        let updatedElements = decisionToElements(is_approved, factors, abstracts);
        // questions and answers
        console.log("questions: ", questions);
        updatedElements = questions.reduce((acc, curr) =>
          questionToElements(acc, curr, abstracts), updatedElements);

        console.log("final updatedElements: ", updatedElements);
        return setElements([...updatedElements]);
      })
      .catch(err => console.error(err));
  }, []);
  /*
    const onConnect = params =>
      setElements(els =>
        addEdge({ ...params, type: 'smoothstep', animated: true }, els)
      );
    const onElementsRemove = elementsToRemove =>
      setElements(els => removeElements(elementsToRemove, els));
  */
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <button style={{ position: 'absolute', bottom: '5%', right: '10%', zIndex: '5' }}
        onClick={() => prepareForTest()}>{!test ? 'Test me baby' : 'Please no more'}</button>
      <ReactFlowProvider>
        {test ?
          <TestFlow
            rootNode={testRoot}
            allElements={elements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout} /> :
          <ViewFlow
            elements={elements}
            setElements={setElements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}
          //onConnect={onConnect}
          //onElementsRemove={onElementsRemove}
          />
        }
      </ReactFlowProvider>
    </div>
  );
}

