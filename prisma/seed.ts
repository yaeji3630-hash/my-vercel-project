import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@db:5432/deliverydb?schema=public';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear database first
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared database.');

  // Create Restaurants and menus
  await prisma.restaurant.create({
    data: {
      name: 'Delizioso Italian',
      description: 'Authentic stone-baked pizzas and fresh homemade pastas.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
      category: 'Italian',
      menuItems: {
        create: [
          {
            name: 'Margherita Pizza',
            price: 14.99,
            description: 'San Marzano tomatoes, fresh mozzarella, fresh basil, and extra virgin olive oil.',
            image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60',
          },
          {
            name: 'Spaghetti Carbonara',
            price: 16.99,
            description: 'Creamy sauce with guanciale, pecorino romano, egg yolk, and black pepper.',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60',
          },
          {
            name: 'Tiramisu',
            price: 7.99,
            description: 'Classic Italian dessert with ladyfingers, espresso, and mascarpone cream.',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
          }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: 'Burger Craft',
      description: 'Gourmet smashed burgers made from 100% premium Angus beef.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
      category: 'Burgers',
      menuItems: {
        create: [
          {
            name: 'Classic Smash Burger',
            price: 11.99,
            description: 'Two smashed patties, American cheese, pickles, onions, and house sauce on a brioche bun.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
          },
          {
            name: 'Bacon BBQ Burger',
            price: 13.99,
            description: 'Double patty, crispy bacon, cheddar, onion rings, and smoky BBQ sauce.',
            image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60',
          },
          {
            name: 'Truffle Fries',
            price: 5.99,
            description: 'Crispy golden fries tossed in white truffle oil, parmesan, and fresh parsley.',
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
          }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: 'Sakura Sushi Bar',
      description: 'Fresh sushi, sashimi, and classic Japanese ramen bowls.',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60',
      category: 'Japanese',
      menuItems: {
        create: [
          {
            name: 'Signature Sushi Platter',
            price: 24.99,
            description: 'Chef\'s selection of 8 pieces of nigiri and a spicy tuna roll.',
            image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60',
          },
          {
            name: 'Tonkotsu Ramen',
            price: 15.99,
            description: 'Rich pork bone broth, chashu pork, soft boiled egg, nori, and scallions.',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
          }
        ]
      }
    }
  });

  console.log('Database seeded with restaurants and menu items.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
