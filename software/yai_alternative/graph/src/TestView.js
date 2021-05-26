import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlowProvider,
  removeElements,
  getOutgoers,
  isNode,
  useStoreState,
  useZoomPanHelper,
} from 'react-flow-renderer';
import TestFlow from './flows/TestFlow';
import './dnd.css';
import { NODE_IDS, NODE_TYPE, FRAGMENT_TYPE } from './const';
import { getRandom, uniq } from './utils';
import { TEST_CONF } from './config';

import TestSidebar from './TestSidebar';

// remove a selected number of random gaps and update the remaining ones
const shrinkGappedText = (gappedText) => {
  const gaps = gappedText.filter(el => el.type === FRAGMENT_TYPE.GAP);
  const gapsToRemove = new Set(getRandom(
    gaps, Math.min(gaps.length, gaps.length - TEST_CONF.NUM_GAPS)));

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

const TestView = ({ rootNodes, currentTest, nextTest, prevTest,
  allElements, shouldLayout, setShouldLayout }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([rootNodes[currentTest]]);
  const [sidebarElements, setSidebarElements] = useState([]);
  // sort them based on ID before including them to avoid unwanted reordering
  const setSidebarSorted = useMemo(() =>
    (updateF) => setSidebarElements((els) => updateF(els).sort((a, b) => a.id - b.id)),
    [setSidebarElements]);

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
    setShouldLayout(true);
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

  const onGapClick = (edge) => {
    setElements(elements => elements.map(el => ({
      ...el,
      animated: el.animated ? false : el.id === edge.id
    })));
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
    const rootNode = rootNodes[currentTest];
    // remove unnecessary gaps
    const { gappedText: rootText, removedGaps } = shrinkGappedText(rootNodes[currentTest].data.gappedText);

    const gapIds = new Set(Array.from(removedGaps).map((el) => el.targetId))
    // get all mentioned nodes, remove the ones that shouldn't be there
    // also add onDelete prop.
    const modifiedNodes = uniq(
      getOutgoers(rootNode, allElements)
        .filter(el => !gapIds.has(el.id))
        .concat(getRandom(
          allElements.filter((node) => isNode(node) && node.type === NODE_TYPE.OUTPUT),
          TEST_CONF.NUM_EXTRA_NODES))
        .map((node) => ({
          ...node,
          id: NODE_IDS.TEST_NODE(node.id),
          type: NODE_TYPE.DETACH_NODE,
        }))
        // separate because we changed id
        .map((node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: () => onClickDeleteIcon(node)
          }
        })),
      (el) => el.id);
    console.log("nodes are: ", modifiedNodes);


    const modifiedRoot = {
      ...rootNode,
      id: NODE_IDS.TEST_NODE(rootNode.id),
      data: {
        ...rootNode.data,
        onGapClick,
        noTargetHandle: true,
        gappedText: rootText,
      }
    };
    setElements([modifiedRoot]);
    setSidebarSorted(() => modifiedNodes);
    setShouldLayout(true);
  }, [setElements, rootNodes, currentTest, allElements, setSidebarSorted, onClickDeleteIcon, setShouldLayout])


  return (
    <div className="dndflow">

      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <TestFlow
          rootNode={rootNodes[currentTest]}
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
      <button
        style={{ position: 'absolute', bottom: '5%', right: '40%', zIndex: '5' }}
        onClick={() => {
          nextTest();
        }}
        disabled={currentTest === rootNodes.length - 1}>
        Next slideeee</button>
      <button style={{ position: 'absolute', bottom: '5%', left: '20%', zIndex: '5' }}
        onClick={() => {
          prevTest();
        }}
        disabled={currentTest === 0}>
        Go back</button>
    </div >
  );
};

export default TestView;