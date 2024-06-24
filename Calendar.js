document.addEventListener("DOMContentLoaded", function () {
    const todayButton = document.getElementById('today');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const newNoteButton = document.getElementById('new-note');
    const saveNoteButton = document.getElementById('save-note');
    const deleteNoteButton = document.getElementById('delete-note');
    const noteModal = document.getElementById('note-modal');
    const noteDate = document.getElementById('note-date');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const noteImage = document.getElementById('note-image');
    const noteImagePreview = document.getElementById('note-image-preview');
    const noteList = document.getElementById('note-list');
    const calendar = document.getElementById('calendar');
    const currentDateElement = document.getElementById('currentDate');
    const selectedDateElement = document.getElementById('selectedDate');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const prevImageButton = document.getElementById('prev-image');
    const nextImageButton = document.getElementById('next-image');
    const deleteImageButton = document.getElementById('delete-image');

    let currentDate = new Date();
    let selectedDate = null;
    let notes = {};
    let currentImageIndex = 0;
    let images = [];

    function updateCalendar() {
        calendar.innerHTML = '';
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        currentDateElement.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

        for (let day = new Date(monthStart); day <= monthEnd; day.setDate(day.getDate() + 1)) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day.getDate();
            dayElement.classList.add('day');
            dayElement.dataset.date = day.toISOString().split('T')[0];

            if (day.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('today');
            }

            if (selectedDate && day.toDateString() === selectedDate.toDateString()) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', function () {
                selectedDate = new Date(dayElement.dataset.date);
                selectedDate.setHours(0, 0, 0, 0); // 시간 정보를 제거
                selectedDateElement.textContent = `${selectedDate.getFullYear()}-${('0' + (selectedDate.getMonth() + 1)).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;
                updateNotes();
                updateCalendar();
            });

            calendar.appendChild(dayElement);
        }
    }

    function updateNotes() {
        noteList.innerHTML = '';
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        if (notes[selectedDateString]) {
            notes[selectedDateString].forEach((note, index) => {
                const noteItem = document.createElement('div');
                noteItem.classList.add('note-item');
                noteItem.textContent = note.title;
                noteItem.addEventListener('click', function () {
                    openNoteModal(selectedDateString, index);
                });
                noteList.appendChild(noteItem);
            });
        }
    }

    function openNoteModal(dateString, index) {
        const note = notes[dateString][index];
        noteDate.textContent = dateString;
        noteTitle.value = note.title;
        noteContent.value = note.content;
        images = note.images || [];
        currentImageIndex = 0;
        updateImagePreview();
        noteModal.style.display = 'flex';

        saveNoteButton.onclick = function () {
            saveNote(dateString, index);
        };

        deleteNoteButton.onclick = function () {
            deleteNote(dateString, index);
        };
    }

    function closeNoteModal() {
        noteModal.style.display = 'none';
        noteTitle.value = '';
        noteContent.value = '';
        noteImage.value = '';
        images = [];
        currentImageIndex = 0;
        updateImagePreview();
    }

    function saveNote(dateString, index) {
        const title = noteTitle.value;
        const content = noteContent.value;
        if (title === '' || content === '') {
            alert('제목과 내용을 입력해주세요.');
            return;
        }
        if (!notes[dateString]) {
            notes[dateString] = [];
        }
        notes[dateString][index] = { title, content, images };
        closeNoteModal();
        updateNotes();
    }

    function deleteNote(dateString, index) {
        notes[dateString].splice(index, 1);
        if (notes[dateString].length === 0) {
            delete notes[dateString];
        }
        closeNoteModal();
        updateNotes();
    }

    function handleImageChange(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                images.push(e.target.result);
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    function updateImagePreview() {
        if (images.length > 0) {
            noteImagePreview.src = images[currentImageIndex];
            noteImagePreview.style.display = 'block';
        } else {
            noteImagePreview.style.display = 'none';
        }
    };
    

    function showPrevImage() {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImagePreview();
        }
    }

    function showNextImage() {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateImagePreview();
        }
    }

    function deleteCurrentImage() {
        if (images.length > 0) {
            images.splice(currentImageIndex, 1);
            if (currentImageIndex >= images.length) {
                currentImageIndex = images.length - 1;
            }
            updateImagePreview();
        }
    }

    todayButton.addEventListener('click', function () {
        currentDate = new Date();
        selectedDate = currentDate;
        selectedDate.setHours(0, 0, 0, 0); // 시간 정보 제거
        updateCalendar();
        updateNotes();
    });

    prevMonthButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    newNoteButton.addEventListener('click', function () {
        if (!selectedDate) {
            alert('날짜를 먼저 선택해주세요.');
            return;
        }
        const dateString = selectedDate.toISOString().split('T')[0];
        if (!notes[dateString]) {
            notes[dateString] = [];
        }
        const newNoteIndex = notes[dateString].length;
        notes[dateString].push({ title: '', content: '', images: [] });
        openNoteModal(dateString, newNoteIndex);
    });

    noteImage.addEventListener('change', handleImageChange);
    prevImageButton.addEventListener('click', showPrevImage);
    nextImageButton.addEventListener('click', showNextImage);
    deleteImageButton.addEventListener('click', deleteCurrentImage);
    window.addEventListener('click', function (event) {
        if (event.target === noteModal) {
            closeNoteModal();
        }
    });

    updateCalendar();
});
