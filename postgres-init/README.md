to new DB
docker compose down -v   
docker volume prune -f
<!-- Linux -->
rm -rf ./postgres-data
<!-- Powershell -->
Remove-Item -Recurse -Force ./postgres-data

docker compose up --build

# 🔄 Database Migration (Important for Existing Developers)

## For New Developers (First Time Setup)
If you're setting up the project for the first time, simply run:
```bash
npm run docker
```
The database will be automatically initialized with the latest schema.

## For Existing Developers (Database Update Required)
If you already have a local database and are pulling the latest changes, you need to update your database schema to include the new user account features:

### Option 1: Fresh Database (Recommended)
```bash
# Stop all containers
npm run rebuild:full

# Reset database completely  
npm run reset-db
```

### Option 2: Migrate Existing Database
If you want to keep your existing data:

```bash
# Copy migration script to database container
docker cp postgres-init/migrate_to_v2.sql capstone-project-25t2-9900-w18c-bread-db-1:/tmp/migrate_to_v2.sql

# Run migration
docker exec -it capstone-project-25t2-9900-w18c-bread-db-1 psql -U postgres -d vta -f /tmp/migrate_to_v2.sql
```

### Option 3: Manual Migration
```bash
# Enter PostgreSQL shell
docker exec -it capstone-project-25t2-9900-w18c-bread-db-1 psql -U postgres -d vta

# Run migration commands manually
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS signature TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

# Exit shell
\q
```

## ✨ New Features Added
- **User Account Management**: Users can now edit their profile, including:
  - Profile picture/avatar upload
  - Personal signature
  - Name editing
  - Profile information display

## 🔍 Verify Migration Success
After migration, verify the database structure:
```bash
docker exec -it capstone-project-25t2-9900-w18c-bread-db-1 psql -U postgres -d vta -c "\d users"
```

You should see the new columns: `avatar`, `signature`, `updated_at`.

## 🚨 Breaking Changes
- Database schema updated for `users` table
- New API endpoints added for user profile management
- Frontend updated with new user account sidebar functionality

## 📝 Migration Notes
- Migration is backward compatible - existing user data will be preserved
- Default signatures will be added for existing users
- All timestamps will be properly initialized