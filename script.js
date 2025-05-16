async function GetBooks() {
	try {
		const response = await fetch("https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json");
		const books = await response.json();
		renderBooks(books);
	} catch (error) {
		console.log(error);
	}
}

function renderBooks(books) {
	const list = document.getElementById("Books");
	list.innerHTML = "";
	books.forEach((book) => {
		const item = document.createElement("div");
		item.className = "Book";
		item.innerHTML = `
					<img src="${book.img}" alt="" style="height: 250px"/>
					<h3>${book.name}</h3>
					<div class="sub"><span class="fa-solid fa-book"></span><button class="Borrow available" onclick="alert('Mượn thành công ${book.name}')">Mượn ngay</button></div>
`;
		list.appendChild(item);
	});
}
GetBooks();
function submitForm(event) {
	const p = document.getElementById("msg");
	event.preventDefault();
	p.innerHTML = `Gửi thông tin thành công, mình sẽ phản hồi trong thời gian sớm nhất`;
	p.style.color = "#E55050";
}
