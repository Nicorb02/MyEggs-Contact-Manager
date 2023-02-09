let section = document.querySelector("section");
let cover_div = document.querySelector(".cover_div");
let openRegister = document.querySelector(".openRegister");
let openLogin = document.querySelector(".openLogin");
let form = document.querySelector("form");
let register = document.getElementById("register");
let eyeball = document.getElementById("show-password2");

let userId = 0;
const contactIds = [];
let firstName = "";
let lastName = "";

//const urlBase = '';
const urlBase = 'http://my-eggs.com/LAMPAPI';
const extension = 'php';

//eyeball code
const showPassword = document.querySelector("#show-password");
const passwordField = document.querySelector("#loginPassword");
showPassword.addEventListener("click", function(){
    this.classList.toggle("fa-eye-slash");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password"
    passwordField.setAttribute("type", type);
})

const showPassword2 = document.querySelector("#show-password2");
const passwordField2 = document.querySelector("#password");
showPassword2.addEventListener("click", function(){
    this.classList.toggle("fa-eye-slash");
    const type2 = passwordField2.getAttribute("type") === "password" ? "text" : "password"
    passwordField2.setAttribute("type", type2);
})

openLogin.addEventListener("click", () => {
	cover_div.style.transform = "rotateY(0deg)";
});

openRegister.addEventListener("click", () => {
	cover_div.style.transform = "rotateY(180deg)";
	register.style.height = "450px";
	register.style.width = "350px";
	eyeball.style.top = "69%";
});


function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		console.log(jsonPayload);
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Hello, " + firstName;
	}
}


function doRegister() {
	let firstName = document.getElementById("fname").value;
	let lastName = document.getElementById("lname").value;
	let newEgg = document.getElementById("username").value;
	let password = document.getElementById("password").value;



	document.getElementById("registerResult").innerHTML = "";



	var tmp = { firstname: firstName, lastname: lastName, login: newEgg, password: password };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/Register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("registerResult").innerHTML = "User added";
				window.location.href = "login.html";
			}
		};
		console.log(jsonPayload);
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}


}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showAddBox() {

	let add = document.getElementById("addEgg");
	let table = document.getElementById("contactsTable");

	if (add.style.display === "none") {
		add.style.display = "block";
		table.style.display = "none";
	}

	else {
		add.style.display = "none";
		table.style.display = "block";
	}
}

// Calling loadTable() to load with an empty string -> full list of contactts
function loadContacts() {
	loadTable("");
}

// Actual search
function searchContacts() {
	let searchData = document.getElementById("searchData").value;
	loadTable(searchData);
}

function loadTable(searchData) {
	let tmp = {
		userId: userId,
		search: searchData
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/Read.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error) {
					console.log(jsonObject.error);
					return;
				}

				// save a string of the table HTML and then load into the tableBody element
				let table = "";

				for (let i = 0; i < jsonObject.results.length; i++) {
					// refresh the contactIds[] based on the rows displayed
					contactIds[i] = jsonObject.results[i].ID;

					table += "<tr id='row" + i + "'>";
					table += "<td id='firstName" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
					table += "<td id='lastName" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
					table += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
					table += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
					table += "<td>" +
						"<button id='editBtn" + i + "' onclick='editContact(" + i + ")'>" + "Edit Contact" + "</button>" +
						"<button id='saveBtn" + i + "' value='Save' onclick='saveContact(" + i + ")' style='display: none'>Save Changes</button>" + "</td>";
					table += "<td><button id='deleteBtn" + i + "' onclick='deleteContact(" + i + ")'>" + "Delete Contact</button></td>";
					table += "</tr>";
				}
				document.getElementById("tableBody").innerHTML = table;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}

}

function editContact(rowNum) {
	document.getElementById('editBtn' + rowNum).style.display = 'none';
	document.getElementById('saveBtn' + rowNum).style.display = 'inline-block';

	let fname = document.getElementById("firstName" + rowNum);
	let lname = document.getElementById("lastName" + rowNum);
	let phone = document.getElementById("phone" + rowNum);
	let email = document.getElementById("email" + rowNum);

	let fnameText = fname.innerText;
	let lnameText = lname.innerText;
	let phoneText = phone.innerText;
	let emailText = email.innerText;

	fname.innerHTML = "<input type='text' id='fnameText" + rowNum + "' value='" + fnameText + "'/>";
	lname.innerHTML = "<input type='text' id='lnameText" + rowNum + "' value='" + lnameText + "'/>";
	phone.innerHTML = "<input type='text' id='phoneText" + rowNum + "' value='" + phoneText + "'/>";
	email.innerHTML = "<input type='text' id='emailText" + rowNum + "' value='" + emailText + "'/>";
}

function saveContact(rowNum) {
	let newFirst = document.getElementById("fnameText" + rowNum).value;
	let newLast = document.getElementById("lnameText" + rowNum).value;
	let newPhone = document.getElementById("phoneText" + rowNum).value;
	let newEmail = document.getElementById("emailText" + rowNum).value;
	let contactId = contactIds[rowNum];

	// change from input to not input
	document.getElementById("firstName" + rowNum).innerHTML = newFirst;
	document.getElementById("lastName" + rowNum).innerHTML = newLast;
	document.getElementById("phone" + rowNum).innerHTML = newPhone;
	document.getElementById("email" + rowNum).innerHTML = newEmail;


	document.getElementById('editBtn' + rowNum).style.display = 'inline-block';
	document.getElementById('saveBtn' + rowNum).style.display = 'none';

	let tmp = {
		id: contactId,
		firstname: newFirst,
		lastname: newLast,
		phone: newPhone,
		email: newEmail
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Update.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Changes saved");
				loadContacts();
			}
		};

		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

function deleteContact(rowNum) {
	let firstName = document.getElementById("firstName" + rowNum).innerText;
	let lastName = document.getElementById("lastName" + rowNum).innerText;

	// Proceed with deletion only if the confirmation is yes
	if (confirm("Would you like to delete " + firstName + " " + lastName + "?") === true) {
		// delete from the HTML file
		document.getElementById("row" + rowNum).outerHTML = "";

		let tmp = {
			ID: contactIds[rowNum]
		};

		let jsonPayload = JSON.stringify(tmp);
		let url = urlBase + '/DeleteContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					console.log(firstName + lastName + " Deleted");
					loadContacts();
					document.getElementById("searchData").reset();
				}
			};
			xhr.send(jsonPayload);
		} catch (err) {
			console.log(err.message);
		}
	}

}

function addContact() {
	let fname = document.getElementById("addFirstName").value;
	let lname = document.getElementById("addLastName").value;
	let phoneNumber = document.getElementById("addNumber").value;
	let emailAddress = document.getElementById("addEmail").value;

	let tmp = {
		firstname: fname,
		lastname: lname,
		phone: phoneNumber,
		email: emailAddress,
		userID: userId
	};

	// get ready to send json with information
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			// if everything is in order to add a contact, reload the contacts and hide the add box
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contact added");
				document.getElementById("addEgg").reset();
				loadContacts();
				showAddBox();
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err.message);
	}

}
