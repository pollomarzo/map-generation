import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    isNode,
    useStoreState,
    Position,
    Controls,
    ControlButton,
    useStoreActions,
    useZoomPanHelper
} from 'react-flow-renderer';
import dagre from 'dagre';
import CollapseNode from '../custom_nodes/CollapseNode';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import DetachNode from '../custom_nodes/DetachNode';


const nodeTypes = {
    collapseNode: CollapseNode,
    detachNode: DetachNode,
};

const dagreGraph = new dagre.graphlib.Graph()
    .setGraph({ rankdir: 'LR', edgesep: 10, ranksep: 100, nodesep: 20 });

const LayoutFlow = ({
    elements, setElements,
    shouldLayout, setShouldLayout,
    fitView,
    onElementsRemove,
    flowProps }) => {

    const { onElementClick,
        onConnect,
        onDrop,
        onDragOver,
        onLoad } = flowProps;

    const [shouldFitView, setShouldFitView] = useState(false);
    const nodes = useStoreState(store => store.nodes);
    const edges = useStoreState(store => store.edges);

    const onLayout = useCallback(() => {
        console.log("in onLayout, nodes are: ", nodes);
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        console.log("reviewing layout...");
        nodes.forEach((el) =>
            dagreGraph.setNode(el.id, { width: el.__rf.width, height: el.__rf.height })
        );
        edges.forEach((ed) =>
            dagreGraph.setEdge(ed.source, ed.target));

        dagre.layout(dagreGraph);
        let layouted = false;

        const layoutedElements = elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                // because of rendering sometimes this gets called too early. 
                // not the greatest fix, but...
                if (nodeWithPosition) {
                    layouted = true;
                    el.targetPosition = Position.Left;
                    el.sourcePosition = Position.Right;
                    // we need to pass a slighlty different position in order to notify react flow about the change
                    el.position = {
                        x: nodeWithPosition.x - nodeWithPosition.width / 2 + Math.random() / 1000,
                        y: nodeWithPosition.y - nodeWithPosition.height / 2,
                    };
                }
                else return el
            }

            return el;
        });
        console.log(layouted ? "actually doing something!" : "didn't really layout anything");

        setElements(layoutedElements);
        return layouted;
    }, [edges, elements, nodes, setElements]);

    useEffect(() => {
        if (shouldLayout && nodes.length > 0 &&
            nodes.every((node) => node.__rf.width &&
                node.__rf.height)) {
            const layouted = onLayout();

            setShouldLayout(false);
            setShouldFitView(true);
        }
    }, [elements, nodes, onLayout, shouldLayout, setShouldLayout]);

    useEffect(() => {
        if (shouldFitView && fitView) {
            console.log("asing for new fit");
            const fitted = fitView(nodes);
            setShouldFitView(!fitted);
        }
    }, [shouldFitView, fitView, nodes]);


    return (
        <div className="layoutflow" style={{ height: '100%' }}>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                nodeTypes={nodeTypes}
                elementsSelectable={false}
                onElementClick={onElementClick}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onLoad={onLoad}
                onlyRenderVisibleElements={false}
            >
                <Controls showInteractive={false}>
                    <ControlButton onClick={() => { setShouldLayout(true); /* reactFlowInstance.fitView();  */ }}>
                        <FilterCenterFocusIcon />
                    </ControlButton>
                </Controls>
            </ReactFlow>
        </div >
    );
};

export default LayoutFlow;
