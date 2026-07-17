function scriptSaveUserSession(u) { localStorage.setItem('w_last_active_user', u); }
function scriptClearUserSession() { localStorage.removeItem('w_last_active_user'); }

function scriptCheckAutoLogin() {
 const urlParams = new URLSearchParams(window.location.search);
 if (urlParams.has('user') && urlParams.has('wish')) return; 
 const lastUser = localStorage.getItem('w_last_active_user');
 if (lastUser && USERS.includes(lastUser) && typeof scriptLogin === 'function') scriptLogin(lastUser);
}

async function scriptSendNativeShareMessage(wishId) {
 const item = db[currentUser].find(i => i.id === wishId);
 if (!item) return;
 const formattedName = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
 const baseAppUrl = window.location.href.split('?');
 const deepLink = `${baseAppUrl[0]}?user=${currentUser}&wish=${wishId}`;
 const shareText = `${formattedName} делится с вами своим пожеланием! Чтобы посмотреть его, перейдите по ссылке:`;
 if (navigator.share) {
  try { await navigator.share({ title: 'Wishlist', text: shareText, url: deepLink }); scriptSwitchScreen('screen-menu'); } catch (err) {}
 } else {
  navigator.clipboard.writeText(`${shareText}\n${deepLink}`); alert("Ссылка скопирована!"); scriptSwitchScreen('screen-menu');
 };
}

async function scriptProcessIncomingDeepLink() {
 const urlParams = new URLSearchParams(window.location.search);
 if (!urlParams.has('user') || !urlParams.has('wish')) return;
 const targetLinkUser = urlParams.get('user');
 const targetWishId = urlParams.get('wish');
 if (!USERS.includes(targetLinkUser)) return;
 if (typeof scriptOpenOther === 'function') scriptOpenOther(targetLinkUser);
 setTimeout(() => {
  document.querySelectorAll('.wish-item').forEach(element => {
   const clickHandler = element.querySelector('.checkbox-container');
   if (clickHandler && clickHandler.getAttribute('onclick').includes(targetWishId)) {
    element.classList.add('highlight-wish');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
   }
  });
 }, 500);
}

window.addEventListener('load', scriptProcessIncomingDeepLink);
