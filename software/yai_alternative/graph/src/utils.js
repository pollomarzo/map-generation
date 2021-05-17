import { isNode } from 'react-flow-renderer';

const SERVER_URL = 'http://localhost:8080'
export const GET_DATA_URL = SERVER_URL + '/data'

const DEFAULT_POSITION = { x: 0, y: 0 }

var parser = new DOMParser();

function uniq(arr, f) {
    let seen = new Set();
    return arr.filter(item => {
        let k = f(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

// extract nodes from HTML string
const parseHTMLString = (text) => {

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
        gappedText.push({
            type: 'piece',
            text: splitText
        });
        gappedText.push({
            type: 'gap',
            targetId: span.getAttribute('data-topic'),
            text: label
        });
        restText = restText || '';
    }
    gappedText.push({
        type: 'piece',
        text: restText,
    });

    const nodes = cleanSpanList.map((it) => ({
        id: it.getAttribute('data-topic'),
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
            const { nodes: abstractNodes, gappedText: gaps } = parseHTMLString(abstract.annotated_text);
            const inflatedNode = {
                ...curr,
                // if no abstract, no point making a collapse. also different style
                type: 'collapseNode',
                data: {
                    ...curr.data,
                    type: 'factor',
                    gappedText: gaps,
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
    let factorsNodes = factors.reduce((acc, factor) => acc.concat(parseHTMLString(factor).nodes), []);
    // connect start and factors
    const factorsEdges = factorsNodes.map(node => ({
        id: `decision_node-${node.id}-edge`,
        source: 'decision_node',
        target: node.id,
        animated: false,
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
    let { nodes: els, gappedText: gaps } = parseHTMLString(annotated_text);

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
            gappedText: gaps,
            open: false
        },
        position: DEFAULT_POSITION
    };

    // attach topic and question
    const tqEdge = {
        id: `${questionId}-edge`,
        source: original_uri,
        target: questionId,
        animated: false
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
        animated: false,
        arrowHeadType: 'arrow',
    }));

    // inflate everything with abstracts
    const inflatedNodes = inflateWithAbstracts([topicNode, questionNode, ...singleNodes], abstracts);

    elements = [...inflatedNodes, tqEdge, ...qnEdges].reduce((acc, curr) =>
        addNode(acc, curr), elements);
    // order may matter: react-flow renders in order, so may not find yet-to-be-declared ids
    return elements;
}