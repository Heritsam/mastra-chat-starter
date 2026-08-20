import { db } from "./index";
import { customers, products, sales } from "./schema";

const categories = [
  "Outerwear",
  "Tops",
  "Bottoms",
  "Footwear",
  "Accessories",
] as const;

const productNamesByCategory: Record<(typeof categories)[number], string[]> = {
  Outerwear: [
    "Denim Trucker Jacket",
    "Quilted Puffer Coat",
    "Wool Peacoat",
    "Rain Shell Jacket",
    "Fleece-Lined Parka",
  ],
  Tops: [
    "Essential Crewneck Tee",
    "Oxford Button-Down Shirt",
    "Merino Wool Sweater",
    "Graphic Hoodie",
    "Linen Short-Sleeve Shirt",
  ],
  Bottoms: [
    "Slim Straight Jeans",
    "Tapered Chinos",
    "Wide-Leg Trousers",
    "Cargo Joggers",
    "Pleated Midi Skirt",
  ],
  Footwear: [
    "Canvas Low-Top Sneakers",
    "Leather Chelsea Boots",
    "Trail Running Shoes",
    "Suede Desert Boots",
  ],
  Accessories: [
    "Leather Belt",
    "Wool Beanie",
    "Canvas Tote Bag",
    "Silk Scarf",
    "Aviator Sunglasses",
  ],
};

const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
] as const;

const firstNames = [
  "Ava",
  "Liam",
  "Mia",
  "Noah",
  "Ella",
  "Lucas",
  "Zoe",
  "Ethan",
  "Grace",
  "Owen",
  "Chloe",
  "Mason",
  "Layla",
  "Leo",
  "Nora",
  "Kai",
];
const lastNames = [
  "Bennett",
  "Carter",
  "Diaz",
  "Foster",
  "Gray",
  "Hayes",
  "Ibrahim",
  "Jansen",
  "Kim",
  "Lopez",
  "Moreau",
  "Nakamura",
  "Ortiz",
  "Patel",
  "Quinn",
  "Reyes",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]): T {
  const item = items[randomInt(0, items.length - 1)];
  if (item === undefined) {
    throw new Error("pick() called on an empty array");
  }
  return item;
}

function randomDateWithinLastYear() {
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const offset = randomInt(0, oneYearMs);
  return new Date(Date.now() - offset);
}

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(sales);
  await db.delete(customers);
  await db.delete(products);

  console.log("Seeding products...");
  const productRows = categories.flatMap((category) =>
    productNamesByCategory[category].map((name) => ({
      name,
      category,
      price: (randomInt(1500, 24000) / 100).toFixed(2),
    })),
  );
  const insertedProducts = await db
    .insert(products)
    .values(productRows)
    .returning();

  console.log("Seeding customers...");
  const customerRows = Array.from({ length: 80 }, (_, index) => {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`,
      region: pick(regions),
      signupDate: randomDateWithinLastYear(),
    };
  });
  const insertedCustomers = await db
    .insert(customers)
    .values(customerRows)
    .returning();

  console.log("Seeding sales...");
  const saleRows = Array.from({ length: 900 }, () => {
    const product = pick(insertedProducts);
    const customer = pick(insertedCustomers);
    const quantity = randomInt(1, 4);
    const unitPrice = product.price;
    const revenue = (Number(unitPrice) * quantity).toFixed(2);

    return {
      productId: product.id,
      customerId: customer.id,
      quantity,
      unitPrice,
      revenue,
      region: customer.region,
      saleDate: randomDateWithinLastYear(),
    };
  });
  await db.insert(sales).values(saleRows);

  console.log(
    `Seeded ${insertedProducts.length} products, ${insertedCustomers.length} customers, ${saleRows.length} sales.`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
