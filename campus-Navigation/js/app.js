
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. PAGE NAVIGATION
    // =====================================

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");

    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display =
                section.id === sectionId ? "block" : "none";
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.section === sectionId
            );
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showSection(this.dataset.section);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.classList.contains("nav-link")) return;

        link.addEventListener("click", function (event) {
            const sectionId = this.getAttribute("href").substring(1);

            if (document.getElementById(sectionId)) {
                event.preventDefault();
                showSection(sectionId);
            }
        });
    });

    showSection("dashboard");


    // =====================================
    // 2. CAMPUS MAP ZOOM AND DRAG
    // =====================================

    const mapViewport = document.getElementById("mapViewport");
    const mapContent = document.getElementById("mapContent");
    const campusImage = document.getElementById("campusSitePlan");

    const zoomInButton = document.getElementById("zoomIn");
    const zoomOutButton = document.getElementById("zoomOut");
    const resetButton = document.getElementById("resetMap");

    let scale = 1;
    let positionX = 0;
    let positionY = 0;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    const ZOOM_STEP = 0.2;

    function updateMap() {
        if (!mapContent) return;

        mapContent.style.transform =
            `translate(${positionX}px, ${positionY}px) scale(${scale})`;
    }

    function zoomMap(amount) {
        scale = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, scale + amount)
        );

        if (scale === MIN_ZOOM) {
            positionX = 0;
            positionY = 0;
        }

        updateMap();
    }

    if (zoomInButton) {
        zoomInButton.addEventListener("click", function () {
            zoomMap(ZOOM_STEP);
        });
    }

    if (zoomOutButton) {
        zoomOutButton.addEventListener("click", function () {
            zoomMap(-ZOOM_STEP);
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            scale = 1;
            positionX = 0;
            positionY = 0;
            updateMap();
        });
    }

    if (mapViewport && mapContent) {

        mapViewport.addEventListener("pointerdown", function (event) {

            // Do not drag the map when clicking a building marker.
            if (event.target.closest(".building-marker")) return;

            isDragging = true;
            startX = event.clientX - positionX;
            startY = event.clientY - positionY;

            mapViewport.setPointerCapture(event.pointerId);
        });

        mapViewport.addEventListener("pointermove", function (event) {
            if (!isDragging) return;

            positionX = event.clientX - startX;
            positionY = event.clientY - startY;

            updateMap();
        });

        function stopDragging() {
            isDragging = false;
        }

        mapViewport.addEventListener("pointerup", stopDragging);
        mapViewport.addEventListener("pointercancel", stopDragging);

        mapViewport.addEventListener("wheel", function (event) {
            event.preventDefault();

            zoomMap(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
        }, { passive: false });
    }

    if (campusImage) {
        campusImage.addEventListener("load", updateMap);

        campusImage.addEventListener("error", function () {
            console.error("Campus map image could not be loaded.");
        });
    }


    // =====================================
    // 3. BUILDING MARKER CLICK
    // =====================================

    const buildingMarkers =
        document.querySelectorAll(".building-marker");

    buildingMarkers.forEach(marker => {

        marker.addEventListener("click", function () {

            const buildingId = this.dataset.buildingId;

            buildingMarkers.forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            if (typeof buildings !== "undefined") {

                const selectedBuilding = buildings.find(building =>
                    String(building.id).toLowerCase() ===
                    String(buildingId).toLowerCase()
                );

                if (selectedBuilding &&
                    typeof showBuildingDetails === "function") {

                    showSection("buildings-section");
                    showBuildingDetails(selectedBuilding);

                } else {
                    alert("Building details are not available yet.");
                }

            } else {
                alert("Building data could not be loaded.");
            }
        });
    });


    // =====================================
    // 4. CLASSROOM FINDER
    // =====================================

    const classroomInput =
        document.getElementById("classroomSearch");

    const classroomButton =
        document.getElementById("findClassroom");

    const classroomResult =
        document.getElementById("classroomResult");

    if (classroomButton) {
        classroomButton.addEventListener("click", function () {

            const classroom = classroomInput.value.trim();

            if (!classroom) {
                classroomResult.textContent =
                    "Please enter a classroom number.";
                return;
            }

            classroomResult.textContent =
                "Classroom database is not connected yet. " +
                "Verified classroom locations will be added later.";
        });
    }


    // =====================================
    // 5. ROUTE PLANNER
    // =====================================

    const startInput =
        document.getElementById("startLocation");

    const destinationInput =
        document.getElementById("destinationLocation");

    const routeButton =
        document.getElementById("findRoute");

    const routeResult =
        document.getElementById("routeResult");

    if (routeButton) {
        routeButton.addEventListener("click", function () {

            const start = startInput.value.trim();
            const destination = destinationInput.value.trim();

            if (!start || !destination) {
                routeResult.textContent =
                    "Please enter both starting point and destination.";
                return;
            }

            routeResult.textContent =
                "Route planning is not connected yet. " +
                "Verified campus routes will be added after location data is confirmed.";
        });
    }


    // =====================================
    // 6. INITIALIZATION
    // =====================================

    updateMap();

    console.log("Campus Navigator initialized successfully!");

});
