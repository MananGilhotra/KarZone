import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        warning: {
            icon: 'text-yellow-400',
            iconBg: 'bg-yellow-500/20',
            border: 'border-yellow-500/30',
            button: 'bg-yellow-500 hover:bg-yellow-600'
        },
        danger: {
            icon: 'text-red-400',
            iconBg: 'bg-red-500/20',
            border: 'border-red-500/30',
            button: 'bg-red-500 hover:bg-red-600'
        },
        info: {
            icon: 'text-blue-400',
            iconBg: 'bg-blue-500/20',
            border: 'border-blue-500/30',
            button: 'bg-blue-500 hover:bg-blue-600'
        }
    };

    const style = typeStyles[type] || typeStyles.warning;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-fadeIn">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl animate-slideUp">
                
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`${style.iconBg} ${style.icon} p-3 rounded-xl border ${style.border}`}>
                            <FaExclamationTriangle className="text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Close"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                
                <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

                
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all font-medium border border-gray-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3 ${style.button} text-white rounded-xl transition-all font-medium shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
