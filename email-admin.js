(()=>{
const U='https://uvmojhlpmrpjpfcupwbk.supabase.co',K='sb_publishable_4GCp4gl6N91d_J9z_VuooA_JVNYZCVG',E='3422306811@qq.com';
const old=window.supabase.createClient.bind(window.supabase);
window.supabase.createClient=(u,k,o={})=>{o={...o,global:{...(o.global||{}),headers:{...((o.global||{}).headers||{}),'x-class-admin-email':sessionStorage.getItem('class_admin_email')||''}}};return old(u,k,o)};
function go(){
 const b=document.getElementById('class-admin-btn');if(!b)return;
 b.onclick=async()=>{
  const email=(sessionStorage.getItem('class_admin_email')||prompt('请输入管理员邮箱')||'').trim().toLowerCase();
  if(email!==E){alert('邮箱不正确，无法进入管理员。');return}
  sessionStorage.setItem('class_admin_email',E);
  const s=window.supabase.createClient(U,K);
  const {data:ps,error}=await s.from('posts').select('id,user_name,content,pinned,hidden,created_at,post_comments(id,user_name,content)').order('created_at',{ascending:false}).limit(100);
  if(error){alert('读取动态失败：'+error.message);return}
  let x='管理员已登录\\n\\n';(ps||[]).forEach(p=>{x+=`【${p.user_name}】 ${p.pinned?'[置顶] ':''}${p.hidden?'[隐藏] ':''}\\n${p.content||''}\\nID: ${p.id}\\n\\n`});
  const action=prompt(x+'输入操作：\\n1=刷新/查看\\n2=置顶第一条\\n3=隐藏第一条\\n4=删除第一条\\n5=退出');
  if(action==='5'){sessionStorage.removeItem('class_admin_email');return}
  if(!ps||!ps[0])return;
  const p=ps[0];let r;
  if(action==='2')r=await s.from('posts').update({pinned:!p.pinned}).eq('id',p.id);
  if(action==='3')r=await s.from('posts').update({hidden:!p.hidden}).eq('id',p.id);
  if(action==='4'&&confirm('确定删除第一条动态？'))r=await s.from('posts').delete().eq('id',p.id);
  if(r?.error)alert('操作失败：'+r.error.message);else if(r)alert('操作完成');
 };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(go,3000));else setTimeout(go,3000);
})();
