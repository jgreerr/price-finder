
chrome.runtime.onInstalled.addListener(() => { 

    chrome.storage.local.set({"validEbayClassNames" : [ 
        "s-item s-item__pl-on-bottom s-item--watch-at-corner",
        "s-item s-item__pl-on-bottom",
        "s-item__wrapper clearfix"
    ]});

    chrome.storage.local.set({"validAmazonClassNames": [ 
        "s-card-container s-overflow-hidden aok-relative s-expand-height "
        + "s-include-content-margin s-latency-cf-section s-card-border",
        "sg-row",
        "sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 " +
        "AdHolder sg-col s-widget-spacing-small sg-col-4-of-20"
    ]});

    chrome.storage.local.set({"validBestBuyClassNames": [ 
        "sku-item", "shop-sponsored-listing", "container-v3",
    ]});

    chrome.storage.local.set({"validWalmartClassNames": [ 
        "flex items-center",
        "h-100 pb1-xl pr4-xl pv1 ph1",
        "mb1 ph1 pa0-xl bb b--near-white w-33",
        "h-100 relative",
    ]});

    chrome.storage.local.set({"validNeweggClassNames": [ 
        "product-main display-flex",
        "product-buy-box",
        "item-cell"
    ]});

    chrome.storage.local.set({"validEbayIdNames": ["CenterPanelInternal"]});
    chrome.storage.local.set({"validAmazonIdNames" : ["ppd"]});

    chrome.storage.local.get(["validEbayClassNames", "validAmazonClassNames", 
    "validBestBuyClassNames", "validWalmartClassNames",
    "validNeweggClassNames"], (items) => {
        let validClassNames = [];
        validClassNames.push(...items.validEbayClassNames);
        validClassNames.push(...items.validAmazonClassNames);
        validClassNames.push(...items.validBestBuyClassNames);
        validClassNames.push(...items.validWalmartClassNames);
        validClassNames.push(...items.validNeweggClassNames);
        chrome.storage.local.set({"validClassNames" : validClassNames});
    });

    chrome.storage.local.get(["validEbayIdNames", "validAmazonIdNames"], (items) => { 
        let validIdNames = [];
        validIdNames.push(...items.validEbayIdNames);
        validIdNames.push(...items.validAmazonIdNames);
        chrome.storage.local.set({"validIdNames" : validIdNames});
    })
})


//-----------------------------------------

// Context menu creation
chrome.runtime.onMessage.addListener((message) => {
    if (message == "create_menu") {
        chrome.contextMenus.removeAll(() => {
            chrome.contextMenus.create({
                title : 'Check price', 
                contexts : ["all"], 
                id : "1", 
                type : 'normal'
            })
        });
    } else if (message == "remove_menu") {
        chrome.contextMenus.removeAll();
    }
})

// Tab creation
chrome.runtime.onMessage.addListener((message) => {
    if (message == "tab_create") {
        chrome.tabs.create({url : 'html/item-menu.html'});      
    }
})

//-----------------------------------------


// On click of the context menu item.
chrome.contextMenus.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, "readElement"); 
    });         
});

chrome.tabs.onActivated.addListener(() => chrome.contextMenus.removeAll());
