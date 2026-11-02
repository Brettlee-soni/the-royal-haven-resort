# 🏨 The Royal Haven Resort
### Luxury MERN Hotel Management System

The Royal Haven Resort is a full-stack hotel management application built using the MERN stack. It is designed to simplify hotel operations by providing an integrated platform for room management, guest services, reservations, bookings, and payment processing.

## ✨ Features

- **Room Management** – Add, manage, and display hotel rooms.
- **Booking Management** – Create, view, and manage guest reservations.
- **Guest Management** – Manage guest accounts and information.
- **Authentication** – Secure login and user authentication.
- **Dashboard Analytics** – View hotel management statistics and booking information.
- **Restaurant Menu** – Display restaurant menu information.
- **Guest Helpdesk** – Provide assistance and support to guests.
- **Payment Integration** – Razorpay payment integration.
- **Responsive UI** – Modern interface for a better user experience.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Tools & Services
- Git and GitHub
- Visual Studio Code
- Razorpay

## 📁 Project Structure

```text
the-royal-haven-resort/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Room.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── roomRoutes.js
│   │
│   ├── seed.js
│   └── server.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Brettlee-soni/the-royal-haven-resort.git
```

### 2. Navigate to the Project

```bash
cd the-royal-haven-resort
```

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

Add the following configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Replace the placeholder values with your own credentials. Never upload your actual `.env` file to GitHub.

### 5. Install Frontend Dependencies

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

### 7. Start the Backend

Open another terminal in the project root directory and run:

```bash
node server/server.js
```

The backend will run at:

`http://localhost:5000`

## 🔐 Security

- Environment variables are used for sensitive configuration.
- Database credentials and API secrets should never be committed to GitHub.
- Authentication and backend routes are managed through the server.

## 🚀 Future Enhancements

- Advanced room availability management.
- Enhanced booking and cancellation workflows.
- Improved admin and staff management.
- Detailed revenue and occupancy reports.
- Additional guest services and notifications.

## 👨‍💻 Author

**Brettlee Soni**

- GitHub: [@Brettlee-soni](https://github.com/Brettlee-soni)
- Project: [The Royal Haven Resort](https://github.com/Brettlee-soni/the-royal-haven-resort)

---

⭐ If you find this project interesting, consider giving it a star on GitHub!

**The Royal Haven Resort — Experience Luxury, Simplified.**
