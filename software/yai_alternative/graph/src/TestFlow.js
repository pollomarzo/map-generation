import LayoutFlow from './LayoutFlow';
import { useEffect, useMemo, useState } from 'react';
import {
    useZoomPanHelper,
    removeElements,
    addEdge,
    isEdge,
    useStoreState,
    getOutgoers
} from 'react-flow-renderer';
import { COLLAPSE_HANDLE_IDS, EDGE_IDS, NODE_TYPE, FRAGMENT_TYPE } from './const';
import { getRandom } from './utils';
import { TEST_CONF } from './config';


const TestFlow = ({ rootNode, allElements, shouldLayout, setShouldLayout }) => {
    const [elements, setElements] = useState([rootNode]);
    const { fitView } = useZoomPanHelper();
    const edges = useMemo(() => elements.filter(isEdge), [elements]);

    const onRemoveEdge = (edge, targetId) => {
        const node = elements.find((el) => targetId === el.id);
        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                connected: false
            }
        };
        setElements(els => [updatedNode, ...removeElements([updatedNode, edge], els)]);
    }

    const onGapClick = (edge) => {
        setElements(elements => elements.map(el => ({
            ...el,
            animated: el.animated ? false : el.id === edge.id
        })));
    };

    const shrinkGappedText = (gappedText) => {
        const gaps = gappedText.filter(el => el.type === FRAGMENT_TYPE.GAP);
        const gapsToRemove = new Set(getRandom(
            gaps, Math.min(gaps.length, gaps.length - TEST_CONF.NUM_GAPS)));
        //
        return {
            gappedText: gappedText.map((el) => {
                if (el.type === FRAGMENT_TYPE.GAP && gapsToRemove.has(el)) return {
                    type: FRAGMENT_TYPE.PIECE,
                    text: el.text,
                }
                return el;
            }), removedGaps: gapsToRemove
        }

    };

    useEffect(() => {
        // remove unnecessary gaps
        const { gappedText: rootText, removedGaps } = shrinkGappedText(rootNode.data.gappedText);
        const gapIds = new Set(Array.from(removedGaps).map((el) => el.targetId))
        // get all mentioned nodes, remove the ones that shouldn't be there
        const modifiedNodes = getOutgoers(rootNode, allElements)
            .filter(el => !gapIds.has(el.id))
            .map((node) => ({
                ...node,
                type: NODE_TYPE.DETACH_NODE
            }
            ));

        const modifiedRoot = {
            ...rootNode,
            data: {
                ...rootNode.data,
                onGapClick,
                noTargetHandle: true,
                gappedText: rootText,
            }
        };
        setElements([modifiedRoot, ...modifiedNodes])
    }, [setElements, rootNode, allElements])

    // on render, view should be reset. might change later
    useEffect(() => {
        fitView({ padding: 0.5 });
        setShouldLayout(true);
    }, [fitView, setShouldLayout]);




    const onConnect = params => {
        // make sure the edge doesn't exist already. only one edge per handle
        if (!edges.find(edge => edge.sourceHandle === params.sourceHandle || edge.target === params.target)) {
            const edgeId = EDGE_IDS.TEST_EDGE(rootNode.id, params.target);
            const newEdge = {
                ...params,
                id: edgeId,
                animated: false,
                data: { type: 'test' }
            }
            let node = elements.find((el) => el.id === params.target);
            const remainingElements = elements.filter((el) => el.id !== params.target);
            node = {
                ...node,
                data: {
                    ...node.data,
                    onHandleClick: () => onRemoveEdge(newEdge, params.target),
                    connected: true,
                }
            };
            setElements([...remainingElements, node, newEdge]);
        }
    };
    // source: "my:risk-What?"
    // sourceHandle: "default"
    // target: "my:borrower"
    // targetHandle: null


    return (
        <LayoutFlow
            elements={elements} // put setView in useEffect on render []
            setElements={setElements}
            onConnect={onConnect}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}

        />);
};
export default TestFlow;