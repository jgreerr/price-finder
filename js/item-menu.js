function displaySelectedItem(selectedItem) { 
    let selectedItemImage = document.querySelector("#selected-item-image");
    let selectedItemName = document.querySelector("#selected-item-name");
    let selectedItemPrice = document.querySelector("#selected-item-price");
    let selectedItemCondition = document.querySelector("#selected-item-condition");

    selectedItemImage.src = selectedItem.image; 
    selectedItemName.textContent = selectedItem.name;
    selectedItemPrice.textContent = selectedItem.price;
    selectedItemCondition.textContent = selectedItem.condition;
}
async function displayListedItem(listedItem) {
    let div = document.createElement('div');
    div.className = 'listed-item-content';

    let image = document.createElement('img'); 
    image.className = 'listed-item-image';
    image.src = listedItem.image;
    div.appendChild(image);

    let a = document.createElement('a');
    a.href = listedItem.link;

    let header = document.createElement('h1');
    header.className = 'listed-item-header roboto-font';
    header.textContent += listedItem.name;

    let paragraph = document.createElement('p');
    paragraph.textContent += "Price: " + listedItem.price;
    paragraph.textContent += " Condition: " + listedItem.condition;
    paragraph.className = 'listed-item-desc roboto-font'

    let typeImage = document.createElement('img');
    typeImage.src = chrome.runtime.getURL("/resources/" + listedItem.websiteType + ".png");
    typeImage.alt = "Icon Failed to Load."
    typeImage.className = "listed-item-website-type-image"


    a.appendChild(header);
    div.appendChild(a);
    div.appendChild(paragraph);
    div.appendChild(typeImage);
    document.querySelector("#right-box").appendChild(div);
}


async function fetchListedItems(type) { 

    const listedItems = []; 

    let items = await chrome.storage.local.get(["selectedListedItem"]);
    let selectedListedItem = items.selectedListedItem;
    let parser = new DOMParser();
    
    let list = [];

    if (type == "ebay") {
        let response = await fetch("https://www.ebay.com/sch/" + selectedListedItem.name);
        let string = await response.text();
        let document = parser.parseFromString(string, 'text/html');
        let list = document.querySelector("#srp-river-results > ul")
        .getElementsByTagName('li')

        for (let i = 0; i < list.length; i++) { 
            let listedItem = await readStoreElement(list[i]); 
            console.log("Item number " + i + " is being read.")
            if (listedItem.status == "succeeded") { 
                listedItems.push(listedItem);
                console.log("Item number "+ i + " succeeded.");
            }
        }
    }
    if (type == "amazon") {
        let response = await fetch("https://www.amazon.com/s?k=" + selectedListedItem.name);
        let string = await response.text();
        let document = parser.parseFromString(string, 'text/html');
        let span = document.querySelector("#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row "+
        "> div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child"+
        "(4) > div.s-main-slot.s-result-list.s-search-results.sg-row");
        let child = span.firstChild
        while (child !== null) { 
            let listedItem = await readStoreElement(child); 
            listedItems.push(listedItem);
            child = child.nextSibling; 
        } 
    }

    return listedItems;
}

async function main() { 

    let items = await chrome.storage.local.get(["selectedListedItem"]);
    let selectedListedItem = items.selectedListedItem;
    displaySelectedItem(selectedListedItem);

    let ebayListedItems = await fetchListedItems("ebay");
    let amazonListedItems = await fetchListedItems("amazon");
    let listedItems = ebayListedItems.concat(amazonListedItems);
    for (const listedItem of listedItems) { 
        displayListedItem(listedItem);
    }
}

main(); 

