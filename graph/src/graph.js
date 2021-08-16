import { nodes as correctNodes, edges as correctEdges } from './conf';
import { isNode } from 'react-flow-renderer';


/**
 * For given arrays of nodes and edges, check if the graph is correct.
 * Returns an object with 4 arrays, 2 for nodes and 2 for edges.
 * The arrays are ordered on ID. Props are maintained.
 * The 2 arrays are one for correct/incorrect and one for missing.
 * In 'nodes' and 'edges', each node is an object with the following properties:
 * - id: the id of the node
 * - correct: true if the node is correct, false otherwise
 * */
const correct = (elements, corrNodes, corrEdges) => {
    let nodes = [], edges = [], missingNodes = [], missingEdges = [];
    elements.map(el => isNode(el) ? nodes.push(el) : edges.push(el));

    // sort to allow for a single pass
    nodes = nodes.sort((a, b) => a.id < b.id ? -1 : 1);
    edges = edges.sort((a, b) => a.id < b.id ? -1 : 1);

    corrNodes = corrNodes.sort((a, b) => a.id < b.id ? -1 : 1);
    corrEdges = corrEdges.sort((a, b) => a.id < b.id ? -1 : 1);

    ({ nodes, missingNodes }) = verify(nodes, corrNodes, (a, b) => a.originalId === b.id);
    ({ edges, missingEdges }) = verify(edges, corrEdges, (a, b) =>
        a.sourceOriginalId === b.source &&
        a.targetOriginalId === b.target);
    return { nodes, edges, missingNodes, missingEdges };

}

const verify = (els, corrEls, equal) => {
    let i = 0, j = 0;
    let nodes = [], missing = [];
    while (i < els.length && j < corrEls.length) {
        if (equal(els[i], corrEls[j])) {
            nodes.push({
                ...els[i],
                correct: true
            });
            i++;
            j++;
        } else if (els[i].id < corrEls[j].id) {
            nodes.push({
                ...els[i],
                correct: false
            });
            i++;
        } else {
            // take note that it's missing
            missing.push(corrEls[j]);
            j++;
        }
    }
    return {
        nodes,
        missing
    };
}