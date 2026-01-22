// --- DATA DUMMY DATABASE ---
let dataGejala = [
    { kode: 'G01', nama: 'Bercak coklat pada buah' },
    { kode: 'G02', nama: 'Buah busuk basah' },
    { kode: 'G03', nama: 'Daun menguning' },
    { kode: 'G04', nama: 'Batang berlubang' },
    { kode: 'G05', nama: 'Akar membusuk' }
];

let dataPenyakit = [
    { kode: 'P01', nama: 'Jamur Upas', solusi: 'Kerok kulit sakit, olesi fungisida' },
    { kode: 'P02', nama: 'Busuk Buah', solusi: 'Sanitasi kebun, pangkas pohon pelindung' },
    { kode: 'P03', nama: 'Kanker Batang', solusi: 'Kupas kulit batang, olesi ter' }
];

// --- SAAT HALAMAN DIMUAT ---
document.addEventListener("DOMContentLoaded", () => {
    renderTableGejala();
    renderTablePenyakit();
    updateStats();
});

// --- FUNGSI NAVIGASI MENU ---
function viewAdmin(element, id) {
    // Sembunyikan semua section
    document.querySelectorAll('.view-sect').forEach(el => el.classList.add('hidden'));

    // Tampilkan section target
    document.getElementById('adm-' + id).classList.remove('hidden');

    // Update kelas active di sidebar
    document.querySelectorAll('.sidebar-menu a').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

function logout() {
    if (confirm('Yakin ingin keluar?')) {
        window.location.href = 'index.html';
    }
}

// --- LOGIKA KELOLA GEJALA ---

// 1. Render Tabel
function renderTableGejala() {
    const tbody = document.getElementById('table-gejala-body');
    tbody.innerHTML = ''; // Kosongkan tabel dulu

    dataGejala.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>
                    <button class="btn-edit" onclick="editGejala(${index})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="hapusGejala(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    updateStats();
}

// 2. Tambah / Simpan Data
function saveGejala(e) {
    e.preventDefault();
    const idLama = document.getElementById('gejala-id-lama').value; // Cek mode edit atau tambah
    const kode = document.getElementById('input-kode-gejala').value;
    const nama = document.getElementById('input-nama-gejala').value;

    if (idLama !== '') {
        // Mode Edit
        dataGejala[idLama] = { kode, nama };
        alert("Data Gejala berhasil diperbarui!");
    } else {
        // Mode Tambah
        dataGejala.push({ kode, nama });
        alert("Data Gejala berhasil ditambahkan!");
    }

    closeModal('gejala');
    renderTableGejala();
}

// 3. Edit Data (Munculkan Modal dengan data terisi)
function editGejala(index) {
    const data = dataGejala[index];
    document.getElementById('gejala-id-lama').value = index; // Simpan index array
    document.getElementById('input-kode-gejala').value = data.kode;
    document.getElementById('input-nama-gejala').value = data.nama;
    document.getElementById('modal-title-gejala').innerText = "Edit Gejala";

    document.getElementById('modal-gejala').classList.remove('hidden');
}

// 4. Hapus Data
function hapusGejala(index) {
    if (confirm(`Yakin ingin menghapus gejala ${dataGejala[index].nama}?`)) {
        dataGejala.splice(index, 1); // Hapus dari array
        renderTableGejala();
    }
}

// --- LOGIKA KELOLA PENYAKIT ---

function renderTablePenyakit() {
    const tbody = document.getElementById('table-penyakit-body');
    tbody.innerHTML = '';

    dataPenyakit.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>${item.solusi.substring(0, 30)}...</td> <td>
                    <button class="btn-edit" onclick="editPenyakit(${index})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="hapusPenyakit(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    updateStats();
}

function savePenyakit(e) {
    e.preventDefault();
    const idLama = document.getElementById('penyakit-id-lama').value;
    const kode = document.getElementById('input-kode-penyakit').value;
    const nama = document.getElementById('input-nama-penyakit').value;
    const solusi = document.getElementById('input-solusi-penyakit').value;

    if (idLama !== '') {
        dataPenyakit[idLama] = { kode, nama, solusi };
        alert("Data Penyakit berhasil diperbarui!");
    } else {
        dataPenyakit.push({ kode, nama, solusi });
        alert("Data Penyakit berhasil ditambahkan!");
    }

    closeModal('penyakit');
    renderTablePenyakit();
}

function editPenyakit(index) {
    const data = dataPenyakit[index];
    document.getElementById('penyakit-id-lama').value = index;
    document.getElementById('input-kode-penyakit').value = data.kode;
    document.getElementById('input-nama-penyakit').value = data.nama;
    document.getElementById('input-solusi-penyakit').value = data.solusi;
    document.getElementById('modal-title-penyakit').innerText = "Edit Penyakit";

    document.getElementById('modal-penyakit').classList.remove('hidden');
}

function hapusPenyakit(index) {
    if (confirm(`Yakin ingin menghapus penyakit ${dataPenyakit[index].nama}?`)) {
        dataPenyakit.splice(index, 1);
        renderTablePenyakit();
    }
}

// --- UTILITIES ---

function updateStats() {
    document.getElementById('total-gejala').innerText = dataGejala.length;
    document.getElementById('total-penyakit').innerText = dataPenyakit.length;
}

// Modal Logic
function openModal(type) {
    // Reset form dulu biar bersih
    if (type === 'gejala') {
        document.getElementById('gejala-id-lama').value = '';
        document.getElementById('input-kode-gejala').value = '';
        document.getElementById('input-nama-gejala').value = '';
        document.getElementById('modal-title-gejala').innerText = "Tambah Gejala";
        document.getElementById('modal-gejala').classList.remove('hidden');
    } else if (type === 'penyakit') {
        document.getElementById('penyakit-id-lama').value = '';
        document.getElementById('input-kode-penyakit').value = '';
        document.getElementById('input-nama-penyakit').value = '';
        document.getElementById('input-solusi-penyakit').value = '';
        document.getElementById('modal-title-penyakit').innerText = "Tambah Penyakit";
        document.getElementById('modal-penyakit').classList.remove('hidden');
    }
}

function closeModal(type) {
    document.getElementById('modal-' + type).classList.add('hidden');
}