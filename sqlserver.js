import { getConnection, mssql } from "./connectionSQLserver.js";

const getUsers= async() => {
    try{
        const pool= await getConnection();
        const result = await pool.request().query("SELECT UsuarioID, NombreUsuario, PuntosAcumulados from Usuario where Usuarios")
        console.log(result);
        console.log("Datos de usuarios:")
    }
    catch(error){
        console.error(error);
    }
}
getUsers();