import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = "torsoBend.set(bend * 0.6 + Math.sin(swimPhase.current) * Math.min(speed * 0.5, 4));\n        tailBend.set(bend * 1.2 + Math.sin(swimPhase.current - 1) * Math.min(speed * 1.5, 20));"
replace = "torsoBend.set(bend * 0.5 + Math.sin(swimPhase.current) * Math.min(speed * 0.5, 4));\n        tailBend.set(bend * 0.7 + Math.sin(swimPhase.current - 1) * Math.min(speed * 1.0, 15));"

if target in content:
    content = content.replace(target, replace)
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Physics updated successfully.")
else:
    print("Could not find physics target.")

