// クイズエンジン
var QuizEngine = (function () {
    'use strict';

    var questions = [];
    var currentIndex = 0;
    var score = 0;
    var onComplete = null;
    var answered = false;

    function start(quizData, callback) {
        questions = quizData;
        currentIndex = 0;
        score = 0;
        onComplete = callback;
        answered = false;
        renderQuestion();
        document.getElementById('btn-next-question').addEventListener('click', nextQuestion);
    }

    function renderQuestion() {
        var q = questions[currentIndex];
        answered = false;

        document.getElementById('quiz-progress-text').textContent =
            '問題 ' + (currentIndex + 1) + ' / ' + questions.length;
        document.getElementById('quiz-progress-fill').style.width =
            ((currentIndex / questions.length) * 100) + '%';

        document.getElementById('quiz-question').textContent = q.question;

        var choicesEl = document.getElementById('quiz-choices');
        choicesEl.innerHTML = '';

        q.choices.forEach(function (choice, idx) {
            var btn = document.createElement('div');
            btn.className = 'quiz-choice';
            btn.textContent = choice;
            btn.setAttribute('data-index', idx);
            btn.addEventListener('click', function () {
                selectChoice(idx);
            });
            choicesEl.appendChild(btn);
        });

        document.getElementById('quiz-feedback').style.display = 'none';
        document.getElementById('btn-next-question').style.display = 'none';
    }

    function selectChoice(idx) {
        if (answered) return;
        answered = true;

        var q = questions[currentIndex];
        var correct = q.answer;
        var choices = document.querySelectorAll('.quiz-choice');

        choices.forEach(function (el) {
            el.classList.add('disabled');
            var i = parseInt(el.getAttribute('data-index'), 10);
            if (i === correct) {
                el.classList.add('correct');
            } else if (i === idx) {
                el.classList.add('incorrect');
            }
        });

        var feedback = document.getElementById('quiz-feedback');
        if (idx === correct) {
            score++;
            feedback.className = 'quiz-feedback correct';
            feedback.textContent = '正解です！ ' + q.explanation;
        } else {
            feedback.className = 'quiz-feedback incorrect';
            feedback.textContent = '不正解です。 ' + q.explanation;
        }
        feedback.style.display = '';

        var btnNext = document.getElementById('btn-next-question');
        if (currentIndex < questions.length - 1) {
            btnNext.textContent = '次の問題へ';
        } else {
            btnNext.textContent = '結果を見る';
        }
        btnNext.style.display = '';
    }

    function nextQuestion() {
        currentIndex++;
        if (currentIndex < questions.length) {
            renderQuestion();
        } else {
            if (onComplete) {
                onComplete(score, questions.length);
            }
        }
    }

    return { start: start };
})();
