var spinHandle = loadingOverlay.activate();

if (!localStorage.getItem('accessToken')) {
    window.location.href = "login.html";
    console.log("pindah ke index.html")
}

document.getElementById('username-nav').innerHTML = localStorage.getItem('username')

let btnAdd = document.getElementById("btnTambah");
let btnUpdate = document.getElementById("btnUpdate");
let searchPatient = document.getElementById('searchPatient')
let alertInfo = document.getElementById("alert");
alertInfo.classList.add('hide');
btnAdd.addEventListener("click", () => { addPatient() });
btnUpdate.addEventListener("click", () => { updatePatient() });

searchPatient.addEventListener('keyup', (event) => {
    if(event.keyCode === 13){
        console.log(searchPatient.value);
        var table = document.getElementsByTagName('tbody')[0];
        table.innerHTML = null;
        getSearchData(searchPatient.value)
    }
})


let addPatient = () => {
    spinHandle = loadingOverlay.activate();
    let patient = {
        "name" : document.getElementById("orangeForm-name").value,
        "address" : document.getElementById("orangeForm-address").value,
        "age" : document.getElementById("orangeForm-age").value
    } 
    console.log(JSON.stringify(patient));

    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/patient', {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'POST',
        body : JSON.stringify(patient)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log(err)
    });
}

let deletePatient = (nik) => {
    btnYes = document.getElementById("btnYes");
    btnYes.addEventListener("click", () => {
        spinHandle = loadingOverlay.activate();
        fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/patient/${nik}`, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(teks => {
            console.log(teks);
            location.reload();
        })
        .catch(err => {
            loadingOverlay.cancel(spinHandle);
            console.log(err)
        });
    })
}

let addQueue = (patientId) => {
    spinHandle = loadingOverlay.activate();
    let queue = {
        "patientId" : patientId
    } 
    console.log(JSON.stringify(queue));

    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/queue', {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'POST',
        body : JSON.stringify(queue)
    })
    .then(res => res.json())
    .then(teks => {
        alertInfo.classList.remove('hide');
        loadingOverlay.cancel(spinHandle);
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log('error')
    });
}

let viewAllData = (data) => {
    var i = 1;
    var table = document.getElementsByTagName('tbody')[0];
    for (let index = 0; index < data.length; index++) {
        var row = document.createElement("tr");
        
        var cellNomor = document.createElement("th");
        var cell2= document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var cell5 = document.createElement("td");
        var action = document.createElement("td");

        var btnDelete = document.createElement("button");
        var btnUpdate = document.createElement("button");
        var btnAddQueue = document.createElement("button");

        btnDelete.classList.add("btn");
        btnUpdate.classList.add("btn");
        btnAddQueue.classList.add("btn");
        btnDelete.setAttribute('data-toggle', 'modal');
        btnDelete.setAttribute('data-target', '#modalConfirmDelete');
        btnUpdate.setAttribute('data-toggle', 'modal');
        btnUpdate.setAttribute('data-target', '#modalRegisterForm');
        btnDelete.classList.add("btn-danger");
        btnUpdate.classList.add("btn-primary");
        btnAddQueue.classList.add("btn-info");

        btnDelete.innerHTML = "Delete";
        btnUpdate.innerHTML = "Update";
        btnAddQueue.innerHTML = "Antrian";

        btnDelete.addEventListener('click', () => {
            deletePatient(data[index].patientId);
        });

        btnUpdate.addEventListener('click', () => {
            getOneData(data[index]);
        });

        btnAddQueue.addEventListener('click', () => {
            addQueue(data[index].patientId);
        });
        
        cellNomor.appendChild(document.createTextNode(i++));
        cell2.appendChild(document.createTextNode(data[index].patientId));
        cell3.appendChild(document.createTextNode(data[index].name));
        cell4.appendChild(document.createTextNode(data[index].address));
        cell5.appendChild(document.createTextNode(data[index].age));
        action.appendChild(btnUpdate);
        action.appendChild(btnAddQueue);
        action.appendChild(btnDelete);

        row.appendChild(cellNomor);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        row.appendChild(action);

        table.appendChild(row);
    }
    loadingOverlay.cancel(spinHandle);
}

let updatePatient = () => {
    spinHandle = loadingOverlay.activate();
    let dataPatient = {
        "name" : document.getElementById("orangeForm-name").value,
        "address" : document.getElementById("orangeForm-address").value,
        "age" : document.getElementById("orangeForm-age").value
    }

    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/patient/${document.getElementById("orangeForm-patientId").value}`, {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'PUT',
        body : JSON.stringify(dataPatient)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log(err)
    });
}

let getOneData = (data) => {
    document.getElementById("orangeForm-name").value = data.name;
    document.getElementById("orangeForm-address").value = data.address;
    document.getElementById("orangeForm-age").value = data.age;
    document.getElementById("orangeForm-patientId").value = data.patientId;
    btnAdd.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
}

let getAllData = () => {
    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/patient/all')
    .then((res) => res.json())
    .then(data => {
        if(data.response.length <= 0 ){
            document.getElementById("infoEmptyData").classList.remove("d-none");
        }
        else {
            viewAllData(data.response);
        }
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log(err)
    });
}

let getSearchData = (patientName) => {
    spinHandle = loadingOverlay.activate();
    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/patient/search/${patientName}`)
    .then((res) => res.json())
    .then(data => {
        if(data.response.length <= 0 ){
            document.getElementById("infoEmptyData").classList.remove("d-none");
        }
        else {
            viewAllData(data.response);
        }
        loadingOverlay.cancel(spinHandle);
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log(err)
    });
}

getAllData();