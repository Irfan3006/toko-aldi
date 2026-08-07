const SCRIPT_URL = window.BLOG_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbz0hGZcNGnDyhuXHbsBYSz-T5pVwAdXSPsR5scvP_ymd9IRx_Fq7tdw4ba6NE7CYKcF/exec'
function sanitizeHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'link', 'style', 'meta', 'base', 'applet'];
  dangerousTags.forEach(tag => {
    doc.querySelectorAll(tag).forEach(el => el.remove());
  });
  doc.querySelectorAll('*').forEach(el => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || (attr.value && attr.value.trim().toLowerCase().startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    }
    ['href', 'src', 'action', 'formaction', 'data'].forEach(attrName => {
      const val = el.getAttribute(attrName);
      if (val && val.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attrName);
      }
    });
  });
  return doc.body.innerHTML;
}

function validateInput(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().substring(0, maxLength);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

class API {
  static _pendingRequests = {};

  static async request(method, data = {}, showLoader = true) {
    if (showLoader) showLoading();
    try {
      let url = SCRIPT_URL;
      let options = { redirect: 'follow' };

      if (method === 'GET') {
        const queryParams = new URLSearchParams(data).toString();
        url = `${SCRIPT_URL}?${queryParams}`;
        options.method = 'GET';
      } else {
        options.method = 'POST';
        options.headers = { 'Content-Type': 'text/plain;charset=utf-8' };

        const token = Auth.getToken();
        const securedData = { ...data };
        if (token) {
          securedData._token = token;
        }
        options.body = JSON.stringify(securedData);
      }

      const response = await fetch(url, options);
      const result = await response.json();
      hideLoading();

      if (!result.success && result.message && result.message.includes('invalid or expired session')) {
        Auth.clearSession();
        return result;
      }

      return result;
    } catch (error) {
      hideLoading();
      console.error("API Error:", error);
      return { success: false, message: 'Network error or invalid response.' };
    }
  }

  static CACHE_DURATION = 1000 * 60 * 5;

  static async getPosts(forceRefresh = false) {
    const cacheKey = 'posts_cache';
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(cacheKey + '_time');

    if (!forceRefresh && cached && (Date.now() - cacheTime < this.CACHE_DURATION)) {
      return JSON.parse(cached);
    }

    if (this._pendingRequests[cacheKey]) {
      return this._pendingRequests[cacheKey];
    }

    this._pendingRequests[cacheKey] = (async () => {
      const res = await this.request('GET', { action: 'get_posts' });
      if (res.success) {
        sessionStorage.setItem(cacheKey, JSON.stringify(res));
        sessionStorage.setItem(cacheKey + '_time', Date.now());
      }
      delete this._pendingRequests[cacheKey];
      return res;
    })();

    return this._pendingRequests[cacheKey];
  }

  static async getPostById(id) {
    return this.request('GET', { action: 'get_posts', post_id: id });
  }

  static async getUsers(forceRefresh = false) {
    const cacheKey = 'users_cache';
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(cacheKey + '_time');

    if (!forceRefresh && cached && (Date.now() - cacheTime < this.CACHE_DURATION)) {
      return JSON.parse(cached);
    }

    const res = await this.request('POST', { action: 'get_users' });
    if (res.success) {
      sessionStorage.setItem(cacheKey, JSON.stringify(res));
      sessionStorage.setItem(cacheKey + '_time', Date.now());
    }
    return res;
  }

  static clearCache() {
    sessionStorage.removeItem('posts_cache');
    sessionStorage.removeItem('posts_cache_time');
    sessionStorage.removeItem('users_cache');
    sessionStorage.removeItem('users_cache_time');
  }

  static async login(username, password) {
    return this.request('POST', { action: 'login', username, password });
  }

  static async register(username, email, password) {
    return this.request('POST', { action: 'register', username, email, password });
  }

  static async pingIndexNow(slug) {
    if (!slug) return;
    const url = `https://sibra.store/blog/post/${slug}`;
    const key = "feb31c37bdb84d9faa88adb647f0a6c1";
    const payload = {
      host: "sibra.store",
      key: key,
      keyLocation: `https://sibra.store/${key}.txt`,
      urlList: [url]
    };

    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow'
    ];

    endpoints.forEach(async (endpoint) => {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('IndexNow client ping:', e);
      }
    });
  }

  static async createPost(postData) {
    this.clearCache();
    postData.title = validateInput(postData.title, 200);
    postData.category = validateInput(postData.category, 100);
    postData.thumbnail = validateInput(postData.thumbnail, 1000);
    if (postData.content) postData.content = sanitizeHTML(postData.content);
    const res = await this.request('POST', { action: 'create_post', title: postData.title, category: postData.category, thumbnail: postData.thumbnail, content: postData.content });
    if (res && res.success && res.data && res.data.slug) {
      this.pingIndexNow(res.data.slug);
    }
    return res;
  }

  static async updatePost(postData) {
    this.clearCache();
    if (postData.title) postData.title = validateInput(postData.title, 200);
    if (postData.category) postData.category = validateInput(postData.category, 100);
    if (postData.thumbnail) postData.thumbnail = validateInput(postData.thumbnail, 1000);
    if (postData.content) postData.content = sanitizeHTML(postData.content);
    const res = await this.request('POST', { action: 'update_post', id: postData.id, title: postData.title, category: postData.category, thumbnail: postData.thumbnail, content: postData.content });
    if (res && res.success && res.data && res.data.slug) {
      this.pingIndexNow(res.data.slug);
    }
    return res;
  }

  static async deletePost(id) {
    this.clearCache();
    return this.request('POST', { action: 'delete_post', id });
  }

  static async deleteUser(id) {
    this.clearCache();
    return this.request('POST', { action: 'delete_user', id });
  }

  static async cleanupSpam() {
    this.clearCache();
    return this.request('POST', { action: 'cleanup_spam' });
  }

  static async updateProfile(profileData) {
    if (profileData.avatar && profileData.avatar.trim() !== '') {
      const url = profileData.avatar.trim().toLowerCase();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return { success: false, message: 'Avatar URL must start with http:// or https://' };
      }
    }
    if (profileData.bio) {
      profileData.bio = profileData.bio.substring(0, 500);
    }
    return this.request('POST', { action: 'update_profile', bio: profileData.bio, avatar: profileData.avatar });
  }

  static async logout() {
    return this.request('POST', { action: 'logout' }, false);
  }
}

let _loadingCount = 0;

function showLoading() {
  _loadingCount++;
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.remove('done');
    loader.classList.add('active');
  }
}

function hideLoading() {
  _loadingCount = Math.max(0, _loadingCount - 1);
  if (_loadingCount > 0) return;

  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.remove('active');
    loader.classList.add('done');

    setTimeout(() => {
      if (!loader.classList.contains('active')) {
        loader.classList.remove('done');
        loader.style.width = '0%';
      }
    }, 600);
  }
}

function showToast(icon, title, text = '') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  } else {
    alert(`${title}: ${text}`);
  }
}

class Auth {
  static setSession(user, token) {
    localStorage.setItem('sibra_blog_user', JSON.stringify(user));
    if (token) localStorage.setItem('sibra_blog_token', token);
  }

  static getSession() {
    try {
      const data = localStorage.getItem('sibra_blog_user');
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (!parsed || !parsed.id || !parsed.username || !parsed.role) {
        localStorage.removeItem('sibra_blog_user');
        return null;
      }
      const role = parsed.role.toString().trim().toLowerCase();
      if (!['user', 'admin'].includes(role)) {
        localStorage.removeItem('sibra_blog_user');
        return null;
      }
      parsed.role = role;
      return parsed;
    } catch (e) {
      localStorage.removeItem('sibra_blog_user');
      return null;
    }
  }

  static clearSession() {
    const token = localStorage.getItem('sibra_blog_token');
    if (token) {
      try { API.logout(); } catch (e) { }
    }
    localStorage.removeItem('sibra_blog_user');
    localStorage.removeItem('sibra_blog_token');
    window.location.href = '/blog/login';
  }

  static getToken() {
    return localStorage.getItem('sibra_blog_token') || null;
  }

  static isLoggedIn() {
    return this.getSession() !== null;
  }

  static isAdmin() {
    const user = this.getSession();
    return user && user.role === 'admin';
  }

  static requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/blog/login';
    }
  }

  static requireAdmin() {
    if (!this.isAdmin()) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Kembali ke Beranda'
        }).then(() => {
          window.location.href = '/blog';
        });
      } else {
        window.location.href = '/blog';
      }
    }
  }

  static checkAuthRedirect() {
    if (this.isLoggedIn()) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'info',
          title: 'Sudah Login',
          text: 'Anda sudah masuk ke akun Anda.',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Ke Beranda'
        }).then(() => {
          window.location.href = '/blog';
        });
      } else {
        window.location.href = '/blog';
      }
    }
  }
}

function showPostSkeletonLoader() {
  let overlay = document.getElementById('skeleton-page-overlay');
  if (!overlay) {
    const html = `
      <div id="skeleton-page-overlay" class="skeleton-page-overlay">
        <div class="skeleton-nav">
          <div class="skeleton-nav-content container">
            <div class="skeleton-brand skeleton-box"></div>
            <div class="skeleton-nav-links">
              <div class="skeleton-nav-link skeleton-box"></div>
              <div class="skeleton-nav-link skeleton-box"></div>
              <div class="skeleton-nav-link skeleton-box"></div>
            </div>
          </div>
        </div>
        <div class="container my-5" style="max-width: 850px;">
          <div class="skeleton-breadcrumb mb-4">
            <div class="skeleton-box" style="width: 150px; height: 16px;"></div>
          </div>
          <div class="text-center mb-5">
            <div class="skeleton-box mb-3 skeleton-badge" style="width: 100px; height: 28px; border-radius: 10px;"></div>
            <div class="skeleton-box mb-3 skeleton-title" style="width: 80%; height: 45px; border-radius: 12px;"></div>
            <div class="skeleton-box mb-4 skeleton-title" style="width: 60%; height: 35px; border-radius: 12px; display: inline-block;"></div>
            <div class="d-flex align-items-center justify-content-center gap-3">
              <div class="skeleton-box skeleton-avatar" style="width: 32px; height: 32px; border-radius: 50%;"></div>
              <div class="skeleton-box" style="width: 120px; height: 16px;"></div>
              <div class="skeleton-box" style="width: 100px; height: 16px;"></div>
            </div>
          </div>
          <div class="skeleton-hero-img skeleton-box mb-5" style="width: 100%; aspect-ratio: 16/9; border-radius: 24px; height: auto;"></div>
          <div class="skeleton-body-content">
            <div class="skeleton-box mb-3" style="width: 100%; height: 16px;"></div>
            <div class="skeleton-box mb-3" style="width: 96%; height: 16px;"></div>
            <div class="skeleton-box mb-3" style="width: 98%; height: 16px;"></div>
            <div class="skeleton-box mb-3" style="width: 92%; height: 16px;"></div>
            <div class="skeleton-box mb-4" style="width: 65%; height: 16px;"></div>
            <div class="skeleton-box mb-3" style="width: 100%; height: 24px; margin-top: 35px; border-radius: 8px;"></div>
            <div class="skeleton-box mb-3" style="width: 40%; height: 24px; border-radius: 8px;"></div>
            <div class="skeleton-box mb-3" style="width: 98%; height: 16px; margin-top: 20px;"></div>
            <div class="skeleton-box mb-3" style="width: 95%; height: 16px;"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    overlay = document.getElementById('skeleton-page-overlay');
  }
  overlay.offsetHeight;
  overlay.classList.add('active');
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const overlay = document.getElementById('skeleton-page-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 50 });
  }

  updateNavbar();

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');

      if (href && (href.startsWith('/blog/post/') || href.includes('/blog/post/'))) {
        if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && link.target !== '_blank') {
          e.preventDefault();
          showPostSkeletonLoader();
          setTimeout(() => {
            window.location.href = href;
          }, 50);
          return;
        }
      }

      if (Auth.isLoggedIn()) {
        if (href && href.includes('/blog/login')) {
          e.preventDefault();
          const user = Auth.getSession();
          Swal.fire({
            icon: 'info',
            title: `Halo, ${escapeHTML(user.username)}!`,
            text: 'Anda sudah masuk ke akun Anda. Ingin menulis sesuatu hari ini?',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#f1f5f9',
            confirmButtonText: '<i class="bi bi-pencil-square me-2"></i> Tulis Postingan',
            cancelButtonText: 'Ke Profil Saya'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/blog/create-post';
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              window.location.href = '/blog/profile';
            }
          });
        }
      }
    }
  });
});

function updateNavbar() {
  const user = Auth.getSession();
  const authNav = document.getElementById('auth-nav');
  if (!authNav) return;

  if (user) {
    const safeUsername = escapeHTML(user.username);
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff`;
    const safeAvatar = escapeHTML(user.avatar || defaultAvatar);
    let adminLink = user.role === 'admin' ? `<li><a class="dropdown-item" href="/blog/admin"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>` : '';

    authNav.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${safeAvatar}" class="rounded-circle-img" alt="Avatar" referrerpolicy="no-referrer" onerror="this.src='${defaultAvatar}'">
          <span>${safeUsername}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="navbarDropdown">
          ${adminLink}
          <li><a class="dropdown-item" href="/blog/profile"><i class="bi bi-person me-2"></i> Profil</a></li>
          <li><a class="dropdown-item" href="/blog/create-post"><i class="bi bi-pencil-square me-2"></i> Tulis Postingan</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="Auth.clearSession()"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
        </ul>
      </li>
    `;
  } else {
    authNav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="/blog/login">Login</a>
      </li>
    `;
  }
}

function renderNavbar() {
  return `
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
      <a href="/" class="navbar-brand d-flex align-items-center gap-3 text-decoration-none group">
        <div class="brand-logo-box w-9 h-9 flex items-center justify-center rounded-xl shadow-lg group-hover:scale-105 transition-transform" style="background-color: var(--accent);">
          <i class="bi bi-shop text-white fs-5"></i>
        </div>
        <span class="brand-logo-text text-xl font-black tracking-tight uppercase" style="color: var(--headline);">ALDI ARTIKEL</span>
      </a>
      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <i class="bi bi-list fs-1"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="/">Toko Aldi Utama</a></li>
          <li class="nav-item"><a class="nav-link" href="/blog">Blog Home</a></li>
          <li class="nav-item"><a class="nav-link" href="/blog/explore">Eksplorasi</a></li>
          <li class="nav-item"><a class="nav-link" href="/blog/categories">Kategori</a></li>
        </ul>
        <ul class="navbar-nav align-items-lg-center gap-2" id="auth-nav">
          <li class="nav-item d-none d-lg-block">
            <a class="nav-link text-primary fw-bold" href="/blog/create-post">
              <i class="bi bi-pencil-square me-1"></i> Tulis Artikel
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `;
}

function renderFooter() {
  return `
  <footer class="py-5 mt-5 border-top border-secondary border-opacity-10">
    <div class="container text-center">
      <div class="d-flex justify-content-center flex-wrap gap-3 mb-3" style="font-size: 0.85rem;">
        <a href="/" class="text-muted text-decoration-none hover-accent">Toko Aldi Utama</a>
        <span class="text-muted opacity-25">|</span>
        <a href="/blog" class="text-muted text-decoration-none hover-accent">Aldi Artikel</a>
        <span class="text-muted opacity-25">|</span>
        <a href="/#alamat" class="text-muted text-decoration-none hover-accent">Lokasi Banguntapan, Bantul</a>
      </div>
      <p class="text-muted mb-2" style="font-size: 0.9rem;">&copy; ${new Date().getFullYear()} Aldi Artikel - Toko Aldi Minimarket Jogja Terlengkap. Semua Hak Dilindungi.</p>
    </div>
  </footer>
  `;
}

function renderLoader() {
  return `<div class="top-loader" id="global-loader"></div>`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  let str = String(dateString).trim();
  if (!str) return '';

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(str)) {
    str = str.replace(" ", "T");
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/i.test(str)) {
    str += "Z";
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return String(dateString);

  try {
    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    const parts = formatter.formatToParts(d);
    const partMap = {};
    for (const part of parts) {
      partMap[part.type] = part.value;
    }

    let dayName = partMap.weekday || "";
    if (dayName) {
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    }

    const day = partMap.day || "01";
    const month = partMap.month || "01";
    const year = partMap.year || "2000";
    const hour = partMap.hour || "00";
    const minute = partMap.minute || "00";

    return `${dayName}, ${day}/${month}/${year} - ${hour}:${minute} WIB`;
  } catch (e) {
    const utcMs = d.getTime();
    const wibDate = new Date(utcMs + 7 * 60 * 60 * 1000);
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = days[wibDate.getUTCDay()];
    const day = String(wibDate.getUTCDate()).padStart(2, "0");
    const month = String(wibDate.getUTCMonth() + 1).padStart(2, "0");
    const year = wibDate.getUTCFullYear();
    const hours = String(wibDate.getUTCHours()).padStart(2, "0");
    const minutes = String(wibDate.getUTCMinutes()).padStart(2, "0");
    return `${dayName}, ${day}/${month}/${year} - ${hours}:${minutes} WIB`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const navbarEl = document.getElementById('navbar-placeholder');
  const footerEl = document.getElementById('footer-placeholder');

  if (navbarEl) navbarEl.innerHTML = renderNavbar();
  if (footerEl) footerEl.innerHTML = renderFooter();

  document.body.insertAdjacentHTML('beforeend', renderLoader());
  updateNavbar();

  ProgressiveImage.observe();
});

class ProgressiveImage {
  static _observer = null;
  static _observed = new WeakSet();

  static observe() {
    if (!this._observer) {
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const wrapper = entry.target;
            const img = wrapper.querySelector('img');
            if (img) this._loadImage(wrapper, img);
            this._observer.unobserve(wrapper);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });
    }

    document.querySelectorAll('.img-progressive').forEach(wrapper => {
      if (!this._observed.has(wrapper)) {
        this._observed.add(wrapper);

        const img = wrapper.querySelector('img');
        if (!img) return;

        if (img.complete && img.naturalWidth > 0) {
          wrapper.classList.add('loaded');
        } else {
          this._observer.observe(wrapper);
        }
      }
    });
  }

  static _loadImage(wrapper, img) {
    const onLoad = () => {
      wrapper.classList.add('loaded');
      wrapper.classList.remove('error');
      cleanup();
    };

    const onError = () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src !== fallback) {
        img.src = fallback;
        return;
      }
      wrapper.classList.add('error', 'loaded');
      cleanup();
    };

    const cleanup = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    if (img.complete) {
      if (img.naturalWidth > 0) {
        onLoad();
      } else {
        onError();
      }
    }
  }

  static cardThumbnail(src, alt = '', fallback = 'https://ui-avatars.com/api/?name=Blog&size=512', extraClass = '', extraStyle = '') {
    return `
      <div class="img-progressive">
        <img src="${src}" 
             class="card-img-top ${extraClass}" 
             alt="${alt}" 
             loading="lazy"
             data-fallback="${fallback}"
             ${extraStyle ? `style="${extraStyle}"` : ''}
             referrerpolicy="no-referrer">
      </div>
    `;
  }

  static heroThumbnail(src, alt = '', fallback = 'https://ui-avatars.com/api/?name=Blog&size=512') {
    return `
      <div class="img-progressive post-thumb-wrapper">
        <img src="${src}" 
             class="post-thumbnail" 
             alt="${alt}"
             data-fallback="${fallback}"
             referrerpolicy="no-referrer">
      </div>
    `;
  }

  static inlineThumbnail(src, alt = '', size = '85px', extraClass = '', fallback = 'https://ui-avatars.com/api/?name=Blog&size=512') {
    return `
      <div class="img-progressive ${extraClass}" style="width:${size};height:${size};flex-shrink:0;">
        <img src="${src}" 
             alt="${alt}" 
             loading="lazy"
             data-fallback="${fallback}"
             referrerpolicy="no-referrer"
             style="width:100%;height:100%;object-fit:cover;">
      </div>
    `;
  }
}
