// Configuration
const CONFIG = {
  whatsappNumber: "6281234567890", // Ganti nomor WA kamu (format internasional)
  currency: "Rp",
  storeName: "The Firstdeyan Treasure",
};


// Product data (contoh; ganti sesuai katalog)
const PRODUCTS = [
  {
    id: "ring-aurora",
    title: "Cincin Aurora",
    category: "cincin",
    price: 3500000,
    img: "assets/img/products/ring-aurora.jpg",
    desc: "Cincin elegan dengan detail halus, cocok untuk lamaran dan momen spesial.",
    createdAt: "2025-11-10",
  },
  {
    id: "necklace-luna",
    title: "Kalung Luna",
    category: "kalung",
    price: 5200000,
    img: "assets/img/products/necklace-luna.jpg",
    desc: "Kalung dengan liontin berbentuk bulan, aura modern dan mewah.",
    createdAt: "2025-11-12",
  },
  {
    id: "bracelet-aria",
    title: "Gelang Aria",
    category: "gelang",
    price: 2800000,
    img: "assets/img/products/bracelet-aria.jpg",
    desc: "Gelang minimalis dengan finishing premium, nyaman dipakai harian.",
    createdAt: "2025-11-08",
  },
  {
    id: "earrings-stella",
    title: "Anting Stella",
    category: "anting",
    price: 3100000,
    img: "assets/img/products/earrings-stella.jpg",
    desc: "Anting bintang dengan kilau menawan, menonjolkan keanggunan.",
    createdAt: "2025-11-14",
  },
];

// Helpers
const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));
const formatIDR = (n) =>
  `${CONFIG.currency}${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

// Theme toggle
const themeToggle = el("#themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Mobile drawer
const drawer = el("#drawer");
el("#mobileMenu").addEventListener("click", () => drawer.classList.toggle("open"));
drawer.addEventListener("click", (e) => {
  if (e.target.classList.contains("drawer-link")) drawer.classList.remove("open");
});

// Search overlay
const searchOverlay = el("#searchOverlay");
el("#searchOpen").addEventListener("click", () => searchOverlay.classList.add("show"));
el("#searchClose").addEventListener("click", () => searchOverlay.classList.remove("show"));
searchOverlay.addEventListener("click", (e) => {
  if (e.target === searchOverlay) searchOverlay.classList.remove("show");
});

// Render products
const productGrid = el("#productGrid");
function renderProducts(items) {
  productGrid.innerHTML = items
    .map(
      (p) => `
    <article class="card" data-id="${p.id}" data-category="${p.category}">
      <img src="${p.img}" alt="${p.title}" />
      <div class="content">
        <div class="title">${p.title}</div>
        <div class="meta">${p.category[0].toUpperCase() + p.category.slice(1)}</div>
        <div class="price">${formatIDR(p.price)}</div>
        <div class="actions">
          <button class="mini ghost" data-action="view" data-id="${p.id}">👁️ Quick View</button>
          <button class="mini ghost" data-action="wish" data-id="${p.id}">🤍 Wishlist</button>
          <button class="mini primary" data-action="cart" data-id="${p.id}">🛒 Keranjang</button>
        </div>
      </div>
    </article>`
    )
    .join("");
}
renderProducts(PRODUCTS);

// Sorting
el("#sortSelect").addEventListener("change", (e) => {
  const val = e.target.value;
  let items = [...PRODUCTS];
  if (val === "priceLow") items.sort((a, b) => a.price - b.price);
  else if (val === "priceHigh") items.sort((a, b) => b.price - a.price);
  else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderProducts(items);
});

// Filtering
els(".tag").forEach((btn) =>
  btn.addEventListener("click", () => {
    els(".tag").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    const items = f === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === f);
    renderProducts(items);
  })
);

// Live search
const searchInput = el("#searchInput");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const items = PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
  );
  renderProducts(items);
});

// Modal Quick View
const modal = el("#modal");
const modalClose = el("#modalClose");
function openModal(p) {
  el("#modalImg").src = p.img;
  el("#modalTitle").textContent = p.title;
  el("#modalCategory").textContent = p.category[0].toUpperCase() + p.category.slice(1);
  el("#modalPrice").textContent = formatIDR(p.price);
  el("#modalDesc").textContent = p.desc;
  el("#modalWishlist").dataset.id = p.id;
  el("#modalCart").dataset.id = p.id;
  modal.classList.add("show");
}
modalClose.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

// Wishlist & Cart (localStorage)
const LS_WISH = "tft_wishlist";
const LS_CART = "tft_cart";
const getLS = (k) => JSON.parse(localStorage.getItem(k) || "[]");
const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function addToList(key, id) {
  const list = getLS(key);
  if (!list.includes(id)) list.push(id);
  setLS(key, list);
  renderPanel(key);
}

function removeFromList(key, id) {
  const list = getLS(key).filter((x) => x !== id);
  setLS(key, list);
  renderPanel(key);
}

// Panel (wishlist/cart)
const panel = el("#panel");
const panelTitle = el("#panelTitle");
const panelList = el("#panelList");
const panelClose = el("#panelClose");
const panelClear = el("#panelClear");
const panelCheckout = el("#panelCheckout");

function renderPanel(type = "cart") {
  const ids = getLS(type);
  const items = PRODUCTS.filter((p) => ids.includes(p.id));
  panelTitle.textContent = type === LS_WISH ? "Wishlist" : "Keranjang";
  panelList.innerHTML = items
    .map(
      (p) => `
    <div class="panel-item">
      <img src="${p.img}" alt="${p.title}" />
      <div>
        <div class="title">${p.title}</div>
        <div class="price">${formatIDR(p.price)}</div>
      </div>
      <button class="close" data-remove="${p.id}">Hapus</button>
    </div>`
    )
    .join("");
  panelCheckout.href = buildWaCheckout(items, type);
  panel.classList.add("show");
}
panelClose.addEventListener("click", () => panel.classList.remove("show"));
panelClear.addEventListener("click", () => {
  const type = panelTitle.textContent === "Wishlist" ? LS_WISH : LS_CART;
  setLS(type, []);
  renderPanel(type);
});
panelList.addEventListener("click", (e) => {
  const id = e.target.dataset.remove;
  if (id) {
    const type = panelTitle.textContent === "Wishlist" ? LS_WISH : LS_CART;
    removeFromList(type, id);
  }
});

// Product actions (delegation)
productGrid.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  const action = e.target.dataset.action;
  if (!id || !action) return;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  if (action === "view") openModal(product);
  if (action === "wish") addToList(LS_WISH, id);
  if (action === "cart") addToList(LS_CART, id);
});

// Modal buttons
el("#modalWishlist").addEventListener("click", (e) => addToList(LS_WISH, e.target.dataset.id));
el("#modalCart").addEventListener("click", (e) => addToList(LS_CART, e.target.dataset.id));

// Open panel buttons
el("#wishlistOpen").addEventListener("click", () => renderPanel(LS_WISH));
el("#cartOpen").addEventListener("click", () => renderPanel(LS_CART));

// Contact: build WA link
function buildWaLink(name = "", phone = "", msg = "") {
  const text = encodeURIComponent(
    `Halo ${CONFIG.storeName}, saya ${name} (${phone}).\n\n${msg}\n\nMohon info lebih lanjut.`
  );
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}
function buildWaCheckout(items, type) {
  const label = type === LS_WISH ? "Wishlist" : "Keranjang";
  const lines = items.map((p) => `- ${p.title} (${formatIDR(p.price)})`).join("\n");
  const msg = `${label} saya:\n${lines}\n\nTotal item: ${items.length}`;
  return buildWaLink("", "", msg);
}

// Attach WA link on contact info
const waLinkEl = el("#waLink");
waLinkEl.href = buildWaLink("", "", "Saya ingin konsultasi koleksi perhiasan.");

// Contact form -> WhatsApp
el("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = el("#cfName").value.trim();
  const phone = el("#cfPhone").value.trim();
  const msg = el("#cfMessage").value.trim();
  const url = buildWaLink(name, phone, msg);
  window.open(url, "_blank");
});

// Close overlay on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchOverlay.classList.remove("show");
    modal.classList.remove("show");
    panel.classList.remove("show");
    drawer.classList.remove("open");
  }
});

// Initial sort newest
el("#sortSelect").value = "newest";
