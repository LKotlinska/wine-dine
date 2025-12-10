// import { getPairedRecipes } from "./pair_food_wine.js";

export async function getRecipeInformation(id) {
  // const { wineData, recipeData } = await getPairedRecipes(wineType);

    const recipeAPIBaseURL = 'https://api.spoonacular.com/recipes/';
    const apiKey = 'bdf9eb43726a4fec87cc0d370296753d';

    const getRecipe = async () => {
      const recipeSearch = new URLSearchParams({
        apiKey,
      });

      const response = await fetch(recipeAPIBaseURL + id + '/information?' + recipeSearch);
      const recipeInfo = await response.json();
      
      return recipeInfo;
    }
    const recipeInfo = getRecipe(id);

    return recipeInfo;

}