import fs from 'fs';
import { generateDogs } from './src/data/dogs.js';

const dogs = generateDogs(800);

let sqlQuery = 'INSERT INTO public.dogs (id, name, size, sex, age, description, photos, shelter_id) VALUES\n';

const values = dogs.map(d => {
  const safeName = d.name.replace(/'/g, "''");
  const safeDesc = d.description.replace(/'/g, "''");
  const photosArray = `ARRAY[${d.photos.map(p => `'${p}'`).join(', ')}]`;
  
  return `('${d.id}', '${safeName}', '${d.size}', '${d.sex}', '${d.age}', '${safeDesc}', ${photosArray}, '${d.shelterId}')`;
});

sqlQuery += values.join(',\n') + '\nON CONFLICT (id) DO NOTHING;';

fs.writeFileSync('seed_dogs.sql', sqlQuery, 'utf-8');
console.log('SQL generated successfully.');
