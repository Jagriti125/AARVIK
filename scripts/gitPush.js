const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

async function push() {
  const dir = path.resolve(__dirname, '..');
  const args = process.argv.slice(2);
  const remoteUrl = args[0];
  const token = args[1];

  if (!remoteUrl) {
    console.log('Usage: node scripts/gitPush.js <remote-url> [github-personal-access-token]');
    console.log('Example: node scripts/gitPush.js https://github.com/myusername/aarvik.git ghp_yourTokenHere');
    process.exit(1);
  }

  console.log(`[GIT PUSH] Setting remote origin: ${remoteUrl}`);

  // Set or update remote
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl });
  } catch {
    // If origin exists, delete and re-add
    await git.deleteRemote({ fs, dir, remote: 'origin' });
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl });
  }

  console.log('[GIT PUSH] Pushing branch main to origin...');

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token || 'git',
      password: token || '',
    }),
  });

  console.log('========================================================');
  console.log('[GIT PUSH] Successfully pushed repository to remote origin!');
  console.log(pushResult);
  console.log('========================================================');
}

push().catch((err) => {
  console.error('[GIT PUSH] Error during push:', err.message);
  process.exit(1);
});
