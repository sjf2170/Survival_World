const items = [
  "Titanium", "Creepvine sample", "Creepvine seed cluster", "Quartz", "Salt deposit",
  "Coral Tube Sample", "Glass", "stalker tooth", "Titanium ingot", "Lithium",
  "Deep shroom", "Blood oil", "Benzene", "Fiber mesh", "Gel sack",
  "Ruby", "Gold", "Hydrochloric acid", "Copper", "Acid mushroom",
  "Ion cube", "Silver ore", "Battery", "Silicone rubber", "Ion battery",
  "Table coral sample", "Copper wire", "Wiring kit", "Computer chip", "Uraninite crystal",
  "Lead", "Bladderfish", "Bleach", "Holefish", "Peeper", "Garryfish", "Hoverfish",
  "Spadefish", "Boomerang", "Eyeye", "Oculus", "Hoopfish", "Spinefish",
  "Standard O2 Tank", "Synthetic fibers", "Diamond", "Cave sulfur", "Survival Knife",
  "High Capacity O2 Tank", "Fins", "Propulsion cannon", "Power cell", "Enameled glass",
  "Plasteel ingot", "Crystalline sulfur", "Ion power cell", "Cyclops shield generator",
  "Advanced wiring kit", "Nickel ore", "Magnetite", "Gas pod", "Kyanite",
  "Cyclops Plans", "Repair tool", "Seamoth depth module MK1",
  "Seamoth depth module MK2", "Seamoth depth module MK3", "Prawn suit depth module MK1",
  "Prawn suit depth module MK2", "Moonpool", "Aquarium", "Plant pot", "Bed",
  "Nuclear waste disposal"
];

const input = document.getElementById("itemInput");
const inventory = document.getElementById("inventory");
const addedItems = new Set();
let recipes = {};

// Create datalist once and attach to DOM
const datalist = document.createElement("datalist");
datalist.id = "suggestions";
document.body.appendChild(datalist);
input.setAttribute("list", "suggestions");

fetch("crafting_recipes.json")
  .then(response => {
    if (!response.ok) throw new Error("Failed to load crafting_recipes.json");
    return response.json();
  })
  .then(data => {
    recipes = data;
    updateCraftableItems();
  })
  .catch(err => {
    console.error("Error loading crafting recipes:", err);
    recipes = {}; // Fail gracefully
  });

input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  const matches = items.filter(item => item.toLowerCase().includes(query));

  // Clear old suggestions
  datalist.innerHTML = "";
  
  // Add filtered options
  matches.forEach(match => {
    const option = document.createElement("option");
    option.value = match;
    datalist.appendChild(option);
  });
});

input.addEventListener("change", () => {
  const selected = input.value.trim();
  if (selected && items.includes(selected) && !addedItems.has(selected)) {
    addedItems.add(selected);

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = selected;
    tag.title = "Click to remove item";

    tag.addEventListener("click", () => {
      addedItems.delete(selected);
      inventory.removeChild(tag);
      updateCraftableItems();
    });

    inventory.appendChild(tag);
    input.value = "";

    updateCraftableItems();
  }
});

function getSelectedTools() {
  const checkboxes = document.querySelectorAll('#tools-form input[type="checkbox"]');
  return Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
}

function getInventoryItems() {
  return Array.from(addedItems);
}

function updateCraftableItems() {
  const selectedTools = getSelectedTools();
  const inventoryItems = getInventoryItems();
  const list = document.getElementById("craftable-list");
  list.innerHTML = "";

  for (const [item, [requiredTool, ingredients]] of Object.entries(recipes)) {
    if (!selectedTools.includes(requiredTool)) continue;

    const allIngredientsPresent = ingredients.every(([ingredient]) =>
      inventoryItems.includes(ingredient)
    );

    if (allIngredientsPresent) {
      const ingredientList = ingredients
        .map(([name, qty]) => `${name} x${qty}`)
        .join(", ");

      const li = document.createElement("li");
      li.textContent = `${item} – ${ingredientList}`;
      list.appendChild(li);
    }
  }
}

document.getElementById("tools-form").addEventListener("change", updateCraftableItems);
window.addEventListener("DOMContentLoaded", updateCraftableItems);
