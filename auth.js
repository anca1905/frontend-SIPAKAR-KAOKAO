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

async function handleLogin(e) {
    e.preventDefault();

    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    if (user && pass) {
        const formData = new FormData();
        formData.append('username', user);
        formData.append('password', pass);

        try {
            const resp = await fetch('api/api_auth.php?action=login', {method: 'POST', body: formData});
            const result = await resp.json();

            if(result.status === 'success') {
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminNama', result.nama);
                alert(`Login Berhasil! Selamat datang, ${result.nama}`);
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message);
            }
        } catch(err) {
            alert('Gagal menghubungi server');
        }
    } else {
        alert("Mohon isi username dan password!");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;

    if (name && user && pass) {
        const formData = new FormData();
        formData.append('nama', name);
        formData.append('username', user);
        formData.append('password', pass);

        try {
            const resp = await fetch('api/api_auth.php?action=register', {method: 'POST', body: formData});
            const result = await resp.json();

            if(result.status === 'success') {
                alert("Pendaftaran Berhasil! Silahkan Login.");
                document.getElementById('reg-name').value = '';
                document.getElementById('reg-user').value = '';
                document.getElementById('reg-pass').value = '';
                switchForm('login');
            } else {
                alert(result.message);
            }
        } catch(err) {
            alert('Gagal mendaftar, periksa koneksi');
        }
    }
}
