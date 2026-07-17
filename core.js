function scriptApplyLocalization() {
 const lang = scriptGetLang(); 
 const t = TRANSLATIONS[lang];
 document.getElementById('main-title').innerText = t.mainTitle;
 document.getElementById('main-clear-btn').innerText = t.mainClearBtn;
 document.getElementById('menu-edit-btn').innerText = t.menuEditBtn;
 document.getElementById('menu-view-btn').innerText = t.menuViewBtn;
 document.getElementById('menu-share-btn').innerText = t.menuShareBtn;
 document.getElementById('menu-logout-btn').innerText = t.menuLogoutBtn;
 document.getElementById('label-name').innerText = t.labelName;
 document.getElementById('label-price').innerText = t.labelPrice;
 document.getElementById('label-link').innerText = t.labelLink;
 
 if (document.getElementById('edit-item-id').value === '') {
  document.getElementById('btn-save-wish').innerText = t.btnSaveWish;
 };
 
 document.getElementById('btn-cancel-edit').innerText = t.btnCancelEdit;
 document.querySelectorAll('.btn-back-menu')
  .forEach(b => b.innerText = t.btnBackMenu);
 document.getElementById('view-select-title').innerText = t.viewSelectTitle;
 document.getElementById('view-prefix').innerText = t.viewPrefix;
 document.getElementById('btn-back-select').innerText = t.btnBackSelect;
 document.getElementById('share-select-title').innerText = t.shareSelectTitle;

 if (currentUser) {
  document.getElementById('menu-title')
   .innerText = `${t.welcome}, ${currentUser}! 👋`;
 };

 const flags = { ru: "🇷🇺", en: "🇺🇸", de: "🇩🇪" };
 const texts = { ru: "Языки", en: "Languages", de: "Sprachen" };
 document.getElementById('current-lang-flag').innerText = flags[lang];
 document.getElementById('current-lang-text').innerText = texts[lang];
}

function scriptToggleLangMenu() { 
 document.getElementById('lang-dropdown-list').classList.toggle('open'); 
}

function scriptSelectLang(l) { 
 document.getElementById('lang-dropdown-list').classList.remove('open'); 
 if (!currentUser) return; 
 userLangSettings[currentUser] = l; 
 localStorage.setItem('w_lang_settings', JSON.stringify(userLangSettings)); 
 scriptApplyLocalization(); 
 if (document.getElementById('screen-edit').classList.contains('active')) { 
  document.getElementById('edit-title').innerText = TRANSLATIONS[l].titleEditBox + currentUser; 
  scriptRenderMyList(); 
 }; 
 if (document.getElementById('screen-view-items').classList.contains('active')) scriptRenderOtherList(); 
 if (document.getElementById('screen-share-items').classList.contains('active')) scriptRenderShareList(); 
}

function scriptSwitchScreen(id) { 
 document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
 document.getElementById(id).classList.add('active'); 
 scriptToggleGlobalTrash(); 
}

function scriptToggleGlobalTrash() {
 const trashBtn = document.getElementById('global-trash-btn'); 
 if (!trashBtn) return; 
 if (!currentUser) { trashBtn.style.display = 'none'; return; };
 const currentScreen = document.querySelector('.screen.active'); 
 const list = db[currentUser] || [];
 if (currentScreen && currentScreen.id === 'screen-edit' && list.length > 0) {
  trashBtn.style.display = 'block'; 
 } else {
  trashBtn.style.display = 'none';
 };
}

function scriptInitMain() {
 document.body.className = ''; 
 currentUser = null; 
 document.getElementById('global-lang-box').classList.remove('visible'); 
 const box = document.getElementById('users-buttons-container'); 
 box.innerHTML = '';
 USERS.forEach(u => { 
  const b = document.createElement('button'); 
  b.className = 'user-btn'; 
  b.innerHTML = `👤 ${u}`; 
  b.onclick = () => scriptLogin(u); 
  box.appendChild(b); 
 });
 scriptApplyLocalization(); 
 scriptToggleGlobalTrash();
}
function scriptLogin(u) {
 currentUser = u; 
 document.body.className = `theme-user-${u}`; 
 if (typeof scriptSaveUserSession === 'function') scriptSaveUserSession(u);
 if (!userLangSettings[u]) { 
  userLangSettings[u] = (u === "Катя") ? "de" : ((u === "Елена") ? "en" : "ru"); 
  localStorage.setItem('w_lang_settings', JSON.stringify(userLangSettings)); 
 };
 document.getElementById('global-lang-box').classList.add('visible'); 
 scriptApplyLocalization(); 
 scriptSwitchScreen('screen-menu');
}

function scriptLogoutUser() { 
 if (typeof scriptClearUserSession === 'function') scriptClearUserSession(); 
 scriptInitMain(); 
 scriptSwitchScreen('screen-main'); 
}

function scriptFilterPrice(input) { input.value = input.value.replace(/[^0-9]/g, ''); }

function scriptCancelEditMode() { 
 const t = TRANSLATIONS[scriptGetLang()]; 
 document.getElementById('input-wish-name').value = ''; 
 document.getElementById('input-wish-price').value = ''; 
 document.getElementById('input-wish-link').value = ''; 
 document.getElementById('edit-item-id').value = ''; 
 document.getElementById('btn-save-wish').innerText = t.btnSaveWish; 
 document.getElementById('btn-cancel-edit').style.display = 'none'; 
}

function scriptNavigateToEdit() { 
 const t = TRANSLATIONS[scriptGetLang()]; 
 document.getElementById('edit-title').innerText = t.titleEditBox + currentUser; 
 scriptCancelEditMode(); 
 scriptRenderMyList(); 
 scriptSwitchScreen('screen-edit'); 
}

function scriptRenderMyList() {
 const box = document.getElementById('my-wish-list'); 
 box.innerHTML = ''; 
 const list = db[currentUser] || []; 
 const t = TRANSLATIONS[scriptGetLang()]; 
 scriptToggleGlobalTrash();
 if (list.length === 0) { 
  box.innerHTML = `<p style="text-align:center;color:#666;width:100%;padding:15px 0;">${t.emptyText}</p>`; 
  return; 
 };
 list.forEach(item => { 
  const d = document.createElement('div'); 
  d.className = `wish-item ${item.taker ? 'completed' : ''}`; 
  let lnk = item.link ? `<a class="wish-link" href="${item.link}" target="_blank">🔗 Link</a>` : ''; 
  let tkr = item.taker ? `<span class="wish-giver">${t.textGiver}${item.taker}</span>` : ''; 
  let prc = item.price ? `<span class="wish-price">${Number(item.price).toLocaleString()} ${t.textCurrency}</span>` : `<span class="wish-price">${t.textNoPrice}</span>`; 
  d.innerHTML = `<div class="wish-info"><span class="wish-title">${item.name}</span>${prc} ${lnk} ${tkr}</div><div class="wish-actions"><span class="action-icon edit" onclick="scriptEditWork('${item.id}')">✏️</span><span class="action-icon delete" onclick="scriptDeleteWork('${item.id}')">❌</span></div>`; 
  box.appendChild(d); 
 });
}

function scriptSaveWishItem() {
 const t = TRANSLATIONS[scriptGetLang()]; 
 const name = document.getElementById('input-wish-name').value.trim(); 
 const price = document.getElementById('input-wish-price').value.trim(); 
 let link = document.getElementById('input-wish-link').value.trim(); 
 const idInp = document.getElementById('edit-item-id'); 
 if (!name) { alert(t.msgNameQuery); return; }; 
 if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
 if (idInp.value) { 
  const item = db[currentUser].find(i => i.id === idInp.value); 
  if (item) { item.name = name; item.price = price; item.link = link; }; 
 } else { 
  db[currentUser].push({ id: Date.now().toString(), name, price, link, taker: null }); 
 };
 scriptSaveData(); scriptCancelEditMode(); scriptRenderMyList(); scriptToggleGlobalTrash(); 
 if (typeof scriptSyncToCloud === 'function') scriptSyncToCloud();
}

function scriptEditWork(id) { const item = db[currentUser].find(i => i.id === id); if (!item) return; document.getElementById('edit-item-id').value = item.id; document.getElementById('input-wish-name').value = item.name; document.getElementById('input-wish-price').value = item.price; document.getElementById('input-wish-link').value = item.link || ''; document.getElementById('btn-save-wish').innerText = "💾"; document.getElementById('btn-cancel-edit').style.display = 'block'; }
function scriptDeleteWork(id) { const t = TRANSLATIONS[scriptGetLang()]; if (confirm(t.msgDeleteQuery)) { db[currentUser] = db[currentUser].filter(i => i.id !== id); scriptSaveData(); scriptRenderMyList(); scriptToggleGlobalTrash(); if (typeof scriptSyncToCloud === 'function') scriptSyncToCloud(); }; }
function scriptClearUserWishlist() { const t = TRANSLATIONS[scriptGetLang()]; if (confirm(t.msgClearQuery)) { db[currentUser] = []; scriptSaveData(); scriptCancelEditMode(); scriptRenderMyList(); scriptToggleGlobalTrash(); if (typeof scriptSyncToCloud === 'function') scriptSyncToCloud(); }; }
function scriptNavigateToViewSelect() { const box = document.getElementById('view-users-container'); box.innerHTML = ''; const t = TRANSLATIONS[scriptGetLang()]; USERS.forEach(u => { if (u === currentUser) return; const b = document.createElement('button'); b.className = 'user-btn'; b.innerText = `🎁 ${t.btnWishText}${u}`; b.onclick = () => scriptOpenOther(u); box.appendChild(b); }); scriptSwitchScreen('screen-view-select'); }
function scriptOpenOther(u) { targetUser = u; document.getElementById('view-items-title').innerText = u; scriptRenderOtherList(); scriptSwitchScreen('screen-view-items'); }

function scriptRenderOtherList() {
 const box = document.getElementById('other-wish-list'); box.innerHTML = ''; const list = db[targetUser] || []; const t = TRANSLATIONS[scriptGetLang()]; if (list.length === 0) { box.innerHTML = `<p style="text-align:center;color:#666;width:100%;padding:15px 0;">${t.emptyText}</p>`; return; };
 list.forEach(item => { const d = document.createElement('div'); d.className = `wish-item ${item.taker ? 'completed' : ''}`; let lnk = item.link ? `<a class="wish-link" href="${item.link}" target="_blank">🔗 Link</a>` : ''; let prc = item.price ? `<span class="wish-price">${Number(item.price).toLocaleString()} ${t.textCurrency}</span>` : `<span class="wish-price">${t.textNoPrice}</span>`; let tkr = item.taker ? `<span class="wish-giver">${t.textGiver}${item.taker === currentUser ? t.textGiverYou : item.taker}</span>` : ''; const isChecked = item.taker !== null; const canToggle = !item.taker || item.taker === currentUser; let chkHtml = `<div class="checkbox-container ${isChecked ? 'checked' : ''}" style="${canToggle ? '' : 'opacity:0.4;cursor:not-allowed;'}" onclick="${canToggle ? `scriptToggleWish('${item.id}')` : ''}"></div>`; d.innerHTML = `<div class="wish-info"><span class="wish-title">${item.name}</span>${prc} ${lnk} ${tkr}</div><div class="wish-actions">${chkHtml}</div>`; box.appendChild(d); });
}

function scriptToggleWish(id) { const item = db[targetUser].find(i => i.id === id); if (!item) return; item.taker = item.taker === null ? currentUser : (item.taker === currentUser ? null : item.taker); scriptSaveData(); scriptRenderOtherList(); if (targetUser && typeof scriptSyncToCloud === 'function') { const temp = currentUser; currentUser = targetUser; scriptSyncToCloud(); currentUser = temp; }; }

function scriptLoadData() { const raw = localStorage.getItem('w_db'); db = raw ? JSON.parse(raw) : {}; USERS.forEach(u => { if (!db[u]) db[u] = []; }); if (typeof scriptInitCloudSync === 'function') scriptInitCloudSync(); }
function scriptSaveData() { localStorage.setItem('w_db', JSON.stringify(db)); }
function scriptPromptClearAllData() { const t = TRANSLATIONS[scriptGetLang()]; const p = prompt(t.msgMasterPass); if (p === "9142875dmitrii%!") { if (confirm(t.msgWipeAll)) { db = {}; USERS.forEach(u => db[u] = []); userLangSettings = {}; localStorage.removeItem('w_lang_settings'); scriptSaveData(); alert(t.msgWipeSuccess); scriptInitMain(); }; } else if (p !== null) { alert(t.msgWipeFail); }; }

window.onload = function() {
 scriptLoadData(); scriptInitMain();
 if (typeof scriptCheckAutoLogin === 'function') scriptCheckAutoLogin();
};
