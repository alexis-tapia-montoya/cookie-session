async function manejarLogin(username, password) {
    try {
    const respuesta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' }, 
        body: JSON.stringify({ username, password })   
    });

    const resultado = await respuesta.json(); 
    if (resultado.success) {
        window.location.href = 'dashboard.html';
    } else {
        alert(resultado.message);
    }
    } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    }
}