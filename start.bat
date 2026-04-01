@echo off
wt -w 0 ^
nt -d "D:\desktop\projects\mapEditor" cmd /k "npm run dev" ; ^
nt -d "D:\desktop\projects\mapEditor" cmd /k "npm run watch:server" ; ^
nt -d "D:\desktop\projects\mapEditor" cmd /k "npm run start:server"
