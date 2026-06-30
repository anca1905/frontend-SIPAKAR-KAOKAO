document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = '../auth.html';
        return;
    }

    const adminNama = localStorage.getItem('adminNama') || 'Admin';
    if (document.querySelector('.user-info span')) {
        document.querySelector('.user-info span').innerText = adminNama;
    }

    loadDashboardStats();
});

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminNama');
    window.location.href = '../auth.html';
}

function viewAdmin(el, sectionId) {
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    if (el) el.classList.add('active');

    document.querySelectorAll('.view-sect').forEach(sect => sect.classList.add('hidden'));
    document.getElementById('adm-' + sectionId).classList.remove('hidden');

    if (sectionId === 'home') loadDashboardStats();
    if (sectionId === 'gejala') loadGejalaFromDB();
    if (sectionId === 'penyakit') loadPenyakitFromDB();
    if (sectionId === 'kasus') loadKasusFromDB(); // Panggil fungsi kasus
    if (sectionId === 'laporan') loadLaporanFromDB();
}

// ======================== MODAL UMUM ======================== //
function closeModal(type) {
    document.getElementById('modal-' + type).classList.add('hidden');
}

let dataGejala = [];
let dataPenyakit = [];
let riwayatData = [];
let dataKasusBase = [];

function generateGejalaCode() {
    if (dataGejala.length === 0) return 'G01';
    let lastCode = dataGejala[dataGejala.length - 1].kode;
    let nextNum = parseInt(lastCode.replace(/\D/g, '')) + 1;
    return 'G' + String(nextNum).padStart(2, '0');
}
function generatePenyakitCode() {
    if (dataPenyakit.length === 0) return 'P01';
    let lastCode = dataPenyakit[dataPenyakit.length - 1].kode;
    let nextNum = parseInt(lastCode.replace(/\D/g, '')) + 1;
    return 'P' + String(nextNum).padStart(2, '0');
}

// ======================== DASHBOARD STATS ======================== //
async function loadDashboardStats() {
    try {
        const resp = await fetch('../api/api_dashboard.php');
        const data = await resp.json();
        document.getElementById('total-gejala').innerText   = data.total_gejala;
        document.getElementById('total-penyakit').innerText = data.total_penyakit;
        document.getElementById('total-kasus').innerText    = data.total_kasus;
        document.getElementById('total-laporan').innerText  = data.total_riwayat_bulan_ini;
    } catch (err) { console.error('Stats error', err); }
}

// ======================== GEJALA ======================== //
async function loadGejalaFromDB() {
    const resp = await fetch('../api/api_gejala.php?action=read');
    dataGejala = await resp.json();
    const tbody = document.getElementById('table-gejala-body');
    tbody.innerHTML = '';
    dataGejala.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="editGejala(${index})" style="padding:5px 10px; background:#007bff;"><i class="fas fa-edit"></i></button>
                    <button class="btn-primary btn-sm" style="background:#dc3545; padding:5px 10px" onclick="hapusGejala('${item.kode}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

function openModalGejala() {
    document.getElementById('gejala-id-lama').value = '';
    document.getElementById('input-kode-gejala').value = generateGejalaCode();
    document.getElementById('input-nama-gejala').value = '';
    document.getElementById('modal-title-gejala').innerText = 'Tambah Gejala';
    document.getElementById('modal-gejala').classList.remove('hidden');
}

async function saveGejala(e) {
    e.preventDefault();
    const idLama = document.getElementById('gejala-id-lama').value;
    const formData = new FormData();
    formData.append('kode', document.getElementById('input-kode-gejala').value);
    formData.append('nama', document.getElementById('input-nama-gejala').value);
    formData.append('mode', idLama === '' ? 'tambah' : 'edit');

    const resp = await fetch('../api/api_gejala.php?action=save', { method: 'POST', body: formData });
    const result = await resp.json();
    if (result.status === 'success') {
        closeModal('gejala');
        loadGejalaFromDB();
        alert(result.message);
    } else alert(result.message);
}

function editGejala(index) {
    document.getElementById('modal-title-gejala').innerText = 'Edit Gejala';
    document.getElementById('gejala-id-lama').value = 'editing';
    document.getElementById('input-kode-gejala').value = dataGejala[index].kode;
    document.getElementById('input-nama-gejala').value = dataGejala[index].nama;
    document.getElementById('modal-gejala').classList.remove('hidden');
}

async function hapusGejala(kode) {
    if (confirm('Hapus gejala ini?')) {
        const formData = new FormData();
        formData.append('kode', kode);
        await fetch('../api/api_gejala.php?action=delete', { method: 'POST', body: formData });
        loadGejalaFromDB();
    }
}

// ======================== PENYAKIT ======================== //
async function loadPenyakitFromDB() {
    const resp = await fetch('../api/api_penyakit.php?action=read');
    dataPenyakit = await resp.json();
    const tbody = document.getElementById('table-penyakit-body');
    tbody.innerHTML = '';
    dataPenyakit.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>${item.solusi.substring(0, 60)}...</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="editPenyakit(${index})" style="padding:5px 10px; background:#007bff;"><i class="fas fa-edit"></i></button>
                    <button class="btn-primary btn-sm" style="background:#dc3545; padding:5px 10px" onclick="hapusPenyakit('${item.kode}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

function openModalPenyakit() {
    document.getElementById('penyakit-id-lama').value = '';
    document.getElementById('input-kode-penyakit').value = generatePenyakitCode();
    document.getElementById('input-nama-penyakit').value = '';
    document.getElementById('input-solusi-penyakit').value = '';
    document.getElementById('modal-title-penyakit').innerText = 'Tambah Penyakit';
    document.getElementById('modal-penyakit').classList.remove('hidden');
}

function editPenyakit(index) {
    const data = dataPenyakit[index];
    document.getElementById('penyakit-id-lama').value = 'editing';
    document.getElementById('input-kode-penyakit').value = data.kode;
    document.getElementById('input-nama-penyakit').value = data.nama;
    document.getElementById('input-solusi-penyakit').value = data.solusi;
    document.getElementById('modal-title-penyakit').innerText = "Edit Penyakit";
    document.getElementById('modal-penyakit').classList.remove('hidden');
}

async function savePenyakit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('kode', document.getElementById('input-kode-penyakit').value);
    formData.append('nama', document.getElementById('input-nama-penyakit').value);
    formData.append('solusi', document.getElementById('input-solusi-penyakit').value);
    formData.append('mode', document.getElementById('penyakit-id-lama').value === '' ? 'tambah' : 'edit');

    const resp = await fetch('../api/api_penyakit.php?action=save', { method: 'POST', body: formData });
    const result = await resp.json();
    if (result.status === 'success') {
        closeModal('penyakit');
        loadPenyakitFromDB();
        alert(result.message);
    } else alert(result.message);
}

async function hapusPenyakit(kode) {
    if (confirm('Hapus penyakit ini? Data Kasus yang terkait mungkin ikut terhapus!')) {
        const formData = new FormData();
        formData.append('kode', kode);
        await fetch('../api/api_penyakit.php?action=delete', { method: 'POST', body: formData });
        loadPenyakitFromDB();
    }
}

// ======================== DATA KASUS (PENGGANTI ATURAN) ======================== //
async function loadKasusFromDB() {
    const resp = await fetch('../api/api_kasus.php?action=read');
    dataKasusBase = await resp.json();
    const tbody = document.getElementById('table-kasus-body');
    tbody.innerHTML = '';

    if (dataKasusBase.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Belum ada data kasus</td></tr>';
        return;
    }

    dataKasusBase.forEach((item, index) => {
        let badges = '';
        if (item.gejala_list) {
            badges = item.gejala_list.split(',').map(g =>
                `<span class="badge-gejala">${g.trim()}</span>`
            ).join('');
        }

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.kode_kasus}</td>
                <td>${item.nama_kasus}</td>
                <td>${item.nama_penyakit}</td>
                <td style="line-height:2">${badges}</td>
                <td style="text-align:center;">${item.jumlah_gejala}</td>
                <td>${item.tanggal_input}</td>
                <td>
                    <button class="btn-primary btn-sm" style="background:#007bff; padding:5px 10px;" onclick="editKasus(${index})"><i class="fas fa-edit"></i></button>
                    <button class="btn-primary btn-sm" style="background:#dc3545; padding:5px 10px;" onclick="hapusKasus('${item.kode_kasus}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

async function populateKasusSelectOptions() {
    const respP = await fetch('../api/api_penyakit.php?action=read');
    const dP = await respP.json();
    document.getElementById('input-kasus-penyakit').innerHTML = dP.map(x => `<option value="${x.kode}">[${x.kode}] ${x.nama}</option>`).join('');
}

async function populateCheckboxGejala() {
    const resp = await fetch('../api/api_gejala.php?action=read');
    const data = await resp.json();
    const container = document.getElementById('checkbox-gejala-container');
    container.innerHTML = '';

    data.forEach(g => {
        container.innerHTML += `
            <div style="display:flex; align-items:center; gap:6px; padding:4px 0;">
                <input type="checkbox" id="chk_${g.kode}" name="gejala_kasus_check" value="${g.kode}" style="margin:0; width:16px; height:16px; cursor:pointer; accent-color:#2E7D32;">
                <label for="chk_${g.kode}" style="margin:0; font-size:0.82rem; font-weight:normal; cursor:pointer;">
                    <b>${g.kode}</b> — ${g.nama}
                </label>
            </div>
        `;
    });
}

// Saat tombol Tambah Kasus diklik
async function openModalKasus() {
    document.getElementById('modal-kasus').classList.remove('hidden');
    document.getElementById('kasus-mode').value = 'tambah';
    document.getElementById('input-kasus-kode').readOnly = false;
    document.getElementById('input-kasus-nama').value = '';
    document.getElementById('modal-title-kasus').innerText = 'Tambah Data Kasus Baru';

    // Auto-generate kode kasus berikutnya
    const nextNum = dataKasusBase.length + 1;
    document.getElementById('input-kasus-kode').value = 'K' + String(nextNum).padStart(3, '0');

    await populateKasusSelectOptions();
    await populateCheckboxGejala();
}

// Saat tombol Edit Kasus diklik
async function editKasus(index) {
    const data = dataKasusBase[index];
    document.getElementById('modal-kasus').classList.remove('hidden');
    document.getElementById('kasus-mode').value = 'edit';
    document.getElementById('input-kasus-kode').value = data.kode_kasus;
    document.getElementById('input-kasus-kode').readOnly = true;
    document.getElementById('input-kasus-nama').value = data.nama_kasus;
    document.getElementById('modal-title-kasus').innerText = 'Edit Data Kasus';

    await populateKasusSelectOptions();
    document.getElementById('input-kasus-penyakit').value = data.kode_penyakit;

    await populateCheckboxGejala();

    // Centang gejala yang ada di database secara otomatis
    if (data.gejala_list) {
        const gejalaArray = data.gejala_list.split(',').map(item => item.trim());
        gejalaArray.forEach(g => {
            const chk = document.getElementById('chk_' + g);
            if (chk) chk.checked = true;
        });
    }
}

async function saveKasus(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('mode', document.getElementById('kasus-mode').value);
    formData.append('kode_kasus', document.getElementById('input-kasus-kode').value);
    formData.append('nama_kasus', document.getElementById('input-kasus-nama').value);
    formData.append('penyakit', document.getElementById('input-kasus-penyakit').value);

    let selectedGejala = [];
    document.querySelectorAll('input[name="gejala_kasus_check"]:checked').forEach(el => {
        selectedGejala.push(el.value);
    });

    if (selectedGejala.length === 0) {
        alert("Pilih minimal satu gejala!");
        return;
    }

    formData.append('gejala', JSON.stringify(selectedGejala));

    const resp = await fetch('../api/api_kasus.php?action=save', { method: 'POST', body: formData });
    const result = await resp.json();
    if (result.status === 'success') {
        closeModal('kasus');
        loadKasusFromDB();
        alert(result.message);
    } else alert(result.message);
}

async function hapusKasus(kode) {
    if (confirm('Hapus kasus ini?')) {
        const formData = new FormData();
        formData.append('kode_kasus', kode);
        await fetch('../api/api_kasus.php?action=delete', { method: 'POST', body: formData });
        loadKasusFromDB();
    }
}

// ======================== LAPORAN ======================== //
async function loadLaporanFromDB() {
    const resp = await fetch('../api/api_riwayat.php');
    riwayatData = await resp.json();
    renderLaporanTable(riwayatData);
}

function renderLaporanTable(data) {
    const tbody = document.getElementById('table-laporan-body');
    tbody.innerHTML = '';
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Data tidak ditemukan</td></tr>';
        return;
    }
    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.tgl}</td>
                <td>${item.nama}</td>
                <td>${item.lokasi}</td>
                <td>${item.hasil}</td>
                <td><span class="badge" style="background:#17a2b8; color:#fff">${item.nilai}</span></td>
            </tr>`;
    });
}

function filterLaporan() {
    let start = document.getElementById('filter-start').value;
    let end = document.getElementById('filter-end').value;
    let filtered = riwayatData.filter(x => {
        let valid = true;
        if (start && x.tgl < start) valid = false;
        if (end && x.tgl > end) valid = false;
        return valid;
    });
    renderLaporanTable(filtered);
}

function cetakLaporan() {
    let printContents = document.querySelector('#adm-laporan .card-table').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align: center;">Laporan Riwayat Diagnosis CBR Kakao</h2>
            <br>
            ${printContents}
        </div>
    `;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
}
