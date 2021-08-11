import React from 'react';
import Modal from 'react-modal';

export const TimeoutModal = ({ isOpen, onClose }) => <Modal
    isOpen={isOpen}
    onRequestClose={() => onClose()}
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
            padding: '10px',
            margin: '10px',
        },
    }}
>
    <p>Your timer has expired.</p>
    <p>Please try again.</p>
</Modal>