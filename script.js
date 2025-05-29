function showPopup(message, pop, popMSG) {
    const popup = document.getElementById(pop);
    const msg = document.getElementById(popMSG);
    msg.innerText = message;
    popup.style.display = "flex";
}

function closePopup(popup) {
    document.getElementById(popup).style.display = "none";
}
function MuonSach(name, id) {
    showPopup(
        `Bạn có chắc chắn muốn mượn ${name} không? `,
        "popup-Confirm",
        "popup-Confirm-message"
    );

    document.querySelector("#popup-Confirm button:nth-of-type(1)").onclick =
        function () {
            DongY(id);
        };
}
async function DongY(id) {
    closePopup("popup-Confirm");
    showPopup("Mượn thành công", "popup", "popup-message");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    if (books.length === 0) {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json"
            );
            books = await res.json();
            localStorage.setItem("books", JSON.stringify(books));
        } catch (e) {
            console.error("Không thể lấy danh sách sách:", e);
        }
    }

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        alert("Vui lòng đăng nhập trước khi mượn sách");
        closePopup("popup");
        return;
    }

    if (!user.book) {
        user.book = [];
    }

    if (!user.book.includes(id)) {
        user.book.push(id);
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex((u) => u.username === user.username);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem("users", JSON.stringify(users));
    }

    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex !== -1 && books[bookIndex].available > 0) {
        books[bookIndex].available--;
        localStorage.setItem("books", JSON.stringify(books));
    }
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
    ${
        book.available === 0
            ? "disabled"
            : `class="Borrow available" onclick='MuonSach("${book.name}", "${book.id}")'`
    }
  >
    ${book.available === 0 ? "Hết sách" : "Mượn ngay"}
  </button>
`;
        list.appendChild(item);
    });
}

GetBooks(
    "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/Books.json",
    "Books"
);
GetBooks(
    "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/newBooks.json",
    "newBooks"
);

loadHTML("head", "./components/head.html");
loadHTML("foot", "./components/foot.html");

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
    const user = TK.find(
        (user) => user.username === username && user.password === password
    );
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

function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passwordCF = document.getElementById("passwordCF").value;
    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const Khoa = document.getElementById("Khoa").value;
    const address = document.getElementById("address").value;

    if (password === passwordCF) {
        const user = {
            username: username,
            password: password,
            role: "user",
            name: fullName,
            phone: phone,
            khoa: Khoa,
            address: address,
            book: [],
        };
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "./home.html";
    }
}
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "./index.html";
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

async function renderInfor() {
    const elUsers = document.getElementById("info");
    const loggedInUserRaw = localStorage.getItem("loggedInUser");
    if (!loggedInUserRaw) {
        elUsers.innerHTML = "<p>Vui lòng đăng nhập để xem thông tin.</p>";
        return;
    }

    let loggedInUser;
    try {
        loggedInUser = JSON.parse(loggedInUserRaw);
        if (Array.isArray(loggedInUser)) {
            loggedInUser = loggedInUser[0];
        }
    } catch {
        elUsers.innerHTML = "<p>Dữ liệu người dùng không hợp lệ.</p>";
        return;
    }

    const booksRaw = localStorage.getItem("books");
    let books = [];
    if (booksRaw) {
        try {
            books = JSON.parse(booksRaw);
        } catch {
            books = [];
        }
    }

    try {
        const resUsers = await fetch(
            "https://raw.githubusercontent.com/alotritne/QuanLyThuVien/refs/heads/main/admin/user.json"
        );
        const users = await resUsers.json();

        const userFromGit = users.find(
            (user) => user.username === loggedInUser.username
        );

        let userToShow = userFromGit || loggedInUser;

        let borrowedBooksInfo = "Chưa mượn sách nào";

        if (
            userToShow.book &&
            Array.isArray(userToShow.book) &&
            userToShow.book.length > 0
        ) {
            const borrowedBooks = books.filter((book) =>
                userToShow.book.includes(String(book.id))
            );
            if (borrowedBooks.length > 0) {
                borrowedBooksInfo = borrowedBooks
                    .map((book) => book.name)
                    .join(", ");
            }
        } else if (
            typeof userToShow.book === "string" &&
            userToShow.book !== ""
        ) {
            borrowedBooksInfo = userToShow.book;
        }

        elUsers.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <h3 class="username">${
                        userToShow.name || userToShow.username
                    }</h3>
                    <p class="faculty">${userToShow.khoa || ""}</p>
                </div>
                <h5 class="card-title">Thông tin chi tiết</h5>
                <table class="info-table">
                    <tr><th>Tên đăng nhập</th><td>${
                        userToShow.username
                    }</td></tr>
                    <tr><th>Sách đã mượn</th><td>${borrowedBooksInfo}</td></tr>
                    <tr><th>Ngày trả</th><td>${
                        userToShow.date || "Chưa có"
                    }</td></tr>
                    <tr><th>Địa chỉ</th><td>${
                        userToShow.address || ""
                    }</td></tr>
                    <tr><th>Số điện thoại</th><td>${
                        userToShow.phone || ""
                    }</td></tr>
                </table>
            </div>
        `;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);

        let userToShow = loggedInUser;

        let borrowedBooksInfo = "Chưa mượn sách nào";
        if (
            userToShow.book &&
            Array.isArray(userToShow.book) &&
            userToShow.book.length > 0
        ) {
            const borrowedBooks = books.filter((book) =>
                userToShow.book.includes(String(book.id))
            );
            if (borrowedBooks.length > 0) {
                borrowedBooksInfo = borrowedBooks
                    .map((book) => book.name)
                    .join(", ");
            }
        } else if (
            typeof userToShow.book === "string" &&
            userToShow.book !== ""
        ) {
            borrowedBooksInfo = userToShow.book;
        }

        elUsers.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <h3 class="username">${
                        userToShow.name || userToShow.username
                    }</h3>
                    <p class="faculty">${userToShow.khoa || ""}</p>
                </div>
                <h5 class="card-title">Thông tin chi tiết</h5>
                <table class="info-table">
                    <tr><th>Tên đăng nhập</th><td>${
                        userToShow.username
                    }</td></tr>
                    <tr><th>Sách đã mượn</th><td>${borrowedBooksInfo}</td></tr>
                    <tr><th>Ngày trả</th><td>${
                        userToShow.date || "Chưa có"
                    }</td></tr>
                    <tr><th>Địa chỉ</th><td>${
                        userToShow.address || ""
                    }</td></tr>
                    <tr><th>Số điện thoại</th><td>${
                        userToShow.phone || ""
                    }</td></tr>
                </table>
            </div>
        `;
    }
}
function capitalizeWords(str) {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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
                    document.getElementById("author").textContent =
                        capitalizeWords(book.author);
                    document.getElementById("year").textContent =
                        book.release_date;
                    document.getElementById("translator").textContent =
                        capitalizeWords(book.translator);
                    document.getElementById("publisher").textContent =
                        capitalizeWords(book.publisher);
                    document.getElementById("pages").textContent = book.pages;
                    document.getElementById("description").textContent =
                        book.description;
                } else {
                    document.body.innerHTML = "<h2>Không tìm thấy sách.</h2>";
                }
            })
            .catch((err) => {
                document.body.innerHTML = `<h2>Lỗi khi tải dữ liệu: ${err}</h2>`;
            });
    }
}
