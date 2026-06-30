// Tab switching ditangani oleh switchTab() di auth.html
// switchForm() dipertahankan sebagai alias untuk kompatibilitas
function switchForm(target) {
    if (typeof switchTab === 'function') switchTab(target);
}

async function handleLogin(e) {
    e.preventDefault();

    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    if (user && pass) {
        // Tampilkan loading state agar user tahu proses sedang berjalan
        Swal.fire({
            title: 'Memproses Login...',
            html: 'Mohon tunggu sebentar.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData();
        formData.append('username', user);
        formData.append('password', pass);

        try {
            const resp = await fetch('api/api_auth.php?action=login', {method: 'POST', body: formData});
            const result = await resp.json();

            if(result.status === 'success') {
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminNama', result.nama);
                
                // Alert berhasil yang keren dengan auto-close dan progress bar
                Swal.fire({
                    title: 'Login Berhasil!',
                    text: `Selamat datang kembali, ${result.nama}!`,
                    icon: 'success',
                    iconColor: '#2E7D32',
                    confirmButtonColor: '#2E7D32',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'admin/dashboard.html';
                });
            } else {
                Swal.fire({
                    title: 'Login Gagal',
                    text: result.message,
                    icon: 'error',
                    confirmButtonColor: '#2E7D32'
                });
            }
        } catch(err) {
            Swal.fire({
                title: 'Kesalahan Koneksi',
                text: 'Gagal menghubungi server. Periksa koneksi internet Anda.',
                icon: 'error',
                confirmButtonColor: '#2E7D32'
            });
        }
    } else {
        Swal.fire({
            title: 'Form Belum Lengkap',
            text: 'Mohon isi username dan password!',
            icon: 'warning',
            confirmButtonColor: '#2E7D32',
            iconColor: '#c8a400'
        });
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;

    if (name && user && pass) {
        Swal.fire({
            title: 'Mendaftarkan Akun...',
            html: 'Mohon tunggu sebentar.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData();
        formData.append('nama', name);
        formData.append('username', user);
        formData.append('password', pass);

        try {
            const resp = await fetch('api/api_auth.php?action=register', {method: 'POST', body: formData});
            const result = await resp.json();

            if(result.status === 'success') {
                Swal.fire({
                    title: 'Pendaftaran Berhasil!',
                    text: 'Akun Anda telah berhasil dibuat. Silakan login.',
                    icon: 'success',
                    iconColor: '#2E7D32',
                    confirmButtonColor: '#2E7D32'
                }).then(() => {
                    document.getElementById('reg-name').value = '';
                    document.getElementById('reg-user').value = '';
                    document.getElementById('reg-pass').value = '';
                    switchForm('login');
                });
            } else {
                Swal.fire({
                    title: 'Pendaftaran Gagal',
                    text: result.message,
                    icon: 'error',
                    confirmButtonColor: '#2E7D32'
                });
            }
        } catch(err) {
            Swal.fire({
                title: 'Kesalahan Koneksi',
                text: 'Gagal mendaftar, periksa koneksi internet Anda.',
                icon: 'error',
                confirmButtonColor: '#2E7D32'
            });
        }
    }
}

