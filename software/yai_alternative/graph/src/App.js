import React, { useEffect, useState } from 'react';
import {
  ReactFlowProvider,
  isNode
} from 'react-flow-renderer';
import { questionToElements, decisionToElements, GET_DATA_URL, getRandom } from './utils';
import axios from 'axios';
import ViewFlow from './flows/ViewFlow';
import TestView from './TestView';
import { NODE_TYPE } from './const';
import { TEST_CONF } from './config';


export default function App() {

  const [elements, setElements] = useState([]);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(() => () => { });
  const [test, setTest] = useState(false);
  // TODO: does this need to exist?
  const [testRoots, setTestRoots] = useState([]);
  const [currentTest, setCurrentTest] = useState();

  const nextTest = () => setCurrentTest(curr => curr + 1);
  const prevTest = () => setCurrentTest(curr => curr - 1);

  const prepareForTest = () => {
    console.log("preparing for test!");
    setTest(!test);

    if (testRoots.length === 0) {
      setTestRoots(getRandom(
        elements.filter(isNode).filter((e) => e.type === NODE_TYPE.COLLAPSE_NODE),
        TEST_CONF.NUM_NODES
      ).map(e => ({
        ...e,
        data: {
          ...e.data,
          open: true
        }
      })));
      setCurrentTest(0);
    }
    setShouldLayout(() => () => { });
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
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <button style={{ position: 'absolute', bottom: '5%', right: '10%', zIndex: '5' }}
        onClick={prepareForTest}>{!test ? 'Test me baby' : 'Please no more'}</button>
      {test ?
        <TestView
          rootNodes={testRoots}
          currentTest={currentTest}
          nextTest={nextTest}
          prevTest={prevTest}
          allElements={elements}
          shouldLayout={shouldLayout}
          setShouldLayout={setShouldLayout} />
        :
        <ReactFlowProvider>
          <ViewFlow
            elements={elements}
            setElements={setElements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}
          //onConnect={onConnect}
          //onElementsRemove={onElementsRemove}
          /></ReactFlowProvider>
      }
    </div>
  );
}

