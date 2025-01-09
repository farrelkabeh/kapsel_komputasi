function generateMatrixSystemsDecomp() {
    const size = parseInt(document.getElementById('size').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = ''; // Clear previous system inputs

    if (size < 2 || size > 5 || isNaN(size)) {
        alert('Ordo matriks harus di antara 2–5.');
        return;
    }

    // Create a container for the system
    const systemTable = document.createElement('div');
    systemTable.style.display = 'flex';
    systemTable.style.alignItems = 'center';
    systemTable.style.gap = '1rem';

    // Create matrix A table
    const tableA = document.createElement('table');
    tableA.style.borderCollapse = 'collapse';

    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            // input.style.width = '50px';

            // Input validation for real numbers
            input.oninput = function () {
                this.value = this.value.replace(/[^0-9.-]/g, ''); // Allow only numbers, minus, and decimal
                if (this.value.split('.').length > 2) this.value = this.value.slice(0, -1); // One decimal point
                if (this.value.indexOf('-') > 0) this.value = this.value.replace('-', ''); // Minus only at start
            };

            cell.appendChild(input);
            row.appendChild(cell);
        }
        tableA.appendChild(row);
    }

    // Create variable labels (x₁, x₂, ..., xₙ with subscripts)
    const variables = document.createElement('div');
    variables.style.display = 'flex';
    variables.style.flexDirection = 'column'
    variables.style.justifyContent = 'space-between'; // Ensure the variables are evenly spaced
    variables.style.flexGrow = '1'; // Allow the container to grow
    variables.style.gap = '0.75rem'; // Space between variable labels

    for (let i = 0; i < size; i++) {
        const variable = document.createElement('span');
        variable.innerHTML = `x<sub>${i + 1}</sub>`; // LaTeX-like variable with subscript
        variable.style.margin = '5px 0';
        variables.appendChild(variable);
    }

    // Equal sign
    const equalSign = document.createElement('div');
    equalSign.textContent = '=';
    equalSign.style.fontSize = '1.5rem';
    equalSign.style.margin = '0 1rem';

    // Create vector b table
    const tableB = document.createElement('table');
    tableB.style.borderCollapse = 'collapse';

    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        // input.style.width = '50px';

        // Input validation for real numbers
        input.oninput = function () {
            this.value = this.value.replace(/[^0-9.-]/g, ''); // Allow only numbers, minus, and decimal
            if (this.value.split('.').length > 2) this.value = this.value.slice(0, -1); // One decimal point
            if (this.value.indexOf('-') > 0) this.value = this.value.replace('-', ''); // Minus only at start
        };

        cell.appendChild(input);
        row.appendChild(cell);
        tableB.appendChild(row);
    }

    // Append matrix A, variables, equal sign, and vector b
    systemTable.appendChild(tableA);
    systemTable.appendChild(variables);
    systemTable.appendChild(equalSign);
    systemTable.appendChild(tableB);

    // Append the system table to the container
    container.appendChild(systemTable);

    // Create the "Hitung" button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Hitung';
    submitButton.style.marginTop = '1rem';
    submitButton.onclick = function () {
        const A = [];
        const b = [];
        let outOfRange = false;

        // Read matrix A
        for (let i = 0; i < size; i++) {
            const row = [];
            const inputs = tableA.rows[i].getElementsByTagName('input');
            for (let j = 0; j < size; j++) {
                const value = parseFloat(inputs[j].value);
                if (isNaN(value)) {
                    alert('Mohon masukkan entri bilangan real pada matriks A.');
                    return;
                }
                if (value > 9999 || value < -9999) outOfRange = true;
                row.push(value);
            }
            A.push(row);
        }

        // Read vector b
        const inputsB = tableB.getElementsByTagName('input');
        for (let i = 0; i < size; i++) {
            const value = parseFloat(inputsB[i].value);
            if (isNaN(value)) {
                alert('Mohon masukkan entri bilangan real pada vektor b.');
                return;
            }
            if (value > 9999 || value < -9999) outOfRange = true;
            b.push(value);
        }

        // Warning if any value is out of range
        if (outOfRange) {
            alert('Nilai entri matriks atau vektor harus dalam rentang -9999 hingga 9999.');
            return;
        }

        console.log('Matrix A:', A);
        console.log('Vector b:', b);

        sol(A,b);

        // Call the LU decomposition function or solver
        // console.log(sol(A,b));
        // LUsolve(A, b); // Replace with your solving function
    };

    container.appendChild(submitButton);
}

function LUdekom1(A) {
    const n = A.length;

    // Helper: Create identity matrix
    const identity = n => Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
    );

    let P = identity(n); // Pivot matrix
    let L = identity(n); // Lower triangular matrix
    let U = A.map(row => row.slice()); // Copy of matrix A as floating-point numbers

    for (let k = 0; k < n - 1; k++) {
        // Find the pivot row
        let maxRow = k;
        let maxValue = Math.abs(U[k][k]);

        for (let i = k + 1; i < n; i++) {
            if (Math.abs(U[i][k]) > maxValue) {
                maxValue = Math.abs(U[i][k]);
                maxRow = i;
            }
        }

        if (maxValue < 1e-10) {
            throw new TypeError("Matrix cannot be decomposed into LU. Pivot is too small.");
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
            const factor = U[i][k] / U[k][k];
            L[i][k] = factor;
            for (let j = k; j < n; j++) {
                U[i][j] -= factor * U[k][j];
            }
        }
    }

    // Output matrices as floating-point arrays
    console.log('P:', P);
    console.log('L:', L);
    console.log('U:', U);

    return { P, L, U };
}


function sol(A, b) {
    // Assume LUdekom is already defined and returns [P, L, U]
    const {P, L, U} = LUdekom1(A); // P: Permutation matrix, L: Lower matrix, U: Upper matrix

    // Calculate Pb (P * b)
    const Pb = P.map(row => row.reduce((sum, value, colIndex) => sum + value * b[colIndex], 0));

    // Check if determinant of U is zero (indicating a singular matrix)
    if (detr(U, 0) === 1) {
        throw new TypeError('Computation stopped. Zero pivot found.');
    }

    const n = A.length;
    const x = Array(n).fill(0); // Solution vector
    const y = Array(n).fill(0); // Intermediate vector

    // Forward substitution to solve L * y = Pb
    y[0] = Pb[0] / L[0][0];
    for (let i = 1; i < n; i++) {
        let nilai_F = 0;
        for (let j = 0; j < i; j++) {
            nilai_F += L[i][j] * y[j];
        }
        y[i] = (Pb[i] - nilai_F) / L[i][i];
    }

    // Backward substitution to solve U * x = y
    x[n - 1] = y[n - 1] / U[n - 1][n - 1];
    for (let i = n - 2; i >= 0; i--) {
        let nilai_B = 0;
        for (let j = i + 1; j < n; j++) {
            nilai_B += U[i][j] * x[j];
        }
        x[i] = (y[i] - nilai_B) / U[i][i];
    }

    console.log(x);
    return x;
}

