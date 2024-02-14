import pkg from './package.json' assert { type: 'json' };
import fs from 'fs'

// Backup old package.json
fs.copyFile('./package.json', './package.json.bak', () => {
	// Normal dependencies
	let cmd = 'npm i';
	Object.keys(pkg.dependencies).forEach((dependency) => (cmd += ` ${dependency}@latest`));
	// Development dependencies
	let cmdD = 'npm i -D';
	Object.keys(pkg.devDependencies).forEach((dependency) => (cmdD += ` ${dependency}@latest`));
	// Output
	console.log(cmd, '&&', cmdD);
});

