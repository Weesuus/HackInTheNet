let prefixPath = document.getElementById("inPre");
let innerCommnand = document.getElementById("in");
let containerTerminal = document.getElementById("containerTerminal");
let containerInput = document.getElementById("containerInput");

let username = "weesus";
let nowPath = "/home/" + username + "/";
let homeDisp = "[" + username + "@MACHINE] ~ " // HOME ~ / ANY OTHER -
nowDisp = homeDisp;

let commandsCache = [];
let nowCache = 0;

let diskTest = {
    "home": {}, "bin": {}, "log":{}, "sys":{"osT.sys": "version:X\ntheme:sus"}
};

diskTest["home"][username] = {
    "Desktop": {},
    "Documents": {},
    "ecc.txt": "Enniente oggi va cosi"
}

let nowDisk = diskTest.home[username]; 

function visualizer(){
    if(innerCommnand.value != '' || innerCommnand != " "){
        containerTerminal.innerHTML += '<p class="no-off">' + nowDisp + innerCommnand.value + '</p>';
    }
}

function commandsExecutioner(){

    if(innerCommnand.value.startsWith('help ') || innerCommnand.value == "help"){
		visualizer();
		containerTerminal.innerHTML += '<p class="no-off">' + "help - Visualize all the Commands" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "echo - Prints a String" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "clear - Clear the Console" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "ls - List Files and Directory in Current Path or Given Path" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "cd - Change Directory in the passed Folder ,Path or Upper(..)" + '</p>';
		innerCommnand.value = "";
	}else if(innerCommnand.value.startsWith("echo ")){
        visualizer();
        containerTerminal.innerHTML += '<p class="no-off">' + innerCommnand.value.slice(5) + '</p>';
        innerCommnand.value = "";
    }else if(innerCommnand.value == 'clear' || innerCommnand.value == 'clear '){
        containerTerminal.innerHTML = "";
        innerCommnand.value = "";
    }else if(innerCommnand.value.startsWith("ls")){
        if(takeArg(innerCommnand.value) == ""){
            //NOT PASSED
            visualizer();
            let tmpLs = listFiles(nowPath);
            Object.entries(tmpLs).forEach(([key, value]) => {
                let tmpKey = key;
                if(!key.includes(".")){
                    tmpKey += "/"
                }
				containerTerminal.innerHTML += '<p class="no-off">' + tmpKey + '</p>';
			})
            innerCommnand.value = "";
        }else{
            //PASSED
            if(!innerCommnand.value.endsWith("/") && !innerCommnand.value.endsWith("/ ")){
                visualizer();
                containerTerminal.innerHTML += '<p class="no-off errorX">ls can only take Path or Folder</p>';
            }else{
                visualizer();
                let tmpLs = listFiles(takeArg(innerCommnand.value));
                Object.entries(tmpLs).forEach(([key, value]) => {
                    let tmpKey = key;
                    if(!key.includes(".")){
                        tmpKey += "/"
                    }
                    containerTerminal.innerHTML += '<p class="no-off">' + tmpKey + '</p>';
                })
                innerCommnand.value = "";
            }
            
        }
    }else if(innerCommnand.value.startsWith("cd")){
        visualizer();
        changeDir(takeArg(innerCommnand.value));
        // console.log(nowPath);
        updateLine(nowPath);
        innerCommnand.value = "";
    }else{
        visualizer();
		containerTerminal.innerHTML += '<p class="no-off errorX">' + innerCommnand.value + " - Unknown Command" + '</p>';
		innerCommnand.value = "";
    }

}

//START UTILS
function takeArg(passed){
    let res = "", stopSign = true;
    for(let i=0; i<passed.length; i++){
        if(!stopSign){
            res += passed[i];
        }else if(passed[i] == " "){
            stopSign = false;
        }
    }
    return res;
}
function delAfterLastSlash(passed){
    let counterSlash = 0;
    for(let i=0; i<passed.length; i++){
        if(passed[i] == "/"){
            counterSlash += 1;
        }
    }

    let tmpPath = "/", segmentI = "";
    tmpDisk=diskTest;
    let counterDelta = 0;
    mainProc: for(let i=0; i<passed.length; i++){
        if(i==0 && passed[0] == "/"){
            counterDelta += 1;
            if(counterDelta == counterSlash){
                break mainProc;
            }
        }else if(passed[i] == "/"){
            counterDelta += 1;
            tmpPath += segmentI + "/";
            segmentI = ""
            if(counterDelta == counterSlash){
                break mainProc;
            }
        }else{
            segmentI += passed[i];
        }
    }
    return tmpPath;
}
function delBeforeLastSlash(passed){
    let counterSlash = 0;
    for(let i=0; i<passed.length; i++){
        if(passed[i] == "/"){
            counterSlash += 1;
        }
    }

    let startTaking = false;
    let segmentI = "";
    tmpDisk=diskTest;
    let counterDelta = 0;
    for(let i=0; i<passed.length; i++){
        if(i==0 && passed[0] == "/"){
            counterDelta += 1;
            if(counterDelta == counterSlash){
                startTaking = true;
            }
        }else if(passed[i] == "/"){
            counterDelta += 1;
            if(counterDelta == counterSlash){
                startTaking = true;
            }
        }else if(startTaking){
            segmentI += passed[i];
        }
    }
    return segmentI;
}
function delLastFromPath(passed){
    let counterSlash = 0;
    for(let i=0; i<passed.length; i++){
        if(passed[i] == "/"){
            counterSlash += 1;
        }
    }

    let tmpPath = "/", segmentI = "", tmpDisk=diskTest;
    let counterDelta = 0;
    mainProc: for(let i=0; i<passed.length; i++){
        if(i==0 && passed[0] == "/"){
            counterDelta += 1;
            if(counterDelta == counterSlash-1){
                break mainProc;
            }
        }else if(passed[i] == "/"){
            tmpPath += segmentI + "/";
            counterDelta += 1;
            if(counterDelta == counterSlash-1){
                break mainProc;
            }
        }else{
            segmentI += passed[i];
        }
    }
    // console.log(tmpPath)
    return tmpPath;
}
//END UTLIS

//START DISK MANAGE
function pathToObj(passed){
    let tmpDisk = diskTest;
    let segmentI = "", tmpPath = "/";
    for(let i=0; i<passed.length; i++){
        if(i==0 && passed[0] == "/"){
            if(passed == "/" || passed =="/ "){
                return [tmpDisk, tmpPath];
            }
        }else if(passed[i] == "/"){
            tmpPath += segmentI + "/"
            tmpDisk = tmpDisk[segmentI];
            if(i == passed.length-1){
                // console.log(segmentI);
                return [tmpDisk, tmpPath];
            }
            segmentI = "";
        }else{
            segmentI += passed[i];
        }
    }
}
function listFiles(passed){
    let tmpDisk = diskTest;
    let segmentI = "";
    for(let i=0; i<passed.length; i++){
        if(i==0 && passed[0] == "/"){
            if(passed == "/" || passed =="/ "){
                return tmpDisk;
            }
        }else if(passed[i] == "/"){
            tmpDisk = tmpDisk[segmentI];
            if(i == passed.length-1){
                // console.log(segmentI);
                return tmpDisk;
            }
            segmentI = "";
        }else{
            segmentI += passed[i];
        }
    }
    // console.log(tmpDisk)
}
function changeDir(passed){
    // console.log(passed)
    if(passed == ".."){
        let tmpX = delLastFromPath(nowPath);
        let tmpObj = pathToObj(tmpX);
        nowDisk = tmpObj[0];
        nowPath = tmpObj[1];
    }else if(passed[0] == "/"){
        let tmpObj = pathToObj(passed);
        nowDisk = tmpObj[0];
        nowPath = tmpObj[1];
    }else{
        let tmpX = passed;
        if(!passed.endsWith("/") || !passed.endsWith("/ ")){
            tmpX += "/"
        }
        let tmpObj = pathToObj(nowPath+tmpX);
        nowDisk = tmpObj[0];
        nowPath = tmpObj[1];
    }
}
//END DISK MANAGE

//START GUI
function updateWidth(){
    let valX = containerInput.offsetWidth - prefixPath.offsetWidth - 30;
    innerCommnand.style.width = valX.toString() + "px";
}
function updateLine(passed){
	if(passed.endsWith(username + "/")){
		nowDisp = homeDisp;
		prefixPath.innerText = nowDisp;
		// break;
	}else{
	// console.log(passed)
		nowDisp = "[" + username + "@MACHINE " + passed + "] - ";
		prefixPath.innerText = nowDisp;
		// break;
	}
}
function myAutocompleter(passed){
    if(passed.startsWith("/")){ // PATH
        let res = [];
        
        // console.log(delAfterLastSlash(passed))
        // console.log(passed)

        let objX = listFiles(delAfterLastSlash(passed));
        Object.entries(objX).forEach(([key, value]) => { 
        res.push(key);
        })
        result = res.filter(word => word.startsWith(delBeforeLastSlash(passed)));
        
        // console.log(result);
        // console.log(result[0]);
        // console.log(passed)
        // console.log(delAfterLastSlash(passed))
        // console.log(delBeforeLastSlash(passed).length)

        innerCommnand.value += result[0].slice(delBeforeLastSlash(passed).length) + "/";
    }else{ // FILE,FOLDER
        let res=[];
        let objX = listFiles(nowPath);
        Object.entries(objX).forEach(([key, value]) => {
            // if(key.includes('.')){
            //     res.push(key)
            // }else{
            //     res.push(key.toString()+"/")
            // }
            res.push(key);
        })
        result = res.filter(word => word.startsWith(passed));
        innerCommnand.value += result[0].slice(passed.length);
    }
}
//END GUI

innerCommnand.addEventListener("keydown", function(event){
    // let eventObj = window.Event? event:event
    if(event.key === "Enter"){
        event.preventDefault();
        
        commandsCache.unshift(innerCommnand.value);
        
        commandsExecutioner();
        updateWidth();
    }
})

innerCommnand.addEventListener("keydown", function(event){
    let eventObj = window.event? event : event;
    if(eventObj.keyCode == 76 && eventObj.ctrlKey) { //CTRL + L Clear
        event.preventDefault()
        containerTerminal.innerHTML = "";
        innerCommnand.innerHTML = ""; 
    }else if(eventObj.keyCode == 67 && eventObj.ctrlKey) { //CTRL + C Cancel or Interrupt
		visualizer();
		innerCommnand.value = "";
	}else if(eventObj.keyCode == 38){ // KEY UP - CACHE COMMAND UP
        // console.log("NIBBASU")
        if(nowCache == 0){
            commandsCache.unshift(innerCommnand.value);
        }
        nowCache += 1;
        if(commandsCache[nowCache] != null){
            innerCommnand.value = commandsCache[nowCache]
        }else{
            nowCache -= 1;
        }
    }else if(eventObj.keyCode == 40){ // KEY DOWN - CACHE COMMAND DOWN
        if(nowCache != 0){
            innerCommnand.value = commandsCache[0];
            nowCache = 0;
            commandsCache.shift();
        }
    }else if(eventObj.keyCode == 9){ // TAB - TABULATION COMPLETER (PATH,FILE,FOLDER)
        event.preventDefault();
        if(takeArg(innerCommnand.value) == "" || takeArg(innerCommnand.value) == null){
            myAutocompleter(innerCommnand.value);
        }else{
            myAutocompleter(takeArg(innerCommnand.value));
        }
    }
})