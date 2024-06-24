let routines = JSON.parse(localStorage.getItem('routines')) || {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};
let currentDay = 'monday';
let editMode = false;
let deleteMode = false;

function saveRoutines() {
    localStorage.setItem('routines', JSON.stringify(routines));
    updateExercises();
}

function showRoutine(day) {
    currentDay = day;
    const list = document.getElementById('routine-list');
    list.innerHTML = '';
    routines[day].forEach((routine, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span onclick="toggleExpand(this)">${routine.type} - ${routine.name} - ${routine.count}개 - ${routine.sets}세트 - ${routine.hours}시간 ${routine.minutes}분</span>
            <div class="move-controls">
                <select class="move-select" data-index="${index}">
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                </select>
                <button class="move-button" onclick="moveRoutine(${index}, this.previousElementSibling.value)">이동</button>
            </div>`;
        li.setAttribute('data-index', index);
        list.appendChild(li);
    });
}

function toggleExpand(element) {
    element.parentElement.classList.toggle('expanded');
}

function toggleCustomExercise() {
    const exerciseType = document.getElementById('exercise-type');
    const customExercise = document.getElementById('custom-exercise');
    if (exerciseType.value === '기타') {
        customExercise.style.display = 'block';
    } else {
        customExercise.style.display = 'none';
    }
}

function addRoutine() {
    const type = document.getElementById('exercise-type').value === '기타' ? document.getElementById('custom-exercise').value : document.getElementById('exercise-type').value;
    const name = document.getElementById('exercise-name').value;
    const count = document.getElementById('exercise-count').value;
    const sets = document.getElementById('exercise-sets').value;
    const hours = document.getElementById('exercise-hours').value;
    const minutes = document.getElementById('exercise-minutes').value;
    
    if (type && name && count && sets && (hours || minutes)) {
        const newRoutine = { type, name, count, sets, hours, minutes };
        routines[currentDay].push(newRoutine);
        showRoutine(currentDay);
        saveRoutines();
        document.getElementById('exercise-type').value = '헬스';
        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-count').value = '';
        document.getElementById('exercise-sets').value = '1';
        document.getElementById('exercise-hours').value = '';
        document.getElementById('exercise-minutes').value = '';
        document.getElementById('custom-exercise').style.display = 'none';
    } else {
        alert('모든 항목을 입력하세요.');
    }
}

function enableEditMode() {
    editMode = true;
    deleteMode = false;
    const list = document.getElementById('routine-list');
    const items = list.getElementsByTagName('li');
    for (let item of items) {
        item.onclick = function() {
            if (editMode) {
                const index = item.getAttribute('data-index');
                const routine = routines[currentDay][index];
                document.getElementById('exercise-type').value = routine.type;
                document.getElementById('exercise-name').value = routine.name;
                document.getElementById('exercise-count').value = routine.count;
                document.getElementById('exercise-sets').value = routine.sets;
                document.getElementById('exercise-hours').value = routine.hours;
                document.getElementById('exercise-minutes').value = routine.minutes;
                routines[currentDay].splice(index, 1);
                showRoutine(currentDay);
                saveRoutines();
                item.classList.add('selected');
            }
        };
    }
}

function enableDeleteMode() {
    deleteMode = true;
    editMode = false;
    const list = document.getElementById('routine-list');
    const items = list.getElementsByTagName('li');
    for (let item of items) {
        item.onclick = function() {
            if (deleteMode) {
                const index = item.getAttribute('data-index');
                routines[currentDay].splice(index, 1);
                showRoutine(currentDay);
                saveRoutines();
                item.classList.add('selected');
            }
        };
    }
}

function moveRoutine(index, targetDay) {
    const routine = routines[currentDay].splice(index, 1)[0];
    routines[targetDay].push(routine);
    showRoutine(currentDay);
    saveRoutines();
}

function updateExercises() {
    const today = new Date();
    const todayDay = today.toLocaleDateString('en-us', { weekday: 'long' }).toLowerCase();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowDay = tomorrow.toLocaleDateString('en-us', { weekday: 'long' }).toLowerCase();
    
    localStorage.setItem('todayExercises', JSON.stringify(routines[todayDay]));
    localStorage.setItem('tomorrowExercises', JSON.stringify(routines[tomorrowDay]));
}

// 초기화 시 현재 요일의 루틴을 표시
showRoutine(currentDay);
updateExercises();
