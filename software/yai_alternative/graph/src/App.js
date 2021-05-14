import React, { useEffect, useState } from 'react';
import {
  addEdge,
  ReactFlowProvider,
  removeElements,
} from 'react-flow-renderer';
import LayoutFlow from './LayoutFlow';
import { questionToElements, decisionToElements, GET_DATA_URL } from './utils';
import axios from 'axios';


export default function App() {

  let [elements, setElements] = useState([]);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);

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
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlowProvider>
        <LayoutFlow
          elements={elements}
          setElements={setElements}
          shouldLayout={shouldLayout}
          setShouldLayout={setShouldLayout}
        //onConnect={onConnect}
        //onElementsRemove={onElementsRemove}
        />
      </ReactFlowProvider>
    </div>
  );
}

