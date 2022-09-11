window.onload = function () {
            
    app.init();

}

let app = {
    name: undefined,
    applicationContainer: document.getElementById('app'),
    errorContainer: document.getElementById('errors'),
    
    modalHtmlElements: {
        modalNameHTML: `
            <h1 class="modal__title">Quiz</h1>
            <h2 class="modal__subtitle">Witaj w quizie. Podaj swoje imię.</h2>
            <input type="text" id="quizUserName" class="modal__input" value="">
            <button id="quizUserNameButton" class="modal__button">Rozpocznij</button>
        `
    },
    errorMessages: {
        emptyField: 'Pole IMIĘ nie może być puste!',
        wrongChars: 'Wprowadziłeś niedpowiednie znaki!'
    },

    init: function() {
        this.showNameModal();
    },

    showError: function(message) {
        const errors = document.querySelectorAll('#errors .error');
        errors.forEach(el => el.remove());
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error','error-red');
        errorMessage.innerText = message;
        this.errorContainer.append(errorMessage);  
    },

    acceptName: function() {
        const nameInput = document.getElementById('quizUserName').value;
        app.validateName(nameInput);
    },
    validateName: function(name) {
        
        if (name !== undefined) {
            if (name == '') {
                app.showError(app.errorMessages.emptyField);
            } else if (!(/^[A-Za-z]*$/.test(name))) {
                app.showError(app.errorMessages.wrongChars);
            } else {
                this.name = name;
                this.destroyModal();
            }
        }
    },

    showNameModal: function() {
        
        if(this.name === undefined) {
            const nameModal = document.createElement('div');
            nameModal.classList.add('modal','modal__name');
            nameModal.innerHTML = this.modalHtmlElements.modalNameHTML;
            this.applicationContainer.append(nameModal);  

            const acceptNameButton = document.getElementById('quizUserNameButton');
            acceptNameButton.addEventListener("click", this.acceptName );
        }
        
    },
    destroyModal: function() {
        const nameModal = document.querySelector(".modal__name");
        nameModal.remove();
        quiz.showQuestion();
        this.destroyErrors();
    },
    destroyErrors: function() {
        const errors = document.querySelector("#errors .error");
        errors.remove();
    }
}


let quiz = {
    quizHTML: `
    <h2 class="modal__subtitle" id="modalQuestion"></h2>
    <button class="modal__answer" data-answer="1"></button>
    <button class="modal__answer" data-answer="2"></button>
    <button class="modal__answer" data-answer="3"></button>`,
    answersHTML: function(question, answer, questionId) {
        const answerText = quiz.questions[questionId][parseInt(answer)+1];
        

        return `
         <tr>
            <td style="text-align:left;"><span class="modal__summaryQuestion">${question}</span></td>
            <td><span class="modal__summaryAnswer">${answerText}</span></td>
        </tr>
        `
    },
    summaryHTML: function(questionLenght, answersLenght, user) {
        return `
            <h1 class="modal__title">${user}, to już koniec</h1>
            <h2 class="modal__subtitle">Zobacz ponieżej, aby sprawdzić stan swojej wiedzy na dzień dzisiejszy.</h2>
            <br>
            <table class="modal__table" id="modalTable">
                
            </table>
            <br>
            <span class="modal__summaryDesc">Pytań ogółem: ${questionLenght}, Poprawnych odpowiedzi: ${answersLenght}</span>
        `
    },
    
    questions: [
        [0, 'W którym roku Polska odzyskała niepodległość?', '1921','1918','1938', 2],
        [1, 'Kto doprowadził Adolfa Eichmanna pod sąd?', 'Służba Bezpieczeństwa','NKWD','Mossad', 3],
        [2, 'Rewolucja Październikowa była w roku:', '1917','1909','1981', 1],
        [3, 'W którym roku zakończyła się II Wojna Światowa?', '1945','1939','1918', 1],
        [4, 'W którym roku zmarł Józef Piłsudski?', '1929','1935','1939', 2]
    ],
    quizModal: {
        answers: function(id) {
            const answer = document.querySelector('.modal__answer[data-answer='+id+']');
            return answer;
        }
    },
    answers: [],
    countCorrectAnswers: function() {
        let correctAnswers = 0;
        const answers = this.answers;
        const questions = this.questions;

        for( let i = 0; i < answers.length; i++ ) {
            if (answers[i] == questions[i][5]) {
                correctAnswers++;
            }
        }

        return correctAnswers;

    },
    showQuestion: function() {
        const quizModal = document.createElement('div');
        quizModal.classList.add('modal','modal__quiz');
        quizModal.innerHTML = this.quizHTML;
        app.applicationContainer.append(quizModal); 


        if(this.answers.length == 0) {
            this.loadQuestion(0);
            this.chooseAnswer();
        }
    },
    showUserAnswers: function() {
        const answers = this.answers;
        const questions = this.questions;
        const summaryTable = document.getElementById("modalTable");

        for( let i = 0; i < answers.length; i++ ) {
            
            const selectedAnswer = this.answers[i];
            const answerRow = document.createElement('tr');
            answerRow.innerHTML = this.answersHTML(this.questions[i][1], this.answers[i], i);
            if (answers[i] == questions[i][5]) {
                answerRow.classList.add("modal__goodAnswer");
            }
            summaryTable.append(answerRow); 
        }
    },
    showSummary: function() {
        const questionsLength = this.questions.length;
        const correctAnswersLength = this.countCorrectAnswers();
       

        

        const summaryModal = document.createElement('div');
        summaryModal.classList.add('modal','modal__quiz');
        summaryModal.innerHTML = this.summaryHTML(questionsLength, correctAnswersLength, app.name);
        app.applicationContainer.append(summaryModal); 

        this.showUserAnswers();
    },
    chooseAnswer: function() {
        const answerButtons = document.querySelectorAll(".modal__answer");
        answerButtons.forEach(el => {
            el.addEventListener("click", function(){
                quiz.answers.push(el.dataset.answer);
                if(quiz.answers.length < quiz.questions.length) {
                    quiz.loadQuestion(quiz.answers.length);
                } else if(quiz.answers.length == quiz.questions.length) {
                    
                    const questionModal = document.querySelector(".modal__quiz");
                    questionModal.remove();
                    quiz.showSummary();
                } else {
                    console.log("Wystąpił nieoczekiwany błąd!");
                }
                

                
            });
        });
    },
    loadQuestion: function(numer) {
        const questionNum = this.answers.length;
        const answerButtons = document.querySelectorAll(".modal__answer");

        question = document.getElementById('modalQuestion').innerHTML = this.questions[numer][1];

        answerButtons[0].innerText = this.questions[numer][2];
        answerButtons[1].innerText = this.questions[numer][3];
        answerButtons[2].innerText = this.questions[numer][4];
        
       

        
    }
}