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
        // alert('Ordo matriks harus di antara 2—5.');
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
        // alert('Matriks telah dibuat. Periksa console untuk keluaran.');
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
        showResult(); // Mengeluarkan tampilan modal - terdapat pada file result.js
        resultNoLUDecomp(); // Fungsi yang memberitahu user bahwa matriks tidak dapat didekomposisi LU - terdapat pada file result.js
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

    showResult();
    resultYesLUDecomp(L,U);
}
