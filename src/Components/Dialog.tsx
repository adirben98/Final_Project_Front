import React from 'react';
import './dialog.css'; // Optional: for styling

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // Render nothing if the dialog is not open

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                {title && <div className="dialog-title">{title}</div>}
                <div className="dialog-content">
                    {children}
                </div>
                <div className="dialog-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
