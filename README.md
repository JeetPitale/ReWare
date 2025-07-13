
# Problem Statement 
ReWear – Community Clothing Exchange

# Team Members
1) Name: Yash Bachwani
   Email:-yash.bachwani30@gmail.com
2) Name: Jeet Pitale
   Email:- jeetdipakpitale1107@gmail.com
3) Name: Trishna Chhabria
   Email:-chhabriatrishna@gmail.com
4) Name: Anusha Daryani
   Email:-daryanianusha02@gmail.com

# Video Link
https://drive.google.com/drive/folders/1LHOPAFNXHTlJ7npss5bZeexFhqIwokjm?usp=drive_link
   
# 🧥 ReWear – Community Clothing Exchange Platform
ReWear is a modern, community-driven clothing exchange platform that empowers users to swap their unused clothes instead of throwing them away. Whether you're an eco-conscious individual or just looking to refresh your wardrobe sustainably, ReWear is the go-to app!

📌 Features
🌍 User Location Based Search
Users can browse items listed by others nearby.

👕 List Clothing Items
Upload clothes with image, type, size, and optional price.

🔁 Swap System
Redeem items using a point-based system or direct swap.

📷 Image Upload Preview
See your uploaded clothing item before submitting.

📱 Mobile-First Responsive UI
Designed using Tailwind CSS with support for dark mode and smooth animations.

🎉 Toast Notifications
Interactive feedback using react-toastify (e.g., “50 points credited”).

🔐 Authentication
Firebase-based email/password login and signup system.

🧾 Admin Panel
Moderators can approve/reject clothing listings.

🔧 Future Add-ons (Planned):

AI-based match suggestions

In-app messaging

Referral rewards

🚀 Tech Stack
Technology	Purpose
React.js	Frontend Framework
Tailwind CSS	Styling & Responsive Design
Framer Motion	Animations
Firebase Auth	Authentication
React Toastify	Notifications
Swiper.js	Carousel/Slider
React Router DOM	Routing
Vercel	Deployment

📂 Project Structure
less
Copy
Edit
src/
├── assets/              // Images & Icons
├── components/          // Reusable UI Components (e.g., Navbar, Carousel)
├── context/             // AuthContext using Firebase
├── pages/               // Main Pages (Home, Login, Signup, Swap, Dashboard, etc.)
├── App.jsx              // Main App File
├── main.jsx             // ReactDOM Renderer
└── firebase.js          // Firebase Config
🔧 Setup Instructions
Clone the Repository

bash
Copy
Edit
git clone https://github.com/YashBachwani/ReWear.git
cd ReWear
Install Dependencies

bash
Copy
Edit
npm install
Setup Firebase

Create a project at Firebase Console

Enable Email/Password Authentication

Add Firebase config to firebase.js

Start Development Server

bash
Copy
Edit
npm run dev
Login / Signup

Use Login.jsx or Signup.jsx to access the dashboard.

On submitting clothing via Swap, a toast notification will credit points.

📸 UI Screens
Landing Page with Carousel

Add Item Form

Browse Items Page

User Dashboard

Login/Signup Screens

🤝 Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

📄 License
This project is open-source and available under the MIT License.
