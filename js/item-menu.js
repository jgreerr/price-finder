
console.log("Content script for item display is working.");
let header = document.createElement('h1');
header.textContent = "Im injected!";
document.body.appendChild(header);

chrome.storage.local.get(["validEbayClassNames"], (items) => {
    console.log(items.validEbayClassNames);
});