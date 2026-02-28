require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productModel");

const products = [
  {
    name: "Ultra Whey Protein 2lb",
    image:
      "https://m.media-amazon.com/images/I/71YSOuPlDpL._UF1000,1000_QL80_.jpg",
    price: 39.99,
    category: "Protein",
    description:
      "24g protein per serving, fast-absorbing, great taste. Supports muscle growth and recovery.",
  },
  {
    name: "Ignite Pre-Workout 300g",
    image:
      "https://www.performancelab.com/cdn/shop/files/product-prelabpro-main-1.webp?v=1701253591",
    price: 29.99,
    category: "Pre-Workout",
    description:
      "Energy and focus blend with 200mg caffeine, beta-alanine, and citrulline malate.",
  },
  {
    name: "Daily Multivitamin",
    price: 19.99,
    image:
      "https://beastlife.in/cdn/shop/files/front_04769ba5-be92-47e7-a34f-7257c98a7a6c.jpg?v=1742208771",
    category: "Wellness",
    description:
      "Essential vitamins and minerals to support overall health and immunity.",
  },
  {
    name: "Creatine Monohydrate 300g",
    price: 24.99,
    image:
      "https://beastlife.in/cdn/shop/files/Image-01_9718492e-2831-467a-80e6-8cccf9110cfd.jpg?v=1745227497",
    category: "Performance",
    description: "Micronized creatine for strength and power. 5g per serving.",
  },
  {
    name: "Ultra Whey Protein 5lb",
    price: 74.99,
    image:
      "https://m.media-amazon.com/images/I/71YSOuPlDpL._UF1000,1000_QL80_.jpg",
    category: "Protein",
    description:
      "High-quality whey blend. 63 servings. Chocolate and vanilla flavors.",
  },
  {
    name: "Plant Protein 2lb",
    price: 44.99,
    image:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/opn/opn06803/l/25.jpg",
    category: "Protein",
    description: "Pea and rice protein, dairy-free, complete amino profile.",
  },
  {
    name: "BCAA 2:1:1 300g",
    price: 22.99,
    image:
      "https://mycf.in/cdn/shop/files/Copy_of_BCAA_watermelon.jpg?v=1747994877&width=1445",
    category: "Recovery",
    description:
      "Leucine, isoleucine, valine to support recovery and reduce soreness.",
  },
  {
    name: "Hydra Electrolyte Mix",
    price: 17.99,
    image:
      "https://m.media-amazon.com/images/I/61OsgdpPYGL._UF1000,1000_QL80_.jpg",
    category: "Hydration",
    description:
      "Sodium, potassium, magnesium for optimal hydration and performance.",
  },
  {
    name: "Omega-3 Fish Oil",
    price: 15.99,
    image: "https://beastlife.in/cdn/shop/files/30N-1.jpg?v=1739284662",
    category: "Wellness",
    description: "1000mg fish oil softgels with 300mg EPA/DHA per serving.",
  },
  {
    name: "Pump No-Stim Pre-Workout",
    price: 32.99,
    image:
      "https://www.performancelab.com/cdn/shop/files/product-prelabpro-main-1.webp?v=1701253591",
    category: "Pre-Workout",
    description:
      "Caffeine-free formula for pumps and endurance with citrulline and nitrates.",
  },
  {
    name: "Collagen Peptides 1lb",
    price: 27.99,
    image:
      "https://saschafitness.com/cdn/shop/files/B0B3ZBFPP9.PT01_ca9ca876-b539-4e3b-a66c-4e301ac17fb6.jpg?v=1747347446&width=990",
    category: "Wellness",
    description:
      "Types I & III collagen to support skin, hair, nails, and joints.",
  },
  {
    name: "Daily Greens Superfood",
    price: 34.99,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR9zxIpWZjndjxOVa-WvnXZYuyfjtF7OIKRyK_HM3uyv7cA87GyshyA9V9J6iJSZY7XUwN6_KtC6TJC2XMvXYoPTHXFSJcJtMjq_bODkz7fBVeoECg3MkY-",
    category: "Wellness",
    description:
      "Greens, probiotics, and adaptogens for micronutrients and gut health.",
  },
  {
    name: "Casein Protein 2lb",
    price: 42.99,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSLMxu4ruTpIEDKGD3t4PJR3YN6Tafp9BoZjNj01Rj2D_TvhUol0n70mtm7DqjZ8lxeCcksU8nABMTaCRv5MVRZTPJB-DclqSLgdWjHJHyB36fuDmBULbIjsg",
    category: "Protein",
    description:
      "Slow-digesting protein for sustained amino release. Ideal for nighttime or between meals.",
  },
  {
    name: "Mass Gainer 6lb",
    price: 54.99,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTlv9s_vDdW1FbQucjgDvp7uLPRaqkG--8UvUZFsmzbov29p6JV5-QtVVsEx-A9mf9C-ePJFnsFaq7IM3nUDrQFM0CZYwu-h42lqrFKLoKV_WJ91t9sIidQ3XI",
    category: "Protein",
    description:
      "1250+ calories per serving. Carbs and protein blend for lean mass gains.",
  },
  {
    name: "Glutamine 300g",
    price: 18.99,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRyC9Jl68FRxZsjkQY4QLANIdzfsuCRv7OGyYd6JAD_jifxax6goDLW0EvDcAT4rR6A34hFt0GnQ_CaYHkVCLAjYmsI1m9tA7iVA72b5ugTURoYMSdCZO0K3A",
    category: "Recovery",
    description:
      "Pure L-glutamine for muscle recovery, gut health, and immunity support.",
  },
  {
    name: "Caffeine Pills 200mg",
    price: 12.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTol8cXzzwahzkpn4CEmkltcXR66N7Jneulj2V9sIEGAX0Z4Q9l8GX4YZjcdUrq85EP_UWNLVILXET1amRlbsMthc_3rtmcN5hczjWygSl2XZ3unbxCVoTESA",
    category: "Pre-Workout",
    description:
      "Clean energy without extra ingredients. 90 servings per bottle.",
  },
  {
    name: "Vitamin D3 5000 IU",
    price: 13.99,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQXG-SwH_42KlAgADPvdvo7NfI1Il2-ukUjNs272G6oKzkrEOxQpwW4-u249AfQ3BG91YGDjuhfs75e7LdjVzPwhI_Mzitudc1xXVKwUqQdYFWpcgBSZ0Tz",
    category: "Wellness",
    description: "Supports bone health, immunity, and mood. 120 softgels.",
  },
  {
    name: "ZMA Sleep Support",
    price: 28.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ-4a8517SQ80k6ZO3MRWdSedAZEvNug1QvnxEMAw7ZYBbeYrOsphGmXtBcsOxQEmJyNRurLxak6S7vo6WSwOc6kft7gad9RQ",
    category: "Wellness",
    description: "Zinc, magnesium, B6. Supports sleep quality and recovery.",
  },
  {
    name: "L-Carnitine 1000mg",
    price: 21.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSjE_c-mEiJPUwAFw7iTTQRtu1jfyPJHyYl8dRH4SiFWqD0I59jfJFSAcz_aM9vqtQktfe22xs8PNA2UKo1Kqut157q0QfTIg5J5IEc5oM0Fgbei9T0UVqgrA",
    category: "Performance",
    description: "Supports fat metabolism and energy. 60 servings.",
  },
  {
    name: "Ashwagandha 600mg",
    price: 24.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSg18hjMwXTrmuvz-5FqJ3m6vWq0zropR6NVLyWSlKEZom23-3gZCvb3e8STbolBN5EYbK894OqcBCzKJTHAy6Fs19QfiSRjfINcNkdYw4pUbB69SWN0eI_yMg",
    category: "Wellness",
    description:
      "KSM-66 extract for stress relief, sleep, and adaptogenic support.",
  },
  {
    name: "Glycine Powder 500g",
    price: 19.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRszzLBV7U8AxC946qhczAuPggfg5Xt4h-KT4UmfKdWIIH_MQx4__yNDNQ2L0u1eHakRmj4T5QUUuNV5v2T5-5cUj5IT1iKjbpOI5Fn_i405Fs4XlSasaFLjsM",
    category: "Recovery",
    description: "Amino acid for sleep, gut health, and collagen synthesis.",
  },
  {
    name: "Beta-Alanine 300g",
    price: 22.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSiJ8a6nGp-8pRIFcnGb1oK2ACl5T6e8pxjkwK21GnyGmTSPjPqrRyo_wIuxMQxxepXNwMFqBLrBANMi6sPUVTZlYomoIUrJn3vw6nE-5whCnUx4uD1UXS4BQ",
    category: "Performance",
    description: "Reduces fatigue during high-intensity exercise. 60 servings.",
  },
  {
    name: "Electrolyte Tablets 20ct",
    price: 14.99,
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRxwgpQViD6rRGXXDqXnlMW8-Ih02w096ViSNl-UfjWEUM96U09OdzfGXAxrVeVYNgVElIzvDsZaK0fTUozYrqTXPOXaS0Bkw",
    category: "Hydration",
    description: "Quick-dissolving tablets. No sugar. Perfect for endurance.",
  },
  {
    name: "Protein Bars 12-Pack",
    price: 29.99,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSgasEmcKmGeiLhcw8rBz125L4jjCv29ICDEd7KNJyiQuV1d5SB2AtX2I1v-2W5m7JtViqEao0xekF8IMGvNYuvW-o7SvCG56zI2AqoXvA7LaKvaUHqNKyA",
    category: "Protein",
    description:
      "20g protein each. Chocolate chip cookie dough flavor. On-the-go fueling.",
  },
  {
    name: "Biotin 10,000mcg",
    price: 11.99,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSuggdNtHdgScyAF_DafL71gnsR59hwges3omkvMAKk42BRAv-M2TbM_i3hbFvQE2TWzx5uu8GswQFy80HQg_ioezY83WYlKuF37XNMmAgC4BMYUl9cZhuFrw",
    category: "Wellness",
    description: "Supports hair, skin, and nail health. 120 tablets.",
  },
  {
    name: "Citrulline Malate 300g",
    price: 26.99,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSpOHhMB6hkolHt4_hzJuOtBtU1jqSMb10v9aFTBX5tPDTkIeK3d406jHtsLYGdwBYUf-vGNkXfxuCTDRTN2WqTe41s2eeyqN1s280t0UiEUljvVmpORODUhw",
    category: "Performance",
    description: "Pump and endurance. 6g per serving. Unflavored.",
  },
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/fitsupps",
    );
    console.log("Connected to database");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(products);
    console.log("Products seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
