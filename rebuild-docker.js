const { execSync } = require('child_process');

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit' });
}

const args = process.argv.slice(2);
const isFull = args.includes('--full');

console.log(`🔧 Starting Docker rebuild (${isFull ? 'FULL' : 'STANDARD'})`);

run('docker compose down');

if (isFull) {
  console.log('🔥 Removing built images...');
  const services = execSync('docker compose config --services')
    .toString()
    .trim()
    .split('\n');

  services.forEach(service => {
    const config = execSync('docker compose config')
      .toString()
      .split('\n');

    const imageLine = config.find(line => line.trim().startsWith('image:'));
    if (imageLine) {
      const image = imageLine.trim().split('image:')[1].trim();
      if (image) {
        run(`docker rmi -f ${image}`);
      }
    }
  });

  console.log('🗑️ Pruning dangling images...');
  run('docker image prune -f');

  console.log('🗑️ Removing Docker volumes (database reset)...');
  run('docker volume prune -f');
}

console.log('🔨 Building containers...');
run('docker compose build');

console.log('🚀 Starting containers...');
run('docker compose up');
