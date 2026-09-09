(()=>{
const U='https://uvmojhlpmrpjpfcupwbk.supabase.co',K='sb_publishable_4GCp4gl6N91d_J9z_VuooA_JVNYZCVG',B='class-resources';
const s=window.supabase.createClient(U,K);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>{if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(1)+' MB'};
async function load(){
 const box=document.getElementById('resource-files');if(!box)return;
 box.innerHTML='<div class="resource-empty">正在加载共享文件…</div>';
 const {data,error}=await s.storage.from(B).list('',{limit:100,sortBy:{column:'created_at',order:'desc'}});
 if(error){box.innerHTML='<div class="resource-empty">读取失败：'+esc(error.message)+'</div>';return}
 const files=(data||[]).filter(x=>x.name);
 if(!files.length){box.innerHTML='<div class="resource-empty">还没有文件，上传第一个吧 📚</div>';return}
 box.innerHTML=files.map(f=>{const url=s.storage.from(B).getPublicUrl(f.name).data.publicUrl;return `<div class="resource-file"><div class="resource-file-icon">📄</div><div class="resource-file-info"><b>${esc(f.name)}</b><small>${fmt(f.metadata?.size||0)}</small></div><a href="${esc(url)}" target="_blank" rel="noopener" download>下载</a></div>`}).join('');
}
async function upload(){
 const input=document.getElementById('resource-input'),status=document.getElementById('resource-status'),btn=document.getElementById('resource-upload');
 const files=[...(input?.files||[])];if(!files.length){alert('请选择要上传的文件');return}
 if(files.some(f=>f.size>50*1024*1024)){alert('单个文件不能超过 50MB');return}
 btn.disabled=true;status.textContent='正在上传…';
 for(const f of files){const safe=f.name.replace(/[^\u4e00-\u9fa5\w.()\- ]/g,'_');const path=Date.now()+'_'+Math.random().toString(36).slice(2,8)+'_'+safe;const {error}=await s.storage.from(B).upload(path,f,{upsert:false,contentType:f.type||'application/octet-stream'});if(error){status.textContent='上传失败：'+error.message;btn.disabled=false;return}}
 status.textContent='上传成功！';input.value='';btn.disabled=false;load();
}
function init(){const b=document.getElementById('resource-upload');if(!b)return;b.onclick=upload;load()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
