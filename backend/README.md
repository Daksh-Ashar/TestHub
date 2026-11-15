# Backend

## Seed demo data

The demo seeder creates fictional users, a Web Development class, a published HTML/CSS test, and participant submissions. It upserts the fixtures, so rerunning it updates the same demo records. Use a disposable development or test database.

Set `NODE_ENV` to `development` or `test`, set `SEED_DEMO_DATA=true` as an explicit confirmation, and set `MONGO_URI` to the intended development/test database. Then run from the `backend` directory:

```powershell
$env:NODE_ENV = "development"
$env:SEED_DEMO_DATA = "true"
$env:MONGO_URI = "mongodb://127.0.0.1:27017/qa_system_demo"
npm run seed:demo
```

The seeded account passwords are bcrypt-hashed. By default, the seeder generates an unreported random password, so the accounts are suitable for displaying demo data but not logging in. To use the accounts for local login, set `DEMO_SEED_PASSWORD` in the environment before running the seeder. Never commit that value or use a real or reused password.
