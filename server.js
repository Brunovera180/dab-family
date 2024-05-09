const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Multer para almacenar archivos en la carpeta 'files'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Utiliza el nombre original del archivo
    }
  });
  
  

const upload = multer({ storage: storage });

// Servir archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(cors({ origin: 'http://localhost:8000' }));

// Ruta para subir una imagen
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('Imagen subida:', req.file); // Loguear la información de la imagen subida
  res.sendStatus(200); // Enviar respuesta de éxito
});

// Ruta para eliminar todas las imágenes
app.delete('/delete', (req, res) => {
  fs.readdir('files/', (err, files) => {
    if (err) {
      console.error('Error al leer el directorio:', err);
      res.sendStatus(500); // Error del servidor
    } else {
      files.forEach(file => {
        fs.unlink(path.join('files/', file), err => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          }
        });
      });
      console.log('Todas las imágenes han sido eliminadas'); // Loguear cuando todas las imágenes han sido eliminadas
      res.sendStatus(200); // Enviar respuesta de éxito
    }
  });
});

// Ruta para obtener las imágenes existentes
app.get('/getImages', (req, res) => {
    fs.readdir('files/', (err, files) => {
      if (err) {
        console.error('Error al leer el directorio:', err);
        res.sendStatus(500); // Error del servidor
      } else {
        const images = files.map(file => `files/${file}`);
        console.log('Imágenes encontradas:', images); // Loguear las imágenes encontradas
        res.json(images); // Enviar las imágenes encontradas como un arreglo JSON
      }
    });
  });
  

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
