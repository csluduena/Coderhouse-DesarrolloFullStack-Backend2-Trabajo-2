document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const productList = document.getElementById('productList');
    const productDetails = document.getElementById('productDetails');
    const updateStockBtn = document.getElementById('updateStock');
    const cancelUpdateBtn = document.getElementById('cancelUpdate');
    
    let selectedProductId = null;

    categorySelect.addEventListener('change', async (e) => {
        const category = e.target.value;
        if (category) {
            const products = await fetchProductsByCategory(category);
            displayProducts(products);
        } else {
            productList.innerHTML = '';
        }
    });

    async function fetchProductsByCategory(category) {
        try {
            const response = await fetch(`/api/products?category=${category}`);
            const data = await response.json();
            return data.products; // Accede a los productos
        } catch (error) {
            console.error('Error fetching products:', error);
            rockAlert('Error', 'Error al obtener productos.', 'error');
            return [];
        }
    }

    function displayProducts(products) {
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            productList.innerHTML = '<p>Error: No se pudieron cargar los productos.</p>';
            return;
        }
        productList.innerHTML = products.map(product => {
            const productId = product._id || product.id; // Obtener el ID del producto
            return `
            <div class="flexTime";>
                <div class="product-item" data-id="${productId}"> 
                    <p style="font-size:15px;">${product.title}<p>
                    <img src="${product.img}" alt="${product.title}" style="width:70%">
                    <p>Stock: ${product.stock}</p>
                </div>
            </div>
            `;
        }).join('');
        
        productList.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                selectedProductId = productItem.dataset.id;
                const product = products.find(p => p._id === selectedProductId || p.id === selectedProductId); 
                if (product) {
                    showProductDetails(product);
                } else {
                    rockAlert('Error', `Producto con ID ${selectedProductId} no encontrado`, 'error');
                }
            }
        });
    }

    function showProductDetails(product) {
        if (!product) {
            console.error('Product not found');
            return;
        }
        document.getElementById('productTitle').textContent = product.title;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('currentStock').textContent = product.stock;
        document.getElementById('newStock').value = product.stock !== undefined ? product.stock : 0;
        productDetails.style.display = 'block';
    }

    // Código A integrado
    updateStockBtn.addEventListener('click', async () => {
        const newStock = document.getElementById('newStock').value;
        try {
            const response = await fetch(`/api/products/${selectedProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stock: newStock }),
            });
            if (response.ok) {
                const updatedProduct = await response.json();
                showProductDetails(updatedProduct);
                updateProductListItem(updatedProduct);

                // Alerta personalizada con recarga de página al darle OK
                rockAlert({
                    title: 'Stock actualizado',
                    text: 'El stock ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    callback: () => {
                        // Recargar la página cuando se presione OK
                        window.location.reload();
                    }
                });
            } else {
                throw new Error('Error al actualizar el stock');
            }
        } catch (error) {
            // Alerta personalizada en caso de error
            rockAlert({
                title: 'Error',
                text: 'Error al actualizar el stock.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    cancelUpdateBtn.addEventListener('click', () => {
        productDetails.style.display = 'none';
        selectedProductId = null;
    });

    function updateProductListItem(product) {
        const productItem = productList.querySelector(`[data-id="${product._id}"]`);
        if (productItem) {
            productItem.querySelector('p').textContent = `Stock: ${product.stock}`;
        }
    }

    // Función para mostrar alertas personalizadas con rockAlert
    function rockAlert({ title, text, icon, confirmButtonText, callback }) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then((result) => {
            if (result.isConfirmed && typeof callback === 'function') {
                callback(); // Ejecutar el callback si está definido
            }
        });
    }
});

