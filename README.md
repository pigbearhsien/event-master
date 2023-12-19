執行前端：
```
cd frontend
yarn
yarn dev
```

執行後端：
```
cd backend
pip install -r requirement.txt
uvicorn main:app --reload
```
env檔案的 `DATABASE_URL`要改成正確的路徑，或使用我們deploy在網路上的（但是很慢）：postgresql://dbms:DBgroup12@dbms.postgres.database.azure.com:5432/eventmaster
