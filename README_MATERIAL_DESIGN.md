# Sales Prediction Platform - Material Design Edition

A modern, production-grade Next.js application for retail sales forecasting with Google Material Design UI.

## Features

- **Single Product Prediction**: Get detailed sales forecasts for individual products with confidence intervals
- **Batch Prediction**: Process up to 100 products at once
- **Model Statistics**: View and switch between different ML models
- **About Section**: Learn about the platform capabilities and technology

## Design System

This application implements **Google Material Design** principles:

- **Color Palette**: Indigo primary (#5e35b1), Teal secondary (#00897b)
- **Typography**: Roboto font family with proper Material Design type scale
- **Elevation**: Material Design shadow system (1dp, 2dp, 4dp, 8dp, 16dp)
- **Components**: Material-styled cards, buttons, inputs, and form elements
- **Motion**: Smooth transitions using Material Design easing curves
- **Layout**: 8dp grid system for consistent spacing

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: Latest React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS with custom Material Design classes
- **Recharts**: Data visualization library
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Toast notifications
- **Lucide React**: Icon library

### Backend API (Not Included)
- Python FastAPI
- CatBoost ML models
- RESTful endpoints for predictions

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see API configuration below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prediction_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints Required

The frontend expects the following backend endpoints:

- `GET /`: Health check and model info
- `GET /categorical-options`: Get available options for dropdowns
- `POST /predict`: Single product prediction
- `POST /predict/batch`: Batch predictions
- `GET /models/stats`: Model performance statistics
- `GET /models/available`: List of available models
- `POST /models/select/{model_name}`: Switch active model

## Project Structure

```
prediction_frontend/
├── app/
│   ├── components/
│   │   ├── PredictionForm.tsx      # Single prediction form
│   │   ├── PredictionResult.tsx    # Display prediction results
│   │   ├── BatchPrediction.tsx     # Batch processing interface
│   │   ├── ModelStats.tsx          # Model statistics and selection
│   │   └── AboutSection.tsx        # Platform information
│   ├── page.tsx                    # Main application page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Material Design styles
├── public/                         # Static assets
├── .env.local.example             # Environment variables template
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind configuration
└── package.json                   # Dependencies
```

## Material Design Components

### Elevation Classes
- `.shadow-material-1`: 1dp elevation
- `.shadow-material-2`: 2dp elevation
- `.shadow-material-4`: 4dp elevation
- `.shadow-material-8`: 8dp elevation
- `.shadow-material-16`: 16dp elevation

### Form Components
- `.material-input`: Text/number input fields
- `.material-select`: Dropdown select fields
- `.material-label`: Input labels

### Button Components
- `.material-button-primary`: Primary action button
- `.material-button-secondary`: Secondary action button

## Color System

Primary colors:
- Indigo 500: `#6366f1`
- Indigo 700: `#5e35b1`
- Teal 600: `#00897b`

Surface colors:
- Background: `#fafafa` (Gray 50)
- Surface: `#ffffff` (White)
- Border: `#e5e7eb` (Gray 200)

## Features in Detail

### Single Prediction
- Form with 14+ input fields
- Real-time validation
- Detailed prediction with confidence intervals
- AI-generated recommendations
- Baseline comparisons

### Batch Prediction
- Add/remove products dynamically
- Process up to 100 products
- Summary statistics
- Export results to JSON
- Visual status indicators

### Model Statistics
- Performance comparison charts
- Detailed metrics table
- Model switching capability
- Best model indicators

### About Section
- Platform capabilities
- Model performance metrics
- Technology stack information
- Use case examples

## Performance Optimizations

- Server-side rendering with Next.js App Router
- Code splitting and lazy loading
- Optimized images and assets
- Efficient state management
- Memoized components

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is an educational project. Feel free to fork and modify for your own use.

## License

Educational project - see instructor for licensing details.

## Acknowledgments

- Google Material Design guidelines
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first CSS approach
- CatBoost team for the ML library

## Contact

For questions about this project, contact your instructor or teaching assistant.
