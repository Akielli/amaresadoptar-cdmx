const baseDogs = [
  { name: 'Max', size: 'Mediano', sex: 'Macho', age: '2 años', desc: 'Juguetón y lleno de energía. Busca una familia activa.' },
  { name: 'Luna', size: 'Pequeño', sex: 'Hembra', age: '5 años', desc: 'Tranquila y cariñosa. Perfecta para compañía en casa.' },
  { name: 'Rocky', size: 'Grande', sex: 'Macho', age: '3 años', desc: 'Protector y leal. Se lleva bien con otros perros.' },
  { name: 'Bella', size: 'Mediano', sex: 'Hembra', age: '1 año', desc: 'Cachorra любопitita (curiosa). Necesita entrenamiento básico.' },
  { name: 'Thor', size: 'Grande', sex: 'Macho', age: '4 años', desc: 'Fuerte e incansable. Ideal para espacios abiertos.' },
  { name: 'Kira', size: 'Pequeño', sex: 'Hembra', age: '2 años', desc: 'Muy dócil y obediente. Lista para su hogar definitivo.' },
  { name: 'Zeus', size: 'Mediano', sex: 'Macho', age: '7 años', desc: 'Un poco tímido al principio, pero con un gran corazón.' },
  { name: 'Nala', size: 'Grande', sex: 'Hembra', age: '3 años', desc: 'Amigable y muy sociable. Le encantan los paseos.' },
  { name: 'Coco', size: 'Pequeño', sex: 'Macho', age: '1.5 años', desc: 'Alegre, rápido y muy divertido.' },
  { name: 'Mia', size: 'Mediano', sex: 'Hembra', age: '6 años', desc: 'Disfruta de las siestas largas y el contacto humano.' },
];

const dogPhotosArr = [
  [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800'
  ],
  [
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593134257782-e89567b7718a?auto=format&fit=crop&q=80&w=800'
  ],
  [
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&q=80&w=800'
  ]
];

const sheltersList = ['brigada-vigilancia-animal', 'paot', 'agatan'];

export const generateDogs = (count = 800) => {
  const generated = [];
  for (let i = 1; i <= count; i++) {
    const base = baseDogs[i % baseDogs.length];
    const photos = dogPhotosArr[i % dogPhotosArr.length];
    const shelterId = sheltersList[i % sheltersList.length];
    
    generated.push({
      id: `dog-${i}`,
      name: `${base.name} ${i}`,
      size: base.size,
      sex: base.sex,
      age: base.age,
      description: base.desc,
      photos: photos,
      shelterId: shelterId
    });
  }
  return generated;
};

export const dogsData = generateDogs(800);
