var spinHandle = loadingOverlay.activate();

if (!localStorage.getItem('accessToken')) {
    window.location.href = "login.html";
    console.log("pindah ke index.html")
}
let dataPatient = {}
let searchPatient = document.getElementById('searchPatient')
let patientId = localStorage.getItem('patientId')
document.getElementById('username-nav').innerHTML = localStorage.getItem('username')

let btnAdd = document.getElementById("btnTambah");
let btnUpdate = document.getElementById("btnUpdate");
btnAdd.addEventListener("click", () => { addRecord() });
btnUpdate.addEventListener("click", () => { updateRecord() });
searchPatient.addEventListener('keyup', (event) => {
    if(event.keyCode === 13){
        console.log(searchPatient.value);
        document.getElementById('btnShowModal').classList.add('d-none')
        document.getElementById('profileName').innerHTML = '';
        document.getElementById('profileAlamat').innerHTML = '';
        document.getElementById('profileUmur').innerHTML = '';
        document.getElementById('profilePekerjaan').innerHTML = 'Data Tidak Ditemukan';
        var table = document.getElementsByTagName('tbody')[0];
        table.innerHTML = null;
        getAllData(searchPatient.value)
    }
})

let addRecord = () => {
    spinHandle = loadingOverlay.activate();
    let record = {
        "physical" : document.getElementById("orangeForm-physical").value,
        "complaint" : document.getElementById("orangeForm-complaint").value,
        "diagnosis" : document.getElementById("orangeForm-diagnosis").value,
        "therapy" : document.getElementById("orangeForm-therapy").value,
        "patientId" : patientId
    } 
    console.log(JSON.stringify(record));

    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/mRecord', {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'POST',
        body : JSON.stringify(record)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => console.log(err));
}

let deleteRecord = (nik) => {
    btnYes = document.getElementById("btnYes");
    btnYes.addEventListener("click", () => {
        spinHandle = loadingOverlay.activate();
        fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/mRecord/${nik}`, {
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

let viewAllData = (data) => {
    let name = document.getElementById('profileName').innerHTML = data.name
    let address = document.getElementById('profileAlamat').innerHTML = data.address
    let age = document.getElementById('profileUmur').innerHTML = data.age
    document.getElementById('profilePekerjaan').innerHTML = 'Pegawai Swasta';
    var i = 1;
    var table = document.getElementsByTagName('tbody')[0];
    for (let index = 0; index < data.history.length; index++) {
        var row = document.createElement("tr");
        
        var cellNomor = document.createElement("th");
        var cell2= document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var cell5 = document.createElement("td");
        var cell6 = document.createElement("td");
        var action = document.createElement("td");

        var btnDelete = document.createElement("button");
        var btnUpdate = document.createElement("button");

        btnDelete.classList.add("btn");
        btnUpdate.classList.add("btn");
        btnDelete.setAttribute('data-toggle', 'modal');
        btnDelete.setAttribute('data-target', '#modalConfirmDelete');
        btnUpdate.setAttribute('data-toggle', 'modal');
        btnUpdate.setAttribute('data-target', '#modalRegisterForm');
        btnDelete.classList.add("btn-danger");
        btnUpdate.classList.add("btn-primary");

        btnDelete.innerHTML = "delete";
        btnUpdate.innerHTML = "update";

        btnDelete.addEventListener('click', () => {
            deleteRecord(data.history[index].medicalRecordId);
        });

        btnUpdate.addEventListener('click', () => {
            getOneData(data.history[index]);
        });
        
        cellNomor.appendChild(document.createTextNode(i++));
        cell2.appendChild(document.createTextNode(data.history[index].medicalRecordId));
        cell3.appendChild(document.createTextNode(data.history[index].physical));
        cell4.appendChild(document.createTextNode(data.history[index].complaint));
        cell5.appendChild(document.createTextNode(data.history[index].diagnosis));
        cell6.appendChild(document.createTextNode(data.history[index].therapy));
        action.appendChild(btnUpdate);
        action.appendChild(btnDelete);

        row.appendChild(cellNomor);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        row.appendChild(cell6);
        row.appendChild(action);

        table.appendChild(row);
    }
    loadingOverlay.cancel(spinHandle);
}

let updateRecord = () => {
    spinHandle = loadingOverlay.activate();
    let dataRecord = {
        "physical" : document.getElementById("orangeForm-physical").value,
        "complaint" : document.getElementById("orangeForm-complaint").value,
        "diagnosis" : document.getElementById("orangeForm-diagnosis").value,
        "therapy" : document.getElementById("orangeForm-therapy").value,
    }

    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/mRecord/${document.getElementById("orangeForm-medicalRecordId").value}`, {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'PUT',
        body : JSON.stringify(dataRecord)
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
    document.getElementById("orangeForm-physical").value = data.physical;
    document.getElementById("orangeForm-complaint").value = data.complaint;
    document.getElementById("orangeForm-diagnosis").value = data.diagnosis;
    document.getElementById("orangeForm-therapy").value = data.therapy;
    document.getElementById("orangeForm-medicalRecordId").value = data.medicalRecordId;
    btnAdd.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
}

let getAllData = (patientId) => {
    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/mRecord/patient/${patientId}`)
    .then((res) => res.json())
    .then(data => {
        dataPatient = data;
        console.log(data)
        if(data.response[0].length <= 0 ){
            loadingOverlay.cancel(spinHandle);
            document.getElementById("infoEmptyData").classList.remove("d-none");
        }
        else {
            viewAllData(data.response[0]);
        }
        loadingOverlay.cancel(spinHandle);
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log(err)
    });
}

getAllData(patientId);