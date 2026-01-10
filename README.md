# AbrO HR - Employee Attendance Tracking System (Frontend)

A modern, responsive React-based web application for employee attendance tracking with Tailwind CSS styling.

## Features

- **Dashboard**: Real-time attendance overview and statistics
- **Attendance Management**: Clock in/out functionality with multiple modes
- **Shift Management**: View and manage shift schedules
- **Reports**: Generate attendance reports and analytics
- **User Profiles**: Manage employee profiles and permissions
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live status updates

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Date Handling**: date-fns

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abr0HR/abrohr-frontend.git
   cd abrohr-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

4. **Build for production**
   ```bash
   npm run build
   ```

## Environment Configuration

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── services/       # API service layer
├── hooks/          # Custom React hooks
├── context/        # Context API for state
├── styles/         # Global styles
└── utils/          # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

### Code Formatting

Follow Airbnb ESLint standards.

## Deployment

### Deploy to Vercel

1. **Create Vercel account** at https://vercel.com

2. **Connect GitHub repository**
   - Import Project
   - Select `abrohr-frontend`

3. **Configure environment**
   - Set `VITE_API_URL` to your backend URL

4. **Deploy**
   - Vercel auto-deploys on git push

### Deploy to Netlify

1. Build: `npm run build`
2. Deploy `dist` folder

## API Integration

The frontend communicates with the backend API:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with Vite
- Image optimization
- CSS minification
- Lazy loading for routes

## Security

- HTTPS enforcement in production
- JWT token management
- CORS handling
- Input validation
- XSS prevention with React

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For issues and questions, please create a GitHub issue.
