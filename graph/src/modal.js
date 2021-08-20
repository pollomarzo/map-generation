import React from 'react';
import Modal from 'react-modal';
import {
    TIME, TEXT, NAV
} from './conf'
import { useNodeContext } from './NodeContext';
import { useNavigationContext } from './NavigationContext';

const Modal__ = ({ isOpen, onClose, closable, title, content }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Timer expired"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '6',
                },
                content: {
                    backgroundColor: '#fff',
                    border: '1px solid #000',
                    borderRadius: '3px',
                    padding: '30px 60px',
                    margin: '100px',
                    fontSize: '1.5em',
                },
            }}
            shouldCloseOnEsc={closable}
            shouldCloseOnOverlayClick={closable}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            }}>
                <h2>{title}</h2>

                <div style={{ flexGrow: 1 }}>{content}</div>
                {closable && <div style={{ flex: '0 1 150px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            float: 'right',
                            backgroundColor: '#fff',
                            border: '1px solid #000',
                            borderRadius: '3px',
                            padding: '10px 20px',
                            fontSize: '1em',
                            color: '#000',
                            justifyContent: 'flex-end',
                            width: 200,
                            marginTop: '10px',
                        }}>
                        <span>Close</span>
                    </button>
                </div>}
            </div>
        </Modal>)
}

export const TimeoutModal = ({ isOpen, nextSection }) => {
    const { setShowResults } = useNodeContext();
    const { navigationState, setNavigationState } = useNavigationContext();
    console.log("navigationSTate is ", navigationState);

    const onClose = () => {
        nextSection(TIME[navigationState + 1]);
        if (navigationState === NAV.CREATE ||
            navigationState === NAV.RECREATE) setShowResults(true)
        if (navigationState === NAV.REVIEW) setShowResults(false)
        console.log("MOOOVING TO ", navigationState + 1)
        setNavigationState(state => state + 1);
    }

    return <Modal__
        isOpen={isOpen}
        onClose={onClose}
        closable={navigationState !== NAV.RESULT}
        title={"REMEMBER TO INCLUDE ACTUAL TITLES"}
        // is this right? might be old so showing incorrect version
        content={TEXT[navigationState + 1]}
    />
}