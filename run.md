pm2 restart task-backend --update-env


cd dist
pm2 start serve --name med-extracter-f -- -s . -l 9000
pm2 start src/index.js --name med-extracter-b


npx vite --host 0.0.0.0 --port 9010

npm run dev


npx vite --host 0.0.0.0 --port 8501