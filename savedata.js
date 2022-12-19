// // const form1 = document.getElementById("formSaves");

// // form1.addEventListener("submit", (event) => {
// //     event.preventDefault();
// //     // console.log(form1[0].files[0]);


// // });

// let form = document.getElementById("formSaves");
// let inputFile = document.getElementById("jsonIn");

// form.addEventListener('submit', event => {
//     event.preventDefault();
//     if (!inputFile.value.length) return;

//     let reader = new FileReader();
//     reader.onload = chargeSavedata;
//     reader.readAsText(inputFile.files[0]);
//     chargeSavedata(event);
    
// });

// function chargeSavedata(event){
//     // console.log("nigga")
//     let str = event.target.result;
//     // console.log(str)
//     let json = JSON.parse(str);
//     // console.log(json)
// }