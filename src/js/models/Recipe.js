import axios from 'axios';
import { key, proxy } from '../config';
import { throws } from 'assert';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.autor = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(error) {
            console.log(error);
            alert(`Something get wrong :-(`);
        }
    }

    calcTime() {
        //15 min = 3 ingredients (only for example)
        const numberIng = this.ingredients.length;
        const periods = Math.ceil(num / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}