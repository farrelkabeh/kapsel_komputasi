// For smooth scrolling animations -- Courtesy @Beyond Fireship - "Subtle, yet Beautiful Scroll Animations" on Youtube
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        // Uncomment the these two lines below to make it reset the animation everytime it scrolled back to the section
        // } else {
            // entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// For Hamburger Menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const hamburgerContent = document.querySelector('.hamburger-content');
    const menuLinks = document.querySelectorAll('#menuToggleHome, #menuTogglePrice, #menuToggleJulia');
    
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded attribute
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle the open class for the animation
        menuToggle.classList.toggle('open');
        
        // Toggle the visibility of the content
        hamburgerContent.setAttribute('aria-expanded', !isExpanded);
    }

    // Function to close the hamburger menu
    function closeHamburger() {
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
            toggleMenu(); // Ensure the menu is closed
        }
    }
    
    // Add closeHamburger to the global scope so it can be used in inline HTML
    window.closeHamburger = closeHamburger;

    menuToggle.addEventListener('click', toggleMenu);

    // Add event listeners to menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menuToggle.getAttribute('aria-expanded') === 'true') {
                toggleMenu(); // Close the menu if it's open
            }
        });
    });
});


// Open/Close Modal (secara umum - tidak akan menghilangkan konten di dalam karena fungsinya terpisah)
function triggerModal() {
    const modalBg = document.querySelector('.modal-bg');
        if (modalBg) {
            modalBg.classList.toggle('modal-bg-show');
            setTimeout(function() { // Jeda selama 0.25s - sesuai dengan transition pada style.css untuk show/close modal
                // removeModalContent(); // Menghilangkan setiap konten di dalam div modal-box - terdapat pada result.js
            }, 250);
        }
}

// Remove Content - Fungsi untuk menghilangkan elemen dalam div dengan nama class '[containerClass]'
function removeContent(containerClass) {
    // Select the container element by its class name
    var container = document.querySelector(`.${containerClass}`);

    // Check if the container exists
    if (container) {
        // Clear the content inside the container
        container.innerHTML = '';
    }
}

// Opsi LU Decomposition - Generate Set Matrix
function LUDecomp() {
    // Remove any previous content from the main-body-content div
    removeContent('main-body-content');

    // Get the container where the new content will go
    const container = document.querySelector(".main-body-content");

    // Create the set-matrix div
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");
    titleDiv.style.textAlign = "center";
    titleDiv.style.fontSize = "1.25rem";
    titleDiv.style.paddingBottom = "1rem";
    titleDiv.style.paddingTop = "1rem";

    // Insert title
    titleDiv.innerHTML = "LU Decomposition Calculator";

    container.appendChild(titleDiv)

    // Create the set-matrix div
    const setMatrixDiv = document.createElement("div");
    setMatrixDiv.classList.add("set-matrix");

    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.id = "size";
    inputElement.type = "number";
    inputElement.min = 2;
    inputElement.max = 5;

    // Create the button element
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("set-ordo");
    buttonElement.textContent = "Make Matrix";

    // Add the onclick event to the button (without calling generateMatrix directly)
    buttonElement.onclick = function() {
        generateMatrix(); // This will call the generateMatrix function when the button is clicked
    };

    // Append the input and button to the set-matrix div
    setMatrixDiv.appendChild(inputElement);
    setMatrixDiv.appendChild(buttonElement);

    // Append the set-matrix div to the main-body-content div
    container.appendChild(setMatrixDiv);

    // Create the matrix-container div with an id
    const matrixContainerDiv = document.createElement("div");
    matrixContainerDiv.classList.add("matrix-container");
    matrixContainerDiv.id = "matrixContainer";

    // Append the matrix-container div to the main-body-content div
    container.appendChild(matrixContainerDiv);
}

// Opsi Cholesky Decomposition
function CholeskyDecomp() {
    // Remove any previous content from the main-body-content div
    removeContent('main-body-content');

    // Get the container where the new content will go
    const container = document.querySelector(".main-body-content");

    // Create the set-matrix div
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");
    titleDiv.style.textAlign = "center";
    titleDiv.style.fontSize = "1.25rem";
    titleDiv.style.paddingBottom = "1rem";
    titleDiv.style.paddingTop = "1rem";

    // Insert title
    titleDiv.innerHTML = "Cholesky Decomposition Calculator";

    container.appendChild(titleDiv)

    // Create the set-matrix div
    const setMatrixDiv = document.createElement("div");
    setMatrixDiv.classList.add("set-matrix");

    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.id = "size";
    inputElement.type = "number";
    inputElement.min = 2;
    inputElement.max = 5;

    // Create the button element
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("set-ordo");
    buttonElement.textContent = "Make Matrix";

    // NOTE: nanti ubah fungsi Cholesky Decomposition

    // Add the onclick event to the button (without calling generateMatrix directly)
    buttonElement.onclick = function() {
        generateMatrixCholesky(); // This will call the generateMatrixCholesky function when the button is clicked
    };

    // Append the input and button to the set-matrix div
    setMatrixDiv.appendChild(inputElement);
    setMatrixDiv.appendChild(buttonElement);

    // Append the set-matrix div to the main-body-content div
    container.appendChild(setMatrixDiv);

    // Create the matrix-container div with an id
    const matrixContainerDiv = document.createElement("div");
    matrixContainerDiv.classList.add("matrix-container");
    matrixContainerDiv.id = "matrixContainer";

    // Append the matrix-container div to the main-body-content div
    container.appendChild(matrixContainerDiv);
}

// Opsi Determinant
function DeterminantCalculator() {
    // Remove any previous content from the main-body-content div
    removeContent('main-body-content');

    // Get the container where the new content will go
    const container = document.querySelector(".main-body-content");

    // Create the set-matrix div
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");
    titleDiv.style.textAlign = "center";
    titleDiv.style.fontSize = "1.25rem";
    titleDiv.style.paddingBottom = "1rem";
    titleDiv.style.paddingTop = "1rem";

    // Insert title
    titleDiv.innerHTML = "Determinant Calculator";

    container.appendChild(titleDiv)

    // Create the set-matrix div
    const setMatrixDiv = document.createElement("div");
    setMatrixDiv.classList.add("set-matrix");

    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.id = "size";
    inputElement.type = "number";
    inputElement.min = 2;
    inputElement.max = 5;

    // Create the button element
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("set-ordo");
    buttonElement.textContent = "Make Matrix";


    // Add the onclick event to the button (without calling generateMatrix directly)
    buttonElement.onclick = function() {
        generateMatrixDeterminant(); // This will call the generateMatrixDeterminant function when the button is clicked
    };

    // Append the input and button to the set-matrix div
    setMatrixDiv.appendChild(inputElement);
    setMatrixDiv.appendChild(buttonElement);

    // Append the set-matrix div to the main-body-content div
    container.appendChild(setMatrixDiv);

    // Create the matrix-container div with an id
    const matrixContainerDiv = document.createElement("div");
    matrixContainerDiv.classList.add("matrix-container");
    matrixContainerDiv.id = "matrixContainer";

    // Append the matrix-container div to the main-body-content div
    container.appendChild(matrixContainerDiv);
}

// Opsi Cholesky Decomposition
function SystemsDecomp() {
    // Remove any previous content from the main-body-content div
    removeContent('main-body-content');

    // Get the container where the new content will go
    const container = document.querySelector(".main-body-content");

    // Create the set-matrix div
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");
    titleDiv.style.textAlign = "center";
    titleDiv.style.fontSize = "1.25rem";
    titleDiv.style.paddingBottom = "1rem";
    titleDiv.style.paddingTop = "1rem";

    // Insert title
    titleDiv.innerHTML = "System of Linear Equations Calculator";

    container.appendChild(titleDiv)

    // Create the set-matrix div
    const setMatrixDiv = document.createElement("div");
    setMatrixDiv.classList.add("set-matrix");

    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.id = "size";
    inputElement.type = "number";
    inputElement.min = 2;
    inputElement.max = 5;

    // Create the button element
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("set-ordo");
    buttonElement.textContent = "Make Matrix";


    // Add the onclick event to the button (without calling generateMatrix directly)
    buttonElement.onclick = function() {
        generateMatrixSystemsDecomp(); // This will call the generateMatrixSystemsDecomp function when the button is clicked
    };

    // Append the input and button to the set-matrix div
    setMatrixDiv.appendChild(inputElement);
    setMatrixDiv.appendChild(buttonElement);

    // Append the set-matrix div to the main-body-content div
    container.appendChild(setMatrixDiv);

    // Create the matrix-container div with an id
    const matrixContainerDiv = document.createElement("div");
    matrixContainerDiv.classList.add("matrix-container");
    matrixContainerDiv.id = "matrixContainer";

    // Append the matrix-container div to the main-body-content div
    container.appendChild(matrixContainerDiv);
}

// Buka History - Buka modal, set title, lalu ubah jadi show
function history() {
    removeContent('modal-box-content');
    const modalBoxContent = document.querySelector('.modal-box-content');
    modalBoxContent.style.display = 'none';

    // Set Title Modal
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'History';

    // Show History Div
    const historyModal = document.querySelector('.modal-box-history');
    historyModal.style.display = 'block';

    // Show Modal
    triggerModal();
}

function hideHistory() {
    // Add a 250ms delay before hiding the history and showing the content
    setTimeout(() => {
        const historyModal = document.querySelector('.modal-box-history');
        historyModal.style.display = 'none';

        const modalBoxContent = document.querySelector('.modal-box-content');
        modalBoxContent.style.display = 'flex';
    }, 250); // 250ms delay
}

// Buka Analytics
function analytics() {
    removeContent('modal-box-content');
    const modalBoxContent = document.querySelector('.modal-box-content');
    modalBoxContent.style.display = 'none';

    // Set Title Modal
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'Site Analytics';

    // Show History Div
    const historyModal = document.querySelector('.modal-box-chart-analytics');
    historyModal.style.display = 'block';

    // Show Modal
    triggerModal();
}

function hideAnalytics() {
    // Add a 250ms delay before hiding the history and showing the content
    setTimeout(() => {
        const historyModal = document.querySelector('.modal-box-chart-analytics');
        historyModal.style.display = 'none';

        const modalBoxContent = document.querySelector('.modal-box-content');
        modalBoxContent.style.display = 'flex';
    }, 250); // 250ms delay
}

// Buka question
function question() {
    removeContent('modal-box-content');
    const modalBoxContent = document.querySelector('.modal-box-content');
    modalBoxContent.style.display = 'none';

    // Set Title Modal
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'Site Navigation';

    // Show History Div
    const historyModal = document.querySelector('.modal-box-chart-question');
    historyModal.style.display = 'block';

    // Show Modal
    triggerModal();
}

function hideQuestions() {
    // Add a 250ms delay before hiding the history and showing the content
    setTimeout(() => {
        const historyModal = document.querySelector('.modal-box-chart-question');
        historyModal.style.display = 'none';

        const modalBoxContent = document.querySelector('.modal-box-content');
        modalBoxContent.style.display = 'flex';
    }, 250); // 250ms delay
}
