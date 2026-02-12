# Wine&Dine - Let the Wine Choose Dinner
Uncork & Fork is a web application that reverses the traditional food–wine pairing process. Instead of selecting a wine to match a dish, the user begins by choosing a wine, and the application provides carefully matched recipe suggestions based on real pairing guidelines and API data.

The result is a simple, intuitive tool where the wine takes the lead and dinner follows naturally.

## Features
### Static Wine Selection
Wine categories and options are loaded from `wines.json` on page load, which requires manual upkeep, as the API doesn't provide a fetchable list. The dropdown is structured using `<optgroup>` for clearer navigation.

### Automated Wine–Food Matching
After a wine is selected, the app retrieves:
Pairing suggestions from Spoonacular’s Wine API
Recipe candidates for each suggested dish from the Recipes API

### Detailed Recipe Breakdown
Each recipe is displayed inside a collapsible panel. When expanded, the app fetches detailed information including:
- Ingredient lists with metric measurements
- Cooking instructions
This prevents unnecessary API calls and makes sure the interface remains efficient.

## Clean, Script-Driven UI
The interface dynamically renders:
- Wine information and description
- Recipe names
- Ingredients
- Step-by-step instructions

## How It Works (Technical Summary)
1. Wine selection
On page load, main.js fetches /assets/wines.json, formats the category names, and builds the dropdown.

2. Fetch wine pairing data
`getPairedRecipes(wineType)` retrieves:
- A text description of why the wine pairs well
- A list of dishes that complement the selected wine

3. Fetch recipe examples
For each pairing dish, the app calls Spoonacular's recipe search. A delay is applied to prevent rate-limit issues.
Results are filtered so only valid recipes are added.

4. Load detailed recipe data
When a user expands a recipe, `getRecipeInformation(id)` fetches full details:
Ingredients
Instructions

5. Render the UI
`main.js` creates all elements dynamically and ensures previous content is cleared for each new user selection.

## Technologies Used
- HTML5 and CSS3
- Vanilla JavaScript (ES Modules)
- Spoonacular Wine API and Recipe API
- Google Fonts: Lora, Playfair Display, Source Sans 3

## License
This project is released under the MIT License.
