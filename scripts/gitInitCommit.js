const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');

async function main() {
  const dir = path.resolve(__dirname, '..');
  console.log(`[GIT SETUP] Initializing Git repository in: ${dir}`);

  // 1. Initialize repo
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('[GIT SETUP] Git repository initialized (.git created).');

  // Helper to recursively collect files excluding node_modules, .git, etc.
  function getFiles(currentDir, rootDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      // Ignore patterns
      if (
        entry.name === '.git' ||
        entry.name === 'node_modules' ||
        entry.name === '.env' ||
        relPath.startsWith('backend/.env') ||
        relPath.startsWith('frontend/.env') ||
        relPath.startsWith('frontend/dist') ||
        relPath.startsWith('dist')
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath, rootDir));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getFiles(dir, dir);
  console.log(`[GIT SETUP] Staging ${filesToAdd.length} project files...`);

  for (const filepath of filesToAdd) {
    await git.add({ fs, dir, filepath });
  }

  // 2. Commit
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'AARVIK Team',
      email: 'admin@aarvik.org',
    },
    message: 'Initial commit: Project AARVIK - Landslide Risk Monitoring and Early Warning Management System',
  });

  console.log('========================================================');
  console.log(`[GIT SETUP] Initial commit created successfully! SHA: ${sha}`);
  console.log('========================================================');
}

main().catch((err) => {
  console.error('[GIT SETUP] Error:', err);
  process.exit(1);
});
