# MongoDB Atlas Setup Guide for MVSR Alumni Network

## 🎯 Current Status
✅ **Database Credentials**: Configured correctly
✅ **Connection String**: Updated with your credentials
⚠️ **IP Whitelisting**: Required (Your IP: 175.101.27.156/32)

## 🔧 Quick Fix Steps

### Step 1: Access MongoDB Atlas
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Login with your credentials
3. Select your cluster "Cluster0"

### Step 2: Whitelist Your IP Address
1. Click on **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (Easiest)
   - OR
   - Click **"Add Current IP Address"** to add 175.101.27.156/32
4. Click **"Confirm"**

### Step 3: Wait for Deployment
- Wait 2-3 minutes for changes to take effect
- The green checkmark should appear next to your IP

## 🚀 Alternative: Use "Allow Access from Anywhere"

**Recommended for Development:**
1. In Network Access → Add IP Address
2. Choose **"Allow Access from Anywhere"**
3. This adds 0.0.0.0/0 to whitelist
4. Click **"Confirm"**

## 🔍 Verify Connection

Once IP is whitelisted, run:
```bash
cd backend
npm run seed
```

Expected output:
```
Connected to MongoDB
Cleared existing data
Created 3 users
Created 3 events
Database seeded successfully!

Sample Login Credentials:
Email: john.doe@mvsralumni.edu, Password: password123
Email: priya.sharma@mvsralumni.edu, Password: password123
Email: amit.reddy@mvsralumni.edu, Password: password123
```

## 📱 Test the Application

After successful seeding:
1. **Backend**: Running on http://localhost:5000 ✅
2. **Frontend**: Running on http://localhost:3000 ✅
3. **Login**: Use sample credentials to test
4. **Browse**: Alumni directory, events, jobs, news

## 🔧 If Issues Persist

### Option 1: Check Network Access
- Ensure your IP is properly whitelisted
- Wait 3-5 minutes after changes
- Try connecting again

### Option 2: Update Connection String
If you have a different cluster name, update:
```env
MONGODB_URI=mongodb+srv://regondashiva65_db_user:hY4un47vVYn0kXXw@YOUR_CLUSTER_NAME.mongodb.net/mvsr_alumni?retryWrites=true&w=majority
```

### Option 3: Test Connection Manually
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://regondashiva65_db_user:hY4un47vVYn0kXXw@cluster0.ymphiyk.mongodb.net/mvsr_alumni?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected successfully'))
  .catch(err => console.error('❌ Connection failed:', err.message));
"
```

## 📊 Database Collections Created

Once connected, these collections will be created:

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String, // bcrypt hashed
  phone: String,
  rollNumber: String,
  batch: Number,
  branch: String,
  currentPosition: String,
  company: String,
  location: String,
  industry: String,
  linkedin: String,
  bio: String,
  profileImage: String,
  isVerified: Boolean,
  isAdmin: Boolean,
  connections: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  type: String, // meetup, career, conference, workshop, networking, ceremony
  organizer: ObjectId, // Reference to User
  attendees: [{ user: ObjectId, registeredAt: Date }],
  maxAttendees: Number,
  isVirtual: Boolean,
  meetingLink: String,
  registrationDeadline: Date,
  price: Number,
  tags: [String],
  agenda: [{ time: String, title: String, description: String }],
  speakers: [{ name: String, title: String, company: String, bio: String }],
  status: String, // upcoming, ongoing, completed, cancelled
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Next Steps After Setup

1. **Test Login**: Use sample credentials
2. **Explore Features**: Browse all sections
3. **Add Real Data**: Replace sample data
4. **Configure Email**: Set up email notifications
5. **Deploy**: Ready for production deployment

## 📞 Support

If you need help:
- **MongoDB Atlas Docs**: https://docs.mongodb.com/manual/reference/connection-string/
- **Network Access Guide**: https://docs.mongodb.com/manual/atlas/security-whitelist/
- **Connection Issues**: Check cluster status and network settings

---

**Your database is 95% ready! Just whitelist your IP address and run the seed command.**
