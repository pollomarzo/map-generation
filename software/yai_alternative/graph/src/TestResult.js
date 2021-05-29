import { TEST_CONF } from './config';

// honestly, I'm not sure what I'm supposed to do with these answers
// going to do some simple "aggregations" and call it a day
const TestResult = ({ answers }) => {
  const correctByNode = answers.map((ans) => ans.reduce((a, c) => a + (c.correct ? 1 : 0), 0));
  const correctOverall = correctByNode.reduce((a, c) => a + c, 0);
  const emptyAns = answers.flat().reduce((a, c) => a + (c.connected ? 0 : 1), 0);

  const averageCorrect = correctOverall / (TEST_CONF.NUM_NODES * TEST_CONF.NUM_GAPS);
  // ill leave these here if someone needs the data.. but i haven't reaaaally checked
  const averageCorrectByNode = correctByNode.map(correct => correct / TEST_CONF.NUM_GAPS);
  const mode = correctByNode.sort()[0];
  const median = correctByNode.sort()[Math.floor(TEST_CONF.NUM_NODES / 2)]
  console.log("averageCorrectByNode", averageCorrectByNode);
  console.log("mode", mode)
  console.log("median", median)
  console.log("sorted", correctByNode.sort().reverse());
  const round = num => (Math.round(num * 100) / 100).toFixed(2);

  const text = [
    `Overall, you got ${correctOverall} connections correct.`,
    `You left ${emptyAns} gaps unfilled.`,
    `On average, you got ${round(averageCorrect * 100)}% correct connections for each node.`];

  return (
    <div>
      {text.map((text, idx) => <div key={idx}>{text}</div>)}
      {/** charts or something? */}

    </div>)
};

export default TestResult;