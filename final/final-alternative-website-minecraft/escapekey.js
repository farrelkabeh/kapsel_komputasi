function closeModalResult() {
    const modalBg = document.querySelector('.modal-bg-show');
    if (modalBg) {
        modalBg.classList.remove('modal-bg-show');
    }
}

function closeModalHistory() {
    const modalBg = document.querySelector('.modal-bg-history-show');
    if (modalBg) {
        modalBg.classList.remove('modal-bg-history-show');
    }
}

// Close modal on Escape key press
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModalResult();
        closeModalHistory();
    }
});
