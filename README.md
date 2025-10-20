# 💼🌳🚀 My Career NJ

> *Empowering New Jersey residents with data-driven career insights and training opportunities*

[![CI Pipeline](https://github.com/njdol-ori/mcnj-main/actions/workflows/ci.yml/badge.svg)](https://github.com/njdol-ori/mcnj-main/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [💻 Development](#-development)
- [🚢 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🛠️ Tools and Libraries](#️-tools-and-libraries)
- [❓ Troubleshooting](#-troubleshooting)
- [📚 Additional Resources](#-additional-resources)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [🙏 Acknowledgments](#-acknowledgments)

## 🌟 Overview

My Career NJ is an official career development platform of the New Jersey Department of Labor & Workforce Development. This open-source web application ([mycareer.nj.gov](https://mycareer.nj.gov/)) serves as a comprehensive one-stop shop for New Jersey residents to explore training programs, discover in-demand career opportunities, and receive data-driven career advice tailored to their unique experiences and goals.

### 🎯 Mission

To provide accessible, user-friendly, and data-driven career development tools that help New Jersey residents advance their careers and contribute to the state's economic growth.

### 📍 Context

This platform is developed and maintained by the New Jersey Department of Labor & Workforce Development as part of the state's commitment to supporting workforce development and economic advancement. It serves as a bridge between job seekers, training providers, and employers across New Jersey.

> **Note**: This repository does not currently include the Career Navigator component, which is maintained separately.

## ✨ Key Features

- 🎓 **Training Program Explorer** - Search and compare educational and training programs across New Jersey
- 📊 **In-Demand Career Insights** - Access real-time labor market data and career trends
- 🗺️ **Career Pathways** - Interactive career exploration with step-by-step guidance
- 🌐 **Multilingual Support** - Available in English and Spanish for broader accessibility
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ♿ **Accessibility First** - Built with WCAG compliance and comprehensive a11y testing
- 🔍 **Advanced Search** - Filter training programs by location, cost, duration, and outcomes
- 💼 **Occupation Details** - Comprehensive information including salary estimates and education requirements
- 📈 **Data Integration** - Real-time data from O*NET and CareerOneStop APIs

## 🏗️ Architecture

### Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with [React 19](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [TypeScript](https://www.typescriptlang.org/) with [Express](https://expressjs.com/)-based server API
- **Database**: Multiple [PostgreSQL](https://www.postgresql.org/) tables (imported from CSV files in `backend/data` directory)
- **Deployment**: [Amazon Web Services (AWS)](https://aws.amazon.com/) instances running [Node.js](https://nodejs.org/en/) 20
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) for continuous integration and deployment

### System Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend    │    │  Database   │
│   (React)   │◄──►│  (Express)   │◄──►│ (PostgreSQL)│
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │ External APIs│
                   │ (O*NET, COS) │
                   └──────────────┘
```

### Data Sources

For detailed information about data tables and schema, see the [data model documentation](data_model.md).

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (comes with Node.js)
- **PostgreSQL** >= 12.0 ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

For Apple Silicon Mac users:
```bash
brew install jq
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/newjersey/dol-mcnj-main.git
   cd dol-mcnj-main
   ```

2. **Install dependencies**
   ```bash
   ./scripts/install-all.sh
   ```

3. **Set up PostgreSQL database**

   Create the local database:
   ```bash
   psql -c 'create database d4adlocal;' -U postgres
   ```

   Run database migrations:
   ```bash
   ./scripts/db-migrate.sh
   ```

   > ⚠️ **Troubleshooting**: If you encounter a password error, update the postgres password in:
   > - [`backend/database.json`](backend/database.json) (line 6)
   > - [`backend/src/app.ts`](backend/src/app.ts) (fallback value)

4. **Start the development servers**

   In one terminal, start the backend:
   ```bash
   ./scripts/backend-start.sh
   ```

   In another terminal, start the frontend:
   ```bash
   ./scripts/frontend-start.sh
   ```

   The application will automatically open at `http://localhost:3000`

### Verification

To verify your setup is working correctly:

1. ✅ Frontend loads at `http://localhost:3000`
2. ✅ Backend API responds at `http://localhost:8080`
3. ✅ Database connection is successful (check backend console logs)
4. ✅ No error messages in browser console

## 📁 Project Structure

```
dol-mcnj-main/
├── 📁 src/                      # Next.js application source
│   ├── 📁 app/                 # Next.js App Router pages
│   ├── 📁 components/          # React components
│   │   ├── 📁 utility/         # Generic UI components
│   │   ├── 📁 modules/         # Reusable features
│   │   ├── 📁 blocks/          # Complex composites
│   │   └── 📁 global/          # Site-wide components
│   ├── 📁 data/                # Static data files
│   └── � utils/               # Utility functions
├── 📁 backend/                  # Express TypeScript API
│   ├── 📁 src/                 # Source code
│   │   ├── 📁 routes/          # API route handlers
│   │   ├── 📁 domain/          # Business logic
│   │   └── 📁 database/        # Database utilities
│   ├── 📁 data/                # CSV data files
│   ├── 📁 migrations/          # Database migrations
│   └── 📄 package.json         # Backend dependencies
├── 📁 cypress/                  # End-to-end tests
├── 📁 scripts/                  # Build and deployment scripts
├── 📁 .github/                 # GitHub Actions workflows
├── � docs/                    # Documentation
└── 📄 README.md                # This file
```

### Key Configuration Files

- **Frontend Configuration**
    - `package.json` - Root dependencies and scripts
    - `next.config.ts` - Next.js configuration
    - `tsconfig.json` - TypeScript configuration
    - `eslint.config.mjs` - ESLint rules

- **Backend Configuration**
    - `backend/package.json` - Dependencies and scripts
    - `backend/database.json` - Database connection settings
    - `backend/tsconfig.json` - TypeScript configuration

- **CI/CD Configuration**
    - `.github/workflows/` - GitHub Actions workflows

## 💻 Development

### Development Workflow

Always use the ship-it script for pushing changes ([why?](https://medium.com/@AnneLoVerso/ship-it-a-humble-script-for-low-risk-deployment-1b8ba99994f7)):

```bash
./scripts/ship-it.sh
```

### Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `install-all.sh` | Install all dependencies | `./scripts/install-all.sh` |
| `backend-start.sh` | Start backend dev server | `./scripts/backend-start.sh` |
| `frontend-start.sh` | Start frontend dev server | `./scripts/frontend-start.sh` |
| `build.sh` | Build for production | `./scripts/build.sh` |
| `test-all.sh` | Run all tests and linting | `./scripts/test-all.sh` |
| `feature-tests.sh` | Run Cypress e2e tests | `./scripts/feature-tests.sh` |
| `ship-it.sh` | Deploy changes | `./scripts/ship-it.sh` |

### Code Style Guidelines

- **TypeScript**: Strict type checking enabled
- **Linting**: ESLint with custom rules
- **Formatting**: Prettier for consistent code style
- **Testing**: Jest + React Testing Library for unit tests
- **E2E Testing**: Cypress with accessibility testing

### Module Dependencies

This project uses [good-fences](https://github.com/smikula/good-fences) to enforce module boundaries:

- `frontend` and `backend` cannot import from each other
- Backend follows dependency inversion with `domain` → `routes`/`database`

Check dependency compliance:
```bash
npm --prefix=backend run fences
npm --prefix=frontend run fences
```

## 🚢 Deployment

### CI/CD Pipeline

We use [GitHub Actions](https://github.com/njdol-ori/mcnj-main/actions) for automated deployments:

**Phase 1: Parallel Checks**
1. 📝 **Lint & Format** - Code quality checks
2. 🔐 **Security Audit** - Vulnerability scanning
3. � **JSDoc Coverage** - Documentation coverage
4. 🧪 **Frontend Tests** - Next.js unit tests
5. 🧪 **Backend Tests** - API unit tests with PostgreSQL

**Phase 2: Build**
6. �️ **Build** - Next.js production build

**Phase 3: E2E**
7. 🎭 **E2E Tests** - Cypress feature tests

See [`.github/workflows/README.md`](.github/workflows/README.md) for detailed workflow documentation.

### Environment Variables

#### 🏗️ Build & Deployment
- `NODE_ENV` - Environment (dev, test, awsdev, awstest, awsprod)
- `IS_CI` - Boolean flag for CI environment

#### 🗄️ Database Configuration
- `DB_HOST_WRITER_AWSPROD` - Production database host
- `DB_PASS_AWSPROD` - Production database password
- `DB_HOST_WRITER_AWSDEV` - Development database host
- `DB_PASS_AWSDEV` - Development database password

#### 🚩 Feature Flags
- `REACT_APP_FEATURE_MULTILANG` - Enable/disable multi-language support
- `REACT_APP_FEATURE_CAREER_PATHWAYS` - Toggle career pathways feature
- `REACT_APP_FEATURE_CAREER_NAVIGATOR` - Toggle Career Navigator landing page
- `REACT_APP_SIGNUP_FOR_UPDATES` - Toggle user signup modal

#### 🔌 External APIs
- `ONET_BASEURL` - O*NET API base URL
- `ONET_USERNAME` - O*NET API username
- `ONET_PASSWORD` - O*NET API password
- `CAREER_ONESTOP_USERID` - CareerOneStop API user ID
- `CAREER_ONESTOP_AUTH_TOKEN` - CareerOneStop API auth token

#### 📊 Content & Analytics
- `BASE_URL` - Contentful GraphQL API base URL
- `ENVIRONMENT` - Contentful environment (usually 'master')
- `SPACE_ID` - Contentful space ID
- `SENTRY_DSN` - Sentry error tracking DSN

#### 🌐 Additional Services
- `ZIPCODE_BASEURL` - Zipcode lookup service URL
- `ZIPCODE_API_KEY` - Zipcode service API key

### Manual Deployment

For manual deployments (not recommended for production):

```bash
# Build everything
./scripts/build.sh

# Start production server
./scripts/prod-start.sh
```

## 🧪 Testing

### Testing Stack

- **Unit Tests**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **E2E Tests**: [Cypress](https://www.cypress.io/)
- **Accessibility**: [cypress-axe](https://www.npmjs.com/package/cypress-axe)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)

### Running Tests

```bash
# Run all tests and linting
./scripts/test-all.sh

# Run only e2e tests
./scripts/feature-tests.sh

# Run frontend tests only
npm --prefix=frontend test

# Run backend tests only
npm --prefix=backend test
```

### Test Coverage

Tests cover:
- ✅ Component rendering and interactions
- ✅ API endpoint functionality
- ✅ Database operations
- ✅ User workflows (e2e)
- ✅ Accessibility compliance
- ✅ Responsive design

## 🛠️ Tools and Libraries

### Frontend Libraries

- **UI Framework**: [Material UI](https://mui.com/) + [NJ Web Design System](https://github.com/newjersey/njwds)
- **Routing**: [Reach Router](https://reach.tech/router/)
- **Internationalization**: [i18next](https://react.i18next.com/)
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Form Handling**:Yup

### Backend Libraries

- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with custom query builders
- **Authentication**: Custom middleware
- **Error Tracking**: [Sentry](https://sentry.io/)
- **AWS SDK**: [AWS SDK for Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html)

### Development Tools

- **Analytics**: [Google Analytics](https://analytics.google.com/)
- **Accessibility**: [axe DevTools](https://www.deque.com/axe/devtools/), [WAVE](https://wave.webaim.org/)
- **API Testing**: [WireMock](http://wiremock.org/) for mocking external APIs

### External Data Sources

- **[O*NET Web API](https://services.onetcenter.org/)** - Occupation data and career information
- **[CareerOneStop](https://www.careeronestop.org/Developers/WebAPI/web-api.aspx)** - Labor market and training data

> 🔑 **API Access**: Request access to the NJInnovation Bitwarden account for API keys

## ❓ Troubleshooting

### Common Issues

#### 🔧 Installation Problems

**Node version issues**
```bash
# Check Node version
node --version  # Should be >= 18.0.0

# Use nvm to manage Node versions
nvm install 18
nvm use 18
```

**PostgreSQL connection errors**
```bash
# Check if PostgreSQL is running
brew services list | grep postgres  # macOS
sudo systemctl status postgresql   # Linux

# Reset postgres password
psql -U postgres -c "ALTER USER postgres PASSWORD 'your_password';"
```

**Dependency installation failures**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules backend/node_modules
./scripts/install-all.sh
```

#### 🚀 Runtime Issues

**Frontend won't start**
- Check if port 3000 is available
- Ensure backend is running on port 8080
- Check browser console for errors

**Backend API errors**
- Verify database connection
- Check environment variables
- Review backend console logs

**Database migration failures**
```bash
# Check database exists
psql -U postgres -l | grep d4adlocal

# Run migrations manually
cd backend
npm run db:migrate
```

#### 🧪 Testing Issues

**Cypress installation fails**
```bash
# Install Cypress manually
cd frontend
npm install cypress --save-dev
npx cypress install
```

**Tests fail in CI**
- Check GitHub Actions secrets configuration
- Verify test database configuration
- Review workflow logs for specific failures

### Getting Help

1. **Check Logs**: Always check console output first
2. **Search Issues**: Look through existing GitHub issues
3. **Documentation**: Review additional documentation files
4. **Contact Team**: Reach out via official support channels

## 📚 Additional Resources

### 📖 Documentation Hub

**📂 [Complete Documentation Index](docs/README.md)** - Centralized documentation portal

#### Quick Access by Category:
- **🔐 Security & Encryption**: [`docs/security/`](docs/security/) - PII encryption, KMS, security guides
- **🚀 Deployment**: [`docs/deployment/`](docs/deployment/) - Production deployment procedures  
- **🗄️ Database**: [`docs/database/`](docs/database/) - Data models, migrations, seeding
- **📋 Project**: [`docs/project/`](docs/project/) - Governance, decisions, contributors

### External Links

- **Live Application**: [mycareer.nj.gov](https://mycareer.nj.gov/)
- **NJ Department of Labor**: [nj.gov/labor](https://www.nj.gov/labor/)
- **New Jersey Web Design System**: [github.com/newjersey/njwds](https://github.com/newjersey/njwds)
- **U.S. Web Design System**: [designsystem.digital.gov](https://designsystem.digital.gov/)

### API Documentation

- **O*NET Web Services**: [services.onetcenter.org](https://services.onetcenter.org/)
- **CareerOneStop API**: [careeronestop.org/Developers](https://www.careeronestop.org/Developers/WebAPI/web-api.aspx)

## 🤝 Contributing

We welcome contributions from developers, designers, content creators, and anyone passionate about improving career development tools!

### How to Contribute

1. **📖 Familiarize Yourself** - Review project goals and technologies
2. **🔍 Find Issues** - Check our issue tracker for "good first issue" labels
3. **🍴 Fork & Clone** - Fork the repository and clone to your machine
4. **🔧 Make Changes** - Follow our coding standards and include tests
5. **📝 Submit PR** - Submit a pull request with clear description

### Contribution Guidelines

- Follow the existing code style and conventions
- Include tests for new features
- Update documentation when necessary
- Ensure accessibility compliance
- Test across different browsers and devices

For detailed contribution guidelines, see [CONTRIBUTORS.md](CONTRIBUTORS.md).

### Code of Conduct

We are committed to providing a welcoming and supportive environment. Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 📞 Support

### Getting Help

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/newjersey/dol-mcnj-main/issues)
- **💡 Feature Requests**: [GitHub Issues](https://github.com/newjersey/dol-mcnj-main/issues)
- **📧 General Questions**: Contact us via [My Career NJ](https://mycareer.nj.gov/) contact form
- **📚 Documentation**: Check our [additional resources](#-additional-resources)

## 🙏 Acknowledgments

### Contributors

We extend our heartfelt gratitude to all contributors who have dedicated their time and expertise to improve My Career NJ. Your efforts make a meaningful difference in the lives of New Jersey residents.

### Special Thanks

- **New Jersey Department of Labor & Workforce Development** - Project sponsorship and guidance
- **New Jersey Office of Innovation** - Technical infrastructure and support
- **Open Source Community** - Libraries and tools that make this project possible
- **New Jersey Residents** - Feedback and insights that drive continuous improvement

### Technology Partners

- **O*NET Program** - Occupational data and career information
- **CareerOneStop** - Labor market and training program data
- **Amazon Web Services** - Cloud infrastructure
- **GitHub Actions** - Continuous integration and deployment

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for New Jersey by the Department of Labor & Workforce Development**

*Empowering careers, strengthening communities, building New Jersey's future.*
