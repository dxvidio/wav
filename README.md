# wav: audio visualizer web app

A solo project by **David Lee** that allows users to upload audio files and see a **real-time waveform visualization** of their audio. The app emphasizes aesthetic visuals, accessibility, and a smooth SPA experience.

## Features
- Real-time audio waveform visualization using the **Canvas API** and **Web Audio API**  
- Responsive design optimized for **laptop, tablet, and mobile**  
- User authentication and secure storage of uploaded track metadata  
- Progressive Web App (PWA) with HTTPS support  
- API providing user track history, including metadata such as artist name and song duration  
- Accessibility: semantic HTML, ARIA attributes, focus outline for tab navigation, and high color contrast  
- Aesthetic styling with blur and contrast effects for an appealing visualizer  

## Tech Stack
- **Frontend:** Vue.js (SPA) with Vite  
- **Visualization:** HTML5 Canvas API + Web Audio API  
- **Backend:** Node.js, Express, Prisma ORM, SQLite  
- **Security:** Prisma ORM to protect against SQL injection  
- **PWA:** Service worker caching with offline support  
- **Deployment:** HTTPS-enabled web app  
