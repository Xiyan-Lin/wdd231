// storage.js - ES Module for Local Storage handling

/**
 * Retrieves a value from Local Storage.
 * @param {string} key The key to retrieve.
 * @returns {any | null} The stored value, or null if not found.
 */
export function getLocalStorage(key) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error reading from local storage:", error);
        return null;
    }
}

/**
 * Stores a value in Local Storage.
 * @param {string} key The key to store.
 * @param {any} value The value to be stored.
 */
export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error writing to local storage:", error);
    }
}