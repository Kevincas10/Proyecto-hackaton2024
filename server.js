const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Configuración de multer para almacenar fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));

// Ruta para guardar un nuevo contacto con foto
app.post('/guardar-contacto', upload.single('foto'), (req, res) => {
    const { nombre, email, ocupacion } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : '';

    const nuevoContacto = { nombre, email, ocupacion, foto };

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

// Ruta para actualizar un contacto existente
app.put('/actualizar-contacto/:id', upload.single('foto'), (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, email, ocupacion } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : '';

    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).json({ success: false });

        const contactos = JSON.parse(data);
        contactos[id] = { ...contactos[id], nombre, email, ocupacion, foto: foto || contactos[id].foto };

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
