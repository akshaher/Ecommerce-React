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

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

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
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  await fs.writeFile("./data/users.json", JSON.stringify(users));

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    message: "Signup successful",
    token,
    email,
    username
  });
});


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
    username: existingUser.username
  });
});

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



app.get("/products", verifyToken, async (req, res) => {
  const { search, category, page, limit = 5 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const eventsFileContent = await fs.readFile("./data/products.json");

  let products = JSON.parse(eventsFileContent);

  // Filter by category (skip if 'all' )
  if (category && category !== "all") {
    products = products.filter((product) => product.category === category);
  }

  // Filter by search term
  if (search) {
    products = products.filter((product) => {
      const searchableText = `
        ${product.title}
        ${product.description}
      `;

      return searchableText.toLowerCase().includes(search.toLowerCase());
    });
  }

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;


  if(page){
  const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
    products: paginatedProducts.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.images,
      badge: product.badge,
      price: product.price,
      category: product.category,
      description: product.description,
    })),
    totalProducts,
    totalPages,
    currentPage: pageNum,
  });
  }else{
    const paginatedProducts = products;
      res.json({
    products: paginatedProducts.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.images,
      badge: product.badge,
      price: product.price,
      category: product.category,
      description: product.description,
    }))
  });
  }




});

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


app.get("/cart", verifyToken, async (req, res) => {
  const carts = await readCarts();
  const userCart = carts[req.user.email] || { items: [], count: 0 };
  res.json({ cart: userCart });
});

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

app.delete("/cart", verifyToken, async (req, res) => {
  const carts = await readCarts();
  carts[req.user.email] = { items: [], count: 0 };
  await writeCarts(carts);
  res.json({ message: "Cart cleared" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
