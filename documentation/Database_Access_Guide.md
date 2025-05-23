# Database Access Guide for Jewelry Inventory System

## Database Overview

The Jewelry Inventory System uses a PostgreSQL database to store all business data including:
- User accounts and permissions
- Sales transactions
- Purchase records
- Expense entries
- Inventory items (loose stock, certified stock, jewelry stock)
- Certification tracking
- Memo records
- And more

## Database Access Information

### Connection Details

When you deploy the application, you'll have full access to the database with these credentials:

- **Database Type**: PostgreSQL
- **Database Name**: The name you set during deployment
- **Username**: The admin username you configured
- **Password**: Your secure password (stored securely in environment variables)
- **Host**: Your deployment host address
- **Port**: Standard PostgreSQL port (5432 by default)

### Accessing the Database

You can access your data through several methods:

1. **Direct Database Connection**:
   - Use any PostgreSQL client (pgAdmin, DBeaver, etc.)
   - Connect using your credentials
   - Run SQL queries directly

2. **API Endpoints**:
   - All data can be accessed through the system's API endpoints
   - Secured with proper authentication
   - Documentation for API endpoints is available

3. **Data Export**:
   - The system includes export capabilities for reports
   - Data can be exported to Excel/CSV formats
   - Custom reporting is available

## Database Schema

The database follows a structured schema with tables for each module:

- `users` - User accounts and authentication
- `sales` - Sales transactions
- `purchases` - Purchase records
- `expenses` - Expense entries
- `loose_stock` - Loose gemstone inventory
- `certified_stock` - Certified gemstone inventory
- `jewellery_stock` - Finished jewelry inventory
- `igi_issue` - Items sent for certification
- `igi_receive` - Certification records
- `memo_give` - Memo records for items loaned out
- `memo_take` - Memo records for items taken on consignment

## Backup and Data Security

The system includes built-in backup capabilities:

- Regular automated backups
- Manual backup option
- Data export for creating your own backups
- Proper data encryption at rest and in transit

## Source Code Access

Upon deployment, you'll receive:

1. **Complete Source Code**:
   - Frontend (React, TypeScript)
   - Backend (FastAPI, Python)
   - Database migration scripts

2. **Deployment Instructions**:
   - Step-by-step guide for setting up on your servers
   - Configuration options

3. **Development Documentation**:
   - Code structure overview
   - API documentation
   - Database schema details

## Training and Support

During deployment, we provide:

1. **Comprehensive Training**:
   - Admin training sessions
   - User training sessions
   - Technical training for IT staff

2. **Documentation**:
   - User manuals
   - Technical documentation
   - Video tutorials

3. **Support Options**:
   - Technical support email
   - Knowledge base
   - Troubleshooting guides

## Data Migration

If you have existing data from another system, the deployment includes:

- Custom data migration tools
- Data validation processes
- Historical data import capabilities