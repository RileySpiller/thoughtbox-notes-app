const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Please check your .env.local file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log("Setting up Supabase database...");

    // Read the schema file
    const schemaPath = path.join(__dirname, "supabase-schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc("exec_sql", { sql: statement });

      if (error) {
        console.error("Error executing SQL:", error);
      }
    }

    console.log("Database setup complete!");

    // Test the connection by fetching notes
    const { data, error } = await supabase.from("notes").select("*").limit(5);

    if (error) {
      console.error("Error fetching notes:", error);
    } else {
      console.log(`Successfully fetched ${data.length} notes.`);
    }
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDatabase();
