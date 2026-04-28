# MVSR Alumni Portal - MySQL Workbench Setup Guide

## 🎯 Database Configuration

### **Connection Details:**
- **Hostname**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: Shiva@56
- **Database**: mvsr_alumni

---

## 📋 Step-by-Step Setup Instructions

### **1. Open MySQL Workbench**
- Launch MySQL Workbench
- Click on the "+" icon to create a new connection

### **2. Configure Connection**
```
Connection Name: MVSR Alumni Portal
Hostname: localhost
Port: 3306
Username: root
Password: Shiva@56
Default Schema: mvsr_alumni
```

### **3. Test Connection**
- Click "Test Connection" button
- Enter password: Shiva@56
- Verify connection is successful

### **4. Setup Database**
1. Open the SQL editor for your connection
2. Copy and paste the contents of `mysql_setup.sql`
3. Execute the script (Ctrl+Shift+Enter or click the lightning bolt)

---

## 🗄️ Database Schema

### **Tables Created:**

#### **✅ users** - Main user accounts table
- Stores all user information (admin, alumni, students, faculty)
- Includes profile, social links, and preferences
- Indexed for fast queries

#### **✅ events** - Events management
- College events, reunions, workshops
- Date/time and location tracking

#### **✅ news** - News and announcements
- College news and alumni updates
- Published/unpublished status

#### **✅ jobs** - Job postings
- Career opportunities for alumni
- Company and skill requirements

#### **✅ gallery** - Photo gallery
- Event photos and memories
- Categorized with tags

---

## 🔧 Connection String for Application

### **Environment Variable:**
```bash
MYSQL_URI=root:Shiva@56@tcp(localhost:3306)/mvsr_alumni?parseTime=true
```

### **Go Application Config:**
```go
MySQLURI: "root:Shiva@56@tcp(localhost:3306)/mvsr_alumni?parseTime=true"
```

---

## 🎯 Verification Steps

### **1. Check Database Creation**
```sql
SHOW DATABASES;
-- Should show: mvsr_alumni
```

### **2. Check Tables**
```sql
USE mvsr_alumni;
SHOW TABLES;
-- Should show: users, events, news, jobs, gallery
```

### **3. Check Sample Data**
```sql
SELECT COUNT(*) FROM users;
-- Should show: 1 (admin user)
```

---

## 🚀 Ready for Development

Once you complete these steps:
1. ✅ Database is created and configured
2. ✅ All tables are set up with proper indexes
3. ✅ Sample admin user is ready
4. ✅ Application can connect using password "Shiva@56"

### **Next Steps:**
1. Run the backend application
2. Test database connection
3. Run seed data script
4. Verify authentication works

---

## 🔐 Security Notes

- **Password**: Shiva@56 (as requested)
- **Character Set**: utf8mb4 for full Unicode support
- **Collation**: utf8mb4_unicode_ci for case-insensitive searches
- **Engine**: InnoDB for transaction support and foreign keys

---

## 📞 Support

If you encounter any issues:
1. Verify MySQL service is running
2. Check password: Shiva@56
3. Ensure port 3306 is accessible
4. Review MySQL Workbench connection logs

**Your MVSR Alumni Portal database is now ready!** 🎉
