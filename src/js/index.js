import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements } from './views/base';

/*
    Global state of the app
    + Search object
    + Current recipe object
    + Shopping list object
    + Liked recipes
*/

const state = {};

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

        //4 search for results
        await state.search.getResults();

        //5 render results on the ui
        searchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});