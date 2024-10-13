const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const config = {
    user: 'PruebaSQL',
    password: 'pruebasql',
    server: 'Sunware-PC\\SQLEXPRESS', 
    database: 'ReciclajeDB',
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    },
};

app.use(express.static('public')); 
app.use(bodyParser.json()); 

sql.connect(config).then(pool => {
    console.log('Conectado a SQL Server');

    app.get('/api/puntos/:usuario', async (req, res) => {
        const usuario = req.params.usuario;
        try {
            const result = await pool.request()
                .input('NombreUsuario', sql.NVarChar, usuario)
                .query('SELECT PuntosAcumulados FROM Usuarios WHERE NombreUsuario = @NombreUsuario');
            res.json(result.recordset[0]);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.post('/api/reciclaje', async (req, res) => {
        const { usuario, materialID, kg } = req.body;
        try {

            const puntosResult = await pool.request()
                .input('MaterialID', sql.Int, materialID)
                .query('SELECT PuntosPorKg FROM MaterialReciclable WHERE MaterialID = @MaterialID');
            const puntosPorKg = puntosResult.recordset[0].PuntosPorKg;
            const puntosGanados = kg * puntosPorKg;

            await pool.request()
                .input('NombreUsuario', sql.NVarChar, usuario)
                .input('PuntosGanados', sql.Int, puntosGanados)
                .query('UPDATE Usuarios SET PuntosAcumulados = PuntosAcumulados + @PuntosGanados WHERE NombreUsuario = @NombreUsuario');

            await pool.request()
                .input('NombreUsuario', sql.NVarChar, usuario)
                .input('MaterialID', sql.Int, materialID)
                .input('Kg', sql.Decimal(5, 2), kg)
                .input('PuntosGanados', sql.Int, puntosGanados)
                .query(`
                    INSERT INTO RegistroReciclaje (UsuarioID, MaterialID, KgReciclados, PuntosGanados)
                    VALUES ((SELECT UsuarioID FROM Usuarios WHERE NombreUsuario = @NombreUsuario), @MaterialID, @Kg, @PuntosGanados)
                `);

            res.json({ mensaje: 'Reciclaje registrado exitosamente', puntosGanados });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.post('/api/canjear', async (req, res) => {
        const { usuario, recompensaID } = req.body;
        try {

            const recompensaResult = await pool.request()
                .input('RecompensaID', sql.Int, recompensaID)
                .query('SELECT PuntosNecesarios FROM Recompensas WHERE RecompensaID = @RecompensaID');
            const puntosNecesarios = recompensaResult.recordset[0].PuntosNecesarios;

            const usuarioResult = await pool.request()
                .input('NombreUsuario', sql.NVarChar, usuario)
                .query('SELECT PuntosAcumulados FROM Usuarios WHERE NombreUsuario = @NombreUsuario');
            const puntosUsuario = usuarioResult.recordset[0].PuntosAcumulados;

            if (puntosUsuario >= puntosNecesarios) {

                await pool.request()
                    .input('NombreUsuario', sql.NVarChar, usuario)
                    .input('RecompensaID', sql.Int, recompensaID)
                    .query(`
                        UPDATE Usuarios SET PuntosAcumulados = PuntosAcumulados - @PuntosNecesarios 
                        WHERE NombreUsuario = @NombreUsuario;
                        INSERT INTO Canjes (UsuarioID, RecompensaID)
                        VALUES ((SELECT UsuarioID FROM Usuarios WHERE NombreUsuario = @NombreUsuario), @RecompensaID);
                    `);

                res.json({ mensaje: 'Recompensa canjeada exitosamente' });
            } else {
                res.status(400).json({ mensaje: 'Puntos insuficientes' });
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

}).catch(err => console.log('Error al conectar a SQL Server:', err));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
