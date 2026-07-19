/* =========================================================
   KK Shop — Main
   จุดเริ่มต้นของแอป: ผูก event หลัก และเรียก render ครั้งแรก
   ========================================================= */

$('#search-input').addEventListener('input', e=>{
  state.query = e.target.value.trim().toLowerCase();
  renderGrid();
});

$('#dev-toggle').addEventListener('click', ()=>toggleDevMode());

wireAccountButton();
wirePanels();

renderFilters();
renderGrid();
updateCounts();
