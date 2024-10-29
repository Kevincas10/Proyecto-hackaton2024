const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Ruta para guardar un nuevo contacto
app.post('/guardar-contacto', (req, res) => {
    const nuevoContacto = req.body;

    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).json({ success: false });

        const contactos = JSON.parse(data);
        contactos.push(nuevoContacto);

        fs.writeFile('data.json', JSON.stringify(contactos, null, 2), err => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        });
    });
});

// Ruta para obtener todos los contactos
app.get('/obtener-contactos', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).json([]);
        const contactos = JSON.parse(data);
        res.json(contactos);
    });
});

// Ruta para actualizar un contacto
app.put('/actualizar-contacto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const contactoActualizado = req.body;

    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).json({ success: false });

        const contactos = JSON.parse(data);
        contactos[id] = contactoActualizado;

        fs.writeFile('data.json', JSON.stringify(contactos, null, 2), err => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        });
    });
});

// Ruta para eliminar un contacto
app.delete('/eliminar-contacto/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).json({ success: false });

        const contactos = JSON.parse(data);
        contactos.splice(id, 1);

        fs.writeFile('data.json', JSON.stringify(contactos, null, 2), err => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
