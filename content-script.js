
// let script = document.createElement('script');
// script.textContent = code;
// document.head.appendChild(script); 
// script.remove();

document.addEventListener('mousedown', (event) => {
    let selection = window.getSelection();
    let code = console.log(selection.toString());
    let script = document.createElement('script');
    script.textContent = code; 
    document.head.appendChild(script);
    // if (selection.toString() == "Help") {
    //     chrome.runtime.sendMessage({request: "create_menu"});
    // } else {
    //     chrome.runtime.sendMessage({request: "delete_menu"});
    // }
})