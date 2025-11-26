import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from functools import lru_cache
import logging
from config import Config

logger = logging.getLogger(__name__)

class CafeDataService:
    """Optimized data service with caching and better performance"""
    
    _instance = None
    _data = None
    _last_loaded = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CafeDataService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.cache_duration = timedelta(minutes=5)  # Cache for 5 minutes
            self.initialized = True
    
    def get_data(self, force_reload: bool = False) -> Optional[pd.DataFrame]:
        """Get cached data or reload if necessary"""
        if (force_reload or 
            self._data is None or 
            self._last_loaded is None or 
            datetime.now() - self._last_loaded > self.cache_duration):
            
            self._load_data()
        
        return self._data
    
    def _load_data(self):
        """Load and preprocess the cafe transaction data"""
        try:
            logger.info("Loading cafe transaction data...")
            df = pd.read_csv(Config.CAFE_DATA)
            
            # Data validation
            required_columns = ['Date', 'Time', 'Transaction ID', 'Item', 'Quantity', 'Total Price (INR)', 'Payment Method']
            missing_columns = set(required_columns) - set(df.columns)
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Data preprocessing
            df['Date'] = pd.to_datetime(df['Date'])
            df['Time'] = pd.to_datetime(df['Time'], format='%H:%M:%S', errors='coerce').dt.time
            df['DateTime'] = pd.to_datetime(df['Date'].astype(str) + ' ' + df['Time'].astype(str))
            df['Hour'] = df['DateTime'].dt.hour
            df['DayOfWeek'] = df['DateTime'].dt.day_name()
            df['Month'] = df['DateTime'].dt.month_name()
            df['Revenue'] = df['Quantity'] * df['Total Price (INR)']
            df['Week'] = df['Date'].dt.isocalendar().week
            
            # Data cleaning
            df = df.dropna(subset=['DateTime', 'Transaction ID', 'Total Price (INR)'])
            df = df[df['Total Price (INR)'] > 0]  # Remove invalid transactions
            df = df[df['Quantity'] > 0]  # Remove invalid quantities
            
            self._data = df
            self._last_loaded = datetime.now()
            logger.info(f"Successfully loaded {len(df)} transactions")
            
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            self._data = None
            raise
