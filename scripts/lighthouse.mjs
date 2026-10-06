import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import {writeFile,mkdir} from 'node:fs/promises';
import {homedir} from 'node:os';
const url=process.env.SITE_URL||'http://127.0.0.1:4322';
const output=process.env.ARTIFACT_DIR||`${homedir()}/.tmp/gw-product/site`;
await mkdir(output,{recursive:true});
const chrome=await launch({chromePath:'/usr/bin/google-chrome',chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage', ...(process.env.CHROME_RESOLVE_HOST ? ['--host-resolver-rules=' + process.env.CHROME_RESOLVE_HOST] : [])]});
try {
 for(const [name,settings] of [['mobile',{}],['desktop',{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:960,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}]]){
 const result=await lighthouse(url,{port:chrome.port,output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo'],...settings});
 await writeFile(`${output}/lighthouse-${name}.json`,result.report[0]);await writeFile(`${output}/lighthouse-${name}.html`,result.report[1]);
 const lhr=result.lhr;
 if(lhr.runtimeError)throw new Error(`Lighthouse did not load the page: ${lhr.runtimeError.code}`);
 const scores=Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)]));
 const seoAudits=lhr.categories.seo.auditRefs.filter(a=>a.weight>0 && a.id!=='is-crawlable');
 const launchSeo=100*seoAudits.reduce((sum,a)=>sum+(lhr.audits[a.id].score??1)*a.weight,0)/seoAudits.reduce((sum,a)=>sum+a.weight,0);
 console.log(JSON.stringify({name,url,scores,seoExcludingRequiredNoindex:Math.round(launchSeo),failures:Object.entries(lhr.audits).filter(([,a])=>a.score!==null&&a.score<.9).map(([id,a])=>({id,score:a.score,title:a.title,displayValue:a.displayValue})).slice(0,20)}));
 }
}finally{await chrome.kill();}
