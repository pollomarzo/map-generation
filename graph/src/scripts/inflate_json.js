let graph = require('./CA_concept_map_small.json')
let fs = require('fs')

function uniq(arr, f) {
    let seen = new Set();
    return arr.filter(item => {
        let k = f(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

const NODE_DATA_TYPE = {
    NODE: 'node',
    EDGE_LABEL: 'edge_label',
};

let nodes = graph.nodes
let edges = graph.links

// we need to return both correct nodes and edges
// and available nodes and labels.

//available nodes
let inflatedNodes = nodes.map((node) => ({
    id: node.id,
    data: {
        label: node.id,
        type: NODE_DATA_TYPE.NODE,
    },
    position: {
        x: 0,
        y: 0,
    }
}));

// available labels
let inflatedLabels = edges.map((edge) => ({
    id: edge.r,
    data: {
        label: edge.r,
        type: NODE_DATA_TYPE.EDGE_LABEL,
    },
    position: {
        "x": 0,
        "y": 0
    }
}));

inflatedLabels = uniq(inflatedLabels, label => label.id);

let correctNodes = [...inflatedNodes, ...inflatedLabels];

let correctEdges = edges.map((edge) => ([
    {
        id: `${edge.source}-${edge.r}-edge`,
        source: edge.source,
        target: edge.r
    },
    {
        id: `${edge.r}-${edge.target}-edge`,
        source: edge.r,
        target: edge.target,
    }])).flat();

fs.writeFile('correct.json',
    JSON.stringify({ nodes: correctNodes, edges: correctEdges }, null, 4), (err) => {
        if (err) {
            throw err;
        }
    });

fs.writeFile('nodes.json',
    JSON.stringify(inflatedNodes, null, 4), (err) => {
        if (err) {
            throw err;
        }
    });

fs.writeFile('labels.json',
    JSON.stringify(inflatedLabels, null, 4), (err) => {
        if (err) {
            throw err;
        }
    });

