function generateMatrix() {
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
                    alert('Matrix entry must be numerical.');
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
        LUdekom(A); // fungsi buat LU
    };

    container.appendChild(submitButton);
}

const { fraction } = math;

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
    resultYesLUDecomp(L, U, P, A);
    historyLUDecomp(L, U, P, A);
}

function resultNoLUDecomp() {
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'LU Decomposition';

    const modalBoxes = document.querySelectorAll('.modal-box-content');
    removeContent('modal-box-content');
    modalBoxes.forEach(modalBox => { // perulangan untuk setiap entri
        const newParagraph = document.createElement('p');
        newParagraph.textContent = 'Matriks tidak dapat didekomposisi LU. Ada minor utama terdepan dari matriks yang nol.';
        modalBox.appendChild(newParagraph);
    });
}

function resultYesLUDecomp(L, U, P, A) {
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

    // Function to format matrix values
    const formatValue = (value, format) =>
        format === 'fraction'
            ? math.isFraction(value) ? value.toFraction() : value
            : math.isFraction(value) ? value.valueOf().toFixed(6) : value.toFixed(6);

    // Function to update matrix display
    const updateMatrixDisplay = (format) => {
        pTable.innerHTML = '<caption>P</caption>';
        aTable.innerHTML = '<caption>A</caption>';
        lTable.innerHTML = '<caption>L</caption>';
        uTable.innerHTML = '<caption>U</caption>';

        // Populate P table
        P.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value, format);
                tr.appendChild(td);
            });
            pTable.appendChild(tr);
        });

        // Populate A table
        A.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value, format);
                tr.appendChild(td);
            });
            aTable.appendChild(tr);
        });

        // Populate L table
        L.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value, format);
                tr.appendChild(td);
            });
            lTable.appendChild(tr);
        });

        // Populate U table
        U.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value, format);
                tr.appendChild(td);
            });
            uTable.appendChild(tr);
        });

        // Update active toggle state
        fractionButton.classList.toggle('active', format === 'fraction');
        decimalButton.classList.toggle('active', format === 'decimal');
    };

    // Create P, A, L, and U tables
    const pTable = document.createElement('table');
    pTable.className = 'pTable';

    const aTable = document.createElement('table');
    aTable.className = 'aTable';

    const equalSign = document.createElement('div');
    equalSign.className = 'equal-sign';
    equalSign.textContent = '=';

    const lTable = document.createElement('table');
    lTable.className = 'lTable';

    const uTable = document.createElement('table');
    uTable.className = 'uTable';

    // Append tables and equal sign in the desired order
    modalBox.appendChild(pTable);
    modalBox.appendChild(aTable);
    modalBox.appendChild(equalSign); // Add equal sign
    modalBox.appendChild(lTable);
    modalBox.appendChild(uTable);

    // Initial display as fractions
    updateMatrixDisplay('fraction');
}
