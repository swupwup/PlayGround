(() => {
  'use strict';

  const STORAGE_KEY = 'drop-count-state-v1';
  const LANGUAGE_KEY = 'drop-count-language-v1';
  const BASE_PROBABILITY = 1 / 137500;
  const $ = (selector) => document.querySelector(selector);
  const list = $('#match-list');

  const translations = {
    en: {
      languageLabel: 'Language',
      savedDevice: 'SAVED ON THIS DEVICE',
      lootLog: 'YOUR LOOT LOG',
      headline: 'Every chest<br><span>counts.</span>',
      introCopy: 'Keep your runs in check. See how the odds stack up.',
      seasonToken: 'THE PIRATE<br>SHOP TOKEN',
      statsLabel: 'Chest and probability statistics',
      totalChests: 'TOTAL CHESTS OPENED',
      estimatedChance: 'ESTIMATED CHANCE',
      unofficial: 'UNOFFICIAL',
      atLeastToken: 'At least one token',
      dropRateBoost: 'DROP RATE BOOST',
      probabilityMultiplier: 'Probability multiplier',
      fieldNotes: 'FIELD NOTES',
      yourMatches: 'Your matches',
      newMatch: 'New match',
      noMatches: 'No matches yet',
      emptyCopy: 'Create a match to start logging your chest openings.',
      createFirst: 'Create first match',
      bigOne: 'THE BIG ONE',
      tokenTitle: 'Found the Pirate Shop Token?',
      tokenCopy: 'Mark your win here. Your chest log stays right where it is.',
      gotToken: 'I got the Token!',
      disclaimer: 'Orientative estimate based on unofficial data; it does not guarantee the Token.',
      baseOdds: 'Base odds: 1 in 137,500 per chest',
      closeSettings: 'Close settings',
      setup: 'SETUP',
      beforeYouDrop: 'BEFORE YOU DROP',
      updateBaseline: 'UPDATE YOUR BASELINE',
      setupTitle: 'Let’s get your<br><span>loot log started.</span>',
      setupTitleEdit: 'Tune your<br><span>starting point.</span>',
      setupCopy: 'Add your history to get a more complete estimate from the jump.',
      setupCopyEdit: 'Changing these values recalculates your historical chest total and probability. Your match logs stay unchanged.',
      matchesPlayed: 'Matches already played',
      matchesUnit: 'MATCHES',
      averageChests: 'Average chests per match',
      chestsUnit: 'CHESTS',
      setupHint: 'Your historical total is calculated as matches × average chests.',
      buildLog: 'Build my loot log',
      saveAndRecalculate: 'Save and recalculate',
      setupPrivacy: 'Your progress is saved privately in this browser.',
      chestSingular: 'CHEST',
      chestPlural: 'CHESTS',
      matchOne: 'match',
      matchMany: 'matches',
      across: 'Across {n} {unit}',
      multiplierButton: '{value} times multiplier',
      matchName: 'Match {n} name',
      matchDefaultName: 'Match {n}',
      subtract: 'Subtract 2 chests from {name}',
      subtractTitle: 'Subtract 2 chests',
      add: 'Add 1 chest to {name}',
      addTitle: 'Add 1 chest',
      delete: 'Delete {name}',
      deleteTitle: 'Delete match',
      deleteConfirm: 'Delete “{name}” and its {count} chests?',
      matchDeleted: 'Match deleted. Your estimate has been updated.',
      matchRequired: 'A match needs a name.',
      newAdded: 'New match added. Good luck out there.',
      invalidNumbers: 'Enter valid numbers of 0 or greater.',
      confirmUpdate: 'Update your historical chest total? Your probability will be recalculated using these values.',
      historicalUpdated: 'Historical total and probability recalculated.',
      alreadyWon: 'Your Token win is already recorded.',
      confirmWin: 'Amazing! Mark the Pirate Shop Token as obtained?',
      winRecorded: 'Token obtained — victory logged!',
      tokenSecured: 'Token secured. GG!',
      tokenWonCopy: 'Your win is saved. Your chest log is still here whenever you need it.',
      storageError: 'Could not save — browser storage may be full.',
      settingsButton: 'Edit initial data',
      brandHome: 'Fortnite Chest Token home'
    },
    es: {
      languageLabel: 'Idioma',
      savedDevice: 'GUARDADO EN ESTE DISPOSITIVO',
      lootLog: 'TU REGISTRO DE BOTÍN',
      headline: 'Cada cofre<br><span>cuenta.</span>',
      introCopy: 'Lleva el control de tus partidas y consulta tus probabilidades.',
      seasonToken: 'EL TOKEN DE LA<br>TIENDA PIRATA',
      statsLabel: 'Estadísticas de cofres y probabilidad',
      totalChests: 'COFRES ABIERTOS EN TOTAL',
      estimatedChance: 'PROBABILIDAD ESTIMADA',
      unofficial: 'NO OFICIAL',
      atLeastToken: 'Al menos un token',
      dropRateBoost: 'BONIFICADOR DE PROBABILIDAD',
      probabilityMultiplier: 'Multiplicador de probabilidad',
      fieldNotes: 'NOTAS DE CAMPO',
      yourMatches: 'Tus partidas',
      newMatch: 'Nueva partida',
      noMatches: 'Aún no hay partidas',
      emptyCopy: 'Crea una partida para empezar a registrar tus cofres.',
      createFirst: 'Crear primera partida',
      bigOne: 'EL GRAN MOMENTO',
      tokenTitle: '¿Encontraste el Token de la Tienda Pirata?',
      tokenCopy: 'Marca tu victoria aquí. Tu registro de cofres seguirá intacto.',
      gotToken: '¡Conseguí el Token!',
      disclaimer: 'Estimación orientativa basada en datos no oficiales; no garantiza el Token.',
      baseOdds: 'Probabilidad base: 1 entre 137.500 por cofre',
      closeSettings: 'Cerrar ajustes',
      setup: 'CONFIGURACIÓN',
      beforeYouDrop: 'ANTES DE SALTAR',
      updateBaseline: 'ACTUALIZA TU REFERENCIA',
      setupTitle: 'Empecemos tu<br><span>registro de botín.</span>',
      setupTitleEdit: 'Ajusta tu<br><span>punto de partida.</span>',
      setupCopy: 'Añade tu historial para obtener una estimación más completa desde el principio.',
      setupCopyEdit: 'Al cambiar estos valores se recalcularán tus cofres históricos y la probabilidad. Tus partidas registradas no cambiarán.',
      matchesPlayed: 'Partidas jugadas',
      matchesUnit: 'PARTIDAS',
      averageChests: 'Cofres promedio por partida',
      chestsUnit: 'COFRES',
      setupHint: 'El total histórico se calcula como partidas × cofres promedio.',
      buildLog: 'Crear mi registro',
      saveAndRecalculate: 'Guardar y recalcular',
      setupPrivacy: 'Tu progreso se guarda de forma privada en este navegador.',
      chestSingular: 'COFRE',
      chestPlural: 'COFRES',
      matchOne: 'partida',
      matchMany: 'partidas',
      across: 'En {n} {unit}',
      multiplierButton: '{value} veces el multiplicador',
      matchName: 'Nombre de la partida {n}',
      matchDefaultName: 'Partida {n}',
      subtract: 'Restar 2 cofres a {name}',
      subtractTitle: 'Restar 2 cofres',
      add: 'Añadir 1 cofre a {name}',
      addTitle: 'Añadir 1 cofre',
      delete: 'Eliminar {name}',
      deleteTitle: 'Eliminar partida',
      deleteConfirm: '¿Eliminar «{name}» y sus {count} cofres?',
      matchDeleted: 'Partida eliminada. Se actualizó tu estimación.',
      matchRequired: 'La partida necesita un nombre.',
      newAdded: 'Nueva partida añadida. ¡Buena suerte!',
      invalidNumbers: 'Introduce números válidos iguales o mayores que 0.',
      confirmUpdate: '¿Actualizar el total histórico de cofres? La probabilidad se recalculará con estos valores.',
      historicalUpdated: 'Total histórico y probabilidad recalculados.',
      alreadyWon: 'Tu victoria con el Token ya está registrada.',
      confirmWin: '¡Increíble! ¿Marcar el Token de la Tienda Pirata como conseguido?',
      winRecorded: 'Token conseguido: ¡victoria registrada!',
      tokenSecured: '¡Token conseguido! GG',
      tokenWonCopy: 'Tu victoria está guardada. Tu registro de cofres seguirá aquí.',
      storageError: 'No se pudo guardar; quizá el almacenamiento del navegador está lleno.',
      settingsButton: 'Editar datos iniciales',
      brandHome: 'Inicio de Fortnite Chest Token'
    },
    fr: {
      languageLabel: 'Langue',
      savedDevice: 'ENREGISTRÉ SUR CET APPAREIL',
      lootLog: 'VOTRE JOURNAL DE BUTIN',
      headline: 'Chaque coffre<br><span>compte.</span>',
      introCopy: 'Suivez vos parties et découvrez comment évoluent vos chances.',
      seasonToken: 'LE JETON DE LA<br>BOUTIQUE PIRATE',
      statsLabel: 'Statistiques des coffres et des probabilités',
      totalChests: 'COFFRES OUVERTS AU TOTAL',
      estimatedChance: 'CHANCE ESTIMÉE',
      unofficial: 'NON OFFICIEL',
      atLeastToken: 'Au moins un jeton',
      dropRateBoost: 'BONUS DE BUTIN',
      probabilityMultiplier: 'Multiplicateur de probabilité',
      fieldNotes: 'NOTES DE TERRAIN',
      yourMatches: 'Vos parties',
      newMatch: 'Nouvelle partie',
      noMatches: 'Aucune partie pour le moment',
      emptyCopy: 'Créez une partie pour commencer à suivre vos coffres.',
      createFirst: 'Créer la première partie',
      bigOne: 'LE GRAND MOMENT',
      tokenTitle: 'Vous avez trouvé le jeton de la Boutique Pirate ?',
      tokenCopy: 'Signalez votre victoire ici. Votre journal de coffres reste intact.',
      gotToken: 'J’ai obtenu le jeton !',
      disclaimer: 'Estimation indicative basée sur des données non officielles ; le jeton n’est pas garanti.',
      baseOdds: 'Chance de base : 1 sur 137 500 par coffre',
      closeSettings: 'Fermer les paramètres',
      setup: 'CONFIGURATION',
      beforeYouDrop: 'AVANT LE SAUT',
      updateBaseline: 'MODIFIER VOTRE RÉFÉRENCE',
      setupTitle: 'Commençons votre<br><span>journal de butin.</span>',
      setupTitleEdit: 'Ajustez votre<br><span>point de départ.</span>',
      setupCopy: 'Ajoutez votre historique pour obtenir une estimation plus complète.',
      setupCopyEdit: 'La modification de ces valeurs recalcule votre total historique et vos probabilités. Vos parties enregistrées restent inchangées.',
      matchesPlayed: 'Parties déjà jouées',
      matchesUnit: 'PARTIES',
      averageChests: 'Coffres en moyenne par partie',
      chestsUnit: 'COFFRES',
      setupHint: 'Votre total historique est calculé ainsi : parties × moyenne de coffres.',
      buildLog: 'Créer mon journal',
      saveAndRecalculate: 'Enregistrer et recalculer',
      setupPrivacy: 'Votre progression est enregistrée en privé dans ce navigateur.',
      chestSingular: 'COFFRE',
      chestPlural: 'COFFRES',
      matchOne: 'partie',
      matchMany: 'parties',
      across: 'Sur {n} {unit}',
      multiplierButton: 'Multiplicateur de {value} fois',
      matchName: 'Nom de la partie {n}',
      matchDefaultName: 'Partie {n}',
      subtract: 'Retirer 2 coffres de {name}',
      subtractTitle: 'Retirer 2 coffres',
      add: 'Ajouter 1 coffre à {name}',
      addTitle: 'Ajouter 1 coffre',
      delete: 'Supprimer {name}',
      deleteTitle: 'Supprimer la partie',
      deleteConfirm: 'Supprimer « {name} » et ses {count} coffres ?',
      matchDeleted: 'Partie supprimée. Votre estimation a été mise à jour.',
      matchRequired: 'Une partie doit avoir un nom.',
      newAdded: 'Nouvelle partie ajoutée. Bonne chance !',
      invalidNumbers: 'Saisissez des nombres valides supérieurs ou égaux à 0.',
      confirmUpdate: 'Mettre à jour votre total historique ? Vos probabilités seront recalculées avec ces valeurs.',
      historicalUpdated: 'Total historique et probabilités recalculés.',
      alreadyWon: 'Votre victoire avec le jeton est déjà enregistrée.',
      confirmWin: 'Super ! Marquer le jeton de la Boutique Pirate comme obtenu ?',
      winRecorded: 'Jeton obtenu — victoire enregistrée !',
      tokenSecured: 'Jeton obtenu. GG !',
      tokenWonCopy: 'Votre victoire est enregistrée. Votre journal de coffres reste disponible.',
      storageError: 'Enregistrement impossible — le stockage du navigateur est peut-être plein.',
      settingsButton: 'Modifier les données initiales',
      brandHome: 'Accueil Fortnite Chest Token'
    }
  };

  let toastTimer;
  let language = loadLanguage();
  let state = loadState();
  let editingSetup = false;

  function blankState() {
    return { onboarded: false, historicalMatches: 0, averageChests: 20, initialTotal: 0, multiplier: 1, tokenObtained: false, matches: [] };
  }

  function loadLanguage() {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return ['en', 'es', 'fr'].includes(saved) ? saved : 'en';
    } catch (error) {
      return 'en';
    }
  }

  function t(key, values = {}) {
    const dictionary = translations[language] || translations.en;
    const text = dictionary[key] || translations.en[key] || '';
    return Object.entries(values).reduce((result, [name, value]) => result.replaceAll(`{${name}}`, String(value)), text);
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
          name: typeof match.name === 'string' && match.name.trim() ? match.name.trim() : t('matchDefaultName', { n: index + 1 }),
          autoName: match.autoName === true,
          count: Math.max(0, Math.floor(Number(match.count) || 0))
        })) : []
      };
    } catch (error) {
      return blankState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      showToast(t('storageError'));
    }
  }

  function saveLanguage() {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      // Ignore preferences that cannot be stored.
    }
  }

  function totalChests() {
    return state.initialTotal + state.matches.reduce((total, match) => total + match.count, 0);
  }

  function formatNumber(number) {
    return new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(number);
  }

  function probabilityPercent() {
    const p = Math.min(BASE_PROBABILITY * state.multiplier, 1);
    const n = totalChests();
    return (1 - Math.exp(n * Math.log1p(-p))) * 100;
  }

  function applyTranslations() {
    document.documentElement.lang = language;
    const select = $('#language-select');
    if (select) select.value = language;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (!key) return;
      element.innerHTML = t(key);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const key = element.dataset.i18nAria;
      if (key) element.setAttribute('aria-label', t(key));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const key = element.dataset.i18nTitle;
      if (key) element.setAttribute('title', t(key));
    });

    const brand = $('.brand');
    if (brand) brand.setAttribute('aria-label', t('brandHome'));
  }

  function render() {
    applyTranslations();

    if (!$('#setup-layer').hidden) openSetup(editingSetup, false);
    $('#main-content').hidden = !state.onboarded;
    $('#settings-button').hidden = !state.onboarded;

    if (!state.onboarded) {
      openSetup(false);
      return;
    }

    $('#total-count').textContent = formatNumber(totalChests());
    $('#probability').textContent = probabilityPercent().toFixed(5);

    const summaryUnit = state.matches.length === 1 ? t('matchOne') : t('matchMany');
    $('#match-summary').textContent = t('across', { n: state.matches.length, unit: summaryUnit });
    $('#match-count').textContent = String(state.matches.length);

    document.querySelectorAll('.multiplier').forEach((button) => {
      const active = Number(button.dataset.multiplier) === state.multiplier;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', t('multiplierButton', { value: button.dataset.multiplier }));
    });

    list.replaceChildren(...state.matches.map((match, index) => createMatchRow(match, index)));
    $('#empty-state').hidden = state.matches.length > 0;
    $('#token-banner').classList.toggle('won', state.tokenObtained);
    $('#token-title').textContent = state.tokenObtained ? t('tokenSecured') : t('tokenTitle');
    $('#token-copy').textContent = state.tokenObtained ? t('tokenWonCopy') : t('tokenCopy');
    $('#got-token').innerHTML = state.tokenObtained ? `<span>✓</span> ${t('gotToken')}` : `<span>✦</span> ${t('gotToken')}`;
  }

  function createMatchRow(match, index) {
    const row = document.createElement('article');
    row.className = 'match-row';

    const nameWrap = document.createElement('div');
    nameWrap.className = 'match-name-wrap';

    const indexLabel = document.createElement('span');
    indexLabel.className = 'match-index';
    indexLabel.textContent = String(index + 1).padStart(2, '0');

    const displayName = match.autoName ? t('matchDefaultName', { n: index + 1 }) : match.name;
    const name = document.createElement('input');
    name.className = 'match-name';
    name.type = 'text';
    name.maxLength = 36;
    name.value = displayName;
    name.setAttribute('aria-label', t('matchName', { n: index + 1 }));
    name.addEventListener('change', () => {
      const cleaned = name.value.trim();
      if (!cleaned) {
        name.value = displayName;
        showToast(t('matchRequired'));
        return;
      }
      match.name = cleaned;
      match.autoName = false;
      saveState();
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
    countLabel.textContent = match.count === 1 ? t('chestSingular') : t('chestPlural');
    count.append(countLabel);

    const actions = document.createElement('div');
    actions.className = 'counter-actions';

    const subtract = document.createElement('button');
    subtract.className = 'counter-button';
    subtract.type = 'button';
    subtract.textContent = '−';
    subtract.disabled = match.count === 0;
    subtract.setAttribute('aria-label', t('subtract', { name: displayName }));
    subtract.title = t('subtractTitle');
    subtract.addEventListener('click', () => changeCount(match.id, -2));

    const add = document.createElement('button');
    add.className = 'counter-button plus';
    add.type = 'button';
    add.textContent = '+';
    add.setAttribute('aria-label', t('add', { name: displayName }));
    add.title = t('addTitle');
    add.addEventListener('click', () => changeCount(match.id, 1));

    actions.append(subtract, add);

    const remove = document.createElement('button');
    remove.className = 'delete-button';
    remove.type = 'button';
    remove.setAttribute('aria-label', t('delete', { name: displayName }));
    remove.title = t('deleteTitle');
    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg>';
    remove.addEventListener('click', () => {
      if (!window.confirm(t('deleteConfirm', { name: displayName, count: match.count }))) return;
      state.matches = state.matches.filter((item) => item.id !== match.id);
      saveState();
      render();
      showToast(t('matchDeleted'));
    });

    row.append(nameWrap, count, actions, remove);
    return row;
  }

  function changeCount(id, amount) {
    const match = state.matches.find((item) => item.id === id);
    if (!match) return;
    match.count = Math.max(0, match.count + amount);
    saveState();
    render();
  }

  function addMatch() {
    const next = state.matches.length + 1;
    state.matches.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: t('matchDefaultName', { n: next }), autoName: true, count: 0 });
    saveState();
    render();
    const lastInput = list.lastElementChild?.querySelector('.match-name');
    lastInput?.focus();
    showToast(t('newAdded'));
  }

  function openSetup(editing, resetValues = true) {
    editingSetup = editing;
    const layer = $('#setup-layer');
    layer.hidden = false;
    $('#close-setup').hidden = !editing;
    $('#setup-eyebrow').textContent = editing ? t('updateBaseline') : t('beforeYouDrop');
    $('#setup-title').innerHTML = editing ? t('setupTitleEdit') : t('setupTitle');
    $('#setup-copy').textContent = editing ? t('setupCopyEdit') : t('setupCopy');
    $('#setup-submit-label').textContent = editing ? t('saveAndRecalculate') : t('buildLog');
    if (resetValues) {
      $('#played-matches').value = editing ? state.historicalMatches : 0;
      $('#average-chests').value = editing ? state.averageChests : 20;
      requestAnimationFrame(() => $('#played-matches').focus());
    }
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
      showToast(t('invalidNumbers'));
      return;
    }
    if (editingSetup && !window.confirm(t('confirmUpdate'))) return;

    state.historicalMatches = matchesPlayed;
    state.averageChests = average;
    state.initialTotal = matchesPlayed * average;
    state.onboarded = true;
    saveState();
    $('#setup-layer').hidden = true;
    render();
    if (editingSetup) showToast(t('historicalUpdated'));
  });

  $('#close-setup').addEventListener('click', closeSetup);
  $('#settings-button').addEventListener('click', () => openSetup(true));
  $('#add-match').addEventListener('click', addMatch);
  $('#empty-add').addEventListener('click', addMatch);

  $('#got-token').addEventListener('click', () => {
    if (state.tokenObtained) {
      showToast(t('alreadyWon'));
      return;
    }
    if (!window.confirm(t('confirmWin'))) return;
    state.tokenObtained = true;
    saveState();
    render();
    showToast(t('winRecorded'));
  });

  document.querySelectorAll('.multiplier').forEach((button) => {
    button.addEventListener('click', () => {
      state.multiplier = Number(button.dataset.multiplier);
      saveState();
      render();
    });
  });

  $('#language-select').addEventListener('change', (event) => {
    language = ['en', 'es', 'fr'].includes(event.target.value) ? event.target.value : 'en';
    saveLanguage();
    render();
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
