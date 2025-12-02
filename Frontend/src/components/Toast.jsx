import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: {
            bg: 'bg-green-500/90',
            border: 'border-green-400',
            icon: <FaCheckCircle className="text-xl" />
        },
        error: {
            bg: 'bg-red-500/90',
            border: 'border-red-400',
            icon: <FaExclamationCircle className="text-xl" />
        },
        info: {
            bg: 'bg-blue-500/90',
            border: 'border-blue-400',
            icon: <FaTimesCircle className="text-xl" />
        }
    };

    const style = typeStyles[type] || typeStyles.success;

    return (
        <div
            className={`fixed top-20 right-4 z-[100] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
        >
            <div
                className={`${style.bg} backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl border ${style.border} flex items-center gap-3 min-w-[300px] max-w-md`}
            >
                {style.icon}
                <p className="flex-1 font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

// Toast Container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-4 z-[100] space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

// Hook to use toast
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, addToast, removeToast, showSuccess: (msg) => addToast(msg, 'success'), showError: (msg) => addToast(msg, 'error'), showInfo: (msg) => addToast(msg, 'info') };
};

export default Toast;
