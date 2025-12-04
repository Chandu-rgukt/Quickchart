# 🏴‍☠️ Straw Hat Chat

Ahoy! Welcome to **Straw Hat Chat** — a pirate-themed real-time chat application inspired by **One Piece**. Set sail on the Grand Line with your crew and share treasure maps, messages, and adventures in real time.

---

## 🌟 Any assumptions or limitations
 - Only the channel creator can remove members or delete a channel.
 - Images are stored as Base64, not cloud storage (not optimized for large images).
 - No read receipts for channel messages. - No typing indicators.
 - Online status is based on active socket connections.
 - Application is intended for local/demo use, not production-load traffic.
 - 
# # Optional features implemented (if any)
- Image messaging (DM + channels)
- Infinite scroll for older messages
 - Add members to channel
- Remove/Kick members (creator only)
- Leave channel - Delete channel (creator only)
- Online/offline presence indicator
- Mobile-responsive UI

---

## 🛠 Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, React Hot Toast
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Real-time: Socket.IO
- Image hosting: Cloudinary
- Auth: JWT (JSON Web Tokens)
- HTTP: Axios

---

## 🚀 Quick Start

Prerequisites:
- Node.js v16+ and npm/yarn
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

1. Clone the repository

```bash
git clone https://github.com/Chandu-rgukt/Quickchart.git
cd Quickchart
```

2. Create environment files

- At the project root (server), create a `.env` file with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- In the client folder (`client/.env` or as required by the client), set any required variables (e.g., REACT_APP_API_URL).

3. Install dependencies and run locally

Server:
```bash
cd server || .
npm install
npm run dev
```

Client:
```bash
cd client
npm install
npm run dev
```

Open the client in your browser (usually http://localhost:5173 or the port shown by Vite) and the server at http://localhost:5000.

---

## 🧭 Project Structure (high level)

- /client — React app (UI, chat interface)
- /server — Express API, Socket.IO handlers
- /models — Mongoose models
- /routes — API routes for auth, users, messages
- /controllers — Business logic

---

## 🔐 Authentication & Security

- JWT tokens for stateless authentication
- Store tokens securely (HttpOnly cookie recommended in production)
- Validate and sanitize user input on server
- Configure CORS and rate limiting for production deployments

---

## 🧪 Testing

- Manual testing instructions: create multiple users in different browser windows/incognito to verify real-time behavior.
- Unit and integration tests can be added using Jest and Supertest for the server and React Testing Library for the client.

---

## 📦 Deployment Tips

- Use MongoDB Atlas for production database
- Host server on Heroku, Render, or Railway
- Build client and serve via CDN or a static host (Netlify, Vercel) or behind the same server
- Set secure environment variables on your hosting provider for DB and Cloudinary credentials

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create a topic branch (feature/bugfix)
3. Open a PR with a clear description and tests if applicable

Please follow code style and add meaningful commit messages.

---

## 📜 License & Credits

This project is open-source. Add your preferred license file (e.g., MIT) to the repo.

Thanks to the One Piece fandom for inspiration — this project is fan-made and not affiliated with Eiichiro Oda or Shonen Jump.

---

## 📬 Contact

Created by Chandu-rgukt. Questions or suggestions? Open an issue or reach out via GitHub.
