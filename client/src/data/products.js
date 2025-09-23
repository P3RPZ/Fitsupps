export const products = [
  {
    id: "whey-protein-1",
    name: "Ultra Whey Protein 2lb",
    image:
      "https://m.media-amazon.com/images/I/71YSOuPlDpL._UF1000,1000_QL80_.jpg",
    price: 39.99,

    category: "Protein",
    description:
      "24g protein per serving, fast-absorbing, great taste. Supports muscle growth and recovery.",
  },
  {
    id: "pre-workout-1",
    image:
      "https://www.performancelab.com/cdn/shop/files/product-prelabpro-main-1.webp?v=1701253591",
    name: "Ignite Pre-Workout 300g",
    price: 29.99,

    category: "Pre-Workout",
    description:
      "Energy and focus blend with 200mg caffeine, beta-alanine, and citrulline malate.",
  },
  {
    id: "multivitamin-1",
    name: "Daily Multivitamin",
    price: 19.99,
    image:
      "https://beastlife.in/cdn/shop/files/front_04769ba5-be92-47e7-a34f-7257c98a7a6c.jpg?v=1742208771",
    category: "Wellness",
    description:
      "Essential vitamins and minerals to support overall health and immunity.",
  },
  {
    id: "creatine-1",
    name: "Creatine Monohydrate 300g",
    price: 24.99,
    image:
      "https://beastlife.in/cdn/shop/files/Image-01_9718492e-2831-467a-80e6-8cccf9110cfd.jpg?v=1745227497",
    category: "Performance",
    description: "Micronized creatine for strength and power. 5g per serving.",
  },
  {
    id: "whey-protein-2",
    name: "Ultra Whey Protein 5lb",
    price: 74.99,
    image:
      "https://m.media-amazon.com/images/I/71YSOuPlDpL._UF1000,1000_QL80_.jpg",
    category: "Protein",
    description:
      "High-quality whey blend. 63 servings. Chocolate and vanilla flavors.",
  },
  {
    id: "plant-protein-1",
    name: "Plant Protein 2lb",
    price: 44.99,
    image:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/opn/opn06803/l/25.jpg",
    category: "Protein",
    description: "Pea and rice protein, dairy-free, complete amino profile.",
  },
  {
    id: "bcaa-1",
    name: "BCAA 2:1:1 300g",
    price: 22.99,
    image:
      "https://mycf.in/cdn/shop/files/Copy_of_BCAA_watermelon.jpg?v=1747994877&width=1445",
    category: "Recovery",
    description:
      "Leucine, isoleucine, valine to support recovery and reduce soreness.",
  },
  {
    id: "electrolyte-1",
    name: "Hydra Electrolyte Mix",
    price: 17.99,
    image:
      "https://m.media-amazon.com/images/I/61OsgdpPYGL._UF1000,1000_QL80_.jpg",
    category: "Hydration",
    description:
      "Sodium, potassium, magnesium for optimal hydration and performance.",
  },
  {
    id: "omega3-1",
    name: "Omega-3 Fish Oil",
    price: 15.99,
    image: "https://beastlife.in/cdn/shop/files/30N-1.jpg?v=1739284662",
    category: "Wellness",
    description: "1000mg fish oil softgels with 300mg EPA/DHA per serving.",
  },
  {
    id: "pre-workout-2",
    name: "Pump No-Stim Pre-Workout",
    price: 32.99,
    image:
      "https://www.performancelab.com/cdn/shop/files/product-prelabpro-main-1.webp?v=1701253591",
    category: "Pre-Workout",
    description:
      "Caffeine-free formula for pumps and endurance with citrulline and nitrates.",
  },
  {
    id: "collagen-1",
    name: "Collagen Peptides 1lb",
    price: 27.99,
    image:
      "https://saschafitness.com/cdn/shop/files/B0B3ZBFPP9.PT01_ca9ca876-b539-4e3b-a66c-4e301ac17fb6.jpg?v=1747347446&width=990",
    category: "Wellness",
    description:
      "Types I & III collagen to support skin, hair, nails, and joints.",
  },
  {
    id: "greens-1",
    name: "Daily Greens Superfood",
    price: 34.99,
    image:
      "https://drnutrition.com/storage/media/5eGBfkP4zwN6sbRudBgZA62B5lPmvxL71OEkaioB.jpg",
    category: "Wellness",
    description:
      "Greens, probiotics, and adaptogens for micronutrients and gut health.",
  },
];

export function getProductById(productId) {
  return products.find((p) => p.id === productId);
}
