/* =========================================================
   KK Shop — Developer Mode
   สลับสกินนักพัฒนา และบันทึก network log จำลองที่ dev console
   ========================================================= */

function logDev(method, path, status, note){
  state.reqCount++;
  const log = $('#dc-log');
  const row = document.createElement('div');
  row.className = 'dc-line';
  const t = new Date().toLocaleTimeString('th-TH', {hour12:false});
  row.innerHTML = `<span class="m">${method}</span><span class="p">${path}${note ? ' — '+note : ''}</span><span class="s ${status<400?'ok':'err'}">${status}</span><span class="t">${t}</span>`;
  log.prepend(row);
  $('#dc-count').textContent = state.reqCount + ' requests';
}

function toggleDevMode(force){
  state.devMode = typeof force === 'boolean' ? force : !state.devMode;
  document.body.classList.toggle('dev-mode', state.devMode);
  if(state.devMode){
    logDev('GET', '/api/products', 200, `${PRODUCTS.length} items`);
    logDev('GET', '/api/session', state.user ? 200 : 204, state.user ? state.user.email : 'no session');
  }
}
