// Step 1
Add env files for backend and frontend

backend env : DATABASE_URL="postgresql://apple:8766@localhost:5432/mydb?schema=public"
frontend env: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

// Step 2
Run npm i to install packages

// Step 3
Run npm run dev to start frontend server
Run npm run start to start backend server
