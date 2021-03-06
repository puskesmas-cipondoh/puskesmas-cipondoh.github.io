if (!localStorage.getItem('accessToken')) {
    window.location.href = "login.html";
    console.log("pindah ke index.html")
}

document.getElementById('username-nav').innerHTML = localStorage.getItem('username')

let btnAdd = document.getElementById("btnTambah");
let btnUpdate = document.getElementById("btnUpdate");
btnAdd.addEventListener("click", () => { addMedicine() });
btnUpdate.addEventListener("click", () => { updateMedicine() });

let addMedicine = () => {
    let medicine = {
        "name" : document.getElementById("orangeForm-name").value,
    } 
    console.log(JSON.stringify(medicine));

    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/medicine', {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'POST',
        body : JSON.stringify(medicine)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => console.log(err));
}

let deleteMedicine = (nik) => {
    btnYes = document.getElementById("btnYes");
    btnYes.addEventListener("click", () => {
        fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/medicine/${nik}`, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(teks => {
            console.log(teks);
            location.reload();
        })
        .catch(err => console.log(err))
    })
}

let viewAllData = (data) => {
    var i = 1;
    var table = document.getElementsByTagName('tbody')[0];
    for (let index = 0; index < data.length; index++) {
        var row = document.createElement("tr");
        
        var cellNomor = document.createElement("th");
        var cell2= document.createElement("td");
        var cell3 = document.createElement("td");
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
            deleteMedicine(data[index].nik);
        });

        btnUpdate.addEventListener('click', () => {
            getOneData(data[index]);
        });
        
        cellNomor.appendChild(document.createTextNode(i++));
        cell2.appendChild(document.createTextNode(data[index].medicineId));
        cell3.appendChild(document.createTextNode(data[index].name));
        action.appendChild(btnUpdate);
        action.appendChild(btnDelete);

        row.appendChild(cellNomor);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(action);

        table.appendChild(row);
    }
}

let updateMedicine = () => {
    let dataMedicine = {
        "name" : document.getElementById("orangeForm-name").value,
    }

    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/medicine/${document.getElementById("orangeForm-medicineId").value}`, {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'PUT',
        body : JSON.stringify(dataMedicine)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => console.log(err));
}

let getOneData = (data) => {
    document.getElementById("orangeForm-name").value = data.name;
    document.getElementById("orangeForm-medicineId").value = data.medicineId;
    btnAdd.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
}

let getAllData = () => {
    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/medicine/all')
    .then((res) => res.json())
    .then(data => {
        if(data.response.length <= 0 ){
            document.getElementById("infoEmptyData").classList.remove("d-none");
        }
        else {
            viewAllData(data.response);
        }
    })
    .catch(err => console.log(err));
}

getAllData();