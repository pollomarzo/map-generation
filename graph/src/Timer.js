import React from 'react';
import { useNodeContext } from './NodeContext';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const redirect = () => { }

const padZero = n => n < 10 ? `0${n}` : n;

export const Timer = ({ timerKey, duration, onComplete }) => {
    const complete = () => {
        console.log("CLICKED!")
        onComplete();
    }
    return (
        <div
            style={{
                position: 'fixed',
                top: '30px',
                left: '30px',
                // TODO: what to we wanna do? above? below?
                zIndex: '5',
            }}>
            <CountdownCircleTimer
                key={timerKey}
                isPlaying={true}
                duration={duration}
                colors={[
                    ['#004777', 0.33],
                    ['#F7B801', 0.33],
                    ['#A30000', 0.33],
                ]}
                onComplete={complete}
                style={{
                    zIndex: '5',
                }}
            >
                {({ remainingTime }) => {
                    const minutes = Math.floor(remainingTime / 60)
                    const seconds = remainingTime % 60

                    return <div style={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-evenly', textAlign: 'center'
                    }}>
                        {padZero(minutes)}:{padZero(seconds)}
                        <button onClick={() => complete()}>
                            FINISH
                        </button>
                    </div>
                }}

            </CountdownCircleTimer >
        </div >)
}