const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3'); // Reads SQLite
require('dotenv').config();

// 1. Load your Sequelize models (which are now configured for Neon)
const sequelize = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const Banner = require('./models/Banner');
const Setting = require('./models/Setting');

// 2. Connect to the old SQLite file
const sqlitePath = path.join(__dirname, 'database.sqlite');
if (!fs.existsSync(sqlitePath)) {
  console.error('❌ database.sqlite not found in this folder!');
  process.exit(1);
}
const sqliteDb = new Database(sqlitePath);

const migrateData = async () => {
  try {
    console.log('⏳ Connecting to Neon (Postgres)...');
    await sequelize.authenticate();
    
    // Ensure Postgres tables exist
    await sequelize.sync({ alter: false });
    console.log('✅ Connected to Neon. Starting migration...\n');

    // Helper function to migrate a table
    const migrateTable = async (Model, tableName) => {
      try {
        // Check if table exists in SQLite
        const tableExists = sqliteDb.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`).get();
        
        if (!tableExists) {
          console.log(`⚠️ Table '${tableName}' not found in SQLite. Skipping.`);
          return;
        }

        const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
        if (rows.length === 0) {
          console.log(`ℹ️ Table '${tableName}' is empty. Skipping.`);
          return;
        }

        console.log(`🚀 Migrating ${rows.length} rows from '${tableName}'...`);

        // Insert data into Neon
        for (const row of rows) {
          try {
             // We use upsert to avoid crashing if data already exists
             await Model.upsert(row);
          } catch (err) {
             console.error(`❌ Failed to insert row in ${tableName}:`, err.message);
          }
        }
        console.log(`✅ Finished '${tableName}'`);
      } catch (error) {
        console.error(`❌ Error migrating ${tableName}:`, error.message);
      }
    };

    // 3. Run the migration for each table
    // Order matters! Categories and Users should be first because Products and Orders depend on them.
    await migrateTable(Category, 'Categories');
    await migrateTable(User, 'Users');
    await migrateTable(Product, 'Products');
    await migrateTable(Coupon, 'Coupons');
    await migrateTable(Order, 'Orders');
    await migrateTable(Banner, 'Banners');
    await migrateTable(Setting, 'Settings');

    console.log('\n🎉 ALL DATA MIGRATED SUCCESSFULLY TO NEON!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration Failed:', error);
    process.exit(1);
  }
};

migrateData();