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
