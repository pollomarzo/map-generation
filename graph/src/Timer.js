import React from 'react';
import { useNodeContext } from './NodeContext';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const redirect = () => { }

export const Timer = ({ timerKey, duration, onComplete }) => {
    const { navigationState, setNavigationState } = useNodeContext();
    return (
        <div
            style={{
                position: 'fixed',
                top: '30px',
                left: '30px',
                // TODO: what to we wanna do? above? below?
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
                onComplete={() => {
                    onComplete();
                    if (navigationState === 0);
                    else redirect()
                }}
                style={{
                    zIndex: '5',
                }}
            >
                {({ remainingTime }) => {
                    const minutes = Math.floor(remainingTime / 60)
                    const seconds = remainingTime % 60

                    return `${minutes}:${seconds}`
                }}
            </CountdownCircleTimer>
        </div>)
}