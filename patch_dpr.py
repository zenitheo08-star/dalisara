import sys

with open('src/components/RippleDistortion.tsx', 'r') as f:
    content = f.read()

target = "dpr: Math.min(window.devicePixelRatio || 1, 2)"
replace = "dpr: Math.max(2, window.devicePixelRatio || 1)"

if target in content:
    content = content.replace(target, replace)
    with open('src/components/RippleDistortion.tsx', 'w') as f:
        f.write(content)
    print("DPR patched successfully.")
else:
    print("Target not found.")

