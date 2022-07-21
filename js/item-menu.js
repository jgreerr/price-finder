function displayListedItem(listedItem, exist) {
    if (exist == true){
        let selectedItem = document.querySelector(".selected-item-content");

        let image = document.getElementById("selected-item-image");
        image.src = listedItem.image;

        let header = document.getElementById("selected-item-text");
        header.textContent = "Name: " + listedItem.name;
        header.textContent += " | Price: " + listedItem.price;
        header.textContent += " | Condition: " + listedItem.condition;

        selectedItem.appendChild(image);
        selectedItem.appendChild(header);
    } else { 
        let div = document.createElement('div');
        div.className = 'listed-item-content';

        let image = document.createElement('img'); 
        image.className = 'listed-item-image';
        image.src = listedItem.image;
        div.appendChild(image);
        document.body.appendChild(image);
        document.head.appendChild(image);

        let header = document.createElement('h1');
        header.className = 'listed-item-text'
        header.textContent = "Name: " + listedItem.name;
        header.textContent += " | Price: " + listedItem.price;
        header.textContent += " | Condition: " + listedItem.condition;
        div.appendChild(header);
        document.body.appendChild(div);
    }
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
    let items = await chrome.storage.local.get(["selectedListedItem"]);
    let selectedListedItem = items.selectedListedItem;
    displayListedItem(selectedListedItem, true);
    let ebayListedItems = await fetchEbayListing();
    console.log(typeof ebayListedItems);
    for (let i = 0; i < ebayListedItems.length; i++) { 
        console.log(ebayListedItems[i]);
    }
}

main(); 

