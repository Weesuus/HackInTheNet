let prefixPath = document.getElementById("inPre");
let innerCommnand = document.getElementById("in");
let containerTerminal = document.getElementById("containerTerminal");
let containerInput = document.getElementById("containerInput");

let username, nowPath, homeDisp, nowDisp, disk, nowDisk, machineName, registerRoute = 0;
let allCommands = ["help", "echo", "clear", "ls", "cd", "touch", "mkdir", "rm", "usrmod", "machinemod"]

username = "user";
machineName = "MACHINE";
disk = {
    "home": {}, "bin": {}, "log":{}, "sys":{"osT.sys": "version:X\ntheme:sus"}
};
disk["home"][username] = {
    "Desktop": {},
    "Documents": {}
}
nowPath = "/home/" + username + "/";
homeDisp = "[" + username + "@" + machineName + "] ~ ";
prefixPath.innerText = homeDisp;
nowDisp = homeDisp;
nowDisk = disk.home[username];

containerTerminal.innerHTML += '<p class="no-off">' + nowDisp + "You can change the default username with 'usrmod newusername'" + '</p>';
containerTerminal.innerHTML += '<p class="no-off">' + nowDisp + "You can change the default machine name with 'machinemod newmachinename'" + '</p>';
containerTerminal.innerHTML += '<p class="no-off errorX">' + "Pay attention every time that you change Username or Machine Name all data will be Lost!" + '</p>';


// LOADING SAVEDATA
let form = document.getElementById("formSaves");
let inputFile = document.getElementById("jsonIn");
let saveBtn = document.getElementById("saveBtn")
form.addEventListener('submit', event => {
    event.preventDefault();
    if (!inputFile.value.length) return;

    let reader = new FileReader();
    reader.onload = chargeSavedata;
    reader.readAsText(inputFile.files[0]);
    chargeSavedata(event);
    
});
saveBtn.addEventListener('click', event => {
    saveSavedata();
});
function chargeSavedata(event){
    let str = event.target.result;
    let json = JSON.parse(str);
    username = json["username"];
    machineName = json["machine"];
    disk = json["disk"];
    // console.log(username);

    nowPath = "/home/" + username + "/";
    homeDisp = "[" + username + "@" + machineName + "] ~ "; // HOME ~ / ANY OTHER -
    prefixPath.innerText = homeDisp;
    nowDisp = homeDisp;
    nowDisk = disk.home[username];

    containerTerminal.innerHTML = "";
}
function saveSavedata(){
    let savedata = {
        "username": username,
        "machine": machineName,
        "disk": disk
    };
    // console.log(JSON.stringify(savedata));
    
    const file = new File([JSON.stringify(savedata)], 'savedata.json', {
        type: 'text/plain',
    })

    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

let commandsCache = [];
let nowCache = 0;

function visualizer(){
    if(innerCommnand.value != '' || innerCommnand != " "){
        containerTerminal.innerHTML += '<p class="no-off">' + nowDisp + innerCommnand.value + '</p>';
    }
}

// function visualizerInput(passed){
//     containerInput.innerHTML += '<p class="no-off">' + passed + '</p>';
//     prefixPath.innerText = passed
// }

function commandsExecutioner(){

    if(innerCommnand.value.startsWith('help ') || innerCommnand.value == "help"){
		visualizer();
		containerTerminal.innerHTML += '<p class="no-off">' + "help - Visualize all the Commands" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "echo - Prints a String" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "clear - Clear the Console" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "ls - List Files and Directory in Current Path or Given Path" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "cd - Change Directory in the passed Folder ,Path or Upper(..)" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "touch - Create a Text File as passed Filename with Extension(filename.txt) or Path" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "mkdir - Make a Dir as passed Name or Folder Path" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "rm - Delete a File or a Folder as passed Name or Path" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "usermod - Change username (ATTENTION:loss all data!)" + '</p>';
		containerTerminal.innerHTML += '<p class="no-off">' + "machinemod - Change machine name (ATTENTION:loss all data!)" + '</p>';

        innerCommnand.value = "";
	}else if(innerCommnand.value.startsWith("echo ")){
        visualizer();
        containerTerminal.innerHTML += '<p class="no-off">' + innerCommnand.value.slice(5) + '</p>';
        innerCommnand.value = "";
    }else if(innerCommnand.value.startsWith('clear')){
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
    }else if(innerCommnand.value.startsWith("touch")){
        if(takeArg(innerCommnand.value) == ""){
            visualizer();
		    containerTerminal.innerHTML += '<p class="no-off errorX">touch take a filename(with ext) or filepath(with ext)</p>';
		    innerCommnand.value = "";    
        }else{
            //visualizer();
            if(!takeArg(innerCommnand.value).includes(".")){
                visualizer();
                containerTerminal.innerHTML += '<p class="no-off errorX">' + innerCommnand.value + "the File need an Extension (txt,c,ecc.)" + '</p>';
                innerCommnand.value = "";
            }
            if(takeArg(innerCommnand.value).startsWith("/")){ // PATH TO FILENAME
                visualizer;
                createFile(takeArg(innerCommnand.value));
                innerCommnand.value = "";
            }else{ // FILENAME
                visualizer;
                createFile(nowPath + takeArg(innerCommnand.value));
                innerCommnand.value = "";
            }
        }
    }else if(innerCommnand.value.startsWith("mkdir")){
        if(takeArg(innerCommnand.value) == ""){
            visualizer();
		    containerTerminal.innerHTML += '<p class="no-off errorX">mkdir take a Name(that ends with /) or folder path</p>';
		    innerCommnand.value = "";
        }else{
            //visualizer();
            if(takeArg(innerCommnand.value).startsWith("/")){ // PATH TO FOLDER
                visualizer;
                if(takeArg(innerCommnand.value).endsWith("/")){
                    createDir(takeArg(innerCommnand.value));
                }else{
                    createDir(takeArg(innerCommnand.value) + "/");
                }
                innerCommnand.value = "";
            }else{ // FOLDERNAME
                visualizer;
                if(takeArg(innerCommnand.value).endsWith("/")){
                    createDir(nowPath + takeArg(innerCommnand.value));
                }else{
                    createDir(nowPath + takeArg(innerCommnand.value) + "/");
                }
                // createFile(nowPath + takeArg(innerCommnand.value));
                innerCommnand.value = "";
            }
        }
    }else if(innerCommnand.value.startsWith("rm")){
        let tmpX = takeArg(innerCommnand.value);
        if(takeArg(innerCommnand.value).endsWith("/")){ // PATH
            tmpX = tmpX.slice(0, -1);
        }

        if(tmpX.startsWith("/")){ // PATH
            visualizer();
            delete listFiles(delLastFromPath(takeArg(innerCommnand.value)))[takeLastSlash(takeArg(innerCommnand.value))]
            innerCommnand.value = "";
        }else{ // NAME
            visualizer();
            delete nowDisk[tmpX];
            innerCommnand.value = ""; 
        }
    }else if(innerCommnand.value.startsWith("usrmod")){
        visualizer();
        if(takeArg(innerCommnand.value) != ""){
            username = takeArg(innerCommnand.value);
            machineName = machineName;
            disk = {
                "home": {}, "bin": {}, "log":{}, "sys":{"osT.sys": "version:X\ntheme:sus"}
            };
            disk["home"][username] = {
                "Desktop": {},
                "Documents": {}
            }
            nowPath = "/home/" + username + "/";
            homeDisp = "[" + username + "@" + machineName + "] ~ ";
            prefixPath.innerText = homeDisp;
            nowDisp = homeDisp;
            nowDisk = disk.home[username];
            containerTerminal.innerHTML += '<p class="no-off">' + nowDisp + "Username Changed" + '</p>';
            innerCommnand.value = ""
        }else{
            containerTerminal.innerHTML += '<p class="no-off errorX">' + innerCommnand.value + " - Takes one argument, ex: usrmod newusername" + '</p>';
		    innerCommnand.value = "";
        }
    }else if(innerCommnand.value.startsWith("machinemod")){
        visualizer();
        if(takeArg(innerCommnand.value) != ""){
            username = username;
            machineName = takeArg(innerCommnand.value);
            disk = {
                "home": {}, "bin": {}, "log":{}, "sys":{"osT.sys": "version:X\ntheme:sus"}
            };
            disk["home"][username] = {
                "Desktop": {},
                "Documents": {}
            }
            nowPath = "/home/" + username + "/";
            homeDisp = "[" + username + "@" + machineName + "] ~ ";
            prefixPath.innerText = homeDisp;
            nowDisp = homeDisp;
            nowDisk = disk.home[username];
            containerTerminal.innerHTML += '<p class="no-off">' + nowDisp + "Username Changed" + '</p>';
            innerCommnand.value = ""
        }else{
            containerTerminal.innerHTML += '<p class="no-off errorX">' + innerCommnand.value + " - Takes one argument, ex: usrmod newusername" + '</p>';
		    innerCommnand.value = "";
        }
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
function takeLastSlash(passed){
    let counterSlash = 0;
    for(let i=0; i<passed.length; i++){
        if(passed[i] == "/"){
            counterSlash += 1;
        }
    }

    let segmentI = "";
    tmpDisk = disk;
    let counterDelta = 0, stopSign = true;
    for(let i=0; i<passed.length; i++){
        if(passed[i]=="/"){
            counterDelta += 1;
            if(counterDelta == counterSlash-1){
                stopSign = false;
            }
        }else{
            if(!stopSign){
                segmentI += passed[i];
            }
        }
    }
    return segmentI;
}
function delAfterLastSlash(passed){
    let counterSlash = 0;
    for(let i=0; i<passed.length; i++){
        if(passed[i] == "/"){
            counterSlash += 1;
        }
    }

    let tmpPath = "/", segmentI = "";
    tmpDisk=disk;
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
    tmpDisk=disk;
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

    let tmpPath = "/", segmentI = "", tmpDisk=disk;
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
            segmentI = "";
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
function createFile(passed){
    let tmpZELE = listFiles(delAfterLastSlash(passed));
    // console.log(passed);
    // console.log(delBeforeLastSlash(passed));
    if(delBeforeLastSlash(passed) in tmpZELE){
		containerTerminal.innerHTML += '<p class="no-off errorX">' + "This File already Exist" + '</p>';
    }else{
        tmpZELE[delBeforeLastSlash(passed)] = "";
    }
}
function createDir(passed){
    let tmpZELE = listFiles(delLastFromPath(passed));
    // // console.log(tmpZELE);
    // // console.log(passed);
    if(takeLastSlash(passed).toString() in tmpZELE){
		containerTerminal.innerHTML += '<p class="no-off errorX">' + "This Folder already Exist" + '</p>';
    }else{
        tmpZELE[takeLastSlash(passed)] = {};
    }
}
function pathToObj(passed){
    let tmpDisk = disk;
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
    let tmpDisk = disk;
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
function myAutocompleter(passed, kind){
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
            res.push(key);
        })
        if(kind==true){
            allCommands.forEach(cmd => {
                res.push(cmd);
            })
        }
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
        innerCommnand.scrollTo(0,20);
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
            myAutocompleter(innerCommnand.value, true);
        }else{
            myAutocompleter(takeArg(innerCommnand.value), false);
        }
    }
})