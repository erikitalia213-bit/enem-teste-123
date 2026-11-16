@echo off
echo Instalando (so na primeira vez)...
call npm install -g pnpm
call pnpm install
echo Abrindo em http://localhost:3000 - deixe esta janela aberta
start "" http://localhost:3000
call pnpm exec vite --port 3000
pause
