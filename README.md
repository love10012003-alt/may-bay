
# f.lal.vn • CanhDon PRO MAX ULTIMATE - FULL CODE ĐẦY ĐỦ NHẤT

## Tổng quan
- App đón sân bay cho tài xế: SGN/HAN/DAD/VCA/CXR/PQC
- 25 chuyến REAL từ AviationStack (key: c4ca3d5e19e4dcb2312b3a0c6a8c646d - total 2021 đã test)
- Gom 60 phút + Gợi ý XP + Băng/Cửa/Bãi
- Monetize: FREE 7 ngày -> 20k/tháng

## 7 tính năng cao cấp PRO MAX
1. Live Traffic 12.3km ~28p kẹt QL13
2. Delay AI 4/7 ngày TB 15p
3. Bãi đỗ realtime cộng đồng A/B/C
4. Gom lãi 650k
5. Báo khách Zalo 1 chạm
6. Giọng nói + Push
7. Tính lãi km

## Giao diện
- Đen nhám #09090b + gold #facc15 + bo 20px + glass blur + Inter font
- Đẳng cấp như Grab Black / Be Pro

## Cách chạy sạch 100%
### Xóa cũ:
- Github may-bay: Settings -> Delete repository
- Vercel may-bay-2: Settings -> Delete Project
- Supabase SQL:
drop table if exists flight_cache;
create table flight_cache (iata text primary key, data jsonb, updated_at timestamptz default now());
alter table flight_cache disable row level security;

### Tạo mới:
1. Tạo repo mới may-bay trống
2. Giải nén zip này up lên
3. Vercel Add New Project -> Import may-bay -> Env:
SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, AVIATIONSTACK_KEY=c4ca3d5e19e4dcb2312b3a0c6a8c646d
4. Deploy -> vào /api/cron -> sẽ ra 25 chuyến REAL
5. Vào / -> PRO MAX full tính năng

## Build
- Next 14.2.35 + Tailwind 3.4.1 + Supabase 2.45.4
- Build 100% OK, không lỗi 14.2.5
