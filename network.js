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
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 2000); // Предохранитель таймаута
  config.signal = controller.signal;
  const res = await fetch(url, config);
  return res.ok ? await res.json() : null;
 } catch (e) { return null; };
}

function scriptInitCloudSync() {
 scriptDownloadFromCloud();
 setInterval(scriptDownloadFromCloud, 6000);
}

async function scriptSyncToCloud() {
 if (!currentUser) return;
 await scriptFetchCloud('user_wishlists', 'POST', { username: currentUser, wishlist_data: db[currentUser] || [], updated_at: new Date() });
}

async function scriptDownloadFromCloud() {
 try {
  const data = await scriptFetchCloud('user_wishlists');
  if (data && Array.isArray(data)) {
   data.forEach(row => { if (row.username && row.username !== currentUser) db[row.username] = row.wishlist_data || []; });
   if (document.getElementById('screen-view-items').classList.contains('active') && typeof scriptRenderOtherList === 'function') {
    scriptRenderOtherList();
   }
  }
 } catch(e) {}
}
