let section = document.querySelector("section");
let cover_div = document.querySelector(".cover_div");
let openRegister = document.querySelector(".openRegister");
let openLogin = document.querySelector(".openLogin");

let userId = 0;
var id = 0;
let firstName = "";
let lastName = "";

//const urlBase = '';
const urlBase = 'http://my-eggs.com/LAMPAPI';
const extension = 'php';

openRegister.addEventListener("click", () => {
	cover_div.style.transform = "rotateY(180deg)";
	section.style.height = "450px";
});

openLogin.addEventListener("click", () => {
	cover_div.style.transform = "rotateY(0deg)";
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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

// HUSSAIN - DONE
function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// ADDED BY HUSSAIN - DONE
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

// ADDED BY HUSSAIN - Priority !!!
function loadContacts() {
	let tmp = {
		search: "",
		userId: userId
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/Read' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObj.error) {
					console.log(jsonObj.error);
					return;
				}

				// save a string of the table HTML and then load into the tableBody element
				let table = "<table>";

				for (let i = 0; i < jsonObject.results.length; i++) {
					// Need to split first and last name
					let fullName = jsonObject.results[i].Name.split(' ');

					table += "<tr id='row" + i + "'>";
					table += "<td id='firstName" + i + "'><span>" + fullName[0] + "</span><td>";
					table += "<td id='lastName" + i + "'><span>" + fullName[1] + "</span><td>";
					table += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span><td>";
					table += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span><td>";
					// need to add the svgs
					table += "<td>" +
						"<button id='editBtn" + i + "' onclick='editContact(" + i + ")'>" + "<span class='editIcon'></span>" + "</button>" +
						"<button id='saveBtn" + i + "' value='Save' onclick=saveContact(" + i + ")' style='display: none'>" + "<span class='saveIcon'></span>"
						+ "</button>" + "</td>";
					table += "<td><button id='deleteBtn" + i + "' onclick='deleteContact(" + i + ")>" + "<span class='deleteIcon'></span></button></td>"
					table += "</tr>";
				}

				table += "</table>";
				document.getElementById("tableBody").innerHTML = table;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}

}

// Can work on after working on loadContacts() - Priority: !
function editContact(rowNum) {
	document.getElementById('editBtn' + rowNum).style.display = 'none';
	document.getElementById('saveBtn' + rowNum).style.display = 'inline-block';

	let fname = document.getElementById("firstName" + rowNum);
	let lname = document.getElementById("lastName" + rowNum);
	let email = document.getElementById("phone" + rowNum);
	let phone = document.getElementById("email" + rowNum);

	let fnameText = fname.innerText;
	let lnameText = lname.innerText;
	let emailText = email.innerText;
	let phoneText = phone.innerText;

	fname.innerHTML = "<input type='text' id='fnameText" + rowNum + "' value='" + fnameText + "'>";
	lname.innerHTML = "<input type='text' id='lnameText" + rowNum + "' value='" + lnameText + "'>";
	email.innerHTML = "<input type='text' id='emailText" + rowNum + "' value='" + emailText + "'>";
	phone.innerHTML = "<input type='text' id='phoneText" + rowNum + "' value='" + phoneText + "'>";
}

// work on later
function saveContact(rowNum) {

}

// ADDED BY HUSSAIN - Priority !
function deleteContact() {

}


// ADDED BY HUSSAIN - Done?
function addContact() {
	let fname = document.getElementById("addFirstName");
	let lname = document.getElementById("addLastName");

	// API endpoint only uses full name
	let fullName = fname + " " + lname;

	let phoneNum = document.getElementById("addNumber");
	let emailAddr = document.getElementById("addEmail");

	let tmp = {
		name: fullName,
		phone: phoneNum,
		email: emailAddr,
		userID: userId
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
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


// This is an agenda of the stuff i have been working on and kinda where I'm at rn

// finish -> edit, save, and delete
// start -> search contacts
// make sure that the table HTML was right (loadContacts())

// stylizing
// 	- need to center the add contact button
// 	- need to style the trash and edit + save changes buttons
//	- need to stylize them too^

// think of things to split off to others
//		- search bar styling
//		- searching tables

// need to handle contacts that were already added
// clicking edit removes edit on last button
// find a way to cancel editing a contact -> can just save changes and if nothing changes dont upload

// making sure that fields satisfy pattern (Number patterns and email addresses)
// make sure you can't edit and leave out required fields


// **note for team**
// I have a few different things you guys can work on (if you have the time and you want to)

// **CODE**
// I am pretty sure I am done with adding contacts, so that should work once we hook it up.
// I haven't really done any of the code to actually search the table, so there's that stuff to do.

// I have been working on the contact editing and everything associated with that (load, edit, 
// and save changes). I was planning to finish the editing functionality on my own.

// I still have to do the delete contact stuff, but if one of you wants to do that
// just let me know so I don't work on it at the same time as you.

// The entries in the table are dummy values, i just added them to kinda see how the table works 
// without having the database on me. Really the way they work is that we'll load it in with the
// load contact function (adds innerHTML stuff to the document) and searching functions.
// I'll delete the dummy values later..

// Another thing we could add is authenticating that inputs into our table and contacts are valid
// It's not necessary, but it's something he would like. Like making sure phone numbers meet the
// right number of digits, emails have an address, fields aren't left blank, etc. Another thing we
// could do here is highlighting the borders

// ** STYLING **
// - The search bar is pretty huge and I want to figure out how we can make it a little more proportional.
// - I don't really like where the add button is placed, if you can find a better position go for it
// - I still have to do some of the styling for the update, delete, and save changes buttons
// - the add contact button's position is weird
// - if you want to make any changes besides those things, go for it, but just lmk if its anything big

// If you end up working on some of this stuff, thank you so much i really appreciate the help.
// I'm really sorry if I've put any of you guys in a spot or made you worried about this project.
