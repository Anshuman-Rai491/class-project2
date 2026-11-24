
document.addEventListener("DOMContentLoaded", function () {

    const buildingList = document.getElementById("buildingGrid");
    const buildingSearch = document.getElementById("buildingSearch");
    const buildingDetails = document.getElementById("buildingDetails");

    // DISPLAY BUILDING CARDS
    function displayBuildings(data) {

        buildingList.innerHTML = "";

        if (data.length === 0) {
            buildingList.innerHTML =
                "<p class='no-results'>No buildings found.</p>";
            return;
        }

        data.forEach(function (building) {

            const card = document.createElement("div");
            card.className = "building-card";

            card.innerHTML = `
                <i class="fa-solid fa-building"></i>
                <h3>${building.name}</h3>
                <p>Building Number: ${building.id}</p>
                <p>Category: ${building.category}</p>
            `;

            card.addEventListener("click", function () {
                showBuildingDetails(building);
            });

            buildingList.appendChild(card);
        });
    }

    // SHOW BUILDING DETAILS
    function showBuildingDetails(building) {

        buildingDetails.innerHTML = `
            <div class="content-card">
                <h2>${building.name}</h2>
                <p><strong>Building Number:</strong> ${building.id}</p>
                <p><strong>Category:</strong> ${building.category}</p>
                <button id="closeBuildingDetails" class="primary-btn">
                    Close Details
                </button>
            </div>
        `;

        buildingDetails.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        document.getElementById("closeBuildingDetails")
            .addEventListener("click", function () {
                buildingDetails.innerHTML = "";
            });
    }

    // SEARCH BUILDINGS
    function searchBuildings() {

        const searchText =
            buildingSearch.value.toLowerCase().trim();

        const filteredBuildings = buildings.filter(function (building) {

            return (
                building.id.toLowerCase().includes(searchText) ||
                building.name.toLowerCase().includes(searchText) ||
                building.category.toLowerCase().includes(searchText)
            );
        });

        buildingDetails.innerHTML = "";
        displayBuildings(filteredBuildings);
    }

    // SEARCH EVENT
    buildingSearch.addEventListener("input", searchBuildings);

    // INITIAL DISPLAY
    displayBuildings(buildings);

    // MAKE FUNCTION AVAILABLE TO APP.JS
    window.showBuildingDetails = showBuildingDetails;

});
