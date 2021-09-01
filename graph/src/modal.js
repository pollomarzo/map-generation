import React from 'react';
import Modal from 'react-modal';
import {
    TIME, TEXT, NAV, URL, TITLES,
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
                            backgroundColor: '#ddbaf2',
                            border: '1px solid #000',
                            borderRadius: '3px',
                            padding: '10px 20px',
                            fontSize: '1em',
                            color: '#000',
                            justifyContent: 'flex-end',
                            width: 200,
                            marginTop: '10px',
                            cursor: 'pointer',
                        }}>
                        <span>Next</span>
                    </button>
                </div>}
            </div>
        </Modal>)
}

const check_and_open = (url) => {
    if (url && url.length > 0) {
        window.open(url, '_blank');
    }
}

export const TimeoutModal = ({ isOpen, nextSection }) => {
    const { setShowResults } = useNodeContext();
    const { navigationState, setNavigationState } = useNavigationContext();

    const onClose = () => {
        nextSection(TIME[navigationState + 1]);
        switch (navigationState) {
            case NAV.START:
                check_and_open(URL.YAI_START);
            case NAV.CREATE:
                setShowResults(true);
                break;
            case NAV.REVIEW:
                check_and_open(URL.YAI_FULL);
                setShowResults(false);
                break;
            case NAV.RECREATE:
                setShowResults(true);
                break;
        }
        console.log("moving to state: ", navigationState + 1);
        setNavigationState(state => state + 1);
    }

    return <Modal__
        isOpen={isOpen}
        onClose={onClose}
        closable={navigationState !== NAV.RESULT}
        // + 1 because we want to show the introduction to the next section
        title={TITLES[navigationState + 1]}
        content={TEXT[navigationState + 1]}
    />
}