const F=require('./engine.js'),cp=require('child_process');
const req=[],exp=[];
for(const loc of F.LOCALES){
  for(let i=0;i<=1500;i++){req.push([loc,'cardinal',String(i)]);exp.push(F.classify(loc,i,'cardinal',0));}
  for(let i=0;i<=1500;i++){req.push([loc,'ordinal',String(i)]);exp.push(F.classify(loc,i,'ordinal',0));}
  for(let i=0;i<=120;i++){const t=(i/10).toFixed(1);req.push([loc,'cardinal',t]);exp.push(F.classify(loc,Number(t),'cardinal',1));}
}
const o=JSON.parse(cp.execFileSync('python3',['oracle.py'],{input:JSON.stringify(req),maxBuffer:1e9}));
const bad={};let nb=0;
o.forEach((v,i)=>{if(v!==exp[i]){nb++;const k=req[i][0]+'/'+req[i][1];(bad[k]=bad[k]||[]).length<3&&bad[k].push([req[i][2],exp[i],v]);}});
console.log('comparisons',o.length,'locales',F.LOCALES.length,'mismatches',nb);
if(nb)console.log(JSON.stringify(bad).slice(0,1500));
// self checks
const ar=F.categories('ar','cardinal').join();console.log('ar',ar,'ru',F.categories('ru','cardinal').join(),'ja',F.categories('ja','cardinal').join());
let cb=0;const cl=JSON.parse(cp.execFileSync('python3',['oracle.py'],{input:JSON.stringify(['cats'].concat(F.LOCALES))}));const cats={};F.LOCALES.forEach((l,i)=>cats[l]=cl[i]);
for(const l of F.LOCALES)for(const t of ['cardinal','ordinal']){const a=F.categories(l,t).slice().sort().join(),b=cats[l][t].join();if(a!==b){cb++;console.log('category set differs',l,t,a,'vs',b);}}
console.log('category-set differences',cb);
process.exit(nb||cb?1:0);
