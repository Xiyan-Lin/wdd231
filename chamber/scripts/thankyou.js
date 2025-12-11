const params = new URLSearchParams(window.location.search);

const fields = [
  "fname", "lname", "email", "phone", "organization", "timestamp"
];

let html = "<ul>";
fields.forEach(f => {
  html += `<li><strong>${f}:</strong> ${params.get(f) || ""}</li>`;
});
html += "</ul>";

document.getElementById("output").innerHTML = html;
