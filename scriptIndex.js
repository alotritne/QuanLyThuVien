const myName = "Nguyễn Ngọc Minh Triết";
const nameElement = document.getElementById("name");

let index = 0;

function typeName() {
	if (index < myName.length) {
		nameElement.textContent += myName[index];
		index++;
		setTimeout(typeName, 150); // tốc độ gõ
	} else {
		setTimeout(deleteName, 2000); // chờ 2 giây rồi xóa
	}
}

function deleteName() {
	if (index > 0) {
		index--;
		nameElement.textContent = myName.slice(0, index);
		setTimeout(deleteName, 100); // tốc độ xóa
	} else {
		setTimeout(typeName, 1000); // gõ lại sau khi xóa xong (lặp lại)
	}
}

typeName(); // bắt đầu
