# 🐍🪜 Ular TanggaZ — Edisi Pesta Pulau Langit

**Ular TanggaZ** adalah game papan web multiplayer modern yang ceria dan ramah semua umur — merombak permainan klasik *Ular Tangga* menjadi petualangan pesta bergaya *Mario Party* dan *Fall Guys* dengan animasi interaktif, **Kartu Aksi**, **Roda Cuaca Dinamis**, dan **Babak Akhir (Kotak 91–100)**.

## ✨ Fitur Utama ("Aturan Unik Z")

- **🃏 Kartu Aksi (Dek Pesta):** Setiap pemain mulai dengan **2 kartu acak** dan mendapat **+1 kartu** setiap mendarat di kotak **Hadiah Misteri (`?`)**. Bisa memakai **1 kartu sebelum lempar dadu**:
  - **Dadu Ganda:** Lempar 2 dadu sekaligus, lalu pilih melangkah sesuai **Dadu 1**, **Dadu 2**, atau **jumlah keduanya**!
  - **Tangga Instan:** Pasang tangga tali sementara yang langsung mendongkrak posisimu **+10 kotak** ke depan.
  - **Kulit Pisang:** Jatuhkan kulit pisang jahil di kotakmu; lawan berikutnya yang lewat atau mendarat di situ akan terpeleset dan **skip 1 giliran**.
  - **Tukar Posisi:** Tukar tempat dengan pemain yang berada tepat di depanmu *(otomatis nonaktif jika mereka sudah berada di kotak 90–100)*.
  - **Peluit Ular:** Jinakkan ular berikutnya yang kamu injak — lewat dengan aman tanpa meluncur turun!
- **🎡 Roda Cuaca Dinamis (Setiap 5 Ronde):**
  - **Angin Kencang:** Semua pemain mendapat bonus **+1 langkah** pada setiap lemparan dadu.
  - **Ular Ngantuk:** Semua ular tertidur pulas selama 1 ronde (menginjak kepala ular 100% aman!).
  - **Hujan Hadiah:** Memunculkan 2 kotak **Hadiah Misteri (`?`)** tambahan secara acak di papan.
- **👑 Babak Akhir (Kotak 91–100):** Harus melempar angka yang **PAS** untuk merebut Mahkota di Kotak 100. Jika kelebihan, pionmu akan memantul mundur dengan animasi pusing!
- **🎮 3 Mode Permainan:**
  - **Lawan Bot (Vs. Bots):** Bermain solo melawan 1–3 AI dengan kepribadian berbeda (*Bot Hati-hati*, *Bot Jahil*, *Bot Petualang*).
  - **Main Bareng (Pass & Play):** 2–4 pemain bergantian di satu HP, tablet, atau laptop.
  - **Room Online (Kode 4 Huruf):** Didukung **Supabase Realtime (Presence & Broadcast)** lengkap dengan stiker reaksi melayang (`Laugh`, `Shock`, `Clap`, `Snake`) + fallback *BroadcastChannel* lokal agar bisa langsung dites antar tab browser.
- **🎨 Visual Custom SVG & Mobile-First:** 100% ikon, maskot hewan petualang (*Rubah Lincah*, *Panda Santuy*, *Kapten Kodok*, *Singa Pemberani*, *Koala Awan*, *Kelinci Roket*), dan papan 10x10 dirancang menggunakan vektor SVG kustom + responsif optimal untuk layar HP.
- **🔊 Efek Suara Web Audio API:** Sintesis audio prosedural tanpa aset eksternal (ketukan dadu kayu, lompatan pion, lonceng tangga, peluit ular, slip kulit pisang, roda cuaca, dan fanfare kemenangan) lengkap dengan tombol mute.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & Animasi:** Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti
- **Realtime Multiplayer:** Supabase Realtime (Presence & Broadcast) + Multi-Tab BroadcastChannel Fallback
- **Audio:** Web Audio API Procedural Sound Synthesizer

## 🚀 Cara Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

### (Opsional) Konfigurasi Supabase Realtime untuk Mabar Lintas Perangkat

Salin `.env.example` menjadi `.env.local` dan isi kredensial project Supabase milikmu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

Built by [Yuma Studio](https://yumastudio.digital/)

