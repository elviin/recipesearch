import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        try {
            // follows the food2fork.com api:
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    };

    calcTime() {
        // Each 3 ingredients means 15 minutes of additional time 
        // to prepare the meal
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    };

    calcServings() {
        this.servings = 4;
    };

    parseIngredients() {

        const unitsLong = ['tabelspoons', 'tabelspoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const delimiter = ' ';

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");
            // 3. Parse ingredients 
            const arrIngredients = ingredient.split(delimiter);
            const unitIndex = arrIngredients.findIndex(el2 => unitsShort.includes(el2));

            let objIngredient;
            if (unitIndex > -1) {
                // Unit found
                // case A: 2 tsp -> arrIngrCount = [2]
                // case B: 2 1/2 tsp -> arrIngrCount = [2, 1/2] -> eval(arrIngrCount) = 2.5
                const arrIngrCount = arrIngredients.slice(0, unitIndex);
                let count;
                if (arrIngrCount.length === 1) {
                    // Case A:
                    count = eval(arrIngrCount[0].replace('-', '+'));
                } else if (arrIngrCount.length === 2) {
                    // Case B:
                    count = eval(arrIngredients.slice(0, unitIndex).join('+'));
                }
                objIngredient = {
                    count,
                    unit: arrIngredients[unitIndex],
                    ingredient: arrIngredients.slice(unitIndex + 1).join(delimiter)
                };

            } else if (parseInt(arrIngredients[0], 10)) {
                // Unit not found, first element is a number
                objIngredient = {
                    count: parseInt(arrIngredients[0], 10),
                    unit: '',
                    ingredient: arrIngredients.slice(1).join(delimiter)
                }

            } else if (unitIndex === -1) {
                // Unit not found
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }

            }

            return objIngredient;
        });
        this.ingredients = newIngredients;
    };
}
