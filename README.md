# ProfileIQ

A MERN stack SaaS platform that provides standardized, AI-powered evaluation of non-academic student profiles for college admissions.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Recharts
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **AI**: Claude API (Anthropic)

## Project Structure

```
profileIQ/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── package.json
│
└── server/                 # Express backend
    ├── src/
    │   ├── models/         # MongoDB schemas
    │   ├── routes/         # API routes
    │   ├── middleware/     # Auth, error handling
    │   ├── services/       # Business logic, AI integration
    │   └── index.ts        # Entry point
    └── package.json
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API key

### Environment Variables

Create `.env` in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/profileiq
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=your-anthropic-api-key
NODE_ENV=development
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Development

```bash
# Start MongoDB (if local)
mongod

# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## Features

### For Students
- Add and manage extracurricular activities
- Trigger AI-powered profile evaluation
- View scores with detailed explanations
- Track growth over time with charts
- Export Common App-ready summaries

### For Counselors
- View assigned students
- Review student activities and evaluations
- Add contextual notes
- Export student summaries

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Activities
- `GET /api/activities` - List activities
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Evaluations
- `POST /api/evaluations` - Trigger AI evaluation
- `GET /api/evaluations` - List all evaluations
- `GET /api/evaluations/latest` - Get latest evaluation
- `GET /api/evaluations/:id/export` - Export for Common App

### Students
- `GET /api/students/me` - Get profile
- `PUT /api/students/me` - Update profile
- `GET /api/students/me/summary` - Dashboard data

### Counselors
- `GET /api/counselors/students` - List assigned students
- `GET /api/counselors/students/:id` - Student detail
- `POST /api/counselors/students/:id/notes` - Add note

## Evaluation Dimensions

ProfileIQ evaluates students across four dimensions:

1. **Leadership Impact** - Genuine leadership responsibility and influence
2. **Execution Depth** - Sustained effort and tangible outcomes
3. **Growth Trajectory** - Progression and development over time
4. **Context-Adjusted Impact** - Achievements relative to available resources

## Scoring

- 85-100: Exceptional
- 70-84: Strong
- 50-69: Average
- 30-49: Developing
- 0-29: Limited

## License

MIT
