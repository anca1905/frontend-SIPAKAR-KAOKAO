// Fungsi Pindah Form (Login <-> Register)
function switchForm(target) {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    if (target === 'register') {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    } else {
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    }
}

// Fungsi Login (Simulasi)
function handleLogin(e) {
    e.preventDefault(); // Mencegah reload halaman

    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    if (user && pass) {
        // Simpan username di LocalStorage biar bisa dipanggil di Dashboard nanti
        localStorage.setItem('username', user);

        alert(`Login Berhasil! Selamat datang, ${user}`);

        // Redirect ke Dashboard (Langkah 3 nanti)
        window.location.href = 'dashboard.html'; 
        // alert("Selanjutnya kita akan diarahkan ke Dashboard.html (Langkah Berikutnya)");
    } else {
        alert("Mohon isi username dan password!");
    }
}

// Fungsi Register (Simulasi)
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;

    if (name) {
        alert("Pendaftaran Berhasil! Silahkan Login.");
        switchForm('login'); // Balikin ke form login
    }
}