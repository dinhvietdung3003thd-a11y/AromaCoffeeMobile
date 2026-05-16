# Aroma Mobile

## Giới thiệu

Aroma Mobile là ứng dụng mobile được phát triển dành cho khách hàng của hệ thống Aroma Coffee. Ứng dụng được xây dựng bằng React Native kết hợp với Expo nhằm mang lại trải nghiệm đặt món trực quan, hiện đại và thuận tiện trên thiết bị di động.

Ứng dụng đóng vai trò là phía Frontend Mobile trong hệ thống Aroma Coffee, kết nối trực tiếp với Backend ASP.NET Core Web API để thực hiện các chức năng như xác thực người dùng, quản lý sản phẩm, quản lý danh mục và xử lý đơn hàng.

Thông qua ứng dụng, người dùng có thể dễ dàng đăng ký tài khoản, đăng nhập, xem danh sách sản phẩm, tìm kiếm đồ uống, thêm sản phẩm vào giỏ hàng và tạo đơn hàng trực tiếp từ điện thoại.

Dự án được xây dựng theo hướng tách biệt giữa Frontend và Backend, giúp hệ thống dễ dàng mở rộng, bảo trì và nâng cấp trong tương lai.

---

# Mục tiêu của dự án

- Xây dựng ứng dụng mobile cho hệ thống Aroma Coffee
- Tạo giao diện thân thiện và dễ sử dụng trên thiết bị di động
- Kết nối với Backend thông qua RESTful API
- Hỗ trợ quy trình đặt món trực tuyến
- Quản lý phiên đăng nhập bằng JWT Token
- Đồng bộ dữ liệu sản phẩm từ Backend
- Tối ưu trải nghiệm người dùng trên nền tảng mobile

---

# Công nghệ sử dụng

## Frontend Mobile

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage

## Backend

- ASP.NET Core Web API
- JWT Authentication
- Dapper
- MySQL
- Elasticsearch

## DevOps & Tools

- Docker
- Docker Compose
- Git & GitHub
- Swagger

---

# Thành viên nhóm
Đinh Việt Dũng - 23810310370
Nguyễn Xuân Đạt - 23810310361
Vũ Tiến Mạnh -23810310375

---

# Phân công nhiệm vụ

| Thành viên | Công việc phụ trách | Mức độ đóng góp |
|---|---|---|
| Vũ Tiến Mạnh | Xây dựng giao diện mobile bằng React Native, kết nối API Backend | 32% |
| Đinh Việt Dũng | Thiết kế Backend ASP.NET Core Web API, xử lý JWT Authentication | 36% |
| Nguyễn Xuân Đạt | Thiết kế cơ sở dữ liệu MySQL, Docker và kiểm thử hệ thống | 32% |

---

# Chức năng chính của ứng dụng

## Xác thực người dùng

- Đăng ký tài khoản khách hàng
- Đăng nhập bằng tài khoản
- Lưu JWT Token sau khi đăng nhập
- Duy trì trạng thái đăng nhập

## Quản lý sản phẩm

- Hiển thị danh sách sản phẩm
- Hiển thị danh mục sản phẩm
- Tìm kiếm sản phẩm
- Xem thông tin chi tiết sản phẩm

## Giỏ hàng và đơn hàng

- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Lưu giỏ hàng bằng AsyncStorage
- Tạo đơn hàng từ mobile
- Gửi dữ liệu đơn hàng lên Backend

## Quản lý người dùng

- Hiển thị thông tin tài khoản
- Quản lý trạng thái đăng nhập

---

# Kiến trúc hệ thống

Hệ thống Aroma Coffee được chia thành 2 phần chính:

## Frontend Mobile

Ứng dụng React Native chạy trên thiết bị di động, chịu trách nhiệm hiển thị giao diện và gửi request đến Backend API.

## Backend API

Backend ASP.NET Core Web API chịu trách nhiệm:

- Xử lý logic nghiệp vụ
- Xác thực người dùng
- Kết nối MySQL
- Quản lý sản phẩm
- Xử lý đơn hàng
- Tìm kiếm dữ liệu bằng Elasticsearch

Frontend và Backend giao tiếp với nhau thông qua REST API sử dụng HTTP Request/Response.

---

# Cấu trúc thư mục chính

```txt
AromaMobile/
├── app/                  # Các màn hình chính dùng expo-router
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── cart.tsx
│   ├── orders.tsx
│   └── profile.tsx
│
├── components/           # Component dùng chung
├── constants/            # Theme, màu sắc, config
├── services/             # File gọi API Backend
│   └── api.ts
│
├── hooks/
├── assets/
├── package.json
└── README.md
```

---

# Yêu cầu cài đặt trước

Cần cài đặt:

- Node.js
- npm
- Git
- Expo Go trên điện thoại
- Docker Desktop (nếu chạy Backend bằng Docker)

Kiểm tra Node.js:

```bash
node -v
```

Kiểm tra npm:

```bash
npm -v
```

Cài Expo CLI nếu cần:

```bash
npm install -g expo-cli
```

---

# Cách clone project

Mở terminal tại thư mục muốn lưu project:

```bash
git clone <link-repository-mobile>
```

Ví dụ:

```bash
git clone https://github.com/your-username/AromaMobile.git
```

Di chuyển vào thư mục project:

```bash
cd AromaMobile
```

Cài package:

```bash
npm install
```

---

# Cách chạy ứng dụng mobile

Chạy project:

```bash
npx expo start
```

Nếu muốn xoá cache:

```bash
npx expo start --clear
```

Sau khi chạy sẽ hiện QR code. Mở Expo Go trên điện thoại và quét QR để chạy ứng dụng.

---

# Lưu ý quan trọng khi chạy bằng điện thoại thật

Khi chạy Expo Go trên điện thoại thật:

KHÔNG dùng:

```txt
http://localhost:5035
```

hoặc:

```txt
http://127.0.0.1:5035
```

Vì localhost trên điện thoại chính là điện thoại, không phải máy tính chạy Backend.

Phải dùng IPv4 của máy tính.

Ví dụ:

```txt
http://192.168.1.10:5035
```

---

# Cách lấy IP của máy tính

Mở CMD:

```bash
ipconfig
```

Tìm dòng:

```txt
IPv4 Address . . . . . . . . . . . : 192.168.x.x
```

Ví dụ:

```txt
192.168.30.103
```

Thì Backend sẽ chạy tại:

```txt
http://192.168.30.103:5035
```

---

# Cách sửa IP trong FE mobile

Mở file:

```txt
services/api.ts
```

Tìm dòng:

```ts
const API_BASE_URL = "http://192.168.1.10:5035";
```

Sửa thành IP thật của máy đang chạy Backend.

Ví dụ:

```ts
const API_BASE_URL = "http://192.168.30.103:5035";
```

Sau khi sửa xong chạy lại:

```bash
npx expo start --clear
```

---

# Cách kiểm tra Backend có chạy hay chưa

Mở trình duyệt trên máy tính:

```txt
http://localhost:5035/swagger/index.html
```

Nếu Swagger hiện ra nghĩa là Backend đang chạy.

Sau đó thử mở bằng IP:

```txt
http://192.168.30.103:5035/swagger/index.html
```

Nếu mở được bằng IP thì mobile mới gọi API được.

---

# Cách thêm IP vào CORS trong Backend

Mở file:

```txt
appsettings.json
```

hoặc:

```txt
Program.cs
```

Ví dụ trong `appsettings.json`:

```json
"Cors": {
  "AllowedOrigins": [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}
```

Thêm IP:

```json
"Cors": {
  "AllowedOrigins": [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://192.168.30.103:5035"
  ]
}
```

---

# Ví dụ cấu hình CORS trong Program.cs

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://192.168.30.103:5035"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

Đảm bảo có:

```csharp
app.UseCors("AllowFrontend");
```

---

# Chạy Backend bằng Docker

Trong thư mục Backend:

```bash
docker compose up --build
```

Nếu muốn reset database:

```bash
docker compose down -v
docker compose up --build
```

Lưu ý:

```txt
docker compose down -v
```

sẽ xoá dữ liệu database.

---

# Kiểm tra port Backend

Ví dụ docker-compose:

```yaml
ports:
  - "5035:8080"
```

Nghĩa là:

- Máy tính gọi bằng port 5035
- Container chạy bên trong bằng 8080

FE mobile phải gọi:

```txt
http://IP_MAY:5035
```

KHÔNG gọi:

```txt
http://IP_MAY:8080
```

---

# Các API thường dùng

## Đăng nhập

```http
POST /api/Auth/customer/login
```

Body:

```json
{
  "username": "customer1",
  "password": "123456"
}
```

---

## Đăng ký

```http
POST /api/Auth/customer/register
```

Body:

```json
{
  "username": "customer1",
  "password": "123456",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0123456789",
  "email": "customer@example.com"
}
```

---

## Lấy danh sách sản phẩm

```http
GET /api/Product
```

---

## Lấy danh mục

```http
GET /api/Categories
```

---

## Tạo đơn hàng

```http
POST /api/client/orders
```

Header:

```http
Authorization: Bearer <token>
```

Body:

```json
{
  "orderDate": "2026-05-16T10:00:00.000Z",
  "tableId": null,
  "note": "Ghi chú",
  "details": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

---

# Cách hoạt động của đăng nhập

Backend trả về JWT token sau khi đăng nhập thành công.

Ví dụ response:

```json
{
  "customerId": 1,
  "fullName": "Nguyen Van A",
  "loyaltyPoints": 0,
  "role": "Customer",
  "token": "jwt-token"
}
```

Mobile sẽ lưu token để dùng cho các API cần xác thực.

---

# Cách hoạt động của giỏ hàng

Giỏ hàng được lưu bằng AsyncStorage.

Thông tin lưu thường gồm:

```ts
{
  productId: string,
  quantity: number
}
```

App sẽ lấy thông tin sản phẩm từ Backend khi hiển thị giỏ hàng.

---

# Các lỗi thường gặp

## 1. Network request failed

Nguyên nhân:

- Sai IP
- Backend chưa chạy
- Không cùng Wi-Fi
- Firewall chặn
- Gọi localhost

Cách xử lý:

- Kiểm tra IP bằng `ipconfig`
- Sửa `API_BASE_URL`
- Test Swagger bằng IP
- Chạy lại:

```bash
npx expo start --clear
```

---

## 2. Lỗi 401 Unauthorized

Nguyên nhân:

- Chưa đăng nhập
- Token sai
- Token hết hạn

Header đúng:

```http
Authorization: Bearer <token>
```

---

## 3. Lỗi 404 Not Found

Nguyên nhân:

- Sai endpoint
- Sai port
- Backend chưa có API

Ví dụ đúng:

```txt
http://192.168.30.103:5035/api/Product
```

---

## 4. Lỗi 500 Internal Server Error

Nguyên nhân thường ở Backend:

- Lỗi database
- Thiếu bảng
- Lỗi SQL
- Lỗi xử lý service

Kiểm tra log:

```bash
docker logs aromacafe_api
```

---

# Quy trình chạy project hoàn chỉnh

## Bước 1: Chạy Backend

```bash
docker compose up --build
```

Kiểm tra:

```txt
http://localhost:5035/swagger/index.html
```

---

## Bước 2: Lấy IP máy tính

```bash
ipconfig
```

Ví dụ:

```txt
192.168.30.103
```

---

## Bước 3: Sửa IP trong mobile

Mở:

```txt
services/api.ts
```

Sửa:

```ts
const API_BASE_URL = "http://192.168.30.103:5035";
```

---

## Bước 4: Thêm IP vào CORS

Thêm:

```txt
http://192.168.30.103:5035
```

vào `AllowedOrigins`.

---

## Bước 5: Chạy lại Backend

```bash
docker compose up --build
```

---

## Bước 6: Chạy mobile

```bash
npm install
npx expo start --clear
```

---

## Bước 7: Quét QR bằng Expo Go

Mở Expo Go và quét QR code.

---

# Lưu ý cho người clone project

Sau khi clone về máy khác:

BẮT BUỘC sửa lại IP trong:

```txt
services/api.ts
```

Vì mỗi máy sẽ có IPv4 khác nhau.

Ví dụ:

Máy A:

```ts
const API_BASE_URL = "http://192.168.1.10:5035";
```

Máy B:

```ts
const API_BASE_URL = "http://192.168.30.103:5035";
```

Nếu không sửa IP:

- Không đăng nhập được
- Không load được sản phẩm
- Báo lỗi network

---

# Tổng kết

Aroma Mobile là ứng dụng mobile dành cho khách hàng của hệ thống Aroma Coffee, sử dụng React Native + Expo và kết nối với Backend ASP.NET Core Web API.

Để project hoạt động đúng cần đảm bảo:

- Backend chạy thành công
- Swagger mở được
- Mobile và máy tính cùng mạng
- IP trong FE đúng
- Backend cho phép kết nối
- Chạy lại Expo sau khi sửa cấu hình
