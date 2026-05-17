
# My-worker 🚀

<div align="center">

**ساخت و استقرار یک Cloudflare Worker بدون نیاز به دسترسی به داشبورد کلودفلر**

[![Stars](https://img.shields.io/github/stars/Aporis3674/My-worker?style=social)](https://github.com/Aporis3674/My-worker)
[![Forks](https://img.shields.io/github/forks/Aporis3674/My-worker?style=social)](https://github.com/Aporis3674/My-worker)

</div>

## 📖 درباره پروژه

این پروژه به شما امکان می‌دهد یک **Cloudflare Worker** را به صورت کامل از طریق خط فرمان و بدون ورود به داشبورد کلودفلر بسازید، پیکربندی کنید و مستقر نمایید. تمام مراحل توسط ابزار **Wrangler** و گردش کار خودکار **GitHub Actions** مدیریت می‌شود.

## ✨ ویژگی‌ها

- استقرار خودکار با GitHub Actions
- پیکربندی کامل از طریق فایل `wrangler.toml`
- مدیریت آسان رازها (Secrets) و متغیرهای محیطی
- بدون وابستگی به رابط کاربری وب کلودفلر
- ساختار کد تمیز و ماژولار در پوشه `src/`

## 📂 ساختار پروژه

```
My-worker/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   └── worker.js
├── wrangler.toml
└── README.md
```

## 🚀 شروع سریع

### پیش‌نیازها

- یک حساب کاربری Cloudflare
- نصب Node.js (نسخه ۱۶ یا بالاتر)
- نصب Wrangler:
  ```bash
  npm install -g wrangler
  ```

### نصب و راه‌اندازی

1. مخزن را Fork و سپس Clone کنید:
   ```bash
   git clone https://github.com/YOUR_USERNAME/My-worker.git
   cd My-worker
   ```
2. وارد حساب Cloudflare شوید:
   ```bash
   wrangler login
   ```
3. فایل `wrangler.toml` را با شناسه حساب خود ویرایش کنید.

### استقرار دستی

```bash
wrangler deploy
```

### استقرار خودکار با GitHub Actions

1. در تنظیمات مخزن، این Secrets را اضافه کنید:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. کد را Push کنید تا استقرار خودکار در تب Actions آغاز شود.

## ⚙️ پیکربندی

فایل `wrangler.toml`:

```toml
name = "my-worker"
main = "src/worker.js"
compatibility_date = "2024-01-01"
account_id = "ACCOUNT_ID_FROM_CLOUDFLARE"

[observability]
enabled = true
```

## 📝 نمونه کد Worker

```javascript
export default {
  async fetch(request, env, ctx) {
    return new Response('سلام دنیا! این Worker من است 🎉', {
      headers: { 'content-type': 'text/plain;charset=utf-8' },
    });
  },
};
```
