/*
import mystring from './models/Search';
import { add as a, mult as m, ID } from './views/searchView';
import * as allSearchView from './views/searchView';

console.log(mystring);
console.log(`${a(ID, ID)} and ${allSearchView.mult(ID, ID)}`);
console.log(allSearchView);
*/

//869c52dcbd9527613402db6b527a7c66 https://www.food2fork.com/user/api
//https://www.food2fork.com/api/search

import axios from 'axios';
async function getResuls(query) {
    const key = `869c52dcbd9527613402db6b527a7c66`;
    try {
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    }
    catch(error) {
        alert(error);
    }
}
getResuls('ice cream');

