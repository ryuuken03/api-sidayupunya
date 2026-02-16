# Antigravity API

Node.js API Backend menggunakan Express.js + Sequelize ORM + MySQL.

---

## 🚀 Quick Start (Pertama kali setelah clone)

### 1. Install dependencies

```bash
npm install
```

### 2. Buat file `.env`

Copy template di bawah ini dan simpan sebagai `.env` di root project:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sidayupunya
DB_PORT=3306

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

> ⚠️ File `.env` tidak masuk ke Git (ada di `.gitignore`), jadi harus dibuat manual setiap clone baru.

### 3. Buat database MySQL

```sql
CREATE DATABASE sidayupunya;
```

### 4. Jalankan migration

```bash
npx sequelize-cli db:migrate
```

### 5. Set admin user

Setelah migration, set user pertama sebagai admin:

```sql
UPDATE users SET level_role = 0 WHERE id = 1;
```

> `level_role = 0` = Admin, `level_role = 1` = User biasa (default)

### 6. Jalankan server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000`.

---

## 📖 API Documentation

Dokumentasi API menggunakan **Swagger UI** dan tersedia di:

```
http://localhost:3000/api-docs
```

---

## 🔐 Endpoint & Autentikasi

### Auth
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| POST | `/api/auth/register` | 🔒 Admin only (level_role=0) | Register user baru |
| POST | `/api/auth/login` | 🌐 Public | Login, return JWT token |

### Websites
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/api/websites` | 🔒 Token | List website milik user |
| GET | `/api/websites/:slug` | 🌐 Public | Detail website by slug |
| POST | `/api/websites` | 🔒 Token | Buat website baru |
| PUT | `/api/websites/:slug` | 🔒 Token | Update website (owner/admin) |
| DELETE | `/api/websites/:slug` | 🔒 Token | Hapus website (owner/admin) |

### Products
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/api/websites/:websiteSlug/products` | 🌐 Public | List produk di website |
| GET | `/api/products/:slug` | 🌐 Public | Detail produk by slug |
| POST | `/api/products` | 🔒 Token | Buat produk (websiteId di body) |
| PUT | `/api/products/:slug` | 🔒 Token | Update produk (owner/admin) |
| DELETE | `/api/products/:slug` | 🔒 Token | Hapus produk (owner/admin) |

### Analytics
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| POST | `/api/analytics/track` | 🌐 Public | Record event (dari frontend) |
| GET | `/api/analytics/summary/:websiteSlug` | 🔒 Token | Ringkasan analitik |
| GET | `/api/analytics/daily/:websiteSlug` | 🔒 Token | Statistik harian |
| GET | `/api/analytics/top-products/:websiteSlug` | 🔒 Token | Produk terpopuler |
| GET | `/api/analytics/events/:websiteSlug` | 🔒 Token | Raw events + pagination |

---

## 📁 Struktur Project

```
API/
├── .env
├── .gitignore
├── .sequelizerc
├── package.json
├── README.md
└── src/
    ├── server.js
    ├── app.js
    │
    ├── config/
    │   ├── index.js
    │   ├── database.js
    │   ├── sequelizeConfig.js
    │   └── swagger.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── websiteController.js
    │   ├── productController.js
    │   └── analyticController.js
    │
    ├── middlewares/
    │   ├── errorHandler.js
    │   └── authMiddleware.js
    │
    ├── migrations/
    │   ├── 20260216010000-create-users-table.js
    │   ├── 20260216020000-create-tokens-table.js
    │   ├── 20260216030000-create-websites-table.js
    │   ├── 20260216040000-add-columns-to-websites.js
    │   ├── 20260216050000-add-has-product-to-websites.js
    │   ├── 20260216060000-create-products-table.js
    │   ├── 20260216070000-add-unique-slug-indexes.js
    │   ├── 20260216080000-create-analytics-table.js
    │   └── 20260216090000-add-level-role-to-users.js
    │
    ├── models/
    │   ├── index.js
    │   ├── User.js
    │   ├── Token.js
    │   ├── Website.js
    │   ├── Product.js
    │   └── Analytic.js
    │
    ├── routes/
    │   ├── index.js
    │   ├── authRoutes.js
    │   ├── websiteRoutes.js
    │   ├── productRoutes.js
    │   └── analyticRoutes.js
    │
    └── utils/
        └── apiResponse.js
```

---

## 🔧 Sequelize CLI Commands

```bash
# Jalankan semua migration
npx sequelize-cli db:migrate

# Rollback migration terakhir
npx sequelize-cli db:migrate:undo

# Rollback semua migration
npx sequelize-cli db:migrate:undo:all

# Buat migration baru
npx sequelize-cli migration:generate --name create-xxx-table
```

---

## 🛠️ Tech Stack

| Komponen | Library |
|----------|---------|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Sequelize |
| Database | MySQL (mysql2) |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Middleware | cors, morgan |
| Config | dotenv |
| Dev Tools | nodemon |

---

## 📝 NPM Scripts

| Script | Command | Keterangan |
|--------|---------|------------|
| `npm run dev` | `nodemon src/server.js` | Development (auto-reload) |
| `npm start` | `node src/server.js` | Production |
