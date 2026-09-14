const pool = require('./pool');

async function testConnection()
{
    try {

        const result = await pool.query("SELECT NOW()");

        console.log('Database Connected:');
        console.log(result.rows[0]);
        
    } catch (error) {
        console.log("Database Connection Failed", error.message)
    }
    finally{
        await pool.end();
    }
}

testConnection()