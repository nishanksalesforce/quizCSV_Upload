document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);
document.getElementById('submitQuiz').addEventListener('click', validateQuiz, false);
let correctAnswers = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            const rows = contents.split('\n');
            const quizData = rows.slice(1).map(row => row.split(',')); // Exclude header
            displayQuiz(quizData);
        };
        reader.readAsText(file);
    }
}

function displayQuiz(quizData) {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';
    correctAnswers = [];
    quizData.forEach((row, index) => {
        if (row.length < 5) return; // Ensure there are enough columns
        const questionText = row[0];
        const options = row.slice(1, 5);
        const correctAnswer = row[5].trim();
        correctAnswers.push(correctAnswer);
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Q${index + 1}: ${questionText}`;
        questionDiv.appendChild(questionTitle);
        const optionsList = document.createElement('ul');
        optionsList.className = 'options';
        options.forEach((option, i) => {
            const optionItem = document.createElement('li');
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question${index}`;
            optionInput.value = option.trim();
            optionInput.id = `question${index}_option${i}`;
            const optionLabel = document.createElement('label');
            optionLabel.htmlFor = optionInput.id;
            optionLabel.textContent = option;
            optionItem.appendChild(optionInput);
            optionItem.appendChild(optionLabel);
            optionsList.appendChild(optionItem);
        });
        questionDiv.appendChild(optionsList);
        quizContainer.appendChild(questionDiv);
    });
    document.getElementById('submitQuiz').style.display = 'block';
}

function validateQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    const questions = quizContainer.getElementsByClassName('question');
    let score = 0;
    Array.from(questions).forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption && selectedOption.value === correctAnswers[index]) {
            score++;
        }
    });
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.textContent = `You scored ${score} out of ${questions.length}`;
}
