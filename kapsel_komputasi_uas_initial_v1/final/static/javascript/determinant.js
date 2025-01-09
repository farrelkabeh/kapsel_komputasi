function generateMatrixDeterminant() {
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
        Determ(A);
    };

    container.appendChild(submitButton);
}

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

function Determ(A) {
    triggerModal();
    removeContent('modal-box-content');
    hideHistory();
    resultYesDeterminant(A);
    historyDeterminant(A);
}

function resultYesDeterminant(A) {
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'Determinant';

    const modalBox = document.querySelector('.modal-box-content');
    modalBox.innerHTML = ''; // Clear previous content

    // Helper function to format matrix values for display
    const formatValue = (value) => {
        if (math.isFraction(value)) value = value.valueOf(); // Convert to decimal if fraction
        if (Number.isInteger(value)) return value.toString(); // Return integers as is

        return value.toFixed(3); // Fallback to decimal representation
    };

    // Function to format the matrix with the helper function
    const formatMatrix = (matrix) =>
        matrix.map(row => row.map(value => formatValue(value)));

    // Create a container div for layout
    const container = document.createElement('div');
    container.className = 'history-container';
    container.style.display = 'flex'; // Use flexbox for side-by-side layout
    container.style.justifyContent = 'center'; // Center elements horizontally
    container.style.alignItems = 'center'; // Center elements vertically
    container.style.gap = '20px'; // Add space between the table and the paragraph
    container.style.width = '75%';

    // Create table for matrix A
    const aTable = document.createElement('table');
    aTable.className = 'aTable';
    aTable.innerHTML = '<caption>A</caption>';

    // Populate A table with values
    formatMatrix(A).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        aTable.appendChild(tr);
    });

    // Add a paragraph below the matrix table displaying the determinant
    const determinantParagraph = document.createElement('p');
    
    // Create the regular part of the text
    const regularText = document.createTextNode('Determinant of A is ');

    // Get the determinant result
    const determinantResult = math.det(A);

    // Create the bold and red part for the determinant
    const redBoldText = document.createElement('div');
    redBoldText.textContent = Number.isInteger(determinantResult) 
        ? determinantResult.toString() // Display as integer if it's a whole number
        : determinantResult.toFixed(3); // Otherwise, display with 3 decimal places
    redBoldText.style.fontWeight = 'bold'; // Make the text bold
    redBoldText.style.color = 'red'; // Set the text color to red

    // Add the margin
    determinantParagraph.style.marginTop = '1.5rem';

    // Append the regular text and the red bold text to the paragraph
    determinantParagraph.appendChild(regularText);
    determinantParagraph.appendChild(redBoldText);

    // Append table and paragraph to the container
    container.appendChild(aTable);
    container.appendChild(determinantParagraph);

    // Append the container to the modal box
    modalBox.appendChild(container);
}



