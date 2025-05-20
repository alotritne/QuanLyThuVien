function showPopup(message, pop, popMSG) {
	const popup = document.getElementById(pop);
	const msg = document.getElementById(popMSG);
	msg.innerText = message;
	popup.style.display = "flex";
}

function closePopup(popup) {
	document.getElementById(popup).style.display = "none";
}
function MuonSach(name) {
	showPopup(`Bạn có chắc chắn muốn mượn ${name} không? `, "popup-Confirm", "popup-Confirm-message");
}
function DongY() {
	closePopup("popup-Confirm");
	showPopup("Mượn thành công", "popup", "popup-message");
}
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
  <img src="${book.img}" alt="" style="height: 250px" />
  <br>
  <a href="./book.html?id=${book.id}&type=${id}"><h3>${book.name}</h3></a>
  <br>
  <p style="font-size: 17px">Còn lại: ${book.available}</p>
  <br>
  <button
    ${book.available === 0 ? "disabled" : `class="Borrow available" onclick='MuonSach("${book.name}")'`}
  >
    ${book.available === 0 ? "Hết sách" : "Mượn ngay"}
  </button>
`;
		list.appendChild(item);
	});
}

GetBooks("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json", "Books");
GetBooks("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/newBooks.json", "newBooks");

loadHTML("head", "./components/head.html");
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

async function login() {
	const res = await fetch("./account.json");
	const TK = await res.json();
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const user = TK.find((user) => user.username === username && user.password === password);
	if (user) {
		if (user.role === "admin") {
			localStorage.setItem("loggedInUser", JSON.stringify(user));
			window.location.href = "./admin";
		} else {
			localStorage.setItem("loggedInUser", JSON.stringify(user));
			window.location.href = "home.html";
		}
	} else {
		alert("Sai tài khoản");
	}
}

function logout() {
	localStorage.removeItem("loggedInUser");
	window.location.href = "./login.html";
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

async function addBook() {
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

async function renderInfor() {
	try {
		const resUsers = await fetch("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/admin/user.json");
		const users = await resUsers.json();
		const elUsers = document.getElementById("info");
		users.forEach((user) => {
			if (user.username === JSON.parse(localStorage.getItem("loggedInUser")).username) {
				const item = document.createElement("div");
				item.className = `infoUser textLeft`;
				item.innerHTML = `
					<h3>User: ${user.username}</h3>
					<h3>Sách đã mượn: ${user.book}</h3>
					<h3>Ngày trả: ${user.date}</h3>
					<h3>Địa chi: ${user.address}</h3>
					<h3>Số điện thoại: ${user.phone}</h3>
			`;
				elUsers.appendChild(item);
			}
		});
	} catch (error) {
		console.log(error);
	}
}
function info() {
	const params = new URLSearchParams(window.location.search);
	const bookId = parseInt(params.get("id"));
	const type = params.get("type");
	if (!type || isNaN(bookId)) {
		document.body.innerHTML = "<h2>Thiếu thông tin ID hoặc loại sách.</h2>";
	} else {
		const jsonFile = `${type}.json`; // Ví dụ: programming.json, novel.json

		fetch(jsonFile)
			.then((response) => response.json())
			.then((data) => {
				const book = data.find((b) => b.id === bookId);
				if (book) {
					document.getElementById("image").src = book.img;
					document.getElementById("title").textContent = book.name;
					document.getElementById("author").textContent = book.author;
					document.getElementById("year").textContent = book.release_date;
					document.getElementById("translator").textContent = book.translator;
					document.getElementById("publisher").textContent = book.publisher;
					document.getElementById("pages").textContent = book.pages;
					document.getElementById("description").textContent = book.description;
				} else {
					document.body.innerHTML = "<h2>Không tìm thấy sách.</h2>";
				}
			})
			.catch((err) => {
				document.body.innerHTML = `<h2>Lỗi khi tải dữ liệu: ${err}</h2>`;
			});
	}
}
