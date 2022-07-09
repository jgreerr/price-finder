
chrome.storage.local.get(["selectedListedItem"], (items) => {
    let selectedItem = document.querySelector(".selected-item-content");

    let image = document.getElementById("selected-item-image");
    image.src = items.selectedListedItem.image;

    let header = document.getElementById("selected-item-text");
    header.textContent = "Name: " + items.selectedListedItem.name;
    header.textContent += " | Price: " + items.selectedListedItem.price;
    header.textContent += " | Condition: " + items.selectedListedItem.condition;

    selectedItem.appendChild(image);
    selectedItem.appendChild(header);
})
