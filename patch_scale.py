import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# 1. Update the wrapper offsets and SVG size (shrinking overall fish by ~30%)
target_wrapper = """<motion.div className="relative flex items-center justify-center" style={{ x: -45, y: -38 }}>
            <svg width="90" height="76" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>"""
replace_wrapper = """<motion.div className="relative flex items-center justify-center" style={{ x: -43, y: -27 }}>
            <svg width="63" height="53" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>"""

if target_wrapper in content:
    content = content.replace(target_wrapper, replace_wrapper)
else:
    print("Failed to find wrapper.")

# 2. Update Pelvic Fins (Shorter)
target_pelvic = """                {/* Pelvic Fins (Wispy and flowing) */}
                <path d="M 40 33 C 25 20, 10 18, 5 25 C 15 26, 25 30, 32 34 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 40 43 C 25 56, 10 58, 5 51 C 15 50, 25 46, 32 42 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                
                {/* Internal ray lines for pelvic fins */}
                <path d="M 35 33 Q 20 22 8 24" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 35 43 Q 20 54 8 52" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />"""
replace_pelvic = """                {/* Pelvic Fins (Shorter and flowing) */}
                <path d="M 40 33 C 30 24, 18 23, 14 27 C 22 28, 28 31, 32 34 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 40 43 C 30 52, 18 53, 14 49 C 22 48, 28 45, 32 42 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                
                {/* Internal ray lines for pelvic fins */}
                <path d="M 35 33 Q 24 26 15 27" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 35 43 Q 24 50 15 49" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />"""

if target_pelvic in content:
    content = content.replace(target_pelvic, replace_pelvic)
else:
    print("Failed to find pelvic fins.")


# 3. Scale Pectoral Fins
target_pecs_1 = "<motion.g style={{ rotate: finWiggle, transformOrigin: '55px 33px' }}>"
replace_pecs_1 = "<motion.g style={{ rotate: finWiggle, transformOrigin: '55px 33px', scale: 0.65 }}>"

target_pecs_2 = "<motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '55px 43px' }}>"
replace_pecs_2 = "<motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '55px 43px', scale: 0.65 }}>"

if target_pecs_1 in content and target_pecs_2 in content:
    content = content.replace(target_pecs_1, replace_pecs_1)
    content = content.replace(target_pecs_2, replace_pecs_2)
else:
    print("Failed to find pectoral fins.")

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)

print("Scaled cursor and fins successfully.")
