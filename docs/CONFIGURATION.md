# ⚙️ Configuration Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# API Configuration
API_BASE_URL=http://localhost:5000/api
CORS_ORIGINS=http://localhost:3000

# Data Configuration
DATA_PATH=app/data/raw/cafe_transactions_cleaned.csv

# React Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Project Configuration

### Backend (Flask)
- **Port**: 5000
- **API Base**: `/api`
- **CORS**: Enabled for `http://localhost:3000`

### Frontend (React)
- **Port**: 3000
- **Proxy**: `http://localhost:5000`
- **API Integration**: Ready

## Data Configuration

The application uses CSV data files located in:
- `app/data/raw/cafe_transactions_cleaned.csv` (Primary data)
- `app/data/raw/Cafe_Menu.xlsx` (Menu data)

## Development Setup

1. **Backend**: `python run.py`
2. **Frontend**: `cd ca-frontend && npm start`
3. **Both**: `scripts/start-dev.bat`
