import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

content = content.replace("transformOrigin: '58px 38px'", "transformOrigin: '61px 38px'")

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
print("Updated torso pivot point.")
