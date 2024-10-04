const shoesArrayToCreate = [
  {
    name: "adidas1",
    brand: "Adidas",
    availableSizes: [7, 8, 9, 10],
    inStockSizes: [7, 8, 10],
    price: 200,
    inStock: true,
    gender: "Men",
  },
  {
    name: "adidas2",
    brand: "Adidas",
    availableSizes: [7, 8, 9, 10],
    inStockSizes: [7, 8, 10],
    price: 150,
    inStock: true,
    gender: "Woman",
  },
  {
    name: "adidas3",
    brand: "Adidas",
    availableSizes: [7, 8, 9, 10],
    inStockSizes: [7, 8, 10],
    price: 150,
    inStock: true,
    gender: "Unisex",
  },
  {
    name: "jordan1",
    brand: "Nike",
    availableSizes: [7, 8, 9, 10],
    inStockSizes: [7, 8, 10],
    price: 250,
    inStock: true,
    gender: "Woman",
  },
  {
    name: "jordan2",
    brand: "Nike",
    availableSizes: [7, 8, 9, 10],
    inStockSizes: [7, 8, 10],
    price: 250,
    inStock: true,
    gender: "Men",
  },
  {
    name: "nike1",
    brand: "Nike",
    availableSizes: [7, 8, 9, 10],
    inStockSizes: [7, 8, 10],
    price: 150,
    inStock: true,
    gender: "Unisex",
  },
];

const usersToCreate = [
  {
    name: "John Doe",
    email: `${new Date()}JohnDoe"-@example.com`,
    password: "password123",
    isAdmin: false,
  },
  {
    name: "admin",
    email: `${new Date()}admin-@example.com`,
    password: "admin123",
    isAdmin: true,
  },
];

const storeBranchesToCreate = [
  {
    name: "colman shoe Store",
    address: "המכללה למנהל ראשון לציון",
    rating: 5,
    contactNumber: "0501111111",
    openingHours: "10:00-19:00",
  },
  {
    name: "rehovot shoe Store",
    address: "רחובות",
    rating: 3,
    contactNumber: "0501111111",
    openingHours: "10:00-19:00",
  },
  {
    name: "tel-aviv shoe Store",
    address: "תל אביב",
    rating: 5,
    contactNumber: "0501111111",
    openingHours: "10:00-19:00",
  },
  {
    name: "ramat-gan shoe Store",
    address: "רמת גן",
    rating: 5,
    contactNumber: "0501111111",
    openingHours: "10:00-19:00",
  },
];

module.exports = {
  usersToCreate,
  storeBranchesToCreate,
  shoesArrayToCreate,
};
