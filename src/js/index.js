import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, elementsStrings, renderLoader, clearLoader } from './views/Base';

// Global (simple) state of the app
// * Search object
// * Current recipe object
// * Shopping list object
// * Like recipes
const state = {};

//TODO: split the controllers into different files

/////////////////////////
/// Search controller ///
const controlSearch = async () => {
    // 1) query from the view
    const query = searchView.getInput();

    if (query) {
        // 2. if there is an object to search 
        state.search = new Search(query);

        // 3. Prepare the UI, clear the results, show spinner
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Do the search
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(`controlSearch: ${error}`)
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})



elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest(`.${elementsStrings.navbutton}`)
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});



/////////////////////////
/// Recipe controller ///

const controlRecipe = async () => {

    // Get the id from the url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Update UI 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected item
        if (state.search) {
            searchView.highlitedSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data, and parace ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and duration
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Show the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(`controlRecipe: ${error}`)
        }
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
