const STORAGE_KEY = 'placement_prep_history';

export const saveAnalysis = (analysis) => {
    try {
        const history = getHistory();
        const updated = [analysis, ...history];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (e) {
        console.error("Failed to save analysis", e);
        return false;
    }
};

export const getHistory = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Basic schema check
        return parsed.filter(item => item && item.id && item.createdAt);
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
};

export const getAnalysis = (id) => {
    const history = getHistory();
    return history.find(item => item.id === id);
};

export const updateAnalysis = (id, updates) => {
    try {
        const history = getHistory();
        const index = history.findIndex(item => item.id === id);
        if (index === -1) return false;

        const updatedItem = {
            ...history[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        history[index] = updatedItem;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return updatedItem;
    } catch (e) {
        console.error("Failed to update analysis", e);
        return false;
    }
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
