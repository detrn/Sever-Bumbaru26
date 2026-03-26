const STORAGE_KEY = 'a11y_prefs';
let fontStep = 0;

/* --- Panel open/close --- */
function togglePanel() {
    const panel  = document.getElementById('a11y-panel');
    const toggle = document.getElementById('a11y-toggle');
    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
        setTimeout(() => document.addEventListener('click', outsideClick), 0);
    } else {
        document.removeEventListener('click', outsideClick);
    }
}

function outsideClick(e) {
    if (!document.getElementById('a11y-widget').contains(e.target)) {
        document.getElementById('a11y-panel').classList.remove('open');
        document.getElementById('a11y-toggle').setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', outsideClick);
    }
}

/* --- Toggle features --- */
function toggleA11y(feature, btn) {
    const isActive = document.body.classList.toggle(`a11y-${feature}`);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
    savePrefs();
}

/* --- Font size --- */
function changeFont(dir) {
    fontStep = Math.max(-3, Math.min(5, fontStep + dir));
    const pct = 100 + fontStep * 10;
    document.documentElement.style.fontSize = pct + '%';
    document.getElementById('font-val').textContent = pct + '%';
    savePrefs();
}

/* --- Reset --- */
function resetA11y() {
    ['contrast','underline','dyslexia','cursor'].forEach(f => {
        document.body.classList.remove(`a11y-${f}`);
        const btn = document.getElementById(`opt-${f}`);
        if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-pressed','false'); }
    });
    fontStep = 0;
    document.documentElement.style.fontSize = '';
    document.getElementById('font-val').textContent = '100%';
    localStorage.removeItem(STORAGE_KEY);
}

/* --- Persist --- */
function savePrefs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        contrast:  document.body.classList.contains('a11y-contrast'),
        underline: document.body.classList.contains('a11y-underline'),
        dyslexia:  document.body.classList.contains('a11y-dyslexia'),
        cursor:    document.body.classList.contains('a11y-cursor'),
        fontStep
    }));
}

function loadPrefs() {
    try {
        const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!prefs) return;
        ['contrast','underline','dyslexia','cursor'].forEach(f => {
            if (prefs[f]) {
                document.body.classList.add(`a11y-${f}`);
                const btn = document.getElementById(`opt-${f}`);
                if (btn) { btn.classList.add('active'); btn.setAttribute('aria-pressed','true'); }
            }
        });
        if (prefs.fontStep) {
            fontStep = prefs.fontStep;
            const pct = 100 + fontStep * 10;
            document.documentElement.style.fontSize = pct + '%';
            document.getElementById('font-val').textContent = pct + '%';
        }
    } catch(e) {}
}


document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.getElementById('a11y-panel').classList.remove('open');
        document.getElementById('a11y-toggle').setAttribute('aria-expanded','false');
        document.getElementById('a11y-toggle').focus();
    }
});


/* --- Init --- */
loadPrefs();