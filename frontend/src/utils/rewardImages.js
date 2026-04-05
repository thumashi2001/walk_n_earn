/**
 * Maps reward wording → real Unsplash photos. Order matters: more specific phrases first.
 * Matching uses title + description (lowercased, punctuation stripped).
 */
const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

/** @type {{ phrases: string[]; src: string }[]} */
const KEYWORD_IMAGE_RULES = [
  // Bakery & sweets (specific → general)
  {
    phrases: [
      "chocolate muffin",
      "choco muffin",
      "double chocolate muffin",
      "muffin chocolate",
    ],
    src: u("photo-1607955660811-2db0f4777ac5"), // chocolate muffins / baked goods
  },
  {
    phrases: ["blueberry muffin", "berry muffin"],
    src: u("photo-1626082927389-6cd097cdc6fc"), // muffins with berries
  },
  {
    phrases: ["muffin", "cupcake"],
    src: u("photo-1614707267537-ab85c35d1592"), // muffins on rack
  },
  {
    phrases: ["donut", "doughnut", "cronut"],
    src: u("photo-1551024601-bec78aea704b"), // donuts
  },
  {
    phrases: ["croissant", "pain au chocolat", "pastry"],
    src: u("photo-1555507036-ab1f4038808a"), // croissants
  },
  {
    phrases: ["bagel"],
    src: u("photo-1585856881846-6f813f0a0c0e"), // bagels
  },
  {
    phrases: ["cookie", "biscuit", "oreo"],
    src: u("photo-1499636136210-6f4ee915583e"), // cookies
  },
  {
    phrases: ["brownie"],
    src: u("photo-1607920591413-4ec007e7007a"), // brownies
  },
  {
    phrases: ["birthday cake", "layer cake", "cheesecake", "red velvet"],
    src: u("photo-1464349095431-e9a21285b5f3"), // cake
  },
  {
    phrases: ["cake", "slice of cake"],
    src: u("photo-1578985545062-69928b1d9587"), // chocolate cake
  },
  {
    phrases: ["pancake", "waffle", "crepe"],
    src: u("photo-1528207776546-365bb710ee93"), // pancakes
  },
  {
    phrases: ["tart", "pie", "apple pie"],
    src: u("photo-1535920527002-b35e96722eb9"), // pie
  },
  {
    phrases: ["bread", "sourdough", "baguette", "bakery loaf"],
    src: u("photo-1509440159596-0249088772ff"), // bread
  },
  {
    phrases: ["ice cream", "gelato", "sundae"],
    src: u("photo-1563805042-7684c019e1cb"), // ice cream
  },
  {
    phrases: ["chocolate bar", "candy bar", "truffle praline"],
    src: u("photo-1481391319762-47eadfd43714"), // chocolate pieces
  },
  {
    phrases: ["chocolate", "cacao", "hot cocoa"],
    src: u("photo-1511381939415-e44015466834"), // chocolate / cocoa
  },
  {
    phrases: ["candy", "lollipop", "gummies", "sweet treat"],
    src: u("photo-1582058091505-f87a2e55a40f"), // candy
  },
  {
    phrases: ["popcorn"],
    src: u("photo-1578849278619-e73505e9610f"), // popcorn
  },

  // Drinks
  {
    phrases: ["bubble tea", "boba", "milk tea"],
    src: u("photo-1556679343-c7306c1976bc"), // bubble tea
  },
  {
    phrases: ["smoothie", "milkshake", "frappe"],
    src: u("photo-1553530666-ba11a7da3888"), // smoothie
  },
  {
    phrases: ["juice", "orange juice", "fresh juice"],
    src: u("photo-1622597467836-f3285f2131b8"), // juice
  },
  {
    phrases: ["matcha", "green tea latte"],
    src: u("photo-1515825838458-f2a294b11507"), // matcha
  },
  {
    phrases: ["tea", "chai", "earl grey"],
    src: u("photo-1556679343-c130063008f5"), // tea
  },
  {
    phrases: ["latte", "cappuccino", "espresso", "americano", "macchiato", "mocha"],
    src: u("photo-1461023058943-07fcbe16d735"), // latte art
  },
  {
    phrases: ["coffee", "cold brew", "frappuccino"],
    src: u("photo-1497935586351-b67a49e012bf"), // coffee cup
  },
  {
    phrases: ["wine", "red wine", "white wine"],
    src: u("photo-1510812431401-41d2bd2722f3"), // wine
  },
  {
    phrases: ["beer", "craft beer", "lager"],
    src: u("photo-1535958637004-021a48b3e7a3"), // beer
  },
  {
    phrases: ["cocktail", "mocktail", "mojito"],
    src: u("photo-1514362545857-3bc16c4c7d1b"), // cocktails
  },
  {
    phrases: ["water bottle", "hydration", "mineral water"],
    src: u("photo-1523362628745-0c100150b504"), // water bottle
  },

  // Meals
  {
    phrases: ["pizza", "margherita", "pepperoni pizza"],
    src: u("photo-1513104890138-7c749659a591"), // pizza
  },
  {
    phrases: ["burger", "hamburger", "cheeseburger", "fries and burger"],
    src: u("photo-1568901346375-23c9450c58cd"), // burger
  },
  {
    phrases: ["sandwich", "sub", "panini", "club sandwich"],
    src: u("photo-1528735602780-2552fd46c7af"), // sandwich
  },
  {
    phrases: ["sushi", "sashimi", "maki", "nigiri"],
    src: u("photo-1579584425555-c3ce17fd4351"), // sushi
  },
  {
    phrases: ["ramen", "noodle soup", "pho", "udon"],
    src: u("photo-1569718212165-3a8278d5f624"), // ramen
  },
  {
    phrases: ["pasta", "spaghetti", "carbonara", "lasagna"],
    src: u("photo-1621996346565-e3dbc646d9a9"), // pasta
  },
  {
    phrases: ["taco", "burrito", "quesadilla", "nachos"],
    src: u("photo-1565299585323-38d6b0865b47"), // tacos
  },
  {
    phrases: ["salad", "caesar salad", "greek salad"],
    src: u("photo-1512621776951-a57141f2eefd"), // salad bowl
  },
  {
    phrases: ["steak", "bbq", "barbecue", "ribs"],
    src: u("photo-1544025162-d76694265947"), // steak / bbq
  },
  {
    phrases: ["fried chicken", "chicken wings", "nuggets"],
    src: u("photo-1587593812448-88b09c74a18e"), // fried / grilled chicken
  },
  {
    phrases: ["soup", "stew", "curry"],
    src: u("photo-1547592166-23ac45744acd"), // soup
  },

  // Fruit & health
  {
    phrases: ["fruit basket", "fresh fruit", "apple", "banana", "berries"],
    src: u("photo-1610832958506-aa56368176cf"), // fruit
  },

  // Shopping & vouchers
  {
    phrases: ["gift card", "voucher", "coupon", "discount code"],
    src: u("photo-1549465220-1a8b9238cd48"), // gift / gold ribbon
  },
  {
    phrases: ["shopping", "retail", "mall", "amazon", "supermarket", "grocery"],
    src: u("photo-1607082348824-0a96f2a4b9da"), // shopping bags
  },

  // Fitness & lifestyle
  {
    phrases: ["yoga", "pilates", "meditation"],
    src: u("photo-1544367567-0f2fcb009e0b"), // yoga
  },
  {
    phrases: ["gym", "dumbbell", "weights", "workout", "fitness pass"],
    src: u("photo-1534438327276-14e5300c3a48"), // gym
  },
  {
    phrases: ["running shoes", "sneakers", "trainers", "nike", "adidas"],
    src: u("photo-1542291026-7eec264c27ff"), // sneakers
  },
  {
    phrases: ["bike", "bicycle", "cycling"],
    src: u("photo-1485965120184-e220f721d03e"), // bicycle
  },

  // Tech & media
  {
    phrases: ["headphones", "earbuds", "airpods", "audio"],
    src: u("photo-1505740420928-5e560c06d30e"), // headphones
  },
  {
    phrases: ["watch", "smartwatch", "fitness tracker"],
    src: u("photo-1523275335684-37898b6baf30"), // watch
  },
  {
    phrases: ["phone", "smartphone", "iphone", "android"],
    src: u("photo-1511707171634-5f897ff02aa9"), // phone
  },
  {
    phrases: ["laptop", "macbook", "notebook pc"],
    src: u("photo-1496181133206-80ce9b88a853"), // laptop
  },
  {
    phrases: ["book", "novel", "ebook", "kindle"],
    src: u("photo-1544947950-fa07a98d237f"), // books
  },
  {
    phrases: ["movie", "cinema", "theater ticket", "streaming"],
    src: u("photo-1489599849927-2ee91cede3ba"), // cinema
  },

  // Other common rewards
  {
    phrases: ["spa", "massage", "facial", "wellness"],
    src: u("photo-1544161515-4ab6ce6db874"), // spa
  },
  {
    phrases: ["haircut", "salon", "barber"],
    src: u("photo-1560066984-138dadb4c035"), // salon
  },
  {
    phrases: ["flowers", "bouquet", "rose"],
    src: u("photo-1455659817273-f96807779a38"), // flowers
  },
  {
    phrases: ["perfume", "fragrance", "cologne"],
    src: u("photo-1541643600914-78b084683601"), // perfume
  },
  {
    phrases: ["sunglasses", "shades"],
    src: u("photo-1572635196237-14b3f281503f"), // sunglasses
  },
  {
    phrases: ["backpack", "bag", "tote"],
    src: u("photo-1553062407-98eeb64c6a62"), // backpack
  },
  {
    phrases: ["parking", "car wash"],
    src: u("photo-1489827904987-27c8b002ddd5"), // car / parking vibe
  },
  {
    phrases: ["fuel", "petrol", "gas station"],
    src: u("photo-1581464955967-95d02b5b8295"), // fuel pump
  },
  {
    phrases: ["uber", "taxi", "ride credit", "lyft"],
    src: u("photo-1449965408869-eaa3f722e40d"), // car interior / ride
  },
];

const FALLBACK_STOCK = [
  u("photo-1513885535751-8b9238bd345a"),
  u("photo-1554224155-6726b3ff858f"),
  u("photo-1476480862126-209bfaa8edc8"),
  u("photo-1526170375885-4d8ecf77b99f"),
  u("photo-1606107557195-0e29a4b5b4aa"),
];

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stableIndex(seed) {
  let h = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % FALLBACK_STOCK.length;
}

/**
 * Pick an image URL from reward name/description, or a stable fallback.
 * @param {{ _id?: string; title?: string; description?: string; image?: string }} reward
 * @returns {string}
 */
export function getRewardImageUrl(reward) {
  const custom = reward.image?.trim();
  if (custom) return custom;

  const haystack = normalizeText(
    `${reward.title || ""} ${reward.description || ""}`
  );
  if (haystack) {
    for (const rule of KEYWORD_IMAGE_RULES) {
      for (const phrase of rule.phrases) {
        const p = normalizeText(phrase).replace(/\s+/g, " ");
        if (p && haystack.includes(p)) return rule.src;
      }
    }
  }

  const seed = reward._id ?? reward.title ?? "default";
  return FALLBACK_STOCK[stableIndex(seed)];
}
