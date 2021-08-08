import React, { useEffect, useState, useMemo } from 'react';
import {
  ReactFlowProvider,
  isNode,
  removeElements
} from 'react-flow-renderer';
import { questionToElements, decisionToElements, GET_DATA_URL, getRandom } from './utils';
import axios from 'axios';
import ViewFlow from './flows/ViewFlow';
import TestView from './TestView';
import { NODE_DATA_TYPE, NODE_TYPE } from './const';
import { TEST_CONF, VIEW_CONF } from './config';
import TestResult from './TestResult';


export default function App() {

  // all we found
  const [parsed, setParsed] = useState([]);
  // what's in the actual graph
  const [elements, setElements] = useState([]);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);
  const [test, setTest] = useState(false);
  // TODO: does this need to exist?
  const [testRoots, setTestRoots] = useState([]);
  const [currentTest, setCurrentTest] = useState();

  const [results, setResults] = useState(undefined);

  const nextTest = (ans) => {
    if (currentTest < testRoots.length - 1) setCurrentTest(curr => curr + 1);
    else {
      setTest(false);
      console.log("received ans are: ", ans);
      setResults(ans);
    }
  };

  const prepareForTest = () => {
    console.log("preparing for test!");
    setTest(!test);
    setResults(undefined);

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
    // setShouldLayout(true);
  };

  const simplified = useMemo(() => {
    if (elements.length > VIEW_CONF.MAX_GRAPH) {
      let remaining = elements;
      console.log("wayyy too many elements. I'll simplify this a bit!")
      const elementsToRemove = elements.filter(n =>
        // keep factors for readability
        n.type === NODE_TYPE.OUTPUT && n.data.type !== NODE_DATA_TYPE.FACTOR);
      const toRemove = new Set(elementsToRemove);
      console.log("toRemove: ", toRemove);
      const difference = elements.filter(x => !toRemove.has(x));
      console.log("difference", difference)
      remaining = [...difference, ...elementsToRemove.map(n => ({
        ...n,
        isHidden: true,
      }))]
      console.log("updated: ", remaining);
      return remaining;
    } else return elements;
  }, [elements])

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

        let remaining = updatedElements;

        // if (updatedElements.length > VIEW_CONF.MAX_GRAPH) {
        //   remaining = simplify(updatedElements);
        //   console.log("wayyy too many elements. I'll simplify this a bit!")
        //   const elementsToRemove = updatedElements.filter(n =>
        //     // keep factors for readability
        //     n.type === NODE_TYPE.OUTPUT && n.data.type !== NODE_DATA_TYPE.FACTOR);
        //   const toRemove = new Set(elementsToRemove);
        //   console.log("toRemove: ", toRemove);
        //   const difference = updatedElements.filter(x => !toRemove.has(x));
        //   console.log("difference", difference)
        //   remaining = [...difference, ...elementsToRemove.map(n => ({
        //     ...n,
        //     isHidden: true,
        //   }))]
        //   console.log("updated: ", remaining);
        // }
        return setElements([...updatedElements]);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ height: '80vh', width: '100%', position: 'relative' }}>
      {test ?
        <TestView
          rootNodes={testRoots}
          currentTest={currentTest}
          nextTest={nextTest}
          allElements={elements}
          shouldLayout={shouldLayout}
          setShouldLayout={setShouldLayout} />
        :
        <ReactFlowProvider>
          <button style={{ position: 'absolute', bottom: '5%', right: '10%', zIndex: '5' }}
            onClick={prepareForTest}>{'Test me baby'}</button>
          <ViewFlow
            elements={simplified}
            setElements={setElements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}
          //onConnect={onConnect}
          //onElementsRemove={onElementsRemove}
          />
        </ReactFlowProvider>
      }
      <div>
        {results && <TestResult answers={results} />}
      </div>
    </div>
  );
}

