import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base';

/*
    Global state of the app
    + Search object
    + Current recipe object
    + Shopping list object
    + Liked recipes
*/

const state = {};

/*
Search Controller
*/
const controlSearch = async () => {
    console.log('work');
    //1 get query from the view
    const query = searchView.getInput();

    if(query) {
        //2 new search object and add to state
        state.search = new Search(query);
        console.log(state.search);

        //3 prepare ui for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
        //4 search for results
        await state.search.getResults();

        //5 render results on the ui
        clearLoader();
        searchView.renderResults(state.search.result);
    }
    catch(error) {
        alert(`${error} - error in control search`);
        clearLoader();
    }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    //console.log(btn);
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
       // console.log(goToPage);
       searchView.clearResults();
       searchView.renderResults(state.search.result, goToPage);
    }
});

/*
Recipe Controller
*/

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
        //Prepare UI for changes

        //Create new recipe object
        state.recipe = new Recipe(id);
        
        try {
            
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
    
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Render recipe
            console.log(state.recipe);
        }
        catch (err) {
            alert(`${err} - error processing recipe`);
        }
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));