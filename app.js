// Конфигурация и глобальные переменные
const USERS = ["Катя", "Дима", "Елена", "Сергей", "Валерия"];
let db = {};
let currentUser = null;
let targetUser = null;
let shareTargetUser = null;

// Ключи от базы данных Supabase
const CLOUD_URL = "https://supabase.co";
const CLOUD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
 "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eHZqZ2ppYnBicn" +
 "NjZGV1dnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjMy" +
 "MTUsImV4cCI6MjA5NDMzOTIxNX0.7Q_B8R9Z_lX9_vX8_vX7_v" +
 "X6_vX5_vX4_vX3_vX2_vX1_vX0";

let userLangSettings = JSON.parse(
 localStorage.getItem('w_lang_settings')
) || {};

// Локализация текстов
const TRANSLATIONS = {
 ru: {
  mainTitle: "Кто ты?", mainClearBtn: "⚠️ Очистить все данные",
  menuEditBtn: "✏️ Редактировать вишлист", menuViewBtn: "👁️ Просмотр вишлистов", menuShareBtn: "✈️ Поделиться пожеланием", menuLogoutBtn: "👤 Сменить пользователя",
  labelName: "Название:", labelPrice: "Цена:", labelLink: "Ссылка:",
  btnSaveWish: "➕ Добавить в список", btnCancelEdit: "Отмена", btnBackMenu: "Назад",
  viewSelectTitle: "Чей список смотрим?", viewPrefix: "Вишлист", btnBackSelect: "Назад к выбору",
  emptyText: "Пусто", textGiver: "🎁 Дарит: ", textGiverYou: "ТЫ", msgNameQuery: "Имя?",
  msgDeleteQuery: "Удалить?", msgClearQuery: "Очистить твой список?", msgMasterPass: "Пароль:",
  msgWipeAll: "Стереть ВСЁ?", msgWipeSuccess: "Локальное хранилище очищено.", msgWipeFail: "Мимо!",
  textCurrency: "руб.", textNoPrice: "Цена не указана", btnWishText: "Вишлист: ", titleEditBox: "Вишлист: ",
  welcome: "Привет", shareSelectTitle: "Кому отправить?", shareItemsTitle: "Отправка"
 },
 en: {
  mainTitle: "Who are you?", mainClearBtn: "⚠️ Clear all data",
  menuEditBtn: "✏️ Edit Wishlist", menuViewBtn: "👁️ View Wishlists", menuShareBtn: "✈️ Share Wish", menuLogoutBtn: "👤 Switch User",
  labelName: "Name:", labelPrice: "Price:", labelLink: "Link:",
  btnSaveWish: "➕ Add to list", btnCancelEdit: "Cancel", btnBackMenu: "Back",
  viewSelectTitle: "Whose list to view?", viewPrefix: "Wishlist", btnBackSelect: "Back to Selection",
  emptyText: "Empty", textGiver: "🎁 Gives: ", textGiverYou: "YOU", msgNameQuery: "Name?",
  msgDeleteQuery: "Delete?", msgClearQuery: "Clear your list?", msgMasterPass: "Password:",
  msgWipeAll: "Wipe EVERYTHING?", msgWipeSuccess: "All storage wiped clean.", msgWipeFail: "Wrong password!",
  textCurrency: "USD", textNoPrice: "No price specified", btnWishText: "Wishlist: ", titleEditBox: "Wishlist: ",
  welcome: "Hello", shareSelectTitle: "Whose to send?", shareItemsTitle: "Sending"
 },
 de: {
  mainTitle: "Wer bist du?", mainClearBtn: "⚠️ Alle Daten löschen",
  menuEditBtn: "✏️ Wunschliste bearbeiten", menuViewBtn: "👁️ Wunschlisten anzeigen", menuShareBtn: "✈️ Wunsch teilen", menuLogoutBtn: "👤 Benutzer wechseln",
  labelName: "Name:", labelPrice: "Preis:", labelLink: "Link:",
  btnSaveWish: "➕ Hinzufügen", btnCancelEdit: "Abbrechen", btnBackMenu: "Zurück",
  viewSelectTitle: "Wessen Liste anzeigen?", viewPrefix: "Wunschliste", btnBackSelect: "Zurück zur Auswahl",
  emptyText: "Leer", textGiver: "🎁 Schenkt: ", textGiverYou: "DU", msgNameQuery: "Name?",
  msgDeleteQuery: "Löschen?", msgClearQuery: "Deine Liste löschen?", msgMasterPass: "Passwort:",
  msgWipeAll: "ALLES löschen?", msgWipeSuccess: "Speicher bereinigt.", msgWipeFail: "Falsches Passwort!",
  textCurrency: "EUR", textNoPrice: "Kein Preis angegeben", btnWishText: "Wunschliste: ", titleEditBox: "Wunschliste: ",
  welcome: "Hallo", shareSelectTitle: "An wen senden?", shareItemsTitle: "Senden"
 }
};

// Прямой HTTPS-клиент для Supabase Rest API
async function scriptFetchCloud(path, method = 'GET', body = null) {
 const url = `${CLOUD_URL}/rest/v1/${path}`;
 const headers = {
  "apikey": CLOUD_KEY,
  "Authorization": `Bearer ${CLOUD_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "resolution=merge-duplicates"
 };
 const config = { method, headers };
 if (body) config.body = JSON.stringify(body);
 try {
  const res = await fetch(url, config);
  return res.ok ? await res.json() : null;
 } catch (e) {
  console.log("Сбой сети:", e);
  return null;
 };
}

function scriptGetLang() {
 if (currentUser && userLangSettings[currentUser]) return userLangSettings[currentUser];
 return 'ru';
}

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
 if (document.getElementById('edit-item-id').value === '') document.getElementById('btn-save-wish').innerText = t.btnSaveWish;
 document.getElementById('btn-cancel-edit').innerText = t.btnCancelEdit;
 document.querySelectorAll('.btn-back-menu').forEach(b => b.innerText = t.btnBackMenu);
 document.getElementById('view-select-title').innerText = t.viewSelectTitle;
 document.getElementById('view-prefix').innerText = t.viewPrefix;
 document.getElementById('btn-back-select').innerText = t.btnBackSelect;
 document.getElementById('share-select-title').innerText = t.shareSelectTitle;
 if (currentUser) document.getElementById('menu-title').innerText = `${t.welcome}, ${currentUser}! 👋`;
 const flags = { ru: "🇷🇺", en: "🇺🇸", de: "🇩🇪" };
 const texts = { ru: "Языки", en: "Languages", de: "Sprachen" };
 document.getElementById('current-lang-flag').innerText = flags[lang];
 document.getElementById('current-lang-text').innerText = texts[lang];
}

function scriptToggleLangMenu() { document.getElementById('lang-dropdown-list').classList.toggle('open'); }

function scriptSelectLang(lang) {
 document.getElementById('lang-dropdown-list').classList.remove('open');
 if (!currentUser) return;
 userLangSettings[currentUser] = lang;
 localStorage.setItem('w_lang_settings', JSON.stringify(userLangSettings));
 scriptApplyLocalization();
 if (document.getElementById('screen-edit').classList.contains('active')) {
  document.getElementById('edit-title').innerText = TRANSLATIONS[lang].titleEditBox + currentUser;
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
 if (currentScreen && currentScreen.id === 'screen-edit' && list.length > 0) trashBtn.style.display = 'block';
 else trashBtn.style.display = 'none';
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
 scriptSaveUserSession(u);
 if (!userLangSettings[u]) {
  userLangSettings[u] = (u === "Катя") ? "de" : ((u === "Елена") ? "en" : "ru");
  localStorage.setItem('w_lang_settings', JSON.stringify(userLangSettings));
 };
 document.getElementById('global-lang-box').classList.add('visible'); 
 scriptApplyLocalization();
 scriptSwitchScreen('screen-menu');
}

function scriptLogoutUser() { scriptClearUserSession(); scriptInitMain(); scriptSwitchScreen('screen-main'); }
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
 const nInp = document.getElementById('input-wish-name');
 const pInp = document.getElementById('input-wish-price');
 const lInp = document.getElementById('input-wish-link');
 const idInp = document.getElementById('edit-item-id');
 const name = nInp.value.trim();
 const price = pInp.value.trim();
 let link = lInp.value.trim();
 if (!name) { alert(t.msgNameQuery); return; };
 if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
 if (idInp.value) {
  const item = db[currentUser].find(i => i.id === idInp.value);
  if (item) { item.name = name; item.price = price; item.link = link; };
 } else {
  db[currentUser].push({ id: Date.now().toString(), name, price, link, taker: null });
 };
 scriptSaveData(); scriptCancelEditMode(); scriptRenderMyList(); scriptToggleGlobalTrash(); scriptSyncToCloud();
}

function scriptEditWork(id) {
 const item = db[currentUser].find(i => i.id === id);
 if (!item) return;
 document.getElementById('edit-item-id').value = item.id;
 document.getElementById('input-wish-name').value = item.name;
 document.getElementById('input-wish-price').value = item.price;
 document.getElementById('input-wish-link').value = item.link || '';
 document.getElementById('btn-save-wish').innerText = "💾";
 document.getElementById('btn-cancel-edit').style.display = 'block';
}
function scriptDeleteWork(id) {
 const t = TRANSLATIONS[scriptGetLang()];
 if (confirm(t.msgDeleteQuery)) {
  db[currentUser] = db[currentUser].filter(i => i.id !== id);
  scriptSaveData(); scriptRenderMyList(); scriptToggleGlobalTrash(); scriptSyncToCloud();
 };
}

function scriptClearUserWishlist() {
 const t = TRANSLATIONS[scriptGetLang()];
 if (confirm(t.msgClearQuery)) {
  db[currentUser] = [];
  scriptSaveData(); scriptCancelEditMode(); scriptRenderMyList(); scriptToggleGlobalTrash(); scriptSyncToCloud();
 };
}

function scriptNavigateToViewSelect() {
 const box = document.getElementById('view-users-container');
 box.innerHTML = '';
 const t = TRANSLATIONS[scriptGetLang()];
 USERS.forEach(u => {
  if (u === currentUser) return;
  const b = document.createElement('button');
  b.className = 'user-btn';
  b.innerText = `🎁 ${t.btnWishText}${u}`;
  b.onclick = () => scriptOpenOther(u);
  box.appendChild(b);
 });
 scriptSwitchScreen('screen-view-select');
}

function scriptOpenOther(u) { targetUser = u; document.getElementById('view-items-title').innerText = u; scriptRenderOtherList(); scriptSwitchScreen('screen-view-items'); }

function scriptRenderOtherList() {
 const box = document.getElementById('other-wish-list');
 box.innerHTML = '';
 const list = db[targetUser] || [];
 const t = TRANSLATIONS[scriptGetLang()];
 if (list.length === 0) {
  box.innerHTML = `<p style="text-align:center;color:#666;width:100%;padding:15px 0;">${t.emptyText}</p>`;
  return;
 };
 list.forEach(item => {
  const d = document.createElement('div');
  d.className = `wish-item ${item.taker ? 'completed' : ''}`;
  let lnk = item.link ? `<a class="wish-link" href="${item.link}" target="_blank">🔗 Link</a>` : '';
  let prc = item.price ? `<span class="wish-price">${Number(item.price).toLocaleString()} ${t.textCurrency}</span>` : `<span class="wish-price">${t.textNoPrice}</span>`;
  let tkr = item.taker ? `<span class="wish-giver">${t.textGiver}${item.taker === currentUser ? t.textGiverYou : item.taker}</span>` : '';
  const isChecked = item.taker !== null;
  const canToggle = !item.taker || item.taker === currentUser;
  let chkHtml = `<div class="checkbox-container ${isChecked ? 'checked' : ''}" style="${canToggle ? '' : 'opacity:0.4;cursor:not-allowed;'}" onclick="${canToggle ? `scriptToggleWish('${item.id}')` : ''}"></div>`;
  d.innerHTML = `<div class="wish-info"><span class="wish-title">${item.name}</span>${prc} ${lnk} ${tkr}</div><div class="wish-actions">${chkHtml}</div>`;
  box.appendChild(d);
 });
}

function scriptToggleWish(id) {
 const item = db[targetUser].find(i => i.id === id);
 if (!item) return;
 item.taker = item.taker === null ? currentUser : (item.taker === currentUser ? null : item.taker);
 scriptSaveData(); scriptRenderOtherList();
 if (targetUser) {
  const temp = currentUser; currentUser = targetUser;
  scriptSyncToCloud(); currentUser = temp;
 };
}

function scriptNavigateToShareSelect() {
 const box = document.getElementById('share-users-container');
 box.innerHTML = '';
 USERS.forEach(u => {
  if (u === currentUser) return;
  const b = document.createElement('button');
  b.className = 'user-btn';
  b.innerText = `👤 ${u}`;
  b.onclick = () => scriptOpenShareItems(u);
  box.appendChild(b);
 });
 scriptSwitchScreen('screen-share-select');
}

function scriptOpenShareItems(u) { shareTargetUser = u; document.getElementById('share-items-title').innerText = u; scriptRenderShareList(); scriptSwitchScreen('screen-share-items'); }

function scriptRenderShareList() {
 const box = document.getElementById('share-wish-list');
 box.innerHTML = '';
 const list = db[currentUser] || [];
 const t = TRANSLATIONS[scriptGetLang()];
 if (list.length === 0) {
  box.innerHTML = `<p style="text-align:center;color:#666;width:100%;padding:15px 0;">${t.emptyText}</p>`;
  return;
 };
 list.forEach(item => {
  const d = document.createElement('div');
  d.className = 'wish-item';
  let prc = item.price ? `${Number(item.price).toLocaleString()} ${t.textCurrency}` : t.textNoPrice;
  let actionHtml = `<span class="action-icon" style="color:#2196f3;" onclick="scriptSendNativeShareMessage('${item.id}')">✈️</span>`;
  d.innerHTML = `
   <div class="wish-info"><span class="wish-title">${item.name}</span><span class="wish-price">${prc}</span></div>
   <div class="wish-actions">${actionHtml}</div>
  `;
  box.appendChild(d);
 });
}

async function scriptSendNativeShareMessage(wishId) {
 const item = db[currentUser].find(i => i.id === wishId);
 if (!item) return;
 const formattedName = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
 const baseAppUrl = window.location.href.split('?');
 const deepLink = `${baseAppUrl}?user=${currentUser}&wish=${wishId}`;
 const shareText = `${formattedName} делится с вами своим пожеланием! Чтобы посмотреть его, перейдите по ссылке:`;
 if (navigator.share) {
  try { await navigator.share({ title: 'Wishlist', text: shareText, url: deepLink }); scriptSwitchScreen('screen-menu'); } catch (err) { console.log(err); };
 } else {
  navigator.clipboard.writeText(`${shareText}\n${deepLink}`); alert("Ссылка скопирована!"); scriptSwitchScreen('screen-menu');
 };
}

function scriptSaveUserSession(u) { localStorage.setItem('w_last_active_user', u); }
function scriptClearUserSession() { localStorage.removeItem('w_last_active_user'); }

function scriptCheckAutoLogin() {
 const urlParams = new URLSearchParams(window.location.search);
 if (urlParams.has('user') && urlParams.has('wish')) return; 
 const lastUser = localStorage.getItem('w_last_active_user');
 if (lastUser && USERS.includes(lastUser)) scriptLogin(lastUser);
}

function scriptInitCloudSync() {
 scriptDownloadFromCloud();
 setInterval(scriptDownloadFromCloud, 5000);
}

async function scriptSyncToCloud() {
 if (!currentUser) return;
 await scriptFetchCloud('user_wishlists', 'POST', { username: currentUser, wishlist_data: db[currentUser] || [], updated_at: new Date() });
}

async function scriptDownloadFromCloud() {
 const data = await scriptFetchCloud('user_wishlists');
 if (data) {
  data.forEach(row => { if (row.username !== currentUser) db[row.username] = row.wishlist_data || []; });
  if (document.getElementById('screen-view-items').classList.contains('active')) scriptRenderOtherList();
 };
}

async function scriptProcessIncomingDeepLink() {
 const urlParams = new URLSearchParams(window.location.search);
 if (!urlParams.has('user') || !urlParams.has('wish')) return;
 const targetLinkUser = urlParams.get('user');
 const targetWishId = urlParams.get('wish');
 if (!USERS.includes(targetLinkUser)) return;
 scriptOpenOther(targetLinkUser);
 setTimeout(() => {
  document.querySelectorAll('.wish-item').forEach(element => {
   const clickHandler = element.querySelector('.checkbox-container');
   if (clickHandler && clickHandler.getAttribute('onclick').includes(targetWishId)) {
    element.classList.add('highlight-wish');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
   };
  });
 }, 400);
}

function scriptLoadData() {
 const raw = localStorage.getItem('w_db');
 db = raw ? JSON.parse(raw) : {};
 USERS.forEach(u => { if (!db[u]) db[u] = []; });
 scriptInitCloudSync();
}

function scriptSaveData() { localStorage.setItem('w_db', JSON.stringify(db)); }

function scriptPromptClearAllData() {
 const t = TRANSLATIONS[scriptGetLang()];
 const p = prompt(t.msgMasterPass);
 if (p === "9142875dmitrii%!") {
  if (confirm(t.msgWipeAll)) {
   db = {}; USERS.forEach(u => db[u] = []);
   userLangSettings = {}; localStorage.removeItem('w_lang_settings');
   scriptSaveData(); alert(t.msgWipeSuccess); scriptInitMain();
  };
 } else if (p !== null) { alert(t.msgWipeFail); };
}

window.onload = function() {
 scriptLoadData();
 scriptInitMain();
 scriptCheckAutoLogin();
 scriptProcessIncomingDeepLink();
};
