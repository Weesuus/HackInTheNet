let btn1 = document.querySelector('button');
let containerMain = document.getElementById('container-main');
let txt1 = document.getElementById("in");
let txtpre = document.getElementById("in-pre");

let FOLDER = "";

let diskTest = {
	"home": {
		"weesus": {
			"Desktop": {},
			"Documents": {},
			"ecc.txt": "Enniente oggi va cosi"
		}
	}, "bin": {}, "log":{}, "sys":{"osT.sys": "version:X\ntheme:sus"}
};

let nowPath = "/home/weesus/";
let username = "weesus"
let homeDisp = "[" + username + "@MACHINE] ~ " // HOME ~
let nowDisp = homeDisp; //HOME ~ - ANY OTHER
let barPressed = true;
let startChecking = 0;

txtpre.innerText = nowDisp;

function recognizeCommand(){
	if(txt1.value.startsWith('help ') || txt1.value.startsWith('help')){
		visualizer();
		containerMain.innerHTML += '<p class="no-off">' + "help - Visualize all the Commands" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "echo - Prints a String" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "clear - Clear the Console" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "ls - List Files and Directory in Current Path or Given Path" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "cd - Change Directory in the passed Folder or Path" + '</p>';
		txt1.value = "";
	}else if(txt1.value.startsWith('echo ')){
		visualizer(txt1.value);
		containerMain.innerHTML += '<p class="no-off">' + txt1.value.slice(5) + '</p>';
		txt1.value = "";
	}else if(txt1.value.startsWith('clear')){
		containerMain.innerHTML = "";
		txt1.value = "";
	}else if(txt1.value.startsWith('ls')){
		if(txt1.value.startsWith('ls ')){
			//PASSED
			visualizer(txt1.value);
			// console.log(txt1.value.slice(3));
			let tmpF = listFiles(txt1.value.slice(3));
			// tmpF.forEach(element => containerMain.innerHTML += '<p class="no-off">' + element + '</p>');
			Object.entries(tmpF).forEach(([key, value]) => {
				containerMain.innerHTML += '<p class="no-off">' + key + '</p>';
			})
			txt1.value = "";
		}else{
			//NOT PASSED
			visualizer(txt1.value);
			let tmpF = listFiles(nowPath);
			Object.entries(tmpF).forEach(([key, value]) => {
				containerMain.innerHTML += '<p class="no-off">' + key + '</p>';
			})
			txt1.value = "";
		}
	}else if(txt1.value.startsWith('mkdir ')){
			visualizer(txt1.value);
			makeDir(txt1.value);
			txt1.value = "";
	}else if(txt1.value.startsWith('cd ')){
		if(txt1.value[3] == "/"){
			//PATH
			// console.log(1)
			visualizer(txt1.value);
			changeDir(txt1.value.slice(3));
			txt1.value = "";
		}else if((txt1.value[3] == ".") && (txt1.value[4] == ".")){
			visualizer(txt1.value);
			changeDirUpper();
			txt1.value = "";
		}else if(txt1.value[3] == "."){
			visualizer(txt1.value);
			containerMain.innerHTML += '<p class="no-off">' + ". cannot be resolved" + '</p>';
			txt1.value = "";
		}else{
			//FOLDER
			visualizer(txt1.value);
			changeDir(nowPath + txt1.value.slice(3) + "/");
			txt1.value = "";
		}
	}else if(txt1.value.startsWith('rm ')){
		if(txt1.value[3] == "/"){
			//PATH
			// console.log(1)
			visualizer(txt1.value);
			
			if (txt1.value.includes(".")){
				//FILE
				let obj = listFiles(txt1.slice(3))
				
			}else{
				//FOLDER
			}

			txt1.value = "";
		}else{
			//NAME
			visualizer(txt1.value);
			if(txt1.value.includes(".")){
				//FILE
				let obj = listFiles(nowPath);
				delete obj[txt1.value.slice(3)];
			}else{
				//FOLDER
				let obj = listFiles(nowPath);
				delete obj[txt1.value.slice(3)];
			}
			txt1.value = "";
		}
	}else{
		visualizer();
		containerMain.innerHTML += '<p class="no-off">' + txt1.value + " - Unknown Command" + '</p>';
		txt1.value = "";
	}
}

function visualizer(){
	if(txt1.value!='' || txt1.value!=' '){
		containerMain.innerHTML += '<p class="no-off">' + nowDisp + txt1.value + '</p>';
	}
}

function changeDirUpper(){
	let countSlash = 0, result = "";
	for(let i = 0; i<=nowPath.length - 1; i++){
		if(nowPath[i] == "/"){
			countSlash += 1;
		}
	}

	let counterX = 0;
	for(let i = 0; i<=nowPath.length - 1; i++){
		if(nowPath[i] == "/"){
			counterX += 1;
		}

		if((countSlash - 1) == counterX){
			result += "/";
			break;
		}else{
			result += nowPath[i];
		}
	}

	// console.log(result)
	let resultTMP = result.slice(0, -1);
	countSlash = 0;
	for(let i = 0; i<=resultTMP.length - 1; i++){
		if(resultTMP[i] == "/"){
			countSlash += 1;
		}
	}

	counterX = 0;
	let res = "";
	for(let i = 0; i<=resultTMP.length; i++){
		if(resultTMP[i] == "/"){
			if((counterX-1) == countSlash){
				break;
			}else{
				res += resultTMP[i];
			}
		}else{
			res += resultTMP[i];
		}
		counterX += 1;
	}

	nowPath = result;
	updateLine(result);
}

function changeDir(passed){	
	let lastX  = "", counterX = 0, lastStart = 0, lastObj = null, tmpPath = "";
	for(var i = 0; i<=passed.length - 1; i++){
		if(passed[i] == '/'){
			if(counterX == 0){
				lastObj = diskTest;
				tmpPath = "/"
			}else if(i == (passed.length - 1)){
				lastObj = lastObj[lastX];
				if(lastObj == null){
					containerMain.innerHTML += '<p class="no-off">Error Directory not Found</p>';
					break;
				}
				tmpPath += lastX + "/" 
				nowPath = tmpPath;
				updateLine(nowPath);
            	break;
        	}else{
				lastObj = lastObj[lastX];
				tmpPath += lastX + "/"
				lastStart = counterX;
				lastX = "";
			}
		}else{
			lastX += passed[i];
		}
		counterX+=1;
	}
}

function updateLine(passed){
	if(passed.endsWith(username + "/")){
		nowDisp = homeDisp;
		txtpre.innerText = nowDisp;
		// break;
	}else{
	// console.log(passed)
		nowDisp = "[" + username + "@MACHINE " + passed + "] - ";
		txtpre.innerText = nowDisp;
		// break;
	}
}

function deleteSomething(passed){

}

function listFiles(passed){
	let lastX = "", counterX = 0, lastStart = 0, lastObj = null;
	for (var i = 0; i <= passed.length - 1; i++) {
		// console.log(i)
		// console.log(passed.length)
		// console.log(passed[i])

		if(passed[i] == '/'){
			if(counterX == 0){
				// console.log(22)
				lastObj = diskTest;
				if (passed.length == 1){
					return lastObj;
					break;
				}
			}else if(i == (passed.length - 1) && counterX != 0){
				lastObj = lastObj[lastX];
				return lastObj;
				// console.log("lastObj");
            	break;
        	}else{
				lastObj = lastObj[lastX];
			// console.log(lastObj);
				lastStart = counterX;
				lastX = "";
			}
		}else{
        	// console.log(passed.length)
        	// console.log(i)
			lastX += passed[i];
		}
		counterX+=1;
	}
	// console.log(lastObj)
}

function makeDir(passed){ //PASSED IS THE FOLDER NAME OR THE PATH
	if(passed[0] == "/"){
		//PATH
	}else{
		//NAME
		let nowLS = listFiles(nowPath);
		nowLS[passed.slice(6)] = {}
	}
}

function myAutocomplete(){
	let baseCommand = ["echo", "ls", "help", "clear", "cd", "mkdir"];
	let otherComp = Object.keys(listFiles(nowPath));
	
	let result;
	if(barPressed == true){
		result = otherComp.filter(word => word.startsWith(txt1.value.slice(startChecking + 1)));
	}else{
		baseCommand.push.apply(baseCommand, otherComp);
		result = baseCommand.filter(word => word.startsWith(txt1.value));
	}

	if(result[0] != null && barPressed == false){
		txt1.value = result[0];
	}else if(result[0] != null && barPressed == true){
		txt1.value = txt1.value + result[0].slice(txt1.value.slice(startChecking + 1).length);
	}else{
		// console.log(result[0])
	}

}

txt1.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		startChecking = 0;
		barPressed = false;
		recognizeCommand();
		// console.log("NIBBA")
	}
})

txt1.addEventListener("keydown", function(event){
	// console.log(event.keyCode)
	let evtobj = window.event? event : event
	if (evtobj.keyCode == 67 && evtobj.ctrlKey) { //CTRL + C 
		visualizer();
		txt1.value = "";
	}else if(evtobj.keyCode == 9){
		event.preventDefault();
		// alert("prova");
		myAutocomplete();
	}else if(evtobj.keyCode == 32){
		barPressed = true;
		startChecking = (txt1.value.length);
	}
})