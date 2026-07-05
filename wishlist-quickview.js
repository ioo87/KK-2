/* =========================================================
   KK Shop — Wishlist & Quick View
   รายการโปรด และหน้าต่างดูรายละเอียดสินค้าแบบด่วน
   ========================================================= */

function toggleWishlist(id){
  if(state.wishlist.has(id)){ state.wishlist.delete(id); }
  else { state.wishlist.add(id); showToast('เพิ่มลงรายการโปรดแล้ว'); }
  renderGrid();
  updateCounts();
  if(state.devMode) logDev('POST', '/api/wishlist', 201, `product_id=${id}`);
}

function openQuickView(id){
  const p = findProduct(id);
  const specsHtml = Object.entries(p.specs).map(([k,v])=>`<div><span class="l">${k.toUpperCase()}</span>${v}</div>`).join('');
  $('#qv-content').innerHTML = `
    <div class="qv-visual"><svg><use href="#${CAT_ICON[p.cat]}"/></svg></div>
    <div class="qv-info">
      <div class="card-cat">${CAT_LABEL[p.cat]} · <span class="mono">${p.sku}</span></div>
      <h3>${p.name}</h3>
      <span class="price">${money(p.price)}</span>
      <p class="qv-desc">${p.desc}</p>
      <div class="qv-specs">${specsHtml}</div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-primary" style="flex:1" onclick="addToCart(${p.id}); closeAllPanels();">เพิ่มลงตะกร้า</button>
        <button class="wish-btn ${state.wishlist.has(p.id)?'active':''}" onclick="toggleWishlist(${p.id})" style="width:44px;height:44px;"><svg><use href="#ic-heart"/></svg></button>
      </div>
    </div>
  `;
  $('#qv-backdrop').classList.add('open');
  $('#overlay').classList.add('open');
  if(state.devMode) logDev('GET', `/api/products/${id}`, 200, 'quick-view');
}
