import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            console.log(`controlRecipe: ${error}`)
        }
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/////////////////////////
//// List controller ////

const controlList = () => {
    // If there is no list, create one
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update events of the list
elements.shopping.addEventListener('click', event => {
    // Find the id
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // Delete the item
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);
        if (value > 0) {
            state.list.updateCount(id, value);
        }
    }
});


/////////////////////////
//// Like controller ////

const controlLike = () => {

    // If there is no list, create one
    if (!state.likes) {
        state.likes = new Likes();
    }

    const id = state.recipe.id;

    if (!state.likes.isLiked(id)) {
        // The reciped has not been liked
        // Add like into the state
        const newLike = state.likes.addLike(
            id,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img)


        // Toggle the like button
        likesView.toggleLikeBtn(true);
        // Add the like to UI list
        likesView.renderLike(newLike);
    } else {
        // The reciped has been liked

        // Remove likes from the state
        state.likes.deleteLike(id);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        // Remove like from the UI list
        likesView.deleteLike(id);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Load recipes on page load

window.addEventListener('load', () => {
    // Create likes
    state.likes = new Likes();
    // Restore existing likes
    state.likes.readStorage();
    // Update the UI
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});




// Increase and discrease buttons
elements.recipe.addEventListener('click', event => {
    console.log(event);
    // match any child with the id
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Lower the number of servings
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // Add the number of servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients in the shopping list
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Add ingredients in the shopping list
        controlLike();
    }
});

