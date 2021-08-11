import LayoutFlow from './LayoutFlow';
import {
    useZoomPanHelper,
    removeElements,
    isEdge,
} from 'react-flow-renderer';
import { EDGE_IDS, NODE_IDS } from '../const';


const Flow = ({
    elements, setElements,
    shouldLayout,
    setShouldLayout,
    flowProps }) => {
    const { fitView: originalFitView, zoomTo } = useZoomPanHelper();

    const onRemoveEdge = (edge, targetId) => setElements(els => [...removeElements([edge], els)]);



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
        console.log("connecting params: ", params);
        // make sure the two nodes are different types
        const sourceType = elements.find(el => el.id === params.source).data.type;
        const targetType = elements.find(el => el.id === params.target).data.type;

        if (sourceType !== targetType) {
            const edgeId = `${params.source}-${params.target}-edge`;
            let newEdge = {
                ...params,
                id: edgeId,
                animated: false,
                data: {
                    onClick: () => onRemoveEdge(newEdge, newEdge.target),
                }
            }
            setElements(elements => [...elements, newEdge]);
        }
    };

    const onElementClick = (_, el) => {
        if (isEdge(el)) {
            onRemoveEdge(el, el.target);
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
                    onConnect,
                    onElementClick,
                }}
            />);
        </>)
};
export default Flow;