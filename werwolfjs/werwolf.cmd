@echo off
color 09
echo Willkommen bei Werwolf!
echo Um Werwolf auszufuehren, muss nodejs auf dem System installiert sein.
echo .......................................
echo Wenn nodejs installiert ist, druecke irgendeine Taste um das Spiel zu starten
:restart
pause
color 1e
cls
node werwolf.js
color 4f
echo das Spiel wurde beendet!
echo wenn ein Fehler aufgetreten ist, ist dieser oben zu sehen.
echo .......................................
echo druecke irgendeine Taste um das Spiel erneut zu starten.
goto restart
