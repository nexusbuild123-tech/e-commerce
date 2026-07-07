import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { listenForRefresh } from '../utils/broadcast';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Auto-refresh when admin broadcasts
    useEffect(() => {
        const unlisten = listenForRefresh(() => {
            triggerRefresh();
        });
        return unlisten;
    }, [triggerRefresh]);

    return (
        <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRefresh = () => useContext(RefreshContext);