import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

bad_svg = """<svg width="60" height="50" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>"""
good_svg = """<svg width="60" height="50" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="koi-body-flowing">
                  <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" />
                </clipPath>
              </defs>"""
              
if bad_svg in content:
    content = content.replace(bad_svg, good_svg)
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Added clipPath successfully.")
else:
    print("Could not find bad svg tag")
