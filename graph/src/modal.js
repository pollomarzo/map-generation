import React from 'react';
import Modal from 'react-modal';
import { endCreationMessage, endReviewMessage } from './conf'
import { useNodeContext } from './NodeContext';

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

export const TimeoutModal = ({ isOpen, onClose }) => {
    const { navigationState, setNavigationState, setShowResults } = useNodeContext();
    const closable = (navigationState === 0);
    const inCreation = (navigationState === 0);

    return (
        <Modal__
            isOpen={isOpen}
            onClose={() => {
                closable && onClose();
                setNavigationState((nav) => nav + 1);
                setShowResults(true);
            }}
            closable={closable}
            title={`${inCreation ? 'Creation' : 'Review'} section completed!`}
            content={inCreation ? endCreationMessage : endReviewMessage}
        />
    )
}