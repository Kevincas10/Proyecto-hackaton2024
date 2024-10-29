const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Ruta para guardar el contacto
app.post('/guardar-contacto', (req, res) => {
    const nuevoContacto = req.body;
    
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err);
            return res.status(500).json({ success: false });
        }

        const contactos = JSON.parse(data);
        contactos.push(nuevoContacto);

        fs.writeFile('data.json', JSON.stringify(contactos, null, 2), err => {
            if (err) {
                console.error('Error al escribir en el archivo', err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true });
        });
    });
});

// Ruta para obtener los contactos
app.get('/obtener-contactos', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err);
            return res.status(500).json([]);
        }

        const contactos = JSON.parse(data);
        res.json(contactos);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
