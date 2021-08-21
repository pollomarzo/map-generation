import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
  removeElements,
  isEdge,
  Controls,
  ReactFlowProvider
} from 'react-flow-renderer';
import './dnd.css';
import { NODE_DATA_TYPE, NODE_TYPE } from '../const';
import { ID } from '../utils';
import { EDGE_TYPE } from '../const';
import DetachNode from '../custom_elements/DetachNode';
import ColoredEdge from '../custom_elements/ColoredEdge';

import { NodeSidebar, LabelSidebar } from './Sidebar';

const nodeTypes = {
  detach_node: DetachNode,
};

const edgeTypes = {
  colored_edge: ColoredEdge,
};


const MapView = ({ nodes, labels, elements, setElements, editable }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // this contains the type of the node being dragged to allow for
  // instructions to be displayed
  const [dragging, setDragging] = useState(undefined);

  // default state is nodes with type detach and sorted
  const [sidebarNodes, setSidebarNodes] = useState(
    nodes.map((node) => ({
      ...node,
      type: NODE_TYPE.DETACH_NODE,
    }))
      .sort((a, b) =>
        a.data.label.localeCompare(b.data.label, 'en', { 'sensitivity': 'base' })));
  const [sidebarLabels, setSidebarLabels] = useState(
    labels.map((node) => ({
      ...node,
      type: NODE_TYPE.DETACH_NODE,
    })).
      sort((a, b) =>
        a.data.label.localeCompare(b.data.label, 'en', { 'sensitivity': 'base' })));

  // sort everything based on label before including them to avoid inconsistent order
  const setSidebarNodesSorted = useMemo(() =>
    (updateF) => setSidebarNodes((els) =>
      updateF(els).sort((a, b) =>
        a.data.label.localeCompare(b.data.label, 'en', { 'sensitivity': 'base' }))),
    [setSidebarNodes]);

  // const setSidebarLabelsSorted = useMemo(() =>
  //   (updateF) => setSidebarLabels((els) =>
  //     updateF(els).sort((a, b) =>
  //       a.data.label.localeCompare(b.data.label, 'en', { 'sensitivity': 'base' }))),
  //   [setSidebarLabels]);


  const onRemoveEdge = (edge) => setElements(els => [...removeElements([edge], els)]);

  const onElementClick = (_, el) => {
    if (isEdge(el) && editable) {
      onRemoveEdge(el, el.target);
    }
  };

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
    // setShouldLayout(false);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event, offsetX) => {
    onDragEnd(event);
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const nodeId = event.dataTransfer.getData('application/reactflow/id');
    const nodeType = event.dataTransfer.getData('application/reactflow/type');

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left - 50 + (offsetX || 0),
      y: event.clientY - reactFlowBounds.top - 30,
    });

    let node;
    if (nodeType === NODE_DATA_TYPE.NODE) {
      node = sidebarNodes.find((node) => node.id === nodeId)
      node.originalId = node.id
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
        onDelete: () => onClickDeleteIcon(node),
        onDrop: (event) => {
          event.stopPropagation();
          const nodeId = event.dataTransfer.getData('application/reactflow/id');
          onDrop(event, 200);
          setElements(els => {
            const targetId = els.find(el => el.originalId === nodeId).id;
            onConnect({
              source: node.id,
              target: targetId,
            })
            return els;
          })
        }
      }
    }
    console.log("adding node: ", node);
    setElements((es) => es.concat(node));
    // disable corresponding sidebar element
  };

  const onClickDeleteIcon = useCallback((node) => {
    if (editable) {
      console.log("deleting node...", node);
      setElements((els) => removeElements([node], els));
      setSidebarNodesSorted((els) => els.map((el) => el.id === node.id ? {
        ...el,
        data: {
          ...el.data,
          disabled: false
        }
      } : el))
    }
  }, [setElements, setSidebarNodesSorted]);

  const onConnect = params => {
    // make sure the two nodes are different types
    setElements(elements => {
      console.log(elements)
      const target = elements.find(el => el.id === params.target);
      const targetType = target.data.type;
      const targetOriginalId = target.originalId || target.id;

      const source = elements.find(el => el.id === params.source);
      const sourceType = source.data.type;
      const sourceOriginalId = source.originalId || source.id;

      if (sourceType !== targetType) {
        console.log("connecting params: ", params);
        const edgeId = `${params.source}-${params.target}-edge`;
        let newEdge = {
          ...params,
          id: edgeId,
          animated: false,
          type: EDGE_TYPE.COLORED_EDGE,
          data: {
            onClick: () => onRemoveEdge(newEdge, newEdge.target),
          },
          sourceOriginalId: sourceOriginalId,
          targetOriginalId: targetOriginalId,
        }
        return [...elements, newEdge]
      }
      return elements;
    });
  };

  const onDragEnd = (event) => setDragging(undefined);


  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <div style={{ height: '100%' }}>
            <ReactFlow
              elements={elements}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              elementsSelectable={false}
              onElementClick={onElementClick}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onLoad={onLoad}
              onlyRenderVisibleElements={true}
            >
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        </div>
        {editable && <>
          <NodeSidebar
            nodes={sidebarNodes}
            setDragging={setDragging}
            onDragEnd={onDragEnd}
          />
          <LabelSidebar
            nodes={sidebarLabels}
            setDragging={setDragging}
            onDragEnd={onDragEnd}
          /></>}
      </ReactFlowProvider>
      {dragging && <div style={{
        position: 'absolute',
        bottom: '10%', right: '50%',
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white',
        cornerRadius: '20',
        padding: 10
      }}>
        {(dragging === NODE_DATA_TYPE.NODE) ? "Drop this node on a label to connect them" :
          "Drop this label on a node to connect them"}
      </div>}
    </div >
  );
};

export default MapView;