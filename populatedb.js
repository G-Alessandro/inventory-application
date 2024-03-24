#! /usr/bin/env node

console.log(
  'This script populates some test items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');

const Item = require('./models/item');

const items = [];

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function itemCreate(index, category, name, author, genre, details) {
  const itemdetail = {
    category,
    name,
    image: {
      name: 'inventory-app-cover',
      imageUrl: 'https://res.cloudinary.com/duov43vlh/image/upload/w_300,h_300/w_300,h_300/v1710789330/inventoryApp/y2j4xt2ujnrnnz8nuqmt.svg',
      publicId: 'inventoryApp/y2j4xt2ujnrnnz8nuqmt',
    },
    author,
    genre,
    details,
  };

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${category}-${name}`);
}

async function createItems() {
  console.log('Adding Items');
  await Promise.all([
    itemCreate(0, 'films', 'The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', ['fantasy', 'adventure'], 'A young hobbit and a varied group, made up of humans, a dwarf, an elf and other hobbits, set off on a delicate mission, led by the powerful wizard Gandalf. They must destroy a magical ring and thus defeat the evil Sauron.'),
    itemCreate(1, 'films', 'The Lord of the Rings: The Two Towers', 'Peter Jackson', ['fantasy', 'adventure'], 'The now separated members of the Fellowship of the Ring follow different paths as they attempt to destroy the ring and defeat Sauron.'),
    itemCreate(2, 'films', 'The Lord of the Rings: The Return of the King', 'Peter Jackson', ['fantasy', 'adventure'], 'While Frodo and Sam, accompanied by Gollum, continue their journey towards Mount Doom to destroy the ring, the rest of the company rushes to the aid of Rohan and Gondor, engaged in the battle of the Pellenor Fields.'),
    itemCreate(3, 'tv series', 'Star Trek: Deep Space Nine', ['Rick Berman', 'Michael Piller'], 'science fiction', 'Commander Sisko has been assigned to the remote Starfleet outpost, space station Deep Space 9, where he has to oversee the recovery of the Bajoran people who are at the tail end of a lengthy war with a neighbouring race called The Cardassians.'),
    itemCreate(4, 'tv series', 'Star Trek: Voyager', ['Rick Berman', 'Michael Piller', 'Jeri Taylor'], 'science fiction', 'Pulled to the far side of the galaxy, where the Federation is seventy-five years away at maximum warp speed, a Starfleet ship must cooperate with Maquis rebels to find a way home.'),
    itemCreate(5, 'books', 'The Lord of the Rings', 'John Ronald Reuel Tolkien', ['high fantasy', 'adventure'], 'The title refers to the story|'s main antagonist, Sauron, the Dark Lord who in an earlier age created the One Ring to rule the other Rings of Power given to Men, Dwarves, and Elves, in his campaign to conquer all of Middle-earth. From homely beginnings in the Shire, a hobbit land reminiscent of the English countryside, the story ranges across Middle-earth, following the quest to destroy the One Ring, seen mainly through the eyes of the hobbits Frodo, Sam, Merry, and Pippin. Aiding Frodo are the Wizard Gandalf, the Men Aragorn and Boromir, the Elf Legolas, and the Dwarf Gimli, who unite in order to rally the Free Peoples of Middle-earth against Sauron\'s armies and give Frodo a chance to destroy the One Ring in the fire of Mount Doom.'),
    itemCreate(6, 'board games', 'Catan', 'Klaus Teuber', ['strategy', 'negotiation'], 'Players take on the roles of settlers, each attempting to build and develop holdings while trading and acquiring resources. Players gain victory points as their settlements grow and the first to reach a set number of victory points, typically 10, wins.'),
    itemCreate(7, 'games', 'Baldur\'s Gate III', 'Larian Studios', ['role-playing', 'fantasy'], 'Baldur\'s Gate 3 is a role-playing video game with single-player and cooperative multiplayer elements. Players can create one or more characters and form a party along with a number of pre-generated characters to explore the game\'s story. Optionally, players are able to take one of their characters and team up online with other players to form a party.'),
    itemCreate(8, 'recipes', 'Scientific Pasta Alla Carbonara', 'Dario Bressanini', 'pasta dish', `Ingredients for one person: 80 g of pasta,2 yolk or whole egg (with the yolk the flavor is more intense), 30+10 g of pecorino romano and/or parmesan (the pecorino romano is the traditional ingredient and tastes stronger than parmesan, i like both. The 10 g are for the final addition),40-50 g of bacon/guanciale (guanciale is the traditional ingredient, but after years of testing I much prefer bacon, it tastes better, at least to me),freshly ground black pepper, salt. 
    Directions:
    1) Cut the bacon/guanciale into cubes or matches (cubes between 5 and 10 mm on each side, or parallelepipeds with a square base, always between 5 and 10 mm on the side and as high as you like).
    2)Put the yolks/egg in a large container, grind the black pepper inside (keep in mind that we will put the pasta inside, so it must be large enough for it).
    *If you use the egg yolks, you can freeze the egg whites in ice molds or other containers and then be used for other recipes*
    
    3)Lightly beat the eggs, then add the 30 g of pecorino romano/parmesan and mix to mix well.
    *If it is too solid you have probably added a lot of cheese or the yolks/eggs were small, do not worry, when you add the pasta there will be a little water with it that will dissolve everything, or if there was little on the pasta, take it directly from the pot a little at a time*
    
    4)Put the pancetta/guanciale in a non-stick pan and heat over low heat to melt the fat
    *Sometimes the bacon may have little fat, to avoid burning it is better to add a little oil at the beginning*
    
    5)Continue to cook the pancetta/guanciale until it is crispy but not dry and the fat is solid but almost transparent
    6)Cook the pasta in plenty of not too salty water
    *The pecorino romano/parmesan are very salty, adding too much salt could ruin the dish*
    
    7)Take the pasta with a fork or kitchen tongs, drain it slightly and place it in the container where you put the yolks/egg, cheese and black pepper.
    *Do not mix the pasta with the pancetta/guanciale before mixing it with the yolks/egg, cheese and black pepper, otherwise the mix will not stick to the pasta due to the fat in the bacon/guanciale*
    
    *If you used short pasta, use a colander but do not drain it completely and remember to set aside a little hot water in case you need it*
    
    8)Stir quickly to let the heat left in both the pasta and the water heat the mix until it becomes a cream
    *If everything is very dry you can add a little water from cooking the pasta*
    
    9)Add the bacon/guanciale along with some of its fat
    *personally to make the dish a little lighter I don't put it or I put very little of it, but if you eat pasta alla carbonara you certainly don't do it to stay on a diet*
    
    10)Finish mixing well, serve on the plate and add the remaining cheese
    BUON APPETITO!`),
  ]);
}
