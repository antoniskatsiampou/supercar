import { cars as initialData } from "./data.js";

// STATE MANAGEMENT
let carsData = JSON.parse(localStorage.getItem("cars")) || [...initialData];

function saveData() {
    localStorage.setItem("cars", JSON.stringify(carsData));

    const searchInput = document.getElementById("search-input");
    if (searchInput && searchInput.value.trim() !== "") {
        searchInput.dispatchEvent(new Event("input"));
    } else {
        renderTable(carsData);
    }
}

// BURGER MENU 
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("nav-active");
    });
}

const tableBody = document.getElementById("table-body");
const carsTable = document.getElementById("cars-table");
const paginationWrapper = document.getElementById("pagination-wrapper");

// PAGINATION
let currentPage = 1;
let rowsPerPage = 10;

// RESPONSIVE ROWS
function updateRowsPerPage() {
    if (window.innerWidth < 768) {
        rowsPerPage = 12;
    } else {
        rowsPerPage = 20;
    }
    if (tableBody) {
        currentPage = 1;
        const searchInput = document.getElementById("search-input");
        if (searchInput && searchInput.value.trim() !== "") {
            searchInput.dispatchEvent(new Event("input"));
        } else {
            renderTable(carsData);
        }
    }
}

// INITIAL CHECK
updateRowsPerPage();
window.addEventListener("resize", updateRowsPerPage);


function renderTable(data) {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    // PAGINATION
    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // ENSURE CURRENT PAGE IS VALID
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // SLICE DATA
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    // RENDER ROWS
    pageData.forEach(car => {
        const tr = document.createElement("tr");
        tr.id = `car-row-${car.id}`;

        const tdBrand = document.createElement("td");
        tdBrand.className = "col-brand";
        tdBrand.textContent = car.brand;
        tr.appendChild(tdBrand);

        const tdModel = document.createElement("td");
        tdModel.className = "col-model";
        tdModel.textContent = car.model;
        tr.appendChild(tdModel);

        const tdYear = document.createElement("td");
        tdYear.className = "col-year";
        tdYear.textContent = car.year;
        tr.appendChild(tdYear);

        const tdPrice = document.createElement("td");
        tdPrice.className = "col-price";
        tdPrice.style.fontWeight = "bold";
        tdPrice.textContent = (car.price || 0).toLocaleString("el-GR") + " €";
        tr.appendChild(tdPrice);

        const tdMileage = document.createElement("td");
        tdMileage.className = "col-mileage";
        tdMileage.textContent = (car.mileage || 0).toLocaleString("el-GR") + " χλμ";
        tr.appendChild(tdMileage);

        const tdFuel = document.createElement("td");
        tdFuel.className = "col-fuel";
        const spanFuel = document.createElement("span");

        spanFuel.textContent = car.fuel;
        tdFuel.appendChild(spanFuel);
        tr.appendChild(tdFuel);

        const tdTransmission = document.createElement("td");
        tdTransmission.className = "col-transmission";
        tdTransmission.textContent = car.transmission;
        tr.appendChild(tdTransmission);

        const tdActions = document.createElement("td");
        tdActions.className = "actions-cell";

        const editBtn = document.createElement("button");
        editBtn.className = "action-btn edit-btn";
        editBtn.dataset.id = car.id;
        editBtn.title = "Επεξεργασία";

        const editImg = document.createElement("img");
        editImg.src = "svgs/edit.svg";
        editImg.alt = "edit";
        editImg.className = "table-icon";
        editBtn.appendChild(editImg);
        editBtn.addEventListener("click", () => openModal(car));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete-btn";
        deleteBtn.dataset.id = car.id;
        deleteBtn.title = "Διαγραφή";

        const deleteImg = document.createElement("img");
        deleteImg.src = "svgs/delete.svg";
        deleteImg.alt = "delete";
        deleteImg.className = "table-icon";
        deleteBtn.appendChild(deleteImg);
        deleteBtn.addEventListener("click", () => deleteCar(car.id));

        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);

        tableBody.appendChild(tr);
    });

    // PAGINATION
    renderPagination(totalRows, totalPages, data);
}

function renderPagination(totalRows, totalPages, originalData) {
    if (!paginationWrapper) return;
    paginationWrapper.innerHTML = "";

    const container = document.createElement("div");
    container.className = "pagination-container";

    const rightSide = document.createElement("div");
    rightSide.className = "pagination-right";

    if (totalPages > 1) {

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "<";
        prevBtn.className = "page-arrow";
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(originalData);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
        rightSide.appendChild(prevBtn);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(totalPages, 5);
        }
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        if (startPage > 1) {
            rightSide.appendChild(createPageBtn(1, originalData));
            if (startPage > 2) {
                const dots = document.createElement("span");
                dots.className = "page-dots";
                dots.textContent = "...";
                rightSide.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            rightSide.appendChild(createPageBtn(i, originalData));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement("span");
                dots.className = "page-dots";
                dots.textContent = "...";
                rightSide.appendChild(dots);
            }
            rightSide.appendChild(createPageBtn(totalPages, originalData));
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent = ">";
        nextBtn.className = "page-arrow";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(originalData);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
        rightSide.appendChild(nextBtn);
    }

    container.appendChild(rightSide);
    paginationWrapper.appendChild(container);
}

function createPageBtn(pageNum, data) {
    const btn = document.createElement("button");
    btn.className = "page-number";
    if (pageNum === currentPage) btn.classList.add("active");
    btn.textContent = pageNum;
    btn.onclick = () => {
        currentPage = pageNum;
        renderTable(data);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return btn;
}

// DELETE CAR
function deleteCar(id) {
    const confirmDelete = confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το όχημα;");
    if (confirmDelete) {
        const index = carsData.findIndex(car => car.id === id);
        if (index !== -1) {
            carsData.splice(index, 1);
            saveData();
        }
    }
}

// MODAL LOGIC

// CLOSE MODAL IF CLICK OUTSIDE
const modal = document.getElementById("car-form-modal");
const modalTitle = document.getElementById("modal-title");
const carForm = document.getElementById("car-form");
const cancelBtn = document.getElementById("cancel-btn");
const newEntryBtn = document.querySelector(".new-entry-btn");

// YEAR DROPDOWN
function populateYearOptions() {
    const yearSelect = document.getElementById("car-year");
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    const startYear = currentYear + 1;
    const endYear = 1990;

    yearSelect.innerHTML = "";
    for (let year = startYear; year >= endYear; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}
populateYearOptions();

// NEW ENTRY BUTTON
const heroButtons = document.querySelectorAll(".btn-main");
heroButtons.forEach(btn => {
    if (btn.textContent.includes("ΝΕΑ ΕΓΓΡΑΦΗ")) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    }
});


function openModal(car = null) {
    modal.classList.add("active");
    if (car) {
        modalTitle.textContent = "Επεξεργασία Οχήματος";
        document.getElementById("car-id").value = car.id;
        document.getElementById("car-brand").value = car.brand;
        document.getElementById("car-model").value = car.model;
        document.getElementById("car-year").value = car.year;
        document.getElementById("car-price").value = car.price;
        document.getElementById("car-mileage").value = car.mileage;
        document.getElementById("car-fuel").value = car.fuel;
        document.getElementById("car-transmission").value = car.transmission;
    } else {
        modalTitle.textContent = "Νέα Εγγραφή";
        carForm.reset();
        document.getElementById("car-id").value = "";
    }
}

function closeModal() {
    modal.classList.remove("active");
}

if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
}

if (carForm) {
    carForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("car-id").value;
        const brand = document.getElementById("car-brand").value;
        const model = document.getElementById("car-model").value;
        const year = parseInt(document.getElementById("car-year").value);
        const price = parseInt(document.getElementById("car-price").value);
        const mileage = parseInt(document.getElementById("car-mileage").value);
        const fuel = document.getElementById("car-fuel").value;
        const transmission = document.getElementById("car-transmission").value;

        if (id) {
            const index = carsData.findIndex(c => c.id == id);
            if (index !== -1) {
                carsData[index] = { ...carsData[index], brand, model, year, price, mileage, fuel, transmission };
            }
        } else {
            const newId = carsData.length > 0 ? Math.max(...carsData.map(c => c.id)) + 1 : 1;
            const newCar = {
                id: newId,
                brand, model, year, price, mileage, fuel, transmission
            };
            carsData.unshift(newCar); // Add to top
        }

        saveData();
        closeModal();
    });
}

// CLOSE MODAL IF CLICK OUTSIDE
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});


// SEARCH LOGIC
const searchInput = document.getElementById("search-input");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        currentPage = 1;
        const searchTerm = e.target.value.toLowerCase().trim();

        const filteredCars = carsData.filter(car => {
            const brand = car.brand.toLowerCase();
            const model = car.model.toLowerCase();
            const fuel = car.fuel.toLowerCase();
            const transmission = car.transmission.toLowerCase();
            const year = car.year.toString();

            return brand.includes(searchTerm) ||
                model.includes(searchTerm) ||
                fuel.includes(searchTerm) ||
                transmission.includes(searchTerm) ||
                year.includes(searchTerm);
        });

        renderTable(filteredCars);
    });
}

// MOBILE FILTER
const mobileFilterBtn = document.getElementById("mobile-filter-btn");
const sidebarPanel = document.getElementById("mobile-sidebar-panel");

if (mobileFilterBtn && sidebarPanel) {
    mobileFilterBtn.addEventListener("click", () => {
        sidebarPanel.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
        if (!sidebarPanel.contains(e.target) && !mobileFilterBtn.contains(e.target) && sidebarPanel.classList.contains("active")) {
            sidebarPanel.classList.remove("active");
        }
    });
}

// COLUMN FILTERS
const filterCheckboxes = document.querySelectorAll('#filters-list input[type="checkbox"]');

function toggleColumn(columnName, show) {
    if (!carsTable) return;
    if (show) {
        carsTable.classList.remove(`hide-${columnName}`);
    } else {
        carsTable.classList.add(`hide-${columnName}`);
    }
}

filterCheckboxes.forEach(checkbox => {
    // INITIALIZATION
    const colName = checkbox.dataset.col;
    if (colName) {
        checkbox.addEventListener("change", (e) => {
            toggleColumn(colName, e.target.checked);
        });

        toggleColumn(colName, checkbox.checked);
    }
});


// INITIAL RENDER
if (tableBody) {
    if (searchInput && searchInput.value.trim() !== "") {
        searchInput.dispatchEvent(new Event("input"));
    } else {
        renderTable(carsData);
    }
}

// CSV EXPORT
const exportBtn = document.getElementById("export-btn");

if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        const headers = ["ID", "Μάρκα", "Μοντέλο", "Έτος", "Τιμή", "Χιλιόμετρα", "Καύσιμο", "Κιβώτιο"];
        const keys = ["id", "brand", "model", "year", "price", "mileage", "fuel", "transmission"];

        let csvContent = headers.join(",") + "\n";

        carsData.forEach(car => {
            const row = keys.map(key => {
                let val = car[key] ? car[key].toString() : "";

                if (val.includes(",") || val.includes("\"")) {
                    val = `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            });
            csvContent += row.join(",") + "\n";
        });

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "cars_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// CONTACT FORM
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        contactForm.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <img src="svgs/check.svg" alt="Success" style="width: 64px; height: 64px; margin-bottom: 1rem; filter: invert(43%) sepia(13%) saturate(1478%) hue-rotate(182deg) brightness(93%) contrast(89%);"> 
                <h3 style="color: #4A70A9; margin-bottom: 1rem; font-size: 1.5rem;">Ευχαριστούμε που επικοινωνήσατε μαζί μας!</h3>
                <p style="color: #EFECE3; font-size: 1.1rem;">Σύντομα κάποιος από την ομάδα μας θα έρθει σε επαφή μαζί σας.</p>
            </div>
        `;
    });
}





