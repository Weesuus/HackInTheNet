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
	}else if(txt1.value.startsWith('cd ')){
		if(txt1.value[3] == "/"){
			//PATH
			// console.log(1)
			visualizer(txt1.value);
			changeDir(txt1.value.slice(3));
			txt1.value = "";
		}else if((txt1.value[3] == ".") && (txt1.value[4] == ".")){
			visualizer(txt1.value);

		}else if(txt1.value[3] == "."){
			visualizer(txt1.value);
			containerMain.innerHTML += '<p class="no-off">' + ". cannot be resolved" + '</p>';
			txt1.value = ""
		}else{
			//FOLDER
			visualizer(txt1.value);
			changeDir(nowPath + txt1.value.slice(3) + "/");
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



function changeDir(passed){	
	let lastX  = "", counterX = 0, lastStart = 0; lastObj = null, tmpPath = "";
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
				// console.log(lastX)
				updateLine(lastX);
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
	if(passed == username){
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
			}else if(i == (passed.length - 1)){
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

txt1.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		// visualizer();
		recognizeCommand();
		// console.log("NIBBA")
	}
})

txt1.addEventListener("keydown", function(event){
	// console.log(event.keyCode)
	let evtobj = window.event? event : event
	if (evtobj.keyCode == 67 && evtobj.ctrlKey) { //CTRL + C 
		visualizer();
		txt1.value = ""
	};
})