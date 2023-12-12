import { Router } from "express";
import productManager from '../ProductManager.js';

const productsRouter = Router();

// Add Product
productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body;
        const productAdded = await productManager.addProduct(product);
        if(!productAdded) return res.status(400).send({message: 'error: product not added'});
        res.send(productAdded);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error });
    }
})
// Get all products
productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query // http://localhost:8080/products?limit=1
        const products = await productManager.getProducts();
        if(!limit || limit <= 0) {
            return res.status(200).send(products);
        } 
        return res.status(200).send(products.slice(0, limit));
    } catch (error) {
        console.log(error, error);
        res.status(400).send({message: 'products not found'})
    }
});

// Get product by Id
productsRouter.get('/:pId', async (req, res) => {
    try {
        const { pId } = req.params;
        const product = await productManager.getProductById(+pId);
        if(!product) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
});

// Update product
productsRouter.put('/:pId', async (req, res) => {
    try {
        const product = req.body;
        const { pId } = req.params;
        const updatedProduct = await productManager.updateProduct(+pId, product);
        if(!updatedProduct) {
            return res.status(404).send({message: 'product not updated'})
        }
        res.send(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
});
// Delete product
productsRouter.delete('/:pId', async (req, res) => {
    try {
        const { pId } = req.params;
        const productDeleted = await productManager.deleteProduct(+pId);
        if(!productDeleted){
            return res.status(404).send({message: 'product not found'})
        };
        res.send({message: `product with id: ${pId} successfully deleted`});
    } catch (error) {
        console.error(error);
    }
});

export default productsRouter;