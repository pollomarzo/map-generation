const EXPERIMENT_SUBJECT = 'Heart disease predictors'
const MAP_CODE_REPO = "https://github.com/pollomarzo/map-generation"
const YAI_CODE_REPO = "https://github.com/Francesco-Sovrano/YAI4Hu"


export const URL = {
    YAI_START: '',
    YAI_FULL: '',
    SAVE_RESULTS: 'http://localhost:8081'
}

export const NAV = {
    START: -1,
    CREATE: 0,
    REVIEW: 1,
    RECREATE: 2,
    RESULT: 3
}


export const TIME = [
    300, // CREATE
    180, // REVIEW
    300, // RECREATE
    120, // RESULT
]

export const TEXT = [
    // CREATE
    <div>
        <p>
            Welcome to the experiment! Thank you for your participation.
        </p>
        <p>
            In this experiment, you will be asked to create concept maps about the concept of <b>{EXPERIMENT_SUBJECT}</b>, with and without the help of an explanatory system.
        </p>
        <p>
            Once you click "close", we'll open a web page with a few useful links for creating your first concept map.
            To create a concept map, drag a node from the list on the right to the concept map on the left. To attach it to a new node, either drop the new node on top of it or drag the handle to the new node. To remove a node, click the trash icon. Remember, you can only connect nodes of different types (a concept with a relationship, and a relationship with a concept).
        </p>
        <p>
            If you feel you're done, you can always move to the next stage by clicking "FINISH" in the top left corner.
        </p>
    </div>,
    // REVIEW
    <div>
        <p>
            Thank you for creating your first concept map. In the next {TIME[NAV.CREATE]} seconds,
            please review the concept map you created and the mistakes you made. The nodes and edges that were correctly included will be <b>green</b>, while your mistakes will be coloured in <b>red</b>.
        </p>
        <p>
            Your objective going forward will be to try to get a better concept map, as good as you can make it, so pay attention to what you got wrong. Remember: if you feel you're done, you can always move to the next stage by clicking "FINISH" in the top left.
        </p>
    </div>,
    // RECREATE
    <div>
        <p>
            Now, please recreate the concept map you created in the previous step, while making as few mistakes as possible.
        </p>
        <p>
            To reach this goal, we will open an explanatory software <b>in a new tab</b>. Use it
            to get a fuller understanding of the topic and to create the new concept map.
        </p>
        <strong>Thank you for your cooperation!</strong></div>,
    <div>
        Here's how you did. We've saved your results, but feel free to look around if you're curious how you did.
    </div>,
    <div>
        <p>
            Thanks for sticking around! We appreciate your dedication and your time, but there really is nothing else.
        </p>
        <p>
            If you want to see the source code for this page, you can find it <a href={MAP_CODE_REPO} target="_blank" rel="noreferrer">here</a>. If instead you're curious about how YAI works, check it out <a href={YAI_CODE_REPO} target="_blank" rel="noreferrer">here</a>. Thanks again for your participation, and we hope you enjoyed the experiment!
        </p>
    </div>
]

export const TITLES = [
    "Part 1: Creation",
    "Part 2: Review",
    "Part 3: Recreate",
    "Part 4: Results",
    "Conclusion"
]