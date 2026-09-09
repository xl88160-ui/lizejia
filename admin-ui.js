(()=>{
async function openAdmin(){
 const email=(sessionStorage.getItem('class_admin_email')||prompt('请输入管理员邮箱')||'').trim().toLowerCase();
 if(!email)return;
 const src=await fetch('email-admin.js').then(r=>r.text());
 const m=src.match(/const U='([^']+)',K='([^']+)'/);if(!m){alert('管理员配置读取失败');return}
 const s=window.supabase.createClient(m[1],m[2]);
 const {data:ps,error}=await s.from('posts').select('id,user_name,content,pinned,hidden,created_at,post_comments(id,user_name,content)').order('created_at',{ascending:false}).limit(100);
 if(error){alert('读取动态失败：'+error.message);return}
 const old=document.getElementById('admin-panel');if(old)old.remove();
 const p=document.createElement('div');p.id='admin-panel';p.innerHTML='<div class="amask"><div class="abox"><header><b>班级朋友圈管理</b><button id="ax">×</button></header><main></main></div></div>';
 const st=document.createElement('style');st.textContent='.amask{position:fixed;inset:0;background:#0008;z-index:99999;padding:15px;overflow:auto}.abox{max-width:760px;margin:20px auto;background:white;border-radius:18px;overflow:hidden}.abox header{padding:16px 18px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;font-size:18px}.abox header button{border:0;background:none;font-size:28px}.aitem{padding:15px;border-bottom:1px solid #eee}.abtn{border:0;border-radius:9px;padding:8px 12px;margin:4px;background:#f1f3f5}.danger{color:#c92a2a;background:#ffe3e3}.atext{white-space:pre-wrap;margin:8px 0;color:#444}.ac{margin:8px 0 0 12px;padding:8px;background:#f6f6f6;border-radius:8px}.ac button{float:right;border:0;background:none;color:#c92a2a}';document.head.appendChild(st);document.body.appendChild(p);
 const main=p.querySelector('main');
 (ps||[]).sort((a,b)=>(b.pinned-a.pinned)||new Date(b.created_at)-new Date(a.created_at)).forEach(x=>{
  const d=document.createElement('section');d.className='aitem';d.innerHTML='<b></b><div class="atext"></div><div class="acts"></div>';d.querySelector('b').textContent=(x.user_name||'匿名')+(x.pinned?'  📌已置顶':'');d.querySelector('.atext').textContent=x.content||'';const a=d.querySelector('.acts');
  [['pin',x.pinned?'取消置顶':'置顶'],['hide',x.hidden?'恢复显示':'隐藏'],['del','删除动态']].forEach(([k,t])=>{const b=document.createElement('button');b.className='abtn '+(k==='del'?'danger':'');b.textContent=t;b.onclick=async()=>{if(k==='del'&&!confirm('确定删除这条动态吗？'))return;const r=await s.from('posts')[k==='del'?'delete':'update'](k==='del'?{}:{[k==='pin'?'pinned':'hidden']:!x[k==='pin'?'pinned':'hidden']}).eq('id',x.id);if(r.error)alert(r.error.message);else location.reload()};a.appendChild(b)});
  (x.post_comments||[]).forEach(c=>{const q=document.createElement('div');q.className='ac';q.innerHTML='<button>删除</button>';const t=document.createElement('span');t.textContent=(c.user_name||'匿名')+'：'+(c.content||'');q.prepend(t);q.querySelector('button').onclick=async()=>{if(!confirm('确定删除这条评论吗？'))return;const r=await s.from('post_comments').delete().eq('id',c.id);if(r.error)alert(r.error.message);else location.reload()};d.appendChild(q)});main.appendChild(d)
 });
 p.querySelector('#ax').onclick=()=>p.remove();
}
const b=document.getElementById('class-admin-btn');if(b)b.onclick=openAdmin;
})();
