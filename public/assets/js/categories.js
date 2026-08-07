const BLOG_CATEGORIES = [
  "Sembako & Kebutuhan Pokok",
  "Beras & Tepung",
  "Minyak Goreng & Mentega",
  "Gula, Garam & Bumbu Dapur",
  "Telur & Olahan Susu",
  "Mie Instan & Pasta",
  "Makanan & Minuman Ringan",
  "Kopi, Teh & Minuman Sachet",
  "Air Mineral & Minuman Dingin",
  "Perlengkapan Mandi & Sabun",
  "Deterjen & Pembersih Rumah",
  "Perlengkapan Bayi & Anak",
  "Perlengkapan Dapur & Plastik",
  "Promo Sembako Jogja",
  "Paket Hemat Belanja Bulanan",
  "Tips Belanja Hemat",
  "Panduan Menyimpan Sembako",
  "Informasi Toko Aldi Banguntapan",
  "Jam Buka & Operasional",
  "Metode Pembayaran QRIS & Cash",
  "Pengumuman & Update Toko",
  "Umum"
];

function populateCategorySelect(selectId, selectedValue = "") {
  const select = document.getElementById(selectId);
  if (!select) return;

  const uniqueCategories = [...new Set(BLOG_CATEGORIES)].sort();

  select.innerHTML = '<option value="" disabled selected>Pilih Kategori...</option>';
  uniqueCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === selectedValue) opt.selected = true;
    select.appendChild(opt);
  });

  initSearchableSelect(select, uniqueCategories, selectedValue);
}

function initSearchableSelect(originalSelect, categories, selectedValue) {
  originalSelect.style.display = 'none';

  const existingContainer = originalSelect.parentNode.querySelector('.search-select-container');
  if (existingContainer) existingContainer.remove();

  const container = document.createElement('div');
  container.className = 'search-select-container';
  originalSelect.parentNode.insertBefore(container, originalSelect);

  const trigger = document.createElement('div');
  trigger.className = 'form-select search-select-trigger';
  trigger.textContent = selectedValue || "Pilih Kategori...";
  trigger.style.cursor = 'pointer';
  container.appendChild(trigger);

  const menu = document.createElement('div');
  menu.className = 'search-select-menu';
  container.appendChild(menu);

  const searchBox = document.createElement('div');
  searchBox.className = 'search-select-search-box';
  searchBox.innerHTML = `<input type="text" class="search-select-input-field" placeholder="Cari kategori sembako...">`;
  menu.appendChild(searchBox);

  const searchInput = searchBox.querySelector('input');
  const optionsList = document.createElement('div');
  optionsList.className = 'search-select-options-list';
  menu.appendChild(optionsList);

  function renderOptions(filter = "") {
    optionsList.innerHTML = "";
    const filtered = categories.filter(c => c.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0) {
      optionsList.innerHTML = `<div class="p-3 text-muted">Kategori tidak ditemukan</div>`;
      return;
    }

    filtered.forEach(cat => {
      const opt = document.createElement('div');
      opt.className = `search-select-option ${cat === originalSelect.value ? 'selected' : ''}`;
      opt.textContent = cat;
      opt.onclick = () => {
        originalSelect.value = cat;
        trigger.textContent = cat;
        menu.classList.remove('show');
        originalSelect.dispatchEvent(new Event('change'));
      };
      optionsList.appendChild(opt);
    });
  }

  renderOptions();

  trigger.onclick = (e) => {
    e.stopPropagation();
    const isShowing = menu.classList.contains('show');
    document.querySelectorAll('.search-select-menu').forEach(m => m.classList.remove('show'));
    if (!isShowing) {
      menu.classList.add('show');
      searchInput.value = "";
      renderOptions();
      searchInput.focus();
    }
  };

  searchInput.onclick = (e) => e.stopPropagation();
  searchInput.oninput = (e) => renderOptions(e.target.value);

  document.addEventListener('click', () => menu.classList.remove('show'));
}

function renderTrendingCategories(containerId, limit = 10) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const displayCats = [...BLOG_CATEGORIES]
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);

  container.innerHTML = displayCats.map(cat => `
    <a href="/blog/explore?category=${encodeURIComponent(cat)}" class="badge bg-light text-dark border px-3 py-2 text-decoration-none hover-accent">
      ${cat}
    </a>
  `).join('');
}
