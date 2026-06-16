const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const imageDir = 'C:\\Users\\TUF\\Downloads\\Image Listing';

const makeSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const properties = [
  {
    title: "Modern Zen Townhouse in Nuvali",
    location: "Santa Rosa, Laguna",
    price: "₱4,500,000",
    description: "Experience peaceful suburban living in this beautifully designed modern Zen townhouse. Located in the heart of Nuvali, this property offers unparalleled access to nature trails, top-tier schools, and lifestyle malls. The community features 24/7 roaming security, a grand clubhouse with a lap pool, and multiple parks. Built with high-quality materials and smart-home ready infrastructure. Perfect for growing families seeking a balanced lifestyle south of Metro Manila.",
    property_type: "Townhouse",
    region: "CALABARZON",
    status: "Ready for Occupancy",
    bedrooms: 3, bathrooms: 2, floor_area: 85, lot_area: 100,
    monthly_amortization: "₱28,500/mo",
    features: ["Gated community", "Clubhouse & pool", "24/7 security", "Near Solenad Mall", "Smart-home ready"],
    pagibig_eligible: true, featured: true
  },
  {
    title: "Elegant House and Lot in Antel Grand Village",
    location: "General Trias, Cavite",
    price: "₱6,200,000",
    description: "A luxurious 2-storey single-attached home in a premium resort-type community. This property boasts a spacious master bedroom with an en-suite bathroom and balcony, high-ceiling living area, and a modular kitchen. Antel Grand Village offers resort-class amenities including a water park, basketball courts, and a fitness gym. Very accessible via CAVITEX, making your daily commute to Metro Manila swift and convenient.",
    property_type: "House & Lot",
    region: "CALABARZON",
    status: "Ready for Occupancy",
    bedrooms: 4, bathrooms: 3, floor_area: 120, lot_area: 150,
    monthly_amortization: "₱45,000/mo",
    features: ["Resort-type amenities", "Water park access", "Balcony", "Modular kitchen", "Near CAVITEX"],
    pagibig_eligible: true, featured: true
  },
  {
    title: "Affordable Rowhouse in Deca Homes",
    location: "Marilao, Bulacan",
    price: "₱1,200,000",
    description: "The perfect starter home for minimum wage earners and young professionals! This affordable rowhouse is situated in a highly accessible area in Marilao, just one ride away from NLEX. The community is complete with a wet market, terminal, and elementary school inside the subdivision. Turnover comes with a bare finish so you can design and customize your interior exactly how you want it. Very low monthly amortization through Pag-IBIG.",
    property_type: "Row House",
    region: "Central Luzon",
    status: "Pre-Selling",
    bedrooms: 2, bathrooms: 1, floor_area: 35, lot_area: 40,
    monthly_amortization: "₱7,500/mo",
    features: ["Highly affordable", "Near NLEX", "Subdivision terminal", "Wet market inside", "Bare finish interior"],
    pagibig_eligible: true, featured: false
  },
  {
    title: "Premium Condominium Unit near BGC",
    location: "Taguig City",
    price: "₱8,500,000",
    description: "Live just 5 minutes away from Bonifacio Global City without the BGC price tag! This premium mid-rise condominium unit offers stunning city skyline views, a spacious balcony, and top-of-the-line fixtures. Residents enjoy exclusive access to a sky lounge, infinity pool, and a fully-equipped fitness center. Ideal for expats and young executives looking for a strategic city address.",
    property_type: "Condominium Unit",
    region: "Metro Manila",
    status: "Ready for Occupancy",
    bedrooms: 2, bathrooms: 2, floor_area: 55, lot_area: null,
    monthly_amortization: "₱65,000/mo",
    features: ["5 mins to BGC", "Infinity pool", "Sky lounge", "Balcony", "Fitness center"],
    pagibig_eligible: false, featured: true
  },
  {
    title: "Spacious Duplex with Garden",
    location: "Antipolo, Rizal",
    price: "₱3,800,000",
    description: "Enjoy the cool breeze and overlooking views of Metro Manila in this spacious duplex located in upper Antipolo. The property features an open-concept living area, a large garden space perfect for plantitas, and a 2-car carport. The village is flood-free and located along a major highway, providing quick access to malls, hospitals, and schools. A tranquil escape from the bustling city.",
    property_type: "Duplex",
    region: "CALABARZON",
    status: "Pre-Owned",
    bedrooms: 3, bathrooms: 2, floor_area: 80, lot_area: 120,
    monthly_amortization: "₱24,000/mo",
    features: ["Overlooking city view", "Large garden space", "2-car carport", "Flood-free", "Cool climate"],
    pagibig_eligible: true, featured: false
  },
  {
    title: "Bungalow House in Camella Homes",
    location: "San Jose del Monte, Bulacan",
    price: "₱2,900,000",
    description: "A beautifully maintained single-detached bungalow perfect for retirees or small families. Located in the highly-secured Camella community in SJDM, this home is just minutes away from the upcoming MRT-7 station, promising high property value appreciation. Features a landscaped front yard, high ceilings, and tiled flooring. Move-in ready!",
    property_type: "House & Lot",
    region: "Central Luzon",
    status: "Ready for Occupancy",
    bedrooms: 2, bathrooms: 1, floor_area: 50, lot_area: 88,
    monthly_amortization: "₱18,500/mo",
    features: ["Single-detached", "Near MRT-7", "Landscaped yard", "Highly secured", "High ceiling"],
    pagibig_eligible: true, featured: false
  },
  {
    title: "Luxury 2-Storey House in Alabang West",
    location: "Las Piñas City",
    price: "₱15,000,000",
    description: "An exquisite Beverly Hills-inspired mansion located in the exclusive enclave of Alabang West. This ultra-luxury property boasts a grand foyer, smart home automation, Italian marble flooring, and a private dipping pool. The community features a Rodeo Drive-style commercial strip, an upscale clubhouse, and underground utilities. Designed for those with a taste for the extraordinary.",
    property_type: "House & Lot",
    region: "Metro Manila",
    status: "Ready for Occupancy",
    bedrooms: 5, bathrooms: 5, floor_area: 300, lot_area: 250,
    monthly_amortization: "₱120,000/mo",
    features: ["Smart home automation", "Private dipping pool", "Italian marble floors", "Underground utilities", "Beverly Hills theme"],
    pagibig_eligible: false, featured: true
  },
  {
    title: "Starter Studio Unit in Mactan",
    location: "Lapu-Lapu City, Cebu",
    price: "₱2,100,000",
    description: "Your perfect beachside investment! This affordable studio unit is located in Mactan, Cebu, just 10 minutes away from the international airport and world-class beach resorts. Fully furnished and ready to be used as an Airbnb rental or a personal vacation home. Building amenities include a swimming pool, 24/7 security, and a commercial strip at the ground floor.",
    property_type: "Studio Unit",
    region: "Central Visayas",
    status: "Ready for Occupancy",
    bedrooms: 0, bathrooms: 1, floor_area: 22, lot_area: null,
    monthly_amortization: "₱14,000/mo",
    features: ["Near Mactan Airport", "Beach resort access", "Fully furnished", "Airbnb ready", "Swimming pool"],
    pagibig_eligible: true, featured: false
  },
  {
    title: "Commercial Space for Rent/Sale in Greenfield",
    location: "Mandaluyong City",
    price: "₱12,000,000",
    description: "Prime commercial property located in the bustling Greenfield District of Mandaluyong. High foot traffic area perfect for retail stores, cafes, or office spaces. The unit comes with high ceilings, glass frontage, and dedicated parking slots. Highly accessible via EDSA and MRT. A rare investment opportunity in one of the Metro's fastest-growing business districts.",
    property_type: "Commercial Space",
    region: "Metro Manila",
    status: "Ready for Occupancy",
    bedrooms: null, bathrooms: 2, floor_area: 100, lot_area: null,
    monthly_amortization: null,
    features: ["High foot traffic", "Glass frontage", "Dedicated parking", "Near EDSA", "Prime business district"],
    pagibig_eligible: false, featured: true
  },
  {
    title: "Vacant Lot in Tagaytay Highlands",
    location: "Tagaytay City, Cavite",
    price: "₱5,500,000",
    description: "Build your dream vacation home on this premium vacant lot located in the exclusive Tagaytay Highlands. Enjoy sweeping views of Taal Lake and the lush green mountains. Ownership includes club membership, giving you access to the 18-hole golf course, cable cars, and world-class dining facilities. A highly coveted address offering ultimate privacy and luxury.",
    property_type: "Lot Only",
    region: "CALABARZON",
    status: "Ready for Occupancy",
    bedrooms: null, bathrooms: null, floor_area: null, lot_area: 350,
    monthly_amortization: null,
    features: ["Taal Lake view", "Club membership included", "Golf course access", "High altitude cool climate", "Ultimate privacy"],
    pagibig_eligible: false, featured: true
  }
];

async function seed() {
  const images = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  if (images.length < 100) {
    console.warn(`Only found ${images.length} images. Some properties may have fewer than 10 photos.`);
  }

  let imgIndex = 0;

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    console.log(`\nProcessing Property ${i + 1}/${properties.length}: ${prop.title}`);
    
    const imageUrls = [];
    const thumbUrls = [];
    
    // Process 10 images for this property
    for (let j = 0; j < 10; j++) {
      if (imgIndex >= images.length) break;
      const fileName = images[imgIndex++];
      const filePath = path.join(imageDir, fileName);
      const buffer = fs.readFileSync(filePath);
      
      const ts = Date.now();
      const safeName = `seed-${i}-${j}-${ts}.jpg`;
      const thumbName = `thumbnails/seed-${i}-${j}-${ts}-th.jpg`;
      
      console.log(`  Uploading image ${j + 1}/10...`);
      
      // Upload full image
      const { error: fullErr } = await supabase.storage.from('property-images').upload(safeName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
      if (fullErr) { console.error('  Full upload error:', fullErr.message); continue; }
      
      // Upload thumbnail (same image, frontend will downscale natively via browser CSS/Next Image anyway)
      const { error: thumbErr } = await supabase.storage.from('property-images').upload(thumbName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
      if (thumbErr) { console.error('  Thumb upload error:', thumbErr.message); continue; }
      
      const { data: fullData } = supabase.storage.from('property-images').getPublicUrl(safeName);
      const { data: thumbData } = supabase.storage.from('property-images').getPublicUrl(thumbName);
      
      imageUrls.push(fullData.publicUrl);
      thumbUrls.push(thumbData.publicUrl);
    }
    
    const payload = {
      ...prop,
      slug: makeSlug(prop.title),
      image_urls: imageUrls,
      thumbnail_urls: thumbUrls,
      image_url: imageUrls[0] || '',
      main_image_index: 0
    };
    
    console.log(`  Inserting to database...`);
    const { error: dbErr } = await supabase.from('listings').insert(payload);
    
    if (dbErr) {
      console.error('  ❌ DB Insert Error:', dbErr.message);
    } else {
      console.log('  ✅ Inserted successfully!');
    }
  }
  
  console.log('\n🎉 All 10 properties inserted successfully!');
}

seed().catch(console.error);
