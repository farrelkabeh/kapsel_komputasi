// Determinant function
function detr(A, p = 1) {
    const n = A.length;
    
    if (n === 1) {
        return p * A[0][0];
    } else {
        let tanda = -1;
        let hasil = 0;
        
        for (let i = 0; i < n; i++) {
            // Create the submatrix excluding row 0 and column i
            const sub_M = [];
            for (let j = 1; j < n; j++) {
                const sub_B = [];
                for (let k = 0; k < n; k++) {
                    if (k !== i) {
                        sub_B.push(A[j][k]);
                    }
                }
                sub_M.push(sub_B);
            }
            
            tanda = -tanda;
            const koef = A[0][i]; // Element from the first row and i-th column
            const minor = detr(sub_M, tanda * koef); // Recursive call
            hasil += p * minor;
        }
        
        return hasil;
    }
}
