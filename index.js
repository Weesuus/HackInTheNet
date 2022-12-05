let btn1 = document.querySelector('button');
let containerMain = document.getElementById('container-main');
let txt1 = document.getElementById("in");
let txtpre = document.getElementById("in-pre");

let FOLDER = "";

let nowPath = "/home/USERNAME/";
let nowDisp = "[USERNAME@MACHINE FOLDER] ~ "; //HOME ~ - ANY OTHER $

txtpre.innerText = nowDisp;

function recognizeCommand(){
	if(txt1.value.startsWith('help')){
		visualizer();
		containerMain.innerHTML += '<p class="no-off">' + "help - Visualize all the Commands" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "echo - Prints a String" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "clear - Clear the Console" + '</p>';
		containerMain.innerHTML += '<p class="no-off">' + "ls - List Files and Directory in Current Path or Given Path" + '</p>';
		txt1.value = ""
	}else if(txt1.value.startsWith('echo')){
		visualizer(txt1.value);
		containerMain.innerHTML += '<p class="no-off">' + txt1.value.slice(5) + '</p>';
		txt1.value = ""
	}else if(txt1.value.startsWith('clear')){
		containerMain.innerHTML = ""
		txt1.value = ""
	}else if(txt1.value.startsWith('ls')){
		if(txt1.value.slice(3) != ''){
			//PASSED
		}else{
			listFiles()
		}
	}else{
		visualizer();
		containerMain.innerHTML += '<p class="no-off">' + txt1.value + " - Unknown Command" + '</p>';
		txt1.value = ""
	}
}

function visualizer(){
	if(txt1.value!='' || txt1.value!=' '){
		containerMain.innerHTML += '<p class="no-off">' + nowDisp + txt1.value + '</p>';
	}
}

function listFiles(){
	let requestURL = './machineTest.json';
	let request = new XMLHttpRequest();
	request.open("GET", requestURL);
	request.responseType = 'json';
	request.send();

	request.onload = function () {
		const machineJ = request.response;
		console.log(machineJ.disk)
	}
}

function listJustFromFolder(passed){
	let requestURL = "./machineTest.json";
	let request = new XMLHttpRequest();
	request.open("GET", requestURL);
	request.responseType = 'json';
	request.send();

	let slashCounter = 0;
	let tempo = "";
	let counter = 0;
	for(let i in passed){
		counter += 1;
		if(i == '/'){
			slashCounter += 1;
		}
	}

	request.onload = function () {
		const machineJ = request.response;
		//QUI
	}
}

function fromPathToSus(passed){
	let requestURL = './machineTest.json';
	let request = new XMLHttpRequest();
	request.open("GET", requestURL);
	request.responseType = 'json';
	request.send();

	let resArr = [];

	request.onload = function () {
		const machineJ = request.response;
		console.log(machineJ.disk)
		for(let temp in machineJ.disk.dirs){
			console.log(temp)
			resArr.push(temp)
		}
	}

}

txt1.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		// visualizer();
		recognizeCommand();
		// console.log("NIBBA")
	}
})