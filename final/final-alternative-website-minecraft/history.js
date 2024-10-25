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
    // For indexing based on the number of history-table-container
    const containers = document.getElementsByClassName('history-table-container');
    const index = containers.length;

    // Remove the 'modal-placeholder-history' paragraph class (if it hasn't been done before)
    const placeholderParagraph = document.querySelector('.modal-placeholder-history');

    // Check if the element exists before trying to remove it
    if (placeholderParagraph) {
        placeholderParagraph.remove(); // Remove the paragraph from the DOM
    }

    // Selecting the modal box for history
    const modalBox = document.querySelector('.modal-box-history');

    // Create a new div for the history table container
    const historyTableContainer = document.createElement('div');
    historyTableContainer.className = 'history-table-container';

    // Create a paragraph inside the history table container
    const containerParagraph = document.createElement('p');
    containerParagraph.className = 'container-bridge';
    containerParagraph.style = 'color:#909090;';
    containerParagraph.textContent = `Perhitungan ${index + 1}: (${getCurrentTimestamp()})`; 

    // Create a new div for the history table
    const historyTableDiv = document.createElement('div');
    historyTableDiv.className = 'history-table';

    // Create A Table
    const aTable = document.createElement('table');
    aTable.className = 'aTable';
    aTable.innerHTML = '<caption>A</caption>';

    // Convert numeric values in A to Fraction objects and create rows
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

    // Create L table
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

    // Create U table
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

    // Append the paragraph and tables to the history table container
    historyTableContainer.appendChild(containerParagraph); // Append the paragraph
    historyTableContainer.appendChild(historyTableDiv); // Append the history table div
    historyTableDiv.appendChild(aTable);
    historyTableDiv.appendChild(lTable);
    historyTableDiv.appendChild(uTable);

    historyTableDiv.style='overflow:auto;max-width:60vw;padding-bottom:1rem;';

    // Prepend the history table container to the modal box
    modalBox.prepend(historyTableContainer); // Use prepend to add the new container on top
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