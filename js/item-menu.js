
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

async function fetchEbayListing() { 

    let response = await fetch("https://www.ebay.com/sch/shoe");
    let string = await response.text();

    let parser = new DOMParser();
    let document = parser.parseFromString(string, 'text/html');
    let list = document.querySelector("#srp-river-results > ul")
    .getElementsByClassName("s-item s-item__pl-on-bottom");

    for (let i = 0; i < list.length; i++) { 
        console.log(list[i]);
    }
}
fetchEbayListing();

document.querySelector("#srp-river-results > ul > li:nth-child(3) > div > div.s-item__info.clearfix > a > h3")