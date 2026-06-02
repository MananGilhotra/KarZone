import { useState, useCallback } from 'react';

// Hook to use toast
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
    const showError = useCallback((msg) => addToast(msg, 'error'), [addToast]);
    const showInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);

    return { toasts, addToast, removeToast, showSuccess, showError, showInfo };
};

export default useToast;
