/* =========================================================
   KK Shop — State & Helpers
   สถานะกลางของเว็บไซต์ และฟังก์ชันช่วยเหลือที่ใช้ร่วมกันทุกส่วน
   ========================================================= */

const state = {
  cart: [],        // {id, qty}
  wishlist: new Set(),
  user: null,
  devMode: false,
  activeCat: 'all',
  query: '',
  sort: 'default',
  reqCount: 0,
};

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const money = n => '฿' + n.toLocaleString('th-TH');
const findProduct = id => PRODUCTS.find(p => p.id === id);

function starString(r){
  const full = Math.round(r);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}
