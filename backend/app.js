import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

const SECRET_KEY = "ecommerce-secret-key";

app.use(bodyParser.json());

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization",
  );

  // ← Add this: respond immediately to preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ===================================================
   AUTHENTICATION ROUTES
=================================================== */

/* SIGNUP */
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  const usersFileContent = await fs.readFile("./data/users.json");
  const users = JSON.parse(usersFileContent);
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Math.random().toString(),
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  await fs.writeFile("./data/users.json", JSON.stringify(users));

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    message: "Signup successful",
    token,
    email,
  });
});

/* LOGIN */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const usersFileContent = await fs.readFile("./data/users.json");

  const users = JSON.parse(usersFileContent);

  const existingUser = users.find((user) => user.email === email);

  if (!existingUser) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    message: "Login successful",
    token,
    email,
  });
});

/* JWT VERIFY MIDDLEWARE */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}


/* ===================================================
   products ROUTES
=================================================== */

app.get("/products", verifyToken, async (req, res) => {
  const { search, category } = req.query;

  const eventsFileContent = await fs.readFile("./data/products.json");

  let products = JSON.parse(eventsFileContent);

  // Filter by category (skip if 'all' or not provided)
  if (category && category !== "all") {
    products = products.filter((product) => product.category === category);
  }

  // Filter by search term
  if (search) {
    products = products.filter((product) => {
      const searchableText = `
        ${product.title}
        ${product.description}
        ${product.location}
      `;

      return searchableText.toLowerCase().includes(search.toLowerCase());
    });
  }

  res.json({
    products: products.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.images,
      badge: product.badge,
      price: product.price,
      category: product.category,
      description: product.description,
    })),
  });
});

/* GET /products/favorites — get all favorited product ids for logged-in user */
app.get("/products/favorites", verifyToken, async (req, res) => {
  const favorites = await readFavorites();
  const userFavorites = favorites[req.user.email] || [];
  console.log(userFavorites);

  res.json({ favorites: userFavorites });
});

app.get("/products/images", async (req, res) => {
  const imagesFileContent = await fs.readFile("./data/images.json");

  const images = JSON.parse(imagesFileContent);

  res.json({ images });
});

app.get("/products/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const eventsFileContent = await fs.readFile("./data/products.json");

  const products = JSON.parse(eventsFileContent);

  const product = products.find((product) => product.id === id);

  if (!product) {
    return res.status(404).json({
      message: `For the id ${id}, no product could be found.`,
    });
  }

  // Attach isFavorite based on the logged-in user's favorites list
  const favorites = await readFavorites();
  const userFavs = favorites[req.user.email] || [];
  product.isFavorite = userFavs.includes(id);

  setTimeout(() => {
    res.json({ product });
  }, 1000);
});

app.post("/products", async (req, res) => {
  const { product } = req.body;

  if (!product) {
    return res.status(400).json({
      message: "product is required",
    });
  }

  if (
    !product.title?.trim() ||
    !product.description?.trim() ||
    !product.date?.trim() ||
    !product.time?.trim() ||
    !product.image?.trim() ||
    !product.location?.trim()
  ) {
    return res.status(400).json({
      message: "Invalid data provided.",
    });
  }

  const eventsFileContent = await fs.readFile("./data/products.json");

  const products = JSON.parse(eventsFileContent);

  const newEvent = {
    id: Math.round(Math.random() * 10000).toString(),

    ...product,
  };

  products.push(newEvent);

  await fs.writeFile("./data/products.json", JSON.stringify(products));

  res.json({ product: newEvent });
});

/* ===================================================
   FAVORITES ROUTES  (user-specific, JWT protected)
   Persists to ./data/favorites.json
   Schema: { "email@x.com": ["p1", "p3", ...] }
=================================================== */

/* Helper — read favorites file */
async function readFavorites() {
  try {
    const raw = await fs.readFile("./data/favorites.json");
    return JSON.parse(raw);
  } catch {
    return {}; // file missing on first run
  }
}

/* Helper — write favorites file */
async function writeFavorites(favorites) {
  await fs.writeFile(
    "./data/favorites.json",
    JSON.stringify(favorites, null, 2),
  );
}

/* POST /products/favorites — toggle a product favorite for logged-in user */
app.post("/products/favorites", verifyToken, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  const favorites = await readFavorites();
  const userFavorites = favorites[req.user.email] || [];

  const alreadyFavorited = userFavorites.includes(productId);

  // Toggle — add if not present, remove if already there
  if (alreadyFavorited) {
    favorites[req.user.email] = userFavorites.filter((id) => id !== productId);
  } else {
    favorites[req.user.email] = [...userFavorites, productId];
  }

  await writeFavorites(favorites);

  res.json({
    message: alreadyFavorited ? "Removed from favorites" : "Added to favorites",
    isFavorite: !alreadyFavorited,
    favorites: favorites[req.user.email],
  });
});

async function readCarts() {
  try {
    const raw = await fs.readFile("./data/carts.json");
    return JSON.parse(raw);
  } catch {
    return {}; // file missing on first run — start fresh
  }
}

async function writeCarts(carts) {
  await fs.writeFile("./data/carts.json", JSON.stringify(carts, null, 2));
}

/* GET /cart — fetch the logged-in user's cart */
app.get("/cart", verifyToken, async (req, res) => {
  const carts = await readCarts();
  const userCart = carts[req.user.email] || { items: [], count: 0 };
  res.json({ cart: userCart });
});

/* POST /cart — save / replace the logged-in user's full cart */
app.post("/cart", verifyToken, async (req, res) => {
  const { cart } = req.body;

  if (!cart || !Array.isArray(cart.items)) {
    return res.status(400).json({ message: "Invalid cart payload" });
  }

  const carts = await readCarts();
  carts[req.user.email] = cart;
  await writeCarts(carts);

  res.json({ message: "Cart saved", cart });
});

/* DELETE /cart — clear the logged-in user's cart */
app.delete("/cart", verifyToken, async (req, res) => {
  const carts = await readCarts();
  carts[req.user.email] = { items: [], count: 0 };
  await writeCarts(carts);
  res.json({ message: "Cart cleared" });
});

/* SERVER */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
