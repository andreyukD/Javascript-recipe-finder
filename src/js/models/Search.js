import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults() {
        const key = `869c52dcbd9527613402db6b527a7c66`;
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch(error) {
            alert(error);
        }
    }    
}