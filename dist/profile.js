'use strict';
// Versioned, device-local progression. No account or network dependency.
const Profile = (() => {
  const key = 'murim.profile.v1';
  const blank = () => ({version:1,silver:0,runs:0,wins:0,totalKills:0,best:0,training:{vitality:0,power:0,fortune:0},settings:{sound:false,shake:true},history:[]});
  const int = (v,max=1e8) => Math.max(0,Math.min(max,Math.floor(Number(v)||0)));
  let data=blank(), available=true;
  try {
    const saved=JSON.parse(localStorage.getItem(key)||'null');
    if(saved?.version===1){
      for(const k of ['silver','runs','wins','totalKills','best'])data[k]=int(saved[k]);
      for(const k of Object.keys(data.training))data.training[k]=int(saved.training?.[k],5);
      for(const k of Object.keys(data.settings))if(typeof saved.settings?.[k]==='boolean')data.settings[k]=saved.settings[k];
      data.history=Array.isArray(saved.history)?saved.history.slice(0,10).filter(x=>x&&typeof x==='object').map(x=>({faction:int(x.faction,2),kills:int(x.kills),time:int(x.time,300),win:!!x.win,reward:int(x.reward),date:String(x.date||'').slice(0,30)})):[];
    }
  } catch { available=false; }
  function save(){try{localStorage.setItem(key,JSON.stringify(data));available=true}catch{available=false}return available}
  function finish(run){const reward=20+Math.floor(run.kills/3)+Math.floor(run.time/10)+(run.win?100:0);data.silver+=reward;data.runs++;data.wins+=run.win?1:0;data.totalKills+=run.kills;data.best=Math.max(data.best,run.kills);data.history.unshift({...run,reward,date:new Date().toISOString()});data.history=data.history.slice(0,10);save();return reward}
  function cost(k){return 60*(data.training[k]+1)}
  function buy(k){if(!Object.hasOwn(data.training,k)||data.training[k]>=5||data.silver<cost(k))return false;data.silver-=cost(k);data.training[k]++;save();return true}
  return {data,save,finish,cost,buy,get available(){return available}};
})();
