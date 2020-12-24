var spinHandle = loadingOverlay.activate();

if (!localStorage.getItem('accessToken')) {
    window.location.href = "login.html";
    console.log("pindah ke index.html")
}
let dataPasien = {};

let alertInfo = document.getElementById("alert");
alertInfo.classList.add('hide');

document.getElementById('username-nav').innerHTML = localStorage.getItem('username')

let btnAdd = document.getElementById("btnTambah");
let btnPanggil = document.getElementById("btnPanggil");
btnAdd.addEventListener("click", () => { addQueue() });
// btnPanggil.addEventListener("click", () => { updateQueue() });

let addQueue = () => {
    spinHandle = loadingOverlay.activate();
    let queue = {
        "patientId" : document.getElementById("orangeForm-patientId").value
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
        if (teks.status == 'error'){
            if(teks.response == 'Validation error'){
                alertInfo.innerHTML = "Pasien Sudah Masuk Antrian";
                console.log(teks.response)
            } else {
                alertInfo.innerHTML = "Pasien Belum Terdaftar";
                console.log(teks.response)
            }

            loadingOverlay.cancel(spinHandle);
            alertInfo.classList.remove('hide');
            document.getElementById('closeModal').click();
        } else {
            location.reload();
        }
    })
    .catch(err => {
        loadingOverlay.cancel(spinHandle);
        console.log('error')
        alertInfo.innerHTML = "404";
        alertInfo.classList.add('hide');
    });
}

let deleteQueue = (queueId) => {
    btnYes = document.getElementById("btnYes");
    btnYes.addEventListener("click", () => {
        spinHandle = loadingOverlay.activate();
        fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/queue/${queueId}`, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(teks => {
            console.log(teks);
            window.location.replace("rekam-medis.html");
        })
        .catch(err => console.log(err))
    })
}

let viewAllData = (data) => {
    dataPasien = data;
    console.log(data)
    var i = 1;
    var table = document.getElementsByTagName('tbody')[0];
    for (let index = 0; index < data.length; index++) {
        var row = document.createElement("tr");
        
        var cellNomor = document.createElement("th");
        var cell2= document.createElement("td");
        var cell3= document.createElement("td");
        var cell4= document.createElement("td");
        var cell5= document.createElement("td");
        var action = document.createElement("td");

        var btnPanggil = document.createElement("button");

        btnPanggil.classList.add("btn");
        btnPanggil.setAttribute('data-toggle', 'modal');
        btnPanggil.setAttribute('data-target', '#modalConfirmDelete');
        btnPanggil.classList.add("btn-primary");

        btnPanggil.innerHTML = "Panggil";

        btnPanggil.addEventListener('click', () => {
            deleteQueue(data[index].queueId);
            localStorage.setItem('patientId', data[index].patientId)
        });
        
        cellNomor.appendChild(document.createTextNode(i++));
        cell2.appendChild(document.createTextNode(data[index].patientId));
        cell3.appendChild(document.createTextNode(data[index].patient.name));
        cell4.appendChild(document.createTextNode(data[index].patient.address));
        cell5.appendChild(document.createTextNode(data[index].patient.age));
        action.appendChild(btnPanggil);

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

let updateQueue = () => {
    let dataQueue = {
        "name" : document.getElementById("orangeForm-name").value,
        "position" : document.getElementById("orangeForm-position").value
    }

    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/queue/${document.getElementById("orangeForm-nik").value}`, {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'PUT',
        body : JSON.stringify(dataQueue)
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

// let getOneData = (data) => {
//     document.getElementById("orangeForm-name").value = data.name;
//     document.getElementById("orangeForm-position").value = data.position;
//     document.getElementById("orangeForm-nik").value = data.nik;
//     btnAdd.classList.add("d-none");
//     btnPanggil.classList.remove("d-none");
// }

let getAllData = () => {
    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/queue/all')
    .then((res) => res.json())
    .then(data => {
        if(data.response.length <= 0 ){
            loadingOverlay.cancel(spinHandle);
            document.getElementById("infoEmptyData").classList.remove("d-none");
        }
        else {
            viewAllData(data.response);
        }
    })
    .catch(err =>{
        loadingOverlay.cancel(spinHandle);
        console.log(err)
    });
}

getAllData();