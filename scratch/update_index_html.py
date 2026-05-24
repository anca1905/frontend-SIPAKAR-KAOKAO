import os

file_path = r"c:\laragon\www\gea\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update Navbar if needed (no structural change needed since CSS handles the capsule look, but ensure inner elements match)

# Update Hero section
# 1. Update the image inside mockup container
old_img = """<img src="assets/cocoa_futuristic_hero.png" class="mockup-img" alt="Futuristic Cocoa Scan">"""
new_img = """<div class="circle-backdrop" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 380px; height: 380px; background-color: var(--lime-accent); border-radius: 50%; z-index: 1;"></div>
                            <img src="assets/cocoa_farmer_hero.png" class="mockup-img" alt="AgroNest Cocoa Farmer" style="position: relative; z-index: 2; border-radius: 0; box-shadow: none; object-fit: contain; width: 120%; height: 120%; margin-left: -10%;">"""

content = content.replace(old_img, new_img)

# Remove the laser bar if it exists
content = content.replace("""<div class="laser-bar"></div>""", "")
# Remove glowing orbs in hero
content = content.replace("""<div class="glow-orb orb-green-1"></div>""", "")
content = content.replace("""<div class="glow-orb orb-green-2"></div>""", "")
content = content.replace("""<div class="glow-orb orb-brown-1"></div>""", "")


# Add trust badge under the button
old_btn = """<button onclick="scrollToDiagnosis()" class="btn-cyber-primary">
                        <i class="fas fa-stethoscope"></i> Mulai Diagnosis Mandiri <i class="fas fa-arrow-right"></i>
                    </button>"""

new_btn_and_trust = """<button onclick="scrollToDiagnosis()" class="btn-cyber-primary">
                        <i class="fas fa-stethoscope"></i> Mulai Diagnosis Mandiri <i class="fas fa-arrow-right"></i>
                    </button>
                    
                    <div class="hero-trust-badge" style="display: flex; align-items: center; gap: 15px; margin-top: 40px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 12px 20px; border-radius: 20px; width: fit-content; backdrop-filter: blur(10px);">
                        <div class="trust-avatars" style="display: flex;">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Farmer" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--primary-green); margin-left: 0;">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Farmer" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--primary-green); margin-left: -10px;">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Farmer" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--primary-green); margin-left: -10px;">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Farmer" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--primary-green); margin-left: -10px;">
                        </div>
                        <div class="trust-info" style="font-size: 0.85rem; line-height: 1.4;">
                            <strong style="color: var(--lime-accent); display: block;">4.9 ★ BPP Toari Verified</strong>
                            <span style="color: var(--text-muted-light);">Membantu 250+ Kelompok Tani</span>
                        </div>
                    </div>"""

content = content.replace(old_btn, new_btn_and_trust)

# Modify the terminal title to look professional
content = content.replace("""<div class="terminal-title">CBR_ENGINE_MAIN_TERMINAL.EXE</div>""", """<div class="terminal-title">Sistem Konsultasi Pakar AI</div>""")

# Update the math card slightly to look more elegant
content = content.replace("""Formulasi Manhattan Distance &amp; Similarity (CBR)""", """Kalkulasi Kedekatan Kasus (Manhattan Distance)""")

# Update some legacy terms
content = content.replace("MAINFRAME", "SISTEM PAKAR")
content = content.replace("Mainframe", "Sistem Pakar")
content = content.replace("CBR_ENGINE_MAIN_TERMINAL.EXE", "Sistem Konsultasi Pakar AI")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("index.html updated successfully.")
