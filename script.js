
async function GetBooks(url, id) {
	try {
		const response = await fetch(url);
		const books = await response.json();
		renderBooks(books, id);
	} catch (error) {
		console.log(error);
	}
}

function renderBooks(books, id) {
	const list = document.getElementById(id);
	list.innerHTML = "";
	books.forEach((book) => {
		const item = document.createElement("div");
		item.className = "Book";
		item.innerHTML = `
					<img src="${book.img}" alt="" style="height: 250px"/>
					<br>
					<h3>${book.name}</h3>
					<br>
					<p style="font-size: 17px">Còn lại: ${book.available}</p>
					<br>
					<button ${book.available === 0 ? "disabled" : "class='Borrow available'"} ${book.available === 0 ? "" : `onclick = "alert('Mượn thành công ${book.name}')"`}>${book.available === 0 ? "Hết sách" : "Mượn ngay"}</button>
`;
		list.appendChild(item);
	});
}


GetBooks("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json", "Books");
GetBooks("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/newBooks.json", "newBooks");

loadHTML("head", "components/head.html");
const newBooks = document.getElementById("newBooks");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

leftBtn.addEventListener("click", () => {
	newBooks.scrollBy({ left: -300, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
	newBooks.scrollBy({ left: 300, behavior: "smooth" });
});

function submitForm(event) {
	const p = document.getElementById("msg");
	event.preventDefault();
	p.innerHTML = `Gửi thông tin thành công, mình sẽ phản hồi trong thời gian sớm nhất`;
	p.style.color = "#E55050";
}



async function login() {
	const res = await fetch("./account.json");
	const TK = await res.json();
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

async function loadHTML(id, url) {
	const response = await fetch(url);
	const html = await response.text();
	document.getElementById(id).innerHTML = html;
	const el = document.getElementsByTagName("a");
	for (i of el) {
		if (i.href === window.location.href) {
			i.style.color = "#096b68";
			break;
		}
	}
}

async function addBook(){
	const name = document.getElementById("name").value;
	const author = document.getElementById("author").value;
	const img = document.getElementById("img").value;
	const quality = document.getElementById("quality").value;
	const el = document.getElementById("addSach");
	const div = document.createElement("div");
	div.className = "Book";
	div.innerHTML = `
					<h1>Thêm thành công</h1>
					<img src="${img}" alt="" style="height: 250px"/>
					<h3>${name}</h3>
					<br>
					<p style="font-size: 17px">Còn lại: ${quality}</p>
					<br>
					<button ${quality === 0 ? "disabled" : "class='Borrow available'"} ${quality === 0 ? "" : `onclick = "alert('Mượn thành công ${name}')"`}>${quality === 0 ? "Hết sách" : "Mượn ngay"}</button>
					<br>
`;
	el.append(div);
}

