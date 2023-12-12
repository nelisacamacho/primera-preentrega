// import e from 'express';
import fs from 'fs';
import productManager from './ProductManager.js';

class CartManager {
    constructor(path) {
        this.path = path;
    }
    #generateId = async () => {
        try {
            const carts = await this.getCarts();
            if(carts.length === 0) {
                return 1;
            }
            return carts[carts.length - 1].id + 1;
        } catch (error) {
            console.error(error)
        }
    }
    // Get Cart By Id
    getCartById = async (cartId) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if(!cart) return false;
            return cart;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    // Add cart
    addCart = async () => {
        try {
            const carts = await this.getCarts();
            const cartId = await this.#generateId();
            carts.push({
                id: cartId,
                products: []
            });
            await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    
    // Add Product to cart
    addProductToCart = async(cId, pId) => {
        try {
            // Is product active
            const productIsActive = await productManager.getProductById(pId);
            if(!productIsActive) return false;
            
            const carts =  await this.getCarts();
            const cart = carts.find(cart => cart.id === cId);
            
            // Cart exist
            if(!cart) return false;
            
            const product = await cart.products.find(p => p.id === pId);
            if(product) {
                product.quantity++;
            } else {
                cart.products = [...cart.products, {id: pId, quantity: 1}]; 
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8');
            return true;
        } catch(error) {
            console.error(error);
            return false;
        }
    }
}
const cartManager = new CartManager('./src/data/Cart.json');
export default cartManager;






























// // Get all carts
// getCarts = async() => {
//     try {
//         const data = await fs.promises.readFile(this.path, 'utf-8');
//         const carts = JSON.parse(data);
//         return carts;
//     } catch(error) {
//         console.error(error);
//         return [];
//     }
// } 