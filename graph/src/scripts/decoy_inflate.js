let decoys = require('./decoys.json');
let fs = require('fs')

const DECOY_AMOUNT = 10;


decoys = decoys.slice(0, DECOY_AMOUNT);

decoys = decoys.map(decoy => ({
    id: decoy,
    data: {
        label: decoy,
        type: "node",
    },
    position: {
        x: 0,
        y: 0,
    }
}))

fs.writeFile('../conf/decoyNodes.json',
    JSON.stringify(decoys, null, 4), (err) => {
        if (err) {
            throw err;
        }
    });