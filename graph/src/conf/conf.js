export const NAV = {
    START: -1,
    CREATE: 0,
    REVIEW: 1,
    YAI: 2,
    RECREATE: 3,
    RESULT: 4
}

export const TIME = [
    500, // CREATE
    500, // REVIEW
    800, // YAI
    500, // RECREATE
    10000, // RESULT
]

export const TEXT = [
    "ciao",
    <div>
        <p>
            Thank you for creating your first concept map. In the next {TIME[NAV.CREATE]} seconds,
            please review the concept map you created and the mistakes you made. </p>
        <p> Your objective going forward will be to try to get a better concept map, as good as you can make it.
            In order to reach this goal, you will be redirected to an explanatory software. Use it
            to get a fuller understanding of the topic.</p>
        <p>Once the timer expires, you will be brought back here, to create the new concept map. </p>
        <strong>Thank you for your cooperation!</strong></div>,
    <div>
        <p>
            You will now be redirected to the explanatory software. There, you will have some time
            to correct as many of the mistakes you made as you can.
        </p>
        <strong>Thank you for your cooperation!</strong></div>,
    "make it again thanks",
    "here's your result",
    "this is the end"
]