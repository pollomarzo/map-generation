import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlowProvider,
  removeElements,
  getOutgoers,
  isNode,
  isEdge,
} from 'react-flow-renderer';
import TestFlow from './flows/TestFlow';
import './dnd.css';
import { NODE_IDS, NODE_TYPE, FRAGMENT_TYPE, NODE_DATA_TYPE } from './const';

import TestSidebar from './TestSidebar';

const TestView = ({ allElements, shouldLayout, setShouldLayout }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [elements, setElements] = useState([]);
  const [sidebarElements, setSidebarElements] = useState([]);

  // sort them based on ID before including them to avoid unwanted reordering
  const setSidebarSorted = useMemo(() =>
    (updateF) => setSidebarElements((els) =>
      updateF(els).sort((a, b) => (a.id < b.id) ? -1 : (b.id < a.id) ? 1 : 0)),
    [setSidebarElements]);

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
    // setShouldLayout(false);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const nodeId = event.dataTransfer.getData('application/reactflow');
    const node = sidebarElements.find((node) => node.id === nodeId);
    console.log("adding node: ", node);
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      ...node,
      position,
      isHidden: false,
    };

    setElements((es) => es.concat(newNode));
    // disable corresponding sidebar element
    setSidebarSorted((els) => els.map((el) => el.id === node.id ? {
      ...el,
      data: {
        ...el.data,
        disabled: true
      }
    } : el));
  };

  const onClickDeleteIcon = useCallback((node) => {
    console.log("deleting node...", node);
    setElements((els) => removeElements([node], els));
    setSidebarSorted((els) => els.map((el) => el.id === node.id ? {
      ...el,
      data: {
        ...el.data,
        disabled: false
      }
    } : el))
  }, [setElements, setSidebarSorted]);


  //should this be moved to upper component?
  useEffect(() => {
    const sidebarNodes = allElements.map((node) => ({
      ...node,
      id: node.id,
      // TODO: edit detach node, needs two handles
      type: NODE_TYPE.DETACH_NODE,
      data: {
        ...node.data,
        onDelete: () => onClickDeleteIcon(node)
      }
    }))

    setSidebarSorted(() => sidebarNodes);
    setShouldLayout(true);
  }, [setElements, allElements, setSidebarSorted, onClickDeleteIcon, setShouldLayout])


  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <TestFlow
            elements={elements}
            setElements={setElements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}
            flowProps={{
              onDrop,
              onDragOver,
              onLoad
            }}
          />
        </div>
        <TestSidebar
          nodes={sidebarElements}
        />
      </ReactFlowProvider>
    </div >
  );
};

export default TestView;