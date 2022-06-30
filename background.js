
chrome.runtime.onMessage.addListener((message) => {
    if (message == "create_menu") {
        console.log("Message has been recieved");
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

chrome.tabs.onActivated.addListener(() => chrome.contextMenus.removeAll());