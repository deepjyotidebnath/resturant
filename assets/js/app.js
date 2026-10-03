/* ===== CONFIG: edit these ===== */
const CFG = {
  name: "Spice Route Kitchen",
  tagline: "Tandoor-fired North Indian classics, made fresh every day.",
  whatsapp: "919999999999",           // country code + number, no + or spaces
  phone: "+91 99999 99999",
  address: "12 Station Road, Cooch Behar, West Bengal 736101",
  mapQuery: "Spice Route Kitchen Cooch Behar",
  hours: [["Mon – Fri","12:00 – 22:30"],["Sat – Sun","11:30 – 23:00"]],
  currency: "₹"
};

/* ===== MENU: img = file inside assets/images/ ===== */
const MENU = {
  "Starters": [
    {name:"Paneer Tikka", desc:"Charred cottage cheese, mint chutney", price:260, veg:true, img:"paneer-tikka.jpg"},
    {name:"Chicken Malai Tikka", desc:"Creamy, mildly spiced, tandoor-fired", price:320, veg:false, img:"chicken-malai-tikka.jpg"},
    {name:"Veg Seekh Kebab", desc:"Minced vegetables and herbs", price:230, veg:true, img:"veg-seekh-kebab.jpg"},
    {name:"Fish Amritsari", desc:"Crisp gram-flour batter, ajwain", price:340, veg:false, img:"fish-amritsari.jpg"}
  ],
  "Mains": [
    {name:"Butter Chicken", desc:"Tomato-butter gravy, kasuri methi", price:380, veg:false, img:"butter-chicken.jpg"},
    {name:"Paneer Butter Masala", desc:"Soft paneer in rich creamy gravy", price:320, veg:true, img:"paneer-butter-masala.jpg"},
    {name:"Dal Makhani", desc:"Slow-cooked black lentils, cream", price:260, veg:true, img:"dal-makhani.jpg"},
    {name:"Mutton Rogan Josh", desc:"Kashmiri-style slow-braised mutton", price:460, veg:false, img:"mutton-rogan-josh.jpg"},
    {name:"Chole Masala", desc:"Spiced chickpeas, pomegranate", price:240, veg:true, img:"chole-masala.jpg"}
  ],
  "Breads & Rice": [
    {name:"Butter Naan", desc:"Tandoor-baked, brushed with butter", price:60, veg:true, img:"butter-naan.jpg"},
    {name:"Garlic Naan", desc:"Fresh garlic and coriander", price:75, veg:true, img:"garlic-naan.jpg"},
    {name:"Lachha Paratha", desc:"Flaky layered whole-wheat bread", price:70, veg:true, img:"lachha-paratha.jpg"},
    {name:"Chicken Biryani", desc:"Dum-cooked basmati, saffron", price:360, veg:false, img:"chicken-biryani.jpg"},
    {name:"Jeera Rice", desc:"Basmati tempered with cumin", price:160, veg:true, img:"jeera-rice.jpg"}
  ],
  "Desserts & Drinks": [
    {name:"Gulab Jamun", desc:"Warm milk dumplings in rose syrup", price:120, veg:true, img:"gulab-jamun.jpg"},
    {name:"Rasmalai", desc:"Cottage cheese discs in saffron milk", price:140, veg:true, img:"rasmalai.jpg"},
    {name:"Sweet Lassi", desc:"Thick chilled yogurt drink", price:110, veg:true, img:"sweet-lassi.jpg"},
    {name:"Masala Chai", desc:"Ginger and cardamom tea", price:60, veg:true, img:"masala-chai.jpg"},
    {name:"Fresh Lime Soda", desc:"Sweet, salted or mixed", price:90, veg:true, img:"fresh-lime-soda.jpg"}
  ]
};

const GALLERY = ["gallery-1.jpg","gallery-2.jpg","gallery-3.jpg","gallery-4.jpg","gallery-5.jpg","gallery-6.jpg"];

/* ===== helpers ===== */
const $ = id => document.getElementById(id);
const IMG_DIR = "assets/images/";
const PLACEHOLDER = IMG_DIR + "placeholder.svg";
const money = n => CFG.currency + n.toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dialog = $("dlg");
const params = new URLSearchParams(location.search);
const table = params.get("table");

/* ===== static content ===== */
document.title = CFG.name + " — Menu, Reservations & Orders";
$("brand").textContent = CFG.name;
$("hName").textContent = CFG.name;
$("tag").textContent = CFG.tagline;
$("addr").textContent = CFG.address;
$("mapBtn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CFG.mapQuery);
$("callBtn").href = "tel:" + CFG.phone.replace(/\s/g, "");
$("callBtn").textContent = "Call " + CFG.phone;
$("hours").innerHTML = CFG.hours.map(h => `<tr><td>${h[0]}</td><td>${h[1]}</td></tr>`).join("");
$("foot").textContent = "© " + new Date().getFullYear() + " " + CFG.name;
if (table) { $("tableBadge").style.display = "inline-block"; $("tableBadge").textContent = "Table " + table; }

/* image fallback: any <img> that fails to load gets the placeholder */
document.addEventListener("error", e => {
  const t = e.target;
  if (t.tagName === "IMG" && !t.dataset.failed) { t.dataset.failed = "1"; t.src = PLACEHOLDER; }
}, true);

/* ===== menu + cart ===== */
const cart = {};                       // name -> {price, qty}
let activeTab = Object.keys(MENU)[0];

function renderTabs() {
  $("tabs").innerHTML = Object.keys(MENU)
    .map(t => `<button class="${t === activeTab ? "on" : ""}" data-tab="${esc(t)}">${esc(t)}</button>`).join("");
}
function renderItems() {
  $("items").innerHTML = MENU[activeTab].map(i => {
    const q = cart[i.name] ? cart[i.name].qty : 0;
    const ctl = q
      ? `<div class="qty"><button data-act="dec" data-n="${esc(i.name)}">−</button><b>${q}</b><button data-act="inc" data-n="${esc(i.name)}">+</button></div>`
      : `<button class="add" data-act="inc" data-n="${esc(i.name)}">Add</button>`;
    return `<article class="card">
      <img class="dish-img" src="${IMG_DIR + i.img}" alt="${esc(i.name)}" loading="lazy" width="104" height="104">
      <div class="info">
        <h3><span class="dot ${i.veg ? "veg" : "nonveg"}" title="${i.veg ? "Vegetarian" : "Non-vegetarian"}"></span>${esc(i.name)}</h3>
        <p>${esc(i.desc)}</p>
        <span class="price">${money(i.price)}</span>
      </div>
      ${ctl}
    </article>`;
  }).join("");
}
function findItem(n) { for (const k in MENU) { const f = MENU[k].find(x => x.name === n); if (f) return f; } }

function updateCart() {
  const lines = Object.entries(cart);
  const count = lines.reduce((s, [, v]) => s + v.qty, 0);
  const total = lines.reduce((s, [, v]) => s + v.qty * v.price, 0);
  $("cart").classList.toggle("show", count > 0);
  $("cartTxt").textContent = count + (count === 1 ? " item" : " items") + " · " + money(total);
  $("lines").innerHTML = lines.map(([n, v]) =>
    `<div class="line"><span>${v.qty} × ${esc(n)}</span><span>${money(v.qty * v.price)}</span></div>`).join("");
  $("tot").textContent = money(total);
  if (!count && dialog.open) dialog.close();
}

$("tabs").addEventListener("click", e => {
  const b = e.target.closest("button[data-tab]"); if (!b) return;
  activeTab = b.dataset.tab; renderTabs(); renderItems();
});
$("items").addEventListener("click", e => {
  const b = e.target.closest("button[data-act]"); if (!b) return;
  const n = b.dataset.n, it = findItem(n);
  if (b.dataset.act === "inc") { cart[n] = cart[n] || {price: it.price, qty: 0}; cart[n].qty++; }
  else if (cart[n] && --cart[n].qty <= 0) delete cart[n];
  renderItems(); updateCart();
});
$("cartBtn").onclick = () => dialog.showModal();

$("send").onclick = () => {
  const lines = Object.entries(cart);
  if (!lines.length) return;
  const total = lines.reduce((s, [, v]) => s + v.qty * v.price, 0);
  let msg = `*New order — ${CFG.name}*\n`;
  if (table) msg += `Table: ${table}\n`;
  msg += `Name: ${$("oname").value || "-"}\nType: ${$("otype").value}\n\n`;
  msg += lines.map(([n, v]) => `${v.qty} x ${n} — ${money(v.qty * v.price)}`).join("\n");
  msg += `\n\n*Total: ${money(total)}*`;
  if ($("onote").value.trim()) msg += `\nNotes: ${$("onote").value.trim()}`;
  window.open("https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
};

/* ===== reservation ===== */
const rf = $("rf");
(function initForm() {
  const t = rf.elements.time;
  for (let h = 12; h <= 22; h++) for (const m of ["00", "30"]) {
    if (h === 22 && m === "30") continue;
    const hh = h > 12 ? h - 12 : h, ap = h >= 12 ? "PM" : "AM";
    t.insertAdjacentHTML("beforeend", `<option>${hh}:${m} ${ap}</option>`);
  }
  const g = rf.elements.guests;
  for (let i = 1; i <= 12; i++) g.insertAdjacentHTML("beforeend", `<option value="${i}">${i} ${i === 1 ? "guest" : "guests"}</option>`);
  g.value = "2";
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  rf.elements.date.min = today.toISOString().slice(0, 10);
})();
rf.addEventListener("submit", e => {
  e.preventDefault();
  const f = rf.elements;
  const msg = `*Table reservation — ${CFG.name}*\nName: ${f.name.value}\nPhone: ${f.phone.value}\nDate: ${f.date.value}\nTime: ${f.time.value}\nGuests: ${f.guests.value}\nSeating: ${f.seat.value}` +
    (f.note.value.trim() ? `\nRequest: ${f.note.value.trim()}` : "");
  window.open("https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  $("rok").textContent = "Opening WhatsApp — send the message to confirm your booking.";
});

/* ===== gallery ===== */
$("gal").innerHTML = GALLERY.map((g, i) =>
  `<img src="${IMG_DIR + g}" alt="${esc(CFG.name)} photo ${i + 1}" loading="lazy">`).join("");

/* ===== table QR ===== */
function drawQR() {
  const n = Math.max(1, parseInt($("tnum").value, 10) || 1);
  const url = location.origin + location.pathname + "?table=" + n;
  $("qrUrl").textContent = url;
  $("qr").innerHTML = "";
  if (typeof QRCode === "undefined") { $("qr").textContent = "QR library failed to load (check internet)."; return; }
  new QRCode($("qr"), {text: url, width: 200, height: 200});
}
$("tnum").addEventListener("input", drawQR);
$("dl").onclick = () => {
  const c = $("qr").querySelector("canvas"), im = $("qr").querySelector("img");
  const a = document.createElement("a");
  a.download = "table-" + $("tnum").value + "-qr.png";
  a.href = c ? c.toDataURL("image/png") : (im ? im.src : "");
  if (a.href) a.click();
};

/* ===== init ===== */
renderTabs(); renderItems(); updateCart(); drawQR();
