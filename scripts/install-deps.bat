@echo off
echo Installing Cafe Analytics Dependencies...
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Installing React dependencies...
cd ca-frontend
npm install

echo.
echo All dependencies installed successfully!
echo.
pause
