export async function getPairedRecipes(wineType) {
  const foodAPIBaseUrl = `https://api.spoonacular.com/recipes/`;
  const wineAPIBaseUrl = 'https://api.spoonacular.com/food/wine/';
  const apiKey = 'bdf9eb43726a4fec87cc0d370296753d';

  // ---- GET DISH PAIRINGS FROM WINE API
  const getPairings = async (wine) => {
    const pairingSearch = new URLSearchParams({
      wine,
      apiKey
    });

    const response = await fetch(wineAPIBaseUrl + "dishes?" + pairingSearch);
    const pairingData = await response.json();
    return pairingData;
  };

  // ---- GET DISH INFO FROM FOOR API
  const getRecipe = async (query) => {
    const dishSearch = new URLSearchParams({
      query,
      number: 1,
      apiKey
    });

    const response = await fetch(
      foodAPIBaseUrl + "complexSearch?" + dishSearch
    );
    const dishData = await response.json();
    return dishData;
  };

  // ---- GET RECIPE EXAMPLES FOR EACH PAIRING
  const pairingData = await getPairings(wineType);
  const recipes = [];

  for (const query of pairingData.pairings) {
    // Set timeout cuz stoopid max 5 request/s
    await new Promise(res => setTimeout(res, 250));

    // Extracting results[0] out of the array which contains recipe info
    const recipeData = await getRecipe(query);
    const newRecipe = recipeData.results[0];

    // Making sure the data is not undefined
    if (newRecipe !== undefined) {
      recipes.push(newRecipe);
    }
  }

  return { wineInfo: pairingData.text, recipes };
}
