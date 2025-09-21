# 🏪 Cafe Analytics & AI-Driven Insights Platform

A comprehensive data analytics platform designed to provide cafe owners with actionable business intelligence through interactive dashboards and advanced visualizations.

## 🎯 **Project Overview**

In the highly competitive cafe industry, leveraging **data analytics** and AI can significantly enhance decision-making and customer engagement. This platform provides cafe owners with actionable business intelligence through data-driven dashboards and interactive visualizations.

## 🛠️ **Tech Stack**

- **Backend**: Flask (Python) with comprehensive API
- **Frontend**: React with Recharts for visualizations
- **Data Processing**: Pandas, NumPy, MLxtend
- **Analytics**: Market Basket Analysis, KPI calculations
- **UI**: Material-UI components

## 📁 **Project Structure**

```
Cafe-Analytics/
├── 📁 app/                    # Flask Backend
│   ├── api/                   # API endpoints (12 endpoints)
│   ├── dash/                  # Dash visualizations
│   ├── data/                  # Data files
│   └── utils/                 # Analytics utilities
├── 📁 ca-frontend/            # React Frontend
│   ├── src/
│   │   ├── charts/            # Recharts components
│   │   ├── kpis/              # KPI cards
│   │   ├── layout/            # Layout components
│   │   ├── services/          # API services
│   │   └── pages/             # Page components
│   └── package.json
├── 📁 docs/                   # Documentation
├── 📁 scripts/                # Development scripts
└── 📁 venv/                   # Python environment
```

## 🚀 **Quick Start**

### **Option 1: Automated Setup**
```bash
# Install all dependencies
scripts/install-deps.bat

# Start both servers
scripts/start-dev.bat
```

### **Option 2: Manual Setup**
```bash
# Backend
pip install -r requirements.txt
python run.py

# Frontend (new terminal)
cd ca-frontend
npm install
npm start
```

## 🌐 **Access Points**

- **Backend API**: http://localhost:5000
- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:5000/api/dashboard-data

## 📊 **Key Features**

- **📈 Financial KPIs**: Revenue, growth, targets
- **⚙️ Operational Metrics**: Transactions, peak hours, efficiency
- **🛍️ Product Analytics**: Top sellers, cross-sell insights
- **👥 Customer Insights**: Segmentation, behavior analysis
- **📊 Interactive Charts**: Recharts visualizations
- **🔄 Real-time Data**: Live dashboard updates

## 📚 **Documentation**

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Frontend Structure](docs/FRONTEND_STRUCTURE.md)
- [Project Structure](PROJECT_STRUCTURE.md)

## 🎨 **Screenshots**

![Dashboard Overview](https://github.com/user-attachments/assets/20f0997a-5564-4296-8fc7-7ee4a39db0c7)
![Analytics View](https://github.com/user-attachments/assets/f80ea073-3649-4158-b4fa-78ee58b9bf0b)
![Product Analysis](https://github.com/user-attachments/assets/194dc5e8-c268-47b0-8878-cdcd711af595)
![Customer Insights](https://github.com/user-attachments/assets/fd296883-880f-40dc-88a9-e880d022d5bf)

## 🔧 **Development**

### **Backend Development**
- Flask API with 12 comprehensive endpoints
- Advanced analytics with CafeAnalytics class
- CORS enabled for React integration

### **Frontend Development**
- Modern React with hooks
- Recharts for data visualization
- Material-UI for consistent design
- Responsive mobile-first approach

## 📈 **Business Value**

- **Sales Optimization**: Identify best-selling products and trends
- **Cross-selling Opportunities**: Discover product combinations
- **Revenue Insights**: Track growth and performance
- **Operational Decisions**: Data-driven inventory and marketing
- **Customer Understanding**: Behavior analysis and segmentation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ for cafe owners who want to make data-driven decisions**
