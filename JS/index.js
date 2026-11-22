var contacts = JSON.parse(localStorage.getItem("contacts")) || [];
var newData = -1;

var totalCountElement = document.getElementById("totalCount");
var favoriteCountElement = document.getElementById("favoriteCount");
var emergencyCountElement = document.getElementById("emergencyCount");
var favoritesList = document.getElementById("favoritesList");
var emergencyList = document.getElementById("emergencyList");
var nameInput = document.getElementById("Name");
var phoneInput = document.getElementById("phone");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("address");
var groupInput = document.getElementById("group");
var noteInput = document.getElementById("note");
var favoriteInput = document.getElementById("isFavorite");
var emergencyInput = document.getElementById("isEmergency");
var nameError = document.getElementById("nameError");
var phoneError = document.getElementById("phoneError");
var emailError = document.getElementById("emailError");

document
  .getElementById("searchContact")
  .addEventListener("input", displayContact);
document.getElementById("saveContact").addEventListener("click", saveContact);
document
  .getElementById("exampleModal")
  .addEventListener("hide.bs.modal", function () {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  });

displayContact();
displayCounters();

function saveContact() {
  var nameRegex = /^[A-Za-z\u0600-\u06FF]+\s+[A-Za-z\u0600-\u06FF]+$/;
  var phoneRegex = /^01[0-2,5][0-9]{8}$/;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var name = nameInput.value.trim();
  var phone = phoneInput.value.trim();
  var email = emailInput.value.trim();

  var nameValid = nameRegex.test(name);
  var phoneValid = phoneRegex.test(phone);
  var emailValid = email === "" || emailRegex.test(email);

  nameError.classList.toggle("d-none", nameValid);
  phoneError.classList.toggle("d-none", phoneValid);
  emailError.classList.toggle("d-none", emailValid);

  if (!nameValid || !phoneValid || !emailValid) {
    return;
  }

  var phoneExists = contacts.some(function (contact, index) {
    return index !== newData && contact.phone === phone;
  });

  if (phoneExists) {
    phoneError.textContent = "This phone number already exists";
    phoneError.classList.remove("d-none");
    return;
  }

  var contact = {
    name: name,
    phone: phone,
    email: email,
    address: addressInput.value.trim(),
    group: groupInput.value,
    note: noteInput.value.trim(),
    favorite: favoriteInput.checked,
    emergency: emergencyInput.checked,
  };

  if (newData >= 0) {
    updateContact(contact);
  } else {
    contacts.push(contact);
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));
  document.getElementById("saveContact").innerHTML =
    '<i class="fa-solid fa-check"></i> Save Contact';
  clearInputs();
  displayContact();
  displayCounters();
  bootstrap.Modal.getInstance(document.getElementById("exampleModal"))?.hide();
}

function updateContact(contact) {
  contacts.splice(newData, 1, contact);
  newData = -1;
}

function clearInputs() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  groupInput.selectedIndex = 0;
  noteInput.value = "";
  favoriteInput.checked = false;
  emergencyInput.checked = false;
  nameError.classList.add("d-none");
  phoneError.classList.add("d-none");
  emailError.classList.add("d-none");
}

function setNewInfo(i) {
  newData = i;
  nameInput.value = contacts[i].name;
  phoneInput.value = contacts[i].phone;
  emailInput.value = contacts[i].email || "";
  addressInput.value = contacts[i].address || "";
  groupInput.value = contacts[i].group || "select a group";
  noteInput.value = contacts[i].note || "";
  favoriteInput.checked = contacts[i].favorite;
  emergencyInput.checked = contacts[i].emergency;

  document.getElementById("saveContact").innerHTML =
    '<i class="fa-solid fa-check"></i> Update Contact';
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("exampleModal"),
  ).show();
}

function deleteContact(index) {
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContact();
  displayCounters();
}

function toggleFavorite(i) {
  contacts[i].favorite = !contacts[i].favorite;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContact();
  displayCounters();
}

function toggleEmergency(i) {
  contacts[i].emergency = !contacts[i].emergency;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContact();
  displayCounters();
}

function displayCounters() {
  var favoritesCount = 0;
  var emergencyCount = 0;
  var favoritesCartona = "";
  var emergencyCartona = "";

  for (var i = 0; i < contacts.length; i++) {
    var firstletter = contacts[i].name.trim().split(" ");
    var letterone = firstletter[0][0].toUpperCase();
    var lettertwo = firstletter[1] ? firstletter[1][0].toUpperCase() : "";
    var twoletters = letterone + lettertwo;

    if (contacts[i].favorite) {
      favoritesCount++;
      favoritesCartona += `
        <div class="d-flex flex-row gap-2 align-items-center bg-danger-subtle p-1 px-2 rounded-3">
          <span class="bg-danger p-2 px-2 text-white fw-semibold rounded-3">${twoletters}</span>
          <div class="d-flex flex-column">
            <span class="fw-semibold small text-truncate">${contacts[i].name}</span>
            <span class="opacity-75 text-nowrap">${contacts[i].phone}</span>
          </div>
          <a href="tel:${contacts[i].phone}" class="bg-danger p-1 px-1 text-white rounded-3 ms-auto">
            <i class="fa-solid fa-phone fs-6 small"></i>
          </a>
        </div>`;
    }

    if (contacts[i].emergency) {
      emergencyCount++;
      emergencyCartona += `
        <div class="d-flex flex-row gap-2 align-items-center bg-danger-subtle p-1 px-2 rounded-3">
          <span class="bg-danger p-2 px-2 text-white fw-semibold rounded-3">${twoletters}</span>
          <div class="d-flex flex-column">
            <span class="fw-semibold small text-truncate">${contacts[i].name}</span>
            <span class="opacity-75 text-nowrap">${contacts[i].phone}</span>
          </div>
          <a href="tel:${contacts[i].phone}" class="bg-danger p-1 px-1 text-white rounded-3 ms-auto">
            <i class="fa-solid fa-phone fs-6 small"></i>
          </a>
        </div>`;
    }
  }

  totalCountElement.textContent = contacts.length;
  favoriteCountElement.textContent = favoritesCount;
  emergencyCountElement.textContent = emergencyCount;
  favoritesList.innerHTML =
    favoritesCount === 0
      ? `<div class="d-flex justify-content-center opacity-75">No Favorites Contacts</div>`
      : favoritesCartona;
  emergencyList.innerHTML =
    emergencyCount === 0
      ? `<div class="d-flex justify-content-center opacity-75">No Emergencys Contacts</div>`
      : emergencyCartona;
}

function displayContact() {
  var searchContact = document
    .getElementById("searchContact")
    .value.trim()
    .toLowerCase();
  var cartona = "";

  for (var i = 0; i < contacts.length; i++) {
    if (
      !contacts[i].name.toLowerCase().includes(searchContact) &&
      !contacts[i].phone.toLowerCase().includes(searchContact) &&
      !(contacts[i].email || "").toLowerCase().includes(searchContact)
    ) {
      continue;
    }

    var firstletter = contacts[i].name.trim().split(" ");
    var letterone = firstletter[0][0].toUpperCase();
    var lettertwo = firstletter[1] ? firstletter[1][0].toUpperCase() : "";
    var twoletters = letterone + lettertwo;

    cartona += `
      <div class="col-md-6">
        <div class="card h-100 rounded-4 border shadow-sm overflow-hidden">
          <div class="p-3 flex-grow-1">
            <div class="d-flex flex-row align-items-center gap-2">
              <span class="fw-bold bg-danger rounded-3 text-white py-3 px-3">${twoletters}</span>
              <div class="d-flex flex-column gap-1">
                <span class="fw-bold">${contacts[i].name}</span>
                <div>
                  <span class="text-primary bg-info-subtle rounded-3 p-1"><i class="fa-solid fa-phone"></i></span>
                  <span>${contacts[i].phone}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 d-flex flex-column gap-2">
              ${
                contacts[i].email
                  ? `<div class="d-flex flex-row gap-2 align-items-center">
                       <span class="text-primary bg-info-subtle rounded-3 p-1"><i class="fa-solid fa-envelope"></i></span>
                       <span>${contacts[i].email}</span>
                     </div>`
                  : ""
              }
              ${
                contacts[i].address
                  ? `<div class="d-flex flex-row gap-2 align-items-center">
                       <span class="text-danger bg-success-subtle rounded-3 p-1"><i class="fa-solid fa-location-dot"></i></span>
                       <span>${contacts[i].address}</span>
                     </div>`
                  : ""
              }
            </div>
          </div>
          <div class="card-footer mt-auto bg-success-subtle border-top px-3 py-2 d-flex justify-content-between">
            <div class="d-flex flex-row gap-2">
              <a href="tel:${contacts[i].phone}" class="text-danger bg-info-subtle rounded-3 p-1">
                <i class="fa-solid fa-phone"></i>
              </a>
              ${
                contacts[i].email
                  ? `<a href="mailto:${contacts[i].email}" class="text-primary bg-info-subtle rounded-3 p-1">
                       <i class="fa-solid fa-envelope"></i>
                     </a>`
                  : ""
              }
            </div>
            <div class="d-flex flex-row gap-2">
              <a href="#" onclick="toggleFavorite(${i}); return false;" class="rounded-3 p-1 ${
                contacts[i].favorite ? "text-warning" : "text-muted opacity-75"
              }">
                <i class="${
                  contacts[i].favorite
                    ? "fa-solid fa-star"
                    : "fa-regular fa-star"
                }"></i>
              </a>
              <a href="#" onclick="toggleEmergency(${i}); return false;" class="rounded-3 p-1 ${
                contacts[i].emergency ? "text-danger" : "text-muted opacity-75"
              }">
                <i class="${
                  contacts[i].emergency
                    ? "fa-solid fa-heart-pulse"
                    : "fa-regular fa-heart"
                }"></i>
              </a>
              <a href="#" onclick="setNewInfo(${i}); return false;" class="rounded-3 p-1 text-muted opacity-75">
                <i class="fa-solid fa-pen"></i>
              </a>
              <a href="#" onclick="deleteContact(${i}); return false;" class="rounded-3 p-1 text-muted opacity-75">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

  document.getElementById("containNum").innerHTML =
    cartona ||
    `<div class="d-flex justify-content-center align-items-center fw-bold text-muted opacity-75 w-100">There are no matching contacts</div>`;
}
