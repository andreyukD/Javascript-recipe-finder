import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
        //console.log(state.search);

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search
        if(state.search) {searchView.highlightSelecter(id);}

        //Create new recipe object
        state.recipe = new Recipe(id);
        
        try {
            
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
    
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        }
        catch (err) {
            alert(`${err} - error processing recipe`);
        }
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
List controller
*/
const controlList = () => {
    //Create a new list IF there in none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
       const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);

    });
}


//Handle delete and updatet list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete', '.shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

    //Handle the count update    
    } else if(e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/*
LIKE CONTROLLER
*/


const controlLike = () => {
    if(!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    //User has not yet liked cur recipe
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle has like button
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);
        //console.log(state.likes);

    } else {
    //User has yet liked cur recipe

        //Remove like to the state
        state.likes.deleteLike(currentID);

        //Toggle has like button
        likesView.toggleLikeBtn(false);

        //Remove like from UI list   
        //console.log(state.likes);
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //restore likes
    state.likes.readStorage();

    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked 
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //add Ingredients to shop list
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }

    //console.log(state.recipe);
});