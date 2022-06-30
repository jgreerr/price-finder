
// This script is injected into all websites that we want to compare prices with.

const validClassNames = [
    // Ebay
   "s-item s-item__pl-on-bottom s-item--watch-at-corner",
    // Amazon
   "s-card-container s-overflow-hidden aok-relative s-expand-height "
   + "s-include-content-margin s-latency-cf-section s-card-border",
   // BestBuy
   "sku-item", "shop-sponsored-listing"

];
const validIdNames = [
    // Ebay
    "CenterPanelInternal",
    // Amazon
    "ppd" 
];

//--- Determine if the context menu is appopriate for the section. 

function addMouseDownForListItem() {
    document.addEventListener('mousedown', (event) => {
        let clickedElement = document.elementFromPoint(event.clientX, event.clientY);
    
        let script = document.createElement('script');
        script.textContent = console.log(clickedElement); 
        document.head.appendChild(script);

        let validParent = _hasValidParent(clickedElement);

        if (validClassNames.includes(clickedElement.className) 
        || validIdNames.includes(clickedElement.id)
        || validParent) {
            chrome.runtime.sendMessage("create_menu");
        } else { 
            chrome.runtime.sendMessage("remove_menu");
        }
    })
}

function _hasValidParent(clickedElement) {

    let parent = clickedElement.parentElement;
    while (parent) {
        if (validClassNames.includes(parent.className) || validIdNames.includes(parent.id)) { 
            return true;
        } 
        parent = parent.parentElement;
    }
    return false;
}

//------------------------------------------------------

function main() {
    addMouseDownForListItem();
}

main();