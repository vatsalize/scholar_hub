import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(backendDir, '..');
const frontendDir = path.resolve(rootDir, 'frontend');

const isWindows = process.platform === 'win32';
const mvnwCmd = isWindows
  ? path.resolve(rootDir, 'mvnw.cmd')
  : path.resolve(rootDir, 'mvnw');

const args = process.argv.slice(2);
const backendOnly = args.includes('--backend-only');

console.log('================================================================');
console.log('  ScholarHub Full-Stack Platform');
console.log('================================================================');
console.log('  [Backend]  Spring Boot 3 + H2 Database (Port 8080)');
if (!backendOnly) {
  console.log('  [Frontend] React 18 + Vite Dev Server (Port 5173)');
}
console.log('  [Pre-seeded Demo Accounts]');
console.log('    Student:   alex.morgan@scholarhub.edu / password123');
console.log('    Professor: dr.vance@scholarhub.edu    / password123');
console.log('================================================================\n');

const activeProcesses = [];

function cleanup() {
  console.log('\n[ScholarHub] Shutting down services gracefully...');
  for (const proc of activeProcesses) {
    if (proc && !proc.killed) {
      try {
        if (isWindows) {
          spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
      } catch {
        // non-fatal
      }
    }
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

// 1. Launch Spring Boot Backend
console.log('[Backend] Starting Spring Boot application (mvnw spring-boot:run -pl backend)...');
const backendProc = spawn(
  isWindows ? 'cmd.exe' : mvnwCmd,
  isWindows ? ['/c', mvnwCmd, 'spring-boot:run', '-pl', 'backend'] : ['spring-boot:run', '-pl', 'backend'],
  {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env }
  }
);
activeProcesses.push(backendProc);

backendProc.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Backend] Process exited with code ${code}`);
  }
  cleanup();
  process.exit(code || 0);
});

// 2. Launch Vite Frontend Dev Server (unless --backend-only)
if (!backendOnly) {
  console.log('[Frontend] Starting Vite development server (npm run dev)...');
  const frontendProc = spawn(
    isWindows ? 'cmd.exe' : 'npm',
    isWindows ? ['/c', 'npm', 'run', 'dev'] : ['run', 'dev'],
    {
      cwd: frontendDir,
      stdio: 'inherit',
      env: { ...process.env }
    }
  );
  activeProcesses.push(frontendProc);

  frontendProc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.warn(`[Frontend] Dev server stopped with code ${code}`);
    }
  });
}
