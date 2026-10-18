import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const steps=JSON.parse(readFileSync(new URL('../data/labSteps.json',import.meta.url)));
assert.equal(steps.length,14);
for(const [i,step] of steps.entries()){
 assert.equal(step.id,i+1);
 for(const key of ['title','why','explanation','expected','check','trouble','code'])
  assert.equal(typeof step[key],'string',`Step ${step.id} missing ${key}`);
 assert.ok(step.code.length>0);
}
const nb=JSON.parse(readFileSync(new URL('../public/downloads/qwen-unsloth-lab.ipynb',import.meta.url)));
const nbCode=nb.cells.filter(c=>c.cell_type==='code').map(c=>c.source.join(''));
assert.equal(nbCode.length,14);
for(let i=0;i<steps.length;i++)assert.equal(steps[i].code,nbCode[i]);
console.log('Validated all 14 steps against the bundled notebook.');
