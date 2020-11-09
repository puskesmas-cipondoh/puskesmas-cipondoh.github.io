
let viewAllData = (data) => {
    var i = 1;
    var table = document.getElementsByTagName('tbody')[0];
    for (let index = 0; index < data.length; index++) {
        var row = document.createElement("tr");
        
        var cellNomor = document.createElement("th");
        var cell2= document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var action = document.createElement("td");

        var btnDelete = document.createElement("button");
        var btnUpdate = document.createElement("button");

        btnDelete.classList.add("btn");
        btnUpdate.classList.add("btn");

        btnDelete.classList.add("btn-danger");
        btnUpdate.classList.add("btn-primary");

        btnDelete.innerHTML = "delete";
        btnUpdate.innerHTML = "update";

        btnDelete.addEventListener('click', () => {
            deleteData(data[index].id_user);
        });

        btnUpdate.addEventListener('click', () => {
            getData(data[index].id_user);
        });
        
        cellNomor.appendChild(document.createTextNode(i++));
        cell2.appendChild(document.createTextNode(data[index].nik));
        cell3.appendChild(document.createTextNode(data[index].nama));
        cell4.appendChild(document.createTextNode(data[index].position));
        action.appendChild(btnUpdate);
        action.appendChild(btnDelete);

        row.appendChild(cellNomor);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(action);

        table.appendChild(row);
    }
}

let getAllData = () => {
    fetch('http://localhost:8000/api/v1/puskesmas/employe/all')
    .then((res) => res.json())
    .then(data => viewAllData(data.response))
    .catch(err => console.log(err));
}

getAllData();