import { getRecipeInformation } from './pair_recipe.js';
import { getPairedRecipes } from './pair_wine.js';

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('wine-select');
  const form = document.getElementById('submit-winetype');

  // ---- ELEMENT CREATION
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // On click: select and submit value
    const dropdown = document.getElementById('wine-select');
    const wineType = dropdown.value;

    // Fetch pairings from pair_recipe.js
    const { wineInfo, recipes } = await getPairedRecipes(wineType);

    // ---- SHOW INFO ABOUT SELECTED WINE
    function showSelectedWine(wineType, wineInfo) {
      const wineSelected = document.getElementById('wine-selected');
      const wineName = document.createElement('p');
      const span = document.createElement('span');
      const wineDesc = document.createElement('p');
      
      // Clear previous content
      if (!wineSelected) return;
      wineSelected.innerHTML = '';

      wineType = formatName(wineType);
      span.classList.add('wine-name');
      span.innerText = wineType;
      wineName.append(span, ', great choice!');
      wineSelected.appendChild(wineName);

      wineDesc.innerText = wineInfo;
      wineSelected.appendChild(wineDesc);
    }
    showSelectedWine(wineType, wineInfo);

    async function showRecipes() {
      // To prevent infinate on-click fetching
      let recipeCache = {};

      const recipeSection = document.getElementById('recipe-section');
      recipeSection.innerHTML = '';

      recipes.forEach((recipe) => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        const title = document.createElement('h4');

        // Allows only one detail open at a time
        details.setAttribute('name', 'recipe-item');
        details.classList.add('recipe-card')
        recipeSection.appendChild(details);
        details.appendChild(summary);
        title.classList.add('recipe-title')
        title.innerText = recipe.title;
        summary.appendChild(title);

        // ---- FETCH INGREDIENTS AND STEPS
        details.addEventListener('toggle', async () => {

          // Prevent infinite fetching when opening
          if (!details.open || recipeCache[recipe.id]) return;

          const recipeContainer = document.createElement('div');
          recipeContainer.innerHTML = '';

          const recipeInfo = await getRecipeInformation(recipe.id);

          // Store recipe
          recipeCache[recipe.id] = recipeInfo;

          const ulContainer = document.createElement('div');
          const hIngredient = document.createElement('h4');
          const ul = document.createElement('ul');
          const ingredients = recipeInfo.extendedIngredients;

          hIngredient.innerText = 'Ingredients';
          ulContainer.appendChild(hIngredient);
          ulContainer.appendChild(ul);

          // ---- INGREDIENT LOOP
          ingredients.forEach((ingredient) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.classList.add('ingredient');
            span.innerText = ( 
              ingredient.measures.metric.amount 
              + ' ' 
              +ingredient.measures.metric.unitShort
              + ' '
            )
            li.appendChild(span)
            li.append(ingredient.nameClean);
            ul.appendChild(li);
          });

          const olContainer = document.createElement('div');
          const hSteps = document.createElement('h4');
          const ol = document.createElement('ol');
          const steps = recipeInfo.analyzedInstructions[recipeInfo.analyzedInstructions.length - 1].steps;

          hSteps.innerHTML = 'Steps';

          olContainer.appendChild(hSteps);
          olContainer.appendChild(ol);
          
          // ---- STEPS LOOP
          steps.forEach((step) => {
            const li = document.createElement('li');
            li.innerText = step.step;
            ol.appendChild(li);
          });

          recipeContainer.appendChild(ulContainer);
          recipeContainer.appendChild(olContainer);
          details.appendChild(recipeContainer);
        });
      });
    }
    showRecipes();
  });

  // ---- Fetch and display wine selection
  try {
    fetch('./assets/wines.json')
      .then((response) => response.json())
      .then((wines) => {
        for (let category in wines) {
          // Name cleanup and create selection groups
          const categoryName = formatName(category);
          const optgroup = document.createElement('optgroup');
          optgroup.setAttribute('label', categoryName);
          dropdown.appendChild(optgroup);

          wines[category].forEach((wine) => {
            const wineName = formatName(wine);
            const option = document.createElement('option');
            option.innerText = wineName;
            option.setAttribute('value', wine);
            optgroup.appendChild(option);
          });
        }
      });
  } catch (error) {
    console.log(error);
  }

  function formatName(string) {
    return string
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
});
