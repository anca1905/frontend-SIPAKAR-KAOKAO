// Navigasi ke Halaman Login/Auth
function goToAuth() {
    window.location.href = 'auth.html';
}

// Scroll Halus ke bagian About
function scrollToAbout() {
    document.getElementById('about').scrollIntoView({
        behavior: 'smooth'
    });
}