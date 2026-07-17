const USERS = ["Катя", "Дима", "Елена", "Сергей", "Валерия"];
let db = {};
let currentUser = null;
let targetUser = null;
let shareTargetUser = null;

// Запомнил! Твои боевые ключи Supabase:
const CLOUD_URL = "https://axxvjgjibpbrscdeuvyf.supabase.co";
const CLOUD_KEY = "sb_publishable_36HNtxEDblwCZC1qCQPd-Q_nbo_c-0s";

let userLangSettings = JSON.parse(localStorage.getItem('w_lang_settings')) || {};
