// QUESTION: WILL THIS COUNT AS HAVING MULTIPLE APIs?
export async function getPairedRecipes(wineType) {
  const foodAPIBaseUrl = `https://api.spoonacular.com/recipes/`;
  const wineAPIBaseUrl = "https://api.spoonacular.com/food/wine/";

  const pairingSearch = new URLSearchParams({
    wine: wineType,
    apiKey: "bdf9eb43726a4fec87cc0d370296753d",
  });

  const getPairings = async () => {
    // Get dish pairings from wine API
    const response = await fetch(wineAPIBaseUrl + "dishes?" + pairingSearch);
    const pairingData = await response.json();
    // console.log(pairingData);
    return pairingData;
  };
  const getRecipe = async (query) => {
    const dishSearch = new URLSearchParams({
      query,
      number: 1,
      apiKey: "bdf9eb43726a4fec87cc0d370296753d",
    });

    const response = await fetch(
      foodAPIBaseUrl + "complexSearch?" + dishSearch
    );
    const dishData = await response.json();
    return dishData;
  };

  const pairings = await getPairings();
  const recipes = [];

  recipes.push(pairings["text"]);

  for (const query of pairings["pairings"]) {
    // Set timeout cuz stoopid max 5 request/s
    setTimeout(async () => {
      // Extracting results[0] out of the array which contains recipe info
      const recipeData = await getRecipe(query);
      const newRecipe = recipeData?.results?.[0];

      // Making sure the data is not undefined
      if (newRecipe !== undefined) {
        recipes.push(newRecipe);
      } 
    }, 250);
  }

  return recipes;
}
