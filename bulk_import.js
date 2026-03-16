import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Cambiamos de anon key a Service Role Key para evadir las políticas RLS (Row Level Security)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Faltan variables de entorno. Asegúrate de tener VITE_SUPABASE_URL y SUPABASE_SERVICE_KEY en tu .env.local");
  process.exit(1);
}

// Inicializamos con la llave maestra que ignora RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CSV_FILE_PATH = path.join(process.cwd(), 'datos_perros.csv');
const PHOTOS_DIR_PATH = path.join(process.cwd(), 'fotos');

async function getFirstShelterId() {
  const { data, error } = await supabase.from('shelters').select('id').limit(1);
  if (error || !data || data.length === 0) {
    throw new Error("No se encontraron albergues en la base de datos para asignar a los perros.");
  }
  return data[0].id;
}

async function uploadPhotosForFolio(folio) {
  const folioDir = path.join(PHOTOS_DIR_PATH, folio);
  const uploadedUrls = [];

  if (!fs.existsSync(folioDir)) {
    console.warn(`[!] No se encontró la carpeta de fotos para el folio: ${folio}`);
    return uploadedUrls;
  }

  const files = fs.readdirSync(folioDir).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
  const filesToUpload = files.slice(0, 3); // Max 3 photos

  for (const file of filesToUpload) {
    const filePath = path.join(folioDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = file.split('.').pop();
    const storagePath = `${folio}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log(`Subiendo foto para ${folio}: ${file}...`);
    
    // Upload standard buffer
    const { data, error } = await supabase.storage
      .from('dogs_photos')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`
      });

    if (error) {
      console.error(`Error subiendo foto ${file} para folio ${folio}:`, error);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from('dogs_photos')
      .getPublicUrl(storagePath);
      
    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return uploadedUrls;
}

async function processData() {
  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`Error: No se encontró el archivo CSV en ${CSV_FILE_PATH}`);
    process.exit(1);
  }

  console.log("Obteniendo ID del albergue por defecto...");
  const defaultShelterId = await getFirstShelterId();

  const results = [];
  
  // Parse CSV
  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv({ 
      mapHeaders: ({ header }) => header.trim().replace(/^[\uFEFF\u200B]+/, '')
    }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Se leyeron ${results.length} filas del archivo CSV. Iniciando procesamiento...`);
      
      let successCount = 0;
      let errorCount = 0;

      for (const row of results) {
        // Map user's headers to variables
        const folio = row['Folio interno']?.trim();
        const rawName = row['Nombre de la mascota']?.trim() || 'Desconocido';
        const sex = row['Sexo']?.trim() || 'Desconocido';
        const size = row['Tamaño']?.trim() || 'Mediano';
        const age = row['Grupo etario']?.trim() || 'Desconocido';
        // Assuming description isn't in CSV, default to a generic text
        const description = "Perrito en espera de una familia."; 

        // Skip rows without Folio
        if (!folio) {
          console.warn("Fila ignorada por no contener Folio interno.");
          continue;
        }

        console.log(`\nProcesando perro: ${rawName} (Folio: ${folio})`);

        // Upload photos for this folio
        const photos = await uploadPhotosForFolio(folio);
        
        // Generate pseudo-random UUID for id to match our current setup
        const id = `dog-import-${folio}-${Date.now()}`;

        const payload = {
          id,
          folio,
          name: rawName,
          sex,
          size,
          age,
          description,
          shelter_id: defaultShelterId,
          photos
        };

        const { error } = await supabase.from('dogs').insert(payload);

        if (error) {
          console.error(`[X] Error insertando a ${rawName} en base de datos:`, error.message);
          errorCount++;
        } else {
          console.log(`[OK] Insertado ${rawName} con éxito con ${photos.length} fotos.`);
          successCount++;
        }
      }

      console.log(`\n--- PROCESO TERMINADO ---`);
      console.log(`Perros importados exitosamente: ${successCount}`);
      console.log(`Errores: ${errorCount}`);
      process.exit(0);
    });
}

processData().catch(err => {
  console.error("Error fatal:", err);
  process.exit(1);
});
