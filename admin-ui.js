(()=>{
async function openAdmin(){
 const email=(sessionStorage.getItem('class_admin_email')||prompt('请输入管理员邮箱')||'').trim().toLowerCase();
 if(email!=='3422306811@qq.com'){alert('邮箱不正确，无法进入管理员。');return}
 sessionStorage.setItem('class_admin_email',email);
 const src=await fetch('email-admin.js').then(r=>r.text());const m=src.match(/const U='([^']+)',K='([^']+)'/);if(!m){alert('管理员配置读取失败');return}
 const s=window.supabase.createClient(m[1],m[2]);
 const {data:ps,error}=await s.from('posts').select('id,user_name,content,pinned,hidden,created_at,post_comments(id,user_name,content)').order('created_at',{ascending:false}).limit(100);
 if(error){alert('读取动态失败：'+error.message);return}
 const old=document.getElementById('admin-panel');if(old)old.remove();
 const p=document.createElement('div');p.id='admin-panel';p.innerHTML='<div class="amask"><div class="abox"><header><b>班级朋友圈管理</b><button id="ax">×</button></header><main></main></div></div>';
 const st=document.createElement('style');st.textContent=`#admin-panel .amask{position:fixed!important;inset:0!important;background:#0008!important;z-index:99999!important;display:block!important;padding:8px!important;overflow-y:scroll!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior:contain!important}#admin-panel .abox{width:min(760px,100%)!important;height:calc(100vh - 16px)!important;max-height:calc(100vh - 16px)!important;margin:0 auto!important;background:#06192d!important;border-radius:18px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}#admin-panel .abox header{position:sticky!important;top:0!important;z-index:5!important;padding:16px 18px!important;border-bottom:1px solid #123a5d!important;display:flex!important;justify-content:space-between!important;font-size:18px!important;background:#071d33!important}#admin-panel .abox header button{border:0;background:none;font-size:28px;color:#dff4ff}#admin-panel .aitem{padding:15px;border-bottom:1px solid #12304a}#admin-panel .abtn{border:0;border-radius:9px;padding:8px 12px;margin:4px;background:#0b2b45;color:#9fd7f1}#admin-panel .danger{color:#ff7897;background:#4b1527}#admin-panel .atext{white-space:pre-wrap;margin:8px 0;color:#9ab7c9}#admin-panel .ac{margin:8px 0 0 12px;padding:8px;background:#041321;border-radius:8px}#admin-panel .ac button{float:right;border:0;background:none;color:#ff6c8f}@media(max-width:700px){#admin-panel .amask{padding:0!important}#admin-panel .abox{width:100%!important;height:100vh!important;max-height:100vh!important;border-radius:0!important}#admin-panel .aitem{padding:14px 12px}}`;document.head.appendChild(st);document.body.appendChild(p);
 const main=p.querySelector('main');
 (ps||[]).sort((a,b)=>(b.pinned-a.pinned)||new Date(b.created_at)-new Date(a.created_at)).forEach(x=>{
  const d=document.createElement('section');d.className='aitem';d.innerHTML='<b></b><div class="atext"></div><div class="acts"></div>';d.querySelector('b').textContent=(x.user_name||'匿名')+(x.pinned?'  📌已置顶':'');d.querySelector('.atext').textContent=x.content||'';const a=d.querySelector('.acts');
  [['pin',x.pinned?'取消置顶':'置顶'],['hide',x.hidden?'恢复显示':'隐藏'],['del','删除动态']].forEach(([k,t])=>{const b=document.createElement('button');b.className='abtn '+(k==='del'?'danger':'');b.textContent=t;b.onclick=async()=>{if(k==='del'&&!confirm('确定删除这条动态吗？'))return;const r=await s.from('posts')[k==='del'?'delete':'update'](k==='del'?{}:{[k==='pin'?'pinned':'hidden']:!x[k==='pin'?'pinned':'hidden']}).eq('id',x.id);if(r.error)alert('操作失败：'+r.error.message);else location.reload()};a.appendChild(b)});
  (x.post_comments||[]).forEach(c=>{const q=document.createElement('div');q.className='ac';q.innerHTML='<button>删除</button>';const t=document.createElement('span');t.textContent=(c.user_name||'匿名')+'：'+(c.content||'');q.prepend(t);q.querySelector('button').onclick=async()=>{if(!confirm('确定删除这条评论吗？'))return;const r=await s.from('post_comments').delete().eq('id',c.id);if(r.error)alert('删除失败：'+r.error.message);else location.reload()};d.appendChild(q)});main.appendChild(d)
 });
 p.querySelector('#ax').onclick=()=>p.remove();
}
function bind(){const bad=document.getElementById('class-admin-modal');if(bad)bad.remove();const b=document.getElementById('class-admin-btn');if(b)b.onclick=openAdmin}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bind,500));else setTimeout(bind,500);setTimeout(bind,3500);
})();
