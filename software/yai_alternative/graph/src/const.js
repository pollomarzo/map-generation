export const EDGE_TYPE = {
    STRAIGHT: 'straight'
};

export const NODE_TYPE = {
    INPUT: 'input',
    DEFAULT: 'default',
    OUTPUT: 'output',
    COLLAPSE_NODE: 'collapseNode',
    DETACH_NODE: 'detachNode'
};

export const NODE_DATA_TYPE = {
    QUESTION: 'question',
    FACTOR: 'factor',
    ABSTRACT: 'abstract',
    DECISION: 'decision',
}

export const NODE_IDS = {
    DECISION_NODE: 'decision_node',
    QUESTION_NODE: (topicId, question) => `${topicId}-${question}`,
    TEST_NODE: (oldId) => `${oldId}-test`,
};

export const EDGE_IDS = {
    FACTOR_EDGE: (id) => `${NODE_IDS.DECISION_NODE}-${id}-edge`,
    ABSTRACT_EDGE: (subjId, topicId) => `${subjId}-${topicId}-edge`,
    TOPIC_QUESTION_EDGE: (topicId, question) => `${NODE_IDS.QUESTION_NODE(topicId, question)}-edge`,
    QUESTION_NODE_EDGE: (topicId, question, nodeId) => `${NODE_IDS.QUESTION_NODE(topicId, question)}-${nodeId}-edge`,
    TEST_EDGE: (rootId, targetId) => `${rootId}-${targetId}-test-edge`,
};

export const EDGE_DATA_TYPE = {
    QUESTION: 'question'
}

// in abstracts and questions, there are pieces of text and gaps
export const FRAGMENT_TYPE = {
    PIECE: 'piece',
    GAP: 'gap',
};

export const HANDLE_TYPE = {
    SOURCE: 'source',
    TARGET: 'target',
};

// since we need to attach directly to handle, better keep it const
export const COLLAPSE_HANDLE_IDS = {
    DEFAULT: 'default',
    QUESTIONS: 'questions',
    GAP_HANDLE_ID: (nodeId, targetId) => `${nodeId}_${targetId}_handle`,
}