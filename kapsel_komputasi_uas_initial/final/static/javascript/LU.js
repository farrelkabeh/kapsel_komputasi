// Calculator Feature Initialization
const selectedOp = document.querySelector('.operator-get');
const opBox = document.querySelectorAll('.operator-box');
const usedOperator = document.querySelector('.used-operator p');
const setOrdoButton = document.querySelector('.set-ordo');
const { fraction } = math;

// Operation Selection
opBox.forEach(selected => {
    selected.addEventListener('click', function () {
        document.querySelector('.selected')?.classList.remove("selected");
        selected.classList.add("selected");
        usedOperator.textContent = selected.querySelector('p').textContent;
    });
});

// Input Box for Matrix Size
const inputBox = document.createElement('div');
inputBox.classList.add('matrix-input');
document.body.appendChild(inputBox);

// Matrix Size Validation
document.getElementById('size').oninput = function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // Only allow numbers
};

// Generate Matrix Input Fields
function generateMatrix() {
    const size = parseInt(document.getElementById('size').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = ''; // Clear previous matrix

    if (isNaN(size) || size < 2 || size > 5) {
        alert('Ordo matriks harus di antara 2–5.');
        return;
    }

    // Create Matrix Input Table
    const table = document.createElement('table');
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';

            // Input Validation: Only Real Numbers
            input.oninput = function () {
                this.value = this.value.replace(/[^0-9.-]/g, '');
                if (this.value.split('.').length > 2) this.value = this.value.slice(0, -1); // Only one decimal
                if (this.value.indexOf('-') > 0) this.value = this.value.replace('-', ''); // Negative at start
            };

            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);

    // Submit Button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Hitung';
    submitButton.onclick = () => handleMatrixSubmission(size, table);
    container.appendChild(submitButton);
}

// Handle Matrix Submission and Validation
function handleMatrixSubmission(size, table) {
    const matrix = [];
    let outOfRange = false;

    for (let i = 0; i < size; i++) {
        const row = [];
        const inputs = table.rows[i].getElementsByTagName('input');
        for (let j = 0; j < size; j++) {
            const value = parseFloat(inputs[j].value);

            if (isNaN(value)) {
                alert('Mohon masukkan entri bilangan real pada matriks.');
                return;
            }

            if (value > 9999 || value < -9999) outOfRange = true;
            row.push(value);
        }
        matrix.push(row);
    }

    if (outOfRange) {
        alert('Nilai entri matriks harus dalam rentang -9999 hingga 9999.');
        return;
    }

    console.log('Matrix:', matrix);
    LUdekom(matrix);
}

function LUdekom(A) {
    const n = A.length;

    // Helper: Create identity matrix with fractions
    const identity = n => Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => math.fraction(i === j ? 1 : 0))
    );

    let P = identity(n); // Pivot matrix
    let L = identity(n); // Lower triangular matrix as fractions
    let U = A.map(row => row.map(value => math.fraction(value))); // Copy of matrix A as fractions

    for (let k = 0; k < n - 1; k++) {
        // Find the pivot row
        let maxRow = k;
        let maxValue = math.abs(U[k][k]);

        for (let i = k + 1; i < n; i++) {
            if (math.abs(U[i][k]) > maxValue) {
                maxValue = math.abs(U[i][k]);
                maxRow = i;
            }
        }

        if (math.smaller(maxValue, math.fraction(1e-10))) {
            resultNoLUDecomp();
            throw new TypeError("Matriks tidak dapat didekomposisi LU. Pivot terlalu kecil.");
        }

        // Swap rows in U and P
        if (maxRow !== k) {
            [U[k], U[maxRow]] = [U[maxRow], U[k]];
            [P[k], P[maxRow]] = [P[maxRow], P[k]];

            // Swap corresponding elements in L (columns up to current step)
            for (let j = 0; j < k; j++) {
                [L[k][j], L[maxRow][j]] = [L[maxRow][j], L[k][j]];
            }
        }

        // Perform Gaussian elimination
        for (let i = k + 1; i < n; i++) {
            const factor = math.divide(U[i][k], U[k][k]);
            L[i][k] = factor; // Ensure L remains as fractions
            for (let j = k; j < n; j++) {
                U[i][j] = math.subtract(U[i][j], math.multiply(factor, U[k][j]));
            }
        }
    }

    // Output matrices in fractions and decimals
    console.log('L (Fraction) =', L.map(row => row.map(value => value.toFraction())));
    console.log('U (Fraction) =', U.map(row => row.map(value => value.toFraction())));
    console.log('L (Decimal) =', L.map(row => row.map(value => value.valueOf())));
    console.log('U (Decimal) =', U.map(row => row.map(value => value.valueOf())));

    triggerModal();
    removeContent('modal-box-content');
    hideHistory();
    resultYesLUDecomp(L, U, P);
    historyLUDecomp(L, U, A);
}

function resultYesLUDecomp(L, U) {
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'LU Decomposition';

    const modalBox = document.querySelector('.modal-box-content');
    modalBox.innerHTML = ''; // Clear previous content

    // Create toggle buttons
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';

    const fractionButton = document.createElement('button');
    fractionButton.textContent = 'Fraction';
    fractionButton.className = 'fraction-toggle active'; // Default active
    fractionButton.onclick = () => updateMatrixDisplay('fraction');

    const decimalButton = document.createElement('button');
    decimalButton.textContent = 'Decimal';
    decimalButton.className = 'decimal-toggle';
    decimalButton.onclick = () => updateMatrixDisplay('decimal');

    toggleContainer.appendChild(fractionButton);
    toggleContainer.appendChild(decimalButton);
    modalBox.appendChild(toggleContainer);

    // Function to update matrix display
    const updateMatrixDisplay = (format) => {
        lTable.innerHTML = '<caption>L</caption>';
        uTable.innerHTML = '<caption>U</caption>';

        const formatValue = (value) =>
            format === 'fraction'
                ? math.isFraction(value) ? value.toFraction() : value
                : math.isFraction(value) ? value.valueOf().toFixed(6) : value.toFixed(6);

        // Update L table
        L.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value);
                tr.appendChild(td);
            });
            lTable.appendChild(tr);
        });

        // Update U table
        U.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value);
                tr.appendChild(td);
            });
            uTable.appendChild(tr);
        });

        // Update active toggle state
        fractionButton.classList.toggle('active', format === 'fraction');
        decimalButton.classList.toggle('active', format === 'decimal');
    };

    // Create L and U tables
    const lTable = document.createElement('table');
    lTable.className = 'lTable';

    const uTable = document.createElement('table');
    uTable.className = 'uTable';

    modalBox.appendChild(lTable);
    modalBox.appendChild(uTable);

    // Initial display as fractions
    updateMatrixDisplay('fraction');
}
