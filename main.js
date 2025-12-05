import { getPairedRecipes } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("wine-select");
  const button = document.getElementById("submit-winetype");

  button.addEventListener("click", () => {
    // On click: select and submit value
    const dropdown = document.getElementById("wine-select");
    const wineType = dropdown.value;
    // Reset to default
    dropdown.value = "default";
    
    getPairedRecipes(wineType);
  });
  
  // Fetch and display wine selection
  try {
    fetch("resources/wines.json")
      .then((response) => response.json())
      .then((wines) => {
        for (let category in wines) {
          // Name cleanup and create selection groups
          const categoryName = replaceUnderscore(category);
          const optgroup = document.createElement("optgroup");
          optgroup.setAttribute("label", categoryName);
          dropdown.appendChild(optgroup);

          wines[category].forEach((wine) => {
            const wineName = replaceUnderscore(wine);
            const option = document.createElement("option");
            option.innerText = wineName;
            option.setAttribute("value", wine);
            optgroup.appendChild(option);
          });
        }
      });
  } catch (error) {
    console.log(error);
  }




  function replaceUnderscore(string) {
    return string.replace("_", " ");
  }
});
