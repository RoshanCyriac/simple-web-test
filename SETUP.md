# 🚀 VPS Setup Guide

## Quick Configuration Steps

### 1. Update .env File

Edit your `.env` file with your actual VPS details:

```bash
nano .env
```

### 2. Replace These Values:

#### **VPS IP Address:**
Replace `your-vps-ip` with your actual VPS IP address:
```env
# Example: If your VPS IP is 192.168.1.100
ALLOWED_ORIGINS=http://192.168.1.100:3000,https://192.168.1.100:3000,http://your-domain.com,https://your-domain.com,http://localhost:3000
```

#### **Domain Name (if you have one):**
Replace `your-domain.com` with your actual domain:
```env
# Example: If your domain is myawesomeapp.com
ALLOWED_ORIGINS=http://your-vps-ip:3000,https://your-vps-ip:3000,http://myawesomeapp.com,https://myawesomeapp.com,http://localhost:3000
```

#### **Complete Example:**
```env
# If your VPS IP is 165.232.123.45 and domain is myapp.com
ALLOWED_ORIGINS=http://165.232.123.45:3000,https://165.232.123.45:3000,http://myapp.com,https://myapp.com,http://localhost:3000
```

### 3. Security Settings

**Change the session secret:**
```env
SESSION_SECRET=your-unique-super-secret-key-here-make-it-random-and-long
```

### 4. Environment Mode

For production deployment:
```env
NODE_ENV=production
```

For development/testing:
```env
NODE_ENV=development
```

## 🔧 Common Scenarios:

### **Scenario 1: Only VPS IP (no domain)**
```env
ALLOWED_ORIGINS=http://YOUR-VPS-IP:3000,http://localhost:3000
```

### **Scenario 2: VPS IP + Domain**
```env
ALLOWED_ORIGINS=http://YOUR-VPS-IP:3000,http://yourdomain.com,https://yourdomain.com,http://localhost:3000
```

### **Scenario 3: Domain with SSL (recommended)**
```env
ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com,http://localhost:3000
```

## 🌐 How to Find Your VPS IP:

On your VPS, run:
```bash
curl ifconfig.me
# or
ip addr show
```

## ✅ Test Your Configuration:

After updating `.env`, restart your app and test:
```bash
pm2 restart basic-web-app
curl http://YOUR-VPS-IP:3000/api/health
```

## 🔒 Security Notes:

1. **Never commit `.env` to version control** (it's in `.gitignore`)
2. **Use HTTPS in production** when possible
3. **Change the SESSION_SECRET** to something unique
4. **Only include origins you trust**

---

**Need help?** Check the main README.md for full deployment instructions! 