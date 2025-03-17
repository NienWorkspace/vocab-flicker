
# Cấu trúc cơ sở dữ liệu Supabase

Để thiết lập cơ sở dữ liệu trong Supabase cho ứng dụng Flashcards này, hãy thực hiện các bước sau:

## Bước 1: Tạo dự án Supabase
1. Đăng nhập vào [Supabase](https://supabase.com)
2. Tạo một dự án mới
3. Sau khi dự án được tạo, đi đến phần SQL Editor

## Bước 2: Thực thi SQL
1. Mở phần SQL Editor trong Supabase
2. Sao chép toàn bộ nội dung của tệp `database.sql` 
3. Dán vào SQL Editor và thực thi

## Bước 3: Cấu hình ứng dụng
1. Lấy Supabase URL và Anon Key từ phần Settings > API trong dự án Supabase của bạn
2. Tạo tệp `.env.local` ở thư mục gốc dự án và thêm vào:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
3. Khởi động lại máy chủ phát triển

## Cấu trúc bảng

### profiles
- Bảng này lưu trữ thông tin bổ sung cho người dùng
- Được liên kết với `auth.users` bằng cột `id`
- Tự động tạo khi người dùng đăng ký

### folders
- Lưu trữ các thư mục do người dùng tạo
- Mỗi thư mục thuộc về một người dùng

### study_sets
- Lưu trữ các bộ học tập
- Mỗi bộ học tập thuộc về một người dùng
- Có thể thuộc về một thư mục (tùy chọn)

### vocabularies
- Lưu trữ các từ vựng trong mỗi bộ học tập
- Mỗi từ vựng thuộc về một bộ học tập

### Views
- `folders_with_count`: Hiển thị số lượng bộ học tập trong mỗi thư mục
- `study_sets_with_count`: Hiển thị số lượng từ vựng trong mỗi bộ học tập

## Bảo mật
- Row Level Security (RLS) được bật cho tất cả các bảng
- Người dùng chỉ có thể xem, sửa, thêm và xóa dữ liệu của chính họ
