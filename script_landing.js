// --- SAAT HALAMAN DIMUAT ---
let riwayatData = [];
document.addEventListener("DOMContentLoaded", () => {
    loadGejalaPublic(); // Ambil gejala dari database
    loadRiwayatPublic(); // Ambil tabel riwayat dari database
});

// 1. LOAD GEJALA DARI DATABASE (Via API Gejala)
async function loadGejalaPublic() {
    const container = document.getElementById('public-gejala-list');
    container.innerHTML = '<p>Memuat data gejala...</p>';

    try {
        // Kita pakai api_gejala.php yang sudah dibuat sebelumnya
        const response = await fetch('api/api_gejala.php?action=read');
        const data = await response.json();

        container.innerHTML = '';
        data.forEach(g => {
            container.innerHTML += `
                <div class="gejala-item">
                    <input type="checkbox" id="${g.kode}" name="gejala_check" value="${g.kode}">
                    <label for="${g.kode}">[${g.kode}] ${g.nama}</label>
                </div>
            `;
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:red">Gagal memuat gejala.</p>';
    }
}

// 2. LOAD RIWAYAT UNTUK TABEL PUBLIC
async function loadRiwayatPublic() {
    try {
        const response = await fetch('api/api_riwayat.php');
        riwayatData = await response.json();
        renderHistoryTable(riwayatData);
    } catch (err) {
        console.error("Riwayat fetch error:", err);
    }
}

// 3. PROSES DIAGNOSIS (Kirim ke api_diagnosis.php)
async function handlePublicDiagnosis(e) {
    e.preventDefault();

    // Ambil semua checkbox yang dicentang
    const checkboxes = document.querySelectorAll('input[name="gejala_check"]:checked');
    let selectedGejala = [];
    let selectedGejalaNames = [];

    checkboxes.forEach((cb) => {
        selectedGejala.push(cb.value); x
        // Ambil teks label (biasanya di samping checkbox)
        const label = document.querySelector(`label[for="${cb.id}"]`).innerText;
        selectedGejalaNames.push(label);
    });

    if (selectedGejala.length === 0) {
        alert("Pilih minimal satu gejala!");
        return;
    }

    const nama = document.getElementById('petani-name').value || "Petani Umum";
    const lokasi = document.getElementById('lokasi-kebun').value || "-";
    const btn = document.querySelector('.btn-block');

    // UI Loading
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sedang Menganalisis...';
    btn.disabled = true;

    try {
        // KIRIM DATA KE BACKEND
        const response = await fetch('api/api_diagnosis.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gejala: selectedGejala,
                nama: nama,
                lokasi: lokasi
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            if (result.hasil === null || !result.penyakit) {
                alert(result.message || "Tidak ditemukan penyakit yang cocok dengan gejala yang dipilih.");
            } else {
                // POPULASI DATA KE UI BARU

                // 1. Identitas
                document.getElementById('res-nama-petani').innerText = nama;
                document.getElementById('res-alamat-petani').innerText = lokasi;

                // 2. Daftar Gejala yang dipilih
                const gejalaListUI = document.getElementById('res-gejala-list');
                gejalaListUI.innerHTML = '';
                selectedGejalaNames.forEach(gName => {
                    gejalaListUI.innerHTML += `<li>${gName}</li>`;
                });

                // 3. Persentase Semua Penyakit
                const percentListUI = document.getElementById('res-all-percentages');
                percentListUI.innerHTML = '';
                if (result.detail_perhitungan) {
                    result.detail_perhitungan.forEach(dp => {
                        percentListUI.innerHTML += `<li>Persentase Tanaman Kakao Terserang ${dp.nama} Sebesar ${dp.persen}%</li>`;
                    });
                }

                // 4. Ringkasan Hasil
                document.getElementById('res-penyakit-name').innerText = result.penyakit;
                document.getElementById('res-penyakit-percent').innerText = result.nilai + "%";

                // 5. Solusi
                document.getElementById('res-solusi-list').innerHTML = result.solusi;

                // Munculkan Kotak Hasil
                document.getElementById('diagnosis-result').classList.remove('hidden');
                document.getElementById('diagnosis-result').scrollIntoView({ behavior: 'smooth' });

                loadRiwayatPublic();
            }
        } else {
            alert("Terjadi kesalahan: " + result.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Gagal menghubungi server.");
    } finally {
        btn.innerText = 'Cek Kondisi Tanaman';
        btn.disabled = false;
    }
}
function resetDiagnosis() {
    document.getElementById('public-diagnosis-form').reset();
    document.getElementById('diagnosis-result').classList.add('hidden');
}

// ... (Fungsi renderHistoryTable dan filter tetap sama, tinggal sesuaikan datanya nanti) ...

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

    data.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.tgl}</td>
                <td>${item.nama}</td>
                <td>${item.lokasi}</td>
                <td><span style="color:#2E7D32; font-weight:bold;">${item.hasil}</span></td>
                <td><span class="badge" style="background:#17a2b8; color:#fff">${item.nilai}</span></td>
            </tr>
        `;
    });
}

function applyFilter() {
    const startDate = document.getElementById('filter-start').value;
    const endDate = document.getElementById('filter-end').value;
    const penyakit = document.getElementById('filter-penyakit').value;

    let filteredData = riwayatData.filter(item => {
        let validDate = true;
        let validPenyakit = true;

        if (startDate && item.tgl < startDate) validDate = false;
        if (endDate && item.tgl > endDate) validDate = false;

        if (penyakit !== 'all' && item.hasil !== penyakit) validPenyakit = false;

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

window.onclick = function (event) {
    const modal = document.getElementById('edu-modal');
    if (event.target == modal) {
        closeModal();
    }
}
