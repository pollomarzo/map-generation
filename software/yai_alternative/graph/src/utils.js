import { isNode } from 'react-flow-renderer';
export const annotatedText =
    '<b>Abstract</b>: The «Consolidated <annotation><annotation><span  class="link" data-topic="my:risk">risk</span></annotation></annotation> markers» are an external estimate of <annotation><annotation><span  class="link" data-topic="my:risk">the risk</span></annotation></annotation> that you might not pay back <annotation><annotation><span  class="link" data-topic="my:loan">the loan</span></annotation></annotation>. To <annotation><annotation><span  class="link" data-topic="my:customer">every customer</span></annotation></annotation> (included you) has been associated a value for the external <annotation><annotation><span  class="link" data-topic="my:risk">risk</span></annotation></annotation> estimate, and this value is used to compute <annotation><annotation><span  class="link" data-topic="my:fico_score">the FICO Score</span></annotation></annotation> and to <annotation><annotation><span  class="link" data-topic="my:decide">decide</span></annotation></annotation> whether to assign <annotation><annotation><span  class="link" data-topic="my:loan">the loan</span></annotation></annotation>.';

const SERVER_URL = 'http://localhost:8080'
export const GET_DATA_URL = SERVER_URL + '/data'

const DEFAULT_POSITION = { x: 0, y: 0 }


function uniq(arr, f) {
    let seen = new Set();
    return arr.filter(item => {
        let k = f(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

// extract nodes from HTML string
const parseHTMLString = (text) => {
    var parser = new DOMParser();
    // parse String into HTML
    var htmlDoc = parser.parseFromString(text, 'text/html');

    // get annotations
    const annotationList = [...htmlDoc.getElementsByTagName('annotation')];
    // get spans (all info is in span, ignore the nested annotation)
    const spanList = annotationList.map(elem =>
        elem.getElementsByTagName('span').item(0)
    );
    const cleanSpanList = uniq(spanList, (item) => item.getAttribute('data-topic'));

    // convert to better format
    const nodes = cleanSpanList.map((it, idx) => ({
        id: it.getAttribute('data-topic'),
        data: { label: it.innerText },
        position: { x: 0, y: 0 }
    }));

    return nodes;
}

const inflateWithAbstracts = (nodes, abstracts) => {
    return nodes.reduce((acc, curr) => {
        let abstract = abstracts.find((abstract) => abstract.original_uri === curr.id);
        if (abstract) {
            // which topics were mentioned in the abstract?
            const abstractNodes = parseHTMLString(abstract.annotated_text);
            const inflatedNode = {
                ...curr,
                // if no abstract, no point making a collapse. also different style
                type: 'collapseNode',
                data: {
                    ...curr.data,
                    type: 'factor',
                    ans: abstract.text,
                    open: false,
                }
            };
            const abstractEdges = abstractNodes.map(node => ({
                id: `${curr.id}-${node.id}-edge`,
                source: curr.id,
                target: node.id,
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
        id: 'decision_node',
        type: 'input',
        data: { label: is_approved ? 'YES' : 'NO' },
        position: DEFAULT_POSITION
    };
    let factorsNodes = factors.reduce((acc, factor) => acc.concat(parseHTMLString(factor)), []);
    // connect start and factors
    const factorsEdges = factorsNodes.map(node => ({
        id: `decision_node-${node.id}-edge`,
        source: 'decision_node',
        target: node.id,
        animated: true,
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
    let els = parseHTMLString(annotated_text);

    console.log("MANAGING QUESTION: ", question);
    // topic node
    const topicNode = {
        id: original_uri,
        data: { label: original_label, type: 'topic' },
        position: DEFAULT_POSITION
    };

    // create question node
    const questionId = `${original_uri}-${question}`;
    const questionNode = {
        id: questionId,
        type: 'collapseNode',
        data: {
            label: question,
            type: 'question',
            ans: text,
            open: false
        },
        position: DEFAULT_POSITION
    };

    // attach topic and question
    const tqEdge = {
        id: `${questionId}-edge`,
        source: original_uri,
        target: questionId,
        animated: true
    };

    // add single nodes
    const singleNodes = els.map(node => ({
        id: node.id,
        type: 'output',
        data: { ...node.data, type: 'single' },
        position: node.position
    }));

    // create question-node edges
    const qnEdges = els.map(node => ({
        id: `${questionId}-${node.id}-edge`,
        source: questionId,
        target: node.id,
        animated: true,
        arrowHeadType: 'arrow',
    }));

    // inflate everything with abstracts
    const inflatedNodes = inflateWithAbstracts([topicNode, questionNode, ...singleNodes], abstracts);

    elements = [...inflatedNodes, tqEdge, ...qnEdges].reduce((acc, curr) =>
        addNode(acc, curr), elements);
    // order may matter: react-flow renders in order, so may not find yet-to-be-declared ids
    return elements;
}