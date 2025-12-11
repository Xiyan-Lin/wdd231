// main.js - General DOM manipulation and global event listeners

import { setLocalStorage } from './storage.js';

// --- 1. Navigation Event Listener (Hamburger Menu) ---
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Simple Wayfinding: Add 'active' class to current page link
    const path = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// --- 2. Local Storage Implementation (User Preference Example) ---
function setupPreferenceStorage() {
    const preferenceKey = 'userThemePreference';
    
    // Check if preference has been set (optional: display a message)
    const storedPreference = document.getElementById('user-preference');
    if (storedPreference) {
        const theme = setLocalStorage(preferenceKey, 'light'); // Set a default preference on first load

        // Example: Display preference status (on home page only)
        if (theme) {
            storedPreference.textContent = `Preference stored: Light theme set.`;
        }
    }
}

// --- 3. Run on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();

    // Check if we are on the index.html page to run storage setup
    if (window.location.pathname.includes('index.html') || window.location.pathname.split('/').pop() === '') {
        setupPreferenceStorage();
    }
    
    // Set current year in footer
    const currentYear = document.getElementById('currentyear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});