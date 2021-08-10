import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlowProvider,
  removeElements,
  getOutgoers,
  isNode,
  isEdge,
} from 'react-flow-renderer';
import Flow from './flows/Flow';
import './dnd.css';
import { NODE_IDS, NODE_DATA_TYPE, NODE_TYPE, FRAGMENT_TYPE } from './const';
import { ID } from './utils';

import { NodeSidebar, LabelSidebar } from './Sidebar';

const MapView = ({ allElements, nodes, labels, shouldLayout, setShouldLayout }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [elements, setElements] = useState([]);
  const [sidebarNodes, setSidebarNodes] = useState([]);
  const [sidebarLabels, setSidebarLabels] = useState([]);

  // sort everything based on ID before including them to avoid unwanted reordering
  const setSidebarNodesSorted = useMemo(() =>
    (updateF) => setSidebarNodes((els) =>
      updateF(els).sort((a, b) => (a.id < b.id) ? -1 : (b.id < a.id) ? 1 : 0)),
    [setSidebarNodes]);

  const setSidebarLabelsSorted = useMemo(() =>
    (updateF) => setSidebarLabels((els) =>
      updateF(els).sort((a, b) => (a.id < b.id) ? -1 : (b.id < a.id) ? 1 : 0)),
    [setSidebarLabels]);

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
    const nodeId = event.dataTransfer.getData('application/reactflow/id');
    const nodeType = event.dataTransfer.getData('application/reactflow/type');

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    let node;
    if (nodeType === NODE_DATA_TYPE.NODE) {
      node = sidebarNodes.find((node) => node.id === nodeId)
      setSidebarNodesSorted((els) => els.map((el) => el.id === node.id ? {
        ...el,
        data: {
          ...el.data,
          disabled: true
        }
      } : el));
    }
    else if (nodeType === NODE_DATA_TYPE.EDGE_LABEL) {
      node = sidebarLabels.find((node) => node.id === nodeId)
      node.originalId = node.id
      node.id = node.id + ID()
    }

    node = {
      ...node,
      position,
      data: {
        ...node.data,
        onDelete: () => onClickDeleteIcon(node)
      }
    }

    console.log("adding node: ", node);

    setElements((es) => es.concat(node));
    // disable corresponding sidebar element
  };

  const onClickDeleteIcon = useCallback((node) => {
    console.log("deleting node...", node);
    setElements((els) => removeElements([node], els));
    setSidebarNodesSorted((els) => els.map((el) => el.id === node.id ? {
      ...el,
      data: {
        ...el.data,
        disabled: false
      }
    } : el))
  }, [setElements, setSidebarNodesSorted]);


  //should this be moved to upper component?
  useEffect(() => {
    // update sidebar nodes, then edge labels
    const sidebarNodes = nodes.map((node) => ({
      ...node,
      type: NODE_TYPE.DETACH_NODE,
    }))
    setSidebarNodesSorted(() => sidebarNodes);
    // labels
    const sidebarLabels = labels.map((node) => ({
      ...node,
      type: NODE_TYPE.DETACH_NODE,
    }))
    setSidebarLabelsSorted(() => sidebarLabels);

    setShouldLayout(true);
  }, [setElements, allElements, setSidebarNodesSorted,
    setSidebarLabelsSorted, onClickDeleteIcon, setShouldLayout, labels, nodes])


  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <Flow
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
        <NodeSidebar
          nodes={sidebarNodes}
        />
        <LabelSidebar
          nodes={sidebarLabels}
        />
      </ReactFlowProvider>
    </div >
  );
};

export default MapView;