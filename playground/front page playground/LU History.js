// Fitur Keamanan Source Inspection
document.onkeydown = function(e) {
    if (e.keyCode === 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
        return false;
    }
}

// Fitur UX Kalkulator
const selectedOp = document.querySelector('.operator-get');
const opBox = document.querySelectorAll('.operator-box');
const usedOperator = document.querySelector('.used-operator p');
const pageBgr = document.querySelector('.page');

// Menentukan Operasi - UX Feature
opBox.forEach(selected => {
    selected.addEventListener('click', function() {
        const inUse = document.querySelector('.selected');
        if (inUse) {
            inUse.classList.remove("selected");
        }
        selected.classList.add("selected");
        usedOperator.textContent = selected.querySelector('p').textContent;
    });
});

// Set ordo
const setOrdo = document.querySelector('.set-ordo');
const inputBox = document.createElement('div'); // Dynamically created to hold matrix inputs
inputBox.classList.add('matrix-input');
document.body.appendChild(inputBox); // Append to body or relevant container

function setGrid() {
    const jmlOrdo = parseInt(document.getElementById('size').value);

    if (jmlOrdo > 1 && jmlOrdo <= 5) {
        inputBox.innerHTML = ''; // Clear previous matrix
        for (let i = 0; i < jmlOrdo * jmlOrdo; i++) {
            const newInput = document.createElement('input');
            newInput.setAttribute('type', 'number');
            newInput.style.width = '40px'; // Set width directly
            // inputBox.appendChild(newInput); // Comment dulu gara2 ...
        }
        // // inputBox.style.display = 'grid'; // Make sure the box uses grid layout
        // // inputBox.style.gridTemplateColumns = `repeat(${jmlOrdo}, 40px)`;
        // // inputBox.style.gridTemplateRows = `repeat(${jmlOrdo}, 40px)`;
    } else {
        alert('Ordo matriks harus di antara 2—5.');
    }
}

// Set up event listeners
setOrdo.addEventListener('click', setGrid, false);

function generateMatrix() {
    const size = parseInt(document.getElementById('size').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = ''; // Clear previous matrix

    if (size < 2 || size > 5 || isNaN(size)) {
        alert('Ordo matriks harus di antara 2–5.');
        return;
    }

    const table = document.createElement('table');
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number'; // Use 'number' for direct numeric input
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Hitung';
    submitButton.onclick = function() {
        const A = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            const inputs = table.rows[i].getElementsByTagName('input');
            for (let j = 0; j < size; j++) {
                const value = parseFloat(inputs[j].value);
                if (isNaN(value)) {
                    alert('Mohon masukkan entri bilangan real pada matriks.');
                    return;
                }
                row.push(value);
            }
            A.push(row);
        }
        console.log('Matrix:', A);
        alert('Matriks telah dibuat. Periksa console untuk keluaran.');
        LUdekom(A); // Call the LU decomposition function with the matrix A
    };
    container.appendChild(submitButton);
}

const { fraction } = math;

function LUdekom(A) {
    const n = A.length;
    const L = Array.from({ length: n }, (_, i) => 
        Array.from({ length: n }, (_, j) => (i === j ? fraction(1) : fraction(0)))
    );
    const U = A.map(row => row.map(value => fraction(value)));

    // if (n !== A[0].length) {
    //     throw new TypeError('Matriks yang diberikan bukan matriks persegi.');
    // }
    
    // LU Decomposition Logic
    function deter(B, peng = 1) { // Fungsi determinan dengan rekursif (kofaktor)
        const ukuran = B.length;
        if (ukuran === 1) {
            return peng * B[0][0];
        } else {
            let tanda = -1;
            let jawab = 0;
            for (let i = 0; i < ukuran; i++) {
                const boneka = [];
                for (let j = 1; j < ukuran; j++) {
                    const tamb = [];
                    for (let k = 0; k < ukuran; k++) {
                        if (k !== i) {
                            tamb.push(B[j][k]);
                        }
                    }
                    boneka.push(tamb);
                }
                tanda *= -1;
                jawab += peng * tanda * B[0][i] * deter(boneka);
            }
            return jawab;
        }
    }

    function detsub(A) { // Fungsi minor utama terdepan
        const boneka = new Array(A.length).fill(0); // Array untuk entri-entri rasional
        for (let l = 0; l < A.length; l++) {
            const submatriks = A.slice(0, l + 1).map(row => row.slice(0, l + 1));
            boneka[l] = deter(submatriks);
        }
        return boneka;
    }

    function cekdetsub_lu(X) { // Fungsi untuk memeriksa apakah minor utama terdepan nol atau tidak
        return detsub(X).some(value => value === 0) ? 1 : 0;
    }

    if (cekdetsub_lu(A) === 1) {
        throw new TypeError("Matriks tidak dapat didekomposisi LU. Ada minor utama terdepan dari matriks yang nol.");
    } else {
        for (let k = 0; k < n - 1; k++) {
            for (let i = k + 1; i < n; i++) {
                const faktor = U[i][k].div(U[k][k]);
                L[i][k] = faktor;
                for (let j = k; j < n; j++) {
                    U[i][j] = U[i][j].sub(faktor.mul(U[k][j]));
                }
            }
        }
    }

    console.log('L =', L.map(row => row.map(value => value.toFraction())));
    console.log('U =', U.map(row => row.map(value => value.toFraction())));
}
// Array to store calculation history
let history = [];

// Update this function to save matrices to history
function generateMatrix() {
    const size = parseInt(document.getElementById('size').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = ''; // Clear previous matrix

    if (size < 2 || size > 5 || isNaN(size)) {
        alert('Ordo matriks harus di antara 2–5.');
        return;
    }

    const table = document.createElement('table');
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number'; // Use 'number' for direct numeric input
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Hitung';
    submitButton.onclick = function() {
        const A = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            const inputs = table.rows[i].getElementsByTagName('input');
            for (let j = 0; j < size; j++) {
                const value = parseFloat(inputs[j].value);
                if (isNaN(value)) {
                    alert('Mohon masukkan entri bilangan real pada matriks.');
                    return;
                }
                row.push(value);
            }
            A.push(row);
        }
        console.log('Matrix:', A);
        alert('Matriks telah dibuat. Periksa console untuk keluaran.');
        LUdekom(A); // Call the LU decomposition function with the matrix A
    };
    container.appendChild(submitButton);
}

// Function to store history
function saveToHistory(A, L, U) {
    history.push({ A, L, U });
    updateHistoryUI();
}

// Function to update the history tab UI
function updateHistoryUI() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Clear previous history display

    history.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>Perhitungan ${index + 1}</h3>
            <p>Matriks Awal (A):</p>
            <pre>${matrixToString(entry.A)}</pre>
            <p>Matriks L:</p>
            <pre>${matrixToString(entry.L)}</pre>
            <p>Matriks U:</p>
            <pre>${matrixToString(entry.U)}</pre>
        `;
        historyList.appendChild(listItem);
    });
}

// Helper function to convert a matrix to a string for display
function matrixToString(matrix) {
    return matrix.map(row => '[' + row.join(', ') + ']').join('\n');
}

// Update the LUdekom function to save results to history
function LUdekom(A) {
    const n = A.length;
    const L = Array.from({ length: n }, (_, i) => 
        Array.from({ length: n }, (_, j) => (i === j ? fraction(1) : fraction(0)))
    );
    const U = A.map(row => row.map(value => fraction(value)));

    // if (n !== A[0].length) {
    //     throw new TypeError('Matriks yang diberikan bukan matriks persegi.');
    // }
    
    // LU Decomposition Logic
    function deter(B, peng = 1) { // Fungsi determinan dengan rekursif (kofaktor)
        const ukuran = B.length;
        if (ukuran === 1) {
            return peng * B[0][0];
        } else {
            let tanda = -1;
            let jawab = 0;
            for (let i = 0; i < ukuran; i++) {
                const boneka = [];
                for (let j = 1; j < ukuran; j++) {
                    const tamb = [];
                    for (let k = 0; k < ukuran; k++) {
                        if (k !== i) {
                            tamb.push(B[j][k]);
                        }
                    }
                    boneka.push(tamb);
                }
                tanda *= -1;
                jawab += peng * tanda * B[0][i] * deter(boneka);
            }
            return jawab;
        }
    }

    function detsub(A) { // Fungsi minor utama terdepan
        const boneka = new Array(A.length).fill(0); // Array untuk entri-entri rasional
        for (let l = 0; l < A.length; l++) {
            const submatriks = A.slice(0, l + 1).map(row => row.slice(0, l + 1));
            boneka[l] = deter(submatriks);
        }
        return boneka;
    }

    function cekdetsub_lu(X) { // Fungsi untuk memeriksa apakah minor utama terdepan nol atau tidak
        return detsub(X).some(value => value === 0) ? 1 : 0;
    }

    if (cekdetsub_lu(A) === 1) {
        throw new TypeError("Matriks tidak dapat didekomposisi LU. Ada minor utama terdepan dari matriks yang nol.");
    } else {
        for (let k = 0; k < n - 1; k++) {
            for (let i = k + 1; i < n; i++) {
                const faktor = U[i][k].div(U[k][k]);
                L[i][k] = faktor;
                for (let j = k; j < n; j++) {
                    U[i][j] = U[i][j].sub(faktor.mul(U[k][j]));
                }
            }
        }
    }

    console.log('L =', L.map(row => row.map(value => value.toFraction())));
    console.log('U =', U.map(row => row.map(value => value.toFraction())));

    // Save the result to history
    saveToHistory(A.map(row => row.map(value => value.toFixed(2))), L.map(row => row.map(value => value.toFraction())), U.map(row => row.map(value => value.toFraction())));
}

// Function to update the history tab UI
function updateHistoryUI() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Clear previous history display

    history.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'history-entry';

        // Create a container for the title and buttons (toggle, bookmark)
        const titleContainer = document.createElement('div');
        titleContainer.className = 'title-container';

        // Perhitungan title with real-time timestamp
        const title = document.createElement('h3');
        title.innerText = `Perhitungan ${index + 1} (${getCurrentTimestamp()})`;

        // Create a triangular toggle button (inside the title container)
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-btn';
        toggleButton.innerHTML = '&#x25BC;'; // Downwards triangle symbol
        toggleButton.onclick = function () {
            const details = listItem.querySelector('.details');
            const isHidden = details.style.display === 'none' || details.style.display === '';
            details.style.display = isHidden ? 'block' : 'none';
            toggleButton.innerHTML = isHidden ? '&#x25B2;' : '&#x25BC;'; // Switch to upwards triangle when expanded
        };

       // Create a bookmark button (inside the title container)
            const bookmarkButton = document.createElement('button');
            bookmarkButton.className = 'bookmark-btn';
            bookmarkButton.innerHTML = '&#9733;'; // Star symbol for bookmark
            bookmarkButton.onclick = function () {
                bookmarkButton.classList.toggle('bookmarked'); // Toggle the 'bookmarked' class for visual feedback
                console.log(bookmarkButton.classList); // Check class list in the console
            };
            


        // Append the title, toggle, and bookmark button to the title container
        titleContainer.appendChild(title);
        titleContainer.appendChild(bookmarkButton); // Bookmark button placed next to toggle button
        titleContainer.appendChild(toggleButton); // Toggle button placed next to title

        // Create the container for the details (matrices A, L, U)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details';
        detailsContainer.style.display = 'none'; // Initially hidden

        detailsContainer.innerHTML = `
            <p>Matriks Awal (A):</p>
            <pre>${matrixToString(entry.A)}</pre>
            <p>Matriks L:</p>
            <pre>${matrixToString(entry.L)}</pre>
            <p>Matriks U:</p>
            <pre>${matrixToString(entry.U)}</pre>
        `;

        // Append the title container and details container to the list item
        listItem.appendChild(titleContainer);
        listItem.appendChild(detailsContainer); // Matrices directly below "Perhitungan X"

        // Add the list item to the history list
        historyList.appendChild(listItem);
    });
}

// Helper function to get the current timestamp
function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}
