@echo off
set commit=
set /p commit=commit: %=%
git add -A
git commit -m "%commit%"
git push
pause