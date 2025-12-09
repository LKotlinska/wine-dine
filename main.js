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

    // Fetch paitings from pair_recipe.js
    const { wineInfo, recipes } = await getPairedRecipes(wineType);

    // ---- SHOW INFO ABOUT SELECTED WINE
    function showSelectedWine(wineType, wineInfo) {
      const wineSelected = document.querySelector('.wine-selected');
      // Clear previous content
      wineSelected.innerHTML = '';
      wineType = formatName(wineType);
      const wineName = document.createElement('p');
      wineName.innerText = wineType + ', great choice!';
      wineSelected.appendChild(wineName);

      const wineDesc = document.createElement('p');
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
        // Allows only one detail open at a time
        details.setAttribute('name', 'recipe-item');
        recipeSection.appendChild(details);
        const summary = document.createElement('summary');
        details.appendChild(summary);
        const title = document.createElement('h3');
        title.innerText = recipe.title;
        summary.appendChild(title);

        details.addEventListener('toggle', async () => {
          // Prevent infinite fetching when open
          if (!details.open) return;

          // Store recipe to prevent infinite fetching
          if (recipeCache[recipe.id]) return;

          const recipeContainer = document.createElement('div');
          recipeContainer.innerHTML = '';

          // ---- FETCH INGREDIENTS AND STEPS
          const recipeInfo = await getRecipeInformation(recipe.id);
          
          // Store recipe
          recipeCache[recipe.id] = recipeInfo;

          const ulContainer = document.createElement('div');

          const hIngredient = document.createElement('h4');
          hIngredient.innerText = 'Ingredients';
          const ul = document.createElement('ul');

          ulContainer.appendChild(hIngredient);
          ulContainer.appendChild(ul);

          const ingredients = recipeInfo.extendedIngredients;

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
          hSteps.innerHTML = 'Steps';
          const ol = document.createElement('ol');

          olContainer.appendChild(hSteps);
          olContainer.appendChild(ol);

          const steps = recipeInfo.analyzedInstructions[0].steps;
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
    fetch('resources/wines.json')
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
