import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

const IRS_RATE = 0.725;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    const response = await fetch(`/visits?user_uid=${user.uid}`);
    const visits = await response.json();

    const tbody = document.getElementById("visits-body");
    let totalMiles = 0;

    visits.forEach(v => {
        const miles = parseFloat(v.odometer_end) - parseFloat(v.odometer_start);
        const reimbursement = miles * IRS_RATE;
        totalMiles += miles;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${v.date}</td>
            <td>${v.first_name} ${v.last_name}</td>
            <td>${v.program}</td>
            <td>${v.location_start}</td>
            <td>${v.location_end}</td>
            <td>${v.reason}</td>
            <td>${v.odometer_start}</td>
            <td>${v.odometer_end}</td>
            <td>${miles.toFixed(1)}</td>
            <td>$${reimbursement.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById("total-miles").textContent = totalMiles.toFixed(1);
    document.getElementById("total-reimbursement").textContent = `$${(totalMiles * IRS_RATE).toFixed(2)}`;

    // Export to CSV
    document.getElementById("export-btn").addEventListener("click", () => {
        const rows = [["Travel Date", "Client", "Program", "Start Location", "Finish Location", "Reason", "Odo Start", "Odo Finish", "Total Miles", "IRS Reimbursement"]];
        visits.forEach(v => {
            const miles = parseFloat(v.odometer_end) - parseFloat(v.odometer_start);
            rows.push([v.date, `${v.first_name} ${v.last_name}`, v.program, v.location_start, v.location_end, v.reason, v.odometer_start, v.odometer_end, miles.toFixed(1), `$${(miles * IRS_RATE).toFixed(2)}`]);
        });
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mileage_log.csv";
        a.click();
    });
});