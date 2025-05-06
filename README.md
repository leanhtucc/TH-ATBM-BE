# Password Manager API

## Cách kiểm tra và sửa lỗi 2FA

### 1. Reset 2FA (Trong môi trường phát triển)

```http
POST http://localhost:3456/api/auth/reset-2fa
Content-Type: application/json

{
  "userId": "YOUR_USER_ID"
}
```

### 2. Debug 2FA

```http
POST http://localhost:3456/api/auth/debug-2fa
Content-Type: application/json

{
  "secret": "YOUR_SECRET",
  "code": "CODE_FROM_AUTHENTICATOR"
}
```

### 3. Sử dụng mã master (Trong môi trường phát triển)

```http
POST http://localhost:3456/api/auth/verify-2fa
Content-Type: application/json

{
  "userId": "YOUR_USER_ID",
  "twoFACode": "000000"
}
```

### 4. Thiết lập lại 2FA

```http
PUT http://localhost:3456/api/auth/2fa-settings
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "enable2FA": true
}
```

## Các API Chính

### 1. Đăng ký tài khoản

```http
POST http://localhost:3456/api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "StrongPassword123",
  "enable2FA": false
}
```

### 2. Đăng nhập

```http
POST http://localhost:3456/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### 3. Xác thực 2FA

```http
POST http://localhost:3456/api/auth/verify-2fa
Content-Type: application/json

{
  "userId": "USER_ID_FROM_LOGIN_RESPONSE",
  "twoFACode": "CODE_FROM_AUTHENTICATOR"
}
```

### 4. Làm mới token

```http
POST http://localhost:3456/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

### 5. Lưu mật khẩu

```http
POST http://localhost:3456/api/passwords
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "website": "facebook.com",
  "username": "user@example.com",
  "encryptedData": "ENCRYPTED_DATA",
  "iv": "IV_STRING"
}
```

### 6. Lấy danh sách mật khẩu

```http
GET http://localhost:3456/api/passwords
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 7. Cập nhật mật khẩu

```http
PUT http://localhost:3456/api/passwords/PASSWORD_ID
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "website": "facebook.com",
  "username": "user@example.com",
  "encryptedData": "NEW_ENCRYPTED_DATA",
  "iv": "NEW_IV_STRING"
}
```

Hoặc

```http
PUT http://localhost:3456/api/passwords
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "id": "PASSWORD_ID",
  "website": "facebook.com",
  "username": "user@example.com",
  "encryptedData": "NEW_ENCRYPTED_DATA",
  "iv": "NEW_IV_STRING"
}
```

## env

