const myName = "Nguyễn Ngọc Minh Triết";
const nameElement = document.getElementById("name");

let index = 0;

function typeName() {
    if (index < myName.length) {
        nameElement.textContent += myName[index];
        index++;
        setTimeout(typeName, 150);
    } else {
        setTimeout(deleteName, 2000);
    }
}

function deleteName() {
    if (index > 0) {
        index--;
        nameElement.textContent = myName.slice(0, index);
        setTimeout(deleteName, 100);
    } else {
        setTimeout(typeName, 1000);
    }
}

typeName();
