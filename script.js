document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    const itemList = document.getElementById("itemList");
    const addItemBtn = document.getElementById("addItemBtn");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const saveItemBtn = document.getElementById("saveItemBtn");
    const newItemInput = document.getElementById("newItemInput");
    const addKatBtn = document.getElementById("addKatBtn")

    const items = {
        reacher: [],
        sherlock: [],
        poirot: []
    };

    addItemBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });


    addKatBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    addKatBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    saveItemBtn.addEventListener("click", () => {
        const newItemText = newItemInput.value.trim();
        const selectedCategory = categorySelect.value;
        if (newItemText) {
            addItem(newItemText, selectedCategory);
            newItemInput.value = "";
            modal.style.display = "none";
        }
    });

    function addItem(text, category) {
        const li = document.createElement("li");
        li.textContent = text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Radera";
        deleteBtn.addEventListener("click", () => {
            itemList.removeChild(li);
            items[category] = items[category].filter(item => item !== text);
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Ändra";
        editBtn.addEventListener("click", () => {
            const newText = prompt("Ändra innehåll:", text);
            if (newText !== null && newText.trim() !== "") {
                li.firstChild.textContent = newText;
                items[category] = items[category].map(item => (item === text ? newText : item));
            }
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        itemList.appendChild(li);
        items[category].push(text);
    }

    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;
        displayItems(selectedCategory);
    });

    function displayItems(category) {
        itemList.innerHTML = "";
        items[category].forEach(text => {
            const li = document.createElement("li");
            li.textContent = text;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Radera";
            deleteBtn.addEventListener("click", () => {
                itemList.removeChild(li);
                items[category] = items[category].filter(item => item !== text);
            });

            const editBtn = document.createElement("button");
            editBtn.textContent = "Ändra";
            editBtn.addEventListener("click", () => {
                const newText = prompt("Ändra innehåll:", text);
                if (newText !== null && newText.trim() !== "") {
                    li.firstChild.textContent = newText;
                    items[category] = items[category].map(item => (item === text ? newText : item));
                }
            });

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            itemList.appendChild(li);
        });
    }

    displayItems(categorySelect.value);  // Display initial category items
});
