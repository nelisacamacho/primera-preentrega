import fs from 'fs';
class ProductManager {

    constructor(path) {
        this.path = path;
    }

    #generateId = async () => {
        try {
            const products = await this.getProducts();
            if(products.length === 0) return 1;
            return products[products.length - 1].id + 1;
        } catch (error) {
            console.error(error);
            return {error}
        }
    }

    // Add product
    addProduct = async (product) => {
        const { title, description, price, thumbnail, code, stock } = product;
        try {
            if(!title || !description || !price || !code || !stock) {
                console.log('All fields are required, please verify.');
                return false;
            }
            const products = await this.getProducts();
            if(products.find(product => product.code === code)) {
                console.log(`Code ${code} already exists, please verify.`);
                return false;
            }
            
            const newProduct = {
                id: await this.#generateId(),
                title, 
                description, 
                price,
                thumbnail: [].concat(thumbnail || []).map(String),
                code, 
                stock,
                available: true
            }
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            return newProduct;
        } catch (error) {
            console.error(error);
            return { error }
        }
    }

    // Get all products
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            console.error('No hay datos')
            return [];
        }
    }
    
    // Get product By Id
    getProductById = async (productId) => {
        try {
            const products = await this.getProducts();
            const product = await products.find(product => product.id === +productId);
            if(!product) {
                return false;
            }
            return product;
        } catch (error) {
            console.error(error);
            return {error}
        }
    }

    // Update product
    updateProduct = async (id, values) => {
        try {
            let products = await this.getProducts();
            if(values.code) {
                const [productValue] = products.filter(prod => prod.code === values.code);
                if(productValue && productValue.id !== id) {
                    console.error(`Code ${values.code} belongs to product with id: ${productValue.id}, 2 products cannot have same code`);
                    return false;
                }
            }
            const productIdx = await products.findIndex(product => product.id === id);
            if(productIdx === -1) {
                return false;
            }
            products[productIdx] = {
                ...products[productIdx],
                ...values,
                id
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            return await this.getProductById(id);
        } catch (error) {
            console.error(error)
            return {error}
        }
    }

    // Delete product
    deleteProduct = async (productId) => {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === productId);
            if(!product) return false
            const updateProducts = await products.filter(product => product.id !== productId);
            await fs.promises.writeFile(this.path, JSON.stringify(updateProducts), 'utf-8');
            return true;
        } catch (error) {
            console.error(error)
            return {error}
        }
    }
}
const productManager = new ProductManager('./src/data/Products.json');
export default productManager;











































// thumbnail: [...thumbnail.toString()],
// thumbnail: Array.from(thumbnail).map(String),
// const isProductActive = products.some(product => product.id === productId);
// const product = await this.getProductById(productId);