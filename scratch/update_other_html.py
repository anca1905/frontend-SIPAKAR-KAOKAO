import os

def update_file(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# 1. Update edukasi.html
edukasi_replacements = [
    # Remove glowing orbs
    ("""<div class="glow-orb orb-green-1" style="top:5%; left:10%;"></div>""", ""),
    ("""<div class="glow-orb orb-brown-1" style="top:15%; right:15%;"></div>""", ""),
]
update_file(r"c:\laragon\www\gea\edukasi.html", edukasi_replacements)

# 2. Update riwayat.html
riwayat_replacements = [
    # Remove glowing orbs
    ("""<div class="glow-orb orb-green-1" style="top:5%; left:10%;"></div>""", ""),
    ("""<div class="glow-orb orb-brown-1" style="top:15%; right:15%;"></div>""", ""),
    ("Database Mainframe Logs", "Database Riwayat Diagnosis"),
    ("CONSOLE_FILTER_UTILITY.SH", "Panel Filter Pencarian"),
    ("Diagnosis Mainframe", "Diagnosis Sistem Pakar"),
    ("Menghubungkan ke basis log riwayat...", "Menghubungkan ke basis riwayat sistem pakar...")
]
update_file(r"c:\laragon\www\gea\riwayat.html", riwayat_replacements)

# 3. Update auth.html
auth_replacements = [
    # Remove glowing orbs
    ("""<div class="glow-orb orb-green-1" style="top:20%; left:20%; width: 350px; height: 350px;"></div>""", ""),
    ("""<div class="glow-orb orb-brown-1" style="bottom:10%; right:15%; width: 400px; height: 400px;"></div>""", ""),
    ("MAINFRAME_GATEWAY_V2.0", "Sistem Pakar Kakao"),
    ("CREATE_OPERATOR_CREDENTIALS", "Pendaftaran Akun Operator"),
    ("Username / Operator", "Username Operator"),
    ("Key-Phrase / Password", "Password Akses"),
    ("ID Operator", "Username Operator Baru")
]
update_file(r"c:\laragon\www\gea\auth.html", auth_replacements)

print("Other HTML files updated successfully.")
