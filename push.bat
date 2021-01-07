@echo off
python generateTOC.py
python updateTime.py
set commit=
set /p commit=commit: %=%
git add -A
git commit -m "%commit%"
git push
pause