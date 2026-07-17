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
  textCurrency: "₽", textNoPrice: "Цена не указана", btnWishText: "Вишлист: ", titleEditBox: "Вишлист: ",
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
  textCurrency: "₽", textNoPrice: "No price specified", btnWishText: "Wishlist: ", titleEditBox: "Wishlist: ",
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
  textCurrency: "₽", textNoPrice: "Kein Preis angegeben", btnWishText: "Wunschliste: ", titleEditBox: "Wunschliste: ",
  welcome: "Hallo", shareSelectTitle: "An wen senden?", shareItemsTitle: "Senden"
 }
};

function scriptGetLang() {
 if (currentUser && userLangSettings[currentUser]) return userLangSettings[currentUser];
 return 'ru';
}
