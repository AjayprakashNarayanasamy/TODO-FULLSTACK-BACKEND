const pool = require('../db/pool')

 async function getUsers (req, res)
{
    console.log('Ajay')
    const result = await pool.query("SELECT id,email,created_at FROM users ORDER BY id");
    console.log('Result', result)
    res.status(200).json(result.rows)
};


module.exports = 
{
    getUsers,
    getUserById
};