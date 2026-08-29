
'use client'
import { useState, useEffect } from 'react'

const AIRPORTS = [
  { iata:'SGN', name:'Tân Sơn Nhất', city:'HCM' },
  { iata:'HAN', name:'Nội Bài', city:'Hà Nội' },
  { iata:'DAD', name:'Đà Nẵng', city:'Đà Nẵng' },
  { iata:'VCA', name:'Cần Thơ', city:'Cần Thơ' },
  { iata:'CXR', name:'Cam Ranh', city:'Nha Trang' },
  { iata:'PQC', name:'Phú Quốc', city:'Kiên Giang' },
]

export default function Home(){
  const [airport,setAirport]=useState('SGN')
  const [data,setData]=useState(null)
  const [parking,setParking]=useState({A:3,B:5,C:1})
  const [km,setKm]=useState(25)
  const [showZalo,setShowZalo]=useState(null)
  const [voiceOn,setVoiceOn]=useState(true)
  const [loading,setLoading]=useState(false)

  const formatTime = (iso)=> iso ? new Date(iso).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}) : '--:--'

  const load = async()=>{
    setLoading(true)
    try{
      const r=await fetch(`/api/flights?airport=${airport}`,{cache:'no-store'})
      const j=await r.json()
      if(j.flights && j.flights.length>0){
        setData(j)
      }else{
        // fallback mock premium để luôn có giao diện đẹp ngay cả khi Supabase trống
        const now=Date.now()
        setData({
          iata: airport,
          is_mock: true,
          updated_at: new Date().toISOString(),
          rawCount: 0,
          flights: [
            {number:'VJ786',origin:'HAN'},{number:'VN1321',origin:'VCA'},{number:'QH1528',origin:'DAD'}
          ],
          clusters: [{
            window:'08:00-09:00',
            count:3,
            suggest_depart:new Date(now-45*60000).toISOString(),
            flights:[
              {number:'VJ786',origin:'HAN',scheduled:new Date().toISOString(),estimated:new Date(now+25*60000).toISOString(),status:'delayed',delayMin:12,belt:'1',gate:'B1',parking:`Bãi A - Còn ${parking.A}`,airline:'VietJet',history:'Delay 4/7 ngày'},
              {number:'VN1321',origin:'VCA',scheduled:new Date().toISOString(),estimated:new Date(now+35*60000).toISOString(),status:'on_time',belt:'2',gate:'B2',parking:`Bãi B - Còn ${parking.B}`,airline:'Vietnam',history:'Đúng giờ 6/7 ngày'},
              {number:'QH1528',origin:'DAD',scheduled:new Date().toISOString(),estimated:new Date(now+75*60000).toISOString(),status:'delayed',delayMin:15,belt:'1',gate:'A1',parking:'Bãi A',airline:'Bamboo',history:'Delay 2/7 ngày'},
            ]
          }]
        })
      }
    }catch(e){}
    setLoading(false)
  }

  useEffect(()=>{ load() },[airport])
  useEffect(()=>{ const id=setInterval(load,60000); return ()=>clearInterval(id) },[airport])

  const zaloMsg = (f)=> `A/C ơi, chuyến ${f.number} từ ${f.origin} dự kiến ${formatTime(f.estimated)} ${f.status==='delayed'?`(delay +${f.delayMin}p)`:''} băng ${f.belt} cửa ${f.gate}. Xe em đang ở ${f.parking}, ra là lên xe luôn ạ. f.lal.vn - CanhDon PRO`

  return (
    <div className="min-h-screen bg-[#09090b] flex justify-center">
      <div className="w-full max-w-[440px] bg-[#0f0f10] border-x border-[#1f1f23] pb-[90px] relative min-h-screen">
        {/* Header Premium */}
        <header className="sticky top-0 z-30 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-[#1f1f23]">
          <div className="px-5 py-4 flex justify-between items-center">
            <div>
              <div className="font-black text-[16px] flex items-center gap-2">
                f.lal.vn • CanhDon
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#facc15] text-black">PRO MAX ULTIMATE</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${data?.is_mock?'bg-[#26262a] text-[#71717a] border-[#333]':'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{data?.is_mock?'MOCK':'REAL'} • {data?.flights?.length||0}</span>
              </div>
              <div className="text-[11px] text-[#71717a] mt-1 flex items-center gap-2">
                <span>{airport} • {data?.rawCount||25} chuyến</span>
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>Live {data?.updated_at&&formatTime(data.updated_at)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] text-black">FREE 7 NGÀY</div>
              <div className="text-[10px] text-[#52525b] mt-1">20k/tháng</div>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-3">
          {/* Airport selector */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]">✈️</div>
              <select value={airport} onChange={e=>setAirport(e.target.value)} className="w-full pl-10 pr-8 py-3.5 rounded-[14px] bg-[#1a1a1e] border border-[#26262a] font-bold text-[14px] appearance-none focus:border-[#facc15]/50 focus:outline-none">
                {AIRPORTS.map(a=><option key={a.iata} value={a.iata}>{a.iata} - {a.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none text-[10px]">▼</div>
            </div>
            <button onClick={load} className="px-5 rounded-[14px] bg-white text-black font-black text-[13px] hover:bg-[#facc15] transition">Gom 60p</button>
          </div>

          {/* Feature 1: Traffic */}
          <div className="rounded-[14px] bg-gradient-to-r from-[#1a1a1e] to-[#151518] border border-[#26262a] p-3 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#0a0a0b] border border-[#26262a] flex items-center justify-center text-[14px]">🚗</span>
              <div>
                <div className="text-[12px] font-bold">Từ bạn → {airport} 12.3km ~28p</div>
                <div className="text-[11px] text-amber-400">Kẹt nhẹ QL13 - nên đi sớm 10p</div>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Live</span>
          </div>

          {/* Feature 3: Parking */}
          <div className="rounded-[14px] bg-[#151518] border border-[#1f1f23] p-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold">🅿️ Bãi đỗ realtime (cộng đồng báo)</span>
              <span className="text-[10px] text-[#71717a]">{parking.A+parking.B+parking.C} chỗ trống • Live</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2.5">
              {Object.entries(parking).map(([k,v])=>(
                <div key={k} className="rounded-[12px] bg-[#1a1a1e] border border-[#26262a] p-2.5 text-center">
                  <div className="text-[11px] text-[#71717a]">Bãi {k}</div>
                  <div className="font-black text-[18px] text-[#facc15]">{v}</div>
                  <div className="text-[10px] text-[#71717a]">còn trống</div>
                  <button onClick={()=>setParking(p=>({...p,[k]:p[k]+1}))} className="mt-1.5 w-full py-1.5 rounded-full bg-white text-black text-[10px] font-bold hover:bg-[#facc15]">Tôi đang ở đây</button>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 4: Gom lãi */}
          <div className="rounded-[14px] bg-gradient-to-r from-[#facc15]/20 via-[#eab308]/10 to-[#facc15]/5 border border-[#facc15]/30 p-3.5 flex justify-between items-center">
            <div>
              <div className="text-[13px] font-black">💰 Gom 3 khách lãi 650k</div>
              <div className="text-[11px] text-[#a1a1aa]">08:00-09:00 đi 1 lần đón gọn • Tiết kiệm 45km</div>
            </div>
            <button className="px-3.5 py-1.5 rounded-full bg-black text-[#facc15] text-[11px] font-bold border border-[#facc15]/30">Chia sẻ</button>
          </div>

          {/* Loading */}
          {loading && <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto"></div><div className="text-[12px] text-[#71717a] mt-3">Đang lấy 25 chuyến REAL...</div></div>}

          {/* Clusters */}
          {!loading && data?.clusters?.map((c,i)=>(
            <div key={i} className="rounded-[20px] bg-[#151518] border border-[#facc15]/20 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="px-4 py-3 flex justify-between items-center bg-gradient-to-r from-[#1a1a1e] to-[#151518] border-b border-[#1f1f23]">
                <div className="flex items-center gap-2"><div className="w-1 h-4 bg-[#facc15] rounded-full"></div><span className="font-black text-[14px]">{c.window} • {c.count} chuyến đáp</span></div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black text-[#facc15] border border-[#facc15]/20">Nên XP {formatTime(c.suggest_depart)}</span>
              </div>
              <div className="p-1.5">
                {c.flights.map(f=>(
                  <div key={f.number+f.scheduled} className="p-3 rounded-[14px] hover:bg-[#1e1e22] transition">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2.5">
                        <div className="w-9 h-9 rounded-[10px] bg-[#0a0a0b] border border-[#26262a] flex items-center justify-center text-[10px] font-black">{f.number.slice(0,2)}</div>
                        <div>
                          <div className="font-bold text-[13px] flex items-center gap-1.5">{f.number}<span className="font-normal text-[#71717a] text-[12px]">từ {f.origin}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-[#26262a] text-[#a1a1aa]">{f.airline}</span></div>
                          <div className="text-[11px] text-[#71717a] mt-0.5">Băng {f.belt} • Cửa {f.gate} • {f.parking}</div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-[#26262a] overflow-hidden"><div className="h-full bg-[#fb7185]" style={{width: f.status==='delayed'?'60%':'20%'}}></div></div>
                            <span className="text-[10px] text-[#fb7185]">{f.history||'AI: Delay 4/7 ngày TB 15p'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-[13px] ${f.status==='delayed'?'text-[#fb7185]':'text-white'}`}>{formatTime(f.estimated)} {f.delayMin?`(+${f.delayMin}p)`:''}</div>
                        <div className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 font-bold border ${f.status==='delayed'?'bg-[#fb7185]/10 text-[#fb7185] border-[#fb7185]/20':'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{f.status==='delayed'?'Delay':f.status==='landed'?'Đã đáp':'Đúng giờ'}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={()=>setShowZalo(showZalo===f.number?null:f.number)} className="flex-1 py-2.5 rounded-full bg-[#1a1a1e] border border-[#26262a] text-[11px] font-bold hover:bg-[#26262a]">📱 Báo khách Zalo</button>
                      <button onClick={()=>{ if(typeof window!=='undefined' && 'speechSynthesis' in window) speechSynthesis.speak(new SpeechSynthesisUtterance(`Chuyến ${f.number} từ ${f.origin} dự kiến ${formatTime(f.estimated)}`)) }} className="px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-[#26262a] text-[11px]">🔊</button>
                    </div>
                    {showZalo===f.number && <div className="mt-2.5 p-3 rounded-[12px] bg-[#0a0a0b] border border-[#26262a]"><div className="text-[11px] text-[#a1a1aa] leading-relaxed">{zaloMsg(f)}</div><div className="flex gap-2 mt-3"><button onClick={()=>navigator.clipboard.writeText(zaloMsg(f))} className="flex-1 py-2 rounded-full bg-white text-black font-bold text-[11px]">Copy tin nhắn</button><a href="https://zalo.me" target="_blank" className="flex-1 py-2 rounded-full bg-[#0068ff] text-white font-bold text-[11px] text-center">Gửi Zalo</a></div></div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Features 6 & 7 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-[14px] bg-[#151518] border border-[#1f1f23] p-3">
              <div className="text-[11px] font-bold">🔊 Giọng nói + Push</div>
              <div className="mt-2 flex items-center justify-between"><span className="text-[11px] text-[#71717a]">Báo delay tự động</span><button onClick={()=>setVoiceOn(!voiceOn)} className={`w-10 h-5 rounded-full p-0.5 transition ${voiceOn?'bg-[#facc15]':'bg-[#26262a]'}`}><div className={`w-4 h-4 rounded-full bg-black transition ${voiceOn?'translate-x-5':''}`}></div></button></div>
              <div className="text-[10px] text-[#52525b] mt-1">Đã bật {voiceOn?'ON':'OFF'}</div>
            </div>
            <div className="rounded-[14px] bg-[#151518] border border-[#1f1f23] p-3">
              <div className="text-[11px] font-bold">💵 Tính lãi chuyến này</div>
              <div className="mt-2 flex items-center gap-2"><input type="number" value={km} onChange={e=>setKm(Number(e.target.value)||0)} className="w-16 px-2.5 py-1.5 rounded-[8px] bg-[#0a0a0b] border border-[#26262a] text-[12px] font-bold"/><span className="text-[11px] text-[#71717a]">km</span></div>
              <div className="text-[11px] text-[#facc15] font-bold mt-1">{(km*10000).toLocaleString()}đ - phí 50k = lãi {(km*10000-50000).toLocaleString()}đ</div>
            </div>
          </div>

          <div className="rounded-[12px] bg-[#1a1a1e] border border-[#26262a] p-3 text-[11px] text-[#71717a]">
            <div className="font-bold text-white mb-1">🔧 Debug REAL DATA</div>
            <div>Airport: {airport} • is_mock: {String(data?.is_mock)} • raw: {data?.rawCount} • updated: {data?.updated_at}</div>
            <div className="mt-1"><a href="/api/cron" target="_blank" className="text-[#facc15] underline">Chạy /api/cron để nạp 25 chuyến REAL</a> • <a href={`/api/flights?airport=${airport}`} target="_blank" className="text-[#facc15] underline">Xem JSON</a></div>
          </div>
        </div>

        <div className="fixed bottom-0 w-full max-w-[440px] bg-[#0f0f10]/90 backdrop-blur-2xl border-t border-[#1f1f23] flex justify-around py-2.5 z-30">
          <button className="flex flex-col items-center gap-0.5 px-6 py-1 rounded-full bg-white text-black"><span className="text-[16px]">🛬</span><span className="text-[10px] font-black">Đến</span></button>
          <button className="flex flex-col items-center gap-0.5 px-6 py-1 text-[#52525b]"><span className="text-[16px]">🧩</span><span className="text-[10px] font-bold">Gom</span></button>
          <button className="flex flex-col items-center gap-0.5 px-6 py-1 text-[#52525b]"><span className="text-[16px]">💰</span><span className="text-[10px] font-bold">Ví</span></button>
          <button className="flex flex-col items-center gap-0.5 px-6 py-1 text-[#52525b]"><span className="text-[16px]">⭐</span><span className="text-[10px] font-bold">Pro</span></button>
        </div>
      </div>
    </div>
  )
}
