

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const productList = document.getElementById('productList');
    const productDetails = document.getElementById('productDetails');
    const updateStockBtn = document.getElementById('updateStock');
    const cancelUpdateBtn = document.getElementById('cancelUpdate');
    const errorMessage = document.getElementById('error-message'); 
    
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
            //console.log('API Response:', data);
    
            // Acceder al array de productos a través de la propiedad "products"
            return data.products; 
        } catch (error) {
            console.error('Error fetching products:', error);
            showErrorMessage('Error al obtener productos.');
            return [];
        }
    }

    function displayProducts(products) {
        //console.log('Products to display:', products); 
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            productList.innerHTML = '<p>Error: No se pudieron cargar los productos.</p>';
            return;
        }
        productList.innerHTML = products.map(product => {
            // Obtener el ID del producto de forma segura
            const productId = product._id || product.id; 
    
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
    
                // Buscar el producto por el ID obtenido previamente
                const product = products.find(p => p._id === selectedProductId || p.id === selectedProductId); 
    
                if (product) {
                    showProductDetails(product);
                } else {
                    showErrorMessage(`Producto con ID ${selectedProductId} no encontrado`);
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
        document.getElementById('newStock').value = product.stock;
        productDetails.style.display = 'block';
    }

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
                alert('Stock actualizado correctamente');
                const updatedProduct = await response.json();
                showProductDetails(updatedProduct);
                updateProductListItem(updatedProduct);
            } else {
                throw new Error('Error al actualizar el stock');
            }
        } catch (error) {
            showErrorMessage('Error al actualizar el stock');
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

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});