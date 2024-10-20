import mongoose, { Types } from 'mongoose'; 
import dotenv from 'dotenv';
import Category from '../dao/models/category.model.js'; // Cambiado a exportación nombrada

// Cargar las variables de entorno desde .env
dotenv.config();

// Obtener la URI de MongoDB desde el archivo .env
const mongoUrl = process.env.MONGODB_URI;



//? ********************************************
//? *******↓-↓-↓-↓-EDITABLE-↓-↓-↓-↓*************
//? ********************************************



//! IDs de los productos a agregar en la categoría
const productIds = [
    // "671093515e89e43d81961e5b",
    "6712cf675e89e43d81961e8b"
    // "671093515e89e43d81961e59",
    // "671093515e89e43d81961e58"
];

// Nombre de la categoría que deseas actualizar
const categoryName = "Drums"; //! Cambiarlo según sea necesario
// const categoryName = "Bass"; //! Cambiarlo según sea necesario




//? ********************************************
//? *******↑-↑-↑-↑-EDITABLE-↑-↑-↑-↑*************
//? ********************************************




async function updateCategory() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(mongoUrl);

        // Actualizar la categoría
        const result = await Category.updateOne(
            { name: categoryName }, // Filtrar por el nombre de la categoría
            {
                $addToSet: {
                    products: { $each: productIds.map(id => new Types.ObjectId(id)) } // Convertir a ObjectId
                }
            }
        );

        console.log('Categoría actualizada:', result);
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
    } finally {
        // Cerrar la conexión
        mongoose.connection.close();
    }
}

updateCategory();

/* EJECUTAR:

node src/utils/updateCategory.js

*/
