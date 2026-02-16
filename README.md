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

### 5. Jalankan server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000`.

---

## � API Documentation

Dokumentasi API menggunakan **Swagger UI** dan tersedia di:

```
http://localhost:3000/api-docs
```

Semua endpoint, request/response body, dan autentikasi bisa dilihat dan ditest langsung dari Swagger UI.

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
    │   └── productController.js
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
    │   └── 20260216060000-create-products-table.js
    │
    ├── models/
    │   ├── index.js
    │   ├── User.js
    │   ├── Token.js
    │   ├── Website.js
    │   └── Product.js
    │
    ├── routes/
    │   ├── index.js
    │   ├── authRoutes.js
    │   ├── websiteRoutes.js
    │   └── productRoutes.js
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
