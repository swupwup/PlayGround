(() => {
  'use strict';

  const STORAGE_KEY = 'drop-count-state-v1';
  const BASE_PROBABILITY = 1 / 137500;
  const $ = (selector) => document.querySelector(selector);
  const list = $('#match-list');
  let toastTimer;
  let state = loadState();
  let editingSetup = false;

  function blankState() {
    return { onboarded: false, historicalMatches: 0, averageChests: 20, initialTotal: 0, multiplier: 1, tokenObtained: false, matches: [] };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== 'object') return blankState();
      const initialTotal = Math.max(0, Number(saved.initialTotal) || 0);
      return {
        onboarded: saved.onboarded === true,
        historicalMatches: Math.max(0, Math.floor(Number(saved.historicalMatches) || 0)),
        averageChests: Math.max(0, Number(saved.averageChests) || 0),
        initialTotal,
        multiplier: [1, 1.5, 2].includes(Number(saved.multiplier)) ? Number(saved.multiplier) : 1,
        tokenObtained: saved.tokenObtained === true,
        matches: Array.isArray(saved.matches) ? saved.matches.map((match, index) => ({
          id: String(match.id || `${Date.now()}-${index}`),
          name: typeof match.name === 'string' && match.name.trim() ? match.name.trim() : `Match ${index + 1}`,
          count: Math.max(0, Math.floor(Number(match.count) || 0))
        })) : []
      };
    } catch (error) {
      return blankState();
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { showToast('Could not save — browser storage may be full.'); }
  }

  function totalChests() {
    return state.initialTotal + state.matches.reduce((total, match) => total + match.count, 0);
  }

  function formatNumber(number) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(number);
  }

  function probabilityPercent() {
    const p = Math.min(BASE_PROBABILITY * state.multiplier, 1);
    const n = totalChests();
    return (1 - Math.exp(n * Math.log1p(-p))) * 100;
  }

  function render() {
    $('#main-content').hidden = !state.onboarded;
    $('#settings-button').hidden = !state.onboarded;
    if (!state.onboarded) {
      openSetup(false);
      return;
    }
    $('#total-count').textContent = formatNumber(totalChests());
    $('#probability').textContent = probabilityPercent().toFixed(5);
    $('#match-summary').textContent = `Across ${state.matches.length} ${state.matches.length === 1 ? 'match' : 'matches'}`;
    $('#match-count').textContent = state.matches.length;
    document.querySelectorAll('.multiplier').forEach((button) => {
      const active = Number(button.dataset.multiplier) === state.multiplier;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${button.dataset.multiplier} times multiplier`);
    });
    list.replaceChildren(...state.matches.map((match, index) => createMatchRow(match, index)));
    $('#empty-state').hidden = state.matches.length > 0;
    $('#token-banner').classList.toggle('won', state.tokenObtained);
    $('#token-title').textContent = state.tokenObtained ? 'Token secured. GG!' : 'Found the Pirate Shop Token?';
    $('#token-copy').textContent = state.tokenObtained ? 'Your win is saved. Your chest log is still here whenever you need it.' : 'Mark your win here. Your chest log stays right where it is.';
    $('#got-token').innerHTML = state.tokenObtained ? '<span>✓</span> I got the Token!' : '<span>✦</span> I got the Token!';
  }

  function createMatchRow(match, index) {
    const row = document.createElement('article');
    row.className = 'match-row';
    const nameWrap = document.createElement('div');
    nameWrap.className = 'match-name-wrap';
    const indexLabel = document.createElement('span');
    indexLabel.className = 'match-index';
    indexLabel.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('input');
    name.className = 'match-name';
    name.type = 'text';
    name.maxLength = 36;
    name.value = match.name;
    name.setAttribute('aria-label', `Match ${index + 1} name`);
    name.addEventListener('change', () => {
      const cleaned = name.value.trim();
      if (!cleaned) {
        name.value = match.name;
        showToast('A match needs a name.');
        return;
      }
      match.name = cleaned;
      save();
      name.value = cleaned;
    });
    name.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') name.blur();
    });
    nameWrap.append(indexLabel, name);

    const count = document.createElement('div');
    count.className = 'match-count';
    count.append(document.createTextNode(formatNumber(match.count)));
    const countLabel = document.createElement('small');
    countLabel.textContent = match.count === 1 ? 'CHEST' : 'CHESTS';
    count.append(countLabel);

    const actions = document.createElement('div');
    actions.className = 'counter-actions';
    const subtract = document.createElement('button');
    subtract.className = 'counter-button';
    subtract.type = 'button';
    subtract.textContent = '−';
    subtract.disabled = match.count === 0;
    subtract.setAttribute('aria-label', `Subtract 2 chests from ${match.name}`);
    subtract.title = 'Subtract 2 chests';
    subtract.addEventListener('click', () => changeCount(match.id, -2));
    const add = document.createElement('button');
    add.className = 'counter-button plus';
    add.type = 'button';
    add.textContent = '+';
    add.setAttribute('aria-label', `Add 1 chest to ${match.name}`);
    add.title = 'Add 1 chest';
    add.addEventListener('click', () => changeCount(match.id, 1));
    actions.append(subtract, add);

    const remove = document.createElement('button');
    remove.className = 'delete-button';
    remove.type = 'button';
    remove.setAttribute('aria-label', `Delete ${match.name}`);
    remove.title = 'Delete match';
    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg>';
    remove.addEventListener('click', () => {
      if (!window.confirm(`Delete “${match.name}” and its ${match.count} chests?`)) return;
      state.matches = state.matches.filter((item) => item.id !== match.id);
      save();
      render();
      showToast('Match deleted. Your estimate has been updated.');
    });
    row.append(nameWrap, count, actions, remove);
    return row;
  }

  function changeCount(id, amount) {
    const match = state.matches.find((item) => item.id === id);
    if (!match) return;
    match.count = Math.max(0, match.count + amount);
    save();
    render();
  }

  function addMatch() {
    const next = state.matches.length + 1;
    state.matches.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: `Match ${next}`, count: 0 });
    save();
    render();
    const lastInput = list.lastElementChild?.querySelector('.match-name');
    lastInput?.focus();
    showToast('New match added. Good luck out there.');
  }

  function openSetup(editing) {
    editingSetup = editing;
    const layer = $('#setup-layer');
    layer.hidden = false;
    $('#close-setup').hidden = !editing;
    $('#setup-eyebrow').textContent = editing ? 'UPDATE YOUR BASELINE' : 'BEFORE YOU DROP';
    $('#setup-title').innerHTML = editing ? 'Tune your<br><span>starting point.</span>' : 'Let’s get your<br><span>loot log started.</span>';
    $('#setup-copy').textContent = editing ? 'Changing these values recalculates your historical chest total and probability. Your match logs stay unchanged.' : 'Add your history to get a more complete estimate from the jump.';
    $('#setup-submit-label').textContent = editing ? 'Save and recalculate' : 'Build my loot log';
    $('#played-matches').value = editing ? state.historicalMatches : 0;
    $('#average-chests').value = editing ? state.averageChests : 20;
    requestAnimationFrame(() => $('#played-matches').focus());
  }

  function closeSetup() {
    if (!state.onboarded) return;
    $('#setup-layer').hidden = true;
  }

  $('#setup-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const matchesPlayed = Number($('#played-matches').value);
    const average = Number($('#average-chests').value);
    if (!Number.isInteger(matchesPlayed) || matchesPlayed < 0 || !Number.isFinite(average) || average < 0) {
      showToast('Enter valid numbers of 0 or greater.');
      return;
    }
    if (editingSetup && !window.confirm('Update your historical chest total? Your probability will be recalculated using these values.')) return;
    state.historicalMatches = matchesPlayed;
    state.averageChests = average;
    state.initialTotal = matchesPlayed * average;
    state.onboarded = true;
    save();
    $('#setup-layer').hidden = true;
    render();
    if (editingSetup) showToast('Historical total and probability recalculated.');
  });

  $('#close-setup').addEventListener('click', closeSetup);
  $('#settings-button').addEventListener('click', () => openSetup(true));
  $('#add-match').addEventListener('click', addMatch);
  $('#empty-add').addEventListener('click', addMatch);
  $('#got-token').addEventListener('click', () => {
    if (state.tokenObtained) {
      showToast('Your Token win is already recorded.');
      return;
    }
    if (!window.confirm('Amazing! Mark the Pirate Shop Token as obtained?')) return;
    state.tokenObtained = true;
    save();
    render();
    showToast('Token obtained — victory logged!');
  });
  document.querySelectorAll('.multiplier').forEach((button) => {
    button.addEventListener('click', () => {
      state.multiplier = Number(button.dataset.multiplier);
      save();
      render();
    });
  });

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  render();
})();
