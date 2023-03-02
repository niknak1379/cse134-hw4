//custom alert function, sets up dialog and display
export function customAlert(message){

    //create dialog element and set up innerhtml
    let dialog = document.createElement("dialog");
    dialog.innerHTML = `<h3>${message}</h3><br><br><button id ="close">close</button>`;

    //show dialog
    document.body.appendChild(dialog);
    dialog.showModal();
    
    //set up close button
    let closeButton = document.getElementById("close");

    //add close event
    closeButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
    });
    
}

//setup custom confirm function using dialog
export function customConfirm(message){

    //create dialog and inner html
    let dialog = document.createElement("dialog");
    dialog.innerHTML=`<h3>${message}</h3>
    <br><button id ="Cancel">cancel</button>
    <button id ="Ok">ok</button>`;

    //show dialog on screen
    document.body.appendChild(dialog);
    dialog.showModal();

    //set up cancel and ok buttons
    let cancelButton = document.getElementById("Cancel")
    let okButton = document.getElementById("Ok");

    //set up output tag to be changed based on the button
    let output = document.getElementById("Output");

    //change output based on false event
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        output.innerHTML = "the value the user has chosen: False";
    });

    //change output based on true event
    okButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        output.innerHTML = "the value the use has chosen: True";
    });
}

//set up custom prompt function using dialog
export function customPrompt(message){

    //set up dialog and inner html
    let dialog = document.createElement("dialog");
    dialog.innerHTML=`<h3>${message}</h3>
    <br>
    <input type="text" id="input">
    <br>
    <br>
    <button id ="Cancel">cancel</button>
    <button id ="Ok">ok</button>`;

    //show dialog on the screen
    document.body.appendChild(dialog);
    dialog.showModal();

    //set up cancel and ok buttons
    let cancelButton = document.getElementById("Cancel")
    let okButton = document.getElementById("Ok");

    //set up input and output
    let output = document.getElementById("Output");
    let inputVar = document.getElementById("input");

    //purify the input and check for null input
    inputVar = DOMPurify.sanitize(inputVar.value);
    if (inputVar == ''){
        inputVar = "user did not input";
    }

    //setup input and out put for the cancel button behavior
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        inputVar = "user did not input";
        output.innerHTML = `user input: ${inputVar}`;
    });

    //set up output in case of correct input behavior
    okButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        output.innerHTML = `user input: ${inputVar}`;
    });
}