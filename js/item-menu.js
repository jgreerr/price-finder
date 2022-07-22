function displayListedItem(listedItem, exist) {
    if (exist == true){
        let selectedItem = document.querySelector(".listed-item-content");

        let image = document.querySelector(".listed-item-image");
        image.src = listedItem.image;

        let a = document.createElement('a');
        a.href = listedItem.link;
        let header = document.querySelector(".listed-item-text");
        header.textContent = "Name: " + listedItem.name;
        header.textContent += " | Price: " + listedItem.price;
        header.textContent += " | Condition: " + listedItem.condition;
        a.appendChild(header);

        selectedItem.appendChild(image);

        selectedItem.appendChild(a);
    } else { 
        let div = document.createElement('div');
        div.className = 'listed-item-content';

        let image = document.createElement('img'); 
        image.className = 'listed-item-image';
        image.src = listedItem.image;
        div.appendChild(image);

        let a = document.createElement('a');
        a.href = listedItem.link;
        let header = document.createElement('h1');
        header.className = 'listed-item-text';
        header.textContent = "Name: " + listedItem.name;
        header.textContent += " | Price: " + listedItem.price;
        header.textContent += " | Condition: " + listedItem.condition;
        a.appendChild(header);
        div.appendChild(a);
        document.body.appendChild(div);
    }
}

async function fetchEbayListing() { 

    const listedItems = []; 

    let items = await chrome.storage.local.get(["selectedListedItem"]);
    let selectedListedItem = items.selectedListedItem;
    let response = await fetch("https://www.ebay.com/sch/" + selectedListedItem.name);
    let string = await response.text();

    let parser = new DOMParser();
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
    listedItems.push("test");
    return listedItems;
}


async function main() { 
    let items = await chrome.storage.local.get(["selectedListedItem"]);
    let selectedListedItem = items.selectedListedItem;
    displayListedItem(selectedListedItem, true);
    let ebayListedItems = await fetchEbayListing();
    console.log(ebayListedItems);
    for (const listedItem of ebayListedItems) { 
        displayListedItem(listedItem, false);
    }
}

main(); 

