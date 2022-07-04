
let readableElement = null;

chrome.storage.local.get(["validEbayIdNames"], )

//--- Determine if the context menu is appopriate for the section. 

function addMouseDownForListItem() {
    document.addEventListener('mousedown', (event) => {
        let clickedElement = document.elementFromPoint(event.clientX, event.clientY);

        chrome.storage.local.get(["validClassNames", "validIdNames"], (items) => {

            let validParent = _getValidParent(clickedElement, 
                items.validClassNames, 
                items.validIdNames);

            if (validParent) {
                readableElement = validParent;
            } else {
                readableElement = clickedElement; 
            }

            if (items.validClassNames.includes(clickedElement.className) 
            || items.validIdNames.includes(clickedElement.id)
            || validParent) {
                chrome.runtime.sendMessage("create_menu");
            } else { 
                chrome.runtime.sendMessage("remove_menu");
            }
        });
    });
}


// Returns a valid parent if found, returns null if not;
function _getValidParent(clickedElement, validClassNames, validIdNames) {

    let parent = clickedElement.parentElement;
    while (parent) {
        if (validClassNames.includes(parent.className) || validIdNames.includes(parent.id)) { 
            return parent;
        } 
        parent = parent.parentElement;
    }
    return false;
}

//-----------------------------------------

function addListeners() {
    // Read element
    chrome.runtime.onMessage.addListener((message) => {
        if (message == "readElement") { 
            let script = document.createElement('script'); 
            script.textContent = console.log(readableElement);
            document.head.appendChild(script);
            
            readStoreElement(readableElement);
    
    
            // chrome.storage.local.set({"selectedItem" : {
            //     itemName : "t", 
            //     price : "", 
            //     condition : "",
            // }});
        }
    });
}

// ----- Reading an element ------

// Reads an HTML element from a variety of sites and returns a Sale Item Object. 
function readStoreElement(element) { 
    chrome.storage.local.get([
        "validEbayClassNames", 
        "validAmazonClassNames",
        "validBestBuyClassNames",
        "validWalmartClassNames",
        "validNeweggClassNames",
        "validClassNames",

        "validIdNames",
        "validEbayIdNames",
        "validAmazonIdNames"
    ], (items) => {
        // Element is class name.
        if (items.validClassNames.includes(element.className)) {

            if (items.validEbayClassNames.includes(element.className)) {
                return _readEbayClassElement(element); 

            } else if (items.validAmazonClassNames.includes(element.className)) { 
                return _readAmazonClassElement(element);

            } else if (items.BestBuyClassNames.includes(element.className)) { 
                return _readBestBuyClassElement(element); 

            } else if (items.validWalmartClassNames.includes(element.className)) {
                return _readWalmartClassElement(element); 

            } else if (items.validNeweggClassNames.includes(element.className)) {
                return _readNeweggClassElement(element);
            } 
        } else if (items.validIdNames.includes(element.id)) {

            if (items.validEbayIdNames.includes(element.id)) {
                return _readEbayIdElement(element);  
            } else if (items.validAmazonIdNames.includes(element.id)) {
                return _readAmazonIdElement(element); 
            }
        } else { 
            console.log("Error!");
        }
    })
}

function _readEbayClassElement(element) { 
    if (element.className = "s-item__wrapper clearfix") {
        
        let name = element.querySelector("div > div.s-item__info.clearfix > a > h3").textContent;

        let condition = element.querySelector("div > div.s-item__info.clearfix > "
        + "div.s-item__subtitle > span.SECONDARY_INFO").textContent;
        
        let price = element.querySelector("div > div.s-item__info.clearfix > "
        + "div.s-item__details.clearfix > div:nth-child(1) > span").textContent;

        
        let image = element.querySelector(".s-item__image-section").
        querySelector(".s-item__image").
        querySelector(".s-item__image-wrapper").
        querySelector(".s-item__image-img").src;

        let saleObject = {
            name : name,
            price : price,
            condition : condition, 

            image : image,
        }

        console.log(saleObject);

        return saleObject;
    }
}

function _readAmazonClassElement(element) {

}

function _readBestBuyClassElement(element) { 

}

function _readWalmartClassElement(element) { 

}

function _readNeweggClassElement(element) { 

}

function _readEbayIdElement(element) { 
    if (element.id == "CenterPanelInternal") {
        let name = document.querySelector("#prcIsum").textContent;
        let price = document.querySelector("#LeftSummaryPanel > div.vi-swc-lsp > "
        + "div:nth-child(1) > div > h1 > span").textContent;
        let condition = document.querySelector("#mainContent > form > div.nonActPanel > div:nth-child(1) > "
        + "div > div.d-item-condition-value > div > div > div > span:nth-child(1) > span").textContent;

        let image = document.querySelector("#icImg").src;
        
        let saleObject = {
            name : name,
            price : price,
            condition : condition, 

            image : image,
        }

        console.log(saleObject);

        return saleObject;
    }
}

function _readAmazonIdElement(element) { 

}

//------------------------------------------------------

function main() {
    addMouseDownForListItem();
    addListeners();
}

main();