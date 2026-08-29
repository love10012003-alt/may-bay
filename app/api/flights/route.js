
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic='force-dynamic'
export const revalidate=0
export async function GET(req){
  const { searchParams }=new URL(req.url)
  const airport=searchParams.get('airport')||'SGN'
  const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL
  const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if(!url||!key) return NextResponse.json({iata:airport,flights:[],clusters:[],is_mock:true,error:'Missing env',updated_at:new Date().toISOString()})
  const supabase=createClient(url,key)
  const { data, error }=await supabase.from('flight_cache').select('*').eq('iata', airport).single()
  if(error){
    return NextResponse.json({iata:airport,flights:[],clusters:[],is_mock:true,error:error.message,updated_at:new Date().toISOString()})
  }
  if(data?.data) return NextResponse.json(data.data)
  return NextResponse.json({iata:airport,flights:[],clusters:[],is_mock:true,updated_at:new Date().toISOString()})
}
