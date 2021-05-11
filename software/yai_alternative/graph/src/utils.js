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
    return nodes.map(node => {
        let abstract = abstracts.find((abstract) => abstract.original_uri === node.id);
        if (abstract)
            return ({
                ...node,
                // if no abstract, no point making a collapse. also different style
                type: 'collapseNode',
                data: {
                    ...node.data,
                    type: 'factor',
                    ans: abstract.text,
                    open: false,
                }
            });
        return node;
    });
}

export const decisionToElements = (is_approved, factors, abstracts) => {
    const startNode = {
        id: 'decision_node',
        type: 'input',
        data: { label: is_approved ? 'YES' : 'NO' },
        position: DEFAULT_POSITION
    };

    let factorsNodes = factors.map((factor) => parseHTMLString(factor)).flat();
    // inflate with abstracts and convert to collapseNode
    factorsNodes = inflateWithAbstracts(factorsNodes, abstracts);

    console.log(factorsNodes);
    // connect start and factors
    const factorsEdges = factorsNodes.map(node => ({
        id: `decision_node-${node.id}-edge`,
        source: 'decision_node',
        target: node.id,
        animated: true,
        arrowHeadType: 'full'
    }));
    return [startNode, ...factorsNodes, ...factorsEdges];
}

export const questionToElements = (
    elements,
    { original_uri, original_label, question, annotated_text, text },
    abstracts
) => {
    let els = parseHTMLString(annotated_text);
    console.log("called with elements: ", elements);
    console.log("and rest: ", original_uri, original_label);
    // find node (or edge) if exist else create it and update existing (thanks ES6 for find!)
    const addNode = (el) => {
        return elements.find(node => node.id === el.id) ||
            elements.push(...inflateWithAbstracts([el], abstracts));
    };

    // topic node
    addNode({
        id: original_uri,
        data: { label: original_label, type: 'topic' },
        position: DEFAULT_POSITION
    });

    // create question node
    const questionId = `${original_uri}-${question}`;
    addNode({
        id: questionId,
        type: 'collapseNode',
        data: {
            label: question,
            type: 'question',
            ans: text,
            open: false
        },
        position: DEFAULT_POSITION
    });

    // attach topic and question
    addNode({
        id: `${questionId}-edge`,
        source: original_uri,
        target: questionId,
        animated: true
    });

    // add single nodes
    els.map(node => addNode({
        id: node.id,
        type: 'output',
        data: { ...node.data, type: 'single' },
        position: node.position
    }));

    // create question-node edges
    els.map(node => (addNode({
        id: `${questionId}-${node.id}-edge`,
        source: questionId,
        target: node.id,
        animated: true,
        arrowHeadType: 'arrow',
    })));
    // order may matter: react-flow renders in order, so may not find yet-to-be-declared ids
    return elements;
}