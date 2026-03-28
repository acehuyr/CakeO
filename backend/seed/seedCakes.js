const mongoose = require('mongoose');
const Cake = require('../models/Cake');
require('dotenv').config();

const CAKES = [
  { name: "Chocolate Truffle Cake", price: 849, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", description: "Rich, indulgent chocolate truffle cake layered with velvety ganache, premium Belgian chocolate curls, and silky dark chocolate mousse. A true celebration of pure chocolate bliss.", category: "Chocolate", rating: 4.8, reviewCount: 234, sizes: { small: 849, medium: 1249, large: 1649 }, flavors: ["Classic Chocolate", "Dark Chocolate", "Milk Chocolate"], badge: "Bestseller", badgeColor: "badge-amber", prepTime: "2–3 hrs", calories: "420 kcal/slice" },
  { name: "Red Velvet Cake", price: 799, image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80", description: "Velvety crimson layers drenched in luxurious cream cheese frosting. A classic Southern masterpiece that's as stunning as it is irresistibly delicious.", category: "Classic", rating: 4.9, reviewCount: 189, sizes: { small: 799, medium: 1199, large: 1599 }, flavors: ["Original Red Velvet", "Cream Cheese Extra", "Vanilla Swirl"], badge: "Fan Favorite", badgeColor: "badge-red", prepTime: "2–3 hrs", calories: "380 kcal/slice" },
  { name: "Black Forest Cake", price: 899, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80", description: "Layers of moist chocolate sponge, airy whipped cream, and Morello cherries soaked in Kirsch. A timeless German classic reimagined with premium ingredients.", category: "Fruit", rating: 4.7, reviewCount: 156, sizes: { small: 899, medium: 1349, large: 1749 }, flavors: ["Original", "Extra Cherry", "Dark Chocolate"], prepTime: "3–4 hrs", calories: "390 kcal/slice" },
  { name: "Butterscotch Cake", price: 749, image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80", description: "Golden caramel butterscotch cake with praline crunch layers and salted caramel drizzle. Sweet, buttery perfection that melts on your tongue.", category: "Caramel", rating: 4.6, reviewCount: 112, sizes: { small: 749, medium: 1149, large: 1549 }, flavors: ["Classic Butterscotch", "Salted Caramel", "Toffee Crunch"], prepTime: "2–3 hrs", calories: "445 kcal/slice" },
  { name: "Pineapple Cake", price: 699, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80", description: "Tropical pineapple cake with fresh cream, glazed pineapple rings, and a hint of coconut. Light, refreshing, and utterly tropical — summer in a slice.", category: "Fruit", rating: 4.5, reviewCount: 98, sizes: { small: 699, medium: 1099, large: 1449 }, flavors: ["Fresh Pineapple", "Coconut Pineapple", "Vanilla Pineapple"], badge: "New", badgeColor: "badge-green", prepTime: "2–3 hrs", calories: "310 kcal/slice" },
  { name: "KitKat Chocolate Cake", price: 1199, image: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=600&q=80", description: "Instagram-worthy KitKat-wrapped chocolate masterpiece filled with Kinder Bueno, crushed M&Ms, and chocolate ganache. The ultimate chocolate lover's dream.", category: "Chocolate", rating: 4.9, reviewCount: 278, sizes: { small: 1199, medium: 1699, large: 2199 }, flavors: ["KitKat & M&Ms", "KitKat & Kinder", "Triple KitKat"], badge: "Trending", badgeColor: "badge-purple", prepTime: "4–5 hrs", calories: "520 kcal/slice" },
  { name: "Fruit Overload Cake", price: 999, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80", description: "Fresh seasonal berries piled high on a vanilla cream sponge with mango coulis. Bursting with natural color, flavor, and wholesome goodness.", category: "Fruit", rating: 4.7, reviewCount: 143, sizes: { small: 999, medium: 1499, large: 1999 }, flavors: ["Mixed Berries", "Tropical Medley", "Classic Fruit"], badge: "Healthy Pick", badgeColor: "badge-green", prepTime: "3–4 hrs", calories: "290 kcal/slice" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await Cake.deleteMany({});
    console.log('Cleared existing cakes');

    await Cake.insertMany(CAKES);
    console.log('Seeded cakes array');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
