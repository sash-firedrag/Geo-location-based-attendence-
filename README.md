**Geolocation-Based Attendance System**
A Node.js + MongoDB-based attendance tracking system with:
         Punch In / Punch Out
         Geofencing (within 100 meters of office)

**Features**
         User Authentication – Secure login & registration with hashed passwords.
         Punch In/Out – Records location and timestamp.
         Geofencing – Ensures attendance is marked only within the office premises.

**Tech Stack**
         Frontend: HTML, CSS, JavaScript
         Backend: Node.js, Express.js
         Database: MongoDB
         Authentication: JWT & bcrypt.js

**Installation & Setup**         
 1.**Clone the repo**
         git clone https://github.com/your-username/location-attendance.git
         cd location-attendance
 2.**Install dependencies**
         npm install
 3.**Setup MongoDB**
                Make sure MongoDB is installed and running.
                Default DB URL: mongodb://127.0.0.1:27017/location-attendance
                You can use MongoDB Compass to view data.
 4.**Run the server**
        node server.js
        server runs on the local host or you can use go live libraries to run the code

