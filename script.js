const resourceList = [
  "Titanium", "Copper", "Fiber Mesh", "Lubricant", "Glass",
  "Silicone Rubber", "Wiring Kit", "Computer Chip", "Battery",
  "Power Cell", "Plasteel Ingot", "Magnetite", "Advanced Wiring Kit",
  "Aero Gel", "Enamelled Glass"
];

let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

window.onload = () => {
  const datalist = document.getElementById('resource-list');
  resourceList.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    datalist.appendChild(option);
  });

  renderInventory();
};

function addResource() {
  const input = document.getElementById('resource-input');
  const value = input.value.trim();
  if (value && !inventory.includes(value)) {
    inventory.push(value);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
  }
  input.value = '';
}

function renderInventory() {
  const container = document.getElementById('inventory-list');
  container.innerHTML = '';
  inventory.forEach(item => {
    const el = document.createElement('span');
    el.className = 'item-tag';
    el.textContent = item;
    container.appendChild(el);
  });
}
