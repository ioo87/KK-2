/* =========================================================
   KK Shop — Authentication
   ระบบเข้าสู่ระบบ/สมัครสมาชิกแบบจำลอง (client-side เท่านั้น)
   ========================================================= */

function openAuth(){
  $('#auth-backdrop').classList.add('open');
  $('#overlay').classList.add('open');
}

function switchAuthTab(tab){
  $('#tab-login').classList.toggle('active', tab==='login');
  $('#tab-register').classList.toggle('active', tab==='register');
  $('#login-form').style.display = tab==='login' ? 'block':'none';
  $('#register-form').style.display = tab==='register' ? 'block':'none';
}

function handleAuth(e, type){
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  const email = type==='login' ? inputs[0].value : inputs[1].value;
  const name = type==='register' ? inputs[0].value : email.split('@')[0];
  state.user = {name, email};
  $('#account-label').textContent = name;
  showToast(type==='login' ? `ยินดีต้อนรับกลับ, ${name}` : `สร้างบัญชีสำเร็จ ยินดีต้อนรับ ${name}`);
  closeAllPanels();
  if(state.devMode) logDev('POST', type==='login' ? '/api/auth/login' : '/api/auth/register', 200, email);
  return false;
}

function wireAccountButton(){
  $('#account-btn').addEventListener('click', ()=>{
    if(state.user){
      state.user = null;
      $('#account-label').textContent = 'เข้าสู่ระบบ';
      showToast('ออกจากระบบแล้ว');
      if(state.devMode) logDev('POST', '/api/auth/logout', 200);
    } else {
      openAuth();
    }
  });
}
