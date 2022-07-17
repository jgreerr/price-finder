
function displaySelectedListedItem() { 
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
}

async function fetchEbayListing() { 

    let listedItems = []; 

    let items = await chrome.storage.local.get(["selectedListedItem"]);
    let selectedListedItem = items.selectedListedItem;
    let response = await fetch("https://www.ebay.com/sch/" + selectedListedItem.name);
    let string = await response.text();

    let parser = new DOMParser();
    let document = parser.parseFromString(string, 'text/html');
    let list = document.querySelector("#srp-river-results > ul")
    .getElementsByTagName('li')

    for (let i = 0; i < list.length; i++) { 
        readStoreElement(list[i], (listedItem) => { 
            if (listedItem.status == "succeeded") { 
                listedItems.push(listedItem);
            }
        });
    }

    return listedItems;
}


async function main() { 
    displaySelectedListedItem();
    let ebayListedItems = await fetchEbayListing();
    console.log(ebayListedItems);
}

main(); 

