document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    const itemList = document.getElementById("itemList");
    const addItemBtn = document.getElementById("addItemBtn");
    const addCategoryBtn = document.getElementById("addCategoryBtn");

    const itemModal = document.getElementById("itemModal");
    const closeItemModal = document.getElementById("closeItemModal");
    const saveItemBtn = document.getElementById("saveItemBtn");
    const newItemInput = document.getElementById("newItemInput");

    const categoryModal = document.getElementById("categoryModal");
    const closeCategoryModal = document.getElementById("closeCategoryModal");
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const newCategoryInput = document.getElementById("newCategoryInput");




    const items = {
    };

    if (Object.keys(items).length === 0) {
        addItemBtn.setAttribute('disabled', true);
    }

    addItemBtn.addEventListener("click", () => {
        itemModal.style.display = "block";
    });

    closeItemModal.addEventListener("click", () => {
        itemModal.style.display = "none";
    });

    saveItemBtn.addEventListener("click", () => {
        const newItemText = newItemInput.value.trim();
        const selectedCategory = categorySelect.value;
        if (newItemText) {
            addItem(newItemText, selectedCategory);
            newItemInput.value = "";
            itemModal.style.display = "none";
        }
    });

    addCategoryBtn.addEventListener("click", () => {
        categoryModal.style.display = "block";
    });

    closeCategoryModal.addEventListener("click", () => {
        categoryModal.style.display = "none";
    });

    saveCategoryBtn.addEventListener("click", () => {
        const newCategoryText = newCategoryInput.value.trim().toLowerCase();
        if (newCategoryText && !items[newCategoryText]) {
            addCategory(newCategoryText);
            newCategoryInput.value = "";
            categoryModal.style.display = "none";
        }
    });

    function addItem(text, category) {
        const li = document.createElement("li");
        li.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${text}`;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Läst";
        completeBtn.addEventListener("click", () => {
            li.classList.toggle("completed");
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Ändra";
        editBtn.addEventListener("click", () => {
            const newText = prompt("Ändra innehåll:", text);
            if (newText !== null && newText.trim() !== "") {
                li.firstChild.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${newText}`;
                items[category] = items[category].map(item => (item === text ? newText : item));
            }
        });

        li.appendChild(editBtn);
        li.appendChild(completeBtn);
        itemList.appendChild(li);
        items[category].push(text);
    }

    function addCategory(category) {
        items[category] = [];
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
        if (Object.keys(items).length !== 0) {
            addItemBtn.disabled = false
        }
    }

    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;
        displayItems(selectedCategory);
    });

    function displayItems(category) {
        itemList.innerHTML = "";
        if (items[category] == undefined) return
        items[category].forEach(text => {
            const li = document.createElement("li");
            li.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${text}`;

            const completeBtn = document.createElement("button");
            completeBtn.textContent = "Läst";
            completeBtn.addEventListener("click", () => {
                li.classList.toggle("completed");
            });

            const editBtn = document.createElement("button");
            editBtn.textContent = "Ändra";
            editBtn.addEventListener("click", () => {
                const newText = prompt("Ändra innehåll:", text);
                if (newText !== null && newText.trim() !== "") {
                    li.firstChild.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${newText}`;
                    items[category] = items[category].map(item => (item === text ? newText : item));
                }
            });

            li.appendChild(editBtn);
            li.appendChild(completeBtn);
            itemList.appendChild(li);
        });
    }

    displayItems(categorySelect.value);  // Display initial category items
});
