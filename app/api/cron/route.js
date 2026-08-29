
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic='force-dynamic'
const AIRPORTS=['SGN','VCA','HAN','DAD','CXR','PQC']
async function fetchReal(iata,key){
  try{
    const url=`https://api.aviationstack.com/v1/flights?access_key=${key}&arr_iata=${iata}&limit=25`
    const res=await fetch(url,{cache:'no-store'})
    const json=await res.json()
    if(!json.data) return {flights:[]}
    const flights=json.data.map(f=>({number:f.flight?.iata||f.flight?.number,origin:f.departure?.iata||'???',scheduled:f.arrival?.scheduled,estimated:f.arrival?.estimated||f.arrival?.scheduled,status:f.arrival?.delay>5?'delayed':f.flight_status,delayMin:f.arrival?.delay||0,gate:f.arrival?.gate||'B1',belt:f.arrival?.baggage||'1',airline:(f.airline?.name||'').split(' ')[0]}))
    return {flights,rawCount:json.data.length}
  }catch(e){return {flights:[]}}
}
function cluster60(flights){
  const sorted=[...flights].sort((a,b)=> new Date(a.estimated)-new Date(b.estimated))
  const clusters=[];let cur=[];let start=null
  for(const f of sorted){const t=new Date(f.estimated).getTime();if(start===null){start=t;cur=[f];continue}if(t-start<=3600000){cur.push(f)}else{clusters.push(cur);cur=[f];start=t}}
  if(cur.length)clusters.push(cur)
  return clusters.map(c=>{const first=new Date(c[0].estimated);const last=new Date(c[c.length-1].estimated);return {window:`${first.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}-${last.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}`,count:c.length,suggest_depart:new Date(first.getTime()-45*60000).toISOString(),flights:c}})
}
export async function GET(){
  const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL
  const skey=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_PUBLISHABLE_KEY
  const aviationKey=process.env.AVIATIONSTACK_KEY
  const supabase=createClient(url,skey)
  const results=[]
  for(const iata of AIRPORTS){
    const {flights,rawCount}=await fetchReal(iata,aviationKey)
    let final=flights.length?flights:[{number:'VJ786',origin:'HAN',scheduled:new Date().toISOString(),estimated:new Date(Date.now()+25*60000).toISOString(),status:'delayed',delayMin:12,belt:'1',gate:'B1'}]
    const clusters=cluster60(final)
    const payload={iata,flights:final,clusters,updated_at:new Date().toISOString(),is_mock:flights.length===0,rawCount:rawCount||0}
    await supabase.from('flight_cache').upsert({iata,data:payload,updated_at:payload.updated_at},{onConflict:'iata'})
    results.push({iata,count:final.length,is_mock:flights.length===0,raw:rawCount||0})
  }
  return NextResponse.json({ok:true,results})
}
