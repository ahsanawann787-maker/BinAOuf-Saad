# Wiring your HTML to the API

Two drop‑in steps: (A) the website contact form posts real inquiries, and optionally pulls
products/categories live; (B) the admin panel reads/writes through the API instead of
`localStorage`. Nothing about your UI/design changes.

Set the base URL once at the top of each file:

```js
const API = 'http://localhost:4000/api'; // prod: https://api.binaouf.com/api
```

---

## A. Website (`index.html`)

### A1 — Contact form → real inquiry
Replace the body of `submitForm()` (keep your validation + success UI):

```js
async function submitForm(){
  const n=document.getElementById('f-name').value.trim();
  const e=document.getElementById('f-email').value.trim();
  const c=document.getElementById('f-country').value.trim();
  const p=document.getElementById('f-product').value;
  const m=document.getElementById('f-msg').value.trim();
  if(!n||!e||!c||!p||!m){alert('Please fill in all required fields marked with *.');return;}

  const orderType=(document.querySelector('.ot-btn.sel')||{}).textContent?.trim()||'';
  const payload={
    name:n, email:e, country:c, product:p, message:m,
    company:document.getElementById('f-company').value.trim(),
    phone:document.getElementById('f-phone').value.trim(),
    qty:document.getElementById('f-qty').value.trim(),
    market:document.getElementById('f-market').value.trim(),
    orderType
  };

  try{
    const res=await fetch(`${API}/public/inquiries`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const data=await res.json();
    if(!data.ok) throw new Error(data.error||'Failed');

    // reset + success (your existing UI)
    ['f-name','f-email','f-company','f-phone','f-country','f-qty','f-market','f-msg']
      .forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    document.getElementById('f-product').value='';
    document.querySelectorAll('.ot-btn').forEach((b,i)=>b.classList.toggle('sel',i===0));
    const s=document.getElementById('formSuccess');
    s.style.display='block';
    setTimeout(()=>s.style.display='none',8000);
  }catch(err){
    alert('Could not send your inquiry. Please WhatsApp us, or try again.');
    console.error(err);
  }
}
```

### A2 — (Optional) render products/certs live
Instead of hard-coded cards you can hydrate from the API:

```js
async function loadCatalog(){
  const [prods, cats, certs, settings] = await Promise.all([
    fetch(`${API}/public/products`).then(r=>r.json()),
    fetch(`${API}/public/categories`).then(r=>r.json()),
    fetch(`${API}/public/certifications`).then(r=>r.json()),
    fetch(`${API}/public/settings`).then(r=>r.json())
  ]);
  // prods.data → [{id,cat,name,desc,tags,img,specs,...}]
  // group by cat, build your existing card markup, inject into each #pp-<cat> panel
}
```

---

## B. Admin panel (`BinAouf-Admin.html`)

Your admin already centralizes persistence in the `DB` object + `persist` map. Swap that layer
for the API with a small client — your render functions keep working because the API returns the
same shapes (`id`, `specs`, etc.).

### B1 — Add an API client (paste near the top of the `<script>`)

```js
const API='http://localhost:4000/api';
const Auth={
  get token(){return localStorage.getItem('binaouf_token');},
  set token(t){t?localStorage.setItem('binaouf_token',t):localStorage.removeItem('binaouf_token');}
};
async function api(path,{method='GET',body}={}){
  const res=await fetch(`${API}${path}`,{
    method,
    headers:{
      'Content-Type':'application/json',
      ...(Auth.token?{Authorization:`Bearer ${Auth.token}`}:{})
    },
    body:body?JSON.stringify(body):undefined
  });
  const data=await res.json().catch(()=>({}));
  if(res.status===401){Auth.token=null;showLogin();throw new Error('Session expired');}
  if(!data.ok) throw new Error(data.error||`Request failed (${res.status})`);
  return data;
}
async function login(email,password){
  const {data}=await api('/auth/login',{method:'POST',body:{email,password}});
  Auth.token=data.token; return data.user;
}
```

### B2 — Load everything from the API on boot
Replace the seed/`DB.load` block with one fetch per collection:

```js
let CATS=[],PRODUCTS=[],HOMECATS=[],CERTS=[],ORDERS=[],CUSTOMERS=[],INQUIRIES=[],COLS={};

async function bootstrap(){
  const [cats,prods,home,certs,orders,custs,inq,cols,settings]=await Promise.all([
    api('/admin/categories'), api('/admin/products'), api('/admin/home-categories'),
    api('/admin/certifications'), api('/admin/orders'), api('/admin/customers'),
    api('/admin/inquiries'), api('/admin/product-columns'), api('/admin/settings')
  ]);
  CATS=cats.data; PRODUCTS=prods.data; HOMECATS=home.data; CERTS=certs.data;
  ORDERS=orders.data; CUSTOMERS=custs.data; INQUIRIES=inq.data; COLS=cols.data;
  applySettings(settings.data);
  renderAll(); // your existing render functions
}
```

### B3 — Replace `persist.*` writes with API calls
Your handlers currently mutate the array then call `persist.products()`. Point them at the API:

```js
// CREATE
async function saveProduct(p){
  const isNew = !p.id;
  const {data}= isNew
    ? await api('/admin/products',{method:'POST',body:p})
    : await api(`/admin/products/${p.id}`,{method:'PATCH',body:p});
  // refresh local array
  const i=PRODUCTS.findIndex(x=>x.id===data.id);
  if(i>=0)PRODUCTS[i]=data; else PRODUCTS.push(data);
  renderProducts();
}
// DELETE
async function deleteProduct(id){
  await api(`/admin/products/${id}`,{method:'DELETE'});
  PRODUCTS=PRODUCTS.filter(x=>x.id!==id); renderProducts();
}
```

Mirror the same three‑line pattern for categories, home‑categories, certifications, orders,
customers. For **inquiries**, mark read / archive with:

```js
await api(`/admin/inquiries/${id}`,{method:'PATCH',body:{read:true}});      // or {archived:true}
```

For **settings** (your save-all button):

```js
async function saveSettings(){
  const s={};
  document.querySelectorAll('[data-setting]').forEach(el=>s[el.dataset.setting]=el.value);
  document.querySelectorAll('[data-toggle]').forEach(el=>s[el.dataset.toggle]=el.classList.contains('on'));
  await api('/admin/settings',{method:'PUT',body:s}); toast('Settings saved ✓');
}
```

For **product columns** of a category:

```js
await api(`/admin/product-columns/${catId}`,{method:'PUT',body:{columns:COLS[catId]}});
```

### B4 — Image upload (replace the base64 FileReader flow, optional)
You can keep base64 (it still saves fine), or upload to disk and store a URL:

```js
async function uploadImage(file){
  const fd=new FormData(); fd.append('file',file);
  const res=await fetch(`${API}/admin/upload`,{
    method:'POST', headers:{Authorization:`Bearer ${Auth.token}`}, body:fd
  });
  const data=await res.json();
  if(!data.ok) throw new Error(data.error);
  return data.data.url; // assign to prodImg / p.img
}
```

### B5 — Dashboard stats
```js
const {data:stats}=await api('/admin/dashboard/stats');
// stats.orders, stats.revenueDisplay, stats.activeProducts, stats.unreadInquiries, stats.ordersByStatus
```

---

## CORS reminder
Add wherever you serve the HTML from to `CORS_ORIGINS` in `.env`
(e.g. `http://localhost:5500` for Live Server, or your real domain).
