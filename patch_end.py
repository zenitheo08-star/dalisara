import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

content = content.replace("    </div>,\n    document.body", "    </>,\n    document.body")

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
print("Done")
