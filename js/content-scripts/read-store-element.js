
// Reads a store element from various sites and returns 
// a JSON file that can be displayed anywhere.
async function readStoreElement(element) { 

    const items = await chrome.storage.local.get([
        "validEbayClassNames", 
        "validAmazonClassNames",
        "validBestBuyClassNames",
        "validWalmartClassNames",
        "validNeweggClassNames",
        "validClassNames",

        "validIdNames",
        "validEbayIdNames",
        "validAmazonIdNames"
    ]);

    const listedItem = { 
        name : "not found",
        price : "not found",
        condition : "not found", 
        image : "not found",
        link : "not found",
        websiteType : "not found",
        status : "not read"
    };

    // Element is class name.
    if (items.validClassNames.includes(element.className)) {

        if (items.validEbayClassNames.includes(element.className)) {
            _readEbayClassElement(element, listedItem); 
            listedItem.status = "succeeded";
        } else if (items.validAmazonClassNames.includes(element.className)) { 
            _readAmazonClassElement(element, listedItem);
            listedItem.status = "succeeded";
        } else if (items.BestBuyClassNames.includes(element.className)) { 
            _readBestBuyClassElement(element, listedItem); 
            listedItem.status = "succeeded";

        } else if (items.validWalmartClassNames.includes(element.className)) {
            _readWalmartClassElement(element, listedItem); 
            listedItem.status = "succeeded";

        } else if (items.validNeweggClassNames.includes(element.className)) {
            _readNeweggClassElement(element, listedItem);
            listedItem.status = "succeeded";
        } 
    } else if (items.validIdNames.includes(element.id)) {

        if (items.validEbayIdNames.includes(element.id)) {
            _readEbayIdElement(element, listedItem);  
            listedItem.status = "succeeded";
        } else if (items.validAmazonIdNames.includes(element.id)) {
            _readAmazonIdElement(element, listedItem); 
            listedItem.status = "succeeded";
        }
    } else { 
        listedItem.status = "failed"; 
    }
    return listedItem;
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

        let link = "could not parse" 

        if (element.querySelector("div > div.s-item__info.clearfix > a") !== null) { 
            link = element.querySelector("div > div.s-item__info.clearfix > a").href;
        } 
    
        listedItem.name = name;
        listedItem.price = price;
        listedItem.condition = condition; 
        listedItem.image = image;
        listedItem.link = link;
        listedItem.websiteType = "ebay"
    }
}

function _readAmazonClassElement(element, listedItem) {
    let name = "could not parse";
    let condition = "could not parse";
    let price = "could not parse";
    let image = "could not parse image ";
    let link = "could not parse";

    if (element.querySelector("div > div > div > div > div.a-section.a-spacing-"
    +"small.puis-padding-left-micro.puis-padding-right-micro > div.a-section.a-spacing-none.a-"
    + "spacing-top-small.s-title-instructions-style > h2 > a > span") !== null) {

        name = element.querySelector("div > div > div > div > div.a-section.a-spacing-"
        +"small.puis-padding-left-micro.puis-padding-right-micro > div.a-section.a-spacing-none.a-"
        + "spacing-top-small.s-title-instructions-style > h2 > a > span").textContent;
    }
  
    if (element.querySelector("div > div > div > div > div.a-section.a-spacing-small."
    +"puis-padding-left-micro.puis-padding-right-micro > div.a-section.a-spacing-none.a-sp"
    +"acing-top-small.s-price-instructions-style > div > a > span:nth-child(1) > span.a-offscreen") !== null) {

        price = element.querySelector("div > div > div > div > div.a-section.a-spacing-small."
        +"puis-padding-left-micro.puis-padding-right-micro > div.a-section.a-spacing-none.a-sp"
        +"acing-top-small.s-price-instructions-style > div > a > span:nth-child(1) > span.a-offscreen").textContent;
    }

    if (element.querySelector("div > div > div > div > div.s-product-image-container.aok-re"
    +"lative.s-image-overlay-grey.s-text-center.s-padding-left-small.s-padding-right-sma"
    +"ll.puis-spacing-small.s-height-equalized > div > span > a > div > img") !== null) {

        image = element.querySelector("div > div > div > div > div.s-product-image-container.aok-re"
        +"lative.s-image-overlay-grey.s-text-center.s-padding-left-small.s-padding-right-sma"
        +"ll.puis-spacing-small.s-height-equalized > div > span > a > div > img").src;
    }
    if (element.querySelector("div > div > div > div > div.a-section.a-spacing-small.puis-p"
    +"adding-left-micro.puis-padding-right-micro > div.a-section.a-spacing-none.a-spacing-to"
    +"p-small.s-title-instructions-style > h2 > a")) {
        link = element.querySelector("div > div > div > div > div.a-section.a-spacing-small.puis-p"
        +"adding-left-micro.puis-padding-right-micro > div.a-section.a-spacing-none.a-spacing-to"
        +"p-small.s-title-instructions-style > h2 > a").href;
    }

    listedItem.name = name;
    listedItem.price = price;
    listedItem.condition = condition; 
    listedItem.image = image;
    listedItem.link = link;
    listedItem.websiteType = "amazon"

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
        listedItem.websiteType = "ebay"
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

        if (document.querySelector("#priceblock_ourprice") !== null) { 
            price = document.querySelector("#priceblock_ourprice").textContent;
        }
        if (document.querySelector("#corePriceDisplay_desktop_feature_div > div.a-section.a-"
        + "spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePric"
        + "eToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole") !== null) {

            price = "$" + document.querySelector("#corePriceDisplay_desktop_feature_div > div.a-section.a-"
            + "spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePric"
            + "eToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole").textContent;
        }    

        if (document.querySelector("#priceblock_pospromoprice") !== null) { 
            price = document.querySelector("#priceblock_pospromoprice").textContent;
        }

        if (document.querySelector("#corePrice_desktop > div > table > tbody > tr > " +
        "td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)")
        !== null) {
            price = document.querySelector("#corePrice_desktop > div > table > tbody > tr > " +
            "td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)")
            .textContent;
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
        listedItem.websiteType = "amazon"
    }
}
