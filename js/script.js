const grid=document.getElementById('productGrid');
const search=document.getElementById('search');
const count=document.getElementById('productCount');
const dialog=document.getElementById('productDialog');
const dialogImage=document.getElementById('dialogImage');
const dialogTitle=document.getElementById('dialogTitle');
const dialogCategory=document.getElementById('dialogCategory');
const imageMode=document.getElementById('imageMode');
const originalBtn=document.getElementById('showOriginal');
let activeFilter='all', currentProduct=null, showingOriginal=false;
const items=[...(window.KGH_PRODUCTS||[])];
if(window.KGH_BHATTI) items.unshift(window.KGH_BHATTI);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(){
 const q=(search.value||'').trim().toLowerCase();
 const filtered=items.filter(p=>(activeFilter==='all'||p.category===activeFilter)&&(`${p.title} ${p.category} ${p.n}`.toLowerCase().includes(q)));
 count.textContent=`${filtered.length} items`;
 grid.innerHTML=filtered.map(p=>`<article class="product-card" tabindex="0" role="button" aria-label="View ${esc(p.title)}" data-id="${p.n}">
 <div class="product-photo"><img loading="lazy" src="${p.clean}" alt="${esc(p.title)} — actual shop photo"><span class="photo-label">REAL SHOP PHOTO</span></div>
 <div class="product-meta"><h3>${esc(p.title)}</h3><span>PRICE ON ENQUIRY</span></div>
 <p>${esc(p.category)} · Exact details confirmed with the shop</p><span class="card-enquire">Compare photos & enquire ↗</span></article>`).join('');
 grid.querySelectorAll('.product-card').forEach(card=>{
  const open=()=>openProduct(items.find(p=>String(p.n)===card.dataset.id));
  card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 });
}
function openProduct(p){
 if(!p)return;currentProduct=p;showingOriginal=false;
 dialogImage.src=p.clean;dialogImage.alt=p.title+' clean-edited actual photo';
 dialogTitle.textContent=p.title;dialogCategory.textContent=p.category;
 imageMode.textContent='Clean-edited photo — same original product photo, lightly adjusted';
 originalBtn.textContent='View original shop photo';
 const msg=`Hello Khurana Gift House, I want to enquire about ${p.title} (${p.category}). Please confirm exact product details, price and availability.`;
 document.getElementById('dialogEnquire').href='https://wa.me/918360747002?text='+encodeURIComponent(msg);
 if(typeof dialog.showModal==='function')dialog.showModal();
}
originalBtn.addEventListener('click',()=>{
 if(!currentProduct)return;
 showingOriginal=!showingOriginal;
 dialogImage.src=showingOriginal?currentProduct.original:currentProduct.clean;
 dialogImage.alt=currentProduct.title+(showingOriginal?' original shop photo':' clean-edited actual photo');
 originalBtn.textContent=showingOriginal?'View clean-edited photo':'View original shop photo';
 imageMode.textContent=showingOriginal?'Original photo supplied by the shop':'Clean-edited photo — no AI replacement';
});
document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.filter;render();
}));
search.addEventListener('input',render);
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));
document.getElementById('bookingForm').addEventListener('submit',e=>{
 e.preventDefault();const form=e.currentTarget;const d=new FormData(form);
 const phone=String(d.get('phone')||'').replace(/[^\d+]/g,'');
 if(phone.replace(/\D/g,'').length<10){document.getElementById('formError').textContent='Please enter a valid contact number.';return;}
 document.getElementById('formError').textContent='';
 const lines=[
  'Hello Khurana Gift House, I would like to request a gas appliance service booking.',
  `Name: ${d.get('name')}`,`Phone: ${d.get('phone')}`,`Service: ${d.get('service')}`,
  `Preferred date: ${d.get('date')||'Not specified'}`,`Area/address: ${d.get('area')||'Not specified'}`,
  `Equipment / issue: ${d.get('details')||'Not specified'}`,
  'Please confirm service availability, appointment timing and charges.'
 ];
 window.open('https://wa.me/918360747002?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
});
document.getElementById('year').textContent=new Date().getFullYear();
render();
