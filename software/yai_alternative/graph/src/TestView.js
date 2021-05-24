import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  getOutgoers
} from 'react-flow-renderer';
import TestFlow from './TestFlow';
import './dnd.css';
import { NODE_IDS, EDGE_IDS, NODE_TYPE, FRAGMENT_TYPE } from './const';
import { getRandom } from './utils';
import { TEST_CONF } from './config';

import TestSidebar from './TestSidebar';


const TestView = ({ rootNode, allElements, shouldLayout, setShouldLayout }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([rootNode]);
  const [sidebarElements, setSidebarElements] = useState([]);

  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const node = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    console.log("adding node: ", node);
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      ...node,
      position,
    };

    setElements((es) => es.concat(newNode));
    setSidebarElements((els) => {
      const sidebarNode = els.find((n) => n.id === node.id);
      return [...els.filter((el) => el.id !== node.id), {
        ...sidebarNode,
        data: {
          ...sidebarNode.data,
          disabled: true,
        }
      }]
    });
  };

  const onGapClick = (edge) => {
    setElements(elements => elements.map(el => ({
      ...el,
      animated: el.animated ? false : el.id === edge.id
    })));
  };

  // remove a selected number of random gaps and update the remaining ones
  const shrinkGappedText = (gappedText) => {
    const gaps = gappedText.filter(el => el.type === FRAGMENT_TYPE.GAP);
    const gapsToRemove = new Set(getRandom(
      gaps, Math.min(gaps.length, gaps.length - TEST_CONF.NUM_GAPS)));
    //
    return {
      gappedText: gappedText.map((el) => {
        if (el.type === FRAGMENT_TYPE.GAP)
          if (gapsToRemove.has(el)) return {
            type: FRAGMENT_TYPE.PIECE,
            text: el.text,
          }
          else return {
            ...el,
            targetId: NODE_IDS.TEST_NODE(el.targetId)
          }
        return el;
      }), removedGaps: gapsToRemove
    }

  };

  //should this be moved to upper component?
  useEffect(() => {
    // remove unnecessary gaps
    const { gappedText: rootText, removedGaps } = shrinkGappedText(rootNode.data.gappedText);

    const gapIds = new Set(Array.from(removedGaps).map((el) => el.targetId))
    // get all mentioned nodes, remove the ones that shouldn't be there
    const modifiedNodes = getOutgoers(rootNode, allElements)
      .filter(el => !gapIds.has(el.id))
      .map((node) => ({
        ...node,
        id: NODE_IDS.TEST_NODE(node.id),
        type: NODE_TYPE.DETACH_NODE
      }));

    const modifiedRoot = {
      ...rootNode,
      data: {
        ...rootNode.data,
        onGapClick,
        noTargetHandle: true,
        gappedText: rootText,
      }
    };
    setElements([modifiedRoot]);
    setSidebarElements(modifiedNodes);
  }, [setElements, rootNode, allElements])


  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <TestFlow
            rootNode={rootNode}
            elements={elements}
            setElements={setElements}
            allElements={allElements}
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
    </div>
  );
};

export default TestView;