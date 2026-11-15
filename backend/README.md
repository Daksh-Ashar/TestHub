# Backend

## Seed demo data

The demo seeder creates 30 fictional participants, a Web Development class, and four published tests: HTML, CSS, JavaScript, and React foundations. All participants have submitted the HTML and CSS tests; JavaScript and React remain pending. Rerunning it refreshes the demo submissions and resets the JavaScript and React tests to pending for these accounts. Use a disposable development or test database.

Copy `.env.example` to `.env` and fill in local settings. Keep `.env` out of Git. Set `NODE_ENV` to `development` or `test`, set `SEED_DEMO_DATA=true` as an explicit confirmation, and set `MONGO_URI` to the intended development/test database. Then run from the `backend` directory:

```powershell
$env:NODE_ENV = "development"
$env:SEED_DEMO_DATA = "true"
$env:MONGO_URI = "mongodb://127.0.0.1:27017/qa_system_demo"
npm run seed:demo
```

The seeded account passwords are bcrypt-hashed. By default, the seeder generates an unreported random password, so the accounts are suitable for displaying demo data but not logging in. To use the accounts for local login, set `DEMO_SEED_PASSWORD` in the environment before running the seeder. Never commit that value or use a real or reused password.
