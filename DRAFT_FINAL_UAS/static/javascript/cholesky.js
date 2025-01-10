function generateMatrixCholesky() {
    const size = parseInt(document.getElementById('size').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = ''; // hapus matriks sebelumnya

    if (size < 2 || size > 5 || isNaN(size)) {
        alert('Dimension of row and column must be between 2 and 5 (inclusive).');
        return;
    }

    const table = document.createElement('table');
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';

            // Validasi input agar hanya bisa bilangan real
            input.oninput = function() {
                // Hanya izinkan angka, titik, dan tanda minus
                this.value = this.value.replace(/[^0-9.-]/g, '');

                // Pastikan hanya ada satu titik desimal
                if (this.value.split('.').length > 2) this.value = this.value.slice(0, -1);

                // Pastikan tanda minus hanya di awal
                if (this.value.indexOf('-') > 0) this.value = this.value.replace('-', '');
            };

            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);

    // bikin tombol untuk kirim (submit)
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Calculate';
    submitButton.onclick = function() {
        const A = [];
        let outOfRange = false;

        for (let i = 0; i < size; i++) {
            const row = [];
            const inputs = table.rows[i].getElementsByTagName('input');
            for (let j = 0; j < size; j++) {
                const value = parseFloat(inputs[j].value);
                
                if (isNaN(value)) {
                    alert('Matrix entry must be a numerical.');
                    return;
                }
                
                // cek apakah nilai di luar rentang (-9999, 9999)
                if (value > 9999 || value < -9999) {
                    outOfRange = true;
                }
                
                row.push(value);
            }
            A.push(row);
        }

        // peringatan jika ada nilai di luar rentang (-9999, 9999)
        if (outOfRange) {
            alert('Matrix entry must be between -9999 and 9999.');
            return;
        }

        console.log('Matrix:', A);
        CholeskyDekom(A); // fungsi buat Cholesky
    };

    container.appendChild(submitButton);
}

// const { fraction } = math;



// Helper function to format the matrix with square root symbols
function formatMatrix(matrix) {
    return matrix.map(row => row.map(value => formatValue(value)));
}

function formatValue(value) {
    if (math.isFraction(value)) value = value.valueOf(); // Convert to decimal if fraction
    if (Number.isInteger(value)) return value.toString(); // Return integers as is

    const sqr = Math.round(value * value);
    if (Math.abs(value - Math.sqrt(sqr)) < 1e-10) {
        return `√${sqr}`; // Represent as square root symbol if close to integer
    }

    return value.toFixed(3); // Fallback to decimal representation
}

function CholeskyDekom(A) {
    const n = A.length;

    // Create a deep copy of A to avoid modifying the original matrix
    const A_copy = A.map(row => row.slice());

    // Initialize L matrix
    const L = Array.from({ length: n }, () => Array(n).fill(math.fraction(0)));

    // Check symmetry
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (!math.equal(A_copy[i][j], A_copy[j][i])) {
                alert("Matrix is not symmetric. Cholesky decomposition cannot be performed.");
                throw new TypeError("Matrix is not symmetric.");
            }
        }
    }

    for (let k = 0; k < n; k++) {
        // Check if the diagonal element is positive
        if (A_copy[k][k] <= 0) {
            alert(`Matrix is not positive definite. Cholesky decomposition cannot be performed.`);
            throw new TypeError("Matrix is not positive definite.");
        }

        // Compute the diagonal element
        L[k][k] = math.sqrt(A_copy[k][k]);

        // Compute the sub-diagonal elements
        for (let i = k + 1; i < n; i++) {
            L[i][k] = math.divide(A_copy[i][k], L[k][k]);
        }

        // Update the copied matrix A
        for (let i = k + 1; i < n; i++) {
            for (let j = k + 1; j <= i; j++) {
                A_copy[i][j] = math.subtract(A_copy[i][j], math.multiply(L[i][k], L[j][k]));
            }
        }
    }

    // Output matrices in fractions and decimals
    console.log(A);
    console.log('L (Symbolic) =', formatMatrix(L));
    console.log('LT (Symbolic) =', formatMatrix(math.transpose(L)));
    console.log('L (Decimal) =', L.map(row => row.map(value => value.valueOf())));
    console.log('LT (Decimal) =', math.transpose(L).map(row => row.map(value => value.valueOf())));

    triggerModal();
    removeContent('modal-box-content');
    hideHistory();
    resultYesCholeskyDecomp(L, A);
    historyCholeskyDecomp(L, A);
}


function resultNoLUDecomp() {
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'Cholesky Decomposition';

    const modalBoxes = document.querySelectorAll('.modal-box-content');
    removeContent('modal-box-content');
    modalBoxes.forEach(modalBox => { // perulangan untuk setiap entri
        const newParagraph = document.createElement('p');
        newParagraph.textContent = 'Cholesky decomposition failed. There are some non-positive pivot.';
        modalBox.appendChild(newParagraph);
    });
}

function resultYesCholeskyDecomp(L, A) {
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'Cholesky Decomposition';

    const modalBox = document.querySelector('.modal-box-content');
    modalBox.innerHTML = ''; // Clear previous content

    // Helper function to format matrix values for display
    const formatValue = (value) => {
        if (math.isFraction(value)) value = value.valueOf(); // Convert to decimal if fraction
        if (Number.isInteger(value)) return value.toString(); // Return integers as is

        const sqr = Math.round(value * value);
        if (Math.abs(value - Math.sqrt(sqr)) < 1e-10) {
            return `√${sqr}`; // Represent as square root symbol if close to integer
        }

        return value.toFixed(3); // Fallback to decimal representation
    };

    // Function to format the matrix with the helper function
    const formatMatrix = (matrix) =>
        matrix.map(row => row.map(value => formatValue(value)));

    // Function to update matrix display
    const updateMatrixDisplay = () => {
        aTable.innerHTML = '<caption>A</caption>';
        lTable.innerHTML = '<caption>L</caption>';
        ltTable.innerHTML = '<caption>Lᵀ</caption>';

        // Populate A table
        formatMatrix(A).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            aTable.appendChild(tr);
        });

        // Populate L table
        formatMatrix(L).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            lTable.appendChild(tr);
        });

        // Populate LT table
        formatMatrix(math.transpose(L)).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            ltTable.appendChild(tr);
        });
    };

    // Create A, L, and LT tables
    const aTable = document.createElement('table');
    aTable.className = 'aTable';

    const equalSign = document.createElement('div');
    equalSign.className = 'equal-sign';
    equalSign.textContent = '=';

    const lTable = document.createElement('table');
    lTable.className = 'lTable';

    const ltTable = document.createElement('table');
    ltTable.className = 'ltTable';

    // Append tables and equal sign in the desired order
    modalBox.appendChild(aTable);
    modalBox.appendChild(equalSign); // Add equal sign
    modalBox.appendChild(lTable);
    modalBox.appendChild(ltTable);

    // Initial display
    updateMatrixDisplay();
}
