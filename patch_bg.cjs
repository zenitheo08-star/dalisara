const fs = require('fs');

function replaceFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/bg-white(\/\d+)?/g, (match, opacity) => {
    return 'bg-sand-50' + (opacity || '');
  });
  fs.writeFileSync(path, content);
}

replaceFile('src/components/GuestConcierge.tsx');
replaceFile('src/components/AmbientAudio.tsx');
replaceFile('src/pages/Booking.tsx');
