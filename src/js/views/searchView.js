import { elements, renderLoader, elementsStrings } from './Base'

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const getInput = () => elements.searchInput.value;

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlitedSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    //TODO: substitute the id's with a variable
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

// Example: Pasta with tomato and spinach
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length
        }, 0)
        return `${newTitle.join(' ')} ...`
    }
    return title;
}

const renderRecipe = recipe => {

    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
                <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>        
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// type: 'prev', 'next'
const createButton = (page, type) => `

    <button class="${elementsStrings.navbutton} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resultsOnPage) => {
    const pages = Math.ceil(numResults / resultsOnPage);

    let button;

    if (page === 1 && pages > 1) {
        // The next page only button
        button = createButton(page, 'next')
    } else if (page < pages) {
        // The previous page button and the next page button
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if (page === pages && pages > 1) {
        // The previous page only button
        button = createButton(page, 'prev')
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resultsOnPage = 10) => {

    // Render current page
    const start = (page - 1) * resultsOnPage;
    const until = page * resultsOnPage;
    recipes.slice(start, until).forEach(renderRecipe);

    // Render the navigation buttons
    renderButtons(page, recipes.length, resultsOnPage);
};