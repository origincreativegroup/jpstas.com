# JP Stas Portfolio - Full Tech Stack

A modern, scalable portfolio website built with a complete tech stack featuring React, Node.js, PostgreSQL, and automated deployments.

## 🚀 Live Demo

- **Frontend**: [https://jpstas-portfolio.pages.dev](https://jpstas-portfolio.pages.dev)
- **Backend API**: [https://jpstas-portfolio-api.fly.dev](https://jpstas-portfolio-api.fly.dev)
- **Admin Panel**: [https://jpstas-portfolio.pages.dev/admin](https://jpstas-portfolio.pages.dev/admin)

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **Sharp** for image processing

### Infrastructure
- **Cloudflare Pages** - Frontend hosting & CDN
- **Fly.io** - Backend hosting
- **Neon** - Serverless PostgreSQL database
- **GitHub Actions** - CI/CD pipeline

## ✨ Features

### Portfolio Management
- Dynamic project showcase
- Case study templates
- Media gallery with drag-and-drop
- SEO-optimized content

### Admin Dashboard
- Project management
- Media library
- Content editing
- Analytics dashboard
- User authentication

### Performance
- Edge CDN delivery
- Image optimization
- Code splitting
- Lazy loading

### Developer Experience
- TypeScript throughout
- Automated testing
- Hot reloading
- ESLint + Prettier

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Fly.io CLI
- Cloudflare CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jpstas/jpstas.com.git
   cd jpstas.com
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp env.example .env.local
   cp backend/env.example backend/.env
   
   # Edit with your values
   nano .env.local
   nano backend/.env
   ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run migrate:up
   ```

5. **Start development servers**
   ```bash
   # Backend (in one terminal)
   cd backend
   npm run dev
   
   # Frontend (in another terminal)
   npm run dev
   ```

## 📁 Project Structure

```
jpstas.com/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── backend/               # Backend API
│   ├── src/               # Server source code
│   ├── database/          # Database schema & migrations
│   └── Dockerfile         # Container configuration
├── .github/               # GitHub Actions workflows
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```env
VITE_API_URL=https://your-fly-app.fly.dev/api
VITE_GA_TRACKING_ID=your-google-analytics-id
```

**Backend (backend/.env)**
```env
DATABASE_URL=postgresql://username:password@hostname/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Database Schema

The database includes tables for:
- Users and authentication
- Projects and case studies
- Media files and uploads
- Content sections
- Skills and expertise
- Analytics events

## 🚀 Deployment

### Automatic Deployment
Push to the `main` branch to trigger automatic deployment:
- Frontend → Cloudflare Pages
- Backend → Fly.io
- Database migrations → Neon

### Manual Deployment

**Backend to Fly.io:**
```bash
cd backend
flyctl deploy
```

**Frontend to Cloudflare Pages:**
```bash
npm run build
npx wrangler pages deploy dist --project-name=jpstas-portfolio
```

## 📊 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/:slug` - Get single project
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project

### Media
- `GET /api/media` - List media files
- `POST /api/media/upload` - Upload file
- `DELETE /api/media/:id` - Delete media

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📈 Analytics

Built-in analytics tracking:
- Page views and user interactions
- Project engagement metrics
- Real-time dashboard
- Export capabilities

## 🛡️ Security

- JWT-based authentication
- Rate limiting
- Input validation
- CORS configuration
- Security headers
- SQL injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Fly.io](https://fly.io/) - Backend hosting
- [Cloudflare](https://cloudflare.com/) - Frontend hosting
- [Neon](https://neon.tech/) - Database hosting

## 📞 Contact

- **Website**: [jpstas.com](https://jpstas.com)
- **Email**: hello@jpstas.com
- **LinkedIn**: [linkedin.com/in/jpstas](https://linkedin.com/in/jpstas)
- **GitHub**: [github.com/jpstas](https://github.com/jpstas)

---

**Built with ❤️ by JP Stas**