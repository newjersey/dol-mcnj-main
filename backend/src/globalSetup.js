const { spawn } = require('child_process');

// This function wraps the spawn method in a Promise, allowing it to be used with async/await.
function spawnPromise(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);

    child.stdout.on('data', (chunk) => {
      console.log(chunk.toString());
    });

    child.stderr.on('data', (chunk) => {
      console.error(chunk.toString());
    });

    child.on('exit', (code) => {
      if(code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = async () => {
  await spawnPromise('psql', ['-c', 'create database d4adtest;', '-U', 'postgres', '-h', 'localhost', '-p', '5432']);
  await spawnPromise('npm', ['run', 'db-migrate', 'up', '--', '-e', 'test']);
};
