let readableElement = null;

//-----------------------------------------

async function addListeners() {
    // Read element listener. Sent when the context menu item is clicked.
    chrome.runtime.onMessage.addListener(async (message) => {
        if (message == "readElement") {  
            let selectedListedItem = await readStoreElement(readableElement);
            chrome.storage.local.set({"selectedListedItem" : selectedListedItem});
            chrome.runtime.sendMessage("tab_create");  
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

//------------------------------------------------------

async function main() {
    addListeners();
    addMouseDownForListItem();
}

main();