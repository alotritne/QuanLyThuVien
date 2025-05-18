const TK = [
	{
		username: "user",
		password: "1",
		role: "user",
	},
	{
		username: "admin",
		password: "2",
		role: "admin",
	},
];

function login() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const user = TK.find((user) => user.username === username && user.password === password);
	if (user) {
		if (user.role === "admin") {
			localStorage.setItem("loggedInUser", JSON.stringify(user));
			window.location.href = "admin.html";
		} else {
			localStorage.setItem("loggedInUser", JSON.stringify(user));
			window.location.href = "index.html";
		}
	} else {
		alert("Sai tài khoản");
	}
}

function logout() {
	localStorage.removeItem("loggedInUser");
	window.location.href = "login.html";
}
async function GetBooksAdmin(url, id) {
	try {
		const response = await fetch(url);
		const books = await response.json();
		renderBooksAdmin(books, id);
	} catch (error) {
		console.log(error);
	}
}
function renderBooksAdmin(books, id) {
	const list = document.getElementById(id);
	list.innerHTML = "";
	let i = 0;
	books.forEach((book) => {
		const item = document.createElement("div");
		item.className = `Book`;
		item.innerHTML = `
					<img src="${book.img}" alt="" style="height: 250px"/>
					<br>
					<h3>${book.name}</h3>
					<br>
					<p style="font-size: 17px">Còn lại: ${book.available}</p>
					<br>
					<button class="removeBtn" onclick="confirmRemoveBook('${book.name}', ${i})">Xóa ngay</button>
`;
		i++;
		list.appendChild(item);
	});
}

GetBooksAdmin("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json", "listBooks");
function showPopup(message, pop, popMSG) {
	const popup = document.getElementById(pop);
	const msg = document.getElementById(popMSG);
	msg.innerText = message;
	popup.style.display = "flex";
}

function closePopup(popup) {
	document.getElementById(popup).style.display = "none";
}

function confirmRemoveBook(name, i) {
	showPopup(`Bạn có chắc chắn muốn xóa ${name} không? `, "popup-ConfirmRemove", "popup-ConfirmRemove-message");
	document.querySelector("#popup-ConfirmRemove button:nth-of-type(1)").onclick = function () {
		removeBook(i);
	};
}

function removeBook(i) {
	closePopup("popup-ConfirmRemove");
	const books = document.getElementsByClassName("Book");
	if (i >= 0 && i < books.length) {
		const name = books[i].getElementsByTagName("h3")[0].innerText;
		books[i].style.display = "none";
		showPopup(`Xóa thành công ${name}`, "popupRemove", "popupRemove-message");
	}
}
