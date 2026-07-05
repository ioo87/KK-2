/* =========================================================
   KK Shop — Catalog Rendering
   ตัวกรองหมวดหมู่ การเรียงลำดับ และการวาดการ์ดสินค้า
   ========================================================= */

function renderFilters(){
  const row = $('#filter-row');
  row.innerHTML = '';
  CATEGORIES.forEach(c=>{
    const b = document.createElement('button');
    b.className = 'chip' + (state.activeCat===c.id ? ' active':'');
    b.textContent = c.label;
    b.onclick = ()=>{ state.activeCat = c.id; renderFilters(); renderGrid(); };
    row.appendChild(b);
  });
  const sort = document.createElement('select');
  sort.className = 'sort-select';
  sort.innerHTML = `
    <option value="default">เรียงตาม: แนะนำ</option>
    <option value="price-asc">ราคา: ต่ำ → สูง</option>
    <option value="price-desc">ราคา: สูง → ต่ำ</option>
    <option value="rating">คะแนนสูงสุด</option>`;
  sort.value = state.sort;
  sort.onchange = e=>{ state.sort = e.target.value; renderGrid(); };
  row.appendChild(sort);
}

function getFiltered(){
  let list = PRODUCTS.filter(p=>{
    const matchCat = state.activeCat==='all' || p.cat===state.activeCat;
    const matchQuery = !state.query || p.name.toLowerCase().includes(state.query) || CAT_LABEL[p.cat].toLowerCase().includes(state.query);
    return matchCat && matchQuery;
  });
  if(state.sort==='price-asc') list = list.slice().sort((a,b)=>a.price-b.price);
  if(state.sort==='price-desc') list = list.slice().sort((a,b)=>b.price-a.price);
  if(state.sort==='rating') list = list.slice().sort((a,b)=>b.rating-a.rating);
  return list;
}

function renderGrid(){
  const list = getFiltered();
  $('#result-count').textContent = list.length + ' รายการ';
  const grid = $('#product-grid');
  grid.innerHTML = '';

  if(list.length===0){
    grid.style.display='block';
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <svg><use href="#ic-search"/></svg>
      <p>ไม่พบสินค้าที่ตรงกับ "${state.query}"<br>ลองค้นด้วยคำอื่น หรือเลือกหมวดหมู่ใหม่</p>
    </div>`;
    return;
  }
  grid.style.display='grid';

  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    const isWish = state.wishlist.has(p.id);
    card.innerHTML = `
      <div class="pin-dot"></div>
      <div class="card-sku mono">${p.sku}</div>
      <button class="dev-json-btn" data-id="${p.id}">{ } view JSON</button>
      <div class="card-visual"><svg><use href="#${CAT_ICON[p.cat]}"/></svg></div>
      <div class="card-cat">${CAT_LABEL[p.cat]}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-meta">
        <span class="stars">${starString(p.rating)}</span>
        <span>${p.rating}</span>
        ${p.stock < 20 ? `<span class="stock-low">เหลือ ${p.stock} ชิ้น</span>` : ''}
      </div>
      <div class="card-footer">
        <div class="price">${money(p.price)}</div>
        <div class="card-btns">
          <button class="wish-btn ${isWish?'active':''}" data-id="${p.id}" data-action="wish"><svg><use href="#ic-heart"/></svg></button>
          <button class="add-btn" data-id="${p.id}" data-action="add"><svg><use href="#ic-plus"/></svg></button>
        </div>
      </div>
      <div class="json-panel mono" id="json-${p.id}"></div>
    `;
    card.addEventListener('click', (e)=>{
      if(e.target.closest('[data-action]') || e.target.closest('.dev-json-btn')) return;
      openQuickView(p.id);
    });
    grid.appendChild(card);
  });

  // wire up buttons
  $$('[data-action="wish"]').forEach(b=>b.addEventListener('click', e=>{ e.stopPropagation(); toggleWishlist(+b.dataset.id); }));
  $$('[data-action="add"]').forEach(b=>b.addEventListener('click', e=>{ e.stopPropagation(); addToCart(+b.dataset.id); }));
  $$('.dev-json-btn').forEach(b=>b.addEventListener('click', e=>{
    e.stopPropagation();
    const id = +b.dataset.id;
    const panel = $('#json-'+id);
    panel.classList.toggle('open');
    if(panel.classList.contains('open')){
      panel.textContent = JSON.stringify(findProduct(id), null, 2);
      logDev('GET', `/api/products/${id}`, 200);
    }
  }));

  if(state.devMode) logDev('GET', '/api/products', 200, `filter=${state.activeCat} sort=${state.sort} → ${list.length} items`);
}

/* รายการแบบกำหนดเอง ใช้แสดงผลลัพธ์ของ "รายการโปรด" */
function renderCustomList(list){
  const grid = $('#product-grid');
  grid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="pin-dot"></div>
      <div class="card-sku mono">${p.sku}</div>
      <div class="card-visual"><svg><use href="#${CAT_ICON[p.cat]}"/></svg></div>
      <div class="card-cat">${CAT_LABEL[p.cat]}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-footer">
        <div class="price">${money(p.price)}</div>
        <div class="card-btns">
          <button class="add-btn" data-id="${p.id}" data-action="add"><svg><use href="#ic-plus"/></svg></button>
        </div>
      </div>`;
    card.addEventListener('click', e=>{ if(!e.target.closest('[data-action]')) openQuickView(p.id); });
    grid.appendChild(card);
  });
  $$('[data-action="add"]').forEach(b=>b.addEventListener('click', e=>{ e.stopPropagation(); addToCart(+b.dataset.id); }));
}
