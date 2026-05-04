# Facebook Automation Simulator

This application simulates a Facebook automation tool (like Instaxbot) using dummy data. It features a modern, premium dark-mode dashboard built with React and a Node.js/Express backend.

## 🚀 How to Run the Application

### 1. Install Dependencies
Open your terminal and navigate to the project directory, then install dependencies for both the server and the client.

**Backend Setup:**
```bash
cd facebook-automation-sim/server
npm install
```

**Frontend Setup:**
```bash
cd ../client
npm install
```

### 2. Start the Backend Server
In the `server` directory, run:
```bash
npm start
```
The server will start at `http://localhost:5000`. It will automatically create a `data` folder with dummy users and message logs.

### 3. Start the Frontend Development Server
In a new terminal window, navigate to the `client` directory and run:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 🛠️ Features Included

- **Mock Login**: A sleek login page (pre-filled with `admin@example.com`).
- **Dashboard**: High-level overview of automation stats.
- **Users List**: A grid of dummy profiles with profile images.
- **Simulated Messaging**: Click "Send Message" on any user to trigger a mock API call that logs a message to a local JSON file.
- **Premium Design**: Dark mode UI, glassmorphism, and smooth transitions using Inter and Outfit fonts.
