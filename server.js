const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos

// Ruta para manejar el formulario de contacto
app.post('/api/contacto', async (req, res) => {
    try {
        const { nombre, email, telefono, empresa, mensaje } = req.body;
        
        // Validación básica
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nombre, email y mensaje son requeridos' 
            });
        }

        // Crear objeto de contacto
        const contacto = {
            id: Date.now(),
            nombre,
            email,
            telefono: telefono || '',
            empresa: empresa || '',
            mensaje,
            fecha: new Date().toISOString(),
            ip: req.ip
        };

        // Leer archivo JSON existente o crear uno nuevo
        const filePath = path.join(__dirname, 'contactos.json');
        let contactos = [];
        
        try {
            const data = await fs.readFile(filePath, 'utf8');
            contactos = JSON.parse(data);
        } catch (error) {
            // El archivo no existe, se creará uno nuevo
            console.log('Creando nuevo archivo de contactos');
        }

        // Agregar nuevo contacto
        contactos.push(contacto);

        // Guardar en archivo JSON
        await fs.writeFile(filePath, JSON.stringify(contactos, null, 2));

        console.log('Nuevo contacto guardado:', contacto);

        res.json({ 
            success: true, 
            message: 'Mensaje enviado correctamente',
            id: contacto.id 
        });

    } catch (error) {
        console.error('Error al procesar contacto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// Ruta para obtener todos los contactos (opcional - para administración)
app.get('/api/contactos', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'contactos.json');
        const data = await fs.readFile(filePath, 'utf8');
        const contactos = JSON.parse(data);
        
        res.json({ 
            success: true, 
            contactos: contactos.reverse() // Más recientes primero
        });
    } catch (error) {
        res.json({ 
            success: true, 
            contactos: [] 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📧 API de contacto disponible en http://localhost:${PORT}/api/contacto`);
});

module.exports = app;