function historyLUDecomp(L, U, P, A) {
    // indeksasi untuk tempat histori perhitungan/tabel
    const containers = document.getElementsByClassName('history-table-container');
    const index = containers.length;

    // hapus 'modal-placeholder-history' class kalau belum dilakukan sebelumnya
    const placeholderParagraph = document.querySelector('.modal-placeholder-history');

    // sebelum menghapus, cek ada-tidaknya unsur
    if (placeholderParagraph) {
        placeholderParagraph.remove(); // Remove the paragraph from the DOM
    }

    // pilih modalBox untuk histori
    const modalBox = document.querySelector('.modal-box-history');

    // bikin div baru untuk tempat tabel di histori
    const historyTableContainer = document.createElement('div');
    historyTableContainer.className = 'history-table-container';

    // bikin paragraf pada tempat tabel di histori
    const containerParagraph = document.createElement('p');
    containerParagraph.className = 'container-bridge';
    containerParagraph.style = 'color:#909090;';
    containerParagraph.textContent = `Perhitungan ${index + 1}: (${getCurrentTimestamp()})`;

    const historyTableDiv = document.createElement('div');
    historyTableDiv.className = 'history-table';

    // tabel P
    const pTable = document.createElement('table');
    pTable.className = 'pTable';
    pTable.innerHTML = '<caption>P</caption>';
    P.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = fraction(value).toFraction(); // Assuming `fraction` is a function to create Fraction objects
            tr.appendChild(td);
        });
        pTable.appendChild(tr);
    });

    // tabel A
    const aTable = document.createElement('table');
    aTable.className = 'aTable';
    aTable.innerHTML = '<caption>A</caption>';
    A.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = fraction(value).toFraction();
            tr.appendChild(td);
        });
        aTable.appendChild(tr);
    });

    // tabel L
    const lTable = document.createElement('table');
    lTable.className = 'lTable';
    lTable.innerHTML = '<caption>L</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = fraction(value).toFraction();
            tr.appendChild(td);
        });
        lTable.appendChild(tr);
    });

    // tabel U
    const uTable = document.createElement('table');
    uTable.className = 'uTable';
    uTable.innerHTML = '<caption>U</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = fraction(value).toFraction();
            tr.appendChild(td);
        });
        uTable.appendChild(tr);
    });

    // tambahkan (ke belakang/append) paragraf dan tabel ke tempat tabel di histori
    historyTableContainer.appendChild(containerParagraph); // paragrafnya
    historyTableContainer.appendChild(historyTableDiv); // div untuk histori dari tabel
    historyTableDiv.appendChild(pTable);
    historyTableDiv.appendChild(aTable);
    historyTableDiv.appendChild(lTable);
    historyTableDiv.appendChild(uTable);

    historyTableDiv.style = 'overflow:auto;max-width:60vw;padding-bottom:1rem;';

    // tambahkan (ke depan/prepend) si tempat tabel di histori ke modal box
    modalBox.prepend(historyTableContainer);
}

function historyCholeskyDecomp(L, A) {
    // Get the container for history tables
    const containers = document.getElementsByClassName('history-table-container');
    const index = containers.length;

    // Remove placeholder if it exists
    const placeholderParagraph = document.querySelector('.modal-placeholder-history');
    if (placeholderParagraph) {
        placeholderParagraph.remove();
    }

    // Select the modal box for history
    const modalBox = document.querySelector('.modal-box-history');

    // Create a new container for the history table
    const historyTableContainer = document.createElement('div');
    historyTableContainer.className = 'history-table-container';

    // Add a paragraph to indicate the computation index and timestamp
    const containerParagraph = document.createElement('p');
    containerParagraph.className = 'container-bridge';
    containerParagraph.style = 'color:#909090;';
    containerParagraph.textContent = `Perhitungan ${index + 1}: (${getCurrentTimestamp()})`;

    const historyTableDiv = document.createElement('div');
    historyTableDiv.className = 'history-table';

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

    // Function to create a table for a given matrix
    const createMatrixTable = (matrix, caption) => {
        const table = document.createElement('table');
        table.innerHTML = `<caption>${caption}</caption>`;
        matrix.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        return table;
    };

    // Generate tables for A, L, and Lᵀ
    const aTable = createMatrixTable(A, 'A');
    const lTable = createMatrixTable(L, 'L');
    const ltTable = createMatrixTable(math.transpose(L), 'Lᵀ'); // Transpose of L

    // Add tables to the history container
    historyTableContainer.appendChild(containerParagraph); // Add the timestamp paragraph
    historyTableContainer.appendChild(historyTableDiv); // Add the div for the history content
    historyTableDiv.appendChild(aTable);
    historyTableDiv.appendChild(lTable);
    historyTableDiv.appendChild(ltTable);

    historyTableDiv.style = 'overflow:auto;max-width:60vw;padding-bottom:1rem;';

    // Add the new history container to the modal box
    modalBox.prepend(historyTableContainer);
}

// Fungsi helper untuk mendapatkan waktu
function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function historyDeterminant(A) {
    // Get the container for history tables
    const containers = document.getElementsByClassName('history-table-container');
    const index = containers.length;

    // Remove placeholder if it exists
    const placeholderParagraph = document.querySelector('.modal-placeholder-history');
    if (placeholderParagraph) {
        placeholderParagraph.remove();
    }

    // Select the modal box for history
    const modalBox = document.querySelector('.modal-box-history');

    // Create a new container for the history table
    const historyTableContainer = document.createElement('div');
    historyTableContainer.className = 'history-table-container';

    // Add a paragraph to indicate the computation index and timestamp
    const containerParagraph = document.createElement('p');
    containerParagraph.className = 'container-bridge';
    containerParagraph.style = 'color:#909090;';
    containerParagraph.textContent = `Perhitungan ${index + 1}: (${getCurrentTimestamp()})`;

    const historyTableDiv = document.createElement('div');
    historyTableDiv.className = 'history-table';

    // Helper function to format matrix values for display
    const formatValue = (value) => {
        if (math.isFraction(value)) value = value.valueOf(); // Convert to decimal if fraction
        if (Number.isInteger(value)) return value.toString(); // Return integers as is

        return value.toFixed(3); // Fallback to decimal representation
    };

    // Function to create a table for a given matrix
    const createMatrixTable = (matrix, caption) => {
        const table = document.createElement('table');
        table.innerHTML = `<caption>${caption}</caption>`;
        matrix.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = formatValue(value);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        return table;
    };

    // Generate table for A
    const aTable = createMatrixTable(A, 'A');

    // Compute and display the determinant
    const determinant = math.det(A); // Calculate determinant
    const determinantParagraph = document.createElement('p');
    determinantParagraph.style = 'margin-top: 1.5rem;';

    // Regular text
    const regularText = document.createTextNode('Determinant of A is ');

    // Bold and red determinant
    const redBoldText = document.createElement('span');
    redBoldText.textContent = Number.isInteger(determinant) ? determinant.toString() : determinant.toFixed(3);
    redBoldText.style.fontWeight = 'bold'; // Make the text bold
    redBoldText.style.color = 'red'; // Set the text color to red

    determinantParagraph.appendChild(regularText);
    determinantParagraph.appendChild(redBoldText);

    // Add table and paragraph to the history container
    historyTableContainer.appendChild(containerParagraph); // Add the timestamp paragraph
    historyTableContainer.appendChild(historyTableDiv); // Add the div for the history content
    historyTableDiv.appendChild(aTable); // Add matrix A
    historyTableDiv.appendChild(determinantParagraph); // Add determinant value

    historyTableDiv.style = 'overflow:auto;max-width:60vw;padding-bottom:1rem;';

    // Add the new history container to the modal box
    modalBox.prepend(historyTableContainer);
}

// Function to get the current timestamp (for reuse)
function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}


