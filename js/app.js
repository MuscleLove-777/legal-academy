// 契約書・法務基礎 Academy - メインアプリケーション
(function () {
    'use strict';

    const STORAGE_PREFIX = 'legal-';
    const TOTAL_LEVELS = 12;

    const levelDataMap = {
        1: level1Data,
        2: level2Data,
        3: level3Data,
        4: level4Data,
        5: level5Data,
        6: level6Data,
        7: level7Data,
        8: level8Data,
        9: level9Data,
        10: level10Data,
        11: level11Data,
        12: level12Data
    };

    // DOM要素
    const sections = {
        dashboard: document.getElementById('dashboard'),
        learning: document.getElementById('learning'),
        quiz: document.getElementById('quiz'),
        result: document.getElementById('result')
    };

    let currentLevel = null;

    // 初期化
    function init() {
        renderLevels();
        updateStats();
        bindEvents();
    }

    // イベントバインド
    function bindEvents() {
        document.getElementById('btn-back').addEventListener('click', showDashboard);
        document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
        document.getElementById('btn-retry').addEventListener('click', retryQuiz);
        document.getElementById('btn-dashboard').addEventListener('click', showDashboard);
    }

    // セクション表示切替
    function showSection(name) {
        Object.keys(sections).forEach(function (key) {
            sections[key].style.display = key === name ? '' : 'none';
        });
        window.scrollTo(0, 0);
    }

    // ダッシュボード表示
    function showDashboard() {
        currentLevel = null;
        showSection('dashboard');
        renderLevels();
        updateStats();
    }

    // レベルカード描画
    function renderLevels() {
        var grid = document.getElementById('levels-grid');
        grid.innerHTML = '';

        for (var i = 1; i <= TOTAL_LEVELS; i++) {
            var data = levelDataMap[i];
            var score = getScore(i);
            var card = document.createElement('div');
            card.className = 'level-card' + (score !== null ? ' completed' : '');
            card.setAttribute('data-level', i);

            var statusHtml = '';
            if (score !== null) {
                statusHtml = '<span class="badge badge-completed">完了</span><span class="badge badge-score">' + score + '%</span>';
            } else {
                statusHtml = '<span class="badge badge-not-started">未着手</span>';
            }

            card.innerHTML =
                '<div class="level-number">Level ' + i + '</div>' +
                '<div class="level-title">' + data.title + '</div>' +
                '<div class="level-desc">' + data.description + '</div>' +
                '<div class="level-status">' + statusHtml + '</div>';

            card.addEventListener('click', (function (level) {
                return function () { openLevel(level); };
            })(i));

            grid.appendChild(card);
        }
    }

    // 統計更新
    function updateStats() {
        var completed = 0;
        var totalScore = 0;

        for (var i = 1; i <= TOTAL_LEVELS; i++) {
            var score = getScore(i);
            if (score !== null) {
                completed++;
                totalScore += score;
            }
        }

        document.getElementById('stat-completed').textContent = completed;
        var avg = completed > 0 ? Math.round(totalScore / completed) : 0;
        document.getElementById('stat-score').textContent = avg + '%';

        var pct = Math.round((completed / TOTAL_LEVELS) * 100);
        document.getElementById('header-progress-text').textContent = pct + '% 完了';
        document.getElementById('header-progress-fill').style.width = pct + '%';
    }

    // レベルを開く
    function openLevel(level) {
        currentLevel = level;
        var data = levelDataMap[level];
        document.getElementById('learning-title').textContent = 'Level ' + level + ': ' + data.title;
        document.getElementById('learning-content').innerHTML = data.content;
        showSection('learning');
    }

    // クイズ開始
    function startQuiz() {
        if (!currentLevel) return;
        var data = levelDataMap[currentLevel];
        document.getElementById('quiz-title').textContent = 'Level ' + currentLevel + ': ' + data.title + ' - クイズ';
        QuizEngine.start(data.quiz, onQuizComplete);
        showSection('quiz');
    }

    // クイズ完了コールバック
    function onQuizComplete(score, total) {
        var pct = Math.round((score / total) * 100);
        saveScore(currentLevel, pct);

        document.getElementById('result-score').textContent = pct + '%';
        document.getElementById('result-detail').textContent =
            total + '問中' + score + '問正解しました。';
        showSection('result');
    }

    // リトライ
    function retryQuiz() {
        startQuiz();
    }

    // スコア保存・取得
    function saveScore(level, score) {
        var prev = getScore(level);
        if (prev === null || score > prev) {
            localStorage.setItem(STORAGE_PREFIX + 'level' + level, score);
        }
    }

    function getScore(level) {
        var val = localStorage.getItem(STORAGE_PREFIX + 'level' + level);
        return val !== null ? parseInt(val, 10) : null;
    }

    // DOM準備後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
