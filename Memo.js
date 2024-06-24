document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('note-list');
    const newNoteButton = document.getElementById('new-note');
    const noteModal = document.getElementById('note-modal');
    const noteContent = document.getElementById('note-content');
    const noteTitle = document.getElementById('note-title');
    const noteDate = document.getElementById('note-date');
    const noteImageInput = document.getElementById('note-image');
    const noteImagePreview = document.getElementById('note-image-preview');
    const prevImageButton = document.getElementById('prev-image');
    const nextImageButton = document.getElementById('next-image');
    const deleteImageButton = document.getElementById('delete-image');
    const saveNoteButton = document.getElementById('save-note');
    const deleteNoteButton = document.getElementById('delete-note');
    const searchInput = document.getElementById('search');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteIndex = null;
    let currentImageIndex = 0;
    let images = [];

    const renderNotes = (filter = '') => {
        noteList.innerHTML = '';
        notes
            .filter(note => note.content.includes(filter) || note.title.includes(filter))
            .forEach((note, index) => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note';
                noteElement.innerHTML = `
                    <div class="note-date">${note.date}</div>
                    <div class="note-title">${note.title}</div>
                    <div class="note-content">${note.content}</div>
                    ${note.images && note.images.length > 0 ? `<img src="${note.images[0]}" alt="Note Image">` : ''}
                `;
                noteElement.addEventListener('click', () => openNoteModal(index));
                noteList.appendChild(noteElement);
            });
    };

    const openNoteModal = (index = null) => {
        currentNoteIndex = index;
        images = [];
        currentImageIndex = 0;
        if (index !== null) {
            const note = notes[index];
            noteContent.value = note.content;
            noteTitle.value = note.title;
            noteDate.innerHTML = note.date;
            images = note.images || [];
            updateImagePreview();
        } else {
            noteContent.value = '';
            noteTitle.value = '';
            noteDate.innerHTML = new Date().toISOString().split('T')[0];
            noteImagePreview.style.display = 'none';
        }
        noteModal.style.display = 'block';
    };

    const updateImagePreview = () => {
        if (images.length > 0) {
            noteImagePreview.src = images[currentImageIndex];
            noteImagePreview.style.display = 'block';
        } else {
            noteImagePreview.style.display = 'none';
        }
    };

    const closeNoteModal = () => {
        noteModal.style.display = 'none';
        currentNoteIndex = null;
    };

    const saveNote = () => {
        const note = {
            date: new Date().toISOString().split('T')[0],
            title: noteTitle.value,
            content: noteContent.value,
            images: images
        };

        if (currentNoteIndex !== null) {
            notes[currentNoteIndex] = note;
        } else {
            notes.push(note);
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        closeNoteModal();
    };

    const deleteNote = () => {
        if (currentNoteIndex !== null) {
            notes.splice(currentNoteIndex, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            closeNoteModal();
        }
    };

    noteImageInput.addEventListener('change', (event) => {
        const files = event.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                images.push(e.target.result);
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    prevImageButton.addEventListener('click', () => {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImagePreview();
        }
    });

    nextImageButton.addEventListener('click', () => {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateImagePreview();
        }
    });

    deleteImageButton.addEventListener('click', () => {
        if (images.length > 0) {
            images.splice(currentImageIndex, 1);
            if (currentImageIndex >= images.length) {
                currentImageIndex = images.length - 1;
            }
            updateImagePreview();
        }
    });

    saveNoteButton.addEventListener('click', saveNote);
    deleteNoteButton.addEventListener('click', deleteNote);
    newNoteButton.addEventListener('click', () => openNoteModal());
    noteModal.addEventListener('click', (event) => {
        if (event.target === noteModal) {
            closeNoteModal();
        }
    });
    searchInput.addEventListener('input', (event) => {
        renderNotes(event.target.value);
    });

    renderNotes();
});
