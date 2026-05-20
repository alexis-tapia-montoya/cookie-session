const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: 'mi_clave_secreta_super_segura', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,  
        maxAge: 1000 * 60 * 10 
    }
}));


app.use(express.static(path.join(__dirname, 'public')));


function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.usuario) {
        console.log(`[LOG] Acceso PERMITIDO para el usuario: ${req.session.usuario} a las ${new Date().toLocaleTimeString()}`);
        return next();
    } else {
        console.warn(`[LOG] Acceso DENEGADO. Intento de intrusión no autenticado a las ${new Date().toLocaleTimeString()}`);
        return res.status(401).json({ error: 'Acceso denegado. Por favor inicia sesión.' });
    }
}


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        req.session.usuario = username; 
        console.log(`[LOG] Login EXITOSO para el usuario: ${username}`);
        return res.json({ success: true, message: 'Autenticación correcta' });
    } else {
        console.warn(`[LOG] Login FALLIDO para el usuario: ${username || 'Desconocido'}`);
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
});


app.get('/api/dashboard', verificarAutenticacion, (req, res) => {
    res.json({ 
        success: true, 
        data: "Bienvenido a la sección privada. Estos datos provienen del backend seguro." 
    });
});

app.get('/api/logout', (req, res) => {
    const usuario = req.session.usuario;
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'No se pudo cerrar la sesión' });
        }
        console.log(`[LOG] Sesión TÉRMINADA para el usuario: ${usuario}`);
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Sesión cerrada correctamente' });
    });
});


app.listen(PORT, () => {
    console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});