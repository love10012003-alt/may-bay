
# F.LAL.VN - FRESH START CLEAN - 1 file duy nhất chạy được

## Xóa hết cũ:
1. Github may-bay -> Settings -> Danger Zone -> Delete this repository -> gõ may-bay
2. Vercel may-bay-2 -> Settings -> Delete Project
3. Supabase -> SQL Editor -> chạy:
drop table if exists flight_cache;
create table flight_cache (iata text primary key, data jsonb, updated_at timestamptz default now());
alter table flight_cache disable row level security;

## Bắt đầu mới:
1. Tạo repo mới may-bay trống trên Github
2. Giải nén zip này up lên
3. Vercel -> Add New Project -> Import may-bay -> Add Env (6 key) -> Deploy
4. Vào https://t.lal.vn/api/cron -> sẽ ra 25 chuyến REAL
5. Vào https://t.lal.vn -> xong

Key Aviation còn sống: c4ca3d5e19e4dcb2312b3a0c6a8c646d (test total 2021 chuyến)
