import mssql from "mssql";

const connectionSettings={
    server: "Sunware-PC\SQLEXPRESS",
    database: "ReciclajeDB",
    user: "",
    password: "",
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export async function getConnection(){
    try{
        return await mssql.connect(connectionSettings);
    }
    catch(error){
        console.error(error);
    }
}

export {mssql};
