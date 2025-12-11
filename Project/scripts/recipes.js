// recipes.js - ES Module for handling data fetching and dynamic recipe display

import { getLocalStorage, setLocalStorage } from './storage.js';

const recipeListContainer = document.getElementById('recipe-list');
const localDataKey = 'theGreenPlateRecipes';

// --- 1. Fetch Data Function with Error Handling ---
async function fetchRecipeData() {
    try {
        const response = await fetch('data/recipes.json');
        
        if (!response.ok) {
            // Throw an error if the HTTP status is not 200-299
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Handle response (parsing JSON)
        const data = await response.json();
        
        // Store data in Local Storage for potential later use
        setLocalStorage(localDataKey, data);
        
        return data;

    } catch (error) {
        // Implement try...catch for robust error handling
        console.error("Error fetching recipe data:", error);
        
        // Fallback: Attempt to use local storage data if fetch fails
        return getLocalStorage(localDataKey) || []; 
    }
}

// --- 2. Dynamic Content Generation & Array Method ---
function displayRecipes(recipes) {
    if (!recipeListContainer) return; // Guard clause

    // Clear previous content
    recipeListContainer.innerHTML = '';

    // Array Method: Filter for Vegan recipes (example Array Method)
    // You could also use map() to process data before display.
    const veganRecipes = recipes.filter(recipe => recipe.is_vegan);
    
    // Use forEach to iterate over the filtered array and generate content
    veganRecipes.forEach(recipe => {
        // Template Literals used for string construction
        const cardHTML = `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <img src="${recipe.image_url}" alt="${recipe.name}" loading="lazy" width="400" height="225">
                <div class="card-content">
                    <h3>${recipe.name}</h3>
                    <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
                    <p><strong>Prep Time:</strong> ${recipe.prep_time} min</p>
                    <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
                    <button class="btn-detail" data-id="${recipe.id}">View Details</button>
                </div>
            </div>
        `;
        // DOM Manipulation: Insert new HTML content
        recipeListContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    // Attach event listeners to the new buttons
    setupDetailModal(recipes);
}

// --- 3. Modal Dialog & Event Handling ---
function setupDetailModal(recipes) {
    // 1. DOM Element Selection
    const modal = document.getElementById('recipe-modal');
    const closeBtn = document.querySelector('.close-btn');
    const detailButtons = document.querySelectorAll('.btn-detail');

    // 2. Event Listener for Detail Buttons
    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const recipeId = parseInt(event.target.dataset.id);

            // Array Method: Find the correct recipe object
            const recipe = recipes.find(r => r.id === recipeId);

            if (recipe) {
                // 3. Modifying Element Content using Template Literal
                document.getElementById('modal-title').textContent = recipe.name;
                document.getElementById('modal-description').innerHTML = `
                    <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
                    <p><strong>Servings:</strong> ${recipe.servings}</p>
                    <p><strong>Prep Time:</strong> ${recipe.prep_time} minutes</p>
                    <p><strong>Cook Time:</strong> ${recipe.cook_time} minutes</p>
                    <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
                    <hr>
                    <p>${recipe.description}</p>
                `;
                // 4. Show the Modal Dialog
                modal.style.display = 'block'; 
            }
        });
    });

    // 5. Event Listener for Modal Close Button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // 6. Close Modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}


// --- 4. Main Initialization Function ---
async function initRecipes() {
    const recipes = await fetchRecipeData();
    displayRecipes(recipes);
}

// Run the initialization
document.addEventListener('DOMContentLoaded', initRecipes);