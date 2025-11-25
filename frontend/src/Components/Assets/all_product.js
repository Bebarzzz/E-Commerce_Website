import p1_img from "./product_1.png";
import p2_img from "./product_2.png";
import p3_img from "./product_3.png";
import p4_img from "./product_4.png";
import p5_img from "./product_5.png";
import p6_img from "./product_6.png";
import p7_img from "./product_7.png";
import p8_img from "./product_8.png";
import p9_img from "./product_9.png";
import p10_img from "./product_10.png";
import p13_img from "./product_13.png";
import p14_img from "./product_14.png";
import p15_img from "./product_15.png";
import p16_img from "./product_16.png";
import p17_img from "./product_17.png";
import p18_img from "./product_18.png";
import p19_img from "./product_19.png";
import p20_img from "./product_20.png";
import p21_img from "./product_21.png";
import p22_img from "./product_22.png";
import p25_img from "./product_25.png";
import p26_img from "./product_26.png";
import p27_img from "./product_27.png";
import p28_img from "./product_28.png";
import p29_img from "./product_29.png";
import p30_img from "./product_30.png";
import p31_img from "./product_31.png";
import p32_img from "./product_32.png";
import p33_img from "./product_33.png";
import p34_img from "./product_34.png";
import p35_img from "./product_35.png";
import p36_img from "./product_36.png";

let all_product = [
  {
    id: 1,
    name: "2024 Toyota Camry SE",
    category: "new",
    image: p1_img,
    new_price: 28000.0,
    old_price: 29500.0,
  },
  {
    id: 2,
    name: "2024 Honda Civic Sport",
    category: "new",
    image: p2_img,
    new_price: 26000.0,
    old_price: 27500.0,
  },
  {
    id: 3,
    name: "2024 Ford Mustang GT",
    category: "new",
    image: p3_img,
    new_price: 45000.0,
    old_price: 48000.0,
  },
  {
    id: 4,
    name: "2024 Chevrolet Silverado 1500",
    category: "new",
    image: p4_img,
    new_price: 52000.0,
    old_price: 55000.0,
  },
  {
    id: 5,
    name: "2024 BMW 330i",
    category: "new",
    image: p5_img,
    new_price: 48000.0,
    old_price: 50000.0,
  },
  {
    id: 6,
    name: "2024 Mercedes-Benz C-Class",
    category: "new",
    image: p6_img,
    new_price: 49000.0,
    old_price: 51000.0,
  },
  {
    id: 7,
    name: "2024 Audi A4",
    category: "new",
    image: p7_img,
    new_price: 46000.0,
    old_price: 48000.0,
  },
  {
    id: 8,
    name: "2024 Tesla Model 3",
    category: "new",
    image: p8_img,
    new_price: 42000.0,
    old_price: 45000.0,
  },
  {
    id: 9,
    name: "2024 Hyundai Sonata",
    category: "new",
    image: p9_img,
    new_price: 27000.0,
    old_price: 29000.0,
  },
  {
    id: 10,
    name: "2024 Kia K5",
    category: "new",
    image: p10_img,
    new_price: 26500.0,
    old_price: 28500.0,
  },
  {
    id: 13,
    name: "2020 Ford F-150 XLT",
    category: "used",
    image: p13_img,
    new_price: 35000.0,
    old_price: 38000.0,
  },
  {
    id: 14,
    name: "2019 Toyota RAV4 LE",
    category: "used",
    image: p14_img,
    new_price: 22000.0,
    old_price: 25000.0,
  },
  {
    id: 15,
    name: "2018 Honda CR-V EX",
    category: "used",
    image: p15_img,
    new_price: 20000.0,
    old_price: 23000.0,
  },
  {
    id: 16,
    name: "2021 Chevrolet Equinox",
    category: "used",
    image: p16_img,
    new_price: 21000.0,
    old_price: 24000.0,
  },
  {
    id: 17,
    name: "2019 Nissan Rogue",
    category: "used",
    image: p17_img,
    new_price: 18000.0,
    old_price: 21000.0,
  },
  {
    id: 18,
    name: "2020 Jeep Grand Cherokee",
    category: "used",
    image: p18_img,
    new_price: 30000.0,
    old_price: 34000.0,
  },
  {
    id: 19,
    name: "2018 Toyota Highlander",
    category: "used",
    image: p19_img,
    new_price: 28000.0,
    old_price: 32000.0,
  },
  {
    id: 20,
    name: "2019 Ford Explorer",
    category: "used",
    image: p20_img,
    new_price: 29000.0,
    old_price: 33000.0,
  },
  {
    id: 21,
    name: "2021 Subaru Forester",
    category: "used",
    image: p21_img,
    new_price: 25000.0,
    old_price: 28000.0,
  },
  {
    id: 22,
    name: "2020 Mazda CX-9",
    category: "used",
    image: p22_img,
    new_price: 27000.0,
    old_price: 31000.0,
  },
  {
    id: 25,
    name: "2023 Dodge Challenger R/T",
    category: "offer",
    image: p25_img,
    new_price: 38000.0,
    old_price: 42000.0,
  },
  {
    id: 26,
    name: "2023 Chevrolet Camaro SS",
    category: "offer",
    image: p26_img,
    new_price: 40000.0,
    old_price: 45000.0,
  },
  {
    id: 27,
    name: "2023 Ford Mustang EcoBoost",
    category: "offer",
    image: p27_img,
    new_price: 30000.0,
    old_price: 34000.0,
  },
  {
    id: 28,
    name: "2023 Toyota GR86",
    category: "offer",
    image: p28_img,
    new_price: 29000.0,
    old_price: 32000.0,
  },
  {
    id: 29,
    name: "2023 Subaru BRZ",
    category: "offer",
    image: p29_img,
    new_price: 29500.0,
    old_price: 32500.0,
  },
  {
    id: 30,
    name: "2023 Nissan Z",
    category: "offer",
    image: p30_img,
    new_price: 42000.0,
    old_price: 46000.0,
  },
  {
    id: 31,
    name: "2023 BMW 2 Series",
    category: "offer",
    image: p31_img,
    new_price: 39000.0,
    old_price: 43000.0,
  },
  {
    id: 32,
    name: "2023 Audi A3",
    category: "offer",
    image: p32_img,
    new_price: 36000.0,
    old_price: 40000.0,
  },
  {
    id: 33,
    name: "2023 Mercedes-Benz CLA",
    category: "offer",
    image: p33_img,
    new_price: 41000.0,
    old_price: 45000.0,
  },
  {
    id: 34,
    name: "2023 Lexus IS",
    category: "offer",
    image: p34_img,
    new_price: 43000.0,
    old_price: 47000.0,
  },
  {
    id: 35,
    name: "2023 Acura Integra",
    category: "offer",
    image: p35_img,
    new_price: 33000.0,
    old_price: 36000.0,
  },
  {
    id: 36,
    name: "2023 Volkswagen Golf GTI",
    category: "offer",
    image: p36_img,
    new_price: 31000.0,
    old_price: 35000.0,
  },
];

export default all_product;
