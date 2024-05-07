document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const imageInput = document.getElementById('image-input');

    // Función para mostrar la imagen seleccionada en el cuadrado correspondiente
    function showImageInGrid(event) {
        console.log('Grid item clicked');
        const selectedMonth = event.target.dataset.month;
        console.log('Selected month:', selectedMonth);
        const selectedImages = Array.from(imageInput.files);
        console.log('Selected images:', selectedImages);
        const gridItem = event.target;

        if (selectedImages.length > 0) {
            const reader = new FileReader();
            reader.onload = function() {
                console.log('Image loaded');
                gridItem.style.backgroundImage = `url('${reader.result}')`;
                gridItem.style.backgroundSize = 'cover';
            };
            reader.readAsDataURL(selectedImages[0]); // Solo mostramos la primera imagen
            imageInput.value = ''; // Limpiar el campo de entrada de archivos
        } else {
            console.log('No image selected');
        }
    }

    // Evento para manejar el clic en un cuadrado
    gridItems.forEach(item => {
        item.addEventListener('click', showImageInGrid);
    });
});
