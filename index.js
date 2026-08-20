const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const { data: clientes, error } = await supabase.from('cliente').select('*');
        if (error) throw error;

        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Gestor de Clientes - Automatizador</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f4f4f9; margin: 0; padding: 20px; color: #333; }
                    .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    h2 { color: #2c3e50; }
                    form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
                    input, select, button { padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
                    button { background: #27ae60; color: white; border: none; cursor: pointer; }
                    button:hover { background: #219653; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
                    th { background: #f8f9fa; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Panel de Control - Negocio</h2>
                    <form action="/agregar" method="POST">
                        <input type="text" name="nombre" placeholder="Nombre del cliente" required>
                        <input type="text" name="telefono" placeholder="Teléfono / WhatsApp" required>
                        <select name="estado">
                            <option value="Pendiente">Pendiente</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Pagado">Pagado</option>
                        </select>
                        <button type="submit">Guardar Cliente</button>
                    </form>
                    <h3>Lista de Clientes Registrados</h3>
                    <table>
                        <tr><th>Nombre</th><th>Teléfono</th><th>Estado</th></tr>`;
        
        clientes.forEach(c => {
            html += `<tr><td>${c.nombre}</td><td>${c.telefono}</td><td>${c.estado}</td></tr>`;
        });

        html += `</table></div></body></html>`;
        res.send(html);
    } catch (err) {
        res.status(500).send("Error al cargar los datos: " + err.message);
    }
});

app.post('/agregar', async (req, res) => {
    const { nombre, telefono, estado } = req.body;
    const { error } = await supabase.from('cliente').insert([{ nombre, telefono, estado }]);
    if (error) return res.status(500).send("Error al insertar: " + error.message);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});