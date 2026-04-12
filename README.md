<img width="1917" height="1023" alt="Screenshot 2026-04-12 103809" src="https://github.com/user-attachments/assets/5538dc02-b8ca-4c9c-8a5a-d42bbea140b6" />================================================================================
URBANWALKING BACKEND (WALK N EARN)
================================================================================

UrbanWalking Backend is a Node.js/Express + MongoDB API for tracking walking
trips, calculating CO2 savings and reward points, managing weekly leaderboards,
offering weather-based health advice, and handling a reward redemption system
with email vouchers.

---

1. FEATURES

---

- User accounts with secure password hashing and role-based access (user, admin).
- JWT authentication and protected routes via middleware.
- Walking trips with realistic distances using OSRM (with Haversine fallback).
- Points & CO2 savings per trip, stored as point transactions.
- Weekly leaderboard aggregation and ranking.
- Weather integration using OpenWeather.
- Dynamic health advice rules driven by current weather conditions.
- Rewards store where users can redeem points for rewards.
- Email vouchers sent via Brevo (Sendinblue) transactional emails.
- Seed scripts for demo users, point transactions, and leaderboard data.

---

2. TECH STACK

---

- Runtime: Node.js (CommonJS)
- Framework: Express
- Database: MongoDB + Mongoose
- HTTP Client: Axios
- Auth: JSON Web Tokens (jsonwebtoken) + bcrypt
- Email: Brevo (sib-api-v3-sdk)
- Validation: express-validator + custom validators
- Docs: swagger-jsdoc, swagger-ui-express
- Dev: nodemon, dotenv

---

3. PROJECT STRUCTURE

---

Backend/
+- server.js
+- package.json
+- config/
| +- swagger.js
+- Components/
| +- Login/
| | +- loginController.js, loginMiddleware.js
| +- User/
| | +- controllers/userController.js
| | +- models/User.js
| | +- routes/userRoutes.js
| +- WalkingManagement/
| | +- controllers/pointsController.js, tripController.js
| | +- models/PointTransaction.js, Trip.js
| | +- routes/pointsRoutes.js, tripRoutes.js
| | +- services/osrmService.js, utils/distanceUtils.js
| +- Leaderboard/
| | +- controllers/leaderboardController.js
| | +- models/weeklyLeaderboard.js
| | +- routes/leaderboardRoutes.js
| +- Weather/
| | +- admin/ (controllers, models, routes, validators)
| | +- user/ (controllers, routes, services)
| +- RewardAndPoints/
| +- controllers/rewardController.js
| +- models/Reward.js, Redemption.js
| +- routes/rewardRoutes.js
+- middleware/ (authMiddleware.js, adminMiddleware.js)
+- utils/ (emailService.js)
+- seedUsers.js, seedPoints.js, hashPassword.js

---

4. GETTING STARTED

---

PREREQUISITES:

- Node.js 18+, npm, MongoDB, OpenWeather API key, Brevo API key, JWT secret.

INSTALLATION:

1. git clone <https://github.com/thumashi2001/walk_n_earn.git>
2. cd UrbanWalking/Backend
3. npm install

ENVIRONMENT VARIABLES (.env):
PORT=5000
MONGO_URI=mongodb://localhost:27017/urbanwalking
JWT_SECRET=your_jwt_secret_here
OPENWEATHER_API_KEY=your_key
BREVO_API_KEY=your_key
NODE_ENV=development

RUNNING:

- Development: npm run dev
- Production: npm start

URLS:

- Status: GET /
- Health: GET /api/health
- Docs: GET /api-docs

---

5. COMPONENTS & ENDPOINTS

---

[ CORE SERVER ]
Mounts routers for Login, Walking, Users, Rewards, Weather, and Health Advice.

[ AUTH & USERS ]

- User Model: fullName, email, passwordHash, role, totalPoints, totalCo2, dist.
- Register: Validates, hashes password, creates user.
- Login: Verifies bcrypt hash, signs JWT (1d expiry).
- Middleware: authMiddleware (JWT verify), adminMiddleware (Role check).

[ WALKING MANAGEMENT ]

- Trips: Status (active/completed/cancelled), Locations (lat/lng), Distance.
- Points: calcCO2SavedKg (dist _ 0.2), calcPoints (CO2 _ 10).
- Distance: OSRM service (/route/v1/foot) with Haversine fallback.

[ LEADERBOARD ]

- Model: user_id, week_start/end, weekly_points/distance/emission.
- Logic: Upserts and increments weekly totals; aggregates Top 10.

[ WEATHER & HEALTH ADVICE ]

- Weather: OpenWeather API (temp, feels_like, humidity, wind, conditions).
- Admin: Create rules based on EXACT values or numeric RANGES.
- User: Filters active advice based on current weather triggers.

[ REWARDS & REDEMPTIONS ]

- Reward: title, description, pointsRequired, quantity, isActive.
- Redemption: userId, rewardId, voucherCode (VOUCHER-XXXXXXXX).
- Email: Uses sib-api-v3-sdk to send transactional reward emails.

---

6. QUICK REFERENCE API LIST

---

- POST /api/login : JWT Login
- POST /api/users/register : Create account
- GET /api/users/:id : User stats
- POST /api/walking/trips : Start trip
- PUT /api/walking/trips/:id/end : End trip & get points
- GET /api/walking/points : History
- GET /api/leaderboard/top : Weekly Top 10
- GET /api/weather/current : Real-time weather
- GET /api/user/health-advice : Safety tips
- POST /api/rewards/redeem : Claim reward

---
Deployment

Backend Deployment

The backend of this application is built with Express.js and deployed on Render.

Deployment Steps
	1.	The backend repository was connected to Render using GitHub.
	2.	A new Web Service was created on Render.
	3.	The following build settings were configured:
	•	Build Command: npm install
	•	Start Command: npm start
	4.	Required environment variables were added through the Render dashboard.
	5.	The backend is automatically redeployed whenever changes are pushed to the main branch.

The backend connects to a MongoDB database using a connection string stored securely in environment variables.

⸻

Frontend Deployment

The frontend of this application is built with React and deployed on Netlify.

Deployment Steps
	1.	The frontend repository was connected to Netlify using GitHub.
	2.	The following build settings were configured:
	•	Build Command: npm run build
	•	Publish Directory: build/
	3.	The frontend was deployed as a static site.
	4.	Netlify automatically redeploys the application whenever changes are pushed to the connected branch.

The frontend communicates with the backend API hosted on Render.

⸻

Environment Variables

Backend
	•	MONGO_URI : MongoDB connection string
	•	JWT_SECRET : Secret key used for authentication
	•	PORT : Server port provided by Render

Frontend
	•	REACT_APP_API_URL : Base URL of the backend API

Sensitive values are not included here for security reasons.

⸻

Live URLs

Backend API
https://walk-n-earn-backend.onrender.com/

Frontend Application
https://walk-n-earn.netlify.app/


# LICENSE: MIT
