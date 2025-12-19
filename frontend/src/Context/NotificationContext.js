import React, { createContext, useState, useCallback } from 'react';
import Toast from '../Components/Toast/Toast';

export const NotificationContext = createContext({
    notification: null,
    notify: (message, type = 'info') => { },
    hideNotification: () => { },
});

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const notify = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        // Auto-hide after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, notify, hideNotification }}>
            {children}
            <Toast
                message={notification?.message}
                type={notification?.type}
                onClose={hideNotification}
            />
        </NotificationContext.Provider>
    );
};
