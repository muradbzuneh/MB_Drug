💊 Drug Tracker System

A full-stack web application for managing drug information, tracking medication schedules, and connecting patients with pharmacists.

---

🚀 Features

👤 User (Patient)

* Browse and search drugs
* View detailed drug information
* Set medication reminders
* Track daily drug usage
* Upload prescriptions (image + note)
* Leave feedback on drugs
* Access health tips
* Contact support

👨‍⚕️ Pharmacist

* Add, update, delete drugs
* View user prescriptions

🛡️ Admin

* Manage users and roles
* Control system access

---

🧠 Core Functionalities

* 🔐 Authentication & Authorization (role-based)
* 💊 Drug management system (CRUD)
* 🔍 Search & filtering
* ⏰ Reminder / tracking system
* 📤 Prescription upload (image)
* ⭐ Feedback system
* 📊 Dashboard UI with sidebar

---

 🛠️ Tech Stack

* Frontend & Backend: Next.js (App Router)
* Authentication:** NextAuth.js
* Database: PostgreSQL (Neon)
* ORM: Prisma
* Image Upload: Cloudinary
* Styling:Tailwind CSS
* Package Manager: pnpm

---

 📁 Project Structure

* `app/` → Routes & pages
* `app/api/` → Backend APIs
* `prisma/` → Database schema
* `lib/` → Config (Prisma client)
* `utils/` → Helpers (image upload)

---

⚙️ Environment Variables

Create `.env` file:

```
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

▶️ Run Locally

```bash
pnpm install
pnpm dev --no-turbo
```

---

🌍 Deployment

This project is deployed using:

* Vercel (Frontend + API)
* Neon (Database)
* Cloudinary (Image storage)

---

 📌 Future Improvements

* Email notifications
* Push notifications
* Mobile responsiveness improvements
* Admin dashboard enhancements

---

👨‍💻 Author

Murad Bzuneh

---

 📄 License

This project is for educational and portfolio purposes.
