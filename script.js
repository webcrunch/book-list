document.addEventListener("DOMContentLoaded", async function () {
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

    const editModal = document.getElementById("editModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const editTitleInput = document.getElementById("editTitleInput");
    const editDescriptionInput = document.getElementById("editDescriptionInput");

    let items = {};

    // Hämta items från backend
    async function fetchItems() {
        try {
            const response = await fetch('http://localhost:5000/items');
            const data = await response.json();
            items = data.reduce((acc, item) => {

                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push({
                    id: item.id,
                    content: item.content,
                    description: item.description || ''
                });
                return acc;
            }, {});
            console.log(items)
            populateCategories();
            displayItems(categorySelect.value);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    // Populera kategorier i select-menyn
    function populateCategories() {
        categorySelect.innerHTML = "";
        Object.keys(items).forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    }

    // Spara ett nytt item till backend
    async function saveItemToBackend(category, content, description) {
        try {
            const response = await fetch('http://localhost:5000/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category, content, description })
            });
            const newItem = await response.json();
            if (!items[category]) items[category] = [];
            items[category].push(newItem);
            displayItems(category);
        } catch (error) {
            console.error("Error saving item:", error);
        }
    }

    // Spara en ny kategori till backend
    async function saveCategoryToBackend(category) {
        if (!items[category]) items[category] = [];
        populateCategories();
        displayItems(category);
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
            saveItemToBackend(selectedCategory, newItemText, '');
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
            saveCategoryToBackend(newCategoryText);
            newCategoryInput.value = "";
            // categoryModal.style.display = "none";
        }
    });

    closeEditModal.addEventListener("click", () => {
        editModal.style.display = "none";
    });

    saveEditBtn.addEventListener("click", () => {
        const editedTitle = editTitleInput.value.trim();
        const editedDescription = editDescriptionInput.value.trim();
        const selectedCategory = categorySelect.value;
        const itemId = saveEditBtn.dataset.itemId;
        if (editedTitle) {
            updateItemToBackend(itemId, selectedCategory, editedTitle, editedDescription);
            editTitleInput.value = "";
            editDescriptionInput.value = "";
            editModal.style.display = "none";
        }
    });

    async function updateItemToBackend(itemId, category, content, description) {
        try {
            const response = await fetch(`http://localhost:5000/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category, content, description })
            });
            const updatedItem = await response.json();

            const itemIndex = items[category].findIndex(item => item.id === +itemId);// item.id === itemId
            items[category][itemIndex] = updatedItem;
            displayItems(category);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    }

    const addItem = (title, category, description) => {
        const li = document.createElement("li");
        li.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${title}`;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Läst";
        completeBtn.addEventListener("click", () => {
            li.classList.toggle("completed");
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Ändra";
        console.log(description, "desc")
        editBtn.addEventListener("click", () => {
            const itemId = items[category].find(item => item.content === title).id;
            editTitleInput.value = title;
            console.log(description, "desc")
            editDescriptionInput.value = description;
            saveEditBtn.dataset.itemId = itemId;
            editModal.style.display = "block";
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "Ta bort";
        // Lägg till radera-funktion om så önskas

        li.appendChild(editBtn);
        li.appendChild(delBtn);
        li.appendChild(completeBtn);
        itemList.appendChild(li);
    }

    const displayItems = (category) => {
        itemList.innerHTML = "";
        if (!items[category]) return;
        items[category].forEach(item => {
            console.log(item)
            addItem(item.content, category, item.description);
        });
    }

    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;
        displayItems(selectedCategory);
    });

    // Hämta initiala items från backend
    await fetchItems();
});
