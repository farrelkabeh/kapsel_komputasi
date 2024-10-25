// Fungsi untuk menampilkan hasil dari dekomposisi (antara berhasil atau tidak akibat tidak memenuhi syarat dekomposisi LU)
function showResult() {
    const modalShow = document.querySelectorAll('.modal-bg');

    modalShow.forEach((element) => {
        element.classList.add('modal-bg-show');
    });
}

// Fungsi untuk menghilangkan semua elemen pada div modal-box
function removeModalContent() {
    const modalBoxes = document.querySelectorAll('.modal-box');

    // hapus child element di modal box
    modalBoxes.forEach((modalBox) => {
        while (modalBox.firstChild) {
            modalBox.removeChild(modalBox.firstChild);
        }
    });
}

function closeResult() {
    const modalBg = document.querySelector('.modal-bg');
        if (modalBg) {
            modalBg.classList.toggle('modal-bg-show');
            setTimeout(function() { // Jeda selama 0.25s - sesuai dengan transition pada style.css untuk show/close modal
                removeModalContent(); // Menghilangkan setiap konten di dalam div modal-box - terdapat pada result.js
            }, 250);
        }
}

function resultNoLUDecomp() {
    const modalBoxes = document.querySelectorAll('.modal-box');
    modalBoxes.forEach(modalBox => { // perulangan untuk setiap entri
        const newParagraph = document.createElement('p');
        newParagraph.textContent = 'Matriks tidak dapat didekomposisi LU. Ada minor utama terdepan dari matriks yang nol.';
        modalBox.appendChild(newParagraph);
    });
}

function resultYesLUDecomp(L, U) {
    const modalBox = document.querySelector('.modal-box');
    modalBox.innerHTML = ''; // Clear previous content if any

    // Function to format numbers with a maximum of three significant figures
    function formatNumber(num) {
        const strNum = num.toString();
        const decimalIndex = strNum.indexOf('.');
        if (decimalIndex === -1) {
            return num; // No decimal, return as is
        }
        
        const integerPart = strNum.slice(0, decimalIndex);
        const decimalPart = strNum.slice(decimalIndex + 1);

        if (integerPart.length >= 3) {
            // Use fixed 3 decimal places for larger numbers
            return num.toFixed(3);
        } else if (integerPart.length === 2) {
            // Up to 2 decimal places if the integer part has 2 digits
            return num.toFixed(2);
        } else {
            // Up to 1 decimal place if the integer part has 1 digit
            return num.toFixed(1);
        }
    }

    // Display L table in fraction form
    const lTableFrac = document.createElement('table');
    lTableFrac.className = 'lTable';
    lTableFrac.innerHTML = '<caption>L</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction(); // Fraction form
            tr.appendChild(td);
        });
        lTableFrac.appendChild(tr);
    });

    // Display U table in fraction form
    const uTableFrac = document.createElement('table');
    uTableFrac.className = 'uTable';
    uTableFrac.innerHTML = '<caption>U</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction(); // Fraction form
            tr.appendChild(td);
        });
        uTableFrac.appendChild(tr);
    });

    // Display L table in decimal form
    const lTableDec = document.createElement('table');
    lTableDec.className = 'lTable';
    lTableDec.innerHTML = '<caption>L (Desimal)</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = formatNumber(value.valueOf()); // Decimal form
            td.style = "min-width:4rem;"
            tr.appendChild(td);
        });
        lTableDec.appendChild(tr);
    });

    // Display U table in decimal form
    const uTableDec = document.createElement('table');
    uTableDec.className = 'uTable';
    uTableDec.innerHTML = '<caption>U (Desimal)</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = formatNumber(value.valueOf()); // Decimal form
            td.style = "min-width:4rem;"
            tr.appendChild(td);
        });
        uTableDec.appendChild(tr);
    });

    // Add tables to modalBox
    modalBox.appendChild(lTableFrac);
    modalBox.appendChild(uTableFrac);
    modalBox.appendChild(lTableDec);
    modalBox.appendChild(uTableDec);
}

