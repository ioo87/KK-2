/* =========================================================
   KK Shop — Cart
   เพิ่ม/ลบ/ปรับจำนวนสินค้า วาดตะกร้า และขั้นตอนสั่งซื้อ
   ========================================================= */

function addToCart(id){
  const item = state.cart.find(c=>c.id===id);
  if(item) item.qty++;
  else state.cart.push({id, qty:1});
  updateCounts();
  showToast('เพิ่มลงตะกร้าแล้ว');
  renderCart();
  if(state.devMode) logDev('POST', '/api/cart/items', 201, `product_id=${id}`);
}

function changeQty(id, delta){
  const item = state.cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) state.cart = state.cart.filter(c=>c.id!==id);
  updateCounts();
  renderCart();
  if(state.devMode) logDev('PATCH', `/api/cart/items/${id}`, 200, `qty=${item.qty||0}`);
}

function removeFromCart(id){
  state.cart = state.cart.filter(c=>c.id!==id);
  updateCounts();
  renderCart();
  if(state.devMode) logDev('DELETE', `/api/cart/items/${id}`, 200);
}

function renderCart(){
  const body = $('#cart-body');
  const foot = $('#cart-foot');
  if(state.cart.length===0){
    body.innerHTML = `<div class="empty-state"><svg><use href="#ic-cart"/></svg><p>ตะกร้าของคุณว่างอยู่<br>เลือกอุปกรณ์ที่ใช่แล้วเริ่มสร้างโปรเจกต์ได้เลย</p></div>`;
    foot.innerHTML = `<button class="btn btn-ghost btn-block" onclick="closeAllPanels()">เลือกดูสินค้าต่อ</button>`;
    return;
  }
  body.innerHTML = state.cart.map(c=>{
    const p = findProduct(c.id);
    return `
    <div class="cart-item">
      <div class="thumb"><svg><use href="#${CAT_ICON[p.cat]}"/></svg></div>
      <div class="cart-item-row">
        <div class="name">${p.name}</div>
        <div class="cart-item-bottom">
          <div class="qty-ctrl">
            <button onclick="changeQty(${p.id},-1)">−</button>
            <span>${c.qty}</span>
            <button onclick="changeQty(${p.id},1)">+</button>
          </div>
          <div class="cart-item-price mono">${money(p.price*c.qty)}</div>
        </div>
        <button class="remove" onclick="removeFromCart(${p.id})">ลบออก</button>
      </div>
    </div>`;
  }).join('');

  const subtotal = state.cart.reduce((s,c)=>s + findProduct(c.id).price*c.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  foot.innerHTML = `
    <div class="subtotal-row"><span>ยอดรวมสินค้า</span><span class="mono">${money(subtotal)}</span></div>
    <div class="subtotal-row"><span>ค่าจัดส่ง</span><span class="mono">${shipping===0?'ฟรี':money(shipping)}</span></div>
    <div class="subtotal-row total"><span>ยอดชำระทั้งหมด</span><span class="mono">${money(subtotal+shipping)}</span></div>
    <button class="btn btn-primary btn-block" onclick="checkout()">ดำเนินการสั่งซื้อ</button>
  `;
}

function checkout(){
  if(state.cart.length===0) return;
  if(!state.user){
    showToast('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ');
    closeAllPanels();
    openAuth();
    return;
  }
  if(state.devMode) logDev('POST', '/api/orders', 201, `items=${state.cart.length}`);
  showToast('สั่งซื้อสำเร็จ ขอบคุณที่ใช้บริการ KK Shop!');
  state.cart = [];
  updateCounts();
  renderCart();
  closeAllPanels();
}

function updateCounts(){
  const cartN = state.cart.reduce((s,c)=>s+c.qty,0);
  const wishN = state.wishlist.size;
  const cartBadge = $('#cart-count'), wishBadge = $('#wish-count');
  cartBadge.textContent = cartN; cartBadge.style.display = cartN? 'flex':'none';
  wishBadge.textContent = wishN; wishBadge.style.display = wishN? 'flex':'none';
}
