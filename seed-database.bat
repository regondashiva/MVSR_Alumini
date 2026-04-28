@echo off
echo Starting database seeding...
echo.

cd /d "c:\Users\shiva\OneDrive\Desktop\project\MVSR\backend-go"

echo Running seed data script...
go run seed/seed.go

echo.
echo Database seeding completed!
echo.
echo You can now start the backend server with:
echo go run main.go
echo.
pause
