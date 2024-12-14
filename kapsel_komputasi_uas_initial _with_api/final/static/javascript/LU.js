function generateMatrix() {
    const size = parseInt(document.getElementById('size').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = ''; // hapus matriks sebelumnya

    if (size < 2 || size > 5 || isNaN(size)) {
        alert('Ordo matriks harus di antara 2–5.');
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
    submitButton.innerText = 'Hitung';
    submitButton.onclick = function() {
        const A = [];
        let outOfRange = false;

        for (let i = 0; i < size; i++) {
            const row = [];
            const inputs = table.rows[i].getElementsByTagName('input');
            for (let j = 0; j < size; j++) {
                const value = parseFloat(inputs[j].value);
                
                if (isNaN(value)) {
                    alert('Mohon masukkan entri bilangan real pada matriks.');
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
            alert('Nilai entri matriks harus dalam rentang -9999 hingga 9999.');
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
    const L = Array.from({ length: n }, (_, i) => 
        Array.from({ length: n }, (_, j) => (i === j ? fraction(1) : fraction(0)))
    );
    const U = A.map(row => row.map(value => fraction(value)));

    // Mekanika dari teorema LU
    function deter(B, peng = 1) { // Fungsi determinan dengan rekursif (kofaktor)
        const ukuran = B.length;
        if (ukuran === 1) {
            return peng * B[0][0];
        } else {
            let tanda = -1;
            let jawab = 0;
            for (let i = 0; i < ukuran; i++) {
                const boneka = [];
                for (let j = 1; j < ukuran; j++) {
                    const tamb = [];
                    for (let k = 0; k < ukuran; k++) {
                        if (k !== i) {
                            tamb.push(B[j][k]);
                        }
                    }
                    boneka.push(tamb);
                }
                tanda *= -1;
                jawab += peng * tanda * B[0][i] * deter(boneka);
            }
            return jawab;
        }
    }

    function detsub(A) { // Fungsi minor utama terdepan
        const boneka = new Array(A.length).fill(0);
        for (let l = 0; l < A.length; l++) {
            const submatriks = A.slice(0, l + 1).map(row => row.slice(0, l + 1));
            boneka[l] = deter(submatriks);
        }
        return boneka;
    }

    function cekdetsub_lu(X) { // Fungsi untuk memeriksa apakah minor utama terdepan nol atau tidak
        return detsub(X).some(value => value === 0) ? 1 : 0;
    }

    if (cekdetsub_lu(A) === 1) {
        // showResult(); // Mengeluarkan tampilan modal - terdapat pada file result.js
        triggerModal();
        resultNoLUDecomp(); // Fungsi yang memberitahu pengguna bahwa matriks tidak dapat didekomposisi LU - terdapat pada file result.js
        throw new TypeError("Matriks tidak dapat didekomposisi LU. Ada minor utama terdepan dari matriks yang nol.");
    } else {
        for (let k = 0; k < n - 1; k++) {
            for (let i = k + 1; i < n; i++) {
                const faktor = U[i][k].div(U[k][k]);
                L[i][k] = faktor;
                for (let j = k; j < n; j++) {
                    U[i][j] = U[i][j].sub(faktor.mul(U[k][j]));
                }
            }
        }
    }

    // Keluaran dalam bentuk pecahan
    console.log('L =', L.map(row => row.map(value => value.toFraction())));
    console.log('U =', U.map(row => row.map(value => value.toFraction())));

    // Keluaran dalam bentuk desimal
    console.log('L (Desimal) =', L.map(row => row.map(value => value.valueOf())));
    console.log('U (Desimal) =', U.map(row => row.map(value => value.valueOf())));

    console.log(A);
    console.log(L);
    console.log(U);

    triggerModal();
    removeContent('modal-box-content');
    hideHistory();
    resultYesLUDecomp(L,U);
    historyLUDecomp(L, U, A);

    // showResult();
    // resultYesLUDecomp(L, U);
    // historyLUDecomp(L, U, A);
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

function resultYesLUDecomp(L, U) {
    const headerModal = document.querySelector('.modal-box-header');
    headerModal.innerHTML = 'LU Decomposition';

    const modalBox = document.querySelector('.modal-box-content');

    // Fungsi untuk desimal supaya maksimum 3 angka di belakang koma
    function formatNumber(num) {
        const strNum = num.toString();
        const decimalIndex = strNum.indexOf('.');
        if (decimalIndex === -1) {
            return num; // kalau gak desimal ya bilangan bulat saja
        }
        
        const integerPart = strNum.slice(0, decimalIndex);
        const decimalPart = strNum.slice(decimalIndex + 1);

        if (integerPart.length >= 3) {
            // gunakan 3 angka di belakang koma
            return num.toFixed(3);
        } else if (integerPart.length === 2) {
            // kalau bagian bilangan bulat hanya 2 digit maka maksimum hanya 2 desimal
            return num.toFixed(2);
        } else {
            // kalau bagian bilangan bulat hanya 1 digit maka maksimum hanya 1 desimal
            return num.toFixed(1);
        }
    }

    // Tabel L dengan entri pecahan (kalau ada)
    const lTableFrac = document.createElement('table');
    lTableFrac.className = 'lTable';
    lTableFrac.innerHTML = '<caption>L</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction(); // entri pecahan
            tr.appendChild(td);
        });
        lTableFrac.appendChild(tr);
    });

    // Tabel U dengan entri pecahan (kalau ada)
    const uTableFrac = document.createElement('table');
    uTableFrac.className = 'uTable';
    uTableFrac.innerHTML = '<caption>U</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value.toFraction(); // entri pecahan
            tr.appendChild(td);
        });
        uTableFrac.appendChild(tr);
    });

    // Tabel L dengan entri desimal
    const lTableDec = document.createElement('table');
    lTableDec.className = 'lTable';
    lTableDec.innerHTML = '<caption>L (Desimal)</caption>';
    L.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = formatNumber(value.valueOf()); // entri desimal
            td.style = "min-width:4rem;"
            tr.appendChild(td);
        });
        lTableDec.appendChild(tr);
    });

    // Tabel U dengan entri desimal
    const uTableDec = document.createElement('table');
    uTableDec.className = 'uTable';
    uTableDec.innerHTML = '<caption>U (Desimal)</caption>';
    U.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            td.textContent = formatNumber(value.valueOf()); // entri desimal
            td.style = "min-width:4rem;"
            tr.appendChild(td);
        });
        uTableDec.appendChild(tr);
    });

    // tambahkan tabel ke modalBox
    modalBox.appendChild(lTableFrac);
    modalBox.appendChild(uTableFrac);
    modalBox.appendChild(lTableDec);
    modalBox.appendChild(uTableDec);
}