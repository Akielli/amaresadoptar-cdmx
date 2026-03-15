import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { generateDogs } from './src/data/dogs.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const CHUNK_SIZE = 100; // Insert in chunks to avoid overwhelming the network

async function seedDogs() {
  console.log('Generating 800 mock dogs...');
  const dogs = generateDogs(800);
  
  // Convert JS naming to database naming (shelterId -> shelter_id)
  const dbDogs = dogs.map(d => ({
    id: d.id,
    name: d.name,
    size: d.size,
    sex: d.sex,
    age: d.age,
    description: d.description,
    photos: d.photos,
    shelter_id: d.shelterId
  }));

  console.log('Starting seed process into Supabase...');

  for (let i = 0; i < dbDogs.length; i += CHUNK_SIZE) {
    const chunk = dbDogs.slice(i, i + CHUNK_SIZE);
    
    const { error } = await supabase
      .from('dogs')
      .upsert(chunk, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting chunk starting at index ${i}:`, error.message);
      return;
    }
    
    console.log(`Successfully inserted ${i + chunk.length} / ${dbDogs.length} dogs`);
  }

  console.log('Seeding complete!');
}

seedDogs();
