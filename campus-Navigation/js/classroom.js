
document.addEventListener("DOMContentLoaded", async function () {

    const classroomInput = document.getElementById("classroomSearch");
    const findButton = document.getElementById("findClassroom");
    const classroomResult = document.getElementById("classroomResult");

    const buildingSelect = document.getElementById("buildingSelect");
    const floorSelect = document.getElementById("floorSelect");
    const floorClassroomList = document.getElementById("floorClassroomList");

    let classrooms = [];

    // Load sample classroom data
    try {
        const response = await fetch("data/classrooms.json");

        if (!response.ok) {
            throw new Error("Classroom data could not be loaded.");
        }

        classrooms = await response.json();

    } catch (error) {
        console.error(error);
        classroomResult.textContent =
            "Unable to load classroom data. Please use Live Server.";
        return;
    }

    // CLASSROOM SEARCH
    function searchClassroom() {

        const searchValue = classroomInput.value.trim().toUpperCase();

        if (!searchValue) {
            classroomResult.textContent = "Please enter a classroom number.";
            return;
        }

        const found = classrooms.find(room =>
            room.room.toUpperCase() === searchValue
        );

        if (found) {
            classroomResult.innerHTML = `
                <div class="content-card">
                    <h2>${found.room}</h2>
                    <p><strong>Building:</strong> ${found.building}</p>
                    <p><strong>Floor:</strong> ${found.floor}</p>
                    <p><strong>Type:</strong> ${found.category}</p>
                    <p class="demo-warning">
                        Sample demonstration data — not a verified LPU location.
                    </p>
                </div>
            `;
        } else {
            classroomResult.innerHTML = `
                <p>Classroom not found. Try B-204, A-105, C-301, B-101 or A-202.</p>
            `;
        }
    }

    findButton.addEventListener("click", searchClassroom);

    classroomInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchClassroom();
        }
    });

    // FLOOR NAVIGATION
    buildingSelect.addEventListener("change", function () {

        const selectedBuilding = buildingSelect.value;

        floorSelect.innerHTML = '<option value="">Choose a floor</option>';
        floorSelect.disabled = true;
        floorClassroomList.innerHTML = "";

        if (!selectedBuilding) return;

        const buildingRooms = classrooms.filter(room =>
            room.buildingId === selectedBuilding
        );

        const floors = [...new Set(
            buildingRooms.map(room => room.floor)
        )].sort((a, b) => a - b);

        floors.forEach(floor => {
            const option = document.createElement("option");
            option.value = floor;
            option.textContent = floor === 1 ? "Ground / Floor 1" : `Floor ${floor}`;
            floorSelect.appendChild(option);
        });

        floorSelect.disabled = floors.length === 0;

        if (floors.length === 0) {
            floorClassroomList.textContent = "No sample floors available.";
        }
    });

    // DISPLAY ROOMS ON SELECTED FLOOR
    floorSelect.addEventListener("change", function () {

        const buildingId = buildingSelect.value;
        const selectedFloor = Number(floorSelect.value);

        floorClassroomList.innerHTML = "";

        if (!selectedFloor) return;

        const rooms = classrooms.filter(room =>
            room.buildingId === buildingId &&
            room.floor === selectedFloor
        );

        if (rooms.length === 0) {
            floorClassroomList.textContent = "No classrooms on this floor.";
            return;
        }

        rooms.forEach(room => {
            const roomCard = document.createElement("div");
            roomCard.className = "floor-room";

            roomCard.innerHTML = `
                <h3>${room.room}</h3>
                <p>${room.category}</p>
                <small>${room.building} — Floor ${room.floor}</small>
            `;

            floorClassroomList.appendChild(roomCard);
        });
    });

});
