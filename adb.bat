@echo off
taskkill /F /IM adb.exe

cd E:\Programs\android-studio\platform-tools

adb.exe start-server

PAUSE











