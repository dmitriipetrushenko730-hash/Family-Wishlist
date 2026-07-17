const USERS = ["Катя", "Дима", "Елена", "Сергей", "Валерия"];
let db = {};
let currentUser = null;
let targetUser = null;
let shareTargetUser = null;

const CLOUD_URL = "https://supabase.co";
const CLOUD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
 "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eHZqZ2ppYnBicn" +
 "NjZGV1dnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjMy" +
 "MTUsImV4cCI6MjA5NDMzOTIxNX0.7Q_B8R9Z_lX9_vX8_vX7_v" +
 "X6_vX5_vX4_vX3_vX2_vX1_vX0";

let userLangSettings = JSON.parse(localStorage.getItem('w_lang_settings')) || {};
