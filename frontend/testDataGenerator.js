const axios = require('axios');

// Base API URL
const BASE_URL = 'http://localhost:5001';

// Create a user with hardcoded data
async function createUser() {
    const user = {
        name: "John Doe",
        email: `${new Date()}-@example.com`,
        password: "password123",
        isAdmin: false
    };

    try {
        const response = await axios.post(`${BASE_URL}/api/users`, user);
        console.log('Created User:', response.data);
        return response.data;  // Return created user
    } catch (error) {
        console.log({error})
        console.error('Error creating user:', error.response ? error.response.data : error.message);
    }
}

// Create a shoe with hardcoded data
async function createShoe() {
    const shoe = {
        name: "Air Max",
        brand: "Nike",
        availableSizes: [7, 8, 9, 10],
        inStockSizes: [7, 8, 10],
        price: 150,
        inStock: true
    };

    try {
        const response = await axios.post(`${BASE_URL}/api/shoes`, shoe);
        console.log('Created Shoe:', response.data);
        return response.data;  // Return created shoe
    } catch (error) {
        console.error('Error creating shoe:', error.response ? error.response.data : error.message);
    }
}

// Add shoe to user's cart
async function addToCart(userId, shoeId) {
    const cartItem = {
        userId: userId,
        shoeId: shoeId,
        quantity: 2
    };

    try {
        const response = await axios.post(`${BASE_URL}/api/cart`, cartItem);
        console.log('Added to Cart:', response.data);
        return response.data;  // Return cart item
    } catch (error) {
        console.error('Error adding to cart:', error.response ? error.response.data : error.message);
    }
}

// Create an order with hardcoded data
async function createOrder(userId, cartItems) {
    const order = {
        userId: userId,
        items: cartItems.map(item => ({
            shoe: item.shoe,
            quantity: item.quantity
        })),
        total: 300
    };
    console.log({order})
    try {
        const response = await axios.post(`${BASE_URL}/api/orders`, order);
        console.log('Created Order:', response.data);
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
    }
}

// Main function to run the process
async function runTests() {
    // Step 1: Create user
    const user = await createUser();
    console.log({user})
    if (!user) return;

    // Step 2: Create shoes
    const shoe1 = await createShoe();
    const shoe2 = await createShoe();

    if (!shoe1 || !shoe2) return;

    // Step 3: Add shoes to cart
    const cartItem1 = await addToCart(user._id, shoe1._id);
    const cartItem2 = await addToCart(user._id, shoe2._id);

    if (!cartItem1 || !cartItem2) return;

    // Step 4: Create order
    await createOrder(user._id, [...cartItem1.items , ...cartItem2.items]);

    console.log('Test data generation completed successfully.');
}

runTests().catch(error => console.error('Error in runTests:', error));