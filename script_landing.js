// --- HELPER NOTIFIKASI MODERN ---
function showNotification(title, message, icon = 'info') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonColor: '#2E7D32',
            iconColor: icon === 'success' ? '#2E7D32' : (icon === 'warning' ? '#c8a400' : undefined)
        });
    } else {
        alert(message);
    }
}

// --- VARIABEL GLOBAL ---
let riwayatData = [];
let allSymptomData = [];
let selectedGejalaCodes = [];
let currentTab = 'all';
let currentSearch = '';

// --- SAAT HALAMAN DIMUAT ---
document.addEventListener("DOMContentLoaded", () => {
    // Cek apakah elemen 'public-gejala-list' ada di halaman saat ini (diagnosis.html)
    if (document.getElementById('public-gejala-list')) {
        loadGejalaPublic(); 
    }

    // Cek apakah elemen tabel riwayat ada di halaman saat ini (riwayat.html)
    if (document.getElementById('history-body')) {
        loadRiwayatPublic(); 
    }
});

// Helper: Klasifikasi gejala secara dinamis berdasarkan kata kunci namanya
function getSymptomCategory(symptomName) {
    const name = symptomName.toLowerCase();
    if (name.includes('buah') || name.includes('biji')) {
        return 'buah';
    } else if (name.includes('daun') || name.includes('pucuk') || name.includes('keriting') || name.includes('bercak')) {
        return 'daun';
    } else if (name.includes('batang') || name.includes('cabang') || name.includes('ranting') || name.includes('kulit') || name.includes('kayu') || name.includes('larva')) {
        return 'batang';
    } else {
        return 'lainnya';
    }
}

// 1. LOAD GEJALA DARI DATABASE (Via API Gejala)
async function loadGejalaPublic() {
    const container = document.getElementById('public-gejala-list');
    if (!container) return;
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
            <i class="fas fa-circle-notch fa-spin" style="color: var(--primary-glow); font-size: 1.5rem; margin-bottom: 10px;"></i>
            <p style="color: var(--text-muted);">Menghubungkan ke basis pengetahuan kakao...</p>
        </div>
    `;

    try {
        const response = await fetch('api/api_gejala.php?action=read');
        allSymptomData = await response.json();
        renderSymptoms();
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:#ef4444; grid-column: 1/-1; text-align:center; padding:20px;">Gagal memuat basis data gejala dari server.</p>';
    }
}

// Render Checkbox Gejala dengan Filter Tab & Live Search
function renderSymptoms() {
    const container = document.getElementById('public-gejala-list');
    if (!container) return;

    let filtered = allSymptomData;

    // Filter berdasarkan Pencarian Kata Kunci
    if (currentSearch.trim() !== '') {
        const query = currentSearch.toLowerCase();
        filtered = filtered.filter(g => 
            g.nama.toLowerCase().includes(query) || 
            g.kode.toLowerCase().includes(query)
        );
    }

    // Filter berdasarkan Tab Kategori Plant Parts
    if (currentTab !== 'all') {
        filtered = filtered.filter(g => getSymptomCategory(g.nama) === currentTab);
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #666;">
                <i class="fas fa-search-minus" style="font-size: 2rem; margin-bottom: 10px; color: #aaa;"></i>
                <p>Tidak ada gejala yang cocok dengan kriteria filter Anda.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    filtered.forEach(g => {
        const isChecked = selectedGejalaCodes.includes(g.kode) ? 'checked' : '';
        const cardClass = isChecked ? 'gejala-cyber-card checked' : 'gejala-cyber-card';

        // Tampilan Card Custom
        container.innerHTML += `
            <div class="${cardClass}" onclick="toggleSymptomCard('${g.kode}', event)" style="cursor:pointer; display:flex; gap:10px; align-items:flex-start; margin-bottom:10px;">
                <input type="checkbox" id="${g.kode}" name="gejala_check" value="${g.kode}" ${isChecked} onchange="handleCheckboxChange('${g.kode}')" style="margin-top:4px;">
                <label for="${g.kode}" class="gejala-cyber-label" style="cursor:pointer; margin:0;"><b>[${g.kode}]</b> ${g.nama}</label>
            </div>
        `;
    });
}

// Klik area kartu gejala untuk mencentang otomatis
function toggleSymptomCard(code, event) {
    if (event.target.type === 'checkbox' || event.target.tagName === 'LABEL') return;
    const cb = document.getElementById(code);
    if (!cb) return;

    cb.checked = !cb.checked;
    handleCheckboxChange(code);
}

// Menangani perubahan status checkbox dan menyimpan state secara global
function handleCheckboxChange(code) {
    const cb = document.getElementById(code);
    if (!cb) return;

    const card = cb.closest('.gejala-cyber-card');

    if (cb.checked) {
        if (!selectedGejalaCodes.includes(code)) selectedGejalaCodes.push(code);
        if (card) card.classList.add('checked');
    } else {
        selectedGejalaCodes = selectedGejalaCodes.filter(c => c !== code);
        if (card) card.classList.remove('checked');
    }
    updateSubmitButton();
}

// Update teks tombol diagnosis secara dinamis dengan hitungan gejala terpilih
function updateSubmitButton() {
    const btn = document.getElementById('btn-submit-diagnosis') || document.querySelector('.btn-diagnose') || document.querySelector('.btn-block');
    if (!btn) return;

    if (selectedGejalaCodes.length > 0) {
        btn.innerHTML = `<i class="fas fa-calculator"></i> Analisis Kondisi Tanaman (${selectedGejalaCodes.length} Gejala Terpilih)`;
    } else {
        btn.innerHTML = `<i class="fas fa-search"></i> Analisis Kondisi Tanaman`;
    }
}

// Filter Tab Gejala (Jika Kamu Pakai Tab UI Nanti)
function filterSymptomTab(tab, element) {
    currentTab = tab;
    const buttons = document.querySelectorAll('.terminal-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');
    renderSymptoms();
}

// Live Search Gejala (Jika Kamu Pakai Input Search Nanti)
function searchSymptoms() {
    const searchInput = document.getElementById('symptom-search');
    if (!searchInput) return;
    currentSearch = searchInput.value;
    renderSymptoms();
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

// 3. PROSES DIAGNOSIS (Mengumpulkan Input User & Mengirim ke Backend CBR)
async function handlePublicDiagnosis(e) {
    e.preventDefault();

    if (selectedGejalaCodes.length < 2) {
        showNotification('Gejala Tidak Cukup', "Silahkan pilih minimal 2 gejala tanaman kakao Anda!", 'warning');
        return;
    }

    const nama = document.getElementById('petani-name') ? document.getElementById('petani-name').value || "Petani Umum" : "Petani Umum";
    const lokasi = document.getElementById('lokasi-kebun') ? document.getElementById('lokasi-kebun').value || "-" : "-";
    const btn = document.getElementById('btn-submit-diagnosis') || document.querySelector('.btn-diagnose') || document.querySelector('.btn-block');
    if (!btn) return;

    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis...';
    btn.disabled = true;

    try {
        const response = await fetch('api/api_diagnosis.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gejala: selectedGejalaCodes,
                nama: nama,
                lokasi: lokasi
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            if (result.hasil === null || !result.penyakit) {
                showNotification('Diagnosis Selesai', result.message || "Tidak ditemukan kasus penyakit yang cocok.", 'info');
            } else {
                
                // MENGISI DATA KE HTML (Sesuai ID di diagnosis.html terbaru)
                const elPenyakit = document.getElementById('res-penyakit');
                const elNilai = document.getElementById('res-nilai');
                const elKasusRef = document.getElementById('res-kasus-ref');
                const elSolusi = document.getElementById('res-solusi');
                const detailList = document.getElementById('detail-list');

                if(elPenyakit) elPenyakit.innerText = result.penyakit;
                if(elNilai) elNilai.innerText = result.nilai + "%";
                if(elKasusRef) elKasusRef.innerText = result.kasus_referensi || "-";
                if(elSolusi) elSolusi.innerHTML = result.solusi;

                // Isi Info Panel: Nama, Lokasi, Gejala Terpilih
                const elNama   = document.getElementById('res-nama');
                const elLokasi = document.getElementById('res-lokasi');
                const elCount  = document.getElementById('res-gejala-count');
                const elTags   = document.getElementById('res-gejala-tags');

                if(elNama)   elNama.innerText   = nama;
                if(elLokasi) elLokasi.innerText = lokasi !== '-' ? lokasi : 'Tidak disebutkan';
                if(elCount)  elCount.innerText  = selectedGejalaCodes.length;

                if(elTags) {
                    elTags.innerHTML = '';
                    selectedGejalaCodes.forEach(kode => {
                        // Cari nama gejala dari allSymptomData
                        const gejala = allSymptomData.find(g => g.kode === kode);
                        const label  = gejala ? `[${kode}] ${gejala.nama}` : kode;
                        elTags.innerHTML += `<span style="display:inline-flex;align-items:center;gap:5px;background:#e8f5e9;color:#1B5E20;border:1px solid #a5d6a7;border-radius:20px;padding:3px 10px;font-size:0.78rem;font-weight:600;">
                            <i class="fas fa-check" style="font-size:0.65rem;"></i>${label}
                        </span>`;
                    });
                }

                // Isi kalimat kesimpulan diagnosis
                const elSummary = document.getElementById('res-summary-text');
                if (elSummary) {
                    elSummary.innerHTML = `Dilihat dari hasil perhitungan setiap penyakit yang tertera, tanaman kakao Anda terdiagnosis terjangkit penyakit <strong>${result.penyakit}</strong> dengan nilai jarak terkecil diperoleh pada <strong>${result.kasus_referensi || '-'}</strong> dengan nilai jarak City Block sebesar <strong>${result.distance}</strong>.`;
                }

                // Mengisi Tabel Rincian Manhattan Distance
                if(detailList) {
                    detailList.innerHTML = '';
                    const btnLihat = document.getElementById('btn-lihat-lainnya');
                    const LIMIT    = 4;

                    if (result.detail_perhitungan && result.detail_perhitungan.length > 0) {
                        result.detail_perhitungan.forEach((dp, idx) => {
                            const isWinner  = dp.nama === result.penyakit;
                            const isHidden  = idx >= LIMIT;
                            detailList.innerHTML += `
                                <tr class="${isHidden ? 'row-hidden' : ''}" style="${isWinner ? 'background:#e8f5e9; font-weight:600;' : ''}">
                                    <td style="border: 1px solid #ddd; padding: 8px;">
                                        ${isWinner ? '<i class="fas fa-check-circle" style="color:#2E7D32;margin-right:6px;"></i>' : ''}${dp.nama}
                                    </td>
                                    <td style="border: 1px solid #ddd; padding: 8px; font-size:0.82rem; color:#666;">${dp.kasus_ref || '-'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                                        <strong>${dp.distance}</strong>
                                    </td>
                                </tr>
                            `;
                        });

                        // Tampilkan tombol "Lihat Lainnya" hanya jika total > LIMIT
                        if (btnLihat) {
                            if (result.detail_perhitungan.length > LIMIT) {
                                const sisanya = result.detail_perhitungan.length - LIMIT;
                                const labelTeks = `Lihat ${sisanya} Lainnya`;
                                document.getElementById('label-lihat').textContent = labelTeks;
                                document.getElementById('icon-lihat').className    = 'fas fa-chevron-down';
                                btnLihat.dataset.labelMore = labelTeks;
                                btnLihat.dataset.expanded  = 'false';
                                btnLihat.style.display     = 'flex';
                            } else {
                                btnLihat.style.display = 'none';
                            }
                        }
                    }
                }

                // Tampilkan Kotak Laporan
                const resultBox = document.getElementById('diagnosis-result');
                if(resultBox) {
                    resultBox.classList.remove('hidden');
                    resultBox.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Alert Sukses Diagnosa
                showNotification('Diagnosis Berhasil!', `Tanaman kakao terdiagnosis mengidap: ${result.penyakit} dengan nilai kemiripan ${result.nilai}%.`, 'success');

                loadRiwayatPublic();
            }
        } else {
            showNotification('Kesalahan Sistem', "Terjadi kesalahan sistem: " + result.message, 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification('Kesalahan Koneksi', "Gagal menghubungi server database.", 'error');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
        updateSubmitButton();
    }
}

// Reset Diagnosis Mandiri
function resetDiagnosis() {
    const form = document.getElementById('public-diagnosis-form');
    if (form) form.reset();
    selectedGejalaCodes = [];
    updateSubmitButton();
    
    const cards = document.querySelectorAll('.gejala-cyber-card');
    cards.forEach(c => c.classList.remove('checked'));

    const resBox = document.getElementById('diagnosis-result');
    if(resBox) resBox.classList.add('hidden');
    
    const diagArea = document.getElementById('diagnosis-area');
    if (diagArea) diagArea.scrollIntoView({ behavior: 'smooth' });
}

// 4. RENDERING TABEL RIWAYAT DIGITAL
function renderHistoryTable(data) {
    const tbody = document.getElementById('history-body');
    const noData = document.getElementById('no-data-msg');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        if (noData) noData.classList.remove('hidden');
        return;
    } else {
        if (noData) noData.classList.add('hidden');
    }

    data.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="text-align:center;">${index + 1}</td>
                <td>${item.tgl}</td>
                <td>${item.nama}</td>
                <td>${item.lokasi}</td>
                <td><span style="color:#2E7D32; font-weight:bold;">${item.hasil}</span></td>
                <td style="text-align:center;"><span class="badge" style="background:#17a2b8; color:white;">${item.nilai}</span></td>
            </tr>
        `;
    });
}

// Filter Riwayat data
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

// Reset Filter Riwayat
function resetFilter() {
    document.getElementById('filter-start').value = '';
    document.getElementById('filter-end').value = '';
    document.getElementById('filter-penyakit').value = 'all';
    renderHistoryTable(riwayatData);
}

// 5. EDUKASI DATA MODAL POPUP
const eduData = {
    'busuk-buah': {
        title: 'Penyakit Busuk Buah (Phytophthora)',
        img: 'https://distan.bulelengkab.go.id/uploads/konten/88_mengatasi-busuk-buah-pada-tanaman-kakao.jpg',
        desc: 'Busuk buah kakao disebabkan oleh cendawan oomiset Phytophthora palmivora. Penyakit ini berkembang sangat hebat pada kondisi kebun yang sangat lembap, curah hujan tinggi, kerapatan pohon berlebih, atau naungan yang terlalu rimbun.',
        solusi: '1. Petik buah yang membusuk sesering mungkin untuk memotong siklus spora.<br>2. Lakukan pemangkasan tajuk tanaman pelindung.<br>3. Aplikasi fungisida kontak berbahan aktif Tembaga (Copper Hydroxide) jika diperlukan.'
    },
    'pbk': {
        title: 'Hama Penggerek Buah Kakao (PBK)',
        img: 'https://gokomodo.com/_next/image?url=https%3A%2F%2Fgkmdblog.s3.ap-southeast-1.amazonaws.com%2Fwp-content%2Fuploads%2F2023%2F10%2F13180428%2FBlog-Hama-Tanaman.jpg&w=1080&q=75',
        desc: 'Hama utama Penggerek Buah Kakao disebabkan oleh ngengat Conopomorpha cramerella. Ciri serangan khas berupa warna buah yang matang tidak merata sebelum waktunya (belang hijau-kuning), dan jika dibelah biji-biji saling melengket keras.',
        solusi: '1. Selubungi buah kakao muda (Teknik Sarungisasi/Kondomisasi).<br>2. Lakukan pemanenan sering terjadwal setiap 7-10 hari sekali.<br>3. Jaga sirkulasi kebun dan kembangkan musuh alami ngengat PBK.'
    },
    'kanker': {
        title: 'Penyakit Kanker Batang Kakao',
        img: 'https://balittri.litbang.pertanian.go.id/images/kankerbatang.jpg',
        desc: 'Kanker Batang disebabkan oleh patogen jamur Phytophthora palmivora. Gejalanya ditandai kulit batang/cabang tampak membusuk basah dan mengeluarkan eksudat lendir kemerahan mirip cairan karat besi atau getah kehitaman.',
        solusi: '1. Kupas atau kerok kulit batang yang membusuk basah menggunakan pisau tajam steril.<br>2. Oleskan bubur fungisida berbahan aktif Tembaga Oksida.<br>3. Selalu bersihkan alat kerja menggunakan alkohol 70%.'
    }
};

// Removed modal popup functions (openModal, closeModal) as articles now use their own page (artikel.html)

// ── Toggle kandidat tersembunyi di tabel diagnosis ──
function toggleKandidatLainnya() {
    const btn      = document.getElementById('btn-lihat-lainnya');
    const icon     = document.getElementById('icon-lihat');
    const label    = document.getElementById('label-lihat');
    const hiddenRows = document.querySelectorAll('#detail-list .row-hidden, #detail-list tr.row-hidden');
    const expanded = btn.dataset.expanded === 'true';

    // Hitung jumlah baris tersembunyi
    const allExtra = document.querySelectorAll('#detail-list tr[class*="row-extra"]').length ||
                     document.querySelectorAll('#detail-list tr.row-hidden-candidate').length;

    if (expanded) {
        // Sembunyikan kembali baris > 4
        document.querySelectorAll('#detail-list tr').forEach((tr, idx) => {
            if (idx >= 4) tr.style.display = 'none';
        });
        label.textContent = btn.dataset.labelMore || 'Lihat Lainnya';
        icon.className    = 'fas fa-chevron-down';
        btn.dataset.expanded = 'false';
    } else {
        // Tampilkan semua baris
        document.querySelectorAll('#detail-list tr').forEach(tr => {
            tr.style.display = '';
        });
        // Hitung baris yang tadinya tersembunyi
        const totalRows = document.querySelectorAll('#detail-list tr').length;
        label.textContent = 'Sembunyikan';
        icon.className    = 'fas fa-chevron-up';
        btn.dataset.expanded = 'true';
    }
}