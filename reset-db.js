const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWindows = process.platform === 'win32';
const dbPath = path.join(__dirname, 'postgres-data');

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit' });
}

try {
  run('docker compose down -v');
  run('docker volume prune -f');

  if (fs.existsSync(dbPath)) {
    console.log('🧽 Removing postgres-data folder...');
    if (isWindows) {
      run(`powershell -Command "Remove-Item -Recurse -Force '${dbPath}'"`);
    } else {
      run(`rm -rf "${dbPath}"`);
    }
  }

  run('docker compose up --build');
} catch (err) {
  console.error('❌ Error:', err.message);
}
