function sol(A, b) {
    // Assume LUdekom is already defined and returns [P, L, U]
    const [P, L, U] = LUdekom(A); // P: Permutation matrix, L: Lower matrix, U: Upper matrix

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

    return x;
}

// Example Usage
const A = [
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2]
];

const b = [8, -11, -3];

// Assuming LUdekom and detr are defined, you can call:
try {
    const solution = sol(A, b);
    console.log("Solution vector x:", solution);
} catch (err) {
    console.error(err.message);
}
