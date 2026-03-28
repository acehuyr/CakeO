require('dotenv').config();
const mongoose = require('mongoose');
const Cake = require('../models/Cake');

const cakes = [
  // ═══ CHOCOLATE ═══
  {
    name: "Chocolate Truffle Cake",
    description: "Rich, indulgent chocolate truffle cake layered with velvety ganache, premium Belgian chocolate curls, and silky dark chocolate mousse. A true celebration of pure chocolate bliss.",
    price: 849, category: "Chocolate", rating: 4.8, reviewCount: 234,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    sizes: { small: 849, medium: 1249, large: 1649 },
    flavors: ["Classic Chocolate", "Dark Chocolate", "Milk Chocolate"],
    badge: "Bestseller", badgeColor: "badge-amber", prepTime: "2–3 hrs", calories: "420 kcal/slice"
  },
  {
    name: "KitKat Chocolate Cake",
    description: "Instagram-worthy KitKat-wrapped chocolate masterpiece filled with Kinder Bueno, crushed M&Ms, and chocolate ganache. The ultimate chocolate lover's dream.",
    price: 1199, category: "Chocolate", rating: 4.9, reviewCount: 278,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80",
    sizes: { small: 1199, medium: 1699, large: 2199 },
    flavors: ["KitKat & M&Ms", "KitKat & Kinder", "Triple KitKat"],
    badge: "Trending", badgeColor: "badge-purple", prepTime: "4–5 hrs", calories: "520 kcal/slice"
  },
  {
    name: "Oreo Chocolate Cake",
    description: "Decadent layers of moist chocolate sponge and Oreo cream filling, topped with crushed Oreo cookies and a glossy chocolate mirror glaze.",
    price: 899, category: "Chocolate", rating: 4.7, reviewCount: 198,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80",
    sizes: { small: 899, medium: 1349, large: 1799 },
    flavors: ["Classic Oreo", "Double Oreo", "Oreo & Nutella"],
    badge: "", badgeColor: "", prepTime: "3–4 hrs", calories: "480 kcal/slice"
  },
  {
    name: "Ferrero Rocher Cake",
    description: "Luxurious hazelnut chocolate cake inspired by the iconic chocolate. Layers of Nutella, crushed hazelnuts, and whole Ferrero Rocher on top.",
    price: 1399, category: "Chocolate", rating: 4.9, reviewCount: 312,
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80",
    sizes: { small: 1399, medium: 1899, large: 2499 },
    flavors: ["Classic Hazelnut", "Dark Hazelnut", "White Hazelnut"],
    badge: "Premium", badgeColor: "badge-amber", prepTime: "4–5 hrs", calories: "510 kcal/slice"
  },
  {
    name: "Molten Lava Cake",
    description: "Warm, gooey chocolate fondant with a river of melted chocolate flowing from the center. Served with a dusting of cocoa and vanilla ice cream.",
    price: 649, category: "Chocolate", rating: 4.6, reviewCount: 167,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80",
    sizes: { small: 649, medium: 999, large: 1349 },
    flavors: ["Dark Chocolate", "White Chocolate", "Salted Caramel"],
    badge: "Hot", badgeColor: "badge-red", prepTime: "1–2 hrs", calories: "460 kcal/slice"
  },

  // ═══ CLASSIC ═══
  {
    name: "Red Velvet Cake",
    description: "Velvety crimson layers drenched in luxurious cream cheese frosting. A classic Southern masterpiece that's as stunning as it is irresistibly delicious.",
    price: 799, category: "Classic", rating: 4.9, reviewCount: 189,
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=80",
    sizes: { small: 799, medium: 1199, large: 1599 },
    flavors: ["Original Red Velvet", "Cream Cheese Extra", "Vanilla Swirl"],
    badge: "Fan Favorite", badgeColor: "badge-red", prepTime: "2–3 hrs", calories: "380 kcal/slice"
  },
  {
    name: "Vanilla Bean Cake",
    description: "Light and fluffy Madagascar vanilla sponge with real vanilla bean frosting. Simple elegance that lets pure vanilla flavour shine through.",
    price: 599, category: "Classic", rating: 4.5, reviewCount: 145,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80",
    sizes: { small: 599, medium: 949, large: 1299 },
    flavors: ["Classic Vanilla", "French Vanilla", "Vanilla & Caramel"],
    badge: "", badgeColor: "", prepTime: "2–3 hrs", calories: "320 kcal/slice"
  },
  {
    name: "Tiramisu Cake",
    description: "Elegant Italian-inspired layers of espresso-soaked sponge, mascarpone cream, and dusted cocoa. A sophisticated coffee lover's fantasy.",
    price: 999, category: "Classic", rating: 4.8, reviewCount: 203,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    sizes: { small: 999, medium: 1449, large: 1899 },
    flavors: ["Classic Espresso", "Baileys Infused", "Matcha Tiramisu"],
    badge: "Chef's Pick", badgeColor: "badge-purple", prepTime: "4–5 hrs", calories: "400 kcal/slice"
  },
  {
    name: "Coffee Walnut Cake",
    description: "Aromatic coffee-infused sponge studded with toasted walnuts and topped with coffee buttercream. A perfect afternoon tea companion.",
    price: 749, category: "Classic", rating: 4.6, reviewCount: 128,
    image: "https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=600&q=80",
    sizes: { small: 749, medium: 1149, large: 1549 },
    flavors: ["Espresso Walnut", "Mocha Walnut", "Cappuccino"],
    badge: "", badgeColor: "", prepTime: "2–3 hrs", calories: "410 kcal/slice"
  },

  // ═══ FRUIT ═══
  {
    name: "Black Forest Cake",
    description: "Layers of moist chocolate sponge, airy whipped cream, and Morello cherries soaked in Kirsch. A timeless German classic reimagined with premium ingredients.",
    price: 899, category: "Fruit", rating: 4.7, reviewCount: 156,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80",
    sizes: { small: 899, medium: 1349, large: 1749 },
    flavors: ["Original", "Extra Cherry", "Dark Chocolate"],
    badge: "", badgeColor: "", prepTime: "3–4 hrs", calories: "390 kcal/slice"
  },
  {
    name: "Pineapple Cake",
    description: "Tropical pineapple cake with fresh cream, glazed pineapple rings, and a hint of coconut. Light, refreshing, and utterly tropical — summer in a slice.",
    price: 699, category: "Fruit", rating: 4.5, reviewCount: 98,
    image: "https://images.unsplash.com/photo-1490323914169-4b5120a43753?w=600&q=80",
    sizes: { small: 699, medium: 1099, large: 1449 },
    flavors: ["Fresh Pineapple", "Coconut Pineapple", "Vanilla Pineapple"],
    badge: "New", badgeColor: "badge-green", prepTime: "2–3 hrs", calories: "310 kcal/slice"
  },
  {
    name: "Fruit Overload Cake",
    description: "Fresh seasonal berries piled high on a vanilla cream sponge with mango coulis. Bursting with natural color, flavor, and wholesome goodness.",
    price: 999, category: "Fruit", rating: 4.7, reviewCount: 143,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    sizes: { small: 999, medium: 1499, large: 1999 },
    flavors: ["Mixed Berries", "Tropical Medley", "Classic Fruit"],
    badge: "Healthy Pick", badgeColor: "badge-green", prepTime: "3–4 hrs", calories: "290 kcal/slice"
  },
  {
    name: "Strawberry Shortcake",
    description: "Layers of fluffy vanilla sponge, fresh whipped cream, and juicy sliced strawberries. A timeless classic that tastes like summer sunshine.",
    price: 799, category: "Fruit", rating: 4.8, reviewCount: 215,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    sizes: { small: 799, medium: 1199, large: 1599 },
    flavors: ["Classic Strawberry", "Strawberry & Cream", "Double Berry"],
    badge: "Popular", badgeColor: "badge-red", prepTime: "2–3 hrs", calories: "330 kcal/slice"
  },
  {
    name: "Mango Mousse Cake",
    description: "Silky Alphonso mango mousse on a vanilla sponge base, topped with fresh mango and a mirror glaze. A tropical masterpiece celebrating India's king of fruits.",
    price: 949, category: "Fruit", rating: 4.8, reviewCount: 176,
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&q=80",
    sizes: { small: 949, medium: 1399, large: 1849 },
    flavors: ["Alphonso Mango", "Mango & Passion Fruit", "Coconut Mango"],
    badge: "Seasonal", badgeColor: "badge-amber", prepTime: "4–5 hrs", calories: "280 kcal/slice"
  },
  {
    name: "Blueberry Cheesecake",
    description: "Creamy New York-style cheesecake with a buttery biscuit base and a generous blueberry compote topping. Rich, tangy, and utterly luxurious.",
    price: 1099, category: "Fruit", rating: 4.9, reviewCount: 267,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
    sizes: { small: 1099, medium: 1549, large: 2049 },
    flavors: ["Classic Blueberry", "Mixed Berry", "Lemon Blueberry"],
    badge: "Top Rated", badgeColor: "badge-purple", prepTime: "5–6 hrs", calories: "450 kcal/slice"
  },
  {
    name: "Lemon Zest Cake",
    description: "Bright and zingy lemon sponge with lemon curd filling and a tangy cream cheese frosting. A burst of citrus sunshine in every bite.",
    price: 699, category: "Fruit", rating: 4.5, reviewCount: 92,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&q=80",
    sizes: { small: 699, medium: 1049, large: 1399 },
    flavors: ["Classic Lemon", "Lemon & Elderflower", "Lemon Meringue"],
    badge: "", badgeColor: "", prepTime: "2–3 hrs", calories: "300 kcal/slice"
  },

  // ═══ CARAMEL ═══
  {
    name: "Butterscotch Cake",
    description: "Golden caramel butterscotch cake with praline crunch layers and salted caramel drizzle. Sweet, buttery perfection that melts on your tongue.",
    price: 749, category: "Caramel", rating: 4.6, reviewCount: 112,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
    sizes: { small: 749, medium: 1149, large: 1549 },
    flavors: ["Classic Butterscotch", "Salted Caramel", "Toffee Crunch"],
    badge: "", badgeColor: "", prepTime: "2–3 hrs", calories: "445 kcal/slice"
  },
  {
    name: "Salted Caramel Drip Cake",
    description: "Decadent caramel cake with a dramatic salted caramel drip, crushed toffee, and golden caramel shards. A showstopper that's impossibly delicious.",
    price: 1049, category: "Caramel", rating: 4.8, reviewCount: 189,
    image: "https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=600&q=80",
    sizes: { small: 1049, medium: 1499, large: 1999 },
    flavors: ["Salted Caramel", "Caramel Pecan", "Toffee Apple Caramel"],
    badge: "Trending", badgeColor: "badge-amber", prepTime: "3–4 hrs", calories: "470 kcal/slice"
  },

  // ═══ FUSION / INDIAN ═══
  {
    name: "Rasmalai Cake",
    description: "A beautiful fusion of the beloved Indian dessert and modern cake craft. Saffron-cardamom sponge soaked in sweetened milk, topped with pistachios and rose petals.",
    price: 1099, category: "Fusion", rating: 4.9, reviewCount: 245,
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=600&q=80",
    sizes: { small: 1099, medium: 1599, large: 2099 },
    flavors: ["Classic Rasmalai", "Kesar Pista", "Rose Saffron"],
    badge: "Indian Fusion", badgeColor: "badge-amber", prepTime: "4–5 hrs", calories: "380 kcal/slice"
  },
  {
    name: "Coconut Cream Cake",
    description: "Tropical coconut sponge with layers of whipped coconut cream and toasted coconut flakes. A paradise island captured in cake form.",
    price: 799, category: "Fusion", rating: 4.5, reviewCount: 104,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80",
    sizes: { small: 799, medium: 1199, large: 1599 },
    flavors: ["Classic Coconut", "Coconut & Lime", "Tropical Coconut"],
    badge: "", badgeColor: "", prepTime: "3–4 hrs", calories: "350 kcal/slice"
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Cake.deleteMany({});
    console.log('Cleared existing cakes');
    await Cake.insertMany(cakes);
    console.log(`Seeded ${cakes.length} cakes`);
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
