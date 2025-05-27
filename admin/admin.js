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
loadHTML("head", "./head.html");

GetBooksAdmin(
    "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json",
    "listBooks"
);
GetBooksAdmin(
    "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/newBooks.json",
    "listBooks"
);
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
    showPopup(
        `Bạn có chắc chắn muốn xóa ${name} không? `,
        "popup-ConfirmRemove",
        "popup-ConfirmRemove-message"
    );
    document.querySelector(
        "#popup-ConfirmRemove button:nth-of-type(1)"
    ).onclick = function () {
        removeBook(i);
    };
}

function removeBook(i) {
    closePopup("popup-ConfirmRemove");
    const books = document.getElementsByClassName("Book");
    if (i >= 0 && i < books.length) {
        const name = books[i].getElementsByTagName("h3")[0].innerText;
        books[i].style.display = "none";
        showPopup(
            `Xóa thành công ${name}`,
            "popupRemove",
            "popupRemove-message"
        );
    }
}

async function countBooks() {
    try {
        const resBooks = await fetch(
            "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json"
        );
        const books = await resBooks.json();
        const resNewBooks = await fetch(
            "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/newBooks.json"
        );
        const newBooks = await resNewBooks.json();
        const total = books.length + newBooks.length;
        const block = document.getElementsByClassName("block")[0];
        block.innerHTML = `<h1>Tổng số sách: ${total}</h1>`;
    } catch (error) {
        console.log(error);
    }
}
countBooks();

async function countUser() {
    try {
        const resUser = await fetch(
            "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/admin/user.json"
        );
        const user = await resUser.json();
        const block = document.getElementsByClassName("block")[1];
        block.innerHTML = `<h1>Tổng user: ${user.length}</h1>`;
    } catch (error) {
        console.log(error);
    }
}
countUser();
async function renderUser() {
    const khoa = {
        CNKT: "Khoa Công nghệ - Kỹ thuật",
        KTQT: "Khoa Kinh tế - Quản trị",
        NNVVHQT: "Khoa Ngôn ngữ và văn hóa quốc tế",
        Y: "Khoa Y",
        DUOC: "Khoa Dược",
        RHM: "Khoa Răng Hàm Mặt",
        DDHS: "Khoa Điều dưỡng – Hộ sinh",
        XNYH: "Khoa Xét Nghiệm Y Học",
        KTPHCN: "Khoa Kỹ thuật Phục hồi chức năng",
        KHXH: "Khoa Khoa học Xã hội",
        GDTC: "Bộ môn Giáo dục thể chất",
    };
    const khoaValue = document.getElementById("khoa").value;
    const elUsers = document.querySelector("tbody");
    elUsers.innerHTML = "";
    try {
        const resUsers = await fetch(
            "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/admin/user.json"
        );
        let i = 1;

        const users = await resUsers.json();
        users.forEach((user) => {
            if (khoaValue !== "all" && user.khoa !== khoa[khoaValue]) {
                return;
            }
            const fullName = user.name.trim();
            const parts = fullName.split(" ");
            const l = parts.pop();
            const f = parts.join(" ");
            const item = document.createElement("tr");
            item.innerHTML = `
				         <th scope="row">${i}</th>
                        <td>${f}</td>
                        <td>${l}</td>
                        <td>${user.username}</td>

                        <td>${user.khoa}</td>
                        <td>${user.book}</td>
                        <td>${user.date}</td>
                        <td>${user.address}</td>
                        <td>${user.phone}</td>
			`;
            elUsers.appendChild(item);
            i++;
        });
    } catch (error) {
        console.log("Lỗi khi tải dữ liệu:", error);
    }
}
renderUser();

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "./index.html";
}
