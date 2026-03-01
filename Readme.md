# NexusApp — Frontend

React + Axios frontend for the NexusApp E-Commerce backend.

---

## 📁 Cấu Trúc Thư Mục

```
nexus-frontend/
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite config + proxy /api → localhost:8080
├── package.json
├── .env.example                      # Copy → .env.local để cấu hình API URL
│
└── src/
    ├── main.jsx                      # ReactDOM.createRoot
    ├── App.jsx                       # BrowserRouter + AppRouter
    │
    ├── styles/
    │   └── global.css                # CSS variables, reset, keyframes
    │
    ├── constants/
    │   ├── api.js                    # API_BASE_URL + ENDPOINTS object
    │   └── routes.js                 # ROUTES object (path strings)
    │
    ├── api/
    │   ├── axiosInstance.js          # Axios instance + JWT interceptors
    │   └── authApi.js                # register / login / refresh / logout
    │
    ├── hooks/
    │   └── useRegister.js            # Form state + validation + API call
    │
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx / .css     # Reusable button (primary, ghost)
    │   │   ├── InputField.jsx / .css # Reusable input with icon + label
    │   │   └── Alert.jsx / .css      # Error / success / info messages
    │   │
    │   └── layout/
    │       ├── Navbar.jsx / .css     # Top navigation bar
    │       └── Footer.jsx / .css     # Bottom footer with icons
    │
    ├── pages/
    │   └── auth/
    │       └── Register/
    │           ├── Register.jsx      # Page (presentational only)
    │           └── Register.css      # Page-specific styles
    │
    └── router/
        └── AppRouter.jsx             # All route definitions
```

---

## 🚀 Khởi chạy

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file env
cp .env.example .env.local
# Sửa VITE_API_BASE_URL nếu backend chạy khác port

# 3. Chạy dev server (port 3000)
npm run dev
```

---

## 🔌 Kết nối Backend

File `src/api/axiosInstance.js` tự động:
- Đính kèm `Authorization: Bearer <token>` vào mọi request
- Tự refresh token khi nhận 401
- Redirect về `/login` nếu refresh thất bại

---

## 📐 Quy ước thêm trang mới

1. Tạo folder: `src/pages/<module>/<PageName>/`
2. Tạo `<PageName>.jsx` + `<PageName>.css`
3. Tạo hook `src/hooks/use<PageName>.js` cho logic
4. Thêm API call vào `src/api/<module>Api.js`
5. Đăng ký route trong `src/router/AppRouter.jsx`