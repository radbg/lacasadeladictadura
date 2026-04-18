// ============================================================
//  game.js  —  Lógica principal del juego
// ============================================================

const gameState = {
  currentRoom: 0,
  currentQuestion: 0,
  lives: 3,
  libraryRead: false,
  libraryTimerDone: false,
  score: { correct: 0 }
};

let libraryTimerInterval = null;

const NUMBERED_ROOMS  = ROOMS.filter(r => !r.isTransition);
const TOTAL_QUESTIONS = ROOMS.reduce((s, r) => s + r.questions.length, 0);

// ─── Helpers ─────────────────────────────────────────────────

function getCurrentRoom() { return ROOMS[gameState.currentRoom]; }

function shuffleOptions(question) {
  const opts = [...question.options];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function randomRepression() {
  return REPRESSION_MESSAGES[Math.floor(Math.random() * REPRESSION_MESSAGES.length)];
}

// ─── UI builders ─────────────────────────────────────────────

function progressBarHTML(activeIndex) {
  const cells = Array.from({ length: 6 }, (_, i) => {
    let cls, label;
    if (i < activeIndex)       { cls = 'completed'; label = '✓'; }
    else if (i === activeIndex) { cls = 'current';   label = i + 1; }
    else                        { cls = 'pending';   label = i + 1; }
    return `<div class="progress-cell ${cls}">${label}</div>`;
  });
  return `<div class="progress-bar">${cells.join('')}</div>`;
}

function livesHTML() {
  const icons = Array.from({ length: 3 }, (_, i) =>
    `<span class="${i < gameState.lives ? 'life-full' : 'life-empty'}">${i < gameState.lives ? '█' : '░'}</span>`
  );
  return `<div class="lives">${icons.join('')}</div>`;
}

function questionHTML(question) {
  const shuffled = shuffleOptions(question);
  const room     = getCurrentRoom();
  const letters  = ['A', 'B'];
  const opts = shuffled.map((opt, i) =>
    `<button class="option-btn" onclick="handleAnswer(${opt.correct}, this)">[${letters[i]}] ${opt.text}</button>`
  ).join('');
  return `
    <div class="question-block">
      <div class="question-number">PREGUNTA ${gameState.currentQuestion + 1} / ${room.questions.length}</div>
      <div class="question-text">${question.text}</div>
      <div class="options">${opts}</div>
    </div>`;
}

// ─── Flash ───────────────────────────────────────────────────

function flashRepression(callback) {
  let overlay = document.getElementById('flash-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'flash-overlay';
    document.body.appendChild(overlay);
  }
  overlay.classList.remove('flashing');
  void overlay.offsetWidth; // reflow to restart animation
  overlay.classList.add('flashing');
  setTimeout(() => {
    overlay.classList.remove('flashing');
    if (callback) callback();
  }, 600);
}

function showRepMsg(msg) {
  const old = document.querySelector('.repression-msg');
  if (old) old.remove();
  const div = document.createElement('div');
  div.className = 'repression-msg';
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => { if (div.parentNode) div.remove(); }, 3000);
}

// ─── Screens ─────────────────────────────────────────────────

function renderIntro() {
  document.getElementById('app').innerHTML = `
    <div class="screen intro-screen" style="background-image:url('images/room-0-intro.jpg')">
      <div class="intro-overlay">
        <h1 class="main-title">LA CASA DE LA DICTADURA</h1>
        <p class="subtitle">Estás encerrado. La única salida son las elecciones libres.</p>
        <div class="intro-rules">
          <p>5 poderes públicos, 5 habitaciones capturadas.</p>
          <p>Cada candado se abre solo con conocimiento.</p>
          <p>Tienes <strong>3 vidas</strong> por juego. Piérdelas y no podrás escapar de la dictadura.</p>
          <p>Piensa bien las respuestas.</p>
        </div>
        <div class="room-counter">CUARTO 0 / 6</div>
        <button class="btn-primary" onclick="startGame()">[ ENTRAR ]</button>
      </div>
    </div>`;
}

function renderRoom() {
  const room = getCurrentRoom();
  if (room.isTransition) { renderLibrary(); return; }

  const progIdx = NUMBERED_ROOMS.indexOf(room);
  document.getElementById('app').innerHTML = `
    <div class="screen room-screen" style="background-image:url('${room.image}')">

      <div class="room-top-bar">
        ${progressBarHTML(progIdx)}
        <div class="room-header">
          <div class="room-power">${room.power}</div>
          <div class="room-name">${room.name}</div>
        </div>
      </div>

      <div class="room-scene">
        <p class="room-ambience">"${room.ambience}"</p>
      </div>

      <div class="room-bottom-panel">
        <div class="question-area" id="q-area">
          ${questionHTML(room.questions[gameState.currentQuestion])}
        </div>
        ${livesHTML()}
      </div>

    </div>`;
}

// ─── Library ─────────────────────────────────────────────────

function renderLibrary() {
  const room = getCurrentRoom();
  if (!gameState.libraryRead) {
    document.getElementById('app').innerHTML = `
      <div class="screen room-screen library-bg" style="background-image:url('${room.image}')">

        <div class="room-top-bar">
          <div class="library-label">░░░░░  LA BIBLIOTECA  ░░░░░</div>
        </div>

        <div class="room-scene">
          <p class="room-ambience">"${room.ambience}"</p>
        </div>

        <div class="room-bottom-panel" style="text-align:center">
          <button class="btn-primary" onclick="openBook()">[ ABRIR EL LIBRO ]</button>
        </div>

      </div>`;
  } else {
    renderLibraryQuestions();
  }
}

function openBook() {
  const room = getCurrentRoom();
  document.getElementById('app').innerHTML = `
    <div class="screen room-screen library-bg" style="background-image:url('${room.image}')">
      <div class="room-scene" style="align-items:center;justify-content:center">
        <pre id="book-anim" class="book-anim">     ┌─────────────┐
     │  ▓▓▓▓▓▓▓▓▓ │
     │  UN LIBRO   │
     │  ▓▓▓▓▓▓▓▓▓ │
     └─────────────┘</pre>
      </div>
    </div>`;

  const frames = [
`     ┌─────────────┐
     │  ▓▓▓▓▓▓▓▓▓ │
     │  UN LIBRO   │
     │  ▓▓▓▓▓▓▓▓▓ │
     └─────────────┘`,
`     ┌──────────────────┐
     │ ░░░░░░ │▓▓▓▓▓▓▓▓▓│
     │ ░░░░░░ │ UN LIBRO │
     │ ░░░░░░ │▓▓▓▓▓▓▓▓▓│
     └──────────────────┘`,
`     ┌────────────────────────┐
     │ ░░░░░░░░░░ │▓▓▓▓▓▓▓▓▓▓│
     │ ░░░░░░░░░░ │ UN LIBRO  │
     │ ░░░░░░░░░░ │▓▓▓▓▓▓▓▓▓▓│
     └────────────────────────┘`
  ];

  let f = 0;
  const iv = setInterval(() => {
    f++;
    const el = document.getElementById('book-anim');
    if (el && f < frames.length) el.textContent = frames[f];
    if (f >= frames.length - 1) {
      clearInterval(iv);
      setTimeout(renderLibraryIframe, 500);
    }
  }, 350);
}

function renderLibraryIframe() {
  const room  = getCurrentRoom();
  const total = room.timerSeconds;
  let left    = total;

  document.getElementById('app').innerHTML = `
    <div class="screen room-screen library-bg" style="background-image:url('${room.image}')">

      <div class="room-top-bar">
        <div class="library-label">░░░░░  LA BIBLIOTECA  ░░░░░</div>
      </div>

      <div class="iframe-section">
        <div class="iframe-bar" id="iframe-bar">
          <span class="iframe-bar-label">LEYENDO: quieroelegir.org</span>
          <div class="timer-wrap">
            <div class="timer-fill" id="timer-fill" style="width:0%"></div>
          </div>
          <span id="timer-secs">[${total}s]</span>
        </div>

        <div class="iframe-wrap">
          <iframe id="site-frame" src="${room.iframeUrl}" title="quieroelegir.org"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox">
          </iframe>
          <div class="iframe-fallback" id="iframe-fallback">
            <p>No se pudo cargar quieroelegir.org en este marco.</p>
            <p>Visítala directamente:</p>
            <a href="${room.iframeUrl}" target="_blank" rel="noopener noreferrer">[ ABRIR quieroelegir.org ]</a>
            <p class="fallback-note">El temporizador sigue corriendo.</p>
          </div>
        </div>
      </div>

    </div>`;

  const iframe = document.getElementById('site-frame');
  iframe.addEventListener('load', function () {
    try {
      const doc = this.contentDocument || this.contentWindow.document;
      if (!doc || !doc.body) throw new Error();
    } catch (e) {
      const fb = document.getElementById('iframe-fallback');
      if (fb) fb.classList.add('visible');
    }
  });

  if (libraryTimerInterval) clearInterval(libraryTimerInterval);

  libraryTimerInterval = setInterval(() => {
    left--;
    const fill = document.getElementById('timer-fill');
    const secs = document.getElementById('timer-secs');
    const bar  = document.getElementById('iframe-bar');
    if (fill) fill.style.width = `${((total - left) / total) * 100}%`;
    if (secs) secs.textContent = `[${left}s]`;
    if (left <= 0) {
      clearInterval(libraryTimerInterval);
      libraryTimerInterval = null;
      if (bar) {
        bar.innerHTML = `
          <span class="timer-done">LECTURA COMPLETADA. ✓</span>
          <button class="btn-continue-lib" onclick="closeBook()">[ CERRAR EL LIBRO Y CONTINUAR ]</button>`;
      }
    }
  }, 1000);
}

function closeBook() {
  gameState.libraryRead     = true;
  gameState.libraryTimerDone = true;
  gameState.currentQuestion  = 0;
  renderLibraryQuestions();
}

function renderLibraryQuestions() {
  const room = getCurrentRoom();
  document.getElementById('app').innerHTML = `
    <div class="screen room-screen library-bg" style="background-image:url('${room.image}')">

      <div class="room-top-bar">
        <div class="library-label">░░░░░  LA BIBLIOTECA  ░░░░░</div>
      </div>

      <div class="room-scene">
        <p class="room-ambience">"Has leído el plan. Ahora debes demostrar que lo entendiste. Solo así podrás abrir la última puerta."</p>
      </div>

      <div class="room-bottom-panel">
        <div class="question-area" id="q-area">
          ${questionHTML(room.questions[gameState.currentQuestion])}
        </div>
        ${livesHTML()}
      </div>

    </div>`;
}

// ─── Answer handling ─────────────────────────────────────────

function handleAnswer(isCorrect, btnEl) {
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (isCorrect) {
    btnEl.classList.add('correct');
    gameState.score.correct++;
    showFact();
  } else {
    btnEl.classList.add('wrong');
    gameState.lives--;
    const msg = randomRepression();
    if (gameState.lives <= 0) {
      flashRepression(() => renderGameOver());
    } else {
      flashRepression(() => {
        getCurrentRoom().isTransition ? renderLibraryQuestions() : renderRoom();
        showRepMsg('⚠ HAS PERDIDO UNA VIDA. ' + msg);
      });
    }
  }
}

function showFact() {
  const q    = getCurrentRoom().questions[gameState.currentQuestion];
  const area = document.getElementById('q-area');
  if (!area) return;
  const div = document.createElement('div');
  div.className = 'fact-block';
  div.innerHTML = `
    <div class="fact-label">▶ DATO VERIFICADO</div>
    <div class="fact-text">${q.fact}</div>
    <button class="btn-continue" onclick="nextQuestion()">[ CONTINUAR ]</button>`;
  area.appendChild(div);
}

function nextQuestion() {
  const room = getCurrentRoom();
  gameState.currentQuestion++;
  if (gameState.currentQuestion >= room.questions.length) {
    showDoorOpening();
  } else {
    room.isTransition ? renderLibraryQuestions() : renderRoom();
  }
}

// ─── Door animation ──────────────────────────────────────────

function showDoorOpening() {
  document.getElementById('app').innerHTML = `
    <div class="screen door-screen">
      <div class="door-text">La puerta cruje.</div>
      <div class="door-locks" id="door-locks">
        <span class="lock">█</span>
        <span class="lock">█</span>
        <span class="lock">█</span>
      </div>
      <div class="door-status" id="door-status"></div>
      <div class="door-adv"    id="door-adv"></div>
    </div>`;

  const locks = document.querySelectorAll('.lock');
  let i = 0;
  const iv = setInterval(() => {
    if (i < locks.length) { locks[i].textContent = '░'; locks[i].classList.add('unlocked'); i++; }
    else {
      clearInterval(iv);
      document.getElementById('door-status').textContent = '[CERROJO LIBERADO]';
      document.getElementById('door-adv').textContent    = 'Avanzando...';
      setTimeout(advanceRoom, 1200);
    }
  }, 300);
}

function advanceRoom() {
  gameState.currentRoom++;
  gameState.currentQuestion = 0;
  gameState.currentRoom >= ROOMS.length ? renderVictory() : renderRoom();
}

// ─── Game over ───────────────────────────────────────────────

function renderGameOver() {
  const room = getCurrentRoom();
  const name = room.isTransition ? 'LA BIBLIOTECA' : `${room.power} — ${room.name}`;
  document.getElementById('app').innerHTML = `
    <div class="screen gameover-screen">
      <pre class="gameover-art">
█████████████████████████
█  HAS SIDO DETENIDO    █
█████████████████████████</pre>
      <div class="gameover-info">
        <div>Cuarto: ${name}</div>
        <div>Intentos fallidos: 3</div>
      </div>
      <blockquote class="gameover-quote">
        "En este país, la ignorancia<br>
         es un riesgo que no te puedes<br>
         permitir."
      </blockquote>
      <button class="btn-primary" onclick="retryRoom()">[ COMENZAR DESDE EL INICIO ]</button>
    </div>`;
}

function retryRoom() {
  restartGame();
}

// ─── Victory ─────────────────────────────────────────────────

function renderVictory() {
  document.getElementById('app').innerHTML = `
    <div class="screen victory-screen">
      <pre class="victory-art">
╔══════════════════════════════════╗
║   HAS ESCAPADO DE LA DICTADURA  ║
╚══════════════════════════════════╝</pre>
      <div class="victory-text">
        <p>Atravesaste los 6 poderes capturados<br>del Estado venezolano.</p>
        <p>Conociste el plan.<br>Respondiste con verdad.<br>La última puerta cedió.</p>
        <p>La información es resistencia.<br>Conocer tus derechos es el primer<br>paso para ejercerlos.</p>
      </div>
      <div class="victory-sep">────────────────────────────────────</div>
      <div class="victory-score">Respuestas correctas: ${gameState.score.correct} / ${TOTAL_QUESTIONS}</div>
      <div class="victory-actions">
        <a href="https://radbg.github.io/quieroelegir" target="_blank" rel="noopener noreferrer"
           class="btn-primary btn-victory-link">
          [ CONOCE TUS DERECHOS ELECTORALES ]<br>
          <span class="btn-sub">→ quieroelegir</span>
        </a>
        <button class="btn-secondary" onclick="restartGame()">[ JUGAR OTRA VEZ ]</button>
      </div>
    </div>`;
}

// ─── Init ────────────────────────────────────────────────────

function startGame() {
  Object.assign(gameState, {
    currentRoom: 0, currentQuestion: 0, lives: 3,
    libraryRead: false, libraryTimerDone: false,
    score: { correct: 0 }
  });
  renderRoom();
}

function restartGame() {
  if (libraryTimerInterval) { clearInterval(libraryTimerInterval); libraryTimerInterval = null; }
  Object.assign(gameState, {
    currentRoom: 0, currentQuestion: 0, lives: 3,
    libraryRead: false, libraryTimerDone: false,
    score: { correct: 0 }
  });
  renderIntro();
}

document.addEventListener('DOMContentLoaded', renderIntro);
