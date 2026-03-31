let soal = [];
let index = 0;
let jawabanUser = [];
let waktu = 300;
let pelanggaran = 0;

// 🔗 GANTI DENGAN LINK CSV GOOGLE SHEETS KAMU
let sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8lXdXqpyMTmMMenknQyMlZmwMGHwTYXGRdKWpyRg3Jp7a2_m5BnflmLnhm4xAONoI8W2f9ngXieNJ/pub?output=csv";

// 🔐 DATA SISWA
let daftarSiswa = [
  {nama: "cahyani"},
  {nama: "muh.regil"},
  {nama: "rehan"},
  {nama: "syahrul ramadhan"},
  {nama: "selfi"},
  {nama: "wulan ramadhani"},
  {nama: "tasya"},
  {nama: "zalza bila"},
  
];

// 🔑 TOKEN UJIAN
let TOKEN = "SMK2026";

// 🔒 FULLSCREEN
function aktifFullscreen() {
  let el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  }
}

// 🚫 BLOK KLIK KANAN
document.addEventListener("contextmenu", e => e.preventDefault());

// 🚫 BLOK COPY
document.addEventListener("copy", e => e.preventDefault());

// 🚨 DETEKSI PINDAH TAB
let keluarMulai = null;

document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    keluarMulai = Date.now();
  } else {
    let durasi = (Date.now() - keluarMulai) / 1000;
    pelanggaran++;

    if (durasi > 3) {
      alert("⚠️ Keluar terlalu lama! Ujian dihentikan!");
      selesai();
    } else {
      alert("⚠️ Dilarang keluar dari ujian!");
    }

    if (pelanggaran >= 3) {
      alert("❌ Terlalu banyak pelanggaran!");
      selesai();
    }
  }
});

// 🔥 AMBIL SOAL DARI SHEETS
async function loadSoal() {
  let res = await fetch(sheetURL);
  let text = await res.text();

  let rows = text.split("\n").slice(1);

  rows.forEach(r => {
    let col = r.split(",");

    if(col[1]) {
      soal.push({
        tanya: col[1],
        opsi: [col[2], col[3], col[4], col[5], col[6]].filter(x => x),
        jawab: col[7]
      });
    }
  });
}

// ▶️ MULAI UJIAN
async function mulai() {
  let namaInput = document.getElementById("nama").value.toLowerCase().trim();
  let tokenInput = document.getElementById("token").value;

  let siswaValid = daftarSiswa.find(s => s.nama.trim() === namaInput);

  if(!siswaValid) {
    alert("❌ Nama tidak terdaftar!");
    return;
  }

  if(tokenInput !== TOKEN) {
    alert("❌ Token salah!");
    return;
  }

  await loadSoal();

  aktifFullscreen();

  document.getElementById("login").style.display = "none";
  document.getElementById("ujian").style.display = "block";
  document.getElementById("namaSiswa").innerText = siswaValid.nama;

  tampilSoal();
  startTimer();
}

// 📄 TAMPILKAN SOAL (FIX KLIK)
function tampilSoal() {
  let s = soal[index];
  document.getElementById("soal").innerText = s.tanya;

  let html = "";
  s.opsi.forEach((o, i) => {
    let huruf = ["A","B","C","D","E"][i];

    html += `<button class="opsi" data-pilihan="${huruf}">
      ${huruf}. ${o}
    </button>`;
  });

  document.getElementById("opsi").innerHTML = html;

  // 🔥 INI KUNCINYA (EVENT LISTENER)
  document.querySelectorAll(".opsi").forEach(btn => {
    btn.addEventListener("click", function() {
      pilih(this.dataset.pilihan);

      // warna pilihan
      document.querySelectorAll(".opsi").forEach(b => b.style.background = "#f9f9f9");
      this.style.background = "#c8e6c9";
    });
  });
}

// ✔ PILIH JAWABAN
function pilih(p) {
  jawabanUser[index] = p;
}

// ➡ NEXT
function next() {
  index++;
  if(index < soal.length) {
    tampilSoal();
  } else {
    selesai();
  }
}

// 🎯 SELESAI
function selesai() {
  let skor = 0;

  soal.forEach((s, i) => {
    if(jawabanUser[i] === s.jawab) skor++;
  });

  alert("Nilai kamu: " + skor);
  location.reload();
}

// ⏱ TIMER
function startTimer() {
  let interval = setInterval(() => {
    waktu--;

    let m = Math.floor(waktu / 60);
    let s = waktu % 60;

    document.getElementById("timer").innerText = m + ":" + s;

    if(waktu <= 0) {
      clearInterval(interval);
      selesai();
    }
  }, 1000);
}
