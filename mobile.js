import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiuLz7pmzSJUkK5WpeH0epbzzt8rTx-VU",
  authDomain: "mileage-assist-user-accounts.firebaseapp.com",
  projectId: "mileage-assist-user-accounts",
  storageBucket: "mileage-assist-user-accounts.appspot.com",
  messagingSenderId: "831846666309",
  appId: "1:831846666309:web:d7e4ecdd23e9fcc2c6532c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const clientInfoContainer = document.getElementById("add-contact-form");
const lightbox = document.getElementById("lightbox");
const exitBtn = document.querySelector(".exit-btn");
const navigation = document.getElementById("navigation");
const exitBtnNav = document.querySelector(".exit-btn-nav");
const userInfoContainerAlign = document.querySelector(".user-info-container-align");
const profileContainer = document.querySelector(".profile-container");
const nameCardsContainer = document.querySelector(".name-cards-container");
const userInfoContainer = document.querySelector(".user-info-container");
const logoutConfirm = document.querySelector(".logout-confirm");
const logoutBtn = document.querySelector(".logout-btn");
const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const menuBtnContainer = document.querySelector(".menu-btn-container");
const plusBtn = document.querySelector(".add-contact-btn");
const doneBtn = document.getElementById("done-btn");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const programInput = document.getElementById("program");

lightbox.hidden = true;
clientInfoContainer.hidden = true;
logoutConfirm.hidden = true;
userInfoContainer.hidden = true;
userInfoContainerAlign.hidden = true;
navigation.hidden = true;

window.history.pushState(null, "", window.location.href);

window.addEventListener("popstate", function () {
    window.history.pushState(null, "", window.location.href);
});

// Profile dropdown
profileContainer.addEventListener("click", () => {
    if (userInfoContainerAlign.hidden === true) {
        userInfoContainerAlign.hidden = false;
        userInfoContainer.hidden = false;
        lightbox.hidden = false;
    } else {
        userInfoContainerAlign.hidden = true;
        lightbox.hidden = true;
    }
});

// Logout
logoutBtn.addEventListener("click", () => {
    userInfoContainer.hidden = true;
    logoutConfirm.hidden = false;
});

noBtn.addEventListener("click", () => {
    logoutConfirm.hidden = true;
    userInfoContainerAlign.hidden = true;
    lightbox.hidden = true;
});

yesBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
});

// Navigation
menuBtnContainer.addEventListener("click", () => {
    navigation.hidden = false;
    lightbox.hidden = false;
});

exitBtnNav.addEventListener("click", () => {
    navigation.hidden = true;
    lightbox.hidden = true;
});

// Add contact form
plusBtn.addEventListener("click", () => {
    clientInfoContainer.hidden = false;
    lightbox.hidden = false;
});

exitBtn.addEventListener("click", () => {
    clientInfoContainer.hidden = true;
    lightbox.hidden = true;
});

// Create client card
function createClientCard(firstName, lastName, program, clientId) {
    const card = document.createElement("div");
    card.className = "name-card";

    card.innerHTML = `
        <div class="name-card-heading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="name-card-dropdown-icon2" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg>
            <h3>${firstName} ${lastName}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg>
        </div>
        <p>Program: ${program}</p>
        <div class="visit-fields-container" hidden>
            <div class="odemeter-fields">
                <input type="text" placeholder="Odometer start">
                <input type="text" placeholder="Odometer end">
            </div>
            <div class="odemeter-fields">
                <input type="text" placeholder="Location start">
                <input type="text" placeholder="Location end">
            </div>
            <div class="objective-field">
                <input type="text" placeholder="Reason for visit">
            </div>
            <button class="submit-btn">Submit</button>
        </div>
    `;

    const heading = card.querySelector(".name-card-heading");
    const visitFields = card.querySelector(".visit-fields-container");
    const icon = card.querySelector(".name-card-dropdown-icon2");
    const submitBtn = card.querySelector(".submit-btn");

    heading.addEventListener("click", () => {
        visitFields.hidden = !visitFields.hidden;
        icon.style.transform = visitFields.hidden ? "rotate(0deg)" : "rotate(90deg)";
    });

    visitFields.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    submitBtn.addEventListener("click", async () => {
        const inputs = visitFields.querySelectorAll("input");
        const user = auth.currentUser;

        if (!inputs[0].value || !inputs[1].value || !inputs[2].value || !inputs[3].value || !inputs[4].value) {
            alert("Please fill out all fields.");
            return;
        }

        await fetch("/visits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: clientId,
                user_uid: user.uid,
                odometer_start: inputs[0].value,
                odometer_end: inputs[1].value,
                location_start: inputs[2].value,
                location_end: inputs[3].value,
                reason: inputs[4].value
            })
        });

        alert("Visit saved!");
        inputs.forEach(i => i.value = "");
    });

    nameCardsContainer.appendChild(card);
}

// Done button and save client
doneBtn.addEventListener("click", async () => {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const program = programInput.value.trim();

    if (firstName === "" || lastName === "" || program === "") {
        alert("Please fill out all fields.");
        return;
    }

    const user = auth.currentUser;

    const response = await fetch("/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_uid: user.uid,
            first_name: firstName,
            last_name: lastName,
            program: program
        })
    });

    const data = await response.json();
    createClientCard(firstName, lastName, program, data.id);

    firstNameInput.value = "";
    lastNameInput.value = "";
    programInput.value = "";

    clientInfoContainer.hidden = true;
    lightbox.hidden = true;
});

const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("input", function () {
    const searchText = searchBar.value.toLowerCase();
    const nameCards = document.querySelectorAll(".name-card");

    nameCards.forEach(function (card) {
        const cardText = card.textContent.toLowerCase();

        if (cardText.includes(searchText)) {
            card.hidden = false;
        } else {
            card.hidden = true;
        }
    });
});

// Auth guard and load clients

const splash = document.getElementById("splash-screen");

setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.style.display = "none", 500);
}, 2000);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        document.querySelector(".profile-container h2").textContent = user.email;
        document.querySelector(".user-info-container h3:first-child").textContent = user.email;

        const response = await fetch(`/clients?user_uid=${user.uid}`);
        const clients = await response.json();

        nameCardsContainer.innerHTML = "";

        clients.forEach(c => createClientCard(c.first_name, c.last_name, c.program, c.id));
    }
});

// Auto logout after 10 min. of inactivity

let logoutTimer;

function resetTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    }, 10 * 60 * 1000);
}

document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);
document.addEventListener("click", resetTimer);
document.addEventListener("touchstart", resetTimer);

resetTimer();
