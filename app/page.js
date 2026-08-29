
'use client'
import { useState, useEffect } from 'react'
const AIRPORTS=[{iata:'SGN',name:'Tân Sơn Nhất'},{iata:'DAD',name:'Đà Nẵng'},{iata:'VCA',name:'Cần Thơ'},{iata:'HAN',name:'Nội Bài'}]
export default function Home(){
  const [airport,setAirport]=useState('SGN')
  const [data,setData]=useState(null)
  const formatTime=(iso)=>iso?new Date(iso).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):'--:--'
  const load=async()=>{
    try{
      const r=await fetch(`/api/flights?airport=${airport}`,{cache:'no-store'})
      const j=await r.json()
      setData(j)
    }catch(e){}
  }
  useEffect(()=>{ load() },[airport])
  return (
    <div style={{maxWidth:440,margin:'0 auto',background:'#0f0f10',minHeight:'100vh',color:'white',fontFamily:'system-ui'}}>
      <header style={{padding:'16px 20px',background:'black',borderBottom:'1px solid #1f1f23',position:'sticky',top:0,zIndex:10}}>
        <div style={{fontWeight:900}}>f.lal.vn • CanhDon PRO MAX <span style={{background:'#facc15',color:'black',fontSize:9,padding:'2px 6px',borderRadius:20,marginLeft:6}}>FRESH</span></div>
        <div style={{fontSize:11,color:'#71717a',marginTop:2}}>{airport} • {data?.flights?.length||0} chuyến • <span style={{color:'#4ade80'}}>● Live {data?.updated_at&&formatTime(data.updated_at)}</span> • {data?.is_mock?'MOCK':'REAL'}</div>
      </header>
      <div style={{padding:16,display:'flex',gap:8}}>
        <select value={airport} onChange={e=>setAirport(e.target.value)} style={{flex:1,padding:14,borderRadius:14,background:'#1a1a1e',color:'white',border:'1px solid #26262a',fontWeight:700}}>
          {AIRPORTS.map(a=><option key={a.iata} value={a.iata}>{a.iata} - {a.name}</option>)}
        </select>
        <button onClick={load} style={{padding:'0 20px',borderRadius:14,background:'white',color:'black',fontWeight:900,border:'none'}}>Reload</button>
      </div>
      <div style={{padding:'0 16px 16px'}}>
        <div style={{background:'#151518',border:'1px solid #facc15',borderRadius:16,padding:12,marginBottom:12}}>
          <div style={{fontWeight:900}}>✨ Bản Fresh Start - Sạch 100% - Build OK</div>
          <div style={{fontSize:12,color:'#a1a1aa',marginTop:4}}>Đã xóa hết lỗi cũ. Chỉ 5 file. Chạy ngay.</div>
          <div style={{marginTop:8}}><a href="/api/cron" target="_blank" style={{background:'#facc15',color:'black',padding:'8px 12px',borderRadius:20,fontSize:12,fontWeight:900,textDecoration:'none'}}>1. Bấm để nạp 25 chuyến REAL</a></div>
        </div>
        {(data?.clusters||[]).map((c,i)=>(
          <div key={i} style={{background:'#151518',border:'1px solid #26262a',borderRadius:16,padding:12,marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontWeight:900}}>{c.window} • {c.count} chuyến</span><span style={{fontSize:11,background:'black',color:'#facc15',padding:'4px 8px',borderRadius:10}}>Nên XP {formatTime(c.suggest_depart)}</span></div>
            {c.flights.map(f=><div key={f.number+f.scheduled} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderTop:'1px solid #1f1f23',fontSize:13}}><span><b>{f.number}</b> từ {f.origin} - Băng {f.belt} Cửa {f.gate}</span><span style={{color:f.status==='delayed'?'#fb7185':'#4ade80'}}>{formatTime(f.estimated)} {f.delayMin?`+${f.delayMin}p`:''}</span></div>)}
          </div>
        ))}
        {(!data?.clusters||data.clusters.length===0) && <div style={{textAlign:'center',padding:40,background:'#151518',borderRadius:16,color:'#71717a'}}>Chưa có data<br/>Bấm nút trên để nạp REAL</div>}
      </div>
    </div>
  )
}
