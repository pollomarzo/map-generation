import LayoutFlow from './LayoutFlow';
import {
    useZoomPanHelper,
    removeElements,
    isEdge,
} from 'react-flow-renderer';
import { EDGE_IDS, NODE_IDS } from '../const';


const TestFlow = ({
    elements, setElements,
    shouldLayout,
    setShouldLayout,
    flowProps }) => {
    const edges = elements.filter(isEdge);
    const { fitView: originalFitView, zoomTo } = useZoomPanHelper();



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



    const fitView = (nodes) => {
        // const node = nodes[0];
        // if (node) {
        //     fitted = true;
        //     const x = node.__rf.position.x + node.__rf.width;
        //     const y = node.__rf.position.y + node.__rf.height;
        //     const zoom = 0.90;
        //     setCenter(x, y, zoom);
        // }
        // console.log("setting shouldFitView to: ", !fitted);
        originalFitView();
        zoomTo(0.85);
        return true;
    }

    const onConnect = params => {
        console.log("params: ", params);
        // make sure the edge doesn't exist already. only one edge per handle
        if (!edges.find(edge => edge.sourceHandle === params.sourceHandle || edge.target === params.target)) {
            const edgeId = `${params.source}-${params.target}-edge`;
            const newEdge = {
                ...params,
                id: edgeId,
                animated: false,
                data: { type: 'test' }
            }
            const oldNode = elements.find((el) => el.id === params.target);
            const newNode = {
                ...oldNode,
                data: {
                    ...oldNode.data,
                    onHandleClick: () => onRemoveEdge(newEdge, params.target),
                    connected: true,
                }
            };
            setElements(elements => [...removeElements([oldNode], elements), newNode, newEdge]);
        }
    };


    return (
        <>
            <LayoutFlow
                elements={elements} // put setView in useEffect on render []
                fitView={fitView}
                setElements={setElements}
                shouldLayout={shouldLayout}
                setShouldLayout={setShouldLayout}
                flowProps={{
                    ...flowProps,
                    onConnect
                }}
            />);
        </>)
};
export default TestFlow;