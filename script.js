// script.js
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// Navegação por abas
const tabButtons = document.querySelectorAll(".tab-button");
const tabSections = document.querySelectorAll(".tab-section");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabSections.forEach((section) => section.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

// Adicionar item ao estoque
document.getElementById("inventory-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const itemName = document.getElementById("item-name").value;
  const quantity = document.getElementById("quantity").value;
  const ministry = document.getElementById("ministry").value;
  const condition = document.getElementById("condition").value;

  const item = { itemName, quantity, ministry, condition };
  inventory.push(item);
  localStorage.setItem("inventory", JSON.stringify(inventory));

  document.getElementById("inventory-form").reset();
  renderInventory();
});

// Renderizar estoque
function renderInventory() {
  const tableBody = document.querySelector("#inventory-table tbody");
  tableBody.innerHTML = "";

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.itemName}</td>
      <td>${item.quantity}</td>
      <td>${item.ministry}</td>
      <td>${item.condition}</td>
      <td><button class="remove-item" data-index="${index}">Remover</button></td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      inventory.splice(index, 1);
      localStorage.setItem("inventory", JSON.stringify(inventory));
      renderInventory();
    });
  });
}

// Aplicar filtros
document.getElementById("apply-filters").addEventListener("click", () => {
  const ministryFilter = document.getElementById("filter-ministry").value.toLowerCase();
  const itemFilter = document.getElementById("search-item").value.toLowerCase();

  const filteredItems = inventory.filter((item) => {
    return (
      (!ministryFilter || item.ministry.toLowerCase().includes(ministryFilter)) &&
      (!itemFilter || item.itemName.toLowerCase().includes(itemFilter))
    );
  });

  const tableBody = document.querySelector("#filtered-results tbody");
  tableBody.innerHTML = "";

  filteredItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.itemName}</td>
      <td>${item.quantity}</td>
      <td>${item.ministry}</td>
      <td>${item.condition}</td>
    `;
    tableBody.appendChild(row);
  });
});

// Inicializar
renderInventory();
