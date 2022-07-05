
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    if (message == "gotListedItem") {
        console.log("Recieved the gotListedItem message.");
        chrome.storage.local.get(["selectedListedItem"], (items) => {
            let selectedItem = document.querySelector(".selected-item-content");
            let header = document.createElement('h3');
            header.textContent = "Name: " + items.selectedListedItem.name;
            header.textContent += " | Price: " + items.selectedListedItem.price;
            header.textContent += " | Condition: " + items.selectedListedItem.condition;
            selectedItem.appendChild(header);
    });
}});