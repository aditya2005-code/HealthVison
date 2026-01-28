# 🏥 HealthVision

A comprehensive MedTech web application built with the MERN stack and integrated AI/ML capabilities for medical report analysis, appointment booking, and telemedicine consultations.

## 📋 Project Overview

HealthVision provides users with a simple, accessible digital health platform where they can:
- Analyze medical reports using AI/ML
- Interact with a symptom chatbot for urgency assessment
- Book appointments with doctors
- Conduct video consultations via WebRTC
- Make secure payments for consultations

## 🏗️ Project Structure

```
HealthVision/
├── frontend/              # React.js frontend application
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       ├── services/     # API service layer
│       ├── context/      # React context providers
│       ├── utils/        # Utility functions
│       └── assets/       # Images, fonts, etc.
│
├── backend/              # Node.js/Express backend API
│   └── src/
│       ├── controllers/  # Request handlers
│       ├── models/       # MongoDB schemas
│       ├── routes/       # API routes
│       ├── middleware/   # Custom middleware
│       ├── services/     # Business logic
│       ├── utils/        # Helper functions
│       └── config/       # Configuration files
│
├── ml-service/           # Python AI/ML service
│   ├── models/          # Trained ML models
│   ├── api/             # FastAPI/Flask endpoints
│   ├── utils/           # ML utilities
│   ├── data/            # Training/test data
│   └── notebooks/       # Jupyter notebooks for experimentation
│
└── team-docs/           # Project documentation
    ├── PROJECT_OVERVIEW.md
    ├── TEAM_ROLES.md
    ├── DEVELOPMENT_TIMELINE.md
    ├── HealthVision-HLD.svg
    └── HealthVision-LLD.svg
```

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **WebRTC**: Socket.io-client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io (for WebRTC signaling)
- **Payment**: Stripe

### AI/ML Service
- **Framework**: FastAPI/Flask
- **OCR**: Tesseract/PyMuPDF
- **ML Libraries**: scikit-learn, pandas, numpy
- **NLP**: For symptom analysis

## 👥 Team

| Name | Role | GitHub |
|------|------|--------|
| **Akhil Pandey** | Backend + DB, AI/ML | [@Akhil9648](https://github.com/Akhil9648) |
| **Aditya Pratap Singh** | AI/ML | [@aditya2005-code](https://github.com/aditya2005-code) |
| **Rishi Tiwari** | Frontend, Backend + DB | [@rishi-tiwari023](https://github.com/rishi-tiwari023) |

## 📚 Documentation

For detailed information about the project, please refer to:
- [Project Overview](./team-docs/PROJECT_OVERVIEW.md) - MVP features, tech stack, and system design
- [Team Roles](./team-docs/TEAM_ROLES.md) - Responsibilities and task distribution
- [Development Timeline](./team-docs/DEVELOPMENT_TIMELINE.md) - 1-month development schedule

## 🔧 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Python (v3.8+)
- Git

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## 🌟 Key Features

### 1. User Authentication
- Secure JWT-based authentication
- Protected routes and role-based access

### 2. Report Analysis (AI/ML)
- Upload medical reports (PDF/Image)
- OCR text extraction
- Disease pattern detection (Dengue, Typhoid, Viral Fever)

### 3. Symptom Chatbot
- Interactive symptom description
- Urgency level classification
- Consultation recommendations

### 4. Appointment Booking
- Doctor selection and availability
- Timeslot management
- Appointment confirmation

### 5. Payment Integration
- Secure payment gateway (Razorpay/Stripe)
- 20% advance payment for consultations
- Payment history tracking

### 6. Video Consultation
- WebRTC-based real-time communication
- Voice and video calls
- Basic call controls

## 🔄 Development Workflow

- **Branching Strategy**: Feature-based branching
- **Code Review**: Pull requests required for merging
- **Testing**: Continuous testing throughout development
- **Communication**: Daily standups and async updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please refer to the [Development Timeline](./team-docs/DEVELOPMENT_TIMELINE.md) for task assignments and contribution guidelines.

---

**Built with ❤️ by Team HealthVision**
