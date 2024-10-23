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

    // Clear all child elements inside each modal-box
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
    const modalBoxes = document.querySelectorAll('.modal-box'); // Use .modal-box
    modalBoxes.forEach(modalBox => { // Loop through each element
        const newParagraph = document.createElement('p');
        newParagraph.textContent = 'Matriks tidak dapat didekomposisi LU. Ada minor utama terdepan dari matriks yang nol.';
        modalBox.appendChild(newParagraph);
    });
}

function resultYesLUDecomp(L,U) {
    // Creating tables for L and U matrices
    const modalBox = document.querySelector('.modal-box');

    // Create L table
    const lTable = document.createElement('table');
    lTable.className = 'lTable'
    lTable.innerHTML = '<caption>L</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction(); // Assuming value.toFraction() gives a string representation
            tr.appendChild(td);
        });
        lTable.appendChild(tr);
    });

    // Create U table
    const uTable = document.createElement('table');
    uTable.className = 'uTable'
    uTable.innerHTML = '<caption>U</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction();
            tr.appendChild(td);
        });
        uTable.appendChild(tr);
    });

    // Append tables to modal box
    modalBox.innerHTML = ''; // Clear previous content if necessary
    modalBox.appendChild(lTable);
    modalBox.appendChild(uTable);
}
