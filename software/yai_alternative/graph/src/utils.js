import { NODE_TYPE, EDGE_IDS, NODE_IDS, FRAGMENT_TYPE, COLLAPSE_HANDLE_IDS } from './const';

const SERVER_URL = 'http://localhost:8080'
export const GET_DATA_URL = SERVER_URL + '/data'

const DEFAULT_POSITION = { x: 0, y: 0 }

var parser = new DOMParser();

export function uniq(arr, f) {
    let seen = new Set();
    return arr.filter(item => {
        let k = f(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

export function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

// extract nodes from HTML string
const parseHTMLString = (text, parentNodeId) => {

    // parse String into HTML
    var htmlDoc = parser.parseFromString(text, 'text/html');
    const cleanText = text.replace(/<[^>]+>/g, '');

    // get annotations
    const annotationList = [...htmlDoc.getElementsByTagName('annotation')];
    // get spans (all info is in span, ignore the nested annotation)
    const spanList = annotationList.map(elem =>
        elem.getElementsByTagName('span').item(0)
    );
    const cleanSpanList = uniq(spanList, (item) => item.getAttribute('data-topic'));

    // create gaps, return an array of strings and gaps
    // could move it to diff func, but still needs spanList
    let restText = cleanText;
    let gappedText = [];
    let label;
    let splitText;
    let rest;
    for (const span of cleanSpanList) {
        label = span.innerText;
        [splitText, ...rest] = restText.split(label);
        // i agree, this looks like shit. more readable than regexes though
        // needed to handle multiple occurrences of label in text
        restText = rest.join(label);
        const targetId = span.getAttribute('data-topic');
        gappedText.push({
            type: FRAGMENT_TYPE.PIECE,
            text: splitText
        });
        gappedText.push({
            type: FRAGMENT_TYPE.GAP,
            text: label,
            handleId: COLLAPSE_HANDLE_IDS.GAP_HANDLE_ID(parentNodeId, targetId),
            targetId: targetId,
            selected: false,
        });
        restText = restText || '';
    }
    gappedText.push({
        type: FRAGMENT_TYPE.PIECE,
        text: restText,
    });

    const nodes = cleanSpanList.map((it) => ({
        id: it.getAttribute('data-topic'),
        type: NODE_TYPE.OUTPUT,
        data: { label: it.innerText },
        position: DEFAULT_POSITION
    }));

    return { nodes, gappedText };
}

const inflateWithAbstracts = (nodes, abstracts) => {
    return nodes.reduce((acc, curr) => {
        let abstract = abstracts.find((abstract) => abstract.original_uri === curr.id);
        if (abstract) {
            // which topics were mentioned in the abstract?
            const { nodes: abstractNodes, gappedText: gaps } =
                parseHTMLString(abstract.annotated_text, curr.id);
            const inflatedNode = {
                ...curr,
                // if no abstract, no point making a collapse. also different style
                type: NODE_TYPE.COLLAPSE_NODE,
                data: {
                    ...curr.data,
                    type: 'factor',
                    gappedText: gaps,
                    open: false,
                }
            };
            const abstractEdges = abstractNodes.map(node => ({
                id: EDGE_IDS.ABSTRACT_EDGE(curr.id, node.id),
                source: curr.id,
                sourceHandle: COLLAPSE_HANDLE_IDS.DEFAULT,
                target: node.id,
                data: {
                    type: 'abstract'
                },
                animated: false
            }));
            // add inflated node, changing props if present
            acc = addNode(acc, inflatedNode, true);

            // add all nodes mentioned in abstract, but don't remove abstract if present
            acc = abstractNodes.reduce((nodes, current) => addNode(nodes, current, false), acc);

            // add all edges
            acc = abstractEdges.reduce((nodes, current) => addNode(nodes, current, false), acc);
            return acc;
        }
        return acc;
    }, nodes);
}

const addNode = (nodes, newNode, updateProps) => {
    // remove existing item
    /* let idx;
    //wanted to use findIndex but not supported
    nodes.some((item, index) => { idx = index; return item.id === newNode.id });
    const existing = nodes.splice(idx, 1)[0]; */
    const exIndex = nodes.findIndex(e => e.id === newNode.id);
    let target = newNode;
    if (exIndex !== -1) target = nodes.splice(exIndex, 1)[0];
    if (updateProps) target = {
        ...target,
        ...newNode
    }
    return [...nodes, target];
}

export const decisionToElements = (is_approved, factors, abstracts) => {
    const startNode = {
        id: NODE_IDS.DECISION_NODE,
        type: NODE_TYPE.INPUT,
        data: { label: is_approved ? 'YES' : 'NO' },
        position: DEFAULT_POSITION
    };
    let factorsNodes = factors.reduce((acc, factor) => acc.concat(parseHTMLString(factor, startNode.id).nodes), []);
    // connect start and factors
    const factorsEdges = factorsNodes.map(node => ({
        id: EDGE_IDS.FACTOR_EDGE(node.id),
        type: NODE_TYPE.OUTPUT,
        source: NODE_IDS.DECISION_NODE,
        sourceHandle: COLLAPSE_HANDLE_IDS.DEFAULT,
        target: node.id,
        animated: false,
        data: {
            type: 'node'
        },
        arrowHeadType: 'full'
    }));
    // inflate with abstracts and convert to collapseNode
    factorsNodes = inflateWithAbstracts(factorsNodes, abstracts);
    return [startNode, ...factorsNodes, ...factorsEdges];
}

export const questionToElements = (
    elements,
    { original_uri, original_label, question, annotated_text, text },
    abstracts
) => {
    const questionId = `${original_uri}-${question}`;
    let { nodes: els, gappedText: gaps } = parseHTMLString(annotated_text, questionId);

    // topic node
    const topicNode = {
        id: original_uri,
        data: {
            label: original_label,
            type: 'topic',
            hasQuestions: true,
        },
        position: DEFAULT_POSITION
    };

    // create question node
    const questionNode = {
        id: NODE_IDS.QUESTION_NODE(original_uri, question),
        type: NODE_TYPE.COLLAPSE_NODE,
        data: {
            label: question,
            type: 'question',
            gappedText: gaps,
            open: false
        },
        position: DEFAULT_POSITION
    };

    // attach topic and question
    const tqEdge = {
        id: EDGE_IDS.TOPIC_QUESTION_EDGE(original_uri, question),
        sourceHandle: COLLAPSE_HANDLE_IDS.QUESTIONS,
        source: original_uri,
        target: questionId,
        data: {
            type: 'question'
        },
        type: 'straight',
        style: { strokeWidth: 3 },
        animated: false
    };

    // add single nodes
    const singleNodes = els.map(node => ({
        id: node.id,
        type: NODE_TYPE.OUTPUT,
        data: { ...node.data, type: 'single' },
        position: node.position
    }));

    // create question-node edges
    const qnEdges = els.map(node => ({
        id: EDGE_IDS.QUESTION_NODE_EDGE(original_uri, question, node.id),
        source: questionId,
        sourceHandle: COLLAPSE_HANDLE_IDS.DEFAULT,
        target: node.id,
        animated: false,
        data: {
            type: 'node'
        },
        style: { strokeWidth: 3 },
    }));

    // inflate everything with abstracts
    const inflatedNodes = inflateWithAbstracts([topicNode, questionNode, ...singleNodes], abstracts);

    elements = [...inflatedNodes, tqEdge, ...qnEdges].reduce((acc, curr) =>
        addNode(acc, curr, true), elements);
    // order may matter: react-flow renders in order, so may not find yet-to-be-declared ids
    return elements;
}