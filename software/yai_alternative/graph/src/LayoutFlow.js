import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    isNode,
    useStoreState,
    Position,
    Controls,
    ControlButton,
    getConnectedEdges
} from 'react-flow-renderer';
import dagre from 'dagre';
import CollapseNode from './CollapseNode';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';

const dagreGraph = new dagre.graphlib.Graph()
    .setGraph({ rankdir: 'LR', edgesep: 10, ranksep: 100, nodesep: 20 });
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
    collapseNode: CollapseNode,
};

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height
const direction = 'LR';


const LayoutFlow = ({
    elements, setElements,
    shouldLayout, setShouldLayout,
    onConnect, onElementsRemove }) => {

    const nodes = useStoreState(store => store.nodes);
    const edges = useStoreState(store => store.edges);

    const onElementClick = (_, element) => {
        // if it's a collapse node and we're opening it
        if (element.type === 'collapseNode') {
            const updatedNode = {
                ...element,
                data: {
                    ...element.data,
                    open: !element.data.open
                }
            };
            let modifEdges = getConnectedEdges([element], edges).filter((edge) => edge.source === element.id);
            const remainingNodes = nodes.filter((node) => node.id !== element.id);
            const remainingEdges = removeElements(modifEdges, edges);
            // then we need to update some edges... without CREATING any. just update present ones
            if (element.data.open) {
                modifEdges = modifEdges.map((edge) => ({
                    ...edge,
                    sourceHandle: 'default',
                }))
            }
            else {
                modifEdges = modifEdges.map((edge) => ({
                    ...edge,
                    sourceHandle: `${element.id}_${edge.target}_handle`,
                }))
            }

            setElements([...remainingNodes, updatedNode, ...modifEdges, ...remainingEdges]);

        }
        else console.log(element);
    };

    const onLayout = useCallback(() => {
        console.log("reviewing layout...");
        nodes.forEach((el) =>
            dagreGraph.setNode(el.id, { width: el.__rf.width, height: el.__rf.height })
        );
        edges.forEach((ed) =>
            dagreGraph.setEdge(ed.source, ed.target));

        dagre.layout(dagreGraph);

        const layoutedElements = elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                el.targetPosition = Position.Left;
                el.sourcePosition = Position.Right;
                // we need to pass a slighlty different position in order to notify react flow about the change
                el.position = {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2 + Math.random() / 1000,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                };
            }

            return el;
        });

        setElements(layoutedElements);
    }, [edges, elements, nodes, setElements]);

    useEffect(() => {
        if (shouldLayout && nodes.length > 0 && nodes.every((node) => node.__rf.width && node.__rf.height)) { onLayout(); setShouldLayout(false); }
    }, [elements, nodes, onLayout, shouldLayout, setShouldLayout]);


    return (
        <div className="layoutflow" style={{ height: '100vh' }}>
            {/* <input type="button" text={"layout"} onClick={onLayout} /> */}
            <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                nodeTypes={nodeTypes}
                onElementClick={onElementClick}
                elementsSelectable={false}
            >
                <Controls showInteractive={false}>
                    <ControlButton onClick={onLayout}>
                        <FilterCenterFocusIcon />
                    </ControlButton>
                </Controls>
            </ReactFlow>
        </div>
    );
};

export default LayoutFlow;
