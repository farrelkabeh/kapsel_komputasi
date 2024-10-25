// Fungsi untuk history
function showHistory() {
    const modalShow = document.querySelectorAll('.modal-bg-history');

    modalShow.forEach((element) => {
        element.classList.add('modal-bg-history-show');
    });
}

function closeHistory() {
    const modalBg = document.querySelector('.modal-bg-history');
        if (modalBg) {
            modalBg.classList.toggle('modal-bg-history-show');
            setTimeout(function() { // Jeda selama 0.25s - sesuai dengan transition pada style.css untuk show/close modal
                removeModalContent(); // Menghilangkan setiap konten di dalam div modal-box - terdapat pada result.js
            }, 250);
        }
}

function historyLUDecomp(L, U, A) {
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

   
    const aTable = document.createElement('table');
    aTable.className = 'aTable';
    aTable.innerHTML = '<caption>A</caption>';

    // ubah entri numerik di A menjadi pecahan
    A.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            // Convert value to a Fraction object
            const fractionValue = fraction(value); // Assuming `fraction` is a function to create Fraction objects
            td.textContent = fractionValue.toFraction(); // Displaying as a string representation
            tr.appendChild(td);
        });
        aTable.appendChild(tr);
    });

    // matriks L (tabel)
    const lTable = document.createElement('table');
    lTable.className = 'lTable';
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

    // matriks U (tabel)
    const uTable = document.createElement('table');
    uTable.className = 'uTable';
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

    // tambahkan (ke belakang/append) paragraf dan tabel ke tempat tabel di histori
    historyTableContainer.appendChild(containerParagraph); // paragrafnya
    historyTableContainer.appendChild(historyTableDiv); // div untuk histori dari tabel
    historyTableDiv.appendChild(aTable);
    historyTableDiv.appendChild(lTable);
    historyTableDiv.appendChild(uTable);

    historyTableDiv.style='overflow:auto;max-width:60vw;padding-bottom:1rem;';

    // tambahkan (ke depan/prepend) si tempat tabel di histori ke modal box
    modalBox.prepend(historyTableContainer); 
}


function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

// Eventlistener historyButton
document.getElementById("historyButton").addEventListener("click", showHistory);
