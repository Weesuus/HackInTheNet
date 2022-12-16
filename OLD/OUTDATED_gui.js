let prefixPath = document.getElementById("inPre");
let innerCommnand = document.getElementById("in");
let containerTerminal = document.getElementById("containerTerminal");
let containerInput = document.getElementById("containerInput");

function updateWidth(){
    let valX = containerInput.offsetWidth - prefixPath.offsetWidth - 30;
    innerCommnand.style.width = valX.toString() + "px";
}

innerCommnand.addEventListener("keydown", function(event){
    // let eventObj = window.Event? event:event
    if(event.key === "Enter"){
        // event.preventDefault();
        updateWidth();
    }
})