import { Router } from "express";
import cartManager from "../CartManager.js";

const cartsRouter = Router();

// Get Cart By Id
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(+cid);
        if(!cart) {
            return res.status(404).send({message: 'cart not found'});
        }
        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

// Add cart
cartsRouter.post('/', async (req, res) => {
    try {
        const cartAdded = await cartManager.addCart();
        if(!cartAdded){
            return res.status(400).send({message: 'error: cart not added'});
        }
        res.send({message: `Cart with id: ${cartAdded.id} was successfuly created`});
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

// Add product to cart
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const productAddedToCart = await cartManager.addProductToCart(+cid, +pid);
        if(!productAddedToCart) {
            return res.status(400).send({message: 'error: product not added'})
        }
        res.send({message: 'product added to cart'});
    } catch (error) {
        console.error(error);
    }
});

export default cartsRouter;





















// // Get all carts
// cartsRouter.get('/', async (req, res) => {
//     try {
//         const carts = await cartManager.getCarts();
//         return res.send(carts);
//     } catch (error) {
//         console.error(error);
//         return res.send(error);
//     }
// });