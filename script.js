// Seletores
const ministrySelect = document.getElementById("ministry");
const addMinistryForm = document.getElementById("add-ministry-form");
const ministriesList = document.getElementById("ministries-list");
const newMinistryInput = document.getElementById("new-ministry");
const inventoryForm = document.getElementById("inventory-form");
const inventoryTableBody = document.querySelector("#inventory-table tbody");
const filterMinistryInput = document.getElementById("filter-ministry");
const searchItemInput = document.getElementById("search-item");
const filteredResultsTableBody = document.querySelector("#filtered-results tbody");
const ministryInventoryTableBody = document.querySelector("#ministry-inventory-table tbody");

// Lista de ministérios e estoque
let ministries = JSON.parse(localStorage.getItem("ministries")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

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

// Adicionar ministério ao clicar no botão de submissão do formulário
addMinistryForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // Obtém o nome do novo ministério
    const newMinistry = newMinistryInput.value.trim();

    if (newMinistry && !ministries.includes(newMinistry)) {
        // Adiciona o ministério à lista
        ministries.push(newMinistry);

        // Atualiza o localStorage
        localStorage.setItem("ministries", JSON.stringify(ministries));

        // Atualiza a lista visual
        renderMinistries();

        // Limpa o campo de entrada
        newMinistryInput.value = "";
    } else {
        alert("Esse ministério já foi adicionado ou o campo está vazio!");
    }
});

// Função para atualizar o `<select>` de ministérios
function updateMinistrySelect() {
    ministrySelect.innerHTML = '<option value="" disabled selected>Selecione um ministério</option>';

    ministries.forEach((ministry) => {
        const option = document.createElement("option");
        option.value = ministry;
        option.textContent = ministry;
        ministrySelect.appendChild(option);
    });
}

// Função para renderizar a lista de ministérios com botões de edição e remoção
function renderMinistries() {
    ministriesList.innerHTML = "";

    ministries.forEach((ministry, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = ministry;

        // Botão de editar
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => editMinistry(index));

        // Botão de remover
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", () => removeMinistry(index));

        listItem.appendChild(editButton);
        listItem.appendChild(removeButton);
        ministriesList.appendChild(listItem);
    });

    // Atualiza o select de ministérios
    updateMinistrySelect();
}

// Função para editar um ministério
function editMinistry(index) {
    const newMinistry = prompt("Digite o novo nome do ministério:", ministries[index]);

    if (newMinistry && !ministries.includes(newMinistry)) {
        ministries[index] = newMinistry;
        localStorage.setItem("ministries", JSON.stringify(ministries)); // Atualiza o localStorage
        renderMinistries(); // Atualiza a lista de ministérios e o select
    } else {
        alert("Esse nome de ministério já existe ou é inválido.");
    }
}

// Função para remover um ministério
function removeMinistry(index) {
    ministries.splice(index, 1);
    localStorage.setItem("ministries", JSON.stringify(ministries)); // Atualiza o localStorage
    renderMinistries(); // Atualiza a lista de ministérios e o select
}

// Adicionar item ao estoque
inventoryForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o comportamento padrão de recarregar a página

  const itemName = document.getElementById("item-name").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value, 10);
  const ministry = document.getElementById("ministry").value.trim();
  const condition = document.getElementById("condition").value.trim();

  // Validação básica
  if (!itemName || !quantity || quantity <= 0 || !ministry || !condition) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const item = { itemName, quantity, ministry, condition };
  inventory.push(item);
  localStorage.setItem("inventory", JSON.stringify(inventory));

  document.getElementById("inventory-form").reset(); // Reseta o formulário
  renderInventory(); // Atualiza a tabela com os novos dados
});

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

  // Adicionar evento de remoção para cada botão
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      inventory.splice(index, 1);
      localStorage.setItem("inventory", JSON.stringify(inventory));
      renderInventory();
    });
  });
}

// Filtros em tempo real enquanto digita
searchItemInput.addEventListener("input", applyFilters);
filterMinistryInput.addEventListener("input", applyFilters);

// Aplicar filtros
function applyFilters() {
  const ministryFilter = filterMinistryInput.value.trim().toLowerCase();
  const itemFilter = searchItemInput.value.trim().toLowerCase();

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
}

// Inicializar a tabela ao carregar a página
renderInventory();
renderMinistries(); // Chama a função de renderização dos ministérios
