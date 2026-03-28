export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  positivePrompt: string;
  negativePrompt: string;
  isFree: boolean;
}

export const promptLibrary: PromptTemplate[] = [
  // Free Prompts (3)
  {
    id: 'free-1',
    title: 'Modern Minimalist Living Room',
    category: 'Living Room',
    positivePrompt: 'A highly detailed, photorealistic image of a modern minimalist living room. Large floor-to-ceiling windows letting in natural sunlight. Light oak wood flooring, a sleek low-profile white sofa, a geometric glass coffee table. Neutral color palette with beige, white, and soft gray. A large abstract painting on the wall. Potted olive tree in the corner. Cinematic lighting, 8k resolution, architectural photography, interior design magazine style.',
    negativePrompt: 'cluttered, messy, dark, gloomy, outdated, traditional furniture, low quality, blurry, distorted, overexposed, artificial lighting, cartoon, 3d render, watermark.',
    isFree: true,
  },
  {
    id: 'free-2',
    title: 'Cozy Scandinavian Bedroom',
    category: 'Bedroom',
    positivePrompt: 'A cozy Scandinavian style bedroom, photorealistic, highly detailed. A large bed with crumpled linen sheets in sage green and white. A chunky knit throw blanket. Light wood nightstands with minimalist ceramic lamps. A large woven rug on a light hardwood floor. Soft, warm morning light filtering through sheer white curtains. Plants on the windowsill. Inviting, peaceful atmosphere, 8k, architectural digest.',
    negativePrompt: 'messy, dark, cold, industrial, neon lights, cluttered, low resolution, blurry, distorted proportions, watermark, text, signature.',
    isFree: true,
  },
  {
    id: 'free-3',
    title: 'Contemporary Luxury Kitchen',
    category: 'Kitchen',
    positivePrompt: 'A contemporary luxury kitchen, photorealistic interior design. Dark matte charcoal cabinets with brass hardware. A large white marble island with waterfall edges. Three brass pendant lights hanging above the island. High-end stainless steel appliances. Herringbone wood floor. Large window overlooking a lush garden. Bright, airy, sophisticated, 8k resolution, unreal engine 5 render style, hyperrealistic.',
    negativePrompt: 'small, cramped, outdated, colorful cabinets, messy counters, dirty, low quality, blurry, cartoonish, poorly lit, watermark.',
    isFree: true,
  },
  
  // Premium Prompts (~50)
  // Living Room
  {
    id: 'prem-1',
    title: 'Industrial Loft Living Area',
    category: 'Living Room',
    positivePrompt: 'An industrial loft living room with exposed red brick walls and high concrete ceilings. Large black framed factory windows. A distressed brown leather chesterfield sofa. A vintage Persian rug. Metal and reclaimed wood coffee table. Warm Edison bulb lighting, moody atmosphere, highly detailed, photorealistic, 8k.',
    negativePrompt: 'bright, sterile, modern, white walls, low ceiling, cluttered, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-2',
    title: 'Bohemian Desert Lounge',
    category: 'Living Room',
    positivePrompt: 'A bohemian desert style living room. Terracotta tile floors, textured plaster walls. A low-slung linen sofa with mudcloth pillows. Rattan chairs, a large woven wall hanging. Cacti and succulents in terracotta pots. Warm golden hour sunlight, earthy tones, highly detailed, architectural photography.',
    negativePrompt: 'cold, modern, sleek, dark, cluttered, low resolution, artificial lighting.',
    isFree: false,
  },
  {
    id: 'prem-3',
    title: 'Mid-Century Modern Living Room',
    category: 'Living Room',
    positivePrompt: 'A mid-century modern living room, photorealistic. Walnut wood paneling on one wall. A mustard yellow velvet sofa, iconic mid-century lounge chair. A geometric patterned rug. A sputnik chandelier. Large windows, bright natural light, retro aesthetic, highly detailed, 8k.',
    negativePrompt: 'contemporary, traditional, messy, dark, low quality, blurry, watermark.',
    isFree: false,
  },
  {
    id: 'prem-4',
    title: 'Japandi Zen Living Space',
    category: 'Living Room',
    positivePrompt: 'A Japandi style living room, blending Japanese minimalism with Scandinavian functionality. Low wooden furniture, shoji screens, a bonsai tree. Neutral color palette of beige, cream, and light wood. Soft, diffused lighting, peaceful and serene atmosphere, highly detailed, photorealistic.',
    negativePrompt: 'cluttered, colorful, maximalist, dark, low resolution, artificial lighting.',
    isFree: false,
  },
  {
    id: 'prem-5',
    title: 'Maximalist Eclectic Lounge',
    category: 'Living Room',
    positivePrompt: 'A maximalist eclectic living room. Jewel-toned velvet furniture, emerald green walls, a gallery wall filled with diverse art. A large patterned Persian rug. Brass accents, lush exotic plants. Rich, moody lighting, highly detailed, vibrant, interior design magazine.',
    negativePrompt: 'minimalist, boring, empty, white walls, low quality, blurry.',
    isFree: false,
  },

  // Bedroom
  {
    id: 'prem-6',
    title: 'Romantic Parisian Bedroom',
    category: 'Bedroom',
    positivePrompt: 'A romantic Parisian style bedroom. Ornate wall moldings, a crystal chandelier, a wrought iron bed frame with crisp white bedding. A vintage gilded mirror leaning against the wall. Herringbone parquet flooring. Soft, romantic lighting, elegant, highly detailed, photorealistic, 8k.',
    negativePrompt: 'modern, industrial, dark, cluttered, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-7',
    title: 'Moody Dark Academia Bedroom',
    category: 'Bedroom',
    positivePrompt: 'A dark academia style bedroom. Dark emerald green walls, floor-to-ceiling bookshelves filled with old books. A dark wood four-poster bed with burgundy velvet bedding. A vintage writing desk with a brass lamp. Moody, atmospheric lighting, highly detailed, photorealistic.',
    negativePrompt: 'bright, minimalist, modern, white walls, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-8',
    title: 'Tropical Resort Bedroom',
    category: 'Bedroom',
    positivePrompt: 'A tropical resort style bedroom. A canopy bed with sheer white netting. Bamboo and rattan furniture. Large sliding glass doors opening to a lush jungle view. Ceiling fan, light wood floors. Bright, airy, sunny, highly detailed, architectural photography.',
    negativePrompt: 'dark, cold, urban, cluttered, low resolution, artificial lighting.',
    isFree: false,
  },
  {
    id: 'prem-9',
    title: 'Rustic Cabin Bedroom',
    category: 'Bedroom',
    positivePrompt: 'A rustic log cabin bedroom. Exposed log walls, a stone fireplace. A heavy wooden bed with a plaid wool blanket. Faux fur rug on the floor. Warm firelight, cozy atmosphere, snowy window view, highly detailed, photorealistic.',
    negativePrompt: 'modern, sleek, bright, urban, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-10',
    title: 'Glamorous Art Deco Bedroom',
    category: 'Bedroom',
    positivePrompt: 'A glamorous Art Deco bedroom. Geometric patterned wallpaper in black and gold. A velvet channel-tufted headboard. Mirrored nightstands, brass accents. Luxurious silk bedding. Dramatic lighting, elegant, highly detailed, photorealistic, 8k.',
    negativePrompt: 'rustic, minimalist, messy, low resolution, watermark.',
    isFree: false,
  },

  // Kitchen
  {
    id: 'prem-11',
    title: 'Rustic Farmhouse Kitchen',
    category: 'Kitchen',
    positivePrompt: 'A rustic farmhouse kitchen. White shaker cabinets, a large ceramic farmhouse sink. Butcher block countertops. Open wooden shelving with ceramic dishes. A vintage runner rug. Bright natural light, cozy, highly detailed, photorealistic.',
    negativePrompt: 'modern, sleek, dark, industrial, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-12',
    title: 'Sleek Black Modern Kitchen',
    category: 'Kitchen',
    positivePrompt: 'A sleek, ultra-modern black kitchen. Matte black handleless cabinets, black marble countertops and backsplash. Integrated appliances. Minimalist bar stools. Dramatic under-cabinet LED lighting, moody, sophisticated, highly detailed, 8k.',
    negativePrompt: 'white, traditional, cluttered, bright, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-13',
    title: 'Colorful Retro Kitchen',
    category: 'Kitchen',
    positivePrompt: 'A colorful retro 1950s style kitchen. Pastel mint green cabinets, a vintage Smeg refrigerator. Black and white checkerboard floor. Chrome diner-style table and chairs. Bright, cheerful lighting, highly detailed, photorealistic.',
    negativePrompt: 'dark, modern, minimalist, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-14',
    title: 'Mediterranean Villa Kitchen',
    category: 'Kitchen',
    positivePrompt: 'A Mediterranean villa kitchen. Terracotta floor tiles, arched doorways. Hand-painted ceramic tile backsplash. Dark wood cabinets, a large rustic wooden island. Copper pots hanging from the ceiling. Warm sunlight, highly detailed, architectural photography.',
    negativePrompt: 'modern, cold, industrial, low resolution, artificial lighting.',
    isFree: false,
  },
  {
    id: 'prem-15',
    title: 'Compact Urban Apartment Kitchen',
    category: 'Kitchen',
    positivePrompt: 'A smart, compact urban apartment kitchen. Clever storage solutions, light wood cabinets, white quartz countertops. A small peninsula with two stools. Large window with a city skyline view. Bright, efficient, highly detailed, photorealistic.',
    negativePrompt: 'large, empty, dark, outdated, low quality, blurry.',
    isFree: false,
  },

  // Bathroom
  {
    id: 'prem-16',
    title: 'Spa-Like Zen Bathroom',
    category: 'Bathroom',
    positivePrompt: 'A spa-like Zen bathroom. A large freestanding stone soaking tub. Bamboo slatted floor mat. River rock accents, a rain shower head. Potted bamboo plants. Soft, diffused lighting, serene atmosphere, highly detailed, photorealistic, 8k.',
    negativePrompt: 'cluttered, colorful, dark, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-17',
    title: 'Luxurious Marble Bathroom',
    category: 'Bathroom',
    positivePrompt: 'A luxurious bathroom completely clad in white Carrara marble. A large glass-enclosed walk-in shower. Double vanity with brass fixtures. A crystal chandelier. Bright, elegant, highly detailed, architectural photography.',
    negativePrompt: 'rustic, dark, small, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-18',
    title: 'Moody Industrial Bathroom',
    category: 'Bathroom',
    positivePrompt: 'A moody industrial bathroom. Dark concrete walls and floor. A matte black freestanding tub. Exposed copper piping. A vintage mirror with Edison bulb sconces. Dramatic lighting, highly detailed, photorealistic.',
    negativePrompt: 'bright, white, traditional, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-19',
    title: 'Vintage Clawfoot Tub Bathroom',
    category: 'Bathroom',
    positivePrompt: 'A vintage style bathroom. A classic white clawfoot tub with chrome fixtures. Hexagon tile floor, subway tile wainscoting. A pedestal sink, a vintage medicine cabinet. Bright natural light, highly detailed, photorealistic.',
    negativePrompt: 'modern, dark, sleek, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-20',
    title: 'Tropical Outdoor Bathroom',
    category: 'Bathroom',
    positivePrompt: 'A tropical outdoor bathroom. A stone tub surrounded by lush jungle foliage. A bamboo privacy screen. Pebble floor. Warm sunlight filtering through leaves, highly detailed, photorealistic, 8k.',
    negativePrompt: 'indoor, cold, urban, low resolution, artificial lighting.',
    isFree: false,
  },

  // Office
  {
    id: 'prem-21',
    title: 'Executive Corporate Office',
    category: 'Office',
    positivePrompt: 'A high-end executive corporate office. A large mahogany desk, a black leather ergonomic chair. Floor-to-ceiling windows with a panoramic city skyline view. A sleek modern sofa for guests. Professional, sophisticated, highly detailed, photorealistic.',
    negativePrompt: 'messy, small, dark, home office, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-22',
    title: 'Creative Studio Workspace',
    category: 'Office',
    positivePrompt: 'A creative studio workspace. A large white communal desk, colorful ergonomic chairs. Mood boards on the walls, lots of plants. Large windows, bright natural light. Inspiring, energetic atmosphere, highly detailed, photorealistic.',
    negativePrompt: 'corporate, dark, sterile, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-23',
    title: 'Cozy Home Office Nook',
    category: 'Office',
    positivePrompt: 'A cozy home office nook built into a bay window. A built-in wooden desk, a comfortable upholstered chair. Bookshelves surrounding the window. Warm sunlight, a cup of coffee on the desk. Highly detailed, photorealistic.',
    negativePrompt: 'large, corporate, cold, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-24',
    title: 'Minimalist Tech Workspace',
    category: 'Office',
    positivePrompt: 'A minimalist tech workspace. A clean white desk with dual monitors, a mechanical keyboard. LED bias lighting behind the monitors. A sleek black chair. Dark gray walls. Focused, modern, highly detailed, photorealistic, 8k.',
    negativePrompt: 'cluttered, rustic, bright, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-25',
    title: 'Classic Library Office',
    category: 'Office',
    positivePrompt: 'A classic library style office. Dark wood paneled walls, floor-to-ceiling bookshelves with a rolling ladder. A large antique leather top desk, a green banker\'s lamp. A leather chesterfield armchair. Moody, intellectual, highly detailed, photorealistic.',
    negativePrompt: 'modern, bright, minimalist, low quality, blurry.',
    isFree: false,
  },

  // Exterior
  {
    id: 'prem-26',
    title: 'Modern Architectural Villa',
    category: 'Exterior',
    positivePrompt: 'Exterior view of a modern architectural villa at twilight. Clean geometric lines, white concrete, large glass walls. An infinity pool reflecting the house and the sunset sky. Warm interior lighting glowing through the windows. Highly detailed, photorealistic, 8k.',
    negativePrompt: 'traditional, small, daytime, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-27',
    title: 'Cozy Craftsman Bungalow',
    category: 'Exterior',
    positivePrompt: 'Exterior view of a cozy craftsman bungalow. A wide front porch with a swing. Tapered columns, exposed rafter tails. A well-manicured front garden with colorful flowers. Sunny daytime, inviting, highly detailed, photorealistic.',
    negativePrompt: 'modern, cold, urban, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-28',
    title: 'A-Frame Cabin in the Woods',
    category: 'Exterior',
    positivePrompt: 'Exterior view of a steep A-frame cabin in a dense pine forest. Large glass front facade. A wooden deck with Adirondack chairs. A light dusting of snow on the ground. Warm light glowing from inside. Highly detailed, photorealistic.',
    negativePrompt: 'urban, beach, summer, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-29',
    title: 'Mediterranean Coastal Home',
    category: 'Exterior',
    positivePrompt: 'Exterior view of a Mediterranean coastal home. White stucco walls, a terracotta tile roof. Arched windows with blue shutters. Bougainvillea climbing the walls. A view of the ocean in the background. Bright sunny day, highly detailed, photorealistic, 8k.',
    negativePrompt: 'dark, modern, forest, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-30',
    title: 'Urban Brick Townhouse',
    category: 'Exterior',
    positivePrompt: 'Exterior view of a classic urban brick townhouse. Black painted front door with brass hardware. Stone steps leading up to the entrance. Window boxes with trailing plants. A tree-lined city street. Highly detailed, photorealistic.',
    negativePrompt: 'suburban, modern, isolated, low resolution, watermark.',
    isFree: false,
  },

  // Commercial
  {
    id: 'prem-31',
    title: 'Boutique Coffee Shop',
    category: 'Commercial',
    positivePrompt: 'Interior of a trendy boutique coffee shop. An espresso machine on a terrazzo counter. Exposed brick walls, hanging plants. Small round marble tables with bentwood chairs. Warm, inviting lighting, highly detailed, photorealistic.',
    negativePrompt: 'empty, sterile, dark, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-32',
    title: 'High-End Retail Store',
    category: 'Commercial',
    positivePrompt: 'Interior of a high-end luxury retail store. Minimalist clothing racks, a central display table made of solid stone. Soft, diffused lighting highlighting the products. Polished concrete floor. Sophisticated, highly detailed, photorealistic, 8k.',
    negativePrompt: 'cluttered, messy, cheap, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-33',
    title: 'Fine Dining Restaurant',
    category: 'Commercial',
    positivePrompt: 'Interior of a fine dining restaurant. Tables set with crisp white linen, crystal glasses, and candles. Velvet banquette seating. A large statement chandelier. Moody, romantic lighting, elegant atmosphere, highly detailed, photorealistic.',
    negativePrompt: 'bright, casual, fast food, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-34',
    title: 'Modern Hotel Lobby',
    category: 'Commercial',
    positivePrompt: 'A grand modern hotel lobby. Double-height ceilings, a large abstract sculpture in the center. Comfortable lounge seating areas. A sleek reception desk. Large windows, bright, luxurious, highly detailed, photorealistic.',
    negativePrompt: 'small, cramped, dark, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-35',
    title: 'Boutique Fitness Studio',
    category: 'Commercial',
    positivePrompt: 'Interior of a boutique fitness studio. Hardwood floors, mirrored walls. Neatly arranged yoga mats and weights. Large windows letting in natural light. Clean, energetic, highly detailed, photorealistic.',
    negativePrompt: 'dark, dirty, cluttered, low quality, blurry.',
    isFree: false,
  },

  // Dining Room
  {
    id: 'prem-36',
    title: 'Formal Traditional Dining Room',
    category: 'Dining Room',
    positivePrompt: 'A formal traditional dining room. A long mahogany dining table with upholstered chairs. A crystal chandelier above the table. Ornate wallpaper, wainscoting. A large window with heavy drapes. Elegant, highly detailed, photorealistic.',
    negativePrompt: 'modern, casual, small, low resolution, watermark.',
    isFree: false,
  },
  {
    id: 'prem-37',
    title: 'Modern Minimalist Dining Area',
    category: 'Dining Room',
    positivePrompt: 'A modern minimalist dining area. A sleek black dining table with sculptural chairs. A simple linear pendant light. White walls, light wood floor. A large piece of abstract art. Clean, sophisticated, highly detailed, photorealistic, 8k.',
    negativePrompt: 'cluttered, traditional, dark, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-38',
    title: 'Rustic Farmhouse Dining Room',
    category: 'Dining Room',
    positivePrompt: 'A rustic farmhouse dining room. A large reclaimed wood dining table with a mix of wooden chairs and a bench. An iron chandelier. A stone fireplace in the background. Cozy, inviting, highly detailed, photorealistic.',
    negativePrompt: 'modern, sleek, cold, low resolution, watermark.',
    isFree: false,
  },
  
  // Kids Room
  {
    id: 'prem-39',
    title: 'Whimsical Nursery',
    category: 'Kids Room',
    positivePrompt: 'A whimsical baby nursery. Pastel colors, a white crib. A comfortable rocking chair. A mural of a gentle forest on the wall. Soft, warm lighting, peaceful, highly detailed, photorealistic.',
    negativePrompt: 'dark, scary, cluttered, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-40',
    title: 'Adventure Themed Kids Room',
    category: 'Kids Room',
    positivePrompt: 'An adventure themed kids room. A bed shaped like a tent. A climbing wall on one side. A large map of the world on the wall. Bright, playful colors, highly detailed, photorealistic.',
    negativePrompt: 'boring, adult, minimalist, low resolution, watermark.',
    isFree: false,
  },

  // Outdoor Living
  {
    id: 'prem-41',
    title: 'Luxury Rooftop Terrace',
    category: 'Outdoor Living',
    positivePrompt: 'A luxury rooftop terrace at sunset. Comfortable outdoor lounge furniture, a fire pit. String lights hanging above. Potted plants. A panoramic view of the city skyline. Highly detailed, photorealistic, 8k.',
    negativePrompt: 'indoor, daytime, empty, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-42',
    title: 'Cozy Backyard Patio',
    category: 'Outdoor Living',
    positivePrompt: 'A cozy backyard patio. A wooden pergola covered in vines. A dining table set for an outdoor meal. A built-in barbecue grill. Warm afternoon sunlight, inviting, highly detailed, photorealistic.',
    negativePrompt: 'urban, cold, winter, low resolution, watermark.',
    isFree: false,
  },

  // Entryway
  {
    id: 'prem-43',
    title: 'Grand Foyer',
    category: 'Entryway',
    positivePrompt: 'A grand entryway foyer. A sweeping curved staircase with an iron railing. A large crystal chandelier. Marble floors with a geometric inlay pattern. A round center table with a large floral arrangement. Highly detailed, photorealistic.',
    negativePrompt: 'small, dark, modern, low quality, blurry.',
    isFree: false,
  },
  {
    id: 'prem-44',
    title: 'Modern Minimalist Entryway',
    category: 'Entryway',
    positivePrompt: 'A modern minimalist entryway. A floating wooden console table. A large round mirror on the wall. A simple vase with a single branch. Clean lines, bright, highly detailed, photorealistic.',
    negativePrompt: 'cluttered, traditional, dark, low resolution, watermark.',
    isFree: false,
  },

  // Walk-in Closet
  {
    id: 'prem-45',
    title: 'Luxury Walk-in Closet',
    category: 'Walk-in Closet',
    positivePrompt: 'A luxury walk-in closet. Custom dark wood cabinetry with glass doors. An island in the center with a velvet bench. Integrated LED lighting highlighting clothing and shoes. A chandelier. Highly detailed, photorealistic, 8k.',
    negativePrompt: 'small, messy, cheap, low quality, blurry.',
    isFree: false,
  },
  
  // Home Theater
  {
    id: 'prem-46',
    title: 'Private Home Theater',
    category: 'Home Theater',
    positivePrompt: 'A private home theater. Plush reclining leather seats in tiered rows. A massive projection screen. Dark acoustic paneled walls. LED strip lighting on the floor. Cinematic, highly detailed, photorealistic.',
    negativePrompt: 'bright, living room, small tv, low resolution, watermark.',
    isFree: false,
  },

  // Wine Cellar
  {
    id: 'prem-47',
    title: 'Rustic Wine Cellar',
    category: 'Wine Cellar',
    positivePrompt: 'A rustic underground wine cellar. Stone walls, arched brick ceiling. Custom wooden wine racks filled with bottles. A small tasting table with two chairs. Warm, dim lighting, highly detailed, photorealistic.',
    negativePrompt: 'modern, bright, empty, low quality, blurry.',
    isFree: false,
  },

  // Laundry Room
  {
    id: 'prem-48',
    title: 'Modern Farmhouse Laundry Room',
    category: 'Laundry Room',
    positivePrompt: 'A modern farmhouse laundry room. White shaker cabinets, a farmhouse sink. Patterned cement floor tiles. Front-loading washer and dryer. A wooden folding counter. Bright, clean, highly detailed, photorealistic.',
    negativePrompt: 'dark, messy, basement, low resolution, watermark.',
    isFree: false,
  },

  // Garage
  {
    id: 'prem-49',
    title: 'Luxury Showroom Garage',
    category: 'Garage',
    positivePrompt: 'A luxury showroom style garage. Polished epoxy floor. Custom metal storage cabinets. Bright, even LED lighting. Clean, minimalist, highly detailed, photorealistic.',
    negativePrompt: 'messy, dark, dirty, low quality, blurry.',
    isFree: false,
  },

  // Sunroom
  {
    id: 'prem-50',
    title: 'Bright Conservatory Sunroom',
    category: 'Sunroom',
    positivePrompt: 'A bright conservatory sunroom. Glass walls and ceiling. Filled with lush tropical plants. Wicker lounge furniture. A patterned tile floor. Sunny, peaceful, highly detailed, photorealistic, 8k.',
    negativePrompt: 'dark, solid roof, empty, low resolution, watermark.',
    isFree: false,
  }
];
