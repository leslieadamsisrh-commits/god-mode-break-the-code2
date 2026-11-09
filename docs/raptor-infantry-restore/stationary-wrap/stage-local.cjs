const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const destination = process.argv[2];
assert.ok(destination, 'Pass the path of a disposable local checkout.');
const root = fs.realpathSync(destination);
const source = path.resolve(__dirname, '../../..');
assert.notEqual(root, source, 'Stage into a disposable checkout to preserve the active manifest.');
const assets = path.join(root, 'public/assets/raptor-v2');
const manifestPath = path.join(assets, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const trial = require('./registration.json');
assert.equal(manifest.build, '39T14', 'The trial is authored against the unchanged 39T14 manifest.');

for (const [key, pose] of Object.entries(trial.frames)) {
 const bytes = fs.readFileSync(path.join(__dirname, pose.file));
 assert.equal(createHash('sha256').update(bytes).digest('hex'), pose.sha256, pose.file);
 const target = path.join(assets, key);
 fs.mkdirSync(path.dirname(target), { recursive: true });
 fs.writeFileSync(target, bytes);
 manifest.frames[key] = {
  anchor: pose.anchor, drawScale: pose.drawScale, muzzle: pose.muzzle,
  muzzleGround: pose.muzzleGround, sha256: pose.sha256
 };
}
for (const [key, value] of Object.entries(trial.availability)) {
 manifest[key] = Array.isArray(value) ? [...new Set([...(manifest[key] ?? []), ...value])] : value;
}
manifest.build = '39T15-stationary-wrap-local';
manifest.status = 'local trial';
fs.copyFileSync(path.join(__dirname, 'tall-cover-steel.webp'), path.join(assets, 'tall-cover-steel.webp'));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Stationary wrap trial staged in', root);
