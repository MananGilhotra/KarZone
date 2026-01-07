import { useState } from 'react';

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

export default useToast;
