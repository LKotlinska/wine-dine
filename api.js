// QUESTION: WILL THIS COUNT AS HAVING MULTIPLE APIs?
export function getPairedRecipes(wineType) {
  const foodAPIBaseUrl = `https://api.spoonacular.com/recipes/`;
  const wineAPIBaseUrl = "https://api.spoonacular.com/food/wine/";

  const pairingSearch = new URLSearchParams({
    wine: wineType,
    apiKey: "bdf9eb43726a4fec87cc0d370296753d",
  });

  const getPairings = async () => {
    // Get dish examples from wine API
    const response = await fetch(wineAPIBaseUrl + "dishes?" + pairingSearch);
    const pairingData = await response.json();
    // Create array with pairings
    const pairings = pairingData["pairings"];

    const getRecipe = async (query) => {
      const dishSearch = new URLSearchParams({
        query: query,
        number: 1,
        apiKey: "bdf9eb43726a4fec87cc0d370296753d",
      });
      
      const response = await fetch(foodAPIBaseUrl + "complexSearch?" + dishSearch);
      const dishData = await response.json();
      return dishData;
    };
    getRecipe();

    // Loops through pairings array to get a recipe per ingredient
    const getDishesByIngredient = async () => {
      for (const query of pairings) {
        await getRecipe(query);
      }
    };
    getDishesByIngredient();
  };
  getPairings();

}
