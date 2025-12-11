const container = document.querySelector("#member-container");
const gridBtn = document.querySelector("#grid-btn");
const listBtn = document.querySelector("#list-btn");

// Fetch and display members
async function loadMembers() {
    const response = await fetch("data/members.json");
    const members = await response.json();

    members.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("member-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.url}" target="_blank">Visit Website</a>
        `;

        container.appendChild(card);
    });
}

loadMembers();

// Toggle Views
gridBtn.addEventListener("click", () => {
    container.classList.add("grid");
    container.classList.remove("list");
});

listBtn.addEventListener("click", () => {
    container.classList.add("list");
    container.classList.remove("grid");
});
