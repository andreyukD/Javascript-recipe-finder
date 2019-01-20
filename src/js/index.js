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

        //4 search for results
        await state.search.getResults();

        //5 render results on the ui
        clearLoader();
        searchView.renderResults(state.search.result);
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
const r = new Recipe(35478);
r.getRecipe();
console.log(r);