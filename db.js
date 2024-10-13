const sql = require('mssql');


const config = {
    user: 'tu_usuario',      
    password: 'tu_contraseña', 
    server: 'SUNWARE-PC\\SQLEXPRESS', 
    database: 'ReciclajeDB', 
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

// Función para conectarse a la base de datos
async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Conexión exitosa a SQL Server');
        return pool;
    } catch (err) {
        console.error('Error al conectar con SQL Server: ', err);
    }
}

module.exports = { connectDB, sql };