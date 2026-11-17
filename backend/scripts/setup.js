import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory references
const backendDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(backendDir, '..');
const frontendDir = path.resolve(rootDir, 'frontend');
const dataDir = path.resolve(rootDir, 'data');
const pomXmlPath = path.resolve(backendDir, 'pom.xml');

// Frontend build references
const frontendDist = path.resolve(frontendDir, 'dist');
const frontendIndexHtml = path.resolve(frontendDist, 'index.html');

console.log('================================================================');
console.log('  ScholarHub — Automatic Pre-flight Setup & Health Check');
console.log('================================================================');

/**
 * Safely execute a shell command with inherited stdio
 */
function run(cmd, cwd = rootDir) {
  try {
    execSync(cmd, { cwd, stdio: 'inherit', shell: true });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Compute SHA-256 hash of a file
 */
function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Locate Java executable and detect installed JDK version safely
 */
function checkJava() {
  try {
    const output = execSync('java -version', {
      stdio: 'pipe',
      encoding: 'utf-8',
      shell: true,
      timeout: 2500
    });
    const versionMatch = (output || '').match(/version "([0-9]+)/i);
    return versionMatch ? parseInt(versionMatch[1], 10) : 21;
  } catch (e) {
    if (e.stderr) {
      const versionMatch = e.stderr.toString().match(/version "([0-9]+)/i);
      if (versionMatch) return parseInt(versionMatch[1], 10);
    }
    return 21;
  }
}

/**
 * Recursively find the newest mtime of files in a directory
 */
function getLatestMtime(dirPath, ignoreDirs = ['node_modules', 'dist', '.git']) {
  if (!fs.existsSync(dirPath)) return 0;
  let latest = 0;

  function traverse(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (ignoreDirs.includes(entry.name)) continue;
        const fullPath = path.join(currentDir, entry.name);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            traverse(fullPath);
          } else if (stat.isFile()) {
            if (stat.mtimeMs > latest) {
              latest = stat.mtimeMs;
            }
          }
        } catch {
          // Skip inaccessible entries
        }
      }
    } catch {
      // Skip inaccessible directory
    }
  }

  traverse(dirPath);
  return latest;
}

// =============================================================================
// STEP 1: Environment & Storage Verification
// =============================================================================
console.log('\n[1/4] Checking storage & environment configuration...');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('  [+] Created persistent database directory: ./data');
} else {
  console.log('  [OK] Persistent database directory exists: ./data');
}

// Check / sanitize backend pom.xml
if (fs.existsSync(pomXmlPath)) {
  let pomContent = fs.readFileSync(pomXmlPath, 'utf-8');
  let changed = false;

  // Fix any leading whitespace/newlines before <?xml
  if (!pomContent.startsWith('<?xml')) {
    pomContent = pomContent.trimStart();
    changed = true;
  }

  // Ensure java.version is compatible with the installed JDK
  const installedJavaMajor = checkJava();
  const targetJava = installedJavaMajor >= 21 ? (installedJavaMajor <= 25 ? installedJavaMajor : 21) : 21;
  const javaVersionRegex = /<java\.version>[0-9]+<\/java\.version>/;
  
  if (javaVersionRegex.test(pomContent)) {
    const currentMatch = pomContent.match(/<java\.version>([0-9]+)<\/java\.version>/);
    const configuredVersion = currentMatch ? parseInt(currentMatch[1], 10) : 25;
    if (configuredVersion > installedJavaMajor) {
      pomContent = pomContent.replace(javaVersionRegex, `<java.version>${targetJava}</java.version>`);
      changed = true;
      console.log(`  [+] Adjusted backend pom.xml java.version to ${targetJava} to match installed JDK ${installedJavaMajor}.`);
    }
  }

  if (changed) {
    fs.writeFileSync(pomXmlPath, pomContent, 'utf-8');
  }
  console.log('  [OK] Backend pom.xml verified and configured.');
}

// =============================================================================
// STEP 2: Automatic Frontend Dependency Verification & Installation
// =============================================================================
console.log('\n[2/4] Verifying frontend dependencies...');

const frontendNodeModules = path.join(frontendDir, 'node_modules');
const frontendPkgJson = path.join(frontendDir, 'package.json');
const frontendPkgLock = path.join(frontendDir, 'package-lock.json');
const frontendMeta = path.join(frontendNodeModules, '.scholarhub_setup_meta.json');

let needsFrontendInstall = false;

if (!fs.existsSync(frontendNodeModules)) {
  console.log('  [!] Frontend node_modules not found.');
  needsFrontendInstall = true;
} else if (!fs.existsSync(path.join(frontendNodeModules, 'vite'))) {
  console.log('  [!] Vite not found in frontend node_modules.');
  needsFrontendInstall = true;
} else if (fs.existsSync(frontendMeta)) {
  try {
    const meta = JSON.parse(fs.readFileSync(frontendMeta, 'utf-8'));
    if (meta.pkgHash !== hashFile(frontendPkgJson) || meta.lockHash !== hashFile(frontendPkgLock)) {
      console.log('  [!] Frontend package definitions changed.');
      needsFrontendInstall = true;
    }
  } catch {
    needsFrontendInstall = true;
  }
}

if (needsFrontendInstall) {
  console.log('  [*] Installing frontend dependencies ("npm install")...');
  const installSuccess = run('npm install --no-audit', frontendDir);
  if (!installSuccess) {
    console.error('\n[FATAL] Failed to install frontend dependencies.');
    process.exit(1);
  }

  try {
    fs.writeFileSync(frontendMeta, JSON.stringify({
      pkgHash: hashFile(frontendPkgJson),
      lockHash: hashFile(frontendPkgLock),
      installedAt: new Date().toISOString()
    }, null, 2));
  } catch {
    // non-fatal
  }
  console.log('  [OK] Frontend dependencies installed successfully.');
} else {
  console.log('  [OK] Frontend dependencies are up to date.');
}

// =============================================================================
// STEP 3: Java & Maven Wrapper Verification
// =============================================================================
console.log('\n[3/4] Verifying Java & Maven runtime environment...');

const isWindows = process.platform === 'win32';
const mvnwCmd = isWindows
  ? path.resolve(rootDir, 'mvnw.cmd')
  : path.resolve(rootDir, 'mvnw');

if (!fs.existsSync(mvnwCmd)) {
  console.error(`\n[FATAL] Maven wrapper not found at: ${mvnwCmd}`);
  process.exit(1);
}

// Make unix wrapper executable
if (!isWindows) {
  try {
    fs.chmodSync(mvnwCmd, '755');
  } catch {
    // non-fatal
  }
}

console.log('  [OK] Maven wrapper detected and ready.');

// =============================================================================
// STEP 4: Automatic Frontend Production Build
// =============================================================================
console.log('\n[4/4] Verifying frontend production build...');

let needsBuild = false;

if (!fs.existsSync(frontendIndexHtml)) {
  console.log('  [!] Frontend production build (dist/index.html) not found.');
  needsBuild = true;
} else {
  const distStat = fs.statSync(frontendIndexHtml);
  const distMtime = distStat.mtimeMs;

  const srcMtime = getLatestMtime(path.join(frontendDir, 'src'));
  const publicMtime = getLatestMtime(path.join(frontendDir, 'public'));
  const rootIndexMtime = fs.existsSync(path.join(frontendDir, 'index.html'))
    ? fs.statSync(path.join(frontendDir, 'index.html')).mtimeMs
    : 0;

  const newestSourceTime = Math.max(srcMtime, publicMtime, rootIndexMtime);

  if (newestSourceTime > distMtime) {
    console.log('  [!] Frontend source files are newer than existing build.');
    needsBuild = true;
  }
}

if (needsBuild) {
  console.log('  [*] Building frontend production bundle ("npm run build")...');
  const buildSuccess = run('npm run build', frontendDir);
  if (!buildSuccess || !fs.existsSync(frontendIndexHtml)) {
    console.error('\n[FATAL] Frontend production build failed.');
    process.exit(1);
  }
  console.log('  [OK] Frontend production build complete.');
} else {
  console.log('  [OK] Frontend build is up to date (dist/index.html ready).');
}

console.log('\n================================================================');
console.log('  [SUCCESS] All pre-flight checks passed!');
console.log('  Starting ScholarHub Full-Stack Platform...');
console.log('================================================================\n');

process.exit(0);
