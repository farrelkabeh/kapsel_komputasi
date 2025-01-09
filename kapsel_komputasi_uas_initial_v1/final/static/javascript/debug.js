// Debug Open Modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'n') {
        const modalBg = document.querySelector('.modal-bg');
        if (modalBg) {
            modalBg.classList.toggle('modal-bg-show');
            setTimeout(function() { // Jeda selama 0.25s - sesuai dengan transition pada style.css untuk show/close modal
                // removeModalContent(); // Menghilangkan setiap konten di dalam div modal-box - terdapat pada result.js
            }, 250);
        }
    }
});

// Debug hilangkan konten dalam modal (menggunakan fungsi "removeContent('...')")
document.addEventListener('keydown', function(event) {
    if (event.key === 'm') {
        removeContent('modal-box-content');
    }
});

// Debug hilangkan history
document.addEventListener('keydown', function(event) {
    if (event.key === '.') {
        removeContent('modal-box-history');
    }
});

// Debug hilangkan konten dalam main-body-content (untuk perpindahan menu dll)
document.addEventListener('keydown', function(event) {
    if (event.key === ',') {
        removeContent('main-body-content');
    }
});

