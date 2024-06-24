// Function to save form1 data to localStorage
function saveData() {
    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : '';
    const birthdate = document.getElementById('birthdate').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const goalWeight = document.getElementById('goal-weight').value;

    const formData1 = {
        name: name,
        gender: gender,
        birthdate: birthdate,
        height: height,
        weight: weight,
        goalWeight: goalWeight
    };

    localStorage.setItem('formData1', JSON.stringify(formData1));
}

// Function to load form1 data from localStorage
function loadData() {
    const formData1 = JSON.parse(localStorage.getItem('formData1'));

    if (formData1) {
        document.getElementById('name').value = formData1.name;
        if (formData1.gender) {
            document.getElementById(formData1.gender).checked = true;
        }
        document.getElementById('birthdate').value = formData1.birthdate;
        document.getElementById('height').value = formData1.height;
        document.getElementById('weight').value = formData1.weight;
        document.getElementById('goal-weight').value = formData1.goalWeight;
    }

    const activityData = JSON.parse(localStorage.getItem('activityData'));

    if (activityData) {
        document.getElementById(activityData.activity).checked = true;
    }
}

// Function to save activity data to localStorage
function saveActivity() {
    const selectedActivity = document.querySelector('input[name="activity"]:checked') ? document.querySelector('input[name="activity"]:checked').value : '';

    const activityData = {
        activity: selectedActivity
    };

    localStorage.setItem('activityData', JSON.stringify(activityData));
}

// Function to reset form1 data
function resetForm1() {
    document.getElementById('form1').reset();
    localStorage.removeItem('formData1');
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadData);

// Add event listeners to save and reset buttons
document.getElementById('form1SaveButton').addEventListener('click', saveData);
document.getElementById('form1ResetButton').addEventListener('click', resetForm1);
document.getElementById('activityFormSaveButton').addEventListener('click', saveActivity);
