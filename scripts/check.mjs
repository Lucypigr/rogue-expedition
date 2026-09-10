import {readdir,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
for(const file of await readdir('dist/js'))if(file.endsWith('.js'))execFileSync(process.execPath,['--check',`dist/js/${file}`]);
const html=await readFile('dist/index.html','utf8');for(const [,file] of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(file!== './'&&!file.includes('://'))await readFile(`dist/${file}`);
console.log('JavaScript syntax and local entrypoint assets passed.');
