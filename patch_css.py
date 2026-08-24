import sys

with open('src/index.css', 'r') as f:
    content = f.read()

target = """  /* Custom Cursor Global Reset for Desktop / Fine Pointer */
  @media (pointer: fine) {
    html, body, *, *::before, *::after {
      cursor: none !important;
    }
    input, textarea, [contenteditable="true"], [contenteditable="true"] * {
      cursor: text !important;
    }
  }"""

if target in content:
    content = content.replace(target, "")
    with open('src/index.css', 'w') as f:
        f.write(content)
    print("Removed cursor: none from index.css")
else:
    print("Could not find target in index.css")
