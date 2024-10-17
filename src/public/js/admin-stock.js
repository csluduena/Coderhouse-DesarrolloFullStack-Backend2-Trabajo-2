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
            console.log('API Response:', data); // Log the entire response
            return data.payload || data; // Return payload if it exists, otherwise return the entire data
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    function displayProducts(products) {
        console.log('Products to display:', products); // Log the products array
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            productList.innerHTML = '<p>Error: No se pudieron cargar los productos.</p>';
            return;
        }
        productList.innerHTML = products.map(product => `
        <div class="product-item" data-id="${product._id}">
          <h3>${product.title}</h3>
          <p>Stock: ${product.stock}</p>
        </div>
      `).join('');

        productList.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                selectedProductId = productItem.dataset.id;
                showProductDetails(products.find(p => p._id === selectedProductId));
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
            alert(error.message);
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
});