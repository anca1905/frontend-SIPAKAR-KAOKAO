// --- DATA DUMMY GEJALA ---
const gejalaList = [
    { id: 'G01', name: 'Bercak hitam pada buah' },
    { id: 'G02', name: 'Buah busuk basah' },
    { id: 'G03', name: 'Daun menguning' },
    { id: 'G04', name: 'Bercak putih seperti tepung' },
    { id: 'G05', name: 'Kanker pada batang' }
];

// --- DATA DUMMY RIWAYAT (Untuk simulasi database) ---
let riwayatData = [
    { id: 1, tanggal: '2025-05-20', nama: 'Pak Budi', lokasi: 'Desa Lamekongga', penyakit: 'Busuk Buah', nilai: '85%' },
    { id: 2, tanggal: '2025-05-21', nama: 'Ibu Susi', lokasi: 'Desa Toari', penyakit: 'Jamur Upas', nilai: '70%' },
    { id: 3, tanggal: '2025-05-22', nama: 'Pak Anto', lokasi: 'Desa Wonua', penyakit: 'Penggerek Buah', nilai: '92%' },
    { id: 4, tanggal: '2025-06-01', nama: 'Anonim', lokasi: 'Desa Lamekongga', penyakit: 'Busuk Buah', nilai: '88%' },
    { id: 5, tanggal: '2025-06-02', nama: 'Pak Rahmat', lokasi: 'Desa Toari', penyakit: 'Kanker Batang', nilai: '65%' },
];

document.addEventListener("DOMContentLoaded", () => {
    loadGejalaPublic();
    renderHistoryTable(riwayatData); // Load semua data awal

    // Set default date hari ini di filter
    // document.getElementById('filter-end').valueAsDate = new Date();
});

// 1. FUNGSI LOAD GEJALA KE FORM
function loadGejalaPublic() {
    const container = document.getElementById('public-gejala-list');
    gejalaList.forEach(g => {
        container.innerHTML += `
            <div class="gejala-item">
                <input type="checkbox" id="${g.id}" value="${g.id}">
                <label for="${g.id}">${g.name}</label>
            </div>
        `;
    });
}

// 2. FUNGSI DIAGNOSIS (SIMULASI)
function handlePublicDiagnosis(e) {
    e.preventDefault();
    const checked = document.querySelectorAll('#public-gejala-list input:checked');
    if (checked.length === 0) { alert("Pilih minimal satu gejala!"); return; }

    const nama = document.getElementById('petani-name').value || "Petani Umum";
    const lokasi = document.getElementById('lokasi-kebun').value || "-";

    // Simulasi Loading
    document.querySelector('.btn-block').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis...';

    setTimeout(() => {
        // Simulasi Hasil (Hardcode dulu untuk UI)
        const hasilPenyakit = "Busuk Buah";
        const nilai = "88%";
        const solusi = "Lakukan sanitasi kebun, kubur buah yang busuk, dan kurangi kelembapan dengan pemangkasan.";

        // Tampilkan Hasil
        document.getElementById('res-penyakit').innerText = hasilPenyakit;
        document.getElementById('res-nilai').innerText = nilai;
        document.getElementById('res-solusi').innerText = solusi;
        document.getElementById('diagnosis-result').classList.remove('hidden');
        document.querySelector('.btn-block').innerText = 'Cek Kondisi Tanaman';

        // Simpan ke Data Dummy (Biar langsung muncul di tabel bawah)
        const newData = {
            id: riwayatData.length + 1,
            tanggal: new Date().toISOString().split('T')[0],
            nama: nama,
            lokasi: lokasi,
            penyakit: hasilPenyakit,
            nilai: nilai
        };
        riwayatData.unshift(newData); // Tambah ke paling atas
        renderHistoryTable(riwayatData); // Refresh tabel

        // Scroll ke hasil
        document.getElementById('diagnosis-result').scrollIntoView({ behavior: 'smooth' });

    }, 1500);
}

function resetDiagnosis() {
    document.getElementById('public-diagnosis-form').reset();
    document.getElementById('diagnosis-result').classList.add('hidden');
}

// 3. FUNGSI RENDER TABEL & FILTER
function renderHistoryTable(data) {
    const tbody = document.getElementById('history-body');
    const noData = document.getElementById('no-data-msg');
    tbody.innerHTML = '';

    if (data.length === 0) {
        noData.classList.remove('hidden');
        return;
    } else {
        noData.classList.add('hidden');
    }

    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.tanggal}</td>
                <td>${item.nama}</td>
                <td>${item.lokasi}</td>
                <td><span style="color:#2E7D32; font-weight:bold;">${item.penyakit}</span></td>
                <td>${item.nilai}</td>
            </tr>
        `;
    });
}

function applyFilter() {
    const startDate = document.getElementById('filter-start').value;
    const endDate = document.getElementById('filter-end').value;
    const penyakit = document.getElementById('filter-penyakit').value;

    // Filter Logic Array Javascript
    let filteredData = riwayatData.filter(item => {
        let validDate = true;
        let validPenyakit = true;

        // Cek Tanggal
        if (startDate && item.tanggal < startDate) validDate = false;
        if (endDate && item.tanggal > endDate) validDate = false;

        // Cek Penyakit
        if (penyakit !== 'all' && item.penyakit !== penyakit) validPenyakit = false;

        return validDate && validPenyakit;
    });

    renderHistoryTable(filteredData);
}

function resetFilter() {
    document.getElementById('filter-start').value = '';
    document.getElementById('filter-end').value = '';
    document.getElementById('filter-penyakit').value = 'all';
    renderHistoryTable(riwayatData);
}

function scrollToDiagnosis() {
    document.getElementById('diagnosis-area').scrollIntoView({ behavior: 'smooth' });
}

// --- DATA EDUKASI (SIMULASI DATABASE) ---
const eduData = {
    'busuk-buah': {
        title: 'Busuk Buah (Phytophthora)',
        img: 'https://distan.bulelengkab.go.id/uploads/konten/88_mengatasi-busuk-buah-pada-tanaman-kakao.jpg',
        desc: 'Penyakit ini disebabkan oleh jamur Phytophthora palmivora. Gejala awalnya adalah bercak coklat pada buah yang kemudian meluas hingga menutupi seluruh permukaan buah.',
        solusi: '1. Petik buah busuk sesering mungkin.<br>2. Lakukan pemangkasan pohon pelindung untuk mengurangi kelembapan.<br>3. Semprotkan fungisida tembaga jika serangan parah.'
    },
    'pbk': {
        title: 'Hama Penggerek Buah Kakao (PBK)',
        img: 'https://gokomodo.com/_next/image?url=https%3A%2F%2Fgkmdblog.s3.ap-southeast-1.amazonaws.com%2Fwp-content%2Fuploads%2F2023%2F10%2F13180428%2FBlog-Hama-Tanaman.jpg&w=1080&q=75',
        desc: 'Hama ini adalah ulat kecil yang merusak biji dari dalam. Gejala khasnya adalah buah matang sebelum waktunya (belang kuning-hijau) dan jika dibelah bijinya saling melekat.',
        solusi: '1. Lakukan penyelubungan buah (sarungisasi).<br>2. Panen sering (setiap minggu).<br>3. Pemangkasan teratur.'
    },
    'kanker': {
        title: 'Penyakit Kanker Batang',
        img: 'https://balittri.litbang.pertanian.go.id/images/kankerbatang.jpg',
        desc: 'Ditandai dengan adanya cairan merah seperti karat pada kulit batang. Bagian kulit yang terserang akan membusuk dan berwarna hitam di bagian dalam.',
        solusi: '1. Kupas kulit batang yang sakit sampai batas jaringan sehat.<br>2. Oleskan fungisida pada luka kupasan.<br>3. Bakar kulit hasil kupasan.'
    }
};

// FUNGSI MODAL
function openModal(id) {
    const data = eduData[id];
    if (!data) return;

    const modalBody = document.getElementById('modal-body-content');
    modalBody.innerHTML = `
        <img src="${data.img}" class="modal-img-full" alt="${data.title}">
        <h2 style="color:#2E7D32; margin-bottom:10px;">${data.title}</h2>
        <p style="margin-bottom:15px; line-height:1.6;">${data.desc}</p>
        <div style="background:#f1f8e9; padding:15px; border-radius:8px;">
            <strong><i class="fas fa-check-circle"></i> Cara Pengendalian:</strong>
            <p style="margin-top:5px; font-size:0.9rem;">${data.solusi}</p>
        </div>
    `;

    document.getElementById('edu-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('edu-modal').classList.add('hidden');
}

// Tutup modal kalau klik di luar kotak
window.onclick = function (event) {
    const modal = document.getElementById('edu-modal');
    if (event.target == modal) {
        closeModal();
    }
}