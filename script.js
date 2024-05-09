document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const imageInput = document.getElementById('image-input');

    // Función para enviar la imagen al servidor con el mismo nombre
    function uploadImage(imageFile, selectedMonth, imageName) {
        const formData = new FormData();
        formData.append('image', imageFile, imageName); // Usar el nombre original del archivo
        formData.append('selectedMonth', selectedMonth); // También puedes enviar el mes seleccionado si lo necesitas

        fetch('http://127.0.0.1:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la imagen.');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Mensaje del servidor
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    

    // Evento para manejar el clic en un cuadro
    gridItems.forEach(item => {
        item.addEventListener('click', showImageInGrid);
        console.log('Event listener added for item:', item);
    });

    // Función para mostrar la imagen seleccionada en el cuadro correspondiente
    function showImageInGrid(event) {
        console.log('Grid item clicked');
        const selectedMonth = event.target.dataset.month;
        console.log('Selected month:', selectedMonth);
        const selectedImages = Array.from(imageInput.files);
        console.log('Selected images:', selectedImages);
        const gridItem = event.target;
        if (gridItem && gridItem.id) {
            const gridItemId = gridItem.getAttribute('id'); // Obtener el ID del cuadro
            console.log("gridItemId" + gridItemId);
            const extraText = ''; // Texto extra que deseas enviar
    
            if (selectedImages.length > 0) {
                const reader = new FileReader();
                reader.onload = function() {
                    console.log('Image loaded');
                    gridItem.style.backgroundImage = `url('${reader.result}')`;
                    gridItem.style.backgroundSize = 'cover';
                    console.log('Nombre del archivo:', selectedImages[0].name);
                    uploadImage(selectedImages[0], selectedMonth, selectedImages[0].name);
                    imageInput.value = ''; // Limpiar el campo de entrada de archivos
                };
                reader.readAsDataURL(selectedImages[0]); // Solo mostramos la primera imagen
            } else {
                console.log('No image selected');
            }
        } else {
            console.log('Grid item or ID is null');
        }
    }
    

    // Función para mostrar las imágenes al cargar la página
    function showImagesOnLoad() {
        fetch('http://127.0.0.1:3000/getImages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las imágenes.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Imágenes encontradas:', data);
            data.forEach(image => {
                const match = image.match(/(\d+)\.jpg/); // Extraer el número del nombre del archivo
                if (match) {
                    const monthNumber = parseInt(match[1]); // Convertir el número a entero
                    const gridItem = document.querySelector(`.grid-item[data-month="${monthNumber}"]`);
                    if (gridItem) {
                        gridItem.style.backgroundImage = `url('${image}')`;
                        gridItem.style.backgroundSize = 'cover';
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Función para eliminar todas las imágenes del servidor
    function deleteAllImages() {
        fetch('http://127.0.0.1:3000/delete', {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar las imágenes.');
            }
            console.log('Todas las imágenes han sido eliminadas');
            alert('Todas las imágenes han sido eliminadas')
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Evento para manejar el clic en el botón de eliminar
    const deleteButton = document.getElementById('delete-button');
    deleteButton.addEventListener('click', deleteAllImages);
    

    // Llamar a la función para mostrar las imágenes al cargar la página
    showImagesOnLoad();

    // Evento para manejar el clic en un cuadro
    gridItems.forEach(item => {
        item.addEventListener('click', showImageInGrid);
    });
});
