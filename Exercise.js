document.addEventListener('DOMContentLoaded', (event) => {
    loadExercises();
    showCurrentDate();
});

function showCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = currentDate.toLocaleDateString('ko-KR', options);
}

function addTodayExercise() {
    const table = document.getElementById('today-exercise-list').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    addExerciseRow(row);
}

function addTomorrowExercise() {
    const table = document.getElementById('tomorrow-exercise-list').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    addExerciseRow(row);
}

function addExerciseRow(row, data = {}, editable = true) {
    const exerciseTypeCell = row.insertCell(0);
    const exerciseNameCell = row.insertCell(1);
    const repsCell = row.insertCell(2);
    const setCountCell = row.insertCell(3);
    const timeCell = row.insertCell(4);

    exerciseTypeCell.innerHTML = editable ? `
        <select onchange="toggleOtherInput(this)">
            <option value="헬스">헬스</option>
            <option value="유산소">유산소</option>
            <option value="요가">요가</option>
            <option value="필라테스">필라테스</option>
            <option value="크로스핏">크로스핏</option>
            <option value="기타">기타</option>
        </select>
        <input type="text" class="other-input" style="display:none;" placeholder="직접 입력">
    ` : data.exerciseType || '';
    exerciseNameCell.innerHTML = editable ? `<input type="text" value="${data.exerciseName || ''}">` : data.exerciseName || '';
    repsCell.innerHTML = editable ? `<input type="number" value="${data.reps || ''}">` : data.reps || '';
    setCountCell.innerHTML = editable ? `
        <select>
            ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}" ${data.setCount == i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
        </select>
    ` : data.setCount || '';
    timeCell.innerHTML = editable ? `
        <input type="number" placeholder="시" style="width: 50px;" value="${data.hours || ''}">:<input type="number" placeholder="분" style="width: 50px;" value="${data.minutes || ''}">
    ` : `${data.hours || '0'}시 ${data.minutes || '0'}분`;

    if (editable) {
        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
            <button onclick="saveRow(this)">Save</button>
            <button onclick="deleteRow(this)">Delete</button>
        `;
    }
    row.dataset.exerciseData = JSON.stringify(data);
}

function toggleOtherInput(select) {
    const otherInput = select.nextElementSibling;
    if (select.value === "기타") {
        otherInput.style.display = "inline";
    } else {
        otherInput.style.display = "none";
    }
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);
    saveExercises();
}

function saveRow(button) {
    const row = button.parentElement.parentElement;
    const exerciseType = row.cells[0].querySelector('select') ? row.cells[0].querySelector('select').value : row.cells[0].innerText;
    const otherType = row.cells[0].querySelector('.other-input') ? row.cells[0].querySelector('.other-input').value : '';
    const exerciseName = row.cells[1].querySelector('input') ? row.cells[1].querySelector('input').value : row.cells[1].innerText;
    const reps = row.cells[2].querySelector('input') ? row.cells[2].querySelector('input').value : row.cells[2].innerText;
    const setCount = row.cells[3].querySelector('select') ? row.cells[3].querySelector('select').value : row.cells[3].innerText;
    const hours = row.cells[4].querySelector('input[placeholder="시"]') ? row.cells[4].querySelector('input[placeholder="시"]').value : row.cells[4].innerText.split('시')[0];
    const minutes = row.cells[4].querySelector('input[placeholder="분"]') ? row.cells[4].querySelector('input[placeholder="분"]').value : row.cells[4].innerText.split(' ')[1].split('분')[0];

    const exerciseData = {
        exerciseType: exerciseType,
        otherType: otherType,
        exerciseName: exerciseName,
        reps: reps,
        setCount: setCount,
        hours: hours,
        minutes: minutes
    };

    row.dataset.exerciseData = JSON.stringify(exerciseData);
    saveExercises();
}

function saveExercises() {
    const todayExercises = [];
    document.querySelectorAll('#today-exercise-list tbody tr').forEach(row => {
        if (row.dataset.exerciseData) {
            todayExercises.push(JSON.parse(row.dataset.exerciseData));
        }
    });

    const tomorrowExercises = [];
    document.querySelectorAll('#tomorrow-exercise-list tbody tr').forEach(row => {
        if (row.dataset.exerciseData) {
            tomorrowExercises.push(JSON.parse(row.dataset.exerciseData));
        }
    });

    localStorage.setItem('todayExercises', JSON.stringify(todayExercises));
    localStorage.setItem('tomorrowExercises', JSON.stringify(tomorrowExercises));
}

function loadExercises() {
    const todayExercises = JSON.parse(localStorage.getItem('todayExercises') || '[]');
    const tomorrowExercises = JSON.parse(localStorage.getItem('tomorrowExercises') || '[]');

    todayExercises.forEach(data => {
        const table = document.getElementById('today-exercise-list').getElementsByTagName('tbody')[0];
        const row = table.insertRow();
        addExerciseRow(row, data, false);
    });

    tomorrowExercises.forEach(data => {
        const table = document.getElementById('tomorrow-exercise-list').getElementsByTagName('tbody')[0];
        const row = table.insertRow();
        addExerciseRow(row, data, false);
    });
}

