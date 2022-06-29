
chrome.contextMenus.onClicked.addListener((OnClickData) => {
    console.log("Clicked");
});

chrome.runtime.onMessage.addListener((message) => {
    if (message == "create_menu") {
        chrome.contextMenus.create({
            title : 'Check price',
            contexts : ["all"],
            id : "1",
            type : 'normal', 
        })
    } else if (message == "delete_menu") {
        chrome.contextMenus.removeAll();
    }
})