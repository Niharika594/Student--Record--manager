// Student records array
let students = [];

// Get HTML elements
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");


// Email validation using Regular Expression
function validateEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}


// Display message
function showMessage(text, success = false) {

    message.textContent = text;

    if (success) {
        message.style.color = "green";
    } else {
        message.style.color = "red";
    }
}


// Add student
studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    try {

        const id = document.getElementById("studentId").value.trim();
        const name = document.getElementById("studentName").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const course = document.getElementById("studentCourse").value.trim();
        const age = document.getElementById("studentAge").value.trim();


        // Check empty fields
        if (!id || !name || !email || !course || !age) {
            throw new Error("All fields are required.");
        }


        // Validate email using Regex
        if (!validateEmail(email)) {
            throw new Error("Please enter a valid email address.");
        }


        // Validate age
        const studentAge = Number(age);

        if (studentAge < 15 || studentAge > 100) {
            throw new Error("Age must be between 15 and 100.");
        }


        // Check duplicate student ID
        const duplicate = students.some(student => student.id === id);

        if (duplicate) {
            throw new Error("Student ID already exists.");
        }


        // Create student object
        const student = {
            id: id,
            name: name,
            email: email,
            course: course,
            age: studentAge
        };


        // Add student
        students.push(student);


        // Save data in browser local storage
        localStorage.setItem("students", JSON.stringify(students));


        // Display records
        displayStudents();


        // Clear form
        studentForm.reset();


        showMessage("Student added successfully!", true);

    }

    catch (error) {

        // Exception handling
        showMessage(error.message, false);

    }

});


// Display students
function displayStudents() {

    studentTableBody.innerHTML = "";

    if (students.length === 0) {

        emptyMessage.style.display = "block";
        return;

    }

    emptyMessage.style.display = "none";


    students.forEach(function(student, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.age}</td>
            <td>
                <button class="delete-btn"
                onclick="deleteStudent(${index})">
                Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);

    });

}


// Delete student
function deleteStudent(index) {

    try {

        if (index < 0 || index >= students.length) {
            throw new Error("Invalid student record.");
        }

        students.splice(index, 1);

        localStorage.setItem("students", JSON.stringify(students));

        displayStudents();

        showMessage("Student deleted successfully.", true);

    }

    catch (error) {

        showMessage(error.message, false);

    }

}


// Save student data to JSON file
function saveToFile() {

    try {

        if (students.length === 0) {
            throw new Error("There are no student records to save.");
        }


        const data = JSON.stringify(students, null, 4);

        const blob = new Blob(
            [data],
            { type: "application/json" }
        );


        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "student_records.json";

        link.click();


        URL.revokeObjectURL(url);

        showMessage("Student data saved to file successfully.", true);

    }

    catch (error) {

        showMessage(error.message, false);

    }

}


// Read student data from JSON file
function readFromFile(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }


    const reader = new FileReader();


    reader.onload = function(e) {

        try {

            const data = JSON.parse(e.target.result);


            if (!Array.isArray(data)) {
                throw new Error("Invalid file format.");
            }


            // Validate imported records
            data.forEach(function(student) {

                if (
                    !student.id ||
                    !student.name ||
                    !student.email ||
                    !student.course ||
                    !student.age
                ) {
                    throw new Error("Invalid student data in file.");
                }


                if (!validateEmail(student.email)) {
                    throw new Error(
                        "Invalid email found in imported file."
                    );
                }

            });


            students = data;


            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );


            displayStudents();

            showMessage(
                "Student data loaded successfully.",
                true
            );

        }

        catch (error) {

            showMessage(
                "Error reading file: " + error.message,
                false
            );

        }

    };


    reader.onerror = function() {

        showMessage(
            "Unable to read the selected file.",
            false
        );

    };


    reader.readAsText(file);

}


// Clear all students
function clearAllStudents() {

    try {

        if (students.length === 0) {
            throw new Error("There are no records to clear.");
        }


        students = [];

        localStorage.removeItem("students");

        displayStudents();

        showMessage(
            "All student records have been deleted.",
            true
        );

    }

    catch (error) {

        showMessage(error.message, false);

    }

}


// Load saved data when page opens
function loadStudents() {

    try {

        const savedData = localStorage.getItem("students");

        if (savedData) {

            const data = JSON.parse(savedData);

            if (!Array.isArray(data)) {
                throw new Error("Stored data is invalid.");
            }

            students = data;

        }

        displayStudents();

    }

    catch (error) {

        students = [];

        showMessage(
            "Error loading saved data: " + error.message,
            false
        );

    }

}


// Start application
loadStudents();
