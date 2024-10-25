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
    modalBox.innerHTML = ''; // Hapus konten sebelumnya jika ada

    // Tampilkan tabel L dalam bentuk pecahan
    const lTableFrac = document.createElement('table');
    lTableFrac.className = 'lTable';
    lTableFrac.innerHTML = '<caption>L</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction(); // Bentuk pecahan
            tr.appendChild(td);
        });
        lTableFrac.appendChild(tr);
    });

     // Tampilkan tabel U dalam bentuk pecahan
     const uTableFrac = document.createElement('table');
     uTableFrac.className = 'uTable';
     uTableFrac.innerHTML = '<caption>U</caption>';
     U.forEach(row => {
         const tr = document.createElement('tr');
         row.forEach(value => {
             const td = document.createElement('td');
             td.textContent = value.toFraction(); // Bentuk pecahan
             tr.appendChild(td);
         });
         uTableFrac.appendChild(tr);
     });

    // Tampilkan tabel L dalam bentuk desimal
    const lTableDec = document.createElement('table');
    lTableDec.className = 'lTable';
    lTableDec.innerHTML = '<caption>L (Desimal)</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.valueOf().toFixed(4); // Bentuk desimal
            tr.appendChild(td);
        });
        lTableDec.appendChild(tr);
    });

    // Tampilkan tabel U dalam bentuk desimal
    const uTableDec = document.createElement('table');
    uTableDec.className = 'uTable';
    uTableDec.innerHTML = '<caption>U (Desimal)</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.valueOf().toFixed(4); // Bentuk desimal
            tr.appendChild(td);
        });
        uTableDec.appendChild(tr);
    });

   

    

    // Tambahkan tabel ke modalBox
    modalBox.appendChild(lTableFrac);
    modalBox.appendChild(uTableFrac);
    modalBox.appendChild(lTableDec);
    modalBox.appendChild(uTableDec);
}

