let assembledCount = 0;
const totalComponents = 6;
let currentQuestion = 0;
let score = 0;
let currentActiveKey = null;
let isQuizFinished = false; // Mengunci status kuis (apakah sudah selesai atau belum)
let savedQuizScore = 0;     // Menyimpan nilai kuis siswa agar tidak hilang

// --- SISTEM LOGIN & LOADING ---
function startApp() {
    const name = document.getElementById('username').value;
    const npm = document.getElementById('npm').value;
    if (name === "" || npm === "") {
        alert("Harap isi Nama dan NPM ya!");
        return;
    }
    localStorage.setItem('userName', name);
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('loading-page').classList.add('active');
    runLoading();
}

function runLoading() {
    let progress = 0;
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    const interval = setInterval(() => {
        progress += 2;
        fill.style.width = progress + "%";
        text.innerText = progress + "%";
        if (progress >= 100) {
            clearInterval(interval);
            showMainMenu();
        }
    }, 50);
}

function showMainMenu() {
    const userName = localStorage.getItem('userName');
    document.getElementById('welcome-user').innerText = `Halo, ${userName}!`;
    document.getElementById('loading-page').classList.remove('active');
    document.getElementById('main-menu').classList.add('active');
}

// --- SISTEM NAVIGASI AMAN ---
function openPage(pageName) {
    // Sembunyikan semua section yang ada
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    
    // Tampilkan halaman yang dituju
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Logika otomatis saat halaman tertentu dibuka
// Logika otomatis saat halaman tertentu dibuka
    if (pageName === 'quiz') {
        // Cek apakah kuis sudah pernah diselesaikan sebelumnya (Sistem Lock)
        if (isQuizFinished) {
            document.getElementById('quiz-start-screen').style.display = 'none';
            document.getElementById('quiz-main-content').style.display = 'none';
            document.getElementById('quiz-locked-screen').style.display = 'block';
            document.getElementById('locked-score-text').innerText = Math.round(savedQuizScore) + " / 100";
            document.getElementById('locked-summary-text').innerText = `Hebat! Nilaimu sudah tersimpan secara permanen.`;
        } else {
            // Jika belum pernah dikerjakan, tampilkan start screen pembuka
            document.getElementById('quiz-start-screen').style.display = 'block';
            document.getElementById('quiz-main-content').style.display = 'none';
            document.getElementById('quiz-locked-screen').style.display = 'none';
        }
    }
}

function backToMenu() {
    // Zoom out gambar PC ke normal sebelum pindah halaman
    const pcImg = document.getElementById('main-pc-img');
    if(pcImg) pcImg.style.transform = "scale(1)";
    
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById('main-menu').classList.add('active');
}

// 1. Letakkan Database di paling atas (Sesuaikan koordinat agar presisi)
// Database koordinat presisi agar highlight tidak meleset
// Koordinat ini sudah saya hitung ulang agar pas di tengah komponen pada gambar kamu
// Koordinat dan ukuran yang sudah dikalibrasi untuk kondisi ZOOM
// Menggunakan PERSEN (%) untuk width dan height agar responsif di layar mana pun
const hardwareData = {
    'CPU': { name: 'CPU (Processor)', top: 43, left: 27, width: 25, height: 33, desc: 'Unit pemroses pusat yang berfungsi sebagai otak komputer untuk mengeksekusi instruksi.' },
    'RAM': { name: 'RAM', top: 43, left: 43, width: 10, height: 48, desc: 'Memori penyimpanan data sementara untuk mempercepat akses aplikasi yang sedang berjalan.' },
    'GPU': { name: 'GPU (Graphics Card)', top: 76, left: 30, width: 46, height: 20, desc: 'Unit pengolah grafis yang bertanggung jawab atas tampilan visual dan rendering pada monitor.' },
    'Power Supply': { name: 'Power Supply (PSU)', top: 18, left: 24, width: 36, height: 25, desc: 'Penyuplai daya listrik utama yang mengubah arus AC menjadi DC untuk semua komponen.' },
    'Storage': { name: 'Storage (HDD/SSD)', top: 85, left: 57, width: 22, height: 22, desc: 'Media penyimpanan data permanen tempat sistem operasi dan file pengguna disimpan.' },
    'Motherboard': { name: 'Motherboard', top: 49, left: 35, width: 52, height: 67, desc: 'Papan sirkuit utama tempat semua komponen hardware terhubung dan berkomunikasi.' }
};

// Fungsi ini HANYA jalan kalau tombol komponen dipencet (Tidak otomatis zoom saat buka)
// --- LOGIKA EKSPLOR PC (PAN, SMOOTH ZOOM & TOGGLE) ---
function highlight(element, key) {
    const pcImg = document.getElementById('main-pc-img');
    const pointer = document.getElementById('hardware-pointer');
    const data = hardwareData[key];

    // Logika Toggle: Jika komponen yang sama diklik lagi, kembali ke tampilan penuh
    if (currentActiveKey === key) {
        resetZoom();
        return;
    }
    currentActiveKey = key;

    // Atur kelas aktif di sidebar menu
    document.querySelectorAll('.side-item').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    // Update konten penjelasan di bawah
    document.getElementById('bubble-name').innerText = data.name;
    document.getElementById('bubble-desc').innerText = data.desc;

    // Aktifkan kotak penunjuk
    pointer.style.display = "block";
    
    // EFEK GESER SMOOTH: Ubah origin dan perbesar gambar secara bersamaan
    pcImg.style.transformOrigin = `${data.left}% ${data.top}%`;
    pcImg.style.transform = "scale(1.6)";

    // Sesuaikan kotak highlight biru secara presisi menggunakan satuan %
    pointer.style.left = data.left + "%";
    pointer.style.top = data.top + "%";
    pointer.style.width = data.width + "%";
    pointer.style.height = data.height + "%";
}

function resetZoom() {
    const pcImg = document.getElementById('main-pc-img');
    const pointer = document.getElementById('hardware-pointer');
    
    currentActiveKey = null;

    // Kembalikan ke tampilan PC Utuh semula tanpa zoom
    if (pcImg) {
        pcImg.style.transform = "scale(1)";
        pcImg.style.transformOrigin = "center center";
    }
    if (pointer) pointer.style.display = "none";

    document.querySelectorAll('.side-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById('bubble-name').innerText = "Eksplor PC";
    document.getElementById('bubble-desc').innerText = "Pilih salah satu komponen dari menu di bawah untuk melihat detail penjelasannya.";
}

// KUNCI UTAMA: Saat halaman dimuat, panggil resetZoom agar tampilan awalnya PC Utuh kosong
document.addEventListener("DOMContentLoaded", () => {
    const pcImg = document.getElementById('main-pc-img');
    if (pcImg) {
        pcImg.style.transition = "none"; // Matikan transisi sesaat pas loading awal
        resetZoom();
        setTimeout(() => {
            // Nyalakan kembali transisi smooth-nya setelah loading selesai
            pcImg.style.transition = "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), transform-origin 0.7s cubic-bezier(0.25, 1, 0.5, 1)";
        }, 50);
    }
});

// --- SISTEM SIMULASI MERAKIT (DRAG & DROP) ---
// ==========================================
// LOGIKA DRAG AND DROP (SISTEM HYBRID)
// ==========================================

const assemblyImages = {
    0: 'assets/casingkosong.png',
    1: 'assets/motherboardcase.png',
    2: 'assets/psucase.png',
    3: 'assets/fancase.png',
    4: 'assets/storage.png',
    5: 'assets/ram.png', // Langkah 5 & 6 akan memakai gambar final karena RAM dan GPU terpasang bersamaan
    6: 'assets/gpu.png'
};

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

document.getElementById('pc-target').addEventListener('dragover', (ev) => {
    ev.preventDefault();
});

document.getElementById('pc-target').addEventListener('drop', (ev) => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");

    // Validasi urutan rakitan logis (MB -> PSU -> CPU -> Storage -> RAM -> GPU)
    if (data === "drag-motherboard" && assembledCount === 0) {
        triggerHybridInstallation("effect-motherboard", data);
    } else if (data === "drag-psu" && assembledCount === 1) {
        triggerHybridInstallation("effect-psu", data);
    } else if (data === "drag-cpu" && assembledCount === 2) {
        triggerHybridInstallation("effect-cpu", data);
    } else if (data === "drag-storage" && assembledCount === 3) {
        triggerHybridInstallation("effect-storage", data);
    } else if (data === "drag-ram" && assembledCount === 4) {
        triggerHybridInstallation("effect-ram", data);
    } else if (data === "drag-gpu" && assembledCount === 5) {
        triggerHybridInstallation("effect-gpu", data);
    } else {
        alert("Urutan perakitan salah! Ikuti petunjuk standarnya ya.");
    }
});

function triggerHybridInstallation(effectLayerId, dragId) {
    assembledCount++;
    
    const mainImg = document.getElementById('main-casing-img');
    if (mainImg && assemblyImages[assembledCount]) {
        mainImg.src = assemblyImages[assembledCount];
    }

    document.getElementById(dragId).style.opacity = "0.2";
    document.getElementById(dragId).setAttribute("draggable", "false");

    const effectLayer = document.getElementById(effectLayerId);
    if (effectLayer) {
        effectLayer.classList.add('effect-pop');
        setTimeout(() => {
            effectLayer.classList.remove('effect-pop');
        }, 500);
    }

    const currentProgress = (assembledCount / totalComponents) * 100;
    document.getElementById('assemble-progress').style.width = currentProgress + "%";

    if (assembledCount === totalComponents) {
        setTimeout(() => {
            alert("Luar biasa, Perakitan 6 Komponen Selesai Sempurna!");
        }, 600);
    }
}
// --- SISTEM KUIS INTERAKTIF ---
// --- DATABASE 5 SOAL KUIS INTERAKTIF SINKRON ---
const quizData = [
    {
        question: "Hardware yang berfungsi sebagai otak utama untuk memproses seluruh data instruksi komputer adalah...",
        options: ["RAM", "CPU (Processor)", "Storage", "Power Supply"],
        correct: 1,
        summary: "CPU (Processor) bertindak sebagai otak utama komputer yang mengeksekusi instruksi sistem."
    },
    {
        question: "Manakah komponen hardware yang bertugas menyimpan data secara sementara untuk mempercepat kinerja aplikasi?",
        options: ["RAM", "GPU (Graphics Card)", "Storage", "Motherboard"],
        correct: 0,
        summary: "RAM bertugas menyimpan data sementara yang sedang diakses aktif oleh CPU."
    },
    {
        question: "Komponen yang bertugas menyuplai daya listrik arus searah (DC) ke seluruh sirkuit hardware PC adalah...",
        options: ["Motherboard", "Storage", "Power Supply (PSU)", "GPU"],
        correct: 2,
        summary: "Power Supply (PSU) berfungsi mengubah arus listrik AC rumah menjadi DC untuk hardware komputer."
    },
    {
        question: "Di bagian manakah seluruh komponen hardware seperti CPU, RAM, dan GPU ditancapkan agar bisa saling terhubung?",
        options: ["Storage", "Casing PC", "Power Supply", "Motherboard"],
        correct: 3,
        summary: "Motherboard adalah papan sirkuit induk tempat bertumpu dan terhubungnya semua komponen."
    },
    {
        question: "Untuk melakukan tugas rendering visual grafis 3D dan menampilkan output gambar ke monitor, kita memerlukan...",
        options: ["GPU (Graphics Card)", "Storage", "RAM", "CPU"],
        correct: 0,
        summary: "GPU (Graphics Card) bertanggung jawab penuh atas segala bentuk rendering visual dan output layar."
    }
];

// Fungsi memicu jalannya gameplay kuis (dipanggil dari tombol Mulai Kuis)
function startQuizGameplay() {
    document.getElementById('quiz-start-screen').style.display = 'none';
    document.getElementById('quiz-main-content').style.display = 'block';
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    const textElement = document.getElementById('question-text');
    if (textElement) {
        textElement.innerText = q.question;
        document.getElementById('question-number').innerText = `Soal ${currentQuestion + 1} / ${quizData.length}`;
        document.getElementById('quiz-progress').style.width = ((currentQuestion + 1) / quizData.length * 100) + "%";
        
        // Menyesuaikan gambar ilustrasi kuis otomatis sesuai soal komponennya
        const qImg = document.getElementById('q-img');
        if (qImg) {
            if (currentQuestion === 0) qImg.src = "assets/CPU.png";
            else if (currentQuestion === 1) qImg.src = "assets/ram.png";
            else if (currentQuestion === 2) qImg.src = "assets/psucase.png";
            else if (currentQuestion === 3) qImg.src = "assets/motherboardcase.png";
            else if (currentQuestion === 4) qImg.src = "assets/gpu.png";
        }

        for(let i=0; i<4; i++) {
            const opt = document.getElementById(`opt${i}`);
            if(opt) opt.innerText = q.options[i];
        }
    }
}

function checkAnswer(selected) {
    const q = quizData[currentQuestion];
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackStatus = document.getElementById('feedback-status');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');

    if (selected === q.correct) {
        score += (100 / quizData.length);
        feedbackStatus.innerText = "Jawaban Benar!";
        feedbackIcon.innerText = "✔";
        feedbackIcon.style.color = "#28a745";
    } else {
        feedbackStatus.innerText = "Jawaban Salah!";
        feedbackIcon.innerText = "✘";
        feedbackIcon.style.color = "#dc3545";
    }

    feedbackText.innerText = q.summary;
    feedbackOverlay.style.display = 'flex';
}

function nextQuestion() {
    document.getElementById('feedback-overlay').style.display = 'none';
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('final-score').innerText = Math.round(score) + " / 100";
    document.getElementById('quiz-summary').innerText = `Kamu telah menyelesaikan 5 soal kuis Inside PC dengan baik!`;
    document.getElementById('quiz-result-overlay').style.display = 'flex';
}

// Fungsi menyelesaikan gameplay kuis & MENGUNCI SKOR PERMANEN
function finishQuizGameplay() {
    isQuizFinished = true;          // Kunci status kuis selesai
    savedQuizScore = score;         // Amankan nilai akhir ke memori global
    document.getElementById('quiz-result-overlay').style.display = 'none';
    backToMenu();                   // Pindahkan siswa kembali ke menu utama
}

// Fungsi reset ulang kuis jika siswa berniat mengulang dari halaman tersimpan
function triggerRestartQuiz() {
    isQuizFinished = false;         // Buka kunci status kuis
    savedQuizScore = 0;             // Reset tabungan skor kembali ke 0
    startQuizGameplay();            // Jalankan gameplay kuis kembali dari soal nomor 1
}

// Menyesuaikan tombol restart lama di modal agar sinkron dengan fungsi baru kita
function restartQuiz() {
    document.getElementById('quiz-result-overlay').style.display = 'none';
    triggerRestartQuiz();
}
function finishQuiz() {
    finishQuizGameplay();
}
 
// --- JALUR NAVIGASI POP-UP PANDUAN URUTAN ---
function toggleGuideModal(show) {
    const modal = document.getElementById('guide-modal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

// --- SISTEM MUSIK LATAR (BACKSOUND) ---
let isMusicPlaying = false;

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const audioBtn = document.querySelector('.audio-btn'); // Mengincar tombol di menu utama
    
    if (!music) return;

    if (isMusicPlaying) {
        music.pause();
        if (audioBtn) audioBtn.innerText = "🔇"; // Ganti ikon saat mati
    } else {
        music.play().catch(error => {
            console.log("Musik diblokir browser, butuh interaksi user terlebih dahulu.");
        });
        if (audioBtn) audioBtn.innerText = "🔊"; // Ganti ikon saat bunyi
    }
    isMusicPlaying = !isMusicPlaying;
}
// =========================================================================
// ADAPTASI MOBILE TOUCH EVENTS UNTUK FITUR SIMULASI MERAKIT
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const trayImages = document.querySelectorAll(".tray-item img");
    const pcTarget = document.getElementById("pc-target");
    let activeDraggedId = null;

    trayImages.forEach(img => {
        // 1. Saat jempol siswa mulai menyentuh ikon komponen
        img.addEventListener("touchstart", function(e) {
            activeDraggedId = this.id; // Catat ID komponen yang dipegang
        }, { passive: true });

        // 2. Saat jempol bergerak menggeser ikon di layar HP
        img.addEventListener("touchmove", function(e) {
            // Kunci layar agar halaman web tidak ikut tergulung (scroll) naik-turun saat merakit
            if (e.cancelable) e.preventDefault(); 
        }, { passive: false });

        // 3. Saat jempol dilepas dari layar HP
        img.addEventListener("touchend", function(e) {
            if (!activeDraggedId) return;

            // Tangkap koordinat akhir di mana jempol siswa dilepas
            const touch = e.changedTouches[0];
            const targetRect = pcTarget.getBoundingClientRect();

            // Validasi geometri: Apakah koordinat jempol berada di dalam area kotak casing?
            if (
                touch.clientX >= targetRect.left &&
                touch.clientX <= targetRect.right &&
                touch.clientY >= targetRect.top &&
                touch.clientY <= targetRect.bottom
            ) {
                // Jika pas di dalam casing, eksekusi drop khusus mobile
                executeMobileDrop(activeDraggedId);
            }
            activeDraggedId = null; // Bersihkan data drag
        });
    });

    // Fungsi jembatan untuk mengeksekusi instalasi komponen di HP
    function executeMobileDrop(draggedId) {
        if (draggedId === "drag-motherboard" && assembledCount === 0) {
            triggerHybridInstallation("effect-motherboard", draggedId);
        } else if (draggedId === "drag-psu" && assembledCount === 1) {
            triggerHybridInstallation("effect-psu", draggedId);
        } else if (draggedId === "drag-cpu" && assembledCount === 2) {
            triggerHybridInstallation("effect-cpu", draggedId);
        } else if (draggedId === "drag-storage" && assembledCount === 3) {
            triggerHybridInstallation("effect-storage", draggedId);
        } else if (draggedId === "drag-ram" && assembledCount === 4) {
            triggerHybridInstallation("effect-ram", draggedId);
        } else if (draggedId === "drag-gpu" && assembledCount === 5) {
            triggerHybridInstallation("effect-gpu", draggedId);
        } else {
            alert("Urutan perakitan salah! Ikuti petunjuk standarnya ya.");
        }
    }
});
