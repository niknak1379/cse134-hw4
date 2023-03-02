var count = 0; //global variable to make unique IDs for the created tags

//loads the document from the local storage or form the jason file if no local storage
export async function firstLoad(){

    //loads from local storage
    if(localStorage.getItem("blog") == null){
        console.log("defaultLocal called");
        await defaultLocal("defaultVals.json");
    }
    //posts the contents of the local storage
    postDefault();
}

//posts the contenct of the local storage
export function postDefault(){

    //reads local storage and adds all elements
    let blog = JSON.parse(localStorage.getItem("blog")).blog;
    for (let i = 0; i < blog.length; i++) {
        addComment(blog[i].blogTitle, blog[i].blogDate, blog[i].blogSummary);
    }
}

//laods the local storage from the json file
export function defaultLocal(url){
    
    //populate localstorage from json file by using 
    //promise and response
    return new Promise(resolve => {
        fetch(url)
            .then(response => response.json())
            .then(defaultVals => {
                let array = JSON.stringify(defaultVals);
                localStorage.setItem("blog", array);
                resolve();
            });
    })
}

//add comment given title date and summary
export function addComment(title, date, summary){

    //create the comment section and set its innerhtml.
    let par = document.getElementById("blogPosts");
    let comment = document.createElement("p");
    comment.id = count;

    //sets up inner html and the buttons used for customEdit and customDelete
    comment.innerHTML = `
        <hr>
        <myTitle id="${count}Title">${title}</myTitle> 
        (<time id = "${count}Date" datetime="${date}" format="MM/DD/YYYY">${date}</time>)
        - <mySummary id = "${count}Summary">${summary}</mySummary>
        <br>
        <br>
        <button id="${count}Edit" onclick="customEdit('${count}Edit')">Edit</button>
        <button id="${count}Delete" onclick="customDelete('${count}Delete')">Delete</button>
        <hr>
    `;
    count++;
    par.appendChild(comment);
}

//calls dialoge for user input and adds the blog post to the window. 
export function customAdd(message){

    //creates and sets blogpost inner html
    let dialog = document.createElement("dialog");
    dialog.innerHTML=`
    <br>
    <label>Post Title:</label>
    <input type="text" id="title">
    <br>
    <label>Post Date:</label>
    <input type="date" id="date">
    <br>
    <label>Post summary:</label>
    <textarea id="summary"></textarea>
    <br>
    <br>
    <button id ="Cancel">cancel</button>
    <button id ="Ok">ok</button>`;

    //shows the dialog
    document.body.appendChild(dialog);
    dialog.showModal();

    //sets up cancel and ok buttons from the dialog innerhtml.
    let cancelButton = document.getElementById("Cancel")
    let okButton = document.getElementById("Ok");
    
    //closes dialog
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
    });

    //adds the user input to the local storage array and display
    okButton.addEventListener("click", () => {

        //gets the json packet from local storage
        let blog = JSON.parse(localStorage.getItem("blog")).blog;

        //get user input
        let inputTitle = DOMPurify.sanitize(document.getElementById("title").value);
        let inputDate = DOMPurify.sanitize(document.getElementById("date").value);
        let inputSummary = DOMPurify.sanitize(document.getElementById("summary").value);

        //add the new user input into the blog array and update the local storage
        blog.push({blogTitle: inputTitle, blogDate: inputDate, blogSummary: inputSummary});
        let updatedArr = JSON.stringify({blog: blog});
        localStorage.setItem("blog", updatedArr);

        //add post to screan
        addComment(inputTitle, inputDate, inputSummary);
        document.body.removeChild(dialog);
    });
}


//Grabs the previous user input and allows for new input 
//updates the array and the screen with the new input
export function customEdit(id){

    //grabs ID of the paragraph 
    let parID = id.split("E")[0];

    //sets up title date and summary
    let title = document.getElementById(`${parID}Title`).innerText;
    let date = document.getElementById(`${parID}Date`).innerText;
    let summary = document.getElementById(`${parID}Summary`).innerText;

    //set up dialog and its inner html
    let dialog = document.createElement("dialog");
    dialog.innerHTML=`
    <br>
    <label>Post Title:</label>
    <input type="text" id="title" value="${title}">
    <br>
    <label>Post Date:</label>
    <input type="date" id="date" value="${date}">
    <br>
    <label>Post summary:</label>
    <textarea id="summary"">${summary}</textarea>
    <br>
    <br>
    <button id ="Cancel">cancel</button>
    <button id ="Ok">ok</button>`;

    //display dialog
    document.body.appendChild(dialog);
    dialog.showModal();

    //set up cancel and ok buttons
    let cancelButton = document.getElementById("Cancel")
    let okButton = document.getElementById("Ok");

    //cancel
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
    });

    //grabs the new purified user input and updates the array and the screen
    okButton.addEventListener("click", () => {

        //grab the new user input
        let blog = JSON.parse(localStorage.getItem("blog")).blog;
        let newTitle = DOMPurify.sanitize(document.getElementById("title").value);
        let newDate = DOMPurify.sanitize(document.getElementById("date").value);
        let newSummary = DOMPurify.sanitize(document.getElementById("summary").value);
        
        //parse the array from localstorage to find the desired blog object
        for (let i = 0; i < blog.length; i++) {
            
            //finds object
            if (blog[i].blogTitle == title) {

                //update to new values
                blog[i].blogTitle = newTitle;
                blog[i].blogDate = newDate;
                blog[i].blogSummary = newSummary;

                //update localstorage
                let updatedArr = JSON.stringify({blog: blog});
                localStorage.setItem("blog", updatedArr);
                break;
            }
        }

        //update display
        document.getElementById(`${parID}Title`).innerText = newTitle;
        document.getElementById(`${parID}Date`).innerText = newDate;
        document.getElementById(`${parID}Summary`).innerText = newSummary;
        
        //close dialog
        document.body.removeChild(dialog);
    });
}

//deletes the desired comment
export function customDelete(id){

    //sets up are you sure dialog
    let dialog = document.createElement("dialog");
    dialog.innerHTML=`<h3>Are you sure you want to delete the post</h3>
    <br><button id ="Cancel">cancel</button>
    <button id ="Ok">ok</button>`;

    //shows dialog
    document.body.appendChild(dialog);
    dialog.showModal();

    //sets up binary choice buttons
    let cancelButton = document.getElementById("Cancel")
    let okButton = document.getElementById("Ok");

    //cancel
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
    });

    //finds the object in the array and removes it and updates screen
    okButton.addEventListener("click", () => {

        //get paragraph ID and title
        let parID = id.split("D")[0];
        let title = document.getElementById(`${parID}Title`).innerText;
        
        let blog = JSON.parse(localStorage.getItem("blog")).blog;

        //parse localstorage array to find and delete the object
        for (let i = 0; i < blog.length; i++) {
            
            //find object
            if (blog[i].blogTitle == title) {

                //delete and update the localstorage
                blog.splice(i, 1);
                let updatedArr = JSON.stringify({blog: blog});
                localStorage.setItem("blog", updatedArr);
                document.getElementById(parID).remove();
                break;
            }
        }

        //close dialog
        document.body.removeChild(dialog);
    });    
}