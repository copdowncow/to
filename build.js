const { execSync } = require('child_process')
const path = require('path')

const clientDir = path.join(__dirname, 'client')

console.log('Building client...')
execSync('npx vite build', {
  cwd: clientDir,
  stdio: 'inherit',
  env: { ...process.env }
})
console.log('Build complete!')
