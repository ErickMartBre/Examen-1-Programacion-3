function LogIn()
{
    window.location.href = "login.html"
}

function SignIn()
{
    window.location.href = "register.html"
}

function registrarUsuario(event)
{
    event.preventDefault();
    var usuario = document.getElementById("registerUsername").value;
    var password = document.getElementById("registerPassword").value;

    if (usuario && password)
    {
        var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        var usuarioExistente = usuarios.find(u => u.username === usuario);

        if (usuarioExistente)
        {
            alert("El usuario ya está registrado");
        }
        else
        {
            usuarios.push({username: usuario, password: password});
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "login.html";
        }
    }
    else
    {
        alert("Por favor completa todos los campos.");
    }
}

function iniciarSesion(event)
{
    event.preventDefault();
    var usuario = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if(usuario && password)
    {
        var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        var usuarioExistente = usuarios.find(u => u.username === usuario && u.password === password);
    
        if (usuarioExistente)
        {
            localStorage.setItem("username", usuario);
            window.location.href = "index.html";
        }
        else
        {
            alert("Credenciales incorrectas.")
        }
    }
    else
    {
        alert("Por favor ingrese las credenciales correctas");
    }
}

function mostrarUsuario()
{
    var usuario = localStorage.getItem("username");
    var bienvenida = document.getElementById("bienvenidaUsuario");
    var loginButton = document.getElementById("loginButton");
    var registerButton = document.getElementById("registerButton");
    var logoutButton = document.getElementById("logoutButton");

    if(usuario)
    {
        bienvenida.innerHTML = "Bienvenido, " + usuario;
        loginButton.style.display = "none";
        registerButton.style.display = "none";
        logoutButton.style.display = "inline";

        var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        var usuarioExistente = usuarios.find(u => u.username === usuario);

        if (usuarioExistente) 
        {
            var puntosTotales = usuarioExistente.puntos || 0;
            puntosTotalesDiv.innerText = "Puntos acumulados: " + puntosTotales; // Mostrar puntos totales
        } 
        else 
        {
            puntosTotalesDiv.innerText = "Puntos acumulados: 0";
        }
    }
}

function mostrarPuntosUsuario(usuario) {
    
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    var usuarioExistente = usuarios.find(u => u.username === usuario);
    
    if (usuarioExistente && usuarioExistente.puntos !== undefined) {
        
        var puntos = usuarioExistente.puntos || 0
        document.getElementById("resultadoPuntos").innerText = "Total de puntos acumulados: " + usuarioExistente.puntos;
    } else {
        
        document.getElementById("resultadoPuntos").innerText = "Total de puntos acumulados: 0";
    }
}

function CerrarSesion()
{
    localStorage.removeItem("username");
    window.location.href = "index.html";
}

window.onload = function()
{
    mostrarUsuario();
};

function CalcularPuntos(event)
{
    event.preventDefault();

    var KgVidrio = parseFloat(document.getElementById("KgVidrio").value) || 0;
    var KgPlLaBr = parseFloat(document.getElementById("KgPlLaBr").value) || 0;
    var KgPapCar = parseFloat(document.getElementById("KgPapCar").value) || 0;
    var KgOrganico = parseFloat(document.getElementById("KgOrganico").value) || 0;
    var KgNoRec = parseFloat(document.getElementById("KgNoRec").value) || 0;

    var puntosVidrio = KgVidrio * 3;
    var puntosPlLaBr = KgPlLaBr * 2;
    var puntosPapCar = KgPapCar * 2;
    var puntosOrganico = KgOrganico * 1;
    var puntosNoRec = KgNoRec * 1;

    var TotalPuntos = puntosNoRec + puntosOrganico + puntosPapCar + puntosPlLaBr + puntosVidrio;

    document.getElementById("resultadoPuntos").innerText = "Total de puntos acumulados: " + TotalPuntos;

    var usuario = localStorage.getItem("username");
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    var usuarioExistente = usuarios.find(u => u.username === usuario);

    if (usuarioExistente) 
    {
        if (usuarioExistente.puntos) 
        {
            usuarioExistente.puntos += TotalPuntos;
        } 
        else 
        { 
            usuarioExistente.puntos = TotalPuntos;
        }
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios)); 
    
    document.getElementById("puntosTotalesUsuario").innerText = "Puntos acumulados: " + usuarioExistente.puntos;
}

function HabilitarInput(checkbox,inputGroupId)
{
    var inputGroup = document.getElementById(inputGroupId);
    inputGroup.style.display = checkbox.checked ? "block" : "none";
}

function canjearPremio(puntosRequeridos) {
    var usuario = localStorage.getItem("username");
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    var usuarioExistente = usuarios.find(u => u.username === usuario);

    if (usuarioExistente && usuarioExistente.puntos >= puntosRequeridos) {
        // Restar los puntos
        usuarioExistente.puntos -= puntosRequeridos;

        // Guardar el nuevo valor en localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Mostrar mensaje de confirmación
        alert("Premio canjeado exitosamente. Te quedan " + usuarioExistente.puntos + " puntos.");

        // Actualizar la pantalla de puntos
        mostrarPuntosUsuario(usuario);
    } else {
        alert("No tienes suficientes puntos para canjear este premio.");
    }
}
