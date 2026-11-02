
const mongoose = require('mongoose');
const path = require('path');
const Room = require('./models/Room');

// Load environment variables from server/.env


require('dotenv').config({
    path: path.join(__dirname, '.env')
});
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI not found in server/.env');
  process.exit(1);
}

// Resort room categories
const categories = [
  'Deluxe Garden View',
  'Executive Heritage Suite',
  'Presidential Palm Villa',
  'Royal Family Suite'
];

// Room images
const images = {
  'Deluxe Garden View': [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
  ],
  'Executive Heritage Suite': [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
  ],
  'Presidential Palm Villa': [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
  ],
  'Royal Family Suite': [
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
  ]
};

// Generate 35 sample rooms
const sampleRooms = [];
let roomCounter = 1;

for (let floor = 1; floor <= 4; floor++) {
  const roomsOnFloor = floor === 4 ? 8 : 9;

  for (let r = 1; r <= roomsOnFloor; r++) {
    const roomNum = `${floor}0${r}`;
    const category = categories[(roomCounter - 1) % categories.length];

    let basePrice = 8000;

    if (category === 'Executive Heritage Suite') basePrice = 16000;
    if (category === 'Presidential Palm Villa') basePrice = 28000;
    if (category === 'Royal Family Suite') basePrice = 22000;

    let status = 'Available';

    if (roomCounter % 6 === 0) status = 'Occupied';
    else if (roomCounter % 9 === 0) status = 'Dirty';
    else if (roomCounter % 15 === 0) status = 'Maintenance';

    const categoryImages = images[category];

    sampleRooms.push({
      roomNumber: roomNum,
      floorNumber: floor,
      category,
      pricePerNight: basePrice + (r * 350),
      description: `Experience royal luxury in Room ${roomNum} at The Royal Haven Resort. Features private balcony, plush king bedding, high-speed Wi-Fi and 24/7 butler service.`,
      status,
      image: categoryImages[r % categoryImages.length],
      maxAdults: category.includes('Family') || category.includes('Presidential') ? 4 : 2,
      maxChildren: category.includes('Family') ? 2 : 1,
      amenities: [
        'High-speed Wi-Fi',
        'Air Conditioning',
        'Flat-screen TV',
        'Mini Bar',
        'Room Service',
        'Balcony View'
      ]
    });

    roomCounter++;
  }
}

// Database seeder
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    const existingRooms = await Room.countDocuments();

    if (existingRooms > 0) {
      console.log(`Database already contains ${existingRooms} rooms.`);
      console.log('Skipping seeding to protect existing data.');
      return;
    }

    await Room.insertMany(sampleRooms);

    console.log(`Successfully seeded ${sampleRooms.length} rooms for The Royal Haven Resort!`);

  } catch (error) {
    console.error('Room seeding failed:', error.message);
    process.exitCode = 1;

  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

seedDB();
