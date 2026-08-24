const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
// Fix the shadow-ink-900/5 which becomes a white glow in dark mode
code = code.replace('shadow-ink-900/5', 'shadow-black/10');
fs.writeFileSync('src/components/Layout.tsx', code);
