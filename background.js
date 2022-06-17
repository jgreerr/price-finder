
// As soon as an extension is installed.
chrome.tabs.executeScript(null, {file: '.foreground.js'}, () => console.log("I injected!"))

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color});
    console.log("swag");
})