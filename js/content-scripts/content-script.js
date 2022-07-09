
let readableElement = null;

//-----------------------------------------

function addListeners() {
    // Read element listener. Sent when the context menu item is clicked.
    chrome.runtime.onMessage.addListener((message) => {
        if (message == "readElement") {      
            readStoreElement(readableElement, (selectedListedItem) => {
                chrome.storage.local.set({"selectedListedItem" : selectedListedItem}, () => {
                    // Create tab once we have parsed the data we need.
                    chrome.runtime.sendMessage("tab_create");
                });
            });
        }

    });
}


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

// ----- Reading an element ------

// Reads an HTML element and executes a callback once it has
// been obtained.
function readStoreElement(element, callback) { 
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

        let listedItem = { 
            name : "not found",
            price : "not found",
            condition : "not found", 
            image : "not found",
        }

        // Element is class name.
        if (items.validClassNames.includes(element.className)) {

            if (items.validEbayClassNames.includes(element.className)) {
                listedItem = _readEbayClassElement(element, listedItem); 

            } else if (items.validAmazonClassNames.includes(element.className)) { 
                listedItem = _readAmazonClassElement(element, listedItem);

            } else if (items.BestBuyClassNames.includes(element.className)) { 
                _readBestBuyClassElement(element, listedItem); 

            } else if (items.validWalmartClassNames.includes(element.className)) {
                _readWalmartClassElement(element, listedItem); 

            } else if (items.validNeweggClassNames.includes(element.className)) {
                _readNeweggClassElement(element, listedItem);
            } 
        } else if (items.validIdNames.includes(element.id)) {

            if (items.validEbayIdNames.includes(element.id)) {
                listedItem = _readEbayIdElement(element, listedItem);  
            } else if (items.validAmazonIdNames.includes(element.id)) {
                _readAmazonIdElement(element, listedItem); 
            }
        } else { 
            console.log("Error!");
        }
        callback(listedItem);
    })
}

function _readEbayClassElement(element, listedItem) { 
    if (element.className = "s-item__wrapper clearfix") {
        
        let name = "could not parse"

        if (element.querySelector("div > div.s-item__info."
        + "clearfix > a > h3") !== null) { 

            name = element.querySelector("div > div.s-item__"
            + "info.clearfix > a > h3").textContent;
        }

        if (element.querySelector("div > div.s-item__info.clearfix > "
        + "div.s-item__title-section > a > h3") !== null ) {

            name = element.querySelector("div > div.s-item__info.clearfix "
            + "> div.s-item__title-section > a > h3").textContent
        }

        // ----

        let condition = "could not parse";

        if (element.querySelector("div > div.s-item__info.clearfix > "
        + "div.s-item__subtitle > span.SECONDARY_INFO") !== null) {
            condition = element.querySelector("div > div.s-item__info.clearfix > "
            + "div.s-item__subtitle > span.SECONDARY_INFO").textContent;
        }

        if (element.querySelector("div > div.s-item__info.clearfix > div.s-item__"
        + "title-section > div.s-item__subtitle > span.SECONDARY_INFO") !== null) {
            condition = element.querySelector("div > div.s-item__info.clearfix > div.s-item__"
            + "title-section > div.s-item__subtitle > span.SECONDARY_INFO").textContent;
        } 
        
        // ----

        let price = "could not parse";

        if (element.querySelector("div > div.s-item__info.clearfix > "
        + "div.s-item__details.clearfix > div:nth-child(1) > span") !== null) {
            price = element.querySelector("div > div.s-item__info.clearfix > "
            + "div.s-item__details.clearfix > div:nth-child(1) > span").textContent;
        }
       
        // ----

        let image = "could not parse image "

        if (element.querySelector(".s-item__image-section").
        querySelector(".s-item__image").
        querySelector(".s-item__image-wrapper").
        querySelector(".s-item__image-img") !== null) {
            image = element.querySelector(".s-item__image-section").
            querySelector(".s-item__image").
            querySelector(".s-item__image-wrapper").
            querySelector(".s-item__image-img").src;
        }
    
        listedItem.name = name;
        listedItem.price = price;
        listedItem.condition = condition; 
        listedItem.image = image;
        return listedItem;
    }
}

function _readAmazonClassElement(element, listedItem) {

}

function _readBestBuyClassElement(element, listedItem) { 

}

function _readWalmartClassElement(element, listedItem) { 

}

function _readNeweggClassElement(element, listedItem) { 

}

function _readEbayIdElement(element, listedItem) { 
    if (element.id == "CenterPanelInternal") {
        let name = document.querySelector("#LeftSummaryPanel > div.vi-swc-lsp > "
        + "div:nth-child(1) > div > h1 > span").textContent;
        let price = document.querySelector("#prcIsum").textContent;
        let condition = document.querySelector("#mainContent > form > div.nonActPanel > div:nth-child(1) > "
        + "div > div.d-item-condition-value > div > div > div > span:nth-child(1) > span").textContent;

        let image = document.querySelector("#icImg").src;
        
        listedItem.name = name;
        listedItem.price = price;
        listedItem.condition = condition;
        listedItem.image = image;
        return listedItem;
    }
}

function _readAmazonIdElement(element, listedItem) { 
    if (element.id == "ppd") {

        let name = "could not parse"; 
        if (document.querySelector("#productTitle") !== null) { 
            name = document.querySelector("#productTitle").textContent;
        }

        //------

        let price = "could not parse";

        if (document.querySelector("#corePriceDisplay_desktop_feature_div > div.a-section.a-"
        + "spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePric"
        + "eToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole") !== null) {

            price = "$" + document.querySelector("#corePriceDisplay_desktop_feature_div > div.a-section.a-"
            + "spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePric"
            + "eToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole").textContent;
        }    


        if (document.querySelector("#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 "
        + "> span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)") !== null) { 
            price = document.querySelector("#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 "
            + "> span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)").textContent;
        }

        // Price range type.
        if (document.querySelector("#corePrice_desktop > div > table"
        + " > tbody > tr > td.a-span12 > span.a-price-range" !== null)) { 
            price = document.querySelector("#corePrice_desktop > div > table > "
            + "tbody > tr > td.a-span12 > span.a-price-range > span:nth-child(1)").textContent 
            + document.querySelector("#corePrice_desktop > div > table > "
            + "tbody > tr > td.a-span12 > span.a-price-range > "
            + "span:nth-child(3) > span:nth-child(2)").textContent;
        }

        if (document.querySelector("#sns-base-price") !== null) { 
            price = document.querySelector("#sns-base-price").textContent;
            price = price.replace(/\s+/g, '');
        }
        
        //------

        let condition = "New";

        let image = "could not parse";
        if (document.querySelector("#landingImage") !== null) {
            image = document.querySelector("#landingImage").src
        }

        listedItem.name = name;
        listedItem.price = price;
        listedItem.condition = condition;
        listedItem.image = image;
        return listedItem;
    }
}

//------------------------------------------------------

function main() {
    addListeners();
    addMouseDownForListItem();
}

main();