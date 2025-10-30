# Toko Aldi Sembako - Landing Page

Website landing page modern dan minimalis untuk **Toko Aldi Sembako**, toko sembako terpercaya di Banguntapan, Bantul, Yogyakarta.

## 🌐 Live Demo

Website ini dapat diakses melalui:
[https://toko-aldi.vercel.app/](https://toko-aldi.vercel.app/)

## 📋 Tentang Proyek

Landing page ini dibuat untuk memudahkan pelanggan menemukan informasi tentang Toko Aldi Sembako, termasuk:
- Lokasi dan alamat lengkap
- Jam operasional
- Kontak WhatsApp
- Ulasan pelanggan
- Metode pembayaran (Cash & QRIS)
- Promo dan penawaran khusus

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur semantik
- **Bootstrap 5.3.3** - Framework CSS responsif
- **AOS (Animate On Scroll)** - Animasi scroll
- **Animate.css** - Animasi CSS
- **Bootstrap Icons** - Ikon
- **JavaScript Vanilla** - Interaktivitas
- **Google Fonts (Inter)** - Typography

## 📁 Struktur Proyek

```
toko-aldi-sembako-landing/
├── index.html              # Halaman utama
├── assets/
│   ├── css/
│   │   └── styles.css     # Custom CSS
│   ├── js/
│   │   └── script.js      # Custom JavaScript
│   └── images/            # Gambar dan aset visual
│       └── .gitkeep
├── README-TOKO.md         # Dokumentasi proyek
└── .gitignore             # File yang diabaikan Git
```

## ✨ Fitur Utama

### 1. Hero Section
- Headline menarik dengan CTA WhatsApp
- Informasi metode pembayaran (Cash & QRIS)
- Animasi fade-in untuk visual yang menarik

### 2. Liputan Pers & Ulasan
- Ulasan dari Medium
- Review pelanggan dari Google Maps
- Rating bintang 5

### 3. Tentang/Pengalaman Belanja
- Deskripsi lengkap tentang toko
- Typography yang nyaman dibaca
- Paragraf informatif

### 4. Jam Operasional
- Jadwal lengkap Senin - Minggu
- Buka setiap hari 06.30 - 23.00
- Visual yang jelas dan mudah dibaca

### 5. Lokasi & Alamat
- Alamat lengkap dengan detail
- Embed Google Maps interaktif
- Kontak telepon dan WhatsApp

### 6. Section Promo
- Placeholder untuk promo mendatang
- Desain card yang menarik
- CTA untuk informasi lebih lanjut

### 7. Footer
- Informasi kontak ringkas
- Link cepat ke WhatsApp
- Copyright dinamis

## 🎨 Desain & UX

### Palet Warna
- **Primary**: `#2D9C7F` (Teal/Hijau)
- **Secondary**: `#1A7A5E` (Hijau Tua)
- **Accent**: `#45B39D` (Teal Terang)
- **Background**: Putih dengan aksen abu-abu muda

### Prinsip Desain
- **Minimalis**: Layout bersih dengan ruang putih luas
- **Modern**: Menggunakan komponen Bootstrap terkini
- **Responsif**: Optimal di semua ukuran layar
- **Accessible**: ARIA labels dan semantic HTML

## 🔍 SEO & Optimasi

### Meta Tags
- Title tag dengan kata kunci lokal
- Meta description yang informatif
- Keywords untuk SEO lokal

### Open Graph & Twitter Card
- Optimasi untuk sharing di media sosial
- Metadata lengkap untuk preview

### Structured Data (JSON-LD)
- Schema.org `GroceryStore` type
- Informasi lengkap:
  - Alamat dan koordinat geo
  - Jam operasional
  - Kontak
  - Metode pembayaran
  - Rating agregat

### Performance
- Preconnect ke CDN untuk load time lebih cepat
- Lazy loading untuk iframe Maps
- Minifikasi aset
- Optimasi gambar (ukuran ringan)

## 📱 Responsive Design

Website dioptimalkan untuk berbagai perangkat:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 992px)
- 💻 Desktop (> 992px)

## 🚀 Deploy ke GitHub Pages

### Langkah-langkah:

1. **Push ke Repository**
   ```bash
   git add .
   git commit -m "Initial commit: Toko Aldi Sembako landing page"
   git push origin main
   ```

2. **Aktifkan GitHub Pages**
   - Buka repository di GitHub
   - Masuk ke Settings > Pages
   - Pilih branch: `main`
   - Pilih folder: `/` (root)
   - Klik Save

3. **Tambahkan .nojekyll** (opsional)
   Jika diperlukan, buat file `.nojekyll` di root untuk menonaktifkan Jekyll processing:
   ```bash
   touch .nojekyll
   git add .nojekyll
   git commit -m "Add .nojekyll for GitHub Pages"
   git push origin main
   ```

4. **Akses Website**
   Website akan tersedia di:
   `https://[username].github.io/toko-aldi-sembako-landing/`

## 📞 Kontak Toko Aldi Sembako

- **Alamat**: Jalan Janti Gang Harjuna No. 45, Banguntapan, Bantul, DIY 55198
- **Telepon**: +62 812-3397-4201
- **WhatsApp**: [081233974201](https://wa.me/6281233974201)
- **Jam Buka**: 06.30 - 23.00 (Setiap Hari)
- **Koordinat**: -7.79021, 110.408922

## 🔧 Pengembangan Lokal

### Prerequisites
- Browser modern (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, dll.)
- Git

### Menjalankan Lokal

1. Clone repository:
   ```bash
   git clone https://github.com/Irfan3006/toko-aldi.git
   cd toko-aldi
   ```

2. Buka `index.html` di browser:
   ```bash
   # Menggunakan Python
   python -m http.server 8000
   
   # Atau menggunakan PHP
   php -S localhost:8000
   
   # Atau menggunakan live server di VS Code
   ```

3. Akses di browser:
   ```
   http://localhost:8000
   ```

## 📝 Customization

### Mengubah Konten

1. **Teks**: Edit langsung di `index.html`
2. **Warna**: Ubah CSS variables di `assets/css/styles.css`:
   ```css
   :root {
       --primary-color: #2D9C7F;
       --secondary-color: #1A7A5E;
       /* ... */
   }
   ```
3. **Gambar**: Tambahkan gambar di folder `assets/images/`
4. **JavaScript**: Edit `assets/js/script.js` untuk custom behavior


## 🐛 Troubleshooting

### Animasi tidak berjalan
Pastikan CDN AOS loaded dengan benar. Cek console browser untuk error.

### Map tidak muncul
Periksa koneksi internet dan iframe src URL. Pastikan API Google Maps aktif.

### Layout broken di mobile
Clear cache browser dan reload. Pastikan viewport meta tag ada di `<head>`.

## 📄 License

© 2025 Irfan Syarifudin & cto.new AI. Semua hak dilindungi.

## 👤 Developer

Dibuat dengan ❤️ untuk Irfan Syarifudin & cto.new AI
