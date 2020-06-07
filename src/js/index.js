import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/Base'

// Global (simple) state of the app
// * Search object
// * Current recipe object
// * Shopping list object
// * Like recipes
const state = {};

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

        // 4. Do the search
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


const search = new Search('pizza')




//TODO: split the controllers into different files