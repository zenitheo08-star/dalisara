const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

code = code.replace(
  /useMotionValueEvent\(scrollY, "change", \(current\) => \{[\s\S]*?\}\);/g,
  `useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollY.getPrevious();
      if (current < 50) {
        setIsCompact(false);
        setNavVisible(true);
      } else if (current < 250) {
        setIsCompact(true);
        setNavVisible(true);
      } else {
        setIsCompact(true);
        if (direction < 0) {
          setNavVisible(true);
        } else if (direction > 0) {
          setNavVisible(false);
        }
      }
    }
  });`
);

code = code.replace(
  /transition=\{\{ duration: 0\.3 \}\}/g,
  `transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}`
);

code = code.replace(
  /'absolute top-0 inset-x-0 border-b border-ink-900\/10 bg-sand-100 py-6 px-6 md:px-10'/g,
  `'fixed top-0 inset-x-0 border-b border-ink-900/10 bg-sand-100 py-6 px-6 md:px-10'`
);

code = code.replace(
  /exit=\{\{ opacity: 0 \}\}\n\s*transition=\{\{ duration: 0\.15 \}\}/g,
  `exit={{ opacity: 0 }}\n              transition={{ duration: 0.2 }}`
);

fs.writeFileSync('src/components/Layout.tsx', code);
