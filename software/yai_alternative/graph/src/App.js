import React, { useEffect, useState } from 'react';
import {
  addEdge,
  ReactFlowProvider,
  removeElements,
} from 'react-flow-renderer';
import LayoutFlow from './LayoutFlow';
import { questionToGraph, GET_DATA_URL } from './utils';
import axios from 'axios';


export default function App() {

  let [elements, setElements] = useState([]);
  // going to keep this here to call a graph layout when it's needed
  const [shouldLayout, setShouldLayout] = useState(true);

  useEffect(() => {
    axios.get(GET_DATA_URL)
      .then(res => {
        console.log("parsing elements..");
        // convert HTML string to nodes
        const topics = res.data.reduce((acc, curr) => questionToGraph(acc, curr, setShouldLayout), []);
        console.log(topics);

        return setElements(topics);
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
    <div>
      <h1>Hello!</h1>
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
    </div>
  );
}

