const https = require('https');

const urls = [
  "1540555700478-4be289fbecef",
  "1544644181-1484b3fdfc62",
  "1580587771525-78b9dba3b914",
  "1600566753190-17f0baa2a6c3",
  "1499793983690-e29da59ef1c2",
  "1600607687920-4e2a09cf159d",
  "1510414842594-a61c69b5ae57",
  "1522708323590-d24dbb6b0267",
  "1600585154340-be6161a56a0c",
  "1507525428034-b723cf961d3e",
  "1518002171953-a080ee817e1f",
  "1505881502453-ca4d3f3f59e9",
  "1537233219001-ce036dc7e35b",
  "1466692476868-aef1dfb1e735",
  "1481216503945-8be73b0a2489",
  "1610641818989-c2051b5e2cfd",
  "1512918728675-ed5a9ecdebfd",
  "1578683010236-d716f9a3f461",
  "1600596542815-ffad4c1539a9",
  "1613977257363-707ba9348227",
  "1544148103-0773bf10d330",
  "1550966871-3ed3cdb5ed0c",
  "1478144592103-25e218a04891",
  "1549488344-1f9b8d2bd1f3",
  "1515377905703-c4788e51af15",
  "1599901860904-17e6ed7083a0",
  "1517400508447-f8dd518b86db",
  "1518509562904-e7ef99cdcc86",
  "1414235077428-338989a2e8c0"
];

async function check() {
  for (const id of urls) {
    await new Promise((resolve) => {
      const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=100&h=100`;
      https.get(url, (res) => {
        if (res.statusCode !== 200 && res.statusCode !== 302) {
          console.log(`BROKEN: ${id} (Status: ${res.statusCode})`);
        }
        resolve();
      }).on('error', (e) => resolve());
    });
  }
  console.log("Done");
}
check();
