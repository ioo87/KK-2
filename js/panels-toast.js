/* =========================================================
   KK Shop — Panels & Toast
   การเปิด/ปิดลิ้นชักตะกร้า, โมดัล, overlay และข้อความแจ้งเตือน
   ========================================================= */

function closeAllPanels(){
  $('#cart-drawer').classList.remove('open');
  $('#auth-backdrop').classList.remove('open');
  $('#qv-backdrop').classList.remove('open');
  $('#overlay').classList.remove('open');
}

function wirePanels(){
  $('#cart-btn').addEventListener('click', ()=>{
    $('#cart-drawer').classList.add('open');
    $('#overlay').classList.add('open');
    renderCart();
  });

  $('#wish-btn').addEventListener('click', ()=>{
    state.activeCat = 'all'; state.query='';
    $('#search-input').value='';
    renderFilters();
    const wished = PRODUCTS.filter(p=>state.wishlist.has(p.id));
    if(wished.length===0){ showToast('ยังไม่มีสินค้าในรายการโปรด'); return; }
    document.getElementById('catalog').scrollIntoView({behavior:'smooth'});
    setTimeout(()=>{
      $('#result-count').textContent = wished.length + ' รายการโปรด';
    }, 300);
    renderCustomList(wished);
  });

  $('#overlay').addEventListener('click', closeAllPanels);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeAllPanels(); });
}

function showToast(msg){
  const stack = $('#toast-stack');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg><use href="#ic-check"/></svg><span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(), 300); }, 2600);
}
