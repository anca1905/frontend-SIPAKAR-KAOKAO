import os

file_path = r"c:\laragon\www\gea\futuristic.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace :root variables block
old_root = """    --primary-green: #071f14;
    --secondary-green: #113624;
    --lime-accent: #c4f923;
    --lime-accent-hover: #b5e61b;
    --lime-accent-rgb: 196, 249, 35;
    --bg-beige: #f6f8f4;
    --bg-card-light: #ffffff;
    --bg-card-dark: #0b2318;
    
    --border-light: rgba(12, 38, 26, 0.08);
    --border-dark: rgba(255, 255, 255, 0.08);
    --border-lime: rgba(196, 249, 35, 0.25);
    
    --text-dark: #071f14;
    --text-muted-dark: #4e6057;
    --text-light: #ffffff;
    --text-muted-light: #a4bfae;"""

new_root = """    --primary-green: #385A45;
    --secondary-green: #254130;
    --lime-accent: #D4EE3C;
    --lime-accent-hover: #C6DE2F;
    --lime-accent-rgb: 212, 238, 60;
    --bg-beige: #F4F4ED;
    --bg-card-light: #ffffff;
    --bg-card-dark: #2A4333;
    
    --border-light: rgba(56, 90, 69, 0.1);
    --border-dark: rgba(255, 255, 255, 0.1);
    --border-lime: rgba(212, 238, 60, 0.3);
    
    --text-dark: #254130;
    --text-muted-dark: #60796B;
    --text-light: #ffffff;
    --text-muted-light: #A8C4B4;"""

content = content.replace(old_root, new_root)

# Replace RGB values
# Old Primary Green RGB: 7, 31, 20
content = content.replace("7, 31, 20", "56, 90, 69")
# Old Secondary Green RGB: 12, 38, 26
content = content.replace("12, 38, 26", "37, 65, 48")
# Old Lime Accent RGB: 196, 249, 35
content = content.replace("196, 249, 35", "212, 238, 60")
# Additional dark background rgba(24, 60, 42, 0.6)
content = content.replace("24, 60, 42", "42, 67, 51")
# Old Scrollbar thumb
content = content.replace("#cbd3c9", "#D2DBD6")

# Additional UI radius and styling updates
# Navbar styling
old_navbar = """.navbar-cyber {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(7, 31, 20, 0.85);"""

new_navbar = """.navbar-cyber {
    position: fixed;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    max-width: 1200px;
    border-radius: 50px;
    background: rgba(56, 90, 69, 0.85);"""

content = content.replace(old_navbar, new_navbar)

# Hero styling
old_hero = """.hero-cyber {
    position: relative;
    padding-top: 160px;
    padding-bottom: 90px;
    background: var(--primary-green);
    color: var(--text-light);
    border-radius: 0 0 48px 48px;
    overflow: hidden;
}"""

new_hero = """.hero-cyber {
    position: relative;
    margin: 20px auto;
    width: 96%;
    max-width: 1400px;
    padding: 130px 60px 80px 60px;
    background: linear-gradient(135deg, rgba(56, 90, 69, 0.95), rgba(37, 65, 48, 0.95)), url('assets/cocoa_futuristic_hero.png') center/cover no-repeat;
    color: var(--text-light);
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(56, 90, 69, 0.15);
}"""

content = content.replace(old_hero, new_hero)

# Change hero background url to the nice farmer one if it fits better, but HTML will handle it.
# Now save back.
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("CSS colors replaced successfully.")
