const childProcess = require('child_process');
let n = process.argv[2];

for (;n > 0; n--) {
    console.log(`number client -> ${n}`);
    childProcess.exec('node client.js', (err, stdout) => {
        if (err) {
            console.error(`exec error: ${err}`);
        } else {
            console.log(`<------------------>\n${stdout}`);
        }
    })
}