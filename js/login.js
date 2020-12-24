if (localStorage.getItem('accessToken')) {
    window.location.href = "index.html";
    console.log("pindah ke index.html")
}

let btnSubmit = document.getElementById("submit");
let alertInfo = document.getElementById("alert");
alertInfo.classList.add("hide");

btnSubmit.addEventListener('click', () => {
    login();
});

let login = () => {
    var spinHandle = loadingOverlay.activate();
    let dataUSer = {
        "username" : document.getElementById("username").value,
        "password" : document.getElementById("password").value
    }
    console.log(JSON.stringify(dataUSer));
    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/login',{
        headers : {
            // "content-type" : "application/json",
            'Content-Type': 'application/json'
            // "Content-Type": "text/plain"
        },
        method : 'POST',
        body : JSON.stringify(dataUSer)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == "success") {
            localStorage.setItem('accessToken', data.response)
            localStorage.setItem('username', dataUSer.username)
            console.log("go to index.html");
            window.location.href = "index.html";
        } else {
            loadingOverlay.cancel(spinHandle);
            console.log("back to login.html");
            alertInfo.classList.remove("hide");
        }})
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log(err);
        alertInfo.innerHTML="ERR_CONNECTION_REFUSED PLEASE TRY LATER";
        alertInfo.classList.remove("hide");
    } )
}