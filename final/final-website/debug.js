document.addEventListener('keydown', function(event) {
    if (event.key === 'n') {
        const modalBg = document.querySelector('.modal-bg');
        if (modalBg) {
            modalBg.classList.toggle('modal-bg-show');
            setTimeout(function() { // Jeda selama 0.25s - sesuai dengan transition pada style.css untuk show/close modal
                removeModalContent(); // Menghilangkan setiap konten di dalam div modal-box - terdapat pada result.js
            }, 250);
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'm') {
        const modalBg = document.querySelector('.modal-bg-history');
        if (modalBg) {
            modalBg.classList.toggle('modal-bg-history-show');
            setTimeout(function() { // Jeda selama 0.25s - sesuai dengan transition pada style.css untuk show/close modal
                removeModalContent(); // Menghilangkan setiap konten di dalam div modal-box - terdapat pada result.js
            }, 250);
        }
    }
});
