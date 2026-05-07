import { useState, useEffect, useRef } from "react";

// ─── SHARED UTILITIES ─────────────────────────────────────────
const exportCSV=(name,headers,rows)=>{
  const csv=[headers.join(","),...rows.map(r=>r.map(c=>typeof c==="string"&&c.includes(",")?`"${c}"`:c).join(","))].join("\n");
  const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=`CHABBS_${name}_${new Date().toISOString().split("T")[0]}.csv`;a.click();URL.revokeObjectURL(url);
};
const todayISO=()=>new Date().toISOString().split("T")[0];

// ─── DEVOTIONS ────────────────────────────────────────────────
const DEVOTIONS=[
  {verse:"Colossians 3:23",text:"Whatever you do, work heartily, as for the Lord and not for men.",value:"Excellence",message:"Serve every guest as if serving God Himself. Let excellence be your signature today."},
  {verse:"Mark 10:43-44",text:"Whoever wants to become great among you must be your servant.",value:"Servant Leadership",message:"True greatness at CHABBS is measured by how well we serve — guests, colleagues, and community alike."},
  {verse:"Proverbs 11:3",text:"The integrity of the upright guides them.",value:"Integrity",message:"In every transaction, every report, every interaction — let your yes be yes. Build trust today."},
  {verse:"Genesis 2:15",text:"The Lord God put man in the garden to work it and keep it.",value:"Stewardship",message:"Our water, electricity, and resources are gifts. Use them wisely. Record accurately. Waste nothing."},
  {verse:"Romans 12:13",text:"Share with the Lord's people who are in need. Practice hospitality.",value:"Hospitality",message:"Every guest brings a story. Welcome them warmly. A smile costs nothing but means everything."},
  {verse:"Philippians 4:8",text:"Whatever is true, noble, right, pure, lovely — think about such things.",value:"Purity of Heart",message:"Let the atmosphere of CHABBS reflect the peace of God. Clean spaces, clean hearts, clean hands."},
  {verse:"Luke 16:10",text:"Whoever is faithful in very little is also faithful in much.",value:"Faithfulness",message:"Check the maintenance log. Update the housekeeping record. Small faithfulness builds great character."},
];

const ROOM_SPECS={
  exec:{name:"Executive",short:"Exec",icon:"👑",ensuite:true,screen:true,bath:true,shower:false,desc:"King bed · Ensuite bathtub · TV screen · Work desk",color:"#C9952A",bg:"#FFF8E1"},
  dl:  {name:"Deluxe Left", short:"DL",icon:"🛏",ensuite:true,screen:false,bath:false,shower:true,desc:"Queen bed · Ensuite shower · Wardrobe",color:"#1565C0",bg:"#E3F2FD"},
  dr:  {name:"Deluxe Right",short:"DR",icon:"🛏",ensuite:true,screen:false,bath:false,shower:true,desc:"Queen bed · Ensuite shower · Wardrobe",color:"#4A148C",bg:"#EDE7F6"},
};
const VILLA_AMENITIES=[
  {icon:"📺",label:"Sitting Room",detail:"Fully furnished · Smart TV · Sofa set"},
  {icon:"🍽",label:"Dining Room",detail:"6-seater table · Full crockery & cutlery"},
  {icon:"🍳",label:"Kitchen",detail:"Cooker + oven · Microwave · Fridge · Full kitchenware"},
  {icon:"🚗",label:"Parking",detail:"Dedicated parking space · Secure compound"},
];

// ─── RESTAURANT DATA ──────────────────────────────────────────
const MENU_CATEGORIES=["Breakfast","Lunch","Dinner","Snacks & Sides","Beverages","Desserts"];
const INITIAL_MENU=[
  // BREAKFAST
  {id:1, name:"Full English Breakfast",cat:"Breakfast",price:650,costPrice:250,desc:"Eggs, sausage, bacon, beans, toast, grilled tomato",available:true,emoji:"🍳",prep:15},
  {id:2, name:"Mandazi & Chai",cat:"Breakfast",price:200,costPrice:50,desc:"Fresh mandazi with Kenyan spiced chai tea",available:true,emoji:"☕",prep:8},
  {id:3, name:"Fruit Salad Bowl",cat:"Breakfast",price:350,costPrice:100,desc:"Fresh tropical fruits with honey drizzle",available:true,emoji:"🍓",prep:10},
  {id:4, name:"Omelette (3 eggs)",cat:"Breakfast",price:420,costPrice:160,desc:"Choice of: plain, cheese, vegetable or chicken",available:true,emoji:"🥚",prep:12},
  {id:5, name:"Pancakes & Syrup",cat:"Breakfast",price:380,costPrice:120,desc:"Fluffy pancakes with maple syrup & butter",available:true,emoji:"🥞",prep:12},
  {id:6, name:"Uji wa Wimbi",cat:"Breakfast",price:180,costPrice:40,desc:"Traditional finger millet porridge",available:true,emoji:"🥣",prep:5},
  // LUNCH
  {id:7, name:"Grilled Tilapia",cat:"Lunch",price:900,costPrice:320,desc:"Whole tilapia, grilled or fried, ugali & kachumbari",available:true,emoji:"🐟",prep:25},
  {id:8, name:"Beef Stew & Ugali",cat:"Lunch",price:650,costPrice:240,desc:"Slow-cooked Turkana beef stew with fresh ugali",available:true,emoji:"🍲",prep:15},
  {id:9, name:"Chicken Biryani",cat:"Lunch",price:750,costPrice:280,desc:"Fragrant basmati rice with spiced chicken",available:true,emoji:"🍛",prep:20},
  {id:10,name:"Club Sandwich",cat:"Lunch",price:550,costPrice:190,desc:"Chicken, bacon, lettuce, tomato, on toasted bread",available:true,emoji:"🥪",prep:15},
  {id:11,name:"Vegetable Pilau",cat:"Lunch",price:480,costPrice:150,desc:"Spiced rice with seasonal vegetables",available:true,emoji:"🫘",prep:20},
  {id:12,name:"Caesar Salad",cat:"Lunch",price:420,costPrice:130,desc:"Romaine, parmesan, croutons, Caesar dressing",available:true,emoji:"🥗",prep:10},
  // DINNER
  {id:13,name:"Nyama Choma Platter",cat:"Dinner",price:1800,costPrice:750,desc:"Premium goat/beef, roasted over charcoal. Serves 2–3",available:true,emoji:"🥩",prep:45},
  {id:14,name:"Grilled Chicken Half",cat:"Dinner",price:900,costPrice:320,desc:"Marinated half chicken, chips or ugali, coleslaw",available:true,emoji:"🍗",prep:30},
  {id:15,name:"Pasta Arrabiata",cat:"Dinner",price:650,costPrice:200,desc:"Penne in spicy tomato sauce, garlic bread",available:true,emoji:"🍝",prep:20},
  {id:16,name:"T-Bone Steak 300g",cat:"Dinner",price:2200,costPrice:900,desc:"Premium beef, mushroom sauce, mashed potato, veg",available:true,emoji:"🥩",prep:35},
  {id:17,name:"Camel Meat Stew",cat:"Dinner",price:1200,costPrice:500,desc:"Turkana specialty — slow-cooked camel, chapati",available:true,emoji:"🍲",prep:40},
  {id:18,name:"Fish & Chips",cat:"Dinner",price:780,costPrice:280,desc:"Battered tilapia fillet, fries, tartar sauce",available:true,emoji:"🐟",prep:20},
  // SNACKS
  {id:19,name:"French Fries",cat:"Snacks & Sides",price:280,costPrice:60,desc:"Crispy golden fries with ketchup",available:true,emoji:"🍟",prep:12},
  {id:20,name:"Chicken Wings (6)",cat:"Snacks & Sides",price:480,costPrice:180,desc:"BBQ or peri-peri glazed wings",available:true,emoji:"🍗",prep:20},
  {id:21,name:"Spring Rolls (4)",cat:"Snacks & Sides",price:320,costPrice:90,desc:"Crispy vegetable spring rolls with sweet chili dip",available:true,emoji:"🥢",prep:15},
  {id:22,name:"Samosas (3)",cat:"Snacks & Sides",price:200,costPrice:55,desc:"Beef or vegetable Kenyan samosas",available:true,emoji:"🫓",prep:8},
  {id:23,name:"Chapati (2)",cat:"Snacks & Sides",price:120,costPrice:25,desc:"Fresh hand-rolled chapati",available:true,emoji:"🫓",prep:10},
  {id:24,name:"Chips Masala",cat:"Snacks & Sides",price:350,costPrice:80,desc:"Spiced fries with tomato & chili masala",available:true,emoji:"🌶️",prep:15},
  // BEVERAGES
  {id:25,name:"Fresh Mango Juice",cat:"Beverages",price:250,costPrice:80,desc:"100% fresh pressed mango",available:true,emoji:"🥭",prep:5},
  {id:26,name:"Passion Fruit Juice",cat:"Beverages",price:250,costPrice:80,desc:"Fresh passion fruit, chilled",available:true,emoji:"🍹",prep:5},
  {id:27,name:"Mineral Water 500ml",cat:"Beverages",price:80,costPrice:30,desc:"Chilled bottled water",available:true,emoji:"💧",prep:1},
  {id:28,name:"Soda (Coke/Fanta/Sprite)",cat:"Beverages",price:120,costPrice:50,desc:"330ml can, chilled",available:true,emoji:"🥤",prep:1},
  {id:29,name:"Kenyan Chai",cat:"Beverages",price:150,costPrice:40,desc:"Spiced milk tea, Kenyan style",available:true,emoji:"☕",prep:5},
  {id:30,name:"Black Coffee",cat:"Beverages",price:180,costPrice:50,desc:"Arabica drip coffee, black or with milk",available:true,emoji:"☕",prep:5},
  {id:31,name:"Avocado Smoothie",cat:"Beverages",price:320,costPrice:90,desc:"Blended avocado, milk, honey",available:true,emoji:"🥑",prep:8},
  {id:32,name:"Watermelon Juice",cat:"Beverages",price:220,costPrice:65,desc:"Fresh blended watermelon, no sugar",available:true,emoji:"🍉",prep:5},
  // DESSERTS
  {id:33,name:"Malva Pudding",cat:"Desserts",price:350,costPrice:120,desc:"Warm sponge pudding, vanilla custard",available:true,emoji:"🍮",prep:15},
  {id:34,name:"Fruit Platter",cat:"Desserts",price:400,costPrice:120,desc:"Seasonal tropical fruits",available:true,emoji:"🍍",prep:10},
  {id:35,name:"Ice Cream (2 scoops)",cat:"Desserts",price:280,costPrice:90,desc:"Vanilla, chocolate or strawberry",available:true,emoji:"🍨",prep:5},
  {id:36,name:"Mandazi & Honey",cat:"Desserts",price:200,costPrice:55,desc:"Fresh mandazi with local honey",available:true,emoji:"🍯",prep:8},
];

const INITIAL_RESTAURANT_ORDERS=[
  {id:1001,table:"Table 3",type:"Dine In",server:"Daniel Ekwang",items:[{menuId:7,name:"Grilled Tilapia",qty:2,price:900},{menuId:29,name:"Kenyan Chai",qty:2,price:150}],total:2100,status:"Served",orderedAt:"2026-03-18T10:30:00",servedAt:"2026-03-18T11:00:00",paid:true,payMethod:"Cash",notes:""},
  {id:1002,table:"Villa 2 – Room Service",type:"Room Service",server:"Celestine Akiru",items:[{menuId:1,name:"Full English Breakfast",qty:3,price:650},{menuId:25,name:"Fresh Mango Juice",qty:3,price:250}],total:2700,status:"Served",orderedAt:"2026-03-18T07:15:00",servedAt:"2026-03-18T07:45:00",paid:true,payMethod:"Room Charge",notes:"For 3 guests"},
  {id:1003,table:"Table 1",type:"Dine In",server:"Prosper Loyo",items:[{menuId:13,name:"Nyama Choma Platter",qty:1,price:1800},{menuId:19,name:"French Fries",qty:2,price:280},{menuId:28,name:"Soda",qty:3,price:120}],total:2720,status:"Preparing",orderedAt:"2026-03-18T12:45:00",servedAt:null,paid:false,payMethod:"",notes:"No onions on the nyama choma"},
  {id:1004,table:"Table 5",type:"Dine In",server:"Daniel Ekwang",items:[{menuId:10,name:"Club Sandwich",qty:2,price:550},{menuId:31,name:"Avocado Smoothie",qty:2,price:320}],total:1740,status:"Pending",orderedAt:"2026-03-18T13:02:00",servedAt:null,paid:false,payMethod:"",notes:""},
  {id:1005,table:"Villa 3 – Room Service",type:"Room Service",server:"Celestine Akiru",items:[{menuId:30,name:"Black Coffee",qty:4,price:180},{menuId:22,name:"Samosas (3)",qty:2,price:200}],total:1120,status:"Ready",orderedAt:"2026-03-18T14:15:00",servedAt:null,paid:false,payMethod:"",notes:"UNICEF team – 4 people"},
];

const INITIAL_VILLAS=Array.from({length:10},(_,i)=>{
  const s=["Available","Occupied","Occupied","Available","Maintenance","Available","Occupied","Cleaning","Available","Available"][i];
  const g=["","Johnson Family","NGO Team – UNICEF","","","","Bishop Omondi","","",""][i];
  const occ=s==="Occupied";
  return{id:i+1,name:`Villa ${i+1}`,status:s,guests:g,lastCleaned:"2026-03-17",rateWhole:12000,rateRoom:4500,
    rooms:[{id:`${i+1}-exec`,type:"exec",status:occ?"Occupied":"Available"},{id:`${i+1}-dl`,type:"dl",status:occ?"Occupied":"Available"},{id:`${i+1}-dr`,type:"dr",status:"Available"}]};
});

const INITIAL_BOOKINGS=[
  {id:1,guest:"Johnson Family",phone:"+254 712 345 678",idNo:"28734561",checkIn:"2026-03-16",checkOut:"2026-03-20",type:"Whole Villa",villaId:2,rooms:[],status:"Checked In",payment:"Paid",amount:48000,nights:4,color:"#1565C0",deposit:48000,source:"Referral",checkInTime:"2026-03-16T14:20:00",checkOutTime:null},
  {id:2,guest:"UNICEF Field Team",phone:"+254 733 456 789",idNo:"ORG-2847",checkIn:"2026-03-15",checkOut:"2026-03-22",type:"Whole Villa",villaId:3,rooms:[],status:"Checked In",payment:"Invoice",amount:84000,nights:7,color:"#6A1B9A",deposit:40000,source:"Repeat Guest",checkInTime:"2026-03-15T11:00:00",checkOutTime:null},
  {id:3,guest:"Bishop Emmanuel Omondi",phone:"+254 722 567 890",idNo:"39812045",checkIn:"2026-03-17",checkOut:"2026-03-19",type:"Whole Villa",villaId:7,rooms:[],status:"Checked In",payment:"Paid",amount:24000,nights:2,color:"#2E7D32",deposit:24000,source:"Referral",checkInTime:"2026-03-17T15:30:00",checkOutTime:null},
  {id:4,guest:"Dr. Amina Hassan",phone:"+254 701 678 901",idNo:"47291038",checkIn:"2026-03-19",checkOut:"2026-03-21",type:"Per Room",villaId:1,rooms:["exec"],status:"Upcoming",payment:"Deposit",amount:9000,nights:2,color:"#E65100",deposit:4500,source:"Phone",checkInTime:null,checkOutTime:null},
  {id:5,guest:"Turkana County Governor",phone:"+254 745 789 012",idNo:"GOV-TC-001",checkIn:"2026-03-20",checkOut:"2026-03-23",type:"Whole Villa",villaId:4,rooms:[],status:"Upcoming",payment:"Pending",amount:36000,nights:3,color:"#B71C1C",deposit:0,source:"Referral",checkInTime:null,checkOutTime:null},
  {id:6,guest:"Rev. Samuel Ekiru",phone:"+254 708 111 222",idNo:"55678901",checkIn:"2026-03-24",checkOut:"2026-03-26",type:"Whole Villa",villaId:6,rooms:[],status:"Upcoming",payment:"Deposit",amount:24000,nights:2,color:"#004D40",deposit:10000,source:"Repeat Guest",checkInTime:null,checkOutTime:null},
  {id:7,guest:"Médecins Sans Frontières",phone:"+254 734 333 444",idNo:"MSF-LDW02",checkIn:"2026-03-10",checkOut:"2026-03-18",type:"Whole Villa",villaId:9,rooms:[],status:"Checked Out",payment:"Paid",amount:96000,nights:8,color:"#37474F",deposit:96000,source:"Google",checkInTime:"2026-03-10T12:00:00",checkOutTime:"2026-03-18T10:00:00"},
  {id:8,guest:"Dr. Nakiru Loise",phone:"+254 720 555 666",idNo:"61234567",checkIn:"2026-03-28",checkOut:"2026-03-30",type:"Per Room",villaId:5,rooms:["dl","dr"],status:"Upcoming",payment:"Pending",amount:18000,nights:2,color:"#880E4F",deposit:0,source:"Walk-in",checkInTime:null,checkOutTime:null},
];

const INITIAL_STAFF=[
  {id:1,name:"Aggrey Ochieng",role:"General Manager",dept:"Management",phone:"+254 722 100 001",idNo:"12345678",hire:"2022-01-15",salary:85000,nssf:1080,nhif:1700,tax:18600,bank:"Equity Bank",acc:"0123456789",status:"Active",photo:"👨‍💼",photoUrl:"",dob:"1978-05-12",gender:"Male",address:"Lodwar Town, Turkana County",emergencyName:"Ruth Ochieng",emergencyPhone:"+254 722 200 001",emergencyRel:"Spouse",nssf_no:"NS001234",nhif_no:"NH001234",kra_pin:"A001234567B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:true},notes:"Founder and General Manager. Oversees all operations."},
  {id:2,name:"Martha Auma",role:"Assistant Manager",dept:"Management",phone:"+254 733 100 002",idNo:"23456789",hire:"2022-03-01",salary:55000,nssf:1080,nhif:1700,tax:9000,bank:"KCB",acc:"1234567890",status:"Active",photo:"👩‍💼",photoUrl:"",dob:"1985-09-23",gender:"Female",address:"Nawoitorong, Lodwar",emergencyName:"James Auma",emergencyPhone:"+254 733 200 002",emergencyRel:"Brother",nssf_no:"NS002345",nhif_no:"NH002345",kra_pin:"A002345678B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:true},notes:"Handles sales, marketing and client relations."},
  {id:3,name:"Daniel Ekwang",role:"Head Receptionist",dept:"Front Office",phone:"+254 700 100 003",idNo:"34567890",hire:"2022-06-15",salary:38000,nssf:1080,nhif:1000,tax:4800,bank:"Cooperative",acc:"2345678901",status:"Active",photo:"👨‍💻",photoUrl:"",dob:"1990-03-07",gender:"Male",address:"Kalokol Road, Lodwar",emergencyName:"Agnes Ekwang",emergencyPhone:"+254 700 200 003",emergencyRel:"Mother",nssf_no:"NS003456",nhif_no:"NH003456",kra_pin:"A003456789B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:false,certificates:false},notes:"Excellent guest relations. Fluent in English, Swahili and Turkana."},
  {id:4,name:"Celestine Akiru",role:"Receptionist",dept:"Front Office",phone:"+254 711 100 004",idNo:"45678901",hire:"2023-01-10",salary:28000,nssf:1080,nhif:1000,tax:2400,bank:"Equity Bank",acc:"3456789012",status:"Active",photo:"👩‍💻",photoUrl:"",dob:"1995-11-14",gender:"Female",address:"Turkwel Estate, Lodwar",emergencyName:"Peter Akiru",emergencyPhone:"+254 711 200 004",emergencyRel:"Father",nssf_no:"NS004567",nhif_no:"NH004567",kra_pin:"A004567890B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:false,nssf:false,certificates:false},notes:"On probation until March 2023. Reliable attendance."},
  {id:5,name:"Prosper Loyo",role:"Receptionist",dept:"Front Office",phone:"+254 712 100 005",idNo:"56789012",hire:"2023-06-01",salary:28000,nssf:1080,nhif:1000,tax:2400,bank:"Absa",acc:"4567890123",status:"Active",photo:"👨‍💻",photoUrl:"",dob:"1992-06-30",gender:"Male",address:"KENHA Road, Lodwar",emergencyName:"Mary Loyo",emergencyPhone:"+254 712 200 005",emergencyRel:"Spouse",nssf_no:"NS005678",nhif_no:"NH005678",kra_pin:"A005678901B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:false},notes:""},
  {id:6,name:"Grace Akello",role:"Head Housekeeper",dept:"Housekeeping",phone:"+254 701 100 006",idNo:"67890123",hire:"2022-04-20",salary:32000,nssf:1080,nhif:1000,tax:3000,bank:"KCB",acc:"5678901234",status:"Active",photo:"👩‍🍳",photoUrl:"",dob:"1983-02-28",gender:"Female",address:"Namuruputh, Lodwar",emergencyName:"David Akello",emergencyPhone:"+254 701 200 006",emergencyRel:"Spouse",nssf_no:"NS006789",nhif_no:"NH006789",kra_pin:"A006789012B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:true},notes:"Outstanding performance. Sets the standard for the housekeeping team."},
  {id:7,name:"Sarah Lopeyok",role:"Housekeeper",dept:"Housekeeping",phone:"+254 724 100 007",idNo:"78901234",hire:"2023-02-14",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Equity Bank",acc:"6789012345",status:"Active",photo:"👩",photoUrl:"",dob:"1997-08-05",gender:"Female",address:"Natapala, Lodwar",emergencyName:"Joseph Lopeyok",emergencyPhone:"+254 724 200 007",emergencyRel:"Father",nssf_no:"NS007890",nhif_no:"NH007890",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:false,nssf:false,certificates:false},notes:""},
  {id:8,name:"Mary Wanjiku",role:"Housekeeper",dept:"Housekeeping",phone:"+254 735 100 008",idNo:"89012345",hire:"2023-09-01",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Cooperative",acc:"7890123456",status:"Active",photo:"👩",photoUrl:"",dob:"1994-04-19",gender:"Female",address:"Lodwar Town",emergencyName:"John Wanjiku",emergencyPhone:"+254 735 200 008",emergencyRel:"Spouse",nssf_no:"NS008901",nhif_no:"NH008901",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:false,nhifCard:false,nssf:false,certificates:false},notes:""},
  {id:9,name:"James Okwany",role:"Head of Maintenance",dept:"Maintenance",phone:"+254 746 100 009",idNo:"90123456",hire:"2022-02-28",salary:40000,nssf:1080,nhif:1000,tax:5400,bank:"KCB",acc:"8901234567",status:"Active",photo:"👨‍🔧",photoUrl:"",dob:"1981-12-10",gender:"Male",address:"Kalokol, Turkana",emergencyName:"Ruth Okwany",emergencyPhone:"+254 746 200 009",emergencyRel:"Spouse",nssf_no:"NS009012",nhif_no:"NH009012",kra_pin:"A009012345B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:true},notes:"Certified plumber and electrician. Key resource for borehole maintenance."},
  {id:10,name:"Peter Kimani",role:"Maintenance Technician",dept:"Maintenance",phone:"+254 707 100 010",idNo:"01234567",hire:"2023-03-15",salary:28000,nssf:1080,nhif:1000,tax:2400,bank:"Equity Bank",acc:"9012345678",status:"Active",photo:"👨‍🔧",photoUrl:"",dob:"1993-07-22",gender:"Male",address:"Lodwar Town",emergencyName:"Jane Kimani",emergencyPhone:"+254 707 200 010",emergencyRel:"Spouse",nssf_no:"NS010123",nhif_no:"NH010123",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:false,certificates:false},notes:""},
  {id:11,name:"Chef Emmanuel Liru",role:"Head Chef",dept:"Kitchen",phone:"+254 718 100 011",idNo:"11234567",hire:"2022-07-01",salary:45000,nssf:1080,nhif:1700,tax:6600,bank:"Absa",acc:"0123456780",status:"Active",photo:"👨‍🍳",photoUrl:"",dob:"1980-01-17",gender:"Male",address:"Turkwel, Lodwar",emergencyName:"Esther Liru",emergencyPhone:"+254 718 200 011",emergencyRel:"Spouse",nssf_no:"NS011234",nhif_no:"NH011234",kra_pin:"A011234567B",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:true},notes:"Trained at Kenya Utalii College. Specialises in Kenyan and continental cuisine."},
  {id:12,name:"Joyce Nakwam",role:"Kitchen Assistant",dept:"Kitchen",phone:"+254 729 100 012",idNo:"22345678",hire:"2024-01-15",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Cooperative",acc:"1234567891",status:"Active",photo:"👩‍🍳",photoUrl:"",dob:"1999-03-03",gender:"Female",address:"Lodwar Town",emergencyName:"Tom Nakwam",emergencyPhone:"+254 729 200 012",emergencyRel:"Father",nssf_no:"NS012345",nhif_no:"NH012345",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:false,nssf:false,certificates:false},notes:"New hire — on probation until July 2024."},
  {id:13,name:"Paul Esekon",role:"Security Officer",dept:"Security",phone:"+254 740 100 013",idNo:"33456789",hire:"2022-10-01",salary:20000,nssf:1080,nhif:500,tax:0,bank:"KCB",acc:"2345678902",status:"Active",photo:"💂",photoUrl:"",dob:"1988-09-09",gender:"Male",address:"Nawoitorong, Lodwar",emergencyName:"Betty Esekon",emergencyPhone:"+254 740 200 013",emergencyRel:"Spouse",nssf_no:"NS013456",nhif_no:"NH013456",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:false},notes:"Former G4S officer. Night shift lead."},
  {id:14,name:"John Losike",role:"Security Officer",dept:"Security",phone:"+254 751 100 014",idNo:"44567890",hire:"2023-07-01",salary:20000,nssf:1080,nhif:500,tax:0,bank:"Equity Bank",acc:"3456789013",status:"Active",photo:"💂",photoUrl:"",dob:"1991-11-25",gender:"Male",address:"Lodwar Town",emergencyName:"Alice Losike",emergencyPhone:"+254 751 200 014",emergencyRel:"Spouse",nssf_no:"NS014567",nhif_no:"NH014567",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:false,nssf:false,certificates:false},notes:""},
  {id:15,name:"Simon Ewoton",role:"Driver / Groundskeeper",dept:"Operations",phone:"+254 762 100 015",idNo:"55678901",hire:"2023-04-20",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Cooperative",acc:"4567890124",status:"Active",photo:"🚗",photoUrl:"",dob:"1986-06-14",gender:"Male",address:"Kalokol Road, Lodwar",emergencyName:"Agnes Ewoton",emergencyPhone:"+254 762 200 015",emergencyRel:"Mother",nssf_no:"NS015678",nhif_no:"NH015678",kra_pin:"",leaveDate:null,leaveReason:"",docs:{contract:true,idCopy:true,nhifCard:true,nssf:false,certificates:false},notes:"Valid BCE driver's licence. Also manages garden & grounds."},
  // Former staff (kept for records)
  {id:16,name:"Betty Akiteng",role:"Receptionist",dept:"Front Office",phone:"+254 700 900 016",idNo:"66789012",hire:"2022-06-15",salary:26000,nssf:1080,nhif:1000,tax:1800,bank:"Equity Bank",acc:"5678901235",status:"Left",photo:"👩‍💻",photoUrl:"",dob:"1993-02-11",gender:"Female",address:"Lodwar Town",emergencyName:"Mark Akiteng",emergencyPhone:"+254 700 900 017",emergencyRel:"Spouse",nssf_no:"NS016789",nhif_no:"NH016789",kra_pin:"",leaveDate:"2024-08-31",leaveReason:"Resigned — relocated to Nairobi",docs:{contract:true,idCopy:true,nhifCard:true,nssf:true,certificates:false},notes:"Good performance record. Left on good terms."},
  {id:17,name:"Dennis Omondi",role:"Maintenance Technician",dept:"Maintenance",phone:"+254 711 900 017",idNo:"77890123",hire:"2022-03-01",salary:25000,nssf:1080,nhif:500,tax:1200,bank:"KCB",acc:"6789012346",status:"Dismissed",photo:"👨‍🔧",photoUrl:"",dob:"1987-07-30",gender:"Male",address:"Turkwel, Lodwar",emergencyName:"Susan Omondi",emergencyPhone:"+254 711 900 018",emergencyRel:"Spouse",nssf_no:"NS017890",nhif_no:"NH017890",kra_pin:"",leaveDate:"2024-03-15",leaveReason:"Dismissed — theft of resort property (confirmed CCTV evidence). Certificate of Service withheld.",docs:{contract:true,idCopy:true,nhifCard:false,nssf:false,certificates:false},notes:"Do not rehire. Case documented with local authorities."},
];

const CUR_MONTH="March 2026";
const ACTIVE_STAFF_IDS=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const makePayroll=(month,paidDate,pendingIds=[])=>INITIAL_STAFF.filter(s=>ACTIVE_STAFF_IDS.includes(s.id)).map(s=>{const gross=s.salary,ded=s.nssf+s.nhif+s.tax,net=gross-ded;return{id:parseInt(`${s.id}${month.replace(/\D/g,"")}`.slice(0,9)),staffId:s.id,month,gross,nssf:s.nssf,nhif:s.nhif,tax:s.tax,deductions:ded,net,status:pendingIds.includes(s.id)?"Pending":"Paid",paidDate:pendingIds.includes(s.id)?null:paidDate,notes:""};});
const INITIAL_PAYROLL=[
  ...INITIAL_STAFF.filter(s=>ACTIVE_STAFF_IDS.includes(s.id)).map(s=>{const gross=s.salary,ded=s.nssf+s.nhif+s.tax,net=gross-ded;return{id:s.id,staffId:s.id,month:CUR_MONTH,gross,nssf:s.nssf,nhif:s.nhif,tax:s.tax,deductions:ded,net,status:s.id<=5?"Paid":"Pending",paidDate:s.id<=5?"2026-03-28":null,notes:""};}),
  ...makePayroll("February 2026","2026-02-28",[]),
  ...makePayroll("January 2026","2026-01-31",[]),
  ...makePayroll("December 2025","2025-12-30",[]),
  ...makePayroll("November 2025","2025-11-28",[]),
  ...makePayroll("October 2025","2025-10-31",[]),
  ...makePayroll("September 2025","2025-09-30",[]),
  ...makePayroll("August 2025","2025-08-29",[]),
  ...makePayroll("July 2025","2025-07-31",[]),
  ...makePayroll("June 2025","2025-06-30",[]),
  ...makePayroll("May 2025","2025-05-30",[]),
  ...makePayroll("April 2025","2025-04-30",[]),
  ...makePayroll("March 2025","2025-03-31",[]),
];

const INITIAL_TRAINING=[
  {id:1,staffId:1,course:"First Aid & CPR",completedDate:"2025-06-10",expiryDate:"2026-06-10",status:"Valid",certNo:"FA-2025-001"},
  {id:2,staffId:2,course:"First Aid & CPR",completedDate:"2025-06-10",expiryDate:"2026-06-10",status:"Valid",certNo:"FA-2025-002"},
  {id:3,staffId:3,course:"Customer Service Excellence",completedDate:"2025-09-15",expiryDate:"2026-09-15",status:"Valid",certNo:"CS-2025-003"},
  {id:4,staffId:6,course:"First Aid & CPR",completedDate:"2024-12-01",expiryDate:"2025-12-01",status:"Expired",certNo:"FA-2024-006"},
  {id:5,staffId:6,course:"Food Hygiene & Safety",completedDate:"2025-03-20",expiryDate:"2026-03-20",status:"Valid",certNo:"FH-2025-006"},
  {id:6,staffId:9,course:"First Aid & CPR",completedDate:"2025-01-15",expiryDate:"2026-01-15",status:"Expired",certNo:"FA-2025-009"},
  {id:7,staffId:9,course:"Electrical Safety",completedDate:"2025-05-10",expiryDate:"2027-05-10",status:"Valid",certNo:"ES-2025-009"},
  {id:8,staffId:11,course:"Food Hygiene & Safety",completedDate:"2025-07-01",expiryDate:"2026-07-01",status:"Valid",certNo:"FH-2025-011"},
  {id:9,staffId:11,course:"First Aid & CPR",completedDate:"2025-06-10",expiryDate:"2026-06-10",status:"Valid",certNo:"FA-2025-011"},
  {id:10,staffId:12,course:"Food Hygiene & Safety",completedDate:"2025-08-15",expiryDate:"2026-08-15",status:"Valid",certNo:"FH-2025-012"},
  {id:11,staffId:13,course:"Fire Safety & Evacuation",completedDate:"2025-04-05",expiryDate:"2026-04-05",status:"Valid",certNo:"FS-2025-013"},
  {id:12,staffId:14,course:"Fire Safety & Evacuation",completedDate:"2025-04-05",expiryDate:"2026-04-05",status:"Valid",certNo:"FS-2025-014"},
  {id:13,staffId:15,course:"Defensive Driving",completedDate:"2024-11-20",expiryDate:"2026-11-20",status:"Valid",certNo:"DD-2024-015"},
];

const INITIAL_ADVANCES=[
  {id:1,staffId:7,staffName:"Sarah Lopeyok",amount:5000,reason:"School fees for child",date:"2026-03-05",repayMonths:2,repaidMonths:0,status:"Active",approvedBy:"Aggrey Ochieng"},
  {id:2,staffId:10,staffName:"Peter Kimani",amount:8000,reason:"Medical emergency",date:"2026-02-20",repayMonths:3,repaidMonths:1,status:"Active",approvedBy:"Aggrey Ochieng"},
  {id:3,staffId:12,staffName:"Joyce Nakwam",amount:3000,reason:"House rent deposit",date:"2026-01-15",repayMonths:2,repaidMonths:2,status:"Cleared",approvedBy:"Martha Auma"},
  {id:4,staffId:15,staffName:"Simon Ewoton",amount:6000,reason:"Funeral expenses",date:"2026-03-10",repayMonths:2,repaidMonths:0,status:"Pending Approval",approvedBy:""},
];

const INITIAL_LEAVES=[
  {id:1,staffId:7,staffName:"Sarah Lopeyok",type:"Annual Leave",from:"2026-04-07",to:"2026-04-14",days:7,reason:"Family visit",status:"Approved",approvedBy:"Grace Akello",appliedOn:"2026-03-12"},
  {id:2,staffId:10,staffName:"Peter Kimani",type:"Sick Leave",from:"2026-03-11",to:"2026-03-12",days:2,reason:"Malaria treatment",status:"Approved",approvedBy:"James Okwany",appliedOn:"2026-03-11"},
  {id:3,staffId:4,staffName:"Celestine Akiru",type:"Compassionate",from:"2026-03-20",to:"2026-03-22",days:3,reason:"Bereavement – uncle",status:"Pending",approvedBy:"",appliedOn:"2026-03-15"},
  {id:4,staffId:12,staffName:"Joyce Nakwam",type:"Annual Leave",from:"2026-04-21",to:"2026-04-25",days:5,reason:"Personal",status:"Pending",approvedBy:"",appliedOn:"2026-03-14"},
  {id:5,staffId:13,staffName:"Paul Esekon",type:"Annual Leave",from:"2026-05-01",to:"2026-05-10",days:10,reason:"Home travel – Turkana",status:"Approved",approvedBy:"Aggrey Ochieng",appliedOn:"2026-03-01"},
];

const INITIAL_LEAVE_BAL=INITIAL_STAFF.map((s,i)=>({staffId:s.id,annual:21,annualUsed:[7,0,0,0,0,5,7,0,0,0,0,5,10,0,0][i]||0,sick:10,sickUsed:[0,0,0,0,0,0,0,2,0,2,0,0,0,0,0][i]||0,compassionate:3,compassionateUsed:[0,0,0,3,0,0,0,0,0,0,0,0,0,0,0][i]||0}));

const INITIAL_SHIFTS=[
  {id:1,staffId:3,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Present"},
  {id:2,staffId:4,date:"2026-03-18",shift:"Afternoon 2PM–10PM",status:"Present"},
  {id:3,staffId:6,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Present"},
  {id:4,staffId:7,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Present"},
  {id:5,staffId:8,date:"2026-03-18",shift:"Afternoon 2PM–10PM",status:"Late"},
  {id:6,staffId:9,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Present"},
  {id:7,staffId:11,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Present"},
  {id:8,staffId:12,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Present"},
  {id:9,staffId:13,date:"2026-03-18",shift:"Night 10PM–6AM",status:"Present"},
  {id:10,staffId:14,date:"2026-03-18",shift:"Morning 6AM–2PM",status:"Absent"},
];

const INITIAL_PERFORMANCE=[
  {id:1,staffId:3,period:"Q1 2026",punctuality:4,cleanliness:4,guestSatisfaction:5,teamwork:4,initiative:3,overall:4.0,comments:"Excellent front desk presence. Guests love his warm welcome.",reviewer:"Aggrey Ochieng",date:"2026-03-15"},
  {id:2,staffId:6,period:"Q1 2026",punctuality:5,cleanliness:5,guestSatisfaction:5,teamwork:5,initiative:4,overall:4.8,comments:"Outstanding. Villas are immaculate. Sets the standard for the team.",reviewer:"Martha Auma",date:"2026-03-15"},
  {id:3,staffId:9,period:"Q1 2026",punctuality:4,cleanliness:3,guestSatisfaction:4,teamwork:5,initiative:5,overall:4.2,comments:"Great problem solver. Fixed the borehole pump ahead of schedule.",reviewer:"Aggrey Ochieng",date:"2026-03-15"},
  {id:4,staffId:11,period:"Q1 2026",punctuality:5,cleanliness:5,guestSatisfaction:5,teamwork:4,initiative:4,overall:4.6,comments:"Guests rave about the food. Breakfast service is a highlight.",reviewer:"Aggrey Ochieng",date:"2026-03-15"},
];

const INITIAL_INVENTORY=[
  {id:1,name:"Bed Linen Sets",category:"Housekeeping",unit:"Sets",qty:45,minQty:20,unitCost:2500,lastRestocked:"2026-03-01",supplier:"Nairobi Textiles",expiryDate:null},
  {id:2,name:"Towels (Bath)",category:"Housekeeping",unit:"Pcs",qty:90,minQty:30,unitCost:450,lastRestocked:"2026-03-01",supplier:"Nairobi Textiles",expiryDate:null},
  {id:3,name:"Toilet Paper Rolls",category:"Housekeeping",unit:"Rolls",qty:200,minQty:80,unitCost:30,lastRestocked:"2026-03-10",supplier:"Mega Superstore",expiryDate:null},
  {id:4,name:"Hand Soap (bars)",category:"Housekeeping",unit:"Pcs",qty:80,minQty:40,unitCost:60,lastRestocked:"2026-03-10",supplier:"Mega Superstore",expiryDate:null},
  {id:5,name:"Descaling Solution 5L",category:"Maintenance",unit:"Litres",qty:15,minQty:10,unitCost:800,lastRestocked:"2026-02-15",supplier:"Plumbing Hub Lodwar",expiryDate:"2026-04-10"},
  {id:6,name:"AC Filters",category:"Maintenance",unit:"Pcs",qty:6,minQty:5,unitCost:1200,lastRestocked:"2026-01-20",supplier:"Nairobi HVAC",expiryDate:null},
  {id:7,name:"Cooking Gas 13kg",category:"Kitchen",unit:"Cylinders",qty:8,minQty:4,unitCost:3200,lastRestocked:"2026-03-12",supplier:"Afrigas Lodwar",expiryDate:null},
  {id:8,name:"Mineral Water 500ml",category:"Kitchen",unit:"Crates",qty:24,minQty:10,unitCost:600,lastRestocked:"2026-03-15",supplier:"Mega Superstore",expiryDate:"2026-04-20"},
  {id:9,name:"Laundry Detergent 5kg",category:"Housekeeping",unit:"Bags",qty:12,minQty:6,unitCost:1100,lastRestocked:"2026-03-05",supplier:"Mega Superstore",expiryDate:null},
  {id:10,name:"Pool Chlorine",category:"Maintenance",unit:"Kgs",qty:20,minQty:8,unitCost:350,lastRestocked:"2026-02-28",supplier:"Plumbing Hub Lodwar",expiryDate:"2026-04-30"},
  {id:11,name:"Disposable Gloves",category:"Housekeeping",unit:"Boxes",qty:20,minQty:10,unitCost:280,lastRestocked:"2026-03-10",supplier:"Mega Superstore",expiryDate:null},
  {id:12,name:"LED Light Bulbs",category:"Maintenance",unit:"Pcs",qty:30,minQty:15,unitCost:180,lastRestocked:"2026-03-01",supplier:"Electronics Hub",expiryDate:null},
  {id:13,name:"Tea & Coffee Packs",category:"Kitchen",unit:"Packs",qty:30,minQty:15,unitCost:220,lastRestocked:"2026-03-14",supplier:"Mega Superstore",expiryDate:"2026-06-30"},
  {id:14,name:"Hand Sanitizer 1L",category:"Housekeeping",unit:"Bottles",qty:18,minQty:10,unitCost:450,lastRestocked:"2026-03-10",supplier:"Mega Superstore",expiryDate:"2026-09-01"},
];

const INITIAL_SUPPLIERS=[
  {id:1,name:"Nairobi Textiles",contact:"David Kimani",phone:"+254 722 100 200",email:"sales@nairobetextiles.co.ke",category:"Housekeeping",rating:4,leadTime:"5-7 days",paymentTerms:"30 days net",lastOrder:"2026-03-01",notes:"Reliable supplier for linen and towels"},
  {id:2,name:"Mega Superstore",contact:"Jane Wachira",phone:"+254 700 300 400",email:"wholesale@megastore.co.ke",category:"General",rating:5,leadTime:"1-2 days",paymentTerms:"Cash on delivery",lastOrder:"2026-03-15",notes:"Best for bulk household and kitchen supplies"},
  {id:3,name:"Plumbing Hub Lodwar",contact:"Samuel Ekiru",phone:"+254 714 500 600",email:"plumbinghublodwar@gmail.com",category:"Maintenance",rating:3,leadTime:"1-3 days",paymentTerms:"Cash",lastOrder:"2026-02-28",notes:"Local supplier — limited stock, confirm availability first"},
  {id:4,name:"Afrigas Lodwar",contact:"Paul Lokuya",phone:"+254 720 700 800",email:"afrigas.lodwar@afrigas.co.ke",category:"Kitchen",rating:5,leadTime:"Same day",paymentTerms:"Cash",lastOrder:"2026-03-12",notes:"Sole gas supplier in Lodwar — maintain good relationship"},
  {id:5,name:"Electronics Hub",contact:"Peter Ochieng",phone:"+254 733 900 100",email:"sales@electronicshub.co.ke",category:"Maintenance",rating:4,leadTime:"3-5 days",paymentTerms:"50% advance",lastOrder:"2026-03-01",notes:"Bulbs, wiring, switches"},
  {id:6,name:"Nairobi HVAC",contact:"Emmanuel Otieno",phone:"+254 711 200 300",email:"orders@nairobihvac.co.ke",category:"Maintenance",rating:4,leadTime:"7-10 days",paymentTerms:"Invoice 14 days",lastOrder:"2026-01-20",notes:"AC units, filters, spare parts — order well in advance"},
];

const INITIAL_POS=[
  {id:1,poNumber:"PO-2026-001",supplier:"Nairobi Textiles",date:"2026-03-01",items:[{name:"Bed Linen Sets",qty:20,unitCost:2500,total:50000},{name:"Towels (Bath)",qty:30,unitCost:450,total:13500}],total:63500,status:"Delivered",deliveredDate:"2026-03-06",notes:"Received in good condition"},
  {id:2,poNumber:"PO-2026-002",supplier:"Mega Superstore",date:"2026-03-10",items:[{name:"Toilet Paper Rolls",qty:100,unitCost:30,total:3000},{name:"Hand Soap (bars)",qty:40,unitCost:60,total:2400},{name:"Disposable Gloves",qty:10,unitCost:280,total:2800}],total:8200,status:"Delivered",deliveredDate:"2026-03-11",notes:""},
  {id:3,poNumber:"PO-2026-003",supplier:"Afrigas Lodwar",date:"2026-03-12",items:[{name:"Cooking Gas 13kg",qty:4,unitCost:3200,total:12800}],total:12800,status:"Delivered",deliveredDate:"2026-03-12",notes:"Same-day delivery"},
  {id:4,poNumber:"PO-2026-004",supplier:"Plumbing Hub Lodwar",date:"2026-03-28",items:[{name:"Descaling Solution 5L",qty:5,unitCost:800,total:4000},{name:"Pool Chlorine",qty:10,unitCost:350,total:3500}],total:7500,status:"Sent",deliveredDate:"",notes:"Awaiting delivery"},
  {id:5,poNumber:"PO-2026-005",supplier:"Nairobi HVAC",date:"2026-04-02",items:[{name:"AC Filters",qty:5,unitCost:1200,total:6000}],total:6000,status:"Draft",deliveredDate:"",notes:"Pending manager approval"},
];

const INITIAL_FEEDBACK=[
  {id:1,guest:"Johnson Family",villa:"Villa 2",rating:5,date:"2026-03-15",comment:"Absolutely stunning villas! The executive room is world-class. Staff are incredibly kind.",category:"Excellent",recommend:true,nps:10,responded:true,respondedBy:"Martha Auma",respondedDate:"2026-03-16"},
  {id:2,guest:"UNICEF Field Team",villa:"Villa 3",rating:4,date:"2026-03-16",comment:"Great value for money. Kitchen well-equipped for self-catering. The restaurant food was excellent too!",category:"Very Good",recommend:true,nps:9,responded:true,respondedBy:"Aggrey Ochieng",respondedDate:"2026-03-17"},
  {id:3,guest:"MSF Kenya",villa:"Villa 9",rating:5,date:"2026-03-18",comment:"Best accommodation in Turkana by far. Clean, safe, peaceful. The nyama choma was outstanding!",category:"Excellent",recommend:true,nps:10,responded:false,respondedBy:"",respondedDate:""},
  {id:4,guest:"Grace Mutua",villa:"Villa 1",rating:3,date:"2026-03-10",comment:"Good place overall. Restaurant service was a little slow but food quality was good.",category:"Good",recommend:true,nps:7,responded:false,respondedBy:"",respondedDate:""},
  {id:5,guest:"Bishop Emmanuel Omondi",villa:"Villa 7",rating:5,date:"2026-03-19",comment:"A truly Christian atmosphere. Food from the kitchen was excellent. Will recommend to our diocese.",category:"Excellent",recommend:true,nps:10,responded:false,respondedBy:"",respondedDate:""},
];

const INITIAL_LOSTFOUND=[
  {id:1,item:"Samsung Galaxy S24 – black",foundAt:"Villa 3",foundBy:"Sarah Lopeyok",foundDate:"2026-03-15",status:"Claimed",claimedBy:"UNICEF Team",claimDate:"2026-03-16",notes:"Handed to guest at checkout"},
  {id:2,item:"Blue swimming shorts",foundAt:"Pool Area",foundBy:"James Okwany",foundDate:"2026-03-17",status:"In Storage",claimedBy:"",claimDate:"",notes:"Stored in lost & found box"},
  {id:3,item:"Reading glasses – rectangular",foundAt:"Villa 7",foundBy:"Grace Akello",foundDate:"2026-03-17",status:"In Storage",claimedBy:"",claimDate:"",notes:""},
  {id:4,item:"Leather wallet – brown",foundAt:"Parking",foundBy:"Paul Esekon",foundDate:"2026-03-18",status:"Claimed",claimedBy:"Johnson Family",claimDate:"2026-03-18",notes:"Contained KSh 2,400 – returned intact"},
  {id:5,item:"Child's stuffed elephant toy",foundAt:"Villa 2",foundBy:"Mary Wanjiku",foundDate:"2026-03-19",status:"In Storage",claimedBy:"",claimDate:"",notes:"Will contact guest"},
];

// ─── SALES & MARKETING DATA ─────────────────────────────────
const INITIAL_LEADS=[
  {id:1,name:"Kenya Red Cross",contact:"Jane Wambui",phone:"+254 720 111 222",email:"jwambui@redcross.ke",source:"Referral",stage:"Negotiation",value:480000,notes:"5-day team retreat, 40 pax. Want full board + conference.",created:"2026-03-01",lastContact:"2026-03-16"},
  {id:2,name:"Tullow Oil Kenya",contact:"Mark Stevens",phone:"+254 733 444 555",email:"mstevens@tullow.com",source:"Website",stage:"Prospecting",value:720000,notes:"Quarterly executive offsite, 20 rooms.",created:"2026-03-10",lastContact:"2026-03-12"},
  {id:3,name:"Diocese of Turkana",contact:"Bishop Peter Ekiru",phone:"+254 722 888 999",email:"bishop@turkanadiocese.org",source:"Walk-in",stage:"Won",value:240000,notes:"Annual clergy conference, 3 days. Booked!",created:"2026-02-15",lastContact:"2026-03-05"},
  {id:4,name:"World Vision Lodwar",contact:"Sarah Oduya",phone:"+254 700 222 333",email:"soduya@wvi.org",source:"Repeat Guest",stage:"Proposal",value:360000,notes:"Monthly team meetings, want 6-month package deal.",created:"2026-03-08",lastContact:"2026-03-15"},
  {id:5,name:"County Governor's Office",contact:"James Loruk",phone:"+254 745 666 777",email:"jloruk@turkana.go.ke",source:"Referral",stage:"Prospecting",value:150000,notes:"Delegation hosting, 2-night stay + banquet.",created:"2026-03-14",lastContact:"2026-03-14"},
  {id:6,name:"AMREF Health Africa",contact:"Dr. Fatma Ali",phone:"+254 711 333 444",email:"fali@amref.org",source:"Website",stage:"Lost",value:500000,notes:"Chose Nairobi venue instead. Follow up Q3.",created:"2026-01-20",lastContact:"2026-02-28"},
];

const INITIAL_PACKAGES=[
  {id:1,name:"Conference Full Board",desc:"Conference venue + accommodation + all meals + AV equipment",price:8500,unit:"per person/day",icon:"🎪",active:true},
  {id:2,name:"Full Board Package",desc:"Villa accommodation + breakfast, lunch & dinner",price:6500,unit:"per person/day",icon:"🍽",active:true},
  {id:3,name:"Weekend Getaway",desc:"Fri–Sun villa stay + pool + 2 meals daily",price:15000,unit:"per villa/weekend",icon:"🌅",active:true},
  {id:4,name:"NGO/Humanitarian Discount",desc:"15% off full board for NGO teams (min 5 nights)",price:5525,unit:"per person/day",icon:"🤝",active:true},
  {id:5,name:"Honeymoon Suite",desc:"Executive room + champagne + breakfast in bed + pool",price:18000,unit:"per couple/night",icon:"💒",active:true},
  {id:6,name:"Corporate Retreat",desc:"3-day conference package + team building + all meals",price:22000,unit:"per person/3 days",icon:"💼",active:true},
];

const INITIAL_MARKETING_TASKS=[
  {id:1,task:"Update Google Business listing with new pool photos",priority:"High",owner:"Martha Auma",status:"In Progress",due:"2026-03-20"},
  {id:2,task:"Send follow-up email to World Vision (package proposal)",priority:"High",owner:"Martha Auma",status:"Pending",due:"2026-03-19"},
  {id:3,task:"Post Easter weekend special on social media",priority:"Medium",owner:"Aggrey Ochieng",status:"Pending",due:"2026-03-25"},
  {id:4,task:"Design new conference brochure for Q2",priority:"Medium",owner:"Martha Auma",status:"Pending",due:"2026-04-01"},
  {id:5,task:"Contact Turkana County tourism board for partnership",priority:"Low",owner:"Aggrey Ochieng",status:"Complete",due:"2026-03-10"},
];

// ─── GARDENING & LANDSCAPING DATA ────────────────────────────
const INITIAL_GARDEN_ZONES=[
  {id:1,name:"Main Entrance & Driveway",icon:"🌴",status:"Good",area:"1,200 sqm",lastDone:"2026-03-17",nextDue:"2026-03-24",notes:"Bougainvillea hedge trimmed"},
  {id:2,name:"Villa Courtyards (1–5)",icon:"🌺",status:"Good",area:"800 sqm",lastDone:"2026-03-16",nextDue:"2026-03-23",notes:"All courtyards mulched"},
  {id:3,name:"Villa Courtyards (6–10)",icon:"🌺",status:"Needs Care",area:"800 sqm",lastDone:"2026-03-10",nextDue:"2026-03-18",notes:"Overdue — heat stress on lawn"},
  {id:4,name:"Pool Surrounds & Deck",icon:"🏊",status:"Good",area:"600 sqm",lastDone:"2026-03-18",nextDue:"2026-03-25",notes:"Deck pots refreshed"},
  {id:5,name:"Conference Centre Gardens",icon:"🌳",status:"Critical",area:"1,500 sqm",lastDone:"2026-03-05",nextDue:"2026-03-12",notes:"Irrigation line burst — needs repair"},
  {id:6,name:"Kitchen Garden & Herb Patch",icon:"🌿",status:"Good",area:"400 sqm",lastDone:"2026-03-17",nextDue:"2026-03-20",notes:"Tomatoes, spinach, herbs thriving"},
];

const INITIAL_GARDEN_TASKS=[
  {id:1,zone:"Conference Centre Gardens",task:"Repair burst irrigation line – Zone 5",priority:"High",assignee:"Simon Ewoton",status:"In Progress",due:"2026-03-19"},
  {id:2,zone:"Villa Courtyards (6–10)",task:"Mow lawns and apply fertilizer",priority:"High",assignee:"Simon Ewoton",status:"Pending",due:"2026-03-19"},
  {id:3,zone:"Kitchen Garden",task:"Harvest ripe tomatoes and spinach for kitchen",priority:"Medium",assignee:"Simon Ewoton",status:"Complete",due:"2026-03-17"},
  {id:4,zone:"Main Entrance",task:"Prune bougainvillea hedge to shape",priority:"Medium",assignee:"Simon Ewoton",status:"Complete",due:"2026-03-17"},
  {id:5,zone:"Pool Surrounds",task:"Replace dead pot plants with new aloe vera",priority:"Low",assignee:"Simon Ewoton",status:"Pending",due:"2026-03-22"},
];

const INITIAL_PLANTS=[
  {id:1,name:"Bougainvillea",zone:"Main Entrance",health:"Healthy",watered:"2026-03-18",notes:"Blooming well, regular trimming"},
  {id:2,name:"Desert Rose (Adenium)",zone:"Villa Courtyards",health:"Healthy",watered:"2026-03-17",notes:"Heat-tolerant, minimal water"},
  {id:3,name:"Neem Tree",zone:"Conference Centre",health:"Stressed",watered:"2026-03-15",notes:"Needs deep watering — irrigation issue"},
  {id:4,name:"Aloe Vera",zone:"Pool Surrounds",health:"Healthy",watered:"2026-03-16",notes:"Thriving in Turkana heat"},
  {id:5,name:"Doum Palm",zone:"Main Entrance",health:"Healthy",watered:"2026-03-14",notes:"Native Turkana palm, iconic"},
  {id:6,name:"Tomatoes (Roma)",zone:"Kitchen Garden",health:"Healthy",watered:"2026-03-18",notes:"Producing well, harvest daily"},
  {id:7,name:"Spinach",zone:"Kitchen Garden",health:"Needs Care",watered:"2026-03-18",notes:"Wilting in afternoon heat — add shade net"},
  {id:8,name:"Frangipani",zone:"Pool Surrounds",health:"Healthy",watered:"2026-03-17",notes:"Fragrant, attracts guests to pool area"},
];

// ─── CONFERENCE & EVENTS DATA ────────────────────────────────
const INITIAL_EVENTS=[
  {id:1,name:"Diocese of Turkana Clergy Conference",client:"Bishop Peter Ekiru",phone:"+254 722 888 999",venue:"Turkana Hall",startDate:"2026-04-05",endDate:"2026-04-07",pax:120,catering:"Full Board",deposit:80000,total:240000,status:"Confirmed",notes:"3-day event, need PA system + projector",equipment:["PA System","Projector & Screen","Microphones (4)"],timeline:[{id:1,time:"08:00",duration:60,title:"Registration & Welcome Tea",type:"Registration"},{id:2,time:"09:00",duration:120,title:"Opening Session — Bishop's Address",type:"Session"},{id:3,time:"11:00",duration:30,title:"Morning Tea Break",type:"Break"},{id:4,time:"11:30",duration:150,title:"Morning Plenary Sessions",type:"Session"},{id:5,time:"13:00",duration:60,title:"Lunch",type:"Meal"},{id:6,time:"14:00",duration:180,title:"Afternoon Sessions",type:"Session"},{id:7,time:"17:00",duration:30,title:"Evening Devotion",type:"Session"},{id:8,time:"19:00",duration:90,title:"Dinner",type:"Meal"}]},
  {id:2,name:"UNICEF Field Staff Training",client:"Dr. Amina Hassan",phone:"+254 701 678 901",venue:"Nile Boardroom",startDate:"2026-03-25",endDate:"2026-03-26",pax:18,catering:"Tea & Lunch",deposit:15000,total:45000,status:"Confirmed",notes:"Need whiteboard + flip charts",equipment:["Projector","Whiteboard","Flip Charts"],timeline:[{id:1,time:"08:30",duration:30,title:"Arrival & Registration",type:"Registration"},{id:2,time:"09:00",duration:120,title:"Training Module 1",type:"Session"},{id:3,time:"11:00",duration:15,title:"Tea Break",type:"Break"},{id:4,time:"11:15",duration:105,title:"Training Module 2",type:"Session"},{id:5,time:"13:00",duration:60,title:"Lunch",type:"Meal"},{id:6,time:"14:00",duration:120,title:"Training Module 3",type:"Session"},{id:7,time:"16:00",duration:30,title:"Wrap-up & Evaluation",type:"Session"}]},
  {id:3,name:"Turkana County Budget Workshop",client:"James Loruk",phone:"+254 745 666 777",venue:"Turkana Hall",startDate:"2026-04-14",endDate:"2026-04-15",pax:80,catering:"Full Board",deposit:0,total:160000,status:"Tentative",notes:"Awaiting governor approval",equipment:["PA System","Projector & Screen","Stage"],timeline:[]},
  {id:4,name:"Wedding Reception – Lokichar Family",client:"Peter Lokichar",phone:"+254 700 999 888",venue:"Sunset Terrace",startDate:"2026-04-19",endDate:"2026-04-19",pax:70,catering:"Dinner Banquet",deposit:50000,total:140000,status:"Confirmed",notes:"Outdoor setup, need decorations",equipment:["Outdoor Lighting","PA System","Portable Stage"],timeline:[{id:1,time:"16:00",duration:60,title:"Setup & Decoration",type:"Setup"},{id:2,time:"17:00",duration:60,title:"Guest Arrival",type:"Registration"},{id:3,time:"18:00",duration:30,title:"Ceremony",type:"Session"},{id:4,time:"18:30",duration:30,title:"Cocktail Hour",type:"Break"},{id:5,time:"19:00",duration:150,title:"Dinner & Celebration",type:"Meal"},{id:6,time:"21:30",duration:30,title:"Cake Cutting",type:"Session"},{id:7,time:"22:00",duration:60,title:"Teardown",type:"Setup"}]},
  {id:5,name:"Easter Sunrise Service",client:"CHABBS Internal",phone:"",venue:"Chapel",startDate:"2026-04-20",endDate:"2026-04-20",pax:40,catering:"Breakfast",deposit:0,total:0,status:"Confirmed",notes:"Internal event — staff + guests invited",equipment:["PA System","Piano/Keyboard","Hymn Projector"],timeline:[{id:1,time:"05:30",duration:30,title:"Setup & Sound Check",type:"Setup"},{id:2,time:"06:00",duration:90,title:"Easter Sunrise Worship Service",type:"Session"},{id:3,time:"07:30",duration:60,title:"Easter Breakfast",type:"Meal"}]},
];

const CONFERENCE_VENUES=[
  {id:1,name:"Turkana Hall",capacity:200,rate:25000,rateUnit:"per day",equipment:["PA System","Projector & Screen","Stage","Microphones (4)","Whiteboard"],icon:"🏛"},
  {id:2,name:"Nile Boardroom",capacity:20,rate:8000,rateUnit:"per day",equipment:["Projector","Conference Phone","Whiteboard","Flip Charts"],icon:"🪑"},
  {id:3,name:"Sunset Terrace",capacity:80,rate:15000,rateUnit:"per event",equipment:["Outdoor Lighting","PA System","Portable Stage"],icon:"🌅"},
  {id:4,name:"Chapel",capacity:40,rate:5000,rateUnit:"per event",equipment:["PA System","Piano/Keyboard","Hymn Projector"],icon:"⛪"},
];

// ─── LAUNDRY DATA ────────────────────────────────────────────
const LAUNDRY_STAGES=["Collected","Washing","Drying","Folded","Delivered"];
const INITIAL_LAUNDRY=[
  {id:1,villa:"Villa 2",guestName:"Johnson Family",items:"Bed linen (3 sets), towels (6), bathrobes (3)",assignee:"Grace Akello",stage:"Drying",collectedAt:"2026-03-18T08:00:00",notes:"Salty water rinse protocol applied"},
  {id:2,villa:"Villa 3",guestName:"UNICEF Team",items:"Bed linen (3 sets), towels (9), tablecloth (1)",assignee:"Sarah Lopeyok",stage:"Washing",collectedAt:"2026-03-18T09:30:00",notes:"Extra towels requested"},
  {id:3,villa:"Villa 7",guestName:"Bishop Omondi",items:"Bed linen (1 set), towels (2)",assignee:"Mary Wanjiku",stage:"Delivered",collectedAt:"2026-03-17T07:00:00",notes:"Express service"},
  {id:4,villa:"Villa 8",guestName:"(Post checkout clean)",items:"Bed linen (3 sets), towels (6), curtains (2)",assignee:"Grace Akello",stage:"Collected",collectedAt:"2026-03-18T11:00:00",notes:"Deep clean turnover — full wash"},
  {id:5,villa:"Pool Towels",guestName:"Pool Area",items:"Pool towels (12)",assignee:"Sarah Lopeyok",stage:"Folded",collectedAt:"2026-03-18T06:30:00",notes:"Daily pool towel rotation"},
];

// ─── POOL & RECREATION DATA ─────────────────────────────────
const INITIAL_POOL_CHEMISTRY=[
  {id:1,date:"2026-03-18",time:"08:00",ph:7.4,chlorine:1.8,turbidity:0.3,temp:28,tester:"James Okwany",status:"Safe",notes:"All parameters normal"},
  {id:2,date:"2026-03-17",time:"08:00",ph:7.6,chlorine:1.5,turbidity:0.4,temp:29,tester:"James Okwany",status:"Safe",notes:"Slightly warm — normal for season"},
  {id:3,date:"2026-03-16",time:"08:00",ph:7.2,chlorine:2.1,turbidity:0.2,temp:27,tester:"Peter Kimani",status:"Safe",notes:"Post-shock treatment"},
  {id:4,date:"2026-03-15",time:"08:00",ph:7.8,chlorine:0.8,turbidity:0.6,tester:"James Okwany",temp:30,status:"Caution",notes:"Chlorine low — shock added at 10AM"},
  {id:5,date:"2026-03-14",time:"08:00",ph:7.3,chlorine:1.6,turbidity:0.3,temp:28,tester:"James Okwany",status:"Safe",notes:""},
];

const INITIAL_POOL_ACTIVITIES=[
  {id:1,name:"Open Swimming",time:"06:00 – 18:00",days:"Daily",icon:"🏊",active:true},
  {id:2,name:"Aqua Aerobics",time:"07:00 – 07:45",days:"Mon, Wed, Fri",icon:"🏋️",active:true},
  {id:3,name:"Children's Swim Hour",time:"10:00 – 11:00",days:"Sat, Sun",icon:"👶",active:true},
  {id:4,name:"Pool Volleyball",time:"15:00 – 16:30",days:"Sat",icon:"🏐",active:false},
  {id:5,name:"Sunset Lounge",time:"17:00 – 19:00",days:"Daily",icon:"🌅",active:true},
  {id:6,name:"Night Swim",time:"19:00 – 21:00",days:"Fri, Sat",icon:"🌙",active:true},
];

const INITIAL_POOL_MAINTENANCE=[
  {id:1,date:"2026-04-12",time:"07:00",type:"Vacuuming",description:"Full pool floor and wall vacuuming",chemical:"",qty:"",unit:"",doneBy:"James Okwany",duration:60,notes:"Light debris from wind"},
  {id:2,date:"2026-04-12",time:"08:00",type:"Chemical Dosing",description:"Chlorine top-up after morning test",chemical:"Chlorine (liquid)",qty:"2",unit:"Litres",doneBy:"James Okwany",duration:15,notes:"pH was 7.1 — also added pH+ buffer"},
  {id:3,date:"2026-04-10",time:"07:30",type:"Backwash",description:"Filter backwash and rinse cycle",chemical:"",qty:"",unit:"",doneBy:"Peter Kimani",duration:30,notes:"Pressure was high — overdue"},
  {id:4,date:"2026-04-08",time:"14:00",type:"Scrubbing",description:"Tile line and step scrubbing with brush",chemical:"Pool surface cleaner",qty:"0.5",unit:"Litres",doneBy:"James Okwany",duration:45,notes:""},
  {id:5,date:"2026-04-07",time:"08:00",type:"Chemical Dosing",description:"Shock treatment — weekly chlorine shock",chemical:"Calcium Hypochlorite",qty:"1.5",unit:"Kg",doneBy:"James Okwany",duration:20,notes:"Closed pool for 2hrs after treatment"},
  {id:6,date:"2026-04-05",time:"07:00",type:"Skimming",description:"Surface skimming — leaves and insects",chemical:"",qty:"",unit:"",doneBy:"Peter Kimani",duration:20,notes:"Dusty day — extra skimming needed"},
  {id:7,date:"2026-04-03",time:"09:00",type:"Full Clean",description:"Deep clean: vacuum, scrub, backwash, chemical balance",chemical:"Chlorine (liquid)",qty:"3",unit:"Litres",doneBy:"James Okwany",duration:120,notes:"Monthly deep clean — all checks passed"},
];

const INITIAL_WATER=[
  {id:1,date:"2026-03-18",pumpHours:4.5,tankLevel:85,electricityKwh:142,solarKwh:38,notes:"Normal operations"},
  {id:2,date:"2026-03-17",pumpHours:5.0,tankLevel:80,electricityKwh:158,solarKwh:41,notes:"Extra guests – higher usage"},
  {id:3,date:"2026-03-16",pumpHours:4.0,tankLevel:90,electricityKwh:135,solarKwh:44,notes:""},
  {id:4,date:"2026-03-15",pumpHours:4.5,tankLevel:88,electricityKwh:147,solarKwh:39,notes:""},
  {id:5,date:"2026-03-14",pumpHours:3.5,tankLevel:92,electricityKwh:128,solarKwh:46,notes:"Low occupancy"},
  {id:6,date:"2026-03-13",pumpHours:4.0,tankLevel:89,electricityKwh:139,solarKwh:42,notes:""},
  {id:7,date:"2026-03-12",pumpHours:4.5,tankLevel:86,electricityKwh:151,solarKwh:37,notes:""},
  {id:8,date:"2026-03-11",pumpHours:4.0,tankLevel:87,electricityKwh:143,solarKwh:40,notes:""},
  {id:9,date:"2026-03-10",pumpHours:3.5,tankLevel:91,electricityKwh:130,solarKwh:45,notes:"Low occupancy"},
  {id:10,date:"2026-03-09",pumpHours:4.5,tankLevel:84,electricityKwh:155,solarKwh:38,notes:""},
  {id:11,date:"2026-03-08",pumpHours:5.0,tankLevel:79,electricityKwh:162,solarKwh:36,notes:"MSF team – high usage"},
  {id:12,date:"2026-03-07",pumpHours:4.0,tankLevel:88,electricityKwh:137,solarKwh:43,notes:""},
  {id:13,date:"2026-03-06",pumpHours:3.5,tankLevel:90,electricityKwh:129,solarKwh:47,notes:"Low occupancy"},
  {id:14,date:"2026-03-05",pumpHours:4.5,tankLevel:85,electricityKwh:148,solarKwh:40,notes:""},
];

const INITIAL_FINANCIALS=[
  {id:1,date:"2026-03-18",revenue:12000,expenses:3200,notes:"Accommodation + Restaurant"},
  {id:2,date:"2026-03-17",revenue:15600,expenses:4100,notes:""},
  {id:3,date:"2026-03-16",revenue:14200,expenses:3800,notes:"Pool maintenance cost"},
  {id:4,date:"2026-03-15",revenue:18000,expenses:5200,notes:"UNICEF team arrival"},
  {id:5,date:"2026-03-14",revenue:8400,expenses:2800,notes:"Weekend slow period"},
];
const PETTY_FLOAT=20000;
const INITIAL_PETTY_CASH=[
  {id:1,date:"2026-03-18",amount:800,description:"Cleaning supplies – sponges and gloves",receiptNo:"RC-001",approvedBy:"Grace Akello",category:"Housekeeping"},
  {id:2,date:"2026-03-17",amount:1200,description:"Kitchen gas cylinder top-up",receiptNo:"RC-002",approvedBy:"Emmanuel Liru",category:"Kitchen"},
  {id:3,date:"2026-03-16",amount:500,description:"Stationery – receipt books and pens",receiptNo:"RC-003",approvedBy:"Aggrey Ochieng",category:"Admin"},
  {id:4,date:"2026-03-15",amount:2500,description:"Plumbing fittings for Villa 3 shower",receiptNo:"RC-004",approvedBy:"James Okwany",category:"Maintenance"},
  {id:5,date:"2026-03-14",amount:450,description:"Transport to Lodwar market",receiptNo:"RC-005",approvedBy:"Aggrey Ochieng",category:"Admin"},
  {id:6,date:"2026-03-13",amount:1800,description:"Pool chemicals – chlorine tablets 5kg",receiptNo:"RC-006",approvedBy:"James Okwany",category:"Pool"},
];
const INITIAL_SURVEYS=[
  {id:1,period:"Q1 2026",submittedDate:"2026-03-15",environment:4,management:5,tools:3,morale:4,overall:4,comments:""},
  {id:2,period:"Q1 2026",submittedDate:"2026-03-15",environment:5,management:4,tools:4,morale:5,overall:5,comments:""},
  {id:3,period:"Q1 2026",submittedDate:"2026-03-16",environment:3,management:4,tools:2,morale:3,overall:3,comments:"Need better mops and cleaning tools"},
  {id:4,period:"Q1 2026",submittedDate:"2026-03-16",environment:4,management:5,tools:4,morale:4,overall:4,comments:""},
  {id:5,period:"Q1 2026",submittedDate:"2026-03-17",environment:5,management:5,tools:5,morale:5,overall:5,comments:"Best workplace I have worked in!"},
  {id:6,period:"Q1 2026",submittedDate:"2026-03-17",environment:4,management:3,tools:3,morale:4,overall:4,comments:""},
  {id:7,period:"Q4 2025",submittedDate:"2025-12-20",environment:3,management:4,tools:3,morale:4,overall:3,comments:""},
  {id:8,period:"Q4 2025",submittedDate:"2025-12-20",environment:4,management:4,tools:4,morale:3,overall:4,comments:""},
  {id:9,period:"Q4 2025",submittedDate:"2025-12-21",environment:4,management:5,tools:3,morale:4,overall:4,comments:""},
];

const INITIAL_MAINTENANCE=[
  {id:1,asset:"AC Unit – Villa 3",issue:"Filter clogged, reduced airflow",priority:"High",parts:"AC Filter x2",reported:"2026-03-15",resolved:null,status:"Open",assignee:"Peter Kimani",partsCost:1200,labourHours:1.5},
  {id:2,asset:"Borehole Pump",issue:"Unusual vibration at startup",priority:"High",parts:"Pump bearing set",reported:"2026-03-16",resolved:null,status:"In Progress",assignee:"James Okwany",partsCost:4500,labourHours:3},
  {id:3,asset:"Pool Filter",issue:"Routine monthly descale",priority:"Low",parts:"Descaling solution 5L",reported:"2026-03-14",resolved:"2026-03-14",status:"Resolved",assignee:"James Okwany",partsCost:800,labourHours:2},
  {id:4,asset:"Showerheads – Villa 1 & 2",issue:"Weekly salty water descale protocol",priority:"Low",parts:"Vinegar solution, wire brush",reported:"2026-03-17",resolved:null,status:"Scheduled",assignee:"Mary Wanjiku",partsCost:200,labourHours:1},
  {id:5,asset:"Water Tank Valve",issue:"Slow drip, gasket needed",priority:"Medium",parts:"Rubber gasket x3",reported:"2026-03-16",resolved:"2026-03-17",status:"Resolved",assignee:"Peter Kimani",partsCost:350,labourHours:1.5},
];
const INITIAL_ASSETS=[
  {id:1,name:"AC Unit",category:"HVAC",location:"Villas 1–10 (10 units)",purchaseDate:"2023-01-10",warranty:"2026-01-10",lastService:"2026-03-01",nextService:"2026-04-01",condition:"Good",value:85000,qty:10,notes:"Carrier split units. Salty air accelerates coil corrosion."},
  {id:2,name:"Borehole Water Pump",category:"Water",location:"Pump House",purchaseDate:"2022-06-15",warranty:"2025-06-15",lastService:"2026-03-16",nextService:"2026-04-16",condition:"Fair",value:180000,qty:1,notes:"Grundfos submersible. Unusual vibration noted — monitor."},
  {id:3,name:"Standby Water Pump",category:"Water",location:"Pump House",purchaseDate:"2022-06-15",warranty:"2025-06-15",lastService:"2026-02-10",nextService:"2026-05-10",condition:"Good",value:180000,qty:1,notes:"Backup pump. Test monthly."},
  {id:4,name:"Diesel Generator",category:"Power",location:"Generator Room",purchaseDate:"2021-09-20",warranty:"2024-09-20",lastService:"2026-03-01",nextService:"2026-04-01",condition:"Good",value:950000,qty:1,notes:"Cummins 60kVA. Full load capacity for entire resort."},
  {id:5,name:"Pool Filter System",category:"Pool",location:"Pool Plant Room",purchaseDate:"2022-04-05",warranty:"2025-04-05",lastService:"2026-03-14",nextService:"2026-04-14",condition:"Good",value:95000,qty:1,notes:"Sand filter + circulation pump. Monthly descale required."},
  {id:6,name:"Industrial Gas Range",category:"Kitchen",location:"Main Kitchen",purchaseDate:"2022-03-01",warranty:"2025-03-01",lastService:"2026-02-20",nextService:"2026-05-20",condition:"Good",value:120000,qty:1,notes:"6-burner commercial range. Monthly deep clean."},
  {id:7,name:"Commercial Refrigerators",category:"Kitchen",location:"Main Kitchen",purchaseDate:"2022-03-01",warranty:"2025-03-01",lastService:"2026-03-05",nextService:"2026-06-05",condition:"Good",value:75000,qty:2,notes:"Walk-in cold room + stand-alone fridge."},
  {id:8,name:"Industrial Washing Machines",category:"Laundry",location:"Laundry Room",purchaseDate:"2023-02-14",warranty:"2026-02-14",lastService:"2026-03-10",nextService:"2026-04-10",condition:"Good",value:95000,qty:2,notes:"Samsung commercial grade. Descale monthly — salty water protocol."},
  {id:9,name:"Solar PV Panels",category:"Power",location:"Rooftop",purchaseDate:"2023-07-01",warranty:"2033-07-01",lastService:"2026-02-01",nextService:"2026-05-01",condition:"Good",value:850000,qty:24,notes:"24 × 350W panels (8.4 kWp). Quarterly cleaning — dust reduces output 30%."},
  {id:10,name:"Solar Inverter",category:"Power",location:"Generator Room",purchaseDate:"2023-07-01",warranty:"2028-07-01",lastService:"2026-02-01",nextService:"2026-08-01",condition:"Good",value:120000,qty:1,notes:"Growatt 10kW hybrid inverter with battery backup."},
  {id:11,name:"Water Storage Tanks",category:"Water",location:"Tank Stand",purchaseDate:"2021-09-20",warranty:"2031-09-20",lastService:"2026-01-15",nextService:"2026-07-15",condition:"Good",value:45000,qty:2,notes:"2 × 10,000L Polytanks. Semi-annual clean required."},
  {id:12,name:"CCTV System",category:"Security",location:"Reception + All Villas",purchaseDate:"2022-11-01",warranty:"2025-11-01",lastService:"2026-03-01",nextService:"2026-06-01",condition:"Good",value:65000,qty:1,notes:"24-camera DVR system. HDD health check quarterly."},
];
const PREVENTIVE_SCHEDULE=[
  {id:1,task:"Salty Water Descale — Exec Bathtubs",frequency:"Weekly",dayOrDate:"Monday",category:"Water",assignee:"Mary Wanjiku",lastDone:"2026-04-14",nextDue:"2026-04-21",notes:"Use vinegar solution. Focus on taps and shower heads."},
  {id:2,task:"Salty Water Descale — Showerheads (DL/DR)",frequency:"Weekly",dayOrDate:"Monday",category:"Water",assignee:"Mary Wanjiku",lastDone:"2026-04-14",nextDue:"2026-04-21",notes:"Soak heads in descaling solution overnight if heavily scaled."},
  {id:3,task:"Pool Chemical Check & Balance",frequency:"Weekly",dayOrDate:"Wednesday",category:"Pool",assignee:"James Okwany",lastDone:"2026-04-16",nextDue:"2026-04-23",notes:"Test pH, chlorine, CYA. Adjust as needed."},
  {id:4,task:"Generator Test Run (30 minutes)",frequency:"Weekly",dayOrDate:"Friday",category:"Power",assignee:"James Okwany",lastDone:"2026-04-11",nextDue:"2026-04-18",notes:"Run at 50% load minimum. Log fuel level before/after."},
  {id:5,task:"AC Filter Clean — All Villas",frequency:"Monthly",dayOrDate:"1st Monday",category:"HVAC",assignee:"Peter Kimani",lastDone:"2026-03-03",nextDue:"2026-04-07",notes:"Remove and rinse filters. Salty dust clogs quickly in Turkana."},
  {id:6,task:"Generator Full Service",frequency:"Monthly",dayOrDate:"1st Wednesday",category:"Power",assignee:"James Okwany",lastDone:"2026-03-05",nextDue:"2026-04-02",notes:"Check oil, coolant, belts, battery. Replace air filter if dusty."},
  {id:7,task:"Borehole Pump Inspection",frequency:"Monthly",dayOrDate:"2nd Friday",category:"Water",assignee:"James Okwany",lastDone:"2026-03-08",nextDue:"2026-04-12",notes:"Check amperage draw, flow rate, vibration. Log any anomalies."},
  {id:8,task:"Washing Machine Descale",frequency:"Monthly",dayOrDate:"2nd Monday",category:"Laundry",assignee:"Sarah Lopeyok",lastDone:"2026-03-10",nextDue:"2026-04-14",notes:"Run descale cycle. Salty water accelerates scale buildup."},
  {id:9,task:"Deep Borehole & Tank Service",frequency:"Quarterly",dayOrDate:"Start of Quarter",category:"Water",assignee:"External Contractor",lastDone:"2026-01-15",nextDue:"2026-04-15",notes:"Professional borehole inspection and tank clean. Book contractor 2 weeks ahead."},
  {id:10,task:"Solar Panel Cleaning",frequency:"Quarterly",dayOrDate:"Start of Quarter",category:"Power",assignee:"Peter Kimani",lastDone:"2026-02-01",nextDue:"2026-05-01",notes:"Dust reduces solar output by up to 30%. Use soft brush + distilled water."},
  {id:11,task:"CCTV & Security System Check",frequency:"Quarterly",dayOrDate:"Start of Quarter",category:"Security",assignee:"James Okwany",lastDone:"2026-01-15",nextDue:"2026-04-15",notes:"Check all cameras, DVR storage, motion sensors."},
  {id:12,task:"Kitchen Deep Clean & Equipment Service",frequency:"Monthly",dayOrDate:"Last Sunday",category:"Kitchen",assignee:"Chef Emmanuel Liru",lastDone:"2026-03-01",nextDue:"2026-04-05",notes:"Degrease range hood, clean behind fridges, descale coffee equipment."},
];

const INITIAL_HOUSEKEEPING=[
  {id:1,villa:"Villa 2",room:"Whole Villa",assignee:"Grace Akello",dueDate:"2026-03-20",bedding:false,bathroom:false,descale:false,common:false,trash:false,status:"Pending"},
  {id:2,villa:"Villa 8",room:"Whole Villa",assignee:"Sarah Lopeyok",dueDate:"2026-03-18",bedding:true,bathroom:true,descale:false,common:true,trash:true,status:"In Progress"},
  {id:3,villa:"Villa 5",room:"Whole Villa",assignee:"Grace Akello",dueDate:"2026-03-17",bedding:true,bathroom:true,descale:true,common:true,trash:true,status:"Complete"},
];

// ─── DESIGN TOKENS ────────────────────────────────────────────
const C={navy:"#0F2744",navyM:"#1A3A5C",sand:"#F4ECD8",sandL:"#FAF6EE",terra:"#B85C38",terraL:"#E07A56",sage:"#5A7A5E",sageD:"#3D5C41",gold:"#C9952A",goldL:"#F0C060",text:"#1A0F00",textM:"#4A3728",textL:"#8B7355",border:"#E0D4BC",danger:"#C62828",warning:"#E65100",success:"#2E7D32",info:"#1565C0"};
const SC={
  Available:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},Occupied:{bg:"#E3F2FD",tx:"#1565C0",dot:"#2196F3"},
  Maintenance:{bg:"#FFF3E0",tx:"#E65100",dot:"#FF9800"},Cleaning:{bg:"#F3E5F5",tx:"#6A1B9A",dot:"#9C27B0"},
  "Checked In":{bg:"#E3F2FD",tx:"#1565C0",dot:"#2196F3"},"Checked Out":{bg:"#F5F5F5",tx:"#616161",dot:"#9E9E9E"},
  Upcoming:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},Resolved:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},
  Open:{bg:"#FFEBEE",tx:"#C62828",dot:"#F44336"},"In Progress":{bg:"#FFF8E1",tx:"#F57F17",dot:"#FFC107"},
  Scheduled:{bg:"#E8EAF6",tx:"#283593",dot:"#3F51B5"},Pending:{bg:"#FFF3E0",tx:"#E65100",dot:"#FF9800"},
  "Pending Approval":{bg:"#FFF3E0",tx:"#E65100",dot:"#FF9800"},Complete:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},
  Approved:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},Rejected:{bg:"#FFEBEE",tx:"#C62828",dot:"#F44336"},
  Active:{bg:"#E3F2FD",tx:"#1565C0",dot:"#2196F3"},Cleared:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},
  Paid:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},Invoice:{bg:"#E3F2FD",tx:"#1565C0",dot:"#2196F3"},
  Deposit:{bg:"#FFF8E1",tx:"#F57F17",dot:"#FFC107"},Present:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},
  Late:{bg:"#FFF8E1",tx:"#F57F17",dot:"#FFC107"},Absent:{bg:"#FFEBEE",tx:"#C62828",dot:"#F44336"},
  "In Storage":{bg:"#E8EAF6",tx:"#283593",dot:"#3F51B5"},Claimed:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},
  Excellent:{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},"Very Good":{bg:"#E3F2FD",tx:"#1565C0",dot:"#2196F3"},
  Good:{bg:"#FFF8E1",tx:"#F57F17",dot:"#FFC107"},
  // Restaurant statuses
  "Served":{bg:"#E8F5E9",tx:"#2E7D32",dot:"#4CAF50"},
  "Ready":{bg:"#E3F2FD",tx:"#1565C0",dot:"#2196F3"},
  "Preparing":{bg:"#FFF8E1",tx:"#F57F17",dot:"#FFC107"},
  "Cancelled":{bg:"#F5F5F5",tx:"#616161",dot:"#9E9E9E"},
};

// ─── SHARED UI ────────────────────────────────────────────────
const Badge=({label})=>{const s=SC[label]||{bg:"#F5F5F5",tx:"#616161",dot:"#9E9E9E"};return(<span style={{background:s.bg,color:s.tx,display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}><span style={{width:7,height:7,borderRadius:"50%",background:s.dot}}/>{label}</span>);};
const inp={width:"100%",padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit",background:"white"};
const Field=({label,children,col})=>(<div style={col?{gridColumn:col}:{}}><label style={{fontSize:11,color:C.textL,fontWeight:700,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>{label}</label>{children}</div>);
const SectionTitle=({title,sub})=>(<div style={{marginBottom:20}}><div style={{fontSize:24,fontWeight:800,color:C.navy,fontFamily:"'Playfair Display',Georgia,serif"}}>{title}</div>{sub&&<div style={{fontSize:13,color:C.textL,marginTop:4}}>{sub}</div>}</div>);
const Card=({children,style={}})=>(<div style={{background:"white",borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",...style}}>{children}</div>);
const SubTabs=({tabs,active,setActive})=>(<div style={{display:"flex",gap:2,marginBottom:20,background:C.sandL,borderRadius:14,padding:4,width:"fit-content",flexWrap:"wrap"}}>{tabs.map(([k,icon,label])=>(<button key={k} onClick={()=>setActive(k)} style={{padding:"8px 14px",borderRadius:10,border:"none",fontSize:13,fontWeight:700,cursor:"pointer",background:active===k?"white":"transparent",color:active===k?C.navy:C.textL,boxShadow:active===k?"0 2px 8px rgba(0,0,0,0.1)":"none",transition:"all 0.2s",display:"flex",alignItems:"center",gap:5}}><span>{icon}</span>{label}</button>))}</div>);
const StatBox=({bg,border,tx,label,value})=>(<div style={{background:bg,borderRadius:14,padding:"14px 16px",border:`1px solid ${border}`}}><div style={{fontSize:10,color:tx,fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:20,fontWeight:900,color:tx,marginTop:4}}>{value}</div></div>);

// ─── CALENDAR HELPERS ─────────────────────────────────────────
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const parseDate=s=>{const[y,m,d]=s.split("-");return new Date(+y,+m-1,+d);};
const sameDay=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
const bookingOnDate=(b,date)=>{const ci=parseDate(b.checkIn),co=parseDate(b.checkOut),d=new Date(date);d.setHours(12);return d>=ci&&d<co;};
const bookingSpansWeek=(b,ws,we)=>{const ci=parseDate(b.checkIn),co=parseDate(b.checkOut);return ci<=we&&co>ws;};

// ─── LOGIN ────────────────────────────────────────────────────
const ROLES=[
  {id:"admin",      name:"Aggrey Ochieng",  label:"Admin / Manager",  icon:"👑", pin:"1234"},
  {id:"receptionist",name:"Front Desk",     label:"Receptionist",     icon:"🛎", pin:"5678"},
  {id:"housekeeping",name:"Grace Akello",   label:"Housekeeping",     icon:"🧹", pin:"9012"},
  {id:"laundry",    name:"Laundry Team",    label:"Laundry",          icon:"👕", pin:"1357"},
  {id:"maintenance",name:"James Okwany",    label:"Maintenance",      icon:"🔧", pin:"3456"},
  {id:"waterpower", name:"Utilities Team",  label:"Water & Power",    icon:"💧", pin:"2468"},
  {id:"finance",    name:"Finance Team",    label:"Finance",          icon:"💰", pin:"9753"},
  {id:"kitchen",    name:"Chef Emmanuel",   label:"Restaurant",       icon:"🍽", pin:"7890"},
  {id:"conference", name:"Events Team",     label:"Conference",       icon:"🎪", pin:"8642"},
  {id:"sales",      name:"Martha Auma",     label:"Sales & Marketing",icon:"🎯", pin:"2345"},
  {id:"grounds",    name:"Simon Ewoton",    label:"Gardening",        icon:"🌿", pin:"6789"},
  {id:"pool",       name:"Pool Team",       label:"Pool & Rec",       icon:"🏊", pin:"7531"},
  {id:"hr",         name:"HR Team",         label:"HR & Payroll",     icon:"👥", pin:"6420"},
  {id:"inventory",  name:"Stores Team",     label:"Inventory",        icon:"📦", pin:"5309"},
  {id:"nightaudit", name:"Night Auditor",   label:"Night Audit",      icon:"🌙", pin:"4197"},
];

const LoginScreen=({onLogin})=>{
  const[sel,setSel]=useState(null);const[pin,setPin]=useState("");const[err,setErr]=useState(false);
  const attempt=()=>{const r=ROLES.find(r=>r.id===sel);if(r&&pin===r.pin)onLogin(r);else{setErr(true);setTimeout(()=>setErr(false),1500);}};
  const selRole=ROLES.find(r=>r.id===sel);
  return(<div style={{minHeight:"100vh",background:`linear-gradient(150deg,${C.navy} 0%,#163052 45%,#1a4a3a 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1}}>
      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:22}}>
        <img src="./logo.png" alt="CHABBS Logo" style={{width:130,height:130,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.5))",marginBottom:6}}/>
        <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginTop:2}}>Lodwar · Turkana County · Kenya</div>
      </div>
      {/* Login card */}
      <div style={{background:"rgba(255,255,255,0.97)",borderRadius:24,padding:"26px 28px",boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14,textAlign:"center",letterSpacing:1,textTransform:"uppercase"}}>Select Your Department</div>
        {/* Role grid — 5 columns */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7,marginBottom:18}}>
          {ROLES.map(r=>(<button key={r.id} onClick={()=>{setSel(r.id);setPin("");}} style={{padding:"10px 4px 8px",borderRadius:12,border:`2px solid ${sel===r.id?C.navy:C.border}`,background:sel===r.id?C.navy:"white",color:sel===r.id?"white":C.text,cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
            <div style={{fontSize:20,marginBottom:4}}>{r.icon}</div>
            <div style={{fontSize:8,fontWeight:700,lineHeight:1.3,wordBreak:"break-word"}}>{r.label}</div>
          </button>))}
        </div>
        {/* Selected role name */}
        {selRole&&<div style={{textAlign:"center",fontSize:13,fontWeight:700,color:C.navy,marginBottom:10}}>Signing in as <span style={{color:C.terra}}>{selRole.name}</span></div>}
        {/* PIN input */}
        {sel&&(<div>
          <Field label="Enter PIN">
            <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="• • • •" onKeyDown={e=>e.key==="Enter"&&attempt()} style={{...inp,textAlign:"center",letterSpacing:12,fontSize:22,border:`2px solid ${err?C.danger:C.border}`,color:err?C.danger:C.text}}/>
          </Field>
          {err&&<div style={{color:C.danger,fontSize:12,textAlign:"center",marginTop:6,fontWeight:700}}>Incorrect PIN — try again</div>}
          <button onClick={attempt} style={{width:"100%",marginTop:14,padding:"13px",borderRadius:12,background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",fontWeight:800,fontSize:15,border:"none",cursor:"pointer",letterSpacing:2,textTransform:"uppercase"}}>Sign In →</button>
        </div>)}
        <div style={{textAlign:"center",marginTop:14,fontSize:11,color:C.textL,fontStyle:"italic"}}>"Commit your work to the Lord" — Proverbs 16:3 ✟</div>
      </div>
      {/* PIN hint */}
      <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"rgba(255,255,255,0.25)",lineHeight:1.8}}>
        Admin 1234 · Reception 5678 · Housekeeping 9012 · Laundry 1357 · Maintenance 3456 · Water&Power 2468<br/>
        Finance 9753 · Restaurant 7890 · Conference 8642 · Sales 2345 · Gardening 6789 · Pool 7531 · HR 6420 · Inventory 5309 · Night Audit 4197
      </div>
    </div>
  </div>);
};

const DevotionPopup=({devotion,user,onClose})=>(<div style={{position:"fixed",inset:0,background:"rgba(15,39,68,0.94)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
  <div style={{background:"white",borderRadius:24,padding:36,maxWidth:480,width:"100%",textAlign:"center",boxShadow:"0 40px 100px rgba(0,0,0,0.5)",position:"relative"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:`linear-gradient(90deg,${C.navy},${C.terra},${C.gold})`,borderRadius:"24px 24px 0 0"}}/>
    <div style={{fontSize:38,marginBottom:8}}>✟</div>
    <div style={{fontSize:10,letterSpacing:4,color:C.terra,fontWeight:800,textTransform:"uppercase",marginBottom:4}}>Morning Devotion</div>
    <div style={{fontSize:14,color:C.textL,marginBottom:22}}>Good morning, {user?.name} · {new Date().toLocaleDateString("en-KE",{weekday:"long"})}</div>
    <div style={{background:`linear-gradient(135deg,${C.navy}0A,${C.sage}0A)`,borderRadius:16,padding:"20px 24px",marginBottom:20,border:`1px solid ${C.border}`}}>
      <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:26,fontWeight:800,color:C.navy,marginBottom:10}}>{devotion.value}</div>
      <div style={{fontSize:14,color:C.textM,fontStyle:"italic",lineHeight:1.8,marginBottom:8}}>"{devotion.text}"</div>
      <div style={{fontSize:12,color:C.terra,fontWeight:800,letterSpacing:1}}>— {devotion.verse}</div>
    </div>
    <div style={{fontSize:13,color:C.text,lineHeight:1.9,marginBottom:26,padding:"0 8px"}}>{devotion.message}</div>
    <button onClick={onClose} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"13px 44px",borderRadius:14,border:"none",fontWeight:800,fontSize:14,cursor:"pointer",letterSpacing:2,textTransform:"uppercase"}}>Begin My Shift →</button>
  </div>
</div>);

// ─── TOP BAR ─────────────────────────────────────────────────
const TopBar=({user,alerts,setView})=>{
  const[time,setTime]=useState(new Date());const[searchOpen,setSearchOpen]=useState(false);const[searchQ,setSearchQ]=useState("");
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),30000);return()=>clearInterval(t);},[]);
  const totalAlerts=Object.values(alerts).reduce((s,v)=>s+v,0);
  const ALL_SEARCH=[["dashboard","📊","Dashboard"],["villas","🏡","Villas"],["bookings","📅","Bookings"],["housekeeping","🧹","Housekeeping"],["laundry","👕","Laundry"],["maintenance","🔧","Maintenance"],["waterpower","💧","Water & Power"],["financials","💰","Financials"],["stewardship","📈","Stewardship"],["restaurant","🍽","Restaurant"],["conference","🎪","Conference"],["sales","🎯","Sales & Marketing"],["gardening","🌿","Gardening"],["pool","🏊","Pool & Recreation"],["hr","👥","HR & Payroll"],["myhr","👤","My Info"],["inventory","📦","Inventory"],["feedback","⭐","Guest Feedback"],["lostfound","🔍","Lost & Found"],["nightaudit","🌙","Night Audit"],["settings","⚙️","Settings"]];
  const myNavIds=new Set((NAV_ITEMS[user?.id]||NAV_ITEMS.admin).map(n=>n[0]));
  const SEARCH_ITEMS=ALL_SEARCH.filter(([id])=>myNavIds.has(id));
  const filtered=searchQ?SEARCH_ITEMS.filter(([,, name])=>name.toLowerCase().includes(searchQ.toLowerCase())):[];
  return(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 24px",borderBottom:`1px solid ${C.border}`,background:"white",gap:16,flexShrink:0,position:"relative",zIndex:100}}>
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{fontSize:13,color:C.textM}}>Welcome, <strong style={{color:C.navy}}>{user?.name}</strong></div>
      <div style={{fontSize:11,color:C.textL}}>·</div>
      <div style={{fontSize:12,color:C.textL}}>{time.toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short"})} · {time.toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      {/* Search */}
      <div style={{position:"relative"}}>
        <div onClick={()=>{setSearchOpen(!searchOpen);setSearchQ("");}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,background:C.sandL,border:`1px solid ${C.border}`,cursor:"pointer",fontSize:12,color:C.textL}}>🔍 <span>Search modules...</span></div>
        {searchOpen&&(<div style={{position:"absolute",top:"100%",right:0,marginTop:6,width:260,background:"white",borderRadius:14,border:`1px solid ${C.border}`,boxShadow:"0 12px 40px rgba(0,0,0,0.15)",overflow:"hidden",zIndex:200}}>
          <input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Type to search..." style={{...inp,border:"none",borderBottom:`1px solid ${C.border}`,borderRadius:0,padding:"10px 14px"}}/>
          <div style={{maxHeight:220,overflowY:"auto"}}>{(searchQ?filtered:SEARCH_ITEMS).map(([id,icon,name])=>(<div key={id} onClick={()=>{setView(id);setSearchOpen(false);setSearchQ("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",fontSize:13,color:C.text,borderBottom:`1px solid ${C.border}40`}} onMouseEnter={e=>e.currentTarget.style.background=C.sandL} onMouseLeave={e=>e.currentTarget.style.background="white"}><span>{icon}</span>{name}</div>))}</div>
        </div>)}
      </div>
      {/* Notification Bell */}
      <div style={{position:"relative",cursor:"pointer"}} title={`${totalAlerts} items need attention`}>
        <span style={{fontSize:20}}>🔔</span>
        {totalAlerts>0&&<div style={{position:"absolute",top:-4,right:-6,background:C.danger,color:"white",fontSize:9,fontWeight:900,borderRadius:10,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",border:"2px solid white"}}>{totalAlerts}</div>}
      </div>
      {/* Role badge */}
      <div style={{padding:"5px 12px",borderRadius:20,background:`${C.navy}08`,border:`1px solid ${C.navy}15`,fontSize:11,fontWeight:700,color:C.navy}}>{user?.icon} {user?.label}</div>
    </div>
  </div>);
};

// ─── SIDEBAR ──────────────────────────────────────────────────
const NAV_ITEMS={
  admin:      [["dashboard","📊","Dashboard"],["villas","🏡","Villas"],["bookings","📅","Bookings"],["housekeeping","🧹","Housekeeping"],["laundry","👕","Laundry"],["maintenance","🔧","Maintenance"],["waterpower","💧","Water & Power"],["financials","💰","Financials"],["stewardship","📈","Stewardship"],["restaurant","🍽","Restaurant"],["conference","🎪","Conference"],["sales","🎯","Sales"],["gardening","🌿","Gardening"],["pool","🏊","Pool & Rec"],["hr","👥","HR & Payroll"],["inventory","📦","Inventory"],["feedback","⭐","Feedback"],["lostfound","🔍","Lost & Found"],["nightaudit","🌙","Night Audit"],["settings","⚙️","Settings"]],
  receptionist:[["dashboard","📊","Dashboard"],["bookings","📅","Bookings"],["villas","🏡","Villas"],["restaurant","🍽","Restaurant"],["conference","🎪","Conference"],["feedback","⭐","Feedback"],["lostfound","🔍","Lost & Found"],["myhr","👤","My Info"]],
  housekeeping:[["housekeeping","🧹","My Tasks"],["laundry","👕","Laundry"],["villas","🏡","Villa Status"],["inventory","📦","Supplies"],["myhr","👤","My Info"]],
  laundry:    [["laundry","👕","Laundry"],["housekeeping","🧹","Housekeeping"],["villas","🏡","Villa Status"],["inventory","📦","Supplies"],["myhr","👤","My Info"]],
  maintenance:[["maintenance","🔧","Maintenance"],["waterpower","💧","Water & Power"],["pool","🏊","Pool & Rec"],["inventory","📦","Supplies"],["myhr","👤","My Info"]],
  waterpower: [["waterpower","💧","Water & Power"],["maintenance","🔧","Maintenance"],["myhr","👤","My Info"]],
  finance:    [["financials","💰","Financials"],["stewardship","📈","Stewardship"],["hr","👥","HR & Payroll"],["nightaudit","🌙","Night Audit"],["myhr","👤","My Info"]],
  kitchen:    [["restaurant","🍽","Restaurant"],["inventory","📦","Supplies"],["myhr","👤","My Info"]],
  conference: [["conference","🎪","Conference"],["bookings","📅","Bookings"],["sales","🎯","Sales"],["feedback","⭐","Feedback"],["myhr","👤","My Info"]],
  sales:      [["sales","🎯","Sales"],["conference","🎪","Conference"],["bookings","📅","Bookings"],["feedback","⭐","Feedback"],["myhr","👤","My Info"]],
  grounds:    [["gardening","🌿","Gardening"],["pool","🏊","Pool & Rec"],["inventory","📦","Supplies"],["maintenance","🔧","Maintenance"],["myhr","👤","My Info"]],
  pool:       [["pool","🏊","Pool & Rec"],["maintenance","🔧","Maintenance"],["inventory","📦","Supplies"],["myhr","👤","My Info"]],
  hr:         [["hr","👥","HR & Payroll"],["dashboard","📊","Dashboard"],["myhr","👤","My Info"]],
  inventory:  [["inventory","📦","Inventory"],["maintenance","🔧","Maintenance"],["myhr","👤","My Info"]],
  nightaudit: [["nightaudit","🌙","Night Audit"],["bookings","📅","Bookings"],["financials","💰","Financials"],["villas","🏡","Villas"],["myhr","👤","My Info"]],
};

const Sidebar=({view,setView,role,onLogout,col,setCol,alerts={}})=>{
  const items=NAV_ITEMS[role?.id]||NAV_ITEMS.admin;
  return(<div style={{width:col?64:215,background:`linear-gradient(180deg,${C.navy} 0%,#163052 100%)`,height:"100vh",display:"flex",flexDirection:"column",transition:"width 0.25s",flexShrink:0,overflowX:"hidden"}}>
    <div style={{padding:col?"16px 10px":"20px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",textAlign:col?"center":"left"}}>
      {col?<div style={{fontSize:22}}>✟</div>:(<><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,color:"white",fontWeight:800,letterSpacing:2}}>CHABBS</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase"}}>Management System</div></>)}
    </div>
    {!col&&<div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}><div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:18,marginBottom:3}}>{role?.icon}</div><div style={{fontSize:12,color:"white",fontWeight:700}}>{role?.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.45)"}}>{role?.label}</div></div></div>}
    <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
      {items.map(([id,icon,label])=>{const active=view===id;const count=alerts[id]||0;return(<button key={id} onClick={()=>setView(id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:col?"12px 0":"9px 18px",justifyContent:col?"center":"flex-start",background:active?"rgba(255,255,255,0.12)":"transparent",borderLeft:active?`3px solid ${C.goldL}`:"3px solid transparent",color:active?"white":"rgba(255,255,255,0.55)",fontWeight:active?700:400,fontSize:13,border:"none",cursor:"pointer",transition:"all 0.15s",position:"relative"}}><span style={{fontSize:16}}>{icon}</span>{!col&&<span style={{flex:1,textAlign:"left"}}>{label}</span>}{count>0&&<span style={{background:C.danger,color:"white",fontSize:9,fontWeight:900,borderRadius:10,minWidth:col?14:18,height:col?14:18,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",position:col?"absolute":"static",top:col?4:undefined,right:col?8:undefined}}>{count}</span>}</button>);})}
    </nav>
    <button onClick={()=>setCol(!col)} style={{padding:"11px",background:"rgba(255,255,255,0.04)",border:"none",borderTop:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12}}>{col?"→":"← Collapse"}</button>
    <button onClick={onLogout} style={{padding:"11px",background:"rgba(220,50,50,0.08)",border:"none",borderTop:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,140,140,0.8)",cursor:"pointer",fontSize:12}}>{col?"↩":"↩ Sign Out"}</button>
  </div>);
};

// ─── BOOKING DETAIL POPUP ─────────────────────────────────────
const BookingDetailPopup=({booking,villas,onClose})=>{
  if(!booking)return null;const villa=villas.find(v=>v.id===booking.villaId);
  return(<div style={{position:"fixed",inset:0,background:"rgba(15,39,68,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
    <div style={{background:"white",borderRadius:20,padding:26,maxWidth:400,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,0.35)"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div><div style={{fontSize:17,fontWeight:800,color:C.text}}>{booking.guest}</div><div style={{fontSize:12,color:C.textL,marginTop:2}}>📞 {booking.phone} · 🪪 {booking.idNo}</div></div>
        <button onClick={onClose} style={{background:"#F5F5F5",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
      </div>
      <div style={{background:C.sandL,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["🏡","Villa",villa?.name||`Villa ${booking.villaId}`],["🛎","Type",booking.type],["📅","Check-in",booking.checkIn],["📅","Check-out",booking.checkOut],["🌙","Nights",booking.nights],["💰","Amount",`KSh ${booking.amount?.toLocaleString()}`]].map(([ic,l,v])=>(<div key={l}><div style={{fontSize:10,color:C.textL,fontWeight:700,textTransform:"uppercase"}}>{ic} {l}</div><div style={{fontSize:13,fontWeight:700,color:C.text,marginTop:2}}>{v}</div></div>))}
        </div>
      </div>
      <div style={{display:"flex",gap:8}}><Badge label={booking.status}/><Badge label={booking.payment}/></div>
    </div>
  </div>);
};

// ─── BOOKING CALENDAR ─────────────────────────────────────────
const BookingCalendar=({bookings,villas})=>{
  const[calMode,setCalMode]=useState("month");const[curDate,setCurDate]=useState(new Date(2026,2,18));const[selB,setSelB]=useState(null);
  const navBtn={padding:"7px 14px",borderRadius:20,border:`1px solid ${C.border}`,background:"white",color:C.navy,cursor:"pointer",fontSize:13,fontWeight:700};

  const DayView=()=>{
    const dayB=bookings.filter(b=>bookingOnDate(b,curDate));
    const prev=()=>{const d=new Date(curDate);d.setDate(d.getDate()-1);setCurDate(d);};
    const next=()=>{const d=new Date(curDate);d.setDate(d.getDate()+1);setCurDate(d);};
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={prev} style={navBtn}>‹</button><div style={{textAlign:"center"}}><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:800,color:C.navy}}>{curDate.toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div><div style={{fontSize:12,color:C.textL}}>{dayB.length} active booking{dayB.length!==1?"s":""}</div></div><button onClick={next} style={navBtn}>›</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:16}}>{villas.map(v=>{const vB=dayB.find(b=>b.villaId===v.id);return(<div key={v.id} onClick={()=>vB&&setSelB(vB)} style={{borderRadius:12,padding:"10px 8px",textAlign:"center",background:vB?vB.color||C.navy:"#F0F4F0",cursor:vB?"pointer":"default",border:`2px solid ${vB?(vB.color||C.navy)+"55":C.border}`}}><div style={{fontSize:13,fontWeight:800,color:vB?"white":C.textL}}>{v.name}</div><div style={{fontSize:10,color:vB?"rgba(255,255,255,0.8)":C.textL,marginTop:3}}>{vB?vB.guest.split(" ")[0]:"Free"}</div></div>);})}</div>
      {dayB.map(b=>(<div key={b.id} onClick={()=>setSelB(b)} style={{padding:"11px 14px",borderRadius:12,marginBottom:8,cursor:"pointer",background:`${b.color||C.navy}12`,borderLeft:`4px solid ${b.color||C.navy}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700}}>{b.guest}</div><div style={{fontSize:12,color:C.textL}}>Villa {b.villaId} · {b.checkIn}→{b.checkOut}</div></div><Badge label={b.status}/></div>))}
    </div>);
  };
  const WeekView=()=>{
    const ws=new Date(curDate);ws.setDate(ws.getDate()-ws.getDay());const days=Array.from({length:7},(_,i)=>{const d=new Date(ws);d.setDate(d.getDate()+i);return d;});const we=days[6];
    const wB=bookings.filter(b=>bookingSpansWeek(b,ws,we));
    const prevW=()=>{const d=new Date(curDate);d.setDate(d.getDate()-7);setCurDate(d);};const nextW=()=>{const d=new Date(curDate);d.setDate(d.getDate()+7);setCurDate(d);};
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><button onClick={prevW} style={navBtn}>‹ Week</button><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:16,fontWeight:800,color:C.navy}}>{days[0].toLocaleDateString("en-KE",{day:"numeric",month:"short"})} – {days[6].toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"})}</div><button onClick={nextW} style={navBtn}>Week ›</button></div>
      <div style={{display:"grid",gridTemplateColumns:"90px repeat(7,1fr)",gap:2,marginBottom:2}}><div/>{days.map((d,i)=>{const isT=sameDay(d,new Date(2026,2,18));return<div key={i} style={{textAlign:"center",padding:"7px 4px",borderRadius:8,background:isT?C.navy:"transparent",color:isT?"white":C.textL}}><div style={{fontSize:10,fontWeight:700}}>{DAYS[d.getDay()]}</div><div style={{fontSize:15,fontWeight:900}}>{d.getDate()}</div></div>;})}</div>
      <div style={{overflowY:"auto",maxHeight:340}}>{villas.map(v=>(<div key={v.id} style={{display:"grid",gridTemplateColumns:"90px repeat(7,1fr)",gap:2,marginBottom:2}}><div style={{display:"flex",alignItems:"center",fontSize:11,fontWeight:700,color:C.navy,padding:"0 8px"}}>{v.name}</div>{days.map((d,di)=>{const b=bookings.find(bk=>bk.villaId===v.id&&bookingOnDate(bk,d));const isF=b&&sameDay(parseDate(b.checkIn),d);return(<div key={di} onClick={()=>b&&setSelB(b)} style={{height:32,borderRadius:4,cursor:b?"pointer":"default",background:b?`${b.color||C.navy}CC`:"#F4ECD860",border:`1px solid ${b?(b.color||C.navy)+"44":C.border+"44"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>{b&&isF&&<span style={{fontSize:9,fontWeight:700,color:"white",padding:"0 4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{b.guest.split(" ")[0]}</span>}</div>);})}</div>))}</div>
      <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>{wB.map(b=>(<div key={b.id} onClick={()=>setSelB(b)} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",padding:"4px 10px",borderRadius:20,background:`${b.color||C.navy}18`,border:`1px solid ${b.color||C.navy}44`}}><div style={{width:8,height:8,borderRadius:"50%",background:b.color||C.navy}}/><span style={{fontSize:11,fontWeight:700}}>V{b.villaId} – {b.guest}</span></div>))}</div>
    </div>);
  };
  const MonthView=()=>{
    const year=curDate.getFullYear(),month=curDate.getMonth();const firstDay=new Date(year,month,1).getDay(),dim=new Date(year,month+1,0).getDate();const cells=Array.from({length:firstDay+dim},(_,i)=>i<firstDay?null:i-firstDay+1);
    const prevM=()=>{const d=new Date(curDate);d.setMonth(d.getMonth()-1);setCurDate(d);};const nextM=()=>{const d=new Date(curDate);d.setMonth(d.getMonth()+1);setCurDate(d);};
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><button onClick={prevM} style={navBtn}>‹</button><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:800,color:C.navy}}>{MONTHS[month]} {year}</div><button onClick={nextM} style={navBtn}>›</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>{DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:800,color:C.textL,padding:"5px 0",textTransform:"uppercase"}}>{d}</div>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((day,i)=>{if(!day)return<div key={i}/>;const date=new Date(year,month,day);const dayB=bookings.filter(b=>bookingOnDate(b,date));const isT=sameDay(date,new Date(2026,2,18));const occ=Math.round((dayB.length/10)*100);
          return(<div key={i} onClick={()=>{setCurDate(date);setCalMode("day");}} style={{minHeight:60,borderRadius:10,padding:"5px 7px",cursor:"pointer",border:`2px solid ${isT?C.navy:C.border}`,background:isT?`${C.navy}08`:"white",position:"relative",overflow:"hidden"}}>
            <div style={{fontSize:12,fontWeight:isT?900:600,color:isT?C.navy:C.textM,marginBottom:3}}>{day}</div>
            {dayB.slice(0,2).map((b,bi)=>(<div key={bi} onClick={e=>{e.stopPropagation();setSelB(b);}} style={{fontSize:9,fontWeight:700,color:"white",background:b.color||C.navy,borderRadius:3,padding:"1px 5px",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>V{b.villaId} {b.guest.split(" ")[0]}</div>))}
            {dayB.length>2&&<div style={{fontSize:9,color:C.textL,fontWeight:700}}>+{dayB.length-2}</div>}
            {occ>0&&<div style={{position:"absolute",bottom:0,left:0,width:`${occ}%`,height:3,background:`linear-gradient(90deg,${C.sage},${C.sageD})`}}/>}
          </div>);
        })}
      </div>
    </div>);
  };
  const YearView=()=>{
    const year=curDate.getFullYear();const prevY=()=>{const d=new Date(curDate);d.setFullYear(d.getFullYear()-1);setCurDate(d);};const nextY=()=>{const d=new Date(curDate);d.setFullYear(d.getFullYear()+1);setCurDate(d);};
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={prevY} style={navBtn}>‹</button><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:24,fontWeight:800,color:C.navy}}>{year}</div><button onClick={nextY} style={navBtn}>›</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {MONTHS.map((mName,mIdx)=>{const firstDay=new Date(year,mIdx,1).getDay(),dim=new Date(year,mIdx+1,0).getDate();const cells=Array.from({length:firstDay+dim},(_,i)=>i<firstDay?null:i-firstDay+1);const mB=bookings.filter(b=>{const ci=parseDate(b.checkIn),co=parseDate(b.checkOut);return(ci.getMonth()===mIdx&&ci.getFullYear()===year)||(co.getMonth()===mIdx&&co.getFullYear()===year);});
          return(<div key={mIdx} onClick={()=>{setCurDate(new Date(year,mIdx,1));setCalMode("month");}} style={{background:"white",borderRadius:12,padding:12,border:`1px solid ${C.border}`,cursor:"pointer"}}>
            <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:7}}>{mName}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:5}}>{DAYS.map(d=><div key={d} style={{fontSize:6,textAlign:"center",color:C.textL}}>{d[0]}</div>)}{cells.map((day,i)=>{if(!day)return<div key={i}/>;const dt=new Date(year,mIdx,day);const hB=bookings.some(b=>bookingOnDate(b,dt));const isT=sameDay(dt,new Date(2026,2,18));return<div key={i} style={{width:"100%",aspectRatio:"1",borderRadius:2,fontSize:6,display:"flex",alignItems:"center",justifyContent:"center",background:isT?C.navy:hB?`${C.sage}40`:"transparent",color:isT?"white":C.textM,fontWeight:hB||isT?700:400}}>{day}</div>;})}</div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:5,borderTop:`1px solid ${C.border}`}}><span style={{fontSize:10,color:C.textL}}>{mB.length} bookings</span><span style={{fontSize:10,fontWeight:700,color:C.sageD}}>KSh {mB.reduce((s,b)=>s+b.amount,0).toLocaleString()}</span></div>
          </div>);
        })}
      </div>
    </div>);
  };
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
      {[["day","Day"],["week","Week"],["month","Month"],["year","Year"]].map(([m,l])=>(<button key={m} onClick={()=>setCalMode(m)} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${calMode===m?C.navy:C.border}`,background:calMode===m?C.navy:"white",color:calMode===m?"white":C.textM,fontSize:13,cursor:"pointer",fontWeight:calMode===m?800:400}}>{l}</button>))}
      <button onClick={()=>setCurDate(new Date(2026,2,18))} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${C.terra}44`,background:`${C.terra}10`,color:C.terra,fontSize:13,cursor:"pointer",fontWeight:700,marginLeft:"auto"}}>Today</button>
    </div>
    {calMode==="day"&&<DayView/>}{calMode==="week"&&<WeekView/>}{calMode==="month"&&<MonthView/>}{calMode==="year"&&<YearView/>}
    {selB&&<BookingDetailPopup booking={selB} villas={villas} onClose={()=>setSelB(null)}/>}
  </div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── RESTAURANT VIEW ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const RestaurantView=({orders,setOrders,menu,setMenu,villas,role,specials=[],setSpecials,showToast=()=>{}})=>{
  const[sub,setSub]=useState(role?.id==="kitchen"?"kds":"pos");
  const isAdmin=role?.id==="admin";
  const TABS=[
    ["pos","🛒","New Order"],
    ["tablemap","🗺","Table Map"],
    ["kds","📺","KDS"],
    ["kitchen","👨‍🍳","Kitchen Queue"],
    ["sales","💰","Sales & Reports"],
    ["menu","📋","Menu Management"],
  ];

  // ── POS — NEW ORDER ────────────────────────────────────────
  const POSTab=()=>{
    const[selCat,setSelCat]=useState("Breakfast");
    const[cart,setCart]=useState([]);
    const[orderType,setOrderType]=useState("Dine In");
    const[tableNo,setTableNo]=useState("Table 1");
    const[server,setServer]=useState("Daniel Ekwang");
    const[notes,setNotes]=useState("");
    const[payMethod,setPayMethod]=useState("Cash");
    const[tip,setTip]=useState(0);
    const[showSuccess,setShowSuccess]=useState(false);
    const[showSpecialsMgr,setShowSpecialsMgr]=useState(false);
    const[specialForm,setSpecialForm]=useState({menuItemId:"",specialPrice:"",notes:""});

    const TABLES=["Table 1","Table 2","Table 3","Table 4","Table 5","Table 6","Table 7","Table 8","Table 9","Table 10","Bar Seat 1","Bar Seat 2","Bar Seat 3","Bar Seat 4"];
    const ROOM_SERVICE_OPTS=villas.filter(v=>v.status==="Occupied").map(v=>`${v.name} – Room Service`);
    const TABLE_OPTS=orderType==="Room Service"?ROOM_SERVICE_OPTS:TABLES;

    const catItems=menu.filter(m=>m.cat===selCat&&m.available);
    const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
    const grandTotal=cartTotal+tip;

    const addToCart=item=>{
      setCart(p=>{const ex=p.find(c=>c.menuId===item.id);if(ex)return p.map(c=>c.menuId===item.id?{...c,qty:c.qty+1}:c);return[...p,{menuId:item.id,name:item.name,price:item.price,qty:1,emoji:item.emoji,prep:item.prep}];});
    };
    const removeFromCart=id=>setCart(p=>p.map(c=>c.menuId===id?{...c,qty:c.qty-1}:c).filter(c=>c.qty>0));
    const clearCart=()=>setCart([]);

    const placeOrder=()=>{
      if(cart.length===0)return;
      const newOrder={id:Date.now(),table:tableNo,type:orderType,server,items:cart.map(c=>({menuId:c.menuId,name:c.name,qty:c.qty,price:c.price})),total:cartTotal,tip,status:"Pending",orderedAt:new Date().toISOString(),servedAt:null,paid:payMethod!=="Room Charge",payMethod,notes};
      setOrders(p=>[newOrder,...p]);
      setCart([]);setNotes("");setTip(0);setShowSuccess(true);setTimeout(()=>setShowSuccess(false),3000);
    };

    const addSpecial=()=>{
      if(!specialForm.menuItemId)return;
      if(specials.length>=3){showToast("Maximum 3 daily specials allowed","warning");return;}
      setSpecials(p=>[...p,{id:Date.now(),menuItemId:parseInt(specialForm.menuItemId),specialPrice:specialForm.specialPrice?parseInt(specialForm.specialPrice):null,notes:specialForm.notes}]);
      setSpecialForm({menuItemId:"",specialPrice:"",notes:""});
    };
    const removeSpecial=(id)=>setSpecials(p=>p.filter(s=>s.id!==id));

    const CAT_COLORS={"Breakfast":"#FF9800","Lunch":"#2E7D32","Dinner":"#1565C0","Snacks & Sides":"#E65100","Beverages":"#00796B","Desserts":"#AD1457"};

    return(<div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16,height:"calc(100vh - 180px)"}}>
      {/* LEFT: Menu */}
      <div style={{display:"flex",flexDirection:"column",gap:12,overflow:"hidden"}}>
        {/* Order setup */}
        <Card style={{padding:"14px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
            <Field label="Order Type">
              <select value={orderType} onChange={e=>{setOrderType(e.target.value);setTableNo(e.target.value==="Room Service"?(ROOM_SERVICE_OPTS[0]||""):"Table 1");}} style={{...inp,padding:"8px 10px",fontSize:13}}>
                <option>Dine In</option><option>Room Service</option><option>Takeaway</option>
              </select>
            </Field>
            <Field label={orderType==="Room Service"?"Villa / Room":"Table"}>
              <select value={tableNo} onChange={e=>setTableNo(e.target.value)} style={{...inp,padding:"8px 10px",fontSize:13}}>
                {TABLE_OPTS.map(t=><option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Server">
              <select value={server} onChange={e=>setServer(e.target.value)} style={{...inp,padding:"8px 10px",fontSize:13}}>
                {["Daniel Ekwang","Celestine Akiru","Prosper Loyo","Grace Akello","Chef Emmanuel Liru"].map(s=><option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Payment Method">
              <select value={payMethod} onChange={e=>setPayMethod(e.target.value)} style={{...inp,padding:"8px 10px",fontSize:13}}>
                <option>Cash</option><option>M-Pesa</option><option>Card</option><option>Room Charge</option><option>Invoice</option>
              </select>
            </Field>
          </div>
        </Card>

        {/* Daily Specials panel */}
        <div style={{flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:specials.length>0||showSpecialsMgr?8:0}}>
            {specials.length>0&&<div style={{fontSize:12,fontWeight:800,color:"#E65100"}}>⭐ TODAY'S SPECIALS ({specials.length}/3)</div>}
            {isAdmin&&<button onClick={()=>setShowSpecialsMgr(p=>!p)} style={{fontSize:11,padding:"4px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:"white",color:C.textM,cursor:"pointer",marginLeft:"auto"}}>{showSpecialsMgr?"✕ Close":"⭐ Manage Specials"}</button>}
          </div>
          {specials.length>0&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            {specials.map(sp=>{const item=menu.find(m=>m.id===sp.menuItemId);if(!item)return null;const prc=sp.specialPrice||item.price;return(<button key={sp.id} onClick={()=>addToCart({...item,price:prc})} style={{background:"linear-gradient(135deg,#FFF8E1,white)",borderRadius:12,padding:"8px 12px",border:"2px solid #FFD54F",cursor:"pointer",textAlign:"left",display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:18}}>{item.emoji}</span>
              <div><div style={{fontSize:12,fontWeight:800,color:C.text}}>⭐ {item.name}</div>
                {sp.notes&&<div style={{fontSize:10,color:C.textL,fontStyle:"italic"}}>{sp.notes}</div>}
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:900,color:"#E65100"}}>KSh {prc.toLocaleString()}</span>
                  {sp.specialPrice&&sp.specialPrice<item.price&&<span style={{fontSize:10,color:C.textL,textDecoration:"line-through"}}>KSh {item.price}</span>}
                </div>
              </div>
            </button>);})}
          </div>}
          {showSpecialsMgr&&isAdmin&&(<Card style={{padding:12,border:"2px solid #FFD54F",marginBottom:4}}>
            <div style={{fontSize:12,fontWeight:800,color:"#E65100",marginBottom:10}}>Manage Daily Specials (max 3)</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr auto",gap:8,marginBottom:10,alignItems:"end"}}>
              <Field label="Menu Item"><select value={specialForm.menuItemId} onChange={e=>setSpecialForm(p=>({...p,menuItemId:e.target.value}))} style={{...inp,fontSize:12}}>
                <option value="">Choose item…</option>{menu.filter(m=>m.available).map(m=><option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}
              </select></Field>
              <Field label="Special Price"><input type="number" value={specialForm.specialPrice} onChange={e=>setSpecialForm(p=>({...p,specialPrice:e.target.value}))} placeholder="Leave blank = same" style={{...inp,fontSize:12}}/></Field>
              <Field label="Note (Chef's note etc.)"><input value={specialForm.notes} onChange={e=>setSpecialForm(p=>({...p,notes:e.target.value}))} placeholder="Chef's recommendation…" style={{...inp,fontSize:12}}/></Field>
              <button onClick={addSpecial} disabled={specials.length>=3} style={{padding:"9px 14px",borderRadius:10,border:"none",background:specials.length>=3?C.border:"#E65100",color:"white",cursor:specials.length>=3?"not-allowed":"pointer",fontWeight:700,fontSize:12,alignSelf:"flex-end"}}>+ Add</button>
            </div>
            {specials.map(sp=>{const item=menu.find(m=>m.id===sp.menuItemId);return item?(<div key={sp.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:"#FFF8E1",borderRadius:8,marginBottom:4,fontSize:12}}><span>⭐ {item.emoji} {item.name}{sp.specialPrice?` — KSh ${sp.specialPrice}`:""}{sp.notes?` · "${sp.notes}"`:""}</span><button onClick={()=>removeSpecial(sp.id)} style={{padding:"3px 8px",borderRadius:6,border:"none",background:C.danger,color:"white",fontSize:11,cursor:"pointer"}}>Remove</button></div>):null;})}
          </Card>)}
        </div>

        {/* Category tabs */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,flexShrink:0}}>
          {MENU_CATEGORIES.map(cat=>(<button key={cat} onClick={()=>setSelCat(cat)} style={{padding:"8px 16px",borderRadius:20,border:`2px solid ${selCat===cat?CAT_COLORS[cat]:C.border}`,background:selCat===cat?CAT_COLORS[cat]:"white",color:selCat===cat?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>{cat}</button>))}
        </div>

        {/* Menu grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,overflowY:"auto",flex:1,paddingRight:4}}>
          {catItems.map(item=>{
            const inCart=cart.find(c=>c.menuId===item.id);
            const isSpecial=specials.some(s=>s.menuItemId===item.id);
            const spInfo=specials.find(s=>s.menuItemId===item.id);
            const dispPrice=isSpecial&&spInfo?.specialPrice?spInfo.specialPrice:item.price;
            return(<button key={item.id} onClick={()=>addToCart({...item,price:dispPrice})} style={{background:inCart?"#E8F5E9":isSpecial?"#FFFDE7":"white",borderRadius:14,padding:"12px 10px",border:`2px solid ${inCart?C.sageD:isSpecial?"#FFD54F":C.border}`,cursor:"pointer",textAlign:"left",transition:"all 0.15s",position:"relative"}}>
              {inCart&&<div style={{position:"absolute",top:8,right:8,background:C.sageD,color:"white",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{inCart.qty}</div>}
              {isSpecial&&!inCart&&<div style={{position:"absolute",top:8,right:8,fontSize:14}}>⭐</div>}
              <div style={{fontSize:26,marginBottom:6}}>{item.emoji}</div>
              <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:3,lineHeight:1.3}}>{item.name}</div>
              <div style={{fontSize:10,color:C.textL,marginBottom:6,lineHeight:1.4}}>{item.desc.split(",")[0]}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:900,color:isSpecial?"#E65100":C.sageD}}>KSh {dispPrice.toLocaleString()}</div>
                  {isSpecial&&spInfo?.specialPrice&&spInfo.specialPrice<item.price&&<div style={{fontSize:10,color:C.textL,textDecoration:"line-through"}}>KSh {item.price}</div>}
                </div>
                <div style={{fontSize:10,color:C.textL}}>⏱ {item.prep}m</div>
              </div>
            </button>);
          })}
        </div>
      </div>

      {/* RIGHT: Cart / Bill */}
      <div style={{display:"flex",flexDirection:"column",gap:0,height:"100%"}}>
        <div style={{background:"white",borderRadius:16,border:`1px solid ${C.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
          {/* Cart header */}
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,padding:"14px 18px",borderRadius:"16px 16px 0 0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"white",fontWeight:800,fontSize:15}}>🧾 Current Order</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{background:"rgba(255,255,255,0.15)",color:"white",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{tableNo}</span>
                <span style={{background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",padding:"3px 10px",borderRadius:20,fontSize:11}}>{orderType}</span>
              </div>
            </div>
          </div>

          {/* Cart items */}
          <div style={{flex:1,overflowY:"auto",padding:"12px 16px"}}>
            {cart.length===0&&(<div style={{textAlign:"center",padding:"40px 20px",color:C.textL}}>
              <div style={{fontSize:40,marginBottom:10}}>🍽</div>
              <div style={{fontSize:13,fontWeight:600}}>No items yet</div>
              <div style={{fontSize:12,marginTop:4}}>Tap menu items to add to order</div>
            </div>)}
            {cart.map(item=>(<div key={item.menuId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{item.emoji} {item.name}</div>
                <div style={{fontSize:12,color:C.textL}}>KSh {item.price} × {item.qty} = <strong style={{color:C.navy}}>KSh {(item.price*item.qty).toLocaleString()}</strong></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>removeFromCart(item.menuId)} style={{width:28,height:28,borderRadius:"50%",border:`1px solid ${C.border}`,background:"white",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:C.danger}}>−</button>
                <span style={{fontSize:14,fontWeight:800,color:C.navy,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                <button onClick={()=>addToCart({id:item.menuId,name:item.name,price:item.price,emoji:item.emoji,prep:item.prep})} style={{width:28,height:28,borderRadius:"50%",border:`1px solid ${C.sage}`,background:"#E8F5E9",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:C.sageD}}>+</button>
              </div>
            </div>))}
          </div>

          {/* Notes */}
          {cart.length>0&&<div style={{padding:"0 16px 8px"}}>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Special instructions, allergies..." style={{...inp,padding:"8px 12px",fontSize:12,resize:"none",height:44}}/>
          </div>}

          {/* Tip */}
          {cart.length>0&&<div style={{padding:"0 16px 10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <label style={{fontSize:11,color:C.textL,fontWeight:700,whiteSpace:"nowrap"}}>💰 Tip (KSh):</label>
              <input type="number" value={tip||""} onChange={e=>setTip(parseInt(e.target.value)||0)} min="0" placeholder="0" style={{...inp,width:80,padding:"6px 10px",fontSize:13}}/>
              {[100,200,500].map(t=>(<button key={t} onClick={()=>setTip(p=>p+t)} style={{padding:"5px 9px",borderRadius:8,border:`1px solid ${C.border}`,background:"white",fontSize:11,cursor:"pointer",color:C.textM}}>+{t}</button>))}
            </div>
          </div>}

          {/* Total & Actions */}
          <div style={{padding:"12px 16px",borderTop:`2px solid ${C.border}`,background:C.sandL,borderRadius:"0 0 16px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:11,color:C.textL,fontWeight:700,textTransform:"uppercase"}}>Grand Total</div>
                <div style={{fontSize:26,fontWeight:900,color:C.navy}}>KSh {grandTotal.toLocaleString()}</div>
                {tip>0&&<div style={{fontSize:11,color:C.textL}}>Food: KSh {cartTotal.toLocaleString()} + Tip: KSh {tip.toLocaleString()}</div>}
              </div>
              <div style={{fontSize:11,color:C.textL,textAlign:"right"}}>
                <div>{cart.length} item{cart.length!==1?"s":""}</div>
                <div>~{Math.max(...cart.map(i=>i.prep||0),0)} min prep</div>
              </div>
            </div>
            {showSuccess&&<div style={{background:"#E8F5E9",border:"1px solid #81C784",borderRadius:10,padding:"10px 14px",marginBottom:10,textAlign:"center",fontSize:13,fontWeight:700,color:C.sageD}}>✅ Order sent to kitchen!</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={clearCart} style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${C.border}`,background:"white",color:C.textM,cursor:"pointer",fontWeight:700,fontSize:13}}>🗑 Clear</button>
              <button onClick={placeOrder} disabled={cart.length===0} style={{flex:2,padding:"12px",borderRadius:12,border:"none",background:cart.length===0?C.border:`linear-gradient(135deg,${C.sageD},${C.sage})`,color:cart.length===0?C.textL:"white",cursor:cart.length===0?"not-allowed":"pointer",fontWeight:800,fontSize:14}}>✓ Place Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>);
  };

  // ── KITCHEN QUEUE ──────────────────────────────────────────
  // ── TABLE MAP ──────────────────────────────────────────────
  const TableMapTab=()=>{
    const[overrides,setOverrides]=useState({});
    const[selTable,setSelTable]=useState(null);
    const TBL_DEF=[
      {id:"T1",name:"Table 1",seats:4},{id:"T2",name:"Table 2",seats:4},{id:"T3",name:"Table 3",seats:4},{id:"T4",name:"Table 4",seats:4},
      {id:"T5",name:"Table 5",seats:4},{id:"T6",name:"Table 6",seats:4},{id:"T7",name:"Table 7",seats:4},{id:"T8",name:"Table 8",seats:4},
      {id:"T9",name:"Table 9",seats:6},{id:"T10",name:"Table 10",seats:6},
      {id:"B1",name:"Bar Seat 1",seats:1,bar:true},{id:"B2",name:"Bar Seat 2",seats:1,bar:true},
      {id:"B3",name:"Bar Seat 3",seats:1,bar:true},{id:"B4",name:"Bar Seat 4",seats:1,bar:true},
    ];
    const NAME_MAP=Object.fromEntries(TBL_DEF.map(t=>[t.id,t.name]));
    const activeOrds=orders.filter(o=>["Pending","Preparing","Ready"].includes(o.status));
    const getOrd=(tid)=>activeOrds.find(o=>o.table===NAME_MAP[tid]);
    const getStatus=(tid)=>{if(overrides[tid]&&overrides[tid]!=="Available")return overrides[tid];if(getOrd(tid))return "Occupied";return overrides[tid]||"Available";};
    const elapsed=(t)=>{const m=Math.floor((Date.now()-new Date(t).getTime())/60000);return m<1?"now":`${m}m`;};
    const S_COLOR={Available:"#2E7D32",Occupied:"#1565C0",Reserved:"#E65100",Cleaning:"#616161"};
    const S_BG={Available:"#E8F5E9",Occupied:"#E3F2FD",Reserved:"#FFF3E0",Cleaning:"#F5F5F5"};
    const cnt=(s)=>TBL_DEF.filter(t=>getStatus(t.id)===s).length;
    const setOvr=(id,st)=>setOverrides(p=>({...p,[id]:st}));
    const selOrd=selTable?getOrd(selTable):null;
    return(<div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        {["Available","Occupied","Reserved","Cleaning"].map(s=>(<div key={s} style={{display:"flex",alignItems:"center",gap:6,background:S_BG[s],borderRadius:10,padding:"6px 12px",border:`1px solid ${S_COLOR[s]}30`}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:S_COLOR[s]}}/>
          <span style={{fontSize:12,fontWeight:700,color:S_COLOR[s]}}>{s}: {cnt(s)}</span>
        </div>))}
        <div style={{marginLeft:"auto",fontSize:11,color:C.textL}}>Click table to manage</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {TBL_DEF.map(t=>{
          const st=getStatus(t.id);const ord=getOrd(t.id);const sel=selTable===t.id;
          return(<div key={t.id} onClick={()=>setSelTable(sel?null:t.id)} style={{background:sel?S_COLOR[st]:S_BG[st],border:`2px solid ${S_COLOR[st]}`,borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"center",minHeight:90,display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:sel?"0 4px 16px rgba(0,0,0,0.2)":"none",transition:"all 0.15s"}}>
            <div>
              <div style={{fontSize:t.bar?13:14,fontWeight:800,color:sel?"white":S_COLOR[st]}}>{t.bar?"🍺":"🍽"} {t.name}</div>
              <div style={{fontSize:10,color:sel?"rgba(255,255,255,0.7)":C.textL}}>{t.seats} {t.seats===1?"seat":"seats"}</div>
            </div>
            {ord?(<div style={{marginTop:6}}>
              <div style={{fontSize:12,fontWeight:900,color:sel?"white":"#1565C0"}}>KSh {ord.total.toLocaleString()}</div>
              <div style={{fontSize:10,color:sel?"rgba(255,255,255,0.7)":C.textL}}>{elapsed(ord.orderedAt)} · {ord.status}</div>
            </div>):(<div style={{fontSize:11,fontWeight:700,color:sel?"rgba(255,255,255,0.8)":S_COLOR[st],marginTop:6}}>● {st}</div>)}
          </div>);
        })}
      </div>
      {selTable&&(<Card style={{border:`2px solid ${S_COLOR[getStatus(selTable)]}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:15,fontWeight:800,color:C.navy}}>{NAME_MAP[selTable]}</div><Badge label={getStatus(selTable)}/></div>
          {getStatus(selTable)!=="Occupied"&&(<div style={{display:"flex",gap:8}}>
            {["Available","Reserved","Cleaning"].map(s=>(<button key={s} onClick={()=>setOvr(selTable,s)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${S_COLOR[s]}`,background:getStatus(selTable)===s?S_COLOR[s]:"white",color:getStatus(selTable)===s?"white":S_COLOR[s],fontSize:11,cursor:"pointer",fontWeight:700}}>{s}</button>))}
          </div>)}
        </div>
        {selOrd?(<div>
          <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:8}}>Active Order #{selOrd.id.toString().slice(-4)} · {selOrd.server}</div>
          {selOrd.items.map((item,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span>{item.qty}× {item.name}</span><span style={{fontWeight:700}}>KSh {(item.price*item.qty).toLocaleString()}</span></div>))}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:`2px solid ${C.border}`}}><span style={{fontWeight:800}}>Total</span><span style={{fontSize:16,fontWeight:900,color:C.navy}}>KSh {selOrd.total.toLocaleString()}</span></div>
          <div style={{marginTop:6,fontSize:11,color:C.textL}}>{elapsed(selOrd.orderedAt)} elapsed · <Badge label={selOrd.status}/></div>
        </div>):(<div style={{textAlign:"center",padding:"20px",color:C.textL}}><div style={{fontSize:32}}>🪑</div><div style={{fontSize:13,fontWeight:600,marginTop:6}}>Table is {getStatus(selTable).toLowerCase()}</div></div>)}
      </Card>)}
    </div>);
  };

  // ── KDS — KITCHEN DISPLAY SYSTEM ───────────────────────────
  const KDSTab=()=>{
    const[flash,setFlash]=useState(false);
    const prevCount=useRef(0);
    const kdOrds=orders.filter(o=>["Pending","Preparing"].includes(o.status)).sort((a,b)=>new Date(a.orderedAt)-new Date(b.orderedAt));
    useEffect(()=>{if(kdOrds.length>prevCount.current){setFlash(true);setTimeout(()=>setFlash(false),800);}prevCount.current=kdOrds.length;},[kdOrds.length]);
    const advance=(id)=>{setOrders(p=>p.map(o=>o.id!==id?o:{...o,status:o.status==="Pending"?"Preparing":"Ready"}));};
    const elMins=(t)=>Math.floor((Date.now()-new Date(t).getTime())/60000);
    const S_COLOR={Pending:"#E65100",Preparing:"#1565C0"};
    const S_LABEL={Pending:"▶ START COOKING",Preparing:"✓ MARK READY"};
    return(<div style={{background:flash?"#FFF3E0":"transparent",borderRadius:16,transition:"background 0.4s"}}>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{fontSize:15,fontWeight:900,color:C.navy}}>📺 Kitchen Display System</div>
        <div style={{marginLeft:"auto",display:"flex",gap:10}}>
          {[["🟠",orders.filter(o=>o.status==="Pending").length,"Pending"],["🔵",orders.filter(o=>o.status==="Preparing").length,"Preparing"]].map(([emoji,n,label])=>(<div key={label} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 14px",fontSize:13,fontWeight:700,color:C.navy}}>{emoji} {n} {label}</div>))}
        </div>
      </div>
      {kdOrds.length===0&&(<div style={{textAlign:"center",padding:"80px 20px",background:"white",borderRadius:20,border:`2px solid ${C.border}`}}>
        <div style={{fontSize:60,marginBottom:16}}>✅</div>
        <div style={{fontSize:24,fontWeight:900,color:C.sageD}}>Kitchen Clear!</div>
        <div style={{fontSize:14,color:C.textL,marginTop:8}}>No pending orders right now</div>
      </div>)}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {kdOrds.map(o=>{
          const mins=elMins(o.orderedAt);const isLate=mins>=20;
          const sc=isLate?"#C62828":S_COLOR[o.status];
          return(<div key={o.id} style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.12)",border:`3px solid ${sc}`}}>
            <div style={{background:sc,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:20,fontWeight:900,color:"white"}}>{o.table}</div><div style={{fontSize:13,color:"rgba(255,255,255,0.85)"}}>{o.type} · {o.server}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:30,fontWeight:900,color:"white"}}>{mins}m</div><div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>{isLate?"⚠️ RUNNING LATE":"elapsed"}</div></div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {o.items.map((item,i)=>(<div key={i} style={{display:"flex",padding:"9px 0",borderBottom:i<o.items.length-1?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:17,fontWeight:800,color:C.text}}>×{item.qty} {item.name}</span>
              </div>))}
              {o.notes&&<div style={{marginTop:10,padding:"10px 14px",background:"#FFF9C4",borderRadius:10,fontSize:14,fontWeight:700,color:"#E65100"}}>📝 {o.notes}</div>}
            </div>
            <div style={{padding:"0 20px 16px"}}>
              <button onClick={()=>advance(o.id)} style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:isLate?"#C62828":sc,color:"white",fontSize:16,fontWeight:900,cursor:"pointer",letterSpacing:0.5}}>{S_LABEL[o.status]}</button>
            </div>
          </div>);
        })}
      </div>
    </div>);
  };

  const KitchenTab=()=>{
    const advance=(id)=>{
      setOrders(p=>p.map(o=>{
        if(o.id!==id)return o;
        const next={Pending:"Preparing",Preparing:"Ready",Ready:"Served"}[o.status]||o.status;
        return{...o,status:next,servedAt:next==="Served"?new Date().toISOString():o.servedAt};
      }));
    };
    const cancel=id=>setOrders(p=>p.map(o=>o.id===id?{...o,status:"Cancelled"}:o));

    const active=orders.filter(o=>["Pending","Preparing","Ready"].includes(o.status));
    const completed=orders.filter(o=>["Served","Cancelled"].includes(o.status)).slice(0,10);

    const nextLabel={Pending:"▶ Start Preparing",Preparing:"✓ Mark Ready",Ready:"🍽 Mark Served"};
    const statusColor={Pending:"#FF9800",Preparing:"#1565C0",Ready:"#2E7D32"};
    const elapsed=t=>{ if(!t)return""; const m=Math.floor((Date.now()-new Date(t).getTime())/60000); return m<1?"just now":`${m}m ago`; };

    return(<div>
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        {[["🟠 Pending",orders.filter(o=>o.status==="Pending").length,"#FFF3E0","#E65100"],["🔵 Preparing",orders.filter(o=>o.status==="Preparing").length,"#E3F2FD","#1565C0"],["🟢 Ready",orders.filter(o=>o.status==="Ready").length,"#E8F5E9","#2E7D32"],["✅ Served Today",orders.filter(o=>o.status==="Served").length,"#F5F5F5","#616161"]].map(([l,v,bg,tx])=>(<div key={l} style={{background:bg,borderRadius:12,padding:"10px 16px",border:`1px solid ${tx}30`,textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:tx}}>{v}</div><div style={{fontSize:11,color:C.textL}}>{l}</div></div>))}
      </div>

      {/* Active orders */}
      {active.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.textL,background:"white",borderRadius:16,border:`1px solid ${C.border}`,marginBottom:16}}><div style={{fontSize:40,marginBottom:10}}>✅</div><div style={{fontSize:14,fontWeight:700}}>Kitchen is all clear!</div><div style={{fontSize:12,marginTop:4}}>No pending orders right now</div></div>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:20}}>
        {active.map(o=>(
          <div key={o.id} style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 3px 16px rgba(0,0,0,0.1)",border:`2px solid ${statusColor[o.status]}40`}}>
            {/* Status bar */}
            <div style={{background:statusColor[o.status],padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"white"}}>
                <div style={{fontSize:14,fontWeight:900}}>{o.table}</div>
                <div style={{fontSize:11,opacity:0.85}}>{o.type} · {o.server}</div>
              </div>
              <div style={{textAlign:"right",color:"white"}}>
                <Badge label={o.status}/>
                <div style={{fontSize:10,opacity:0.8,marginTop:4}}>#{o.id.toString().slice(-4)} · {elapsed(o.orderedAt)}</div>
              </div>
            </div>
            {/* Items */}
            <div style={{padding:"12px 16px"}}>
              {o.items.map((item,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<o.items.length-1?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:13,fontWeight:700,color:C.text}}>×{item.qty} {item.name}</span>
                <span style={{fontSize:12,color:C.textL}}>KSh {(item.price*item.qty).toLocaleString()}</span>
              </div>))}
              {o.notes&&<div style={{marginTop:8,padding:"6px 10px",background:"#FFF8E1",borderRadius:8,fontSize:12,color:C.textM,fontStyle:"italic"}}>📝 {o.notes}</div>}
              <div style={{marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:15,fontWeight:900,color:C.navy}}>KSh {o.total.toLocaleString()}</div>
                <Badge label={o.payMethod||"Cash"}/>
              </div>
            </div>
            {/* Actions */}
            <div style={{padding:"10px 16px",background:C.sandL,display:"flex",gap:8}}>
              <button onClick={()=>advance(o.id)} style={{flex:2,padding:"9px 12px",borderRadius:10,border:"none",background:statusColor[o.status],color:"white",cursor:"pointer",fontWeight:700,fontSize:12}}>{nextLabel[o.status]}</button>
              {o.status==="Pending"&&<button onClick={()=>cancel(o.id)} style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${C.danger}`,background:"white",color:C.danger,cursor:"pointer",fontWeight:700,fontSize:12}}>Cancel</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Recent completed */}
      {completed.length>0&&(<div>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Recent Completed Orders</div>
        <div style={{background:"white",borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}`}}>
          {completed.map((o,i)=>(<div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:i<completed.length-1?`1px solid ${C.border}`:"none",background:i%2===0?"white":`${C.sand}40`}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{o.table} <span style={{fontWeight:400,color:C.textL}}>· {o.type}</span></div>
              <div style={{fontSize:11,color:C.textL}}>{o.items.map(i=>`${i.qty}× ${i.name}`).join(", ")}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:900,color:C.navy}}>KSh {o.total.toLocaleString()}</div>
              <Badge label={o.status}/>
            </div>
          </div>))}
        </div>
      </div>)}
    </div>);
  };

  // ── SALES & REPORTS ────────────────────────────────────────
  const SalesTab=()=>{
    const today=todayISO();
    const todayOrders=orders.filter(o=>o.orderedAt?.startsWith(today)&&o.status!=="Cancelled");
    const todayRev=todayOrders.reduce((s,o)=>s+o.total,0);
    const pendingRev=todayOrders.filter(o=>!o.paid&&o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
    const avgOrder=todayOrders.length?Math.round(todayRev/todayOrders.length):0;

    // top items
    const itemCounts={};
    orders.filter(o=>o.status==="Served").forEach(o=>o.items.forEach(i=>{if(!itemCounts[i.name])itemCounts[i.name]={name:i.name,qty:0,revenue:0};itemCounts[i.name].qty+=i.qty;itemCounts[i.name].revenue+=i.price*i.qty;}));
    const topItems=Object.values(itemCounts).sort((a,b)=>b.revenue-a.revenue).slice(0,8);

    // by category
    const catRev={};
    orders.filter(o=>o.status==="Served").forEach(o=>o.items.forEach(i=>{const cat=menu.find(m=>m.id===i.menuId)?.cat||"Other";if(!catRev[cat])catRev[cat]=0;catRev[cat]+=i.price*i.qty;}));
    const maxCatRev=Math.max(...Object.values(catRev),1);

    // by order type
    const typeRev={};
    orders.filter(o=>o.status!=="Cancelled").forEach(o=>{if(!typeRev[o.type])typeRev[o.type]={count:0,rev:0};typeRev[o.type].count++;typeRev[o.type].rev+=o.total;});

    // Tips
    const tipOrders=orders.filter(o=>o.tip>0);
    const totalTips=tipOrders.reduce((s,o)=>s+(o.tip||0),0);
    const todayTips=todayOrders.reduce((s,o)=>s+(o.tip||0),0);
    const tipsByServer={};tipOrders.forEach(o=>{if(!tipsByServer[o.server])tipsByServer[o.server]=0;tipsByServer[o.server]+=o.tip;});
    const dineInOrds=orders.filter(o=>o.type==="Dine In"&&o.tip>0);
    const rsOrds=orders.filter(o=>o.type==="Room Service"&&o.tip>0);
    const avgTipPct=(arr)=>arr.length?Math.round(arr.reduce((s,o)=>s+(o.tip/o.total)*100,0)/arr.length):0;

    // Profitability
    const profitItems=menu.filter(m=>m.costPrice).map(m=>{
      const ords=orders.filter(o=>o.status==="Served").flatMap(o=>o.items.filter(i=>i.menuId===m.id));
      const rev=ords.reduce((s,i)=>s+i.price*i.qty,0);
      const cost=ords.reduce((s,i)=>s+m.costPrice*i.qty,0);
      const margin=rev>0?Math.round((1-cost/rev)*100):Math.round((1-m.costPrice/m.price)*100);
      return{...m,soldRev:rev,margin};
    }).sort((a,b)=>a.margin-b.margin);
    const catCost={};const catRevCost={};
    orders.filter(o=>o.status==="Served").forEach(o=>o.items.forEach(i=>{const m=menu.find(x=>x.id===i.menuId);if(!m?.costPrice)return;const cat=m.cat;if(!catCost[cat])catCost[cat]=0;if(!catRevCost[cat])catRevCost[cat]=0;catCost[cat]+=m.costPrice*i.qty;catRevCost[cat]+=i.price*i.qty;}));

    const CAT_COLORS={"Breakfast":"#FF9800","Lunch":"#2E7D32","Dinner":"#1565C0","Snacks & Sides":"#E65100","Beverages":"#00796B","Desserts":"#AD1457"};

    return(<div>
      {/* KPI cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:12,marginBottom:20}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Today Revenue",v:`KSh ${todayRev.toLocaleString()}`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Today Orders",v:todayOrders.length},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Avg Order Value",v:`KSh ${avgOrder.toLocaleString()}`},{bg:"#FFF3E0",b:"#FFB74D",tx:C.warning,l:"Pending Payment",v:`KSh ${pendingRev.toLocaleString()}`},{bg:"#F3E5F5",b:"#CE93D8",tx:"#6A1B9A",l:"Total Tips",v:`KSh ${totalTips.toLocaleString()}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Revenue by category */}
        <Card>
          <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>📊 Revenue by Category</div>
          {Object.entries(catRev).sort((a,b)=>b[1]-a[1]).map(([cat,rev])=>(<div key={cat} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:700,color:C.text}}>{cat}</span><span style={{color:C.textL}}>KSh {rev.toLocaleString()}</span></div>
            <div style={{background:C.sandL,borderRadius:20,height:10,overflow:"hidden"}}><div style={{height:"100%",width:`${(rev/maxCatRev)*100}%`,background:CAT_COLORS[cat]||C.navy,borderRadius:20}}/></div>
          </div>))}
        </Card>

        {/* By order type */}
        <Card>
          <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>🍽 Sales by Order Type</div>
          {Object.entries(typeRev).map(([type,data])=>(<div key={type} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{type}</div>
              <div style={{fontSize:13,fontWeight:900,color:C.navy}}>KSh {data.rev.toLocaleString()}</div>
            </div>
            <div style={{fontSize:11,color:C.textL}}>{data.count} order{data.count!==1?"s":""} · Avg KSh {Math.round(data.rev/data.count).toLocaleString()}</div>
          </div>))}
          <div style={{marginTop:14,padding:"10px 12px",background:C.sandL,borderRadius:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:800,color:C.navy}}>Total All Orders</span><span style={{fontSize:15,fontWeight:900,color:C.sageD}}>KSh {orders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+o.total,0).toLocaleString()}</span></div>
          </div>
        </Card>
      </div>

      {/* Tips section */}
      <Card style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:"#6A1B9A",marginBottom:14}}>💰 Tip Tracking</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:14}}>
          {[{l:"Tips Today",v:`KSh ${todayTips.toLocaleString()}`},{l:"Tips All Time",v:`KSh ${totalTips.toLocaleString()}`},{l:"Avg Tip % (Dine In)",v:`${avgTipPct(dineInOrds)}%`},{l:"Avg Tip % (Room Svc)",v:`${avgTipPct(rsOrds)}%`}].map(s=>(<div key={s.l} style={{background:"#F3E5F5",borderRadius:12,padding:"10px 14px",border:"1px solid #CE93D840"}}><div style={{fontSize:16,fontWeight:900,color:"#6A1B9A"}}>{s.v}</div><div style={{fontSize:11,color:C.textL}}>{s.l}</div></div>))}
        </div>
        {Object.keys(tipsByServer).length>0&&(<div>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>Tips by Server</div>
          {Object.entries(tipsByServer).sort((a,b)=>b[1]-a[1]).map(([sv,amt])=>(<div key={sv} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.text}}>{sv}</span><span style={{fontWeight:800,color:"#6A1B9A"}}>KSh {amt.toLocaleString()}</span></div>))}
        </div>)}
        {tipOrders.length===0&&<div style={{textAlign:"center",padding:"16px",color:C.textL,fontSize:13}}>No tips recorded yet. Tips can be added when placing an order.</div>}
      </Card>

      {/* Profitability */}
      {profitItems.length>0&&(<Card style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:6}}>📈 Profitability by Item</div>
        <div style={{fontSize:11,color:C.textL,marginBottom:14}}>Items with food cost &gt; 50% flagged in red. Sorted by lowest margin first.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,marginBottom:14}}>
          {profitItems.slice(0,12).map(m=>{const low=m.margin<50;return(<div key={m.id} style={{background:low?"#FFF8F8":"#F8FFF8",borderRadius:10,padding:"10px 12px",border:`1px solid ${low?C.danger+"40":C.sageD+"30"}`}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:4}}>{m.emoji} {m.name}</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span style={{color:C.textL}}>Cost: KSh {m.costPrice}</span>
              <span style={{fontWeight:800,color:low?C.danger:C.sageD}}>{m.margin}% margin{low?" ⚠️":""}</span>
            </div>
          </div>);})}
        </div>
        {Object.keys(catRevCost).length>0&&(<div>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>Gross Margin by Category</div>
          {Object.entries(catRevCost).sort((a,b)=>b[1]-a[1]).map(([cat,rev])=>{const cost=catCost[cat]||0;const m=rev>0?Math.round((1-cost/rev)*100):0;return(<div key={cat} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{fontWeight:700,color:CAT_COLORS[cat]||C.navy}}>{cat}</span><span style={{color:C.textL}}>KSh {(rev-cost).toLocaleString()} gross profit · {m}% margin</span></div>
            <div style={{background:C.sandL,borderRadius:20,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${m}%`,background:m<50?C.danger:C.sageD,borderRadius:20}}/></div>
          </div>);})}
        </div>)}
      </Card>)}

      {/* Top selling items */}
      <Card style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>🏆 Top Selling Items</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {topItems.map((item,i)=>(
            <div key={item.name} style={{background:i===0?`linear-gradient(135deg,${C.gold}20,${C.goldL}20)`:C.sandL,borderRadius:12,padding:"12px 14px",border:`1px solid ${i===0?C.gold:C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                {i===0&&<span style={{fontSize:16}}>🥇</span>}{i===1&&<span style={{fontSize:16}}>🥈</span>}{i===2&&<span style={{fontSize:16}}>🥉</span>}
                <div style={{fontSize:12,fontWeight:800,color:C.text}}>{item.name}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:C.textL}}>{item.qty} served</span>
                <span style={{fontSize:13,fontWeight:800,color:C.sageD}}>KSh {item.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* All orders table */}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,fontWeight:800,color:C.navy}}>📋 All Orders Log</div>
          <span style={{fontSize:12,color:C.textL}}>{orders.length} total orders</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.7fr 0.7fr 0.6fr 0.8fr",gap:8,padding:"9px 18px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>
          {["Table / Location","Type","Items","Total","Tip","Method","Status"].map(h=>(<div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>))}
        </div>
        <div style={{maxHeight:360,overflowY:"auto"}}>
          {orders.map((o,i)=>(<div key={o.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.7fr 0.7fr 0.6fr 0.8fr",gap:8,padding:"11px 18px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}>
            <div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{o.table}</div><div style={{fontSize:10,color:C.textL}}>{o.server}</div></div>
            <div style={{fontSize:12,color:C.textM}}>{o.type}</div>
            <div style={{fontSize:11,color:C.textL}}>{o.items.slice(0,2).map(i=>`${i.qty}×${i.name.split(" ")[0]}`).join(", ")}{o.items.length>2&&`+${o.items.length-2}`}</div>
            <div style={{fontSize:13,fontWeight:800,color:C.navy}}>KSh {o.total.toLocaleString()}</div>
            <div style={{fontSize:12,fontWeight:700,color:o.tip>0?"#6A1B9A":C.textL}}>{o.tip>0?`KSh ${o.tip}`:"—"}</div>
            <div style={{fontSize:11,color:C.textM}}>{o.payMethod||"—"}</div>
            <Badge label={o.status}/>
          </div>))}
        </div>
      </Card>
    </div>);
  };

  // ── MENU MANAGEMENT ────────────────────────────────────────
  const MenuTab=()=>{
    const[selCat,setSelCat]=useState("All");
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({name:"",cat:"Breakfast",price:"",costPrice:"",desc:"",emoji:"🍽",prep:15,available:true});

    const save=()=>{setMenu(p=>[...p,{id:Date.now(),...form,price:parseInt(form.price)||0,costPrice:parseInt(form.costPrice)||null,prep:parseInt(form.prep)||15}]);setShowForm(false);setForm({name:"",cat:"Breakfast",price:"",costPrice:"",desc:"",emoji:"🍽",prep:15,available:true});};
    const toggle=(id)=>setMenu(p=>p.map(m=>m.id===id?{...m,available:!m.available}:m));
    const filtered=selCat==="All"?menu:menu.filter(m=>m.cat===selCat);
    const CAT_COLORS={"Breakfast":"#FF9800","Lunch":"#2E7D32","Dinner":"#1565C0","Snacks & Sides":"#E65100","Beverages":"#00796B","Desserts":"#AD1457"};
    const EMOJIS=["🍳","🥚","☕","🍹","🥗","🍲","🐟","🍗","🥩","🥪","🍛","🍝","🍟","🥞","🍱","🥤","💧","🍮","🍨","🍯","🥭","🍉","🫘","🌶️","🥢","🫓","🥑","🍍","🍓","🥐"];

    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["All",...MENU_CATEGORIES].map(c=>(<button key={c} onClick={()=>setSelCat(c)} style={{padding:"7px 14px",borderRadius:20,border:`2px solid ${selCat===c?(CAT_COLORS[c]||C.navy):C.border}`,background:selCat===c?(CAT_COLORS[c]||C.navy):"white",color:selCat===c?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:selCat===c?700:400}}>{c}</button>))}
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Item</button>
      </div>

      {showForm&&(<Card style={{marginBottom:16,border:`2px solid ${C.navy}`}}>
        <div style={{fontSize:15,fontWeight:800,color:C.navy,marginBottom:14}}>New Menu Item</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Field label="Item Name" col="1/-1"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp}/></Field>
          <Field label="Category"><select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} style={inp}>{MENU_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></Field>
          <Field label="Price (KSh)"><input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} style={inp}/></Field>
          <Field label="Cost Price (KSh)"><input type="number" value={form.costPrice} onChange={e=>setForm(p=>({...p,costPrice:e.target.value}))} style={inp} placeholder="Ingredient cost"/></Field>
          <Field label="Prep Time (min)"><input type="number" value={form.prep} onChange={e=>setForm(p=>({...p,prep:e.target.value}))} style={inp}/></Field>
          <Field label="Description" col="1/-1"><input value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} style={inp} placeholder="Brief description of the dish..."/></Field>
          <div>
            <label style={{fontSize:11,color:C.textL,fontWeight:700,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:8}}>Emoji Icon</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{EMOJIS.map(e=>(<button key={e} onClick={()=>setForm(p=>({...p,emoji:e}))} style={{width:32,height:32,borderRadius:8,border:`2px solid ${form.emoji===e?C.navy:C.border}`,background:form.emoji===e?`${C.navy}15`:"white",cursor:"pointer",fontSize:16}}>{e}</button>))}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}><button onClick={save} style={{background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Add to Menu</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
      </Card>)}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
        {filtered.map(item=>(
          <div key={item.id} style={{background:"white",borderRadius:14,padding:"14px 16px",border:`2px solid ${item.available?C.border:"#F5F5F5"}`,opacity:item.available?1:0.6}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center",flex:1}}>
                <span style={{fontSize:28}}>{item.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:C.text}}>{item.name}</div>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700,background:CAT_COLORS[item.cat]+"20",color:CAT_COLORS[item.cat]}}>{item.cat}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:16,fontWeight:900,color:C.sageD}}>KSh {item.price}</div>
                <div style={{fontSize:10,color:C.textL}}>⏱ {item.prep} min</div>
              </div>
            </div>
            <div style={{fontSize:12,color:C.textL,marginBottom:8,lineHeight:1.5}}>{item.desc}</div>
            {item.costPrice&&(()=>{const fc=Math.round((item.costPrice/item.price)*100);const low=fc>50;return(<div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:low?"#FFEBEE":"#E8F5E9",color:low?C.danger:C.sageD,fontWeight:700}}>Cost: KSh {item.costPrice}</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:low?"#FFEBEE":"#E8F5E9",color:low?C.danger:C.sageD,fontWeight:700}}>{100-fc}% margin{low?" ⚠️":""}</span>
            </div>);})()}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Badge label={item.available?"Available":"Unavailable"}/>
              <button onClick={()=>toggle(item.id)} style={{padding:"5px 14px",borderRadius:20,border:`1px solid ${item.available?C.danger:C.sageD}`,background:"white",color:item.available?C.danger:C.sageD,cursor:"pointer",fontSize:12,fontWeight:700}}>{item.available?"Disable":"Enable"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>);
  };

  return(<div>
    <SectionTitle title="Restaurant & Kitchen" sub={`CHABBS Dining · ${orders.filter(o=>o.status!=="Cancelled").length} orders · Chef Emmanuel Liru`}/>
    <SubTabs tabs={TABS} active={sub} setActive={setSub}/>
    {sub==="pos"&&<POSTab/>}
    {sub==="tablemap"&&<TableMapTab/>}
    {sub==="kds"&&<KDSTab/>}
    {sub==="kitchen"&&<KitchenTab/>}
    {sub==="sales"&&<SalesTab/>}
    {sub==="menu"&&<MenuTab/>}
  </div>);
};

// ─── REMAINING VIEWS (abbreviated for structure) ──────────────
const Dashboard=({villas,bookings,financials,maintenance,staff,restaurantOrders,gardenZones,poolChemistry,laundry,events,leads,setView})=>{
  const occ=villas.filter(v=>v.status==="Occupied").length,avl=villas.filter(v=>v.status==="Available").length,mnt=villas.filter(v=>v.status==="Maintenance").length,cln=villas.filter(v=>v.status==="Cleaning").length;
  const todayRev=financials[0]?.revenue||0,todayExp=financials[0]?.expenses||0,weekRev=financials.slice(0,5).reduce((s,f)=>s+f.revenue,0);
  const openMnt=maintenance.filter(m=>m.status==="Open"||m.status==="In Progress").length,upcoming=bookings.filter(b=>b.status==="Upcoming").length;
  const totalPayroll=staff.reduce((s,st)=>s+st.salary,0);
  const restRevToday=restaurantOrders.filter(o=>o.orderedAt?.startsWith("2026-03-18")&&o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
  const pendingKitchen=restaurantOrders.filter(o=>["Pending","Preparing"].includes(o.status)).length;
  const poolStatus=poolChemistry?.[0]?.status||"—";const gardenCritical=gardenZones?.filter(z=>z.status==="Critical").length||0;
  const activeLaundry=laundry?.filter(j=>j.stage!=="Delivered").length||0;const upcomingEvents=events?.filter(e=>e.status==="Confirmed").length||0;
  const pipelineVal=leads?.filter(l=>!["Won","Lost"].includes(l.stage)).reduce((s,l)=>s+l.value,0)||0;
  const today=new Date().toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  // Weather (static realistic Lodwar data)
  const weatherTemp=39,weatherDesc="Sunny",weatherHeat=weatherTemp>38;
  // Revenue comparison: today vs yesterday vs last week same day
  const todayRevComp=financials[0]?.revenue||0,yestRevComp=financials[1]?.revenue||0,lwRevComp=financials[6]?.revenue||0;
  const revTrend=(a,b)=>a>b?"▲":"▼",revColor=(a,b)=>a>b?C.success:C.danger;
  // Occupancy forecast next 7 days
  const forecastDays=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);const ds=d.toISOString().split("T")[0];const cnt=bookings.filter(b=>b.status!=="Checked Out"&&bookingOnDate(b,ds)).length;const label=i===0?"Today":i===1?"Tmrw":d.toLocaleDateString("en-KE",{weekday:"short"}).slice(0,3);return{label,count:cnt,date:ds};});
  const maxForecast=Math.max(...forecastDays.map(d=>d.count),1);
  return(<div>
    <SectionTitle title="Resort Overview" sub={today}/>
    <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,borderRadius:20,padding:"22px 26px",marginBottom:14,color:"white",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:18}}>
        <div><div style={{fontSize:11,letterSpacing:3,opacity:0.55,textTransform:"uppercase"}}>Tonight's Occupancy Rate</div><div style={{fontSize:52,fontWeight:900,lineHeight:1,marginTop:4}}>{occ*10}%</div><div style={{fontSize:13,opacity:0.75,marginTop:5}}>{occ} of 10 villas occupied</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{[["Occupied",occ,"#64B5F6"],["Available",avl,"#81C784"],["Maintenance",mnt,"#FFB74D"],["Cleaning",cln,"#CE93D8"]].map(([l,v,c])=>(<div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.09)",borderRadius:12,padding:"9px 16px"}}><div style={{fontSize:22,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:10,opacity:0.65,marginTop:2}}>{l}</div></div>))}</div>
      </div>
    </div>
    {/* Quick Actions Toolbar */}
    <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
      {[{icon:"📅",label:"New Booking",action:()=>setView("bookings"),color:C.navy},{icon:"🍽",label:"New Order",action:()=>setView("restaurant"),color:"#00796B"},{icon:"🔧",label:"Log Issue",action:()=>setView("maintenance"),color:C.terra},{icon:"📦",label:"Add Stock",action:()=>setView("inventory"),color:"#6A1B9A"}].map(a=>(<button key={a.label} onClick={a.action} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:12,border:`2px solid ${a.color}30`,background:"white",color:a.color,fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",transition:"all 0.15s"}}><span style={{fontSize:16}}>{a.icon}</span>{a.label}</button>))}
    </div>
    {/* Weather + Revenue Comparison row */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:12,marginBottom:14}}>
      <div style={{background:weatherHeat?"linear-gradient(135deg,#E65100,#FF8C00)":"linear-gradient(135deg,#1565C0,#1E88E5)",borderRadius:16,padding:"16px 20px",color:"white"}}>
        <div style={{fontSize:11,opacity:0.7,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Lodwar Weather</div>
        <div style={{fontSize:32,fontWeight:900}}>{weatherTemp}°C</div>
        <div style={{fontSize:13,marginTop:3,opacity:0.9}}>☀️ {weatherDesc} · Lodwar</div>
        {weatherHeat&&<div style={{marginTop:8,fontSize:11,fontWeight:800,background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",display:"inline-block"}}>🌡 Heat Protocol Active</div>}
      </div>
      <Card style={{padding:"16px 20px"}}>
        <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:10}}>💰 Revenue Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[["Today",todayRevComp,null],["Yesterday",yestRevComp,todayRevComp],["Last Week",lwRevComp,todayRevComp]].map(([l,v,comp])=>(<div key={l} style={{background:C.sandL,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
            <div style={{fontSize:18,fontWeight:900,color:C.navy,marginTop:4}}>KSh {(v/1000).toFixed(0)}k</div>
            {comp!=null&&<div style={{fontSize:12,fontWeight:700,color:revColor(v,comp)}}>{revTrend(v,comp)} {Math.abs(Math.round(((v-comp)/Math.max(comp,1))*100))}%</div>}
          </div>))}
        </div>
      </Card>
    </div>
    {/* Occupancy Forecast */}
    <Card style={{marginBottom:14,padding:"16px 20px"}}>
      <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:12}}>📊 7-Day Occupancy Forecast</div>
      <div style={{display:"flex",gap:8,alignItems:"flex-end",height:72}}>
        {forecastDays.map(d=>{const h=Math.round((d.count/10)*60)+8;const active=d.label==="Today";return(<div key={d.date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:10,fontWeight:800,color:d.count>0?C.navy:C.textL}}>{d.count}/10</div>
          <div style={{width:"100%",height:h,borderRadius:"6px 6px 0 0",background:active?C.navy:d.count>6?C.sageD:d.count>3?C.gold:C.border,transition:"height 0.3s"}}/>
          <div style={{fontSize:9,color:active?C.navy:C.textL,fontWeight:active?800:400}}>{d.label}</div>
        </div>);})}
      </div>
    </Card>
    {/* Villa Occupancy Map */}
    <Card style={{marginBottom:14,padding:"16px 20px"}}>
      <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:12}}>🏡 Villa Occupancy Map</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        {villas.map(v=>{
          const activeB=bookings.find(b=>b.villaId===v.id&&b.status==="Checked In");
          const roomSt=r=>{if(v.status==="Maintenance")return"Maintenance";if(v.status==="Cleaning")return"Cleaning";if(!activeB)return"Available";if(activeB.type==="Whole Villa")return"Occupied";return activeB.rooms?.includes(r.type)?"Occupied":"Available";};
          const RC={Occupied:C.navy,Available:"#66BB6A",Maintenance:"#FFA726",Cleaning:"#BA68C8"};
          const VC={Occupied:C.navy,Available:C.sageD,Maintenance:C.terra,Cleaning:"#8E24AA"};
          const RL={exec:"Suite",dl:"Rm A",dr:"Rm B"};
          return(
            <div key={v.id} style={{border:`1.5px solid ${VC[v.status]}40`,borderRadius:10,padding:"8px 10px",background:v.status==="Occupied"?`${C.navy}07`:"white"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontSize:11,fontWeight:800,color:VC[v.status]}}>{v.name}</div>
                <div style={{width:7,height:7,borderRadius:"50%",background:VC[v.status]}}/>
              </div>
              <div style={{display:"flex",gap:3}}>
                {v.rooms.map(r=>{const rs=roomSt(r);return(
                  <div key={r.id} title={`${RL[r.type]||r.type}: ${rs}`} style={{flex:1,background:RC[rs]||"#eee",borderRadius:4,padding:"5px 2px",textAlign:"center"}}>
                    <div style={{fontSize:8,color:"white",fontWeight:700,lineHeight:1}}>{RL[r.type]||r.type}</div>
                  </div>
                );})}
              </div>
              {activeB&&<div style={{fontSize:9,color:C.textL,marginTop:5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>👤 {activeB.guest.split(" ")[0]}</div>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
        {[["Occupied",C.navy],["Available","#66BB6A"],["Maintenance","#FFA726"],["Cleaning","#BA68C8"]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.textL}}>
            <div style={{width:10,height:10,borderRadius:2,background:c}}/>{l}
          </div>
        ))}
      </div>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:20}}>
      {[{icon:"💰",label:"Accommodation Today",val:`KSh ${todayRev.toLocaleString()}`,sub:`Exp: KSh ${todayExp.toLocaleString()}`,color:C.sageD},{icon:"🍽",label:"Restaurant Today",val:`KSh ${restRevToday.toLocaleString()}`,sub:`${restaurantOrders.filter(o=>o.orderedAt?.startsWith("2026-03-18")).length} orders`,color:"#00796B"},{icon:"👥",label:"Monthly Payroll",val:`KSh ${totalPayroll.toLocaleString()}`,sub:`${staff.length} staff`,color:"#6A1B9A"},{icon:"⚠️",label:"Open Maintenance",val:openMnt,sub:"Need attention",color:openMnt>0?C.terra:C.sageD},{icon:"🍳",label:"Kitchen Queue",val:pendingKitchen,sub:"Active orders",color:pendingKitchen>0?C.warning:C.sageD},{icon:"🗓",label:"Arrivals",val:upcoming,sub:"Upcoming check-ins",color:C.info},{icon:"🏊",label:"Pool Status",val:poolStatus,sub:"Latest reading",color:poolStatus==="Safe"?C.sageD:poolStatus==="Caution"?"#F57F17":C.danger},{icon:"🌿",label:"Garden Alerts",val:gardenCritical,sub:gardenCritical>0?"Zones need care":"All zones OK",color:gardenCritical>0?C.danger:C.sageD},{icon:"👕",label:"Laundry Active",val:activeLaundry,sub:"Jobs in progress",color:activeLaundry>0?C.info:C.sageD},{icon:"🎪",label:"Events Confirmed",val:upcomingEvents,sub:"Upcoming events",color:C.info},{icon:"🎯",label:"Sales Pipeline",val:`KSh ${(pipelineVal/1000).toFixed(0)}k`,sub:`${leads?.filter(l=>!["Won","Lost"].includes(l.stage)).length||0} active leads`,color:C.terra},{icon:"📅",label:"Week Revenue",val:`KSh ${weekRev.toLocaleString()}`,sub:"Last 5 days",color:C.gold}].map(s=>(<div key={s.label} style={{background:"white",borderRadius:14,padding:16,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:10,color:C.textL,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>{s.label}</div><div style={{fontSize:24,fontWeight:900,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:C.textL,marginTop:3}}>{s.sub}</div></div><span style={{fontSize:22}}>{s.icon}</span></div></div>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>🏡 Active Guests</div>{bookings.filter(b=>b.status==="Checked In").map(b=>(<div key={b.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{b.guest}</div><div style={{fontSize:11,color:C.textL}}>Villa {b.villaId} · Out: {b.checkOut}</div></div><Badge label={b.payment}/></div>))}</Card>
      <Card><div style={{fontSize:13,fontWeight:800,color:"#00796B",marginBottom:12}}>🍽 Kitchen Status</div>{restaurantOrders.filter(o=>["Pending","Preparing","Ready"].includes(o.status)).map(o=>(<div key={o.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{o.table}</div><div style={{fontSize:11,color:C.textL}}>{o.items.length} item{o.items.length!==1?"s":""} · KSh {o.total.toLocaleString()}</div></div><Badge label={o.status}/></div>))}{restaurantOrders.filter(o=>["Pending","Preparing","Ready"].includes(o.status)).length===0&&<div style={{padding:"16px 0",textAlign:"center",color:C.textL,fontSize:12}}>✅ No active orders</div>}</Card>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>🔧 Maintenance</div>{maintenance.filter(m=>m.status!=="Resolved").map(m=>(<div key={m.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:12,fontWeight:700,color:C.text,flex:1,paddingRight:8}}>{m.asset}</div><Badge label={m.status}/></div><div style={{fontSize:11,color:C.textL,marginTop:2}}>{m.issue}</div></div>))}</Card>
    </div>
    {/* Additional Panels Row */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginTop:14}}>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.sageD,marginBottom:12}}>🌿 Garden Status</div>{gardenZones?.filter(z=>z.status!=="Good").map(z=>(<div key={z.id} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{z.icon} {z.name}</div><div style={{fontSize:10,color:C.textL}}>{z.notes}</div></div><Badge label={z.status}/></div>))||null}{(!gardenZones||gardenZones.filter(z=>z.status!=="Good").length===0)&&<div style={{padding:"16px 0",textAlign:"center",color:C.textL,fontSize:12}}>✅ All zones healthy</div>}</Card>
      <Card><div style={{fontSize:13,fontWeight:800,color:"#6A1B9A",marginBottom:12}}>👕 Active Laundry</div>{laundry?.filter(j=>j.stage!=="Delivered").slice(0,4).map(j=>(<div key={j.id} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{j.villa}</div><div style={{fontSize:10,color:C.textL}}>{j.assignee}</div></div><Badge label={j.stage}/></div>))||null}{(!laundry||laundry.filter(j=>j.stage!=="Delivered").length===0)&&<div style={{padding:"16px 0",textAlign:"center",color:C.textL,fontSize:12}}>✅ All laundry delivered</div>}</Card>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.terra,marginBottom:12}}>🎪 Upcoming Events</div>{events?.filter(e=>e.status==="Confirmed").slice(0,4).map(e=>(<div key={e.id} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:12,fontWeight:700,color:C.text,flex:1,paddingRight:8}}>{e.name}</div><span style={{fontSize:11,fontWeight:700,color:C.sageD}}>KSh {(e.total/1000).toFixed(0)}k</span></div><div style={{fontSize:10,color:C.textL,marginTop:2}}>📅 {e.startDate} · {e.venue} · {e.pax} pax</div></div>))||null}{(!events||events.filter(e=>e.status==="Confirmed").length===0)&&<div style={{padding:"16px 0",textAlign:"center",color:C.textL,fontSize:12}}>No confirmed events</div>}</Card>
    </div>
    {/* Scripture footer */}
    <div style={{marginTop:16,padding:"12px 16px",background:`linear-gradient(135deg,${C.navy}06,${C.sage}06)`,borderRadius:12,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:13,fontStyle:"italic",color:C.textM}}>"For where two or three gather in my name, there am I with them." — Matthew 18:20</div></div>
  </div>);
};

const VillasView=({villas,setVillas,role,showToast=()=>{}})=>{
  const[sel,setSel]=useState(null);const statuses=["Available","Occupied","Maintenance","Cleaning"];const canEdit=role?.id==="admin"||role?.id==="receptionist";
  const changeStatus=(id,s)=>{setVillas(p=>p.map(v=>v.id===id?{...v,status:s}:v));if(s==="Cleaning")showToast(`Villa ${id} → Cleaning — Housekeeping notified 🔔`,"info");setSel(null);};
  return(<div>
    <SectionTitle title="Villa Management" sub="10 luxury 3-bedroom ensuite villas · CHABBS Resort"/>
    <Card style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:800,color:C.navy,marginBottom:9,letterSpacing:1,textTransform:"uppercase"}}>All Villas Include</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{VILLA_AMENITIES.map(a=>(<div key={a.label} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 11px",background:C.sandL,borderRadius:20,border:`1px solid ${C.border}`}}><span style={{fontSize:14}}>{a.icon}</span><div><div style={{fontSize:11,fontWeight:700,color:C.navy}}>{a.label}</div><div style={{fontSize:9,color:C.textL}}>{a.detail}</div></div></div>))}</div>
    </Card>
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{Object.entries(ROOM_SPECS).map(([k,spec])=>(<div key={k} style={{background:spec.bg,border:`1px solid ${spec.color}44`,borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:13}}>{spec.icon}</span><div><div style={{fontSize:11,fontWeight:800,color:spec.color}}>{spec.short} — {spec.name}</div><div style={{fontSize:9,color:C.textL}}>Ensuite{spec.bath?" · 🛁":" · 🚿"}{spec.screen?" · 📺":""}</div></div></div>))}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:12}}>
      {villas.map(v=>{const sc=SC[v.status]||SC.Available;const isOpen=sel===v.id;return(
        <div key={v.id} onClick={()=>setSel(isOpen?null:v.id)} style={{background:"white",borderRadius:14,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:`2px solid ${isOpen?C.navy:C.border}`,transition:"all 0.2s"}}>
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:17,fontWeight:900,color:"white"}}>{v.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginTop:2}}>3 Ensuite Bedrooms · Full Amenities</div></div><span style={{background:sc.bg,color:sc.tx,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700}}>{v.status}</span></div>
          <div style={{padding:"12px 16px"}}>
            {v.guests&&<div style={{fontSize:12,color:C.text,marginBottom:10,padding:"6px 10px",background:`${C.navy}07`,borderRadius:8,borderLeft:`3px solid ${C.navy}`}}>👤 {v.guests}</div>}
            {v.rooms.map(r=>{const spec=ROOM_SPECS[r.type];return(<div key={r.id} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{spec.icon}</span><div><div style={{fontSize:11,fontWeight:800,color:spec.color}}>{spec.short} — {spec.name}</div><div style={{fontSize:9,color:C.textL}}>Ensuite{spec.bath?" · 🛁":""}{spec.shower?" · 🚿":""}{spec.screen?" · 📺":""}</div></div></div><Badge label={r.status}/></div></div>);})}
            <div style={{marginTop:9,display:"flex",gap:5}}>{VILLA_AMENITIES.map(a=><span key={a.label} title={a.detail} style={{fontSize:14,cursor:"help"}}>{a.icon}</span>)}</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textL,marginTop:9}}><span>Cleaned: {v.lastCleaned}</span><span style={{fontWeight:700,color:C.navy}}>KSh {v.rateWhole.toLocaleString()}/night</span></div>
            {canEdit&&isOpen&&(<div style={{marginTop:12}}><div style={{fontSize:10,color:C.textL,fontWeight:700,marginBottom:7,letterSpacing:1,textTransform:"uppercase"}}>Change Status:</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{statuses.map(s=><button key={s} onClick={e=>{e.stopPropagation();changeStatus(v.id,s);}} style={{padding:"4px 11px",borderRadius:20,border:`1px solid ${SC[s]?.dot||C.border}`,background:v.status===s?SC[s]?.bg:"white",color:SC[s]?.tx||C.text,fontSize:11,cursor:"pointer",fontWeight:v.status===s?700:400}}>{s}</button>)}</div></div>)}
          </div>
        </div>
      );})}
    </div>
  </div>);
};

const SOURCE_COLORS={Referral:"#1565C0","Repeat Guest":"#2E7D32","Walk-in":"#E65100",Phone:"#6A1B9A",Google:"#C62828",Email:"#00796B","Social Media":"#F57F17"};
const BookingsView=({bookings,setBookings,villas,setVillas,role,logActivity})=>{
  const[activeTab,setActiveTab]=useState("list");const[showForm,setShowForm]=useState(false);const[filter,setFilter]=useState("All");
  const[form,setForm]=useState({guest:"",phone:"",idNo:"",checkIn:"",checkOut:"",type:"Whole Villa",villaId:1,rooms:[],payment:"Pending",amount:"",deposit:"",source:"Walk-in",color:"#1565C0"});
  const canBook=role?.id==="admin"||role?.id==="receptionist";const filtered=filter==="All"?bookings:bookings.filter(b=>b.status===filter);
  const nights=(ci,co)=>Math.max(1,Math.round((new Date(co)-new Date(ci))/(864e5)));
  const COLORS=["#1565C0","#6A1B9A","#2E7D32","#E65100","#B71C1C","#004D40","#37474F","#880E4F","#4E342E","#1A237E"];
  const save=()=>{
    const nb={id:Date.now(),...form,villaId:parseInt(form.villaId),amount:parseInt(form.amount)||0,deposit:parseInt(form.deposit)||0,nights:nights(form.checkIn,form.checkOut),status:"Upcoming",checkInTime:null,checkOutTime:null};
    setBookings(p=>[nb,...p]);
    logActivity?.("Booking Created",`${form.guest} — Villa ${form.villaId} (${form.checkIn}→${form.checkOut})`,"bookings");
    setShowForm(false);setForm({guest:"",phone:"",idNo:"",checkIn:"",checkOut:"",type:"Whole Villa",villaId:1,rooms:[],payment:"Pending",amount:"",deposit:"",source:"Walk-in",color:"#1565C0"});
  };
  const toggleRoom=r=>setForm(p=>({...p,rooms:p.rooms.includes(r)?p.rooms.filter(x=>x!==r):[...p.rooms,r]}));
  const checkIn=(b)=>{
    const ts=new Date().toISOString();
    setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"Checked In",checkInTime:ts}:x));
    setVillas?.(p=>p.map(v=>v.id===b.villaId?{...v,status:"Occupied",guests:b.guest}:v));
    logActivity?.("Check-In",`${b.guest} checked into Villa ${b.villaId}`,"bookings");
  };
  const checkOut=(b)=>{
    const ts=new Date().toISOString();
    setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"Checked Out",checkOutTime:ts}:x));
    setVillas?.(p=>p.map(v=>v.id===b.villaId?{...v,status:"Cleaning",guests:""}:v));
    logActivity?.("Check-Out",`${b.guest} checked out of Villa ${b.villaId}`,"bookings");
  };
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}><SectionTitle title="Bookings" sub={`${bookings.length} total reservations`}/>{canBook&&<button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"11px 18px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ New Booking</button>}</div>
    <div style={{display:"flex",gap:0,marginBottom:16,background:C.sandL,borderRadius:12,padding:4,width:"fit-content"}}>
      {[["list","📋 List"],["calendar","📅 Calendar"]].map(([t,l])=>(<button key={t} onClick={()=>setActiveTab(t)} style={{padding:"8px 18px",borderRadius:10,border:"none",fontSize:13,fontWeight:700,cursor:"pointer",background:activeTab===t?"white":"transparent",color:activeTab===t?C.navy:C.textL,boxShadow:activeTab===t?"0 2px 8px rgba(0,0,0,0.1)":"none",transition:"all 0.2s"}}>{l}</button>))}
    </div>
    {showForm&&(<Card style={{marginBottom:18,border:`2px solid ${C.navy}`}}>
      <div style={{fontSize:15,fontWeight:800,color:C.navy,marginBottom:14}}>New Reservation</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[["guest","Guest Full Name","text"],["phone","Phone","text"],["idNo","ID / Passport","text"],["amount","Total Amount (KSh)","number"],["deposit","Deposit Amount (KSh)","number"],["checkIn","Check-in Date","date"],["checkOut","Check-out Date","date"]].map(([k,l,t])=>(<Field key={k} label={l}><input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={inp}/></Field>))}
        <Field label="Booking Source"><select value={form.source} onChange={e=>setForm(p=>({...p,source:e.target.value}))} style={inp}><option>Walk-in</option><option>Phone</option><option>Email</option><option>Referral</option><option>Repeat Guest</option><option>Google</option><option>Social Media</option></select></Field>
        <Field label="Type"><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={inp}><option>Whole Villa</option><option>Per Room</option></select></Field>
        <Field label="Villa"><select value={form.villaId} onChange={e=>setForm(p=>({...p,villaId:e.target.value}))} style={inp}>{villas.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></Field>
        <Field label="Payment"><select value={form.payment} onChange={e=>setForm(p=>({...p,payment:e.target.value}))} style={inp}><option>Pending</option><option>Deposit</option><option>Paid</option><option>Invoice</option></select></Field>
        <Field label="Colour"><div style={{display:"flex",gap:6,flexWrap:"wrap",paddingTop:4}}>{COLORS.map(c=><div key={c} onClick={()=>setForm(p=>({...p,color:c}))} style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${form.color===c?"white":"transparent"}`,outline:form.color===c?`2px solid ${c}`:"none"}}/>)}</div></Field>
      </div>
      {form.type==="Per Room"&&(<div style={{marginTop:12}}><div style={{fontSize:11,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Select Rooms</div><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{Object.entries(ROOM_SPECS).map(([k,spec])=>(<div key={k} onClick={()=>toggleRoom(k)} style={{padding:"9px 14px",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:form.rooms.includes(k)?spec.bg:"white",border:`2px solid ${form.rooms.includes(k)?spec.color:C.border}`}}><span>{spec.icon}</span><div style={{fontSize:12,fontWeight:700,color:form.rooms.includes(k)?spec.color:C.text}}>{spec.short} – {spec.name}</div>{form.rooms.includes(k)&&<span style={{color:spec.color}}>✓</span>}</div>))}</div></div>)}
      <div style={{display:"flex",gap:10,marginTop:14}}><button onClick={save} style={{background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
    </Card>)}
    {activeTab==="list"&&(<>
      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>{["All","Checked In","Upcoming","Checked Out"].map(f=>(<button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${filter===f?C.navy:C.border}`,background:filter===f?C.navy:"white",color:filter===f?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:filter===f?700:400}}>{f}</button>))}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{filtered.map(b=>{
        const balance=(b.amount||0)-(b.deposit||0);const pct=b.amount?Math.round(((b.deposit||0)/b.amount)*100):0;const srcColor=SOURCE_COLORS[b.source]||C.textL;
        return(<Card key={b.id} style={{borderLeft:`5px solid ${b.color||C.navy}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                <div style={{fontSize:15,fontWeight:800,color:C.text}}>{b.guest}</div>
                {b.source&&<span style={{fontSize:10,fontWeight:800,color:srcColor,background:`${srcColor}15`,padding:"2px 8px",borderRadius:10,border:`1px solid ${srcColor}30`}}>{b.source}</span>}
              </div>
              <div style={{fontSize:11,color:C.textL,marginTop:2}}>📞 {b.phone} · 🪪 {b.idNo}</div>
              <div style={{fontSize:12,color:C.textM,marginTop:5}}>🏡 Villa {b.villaId} · {b.type} · {b.nights} night{b.nights!==1?"s":""}</div>
              <div style={{fontSize:11,color:C.textL,marginTop:3}}>📅 {b.checkIn} → {b.checkOut}</div>
              {b.checkInTime&&<div style={{fontSize:10,color:C.sageD,marginTop:2}}>✅ Checked in: {new Date(b.checkInTime).toLocaleString("en-KE",{dateStyle:"short",timeStyle:"short"})}</div>}
              {b.checkOutTime&&<div style={{fontSize:10,color:C.textL,marginTop:2}}>🚪 Checked out: {new Date(b.checkOutTime).toLocaleString("en-KE",{dateStyle:"short",timeStyle:"short"})}</div>}
              {/* Deposit progress bar */}
              {b.amount>0&&(<div style={{marginTop:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textL,marginBottom:3}}>
                  <span>Deposit: KSh {(b.deposit||0).toLocaleString()} ({pct}%)</span>
                  <span style={{fontWeight:700,color:balance>0?C.terra:C.sageD}}>{balance>0?`💰 Bal: KSh ${balance.toLocaleString()}`:"✅ Fully Paid"}</span>
                </div>
                <div style={{background:C.sandL,borderRadius:20,height:5,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct>=100?C.sageD:pct>=50?C.gold:C.terra,borderRadius:20}}/></div>
              </div>)}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:900,color:C.navy}}>KSh {b.amount.toLocaleString()}</div>
              <div style={{display:"flex",gap:7,marginTop:7,justifyContent:"flex-end",flexWrap:"wrap"}}><Badge label={b.status}/><Badge label={b.payment}/></div>
              {/* Check-in / Check-out buttons */}
              {canBook&&b.status==="Upcoming"&&<button onClick={()=>checkIn(b)} style={{marginTop:8,padding:"7px 14px",borderRadius:10,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12,width:"100%"}}>✅ Check In</button>}
              {canBook&&b.status==="Checked In"&&<button onClick={()=>checkOut(b)} style={{marginTop:8,padding:"7px 14px",borderRadius:10,background:C.terra,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12,width:"100%"}}>🚪 Check Out</button>}
            </div>
          </div>
        </Card>);
      })}{filtered.length===0&&<div style={{textAlign:"center",padding:40,color:C.textL}}>No bookings found.</div>}</div>
    </>)}
    {activeTab==="calendar"&&<Card><BookingCalendar bookings={bookings} villas={villas}/></Card>}
  </div>);
};

const HousekeepingView=({tasks,setTasks})=>{
  const checks=[["bedding","🛏","Bedding Changed"],["bathroom","🚿","Bathroom Deep Cleaned"],["descale","💧","Descaled — Salty Water Protocol","Salty Water"],["common","🏠","Common Area Cleaned"],["trash","🗑","All Trash Removed"]];
  const toggle=(id,key)=>setTasks(prev=>prev.map(t=>{if(t.id!==id)return t;const u={...t,[key]:!t[key]};const done=checks.every(([k])=>u[k]);const any=checks.some(([k])=>u[k]);return{...u,status:done?"Complete":any?"In Progress":"Pending"};}));
  return(<div><SectionTitle title="Housekeeping Tasks" sub={`${tasks.filter(t=>t.status==="Complete").length} of ${tasks.length} complete`}/>
    <div style={{background:"linear-gradient(135deg,#E3F2FD,#BBDEFB40)",border:"1px solid #90CAF9",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:12}}><div style={{fontSize:22}}>💧</div><div><div style={{fontSize:13,fontWeight:800,color:C.info}}>Weekly Salty Water Descaling Protocol</div><div style={{fontSize:12,color:"#1565C0",lineHeight:1.7,marginTop:2}}>Every Monday: Exec rooms — descale bathtubs + taps. Deluxe rooms — descale showerhead + tap. Use vinegar solution + wire brush. Document all work.</div></div></div>
    {tasks.map(task=>{const done=task.status==="Complete";return(<Card key={task.id} style={{marginBottom:12,overflow:"hidden",padding:0}}><div style={{background:done?`linear-gradient(135deg,${C.sageD},${C.sage})`:`linear-gradient(135deg,${C.navy},${C.navyM})`,padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:800,color:"white"}}>{task.villa} · {task.room}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>👤 {task.assignee} · Due: {task.dueDate}</div></div><Badge label={task.status}/></div>
      <div style={{padding:"14px 18px"}}>{checks.map(([key,icon,label,tag])=>(<label key={key} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}><input type="checkbox" checked={task[key]} onChange={()=>toggle(task.id,key)} style={{width:17,height:17,accentColor:C.sage,cursor:"pointer"}}/><span style={{fontSize:16}}>{icon}</span><span style={{flex:1,fontSize:13,color:task[key]?C.sage:C.text,textDecoration:task[key]?"line-through":"none",fontWeight:task[key]?400:600}}>{label}</span>{tag&&<span style={{fontSize:10,background:"#E3F2FD",color:C.info,padding:"2px 7px",borderRadius:10,fontWeight:700}}>{tag}</span>}{task[key]&&<span style={{fontSize:14}}>✅</span>}</label>))}{done&&<div style={{marginTop:12,padding:"10px 14px",background:`${C.sage}18`,borderRadius:10,textAlign:"center",fontSize:13,fontWeight:700,color:C.sageD}}>✅ Villa ready for next guest!</div>}</div>
    </Card>);})}
  </div>);
};

const MaintenanceView=({logs,setLogs,assets,setAssets,schedule,setSchedule})=>{
  const[sub,setSub]=useState("log");
  const TABS=[["log","🔧","Issue Log"],["assets","🏭","Asset Register"],["schedule","📅","PM Schedule"]];
  const pc=p=>p==="High"?C.danger:p==="Medium"?C.warning:C.sageD;
  const openCount=logs.filter(l=>l.status==="Open"||l.status==="In Progress").length;
  const totalCost=logs.reduce((s,l)=>s+(l.partsCost||0)+(l.labourHours||0)*800,0);

  const LogTab=()=>{
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({asset:"",issue:"",priority:"Low",parts:"",assignee:"",partsCost:"",labourHours:""});
    const save=()=>{
      setLogs(p=>[{id:Date.now(),...form,partsCost:parseFloat(form.partsCost)||0,labourHours:parseFloat(form.labourHours)||0,reported:new Date().toISOString().split("T")[0],resolved:null,status:"Open"},...p]);
      setShowForm(false);setForm({asset:"",issue:"",priority:"Low",parts:"",assignee:"",partsCost:"",labourHours:""});
    };
    const resolve=id=>setLogs(p=>p.map(l=>l.id===id?{...l,status:"Resolved",resolved:new Date().toISOString().split("T")[0]}:l));
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Open Issues",v:openCount},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"In Progress",v:logs.filter(l=>l.status==="In Progress").length},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Total Spend",v:`KSh ${totalCost.toLocaleString()}`}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:12,padding:"10px 14px",border:`1px solid ${s.b}`}}><div style={{fontSize:18,fontWeight:900,color:s.tx}}>{s.v}</div><div style={{fontSize:10,color:C.textL}}>{s.l}</div></div>))}
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.terra},${C.terraL})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Log Issue</button>
      </div>
      <div style={{background:`linear-gradient(135deg,${C.warning},#FF9800)`,borderRadius:12,padding:"12px 16px",marginBottom:14,color:"white"}}><div style={{fontWeight:800,fontSize:13,marginBottom:3}}>🔄 Weekly Preventive — Salty Water Borehole Protocol</div><div style={{fontSize:11,opacity:0.9,lineHeight:1.7}}>Every Monday: Exec rooms — descale bathtubs, taps. Deluxe rooms — descale showerheads. Pool filter check. Kitchen appliances inspection.</div></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.terra}`}}>
        <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Log Maintenance Issue</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Asset / Location"><input value={form.asset} onChange={e=>setForm(p=>({...p,asset:e.target.value}))} style={inp} placeholder="e.g. AC Unit – Villa 3"/></Field>
          <Field label="Assigned To"><input value={form.assignee} onChange={e=>setForm(p=>({...p,assignee:e.target.value}))} style={inp}/></Field>
          <Field label="Parts Needed"><input value={form.parts} onChange={e=>setForm(p=>({...p,parts:e.target.value}))} style={inp}/></Field>
          <Field label="Priority"><select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} style={inp}><option>High</option><option>Medium</option><option>Low</option></select></Field>
          <Field label="Parts Cost (KSh)"><input type="number" value={form.partsCost} onChange={e=>setForm(p=>({...p,partsCost:e.target.value}))} style={inp} placeholder="0"/></Field>
          <Field label="Labour Hours"><input type="number" step="0.5" value={form.labourHours} onChange={e=>setForm(p=>({...p,labourHours:e.target.value}))} style={inp} placeholder="0"/></Field>
          <Field label="Issue Description" col="1/-1"><textarea value={form.issue} onChange={e=>setForm(p=>({...p,issue:e.target.value}))} rows={3} style={{...inp,resize:"vertical"}}/></Field>
        </div>
        <div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.terra,color:"white",padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
      </Card>)}
      {logs.map(log=>{
        const cost=(log.partsCost||0)+(log.labourHours||0)*800;
        return(<Card key={log.id} style={{marginBottom:10,borderLeft:`4px solid ${pc(log.priority)}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                <div style={{fontSize:14,fontWeight:800,color:C.text}}>{log.asset}</div>
                <span style={{fontSize:11,padding:"2px 9px",borderRadius:10,fontWeight:800,background:log.priority==="High"?"#FFEBEE":log.priority==="Medium"?"#FFF8E1":"#E8F5E9",color:pc(log.priority)}}>{log.priority}</span>
              </div>
              <div style={{fontSize:12,color:C.textM,marginBottom:5}}>{log.issue}</div>
              <div style={{fontSize:11,color:C.textL}}>🔧 {log.assignee} · 📅 {log.reported}{log.resolved&&` · ✅ ${log.resolved}`}</div>
              {(log.partsCost>0||log.labourHours>0)&&<div style={{marginTop:6,display:"flex",gap:10,flexWrap:"wrap"}}>
                {log.partsCost>0&&<span style={{fontSize:11,background:"#FFF3E0",color:C.warning,padding:"2px 8px",borderRadius:8,fontWeight:700}}>Parts: KSh {log.partsCost.toLocaleString()}</span>}
                {log.labourHours>0&&<span style={{fontSize:11,background:"#E3F2FD",color:C.info,padding:"2px 8px",borderRadius:8,fontWeight:700}}>{log.labourHours}h labour</span>}
                {cost>0&&<span style={{fontSize:11,background:"#F3E5F5",color:"#6A1B9A",padding:"2px 8px",borderRadius:8,fontWeight:700}}>Total: KSh {cost.toLocaleString()}</span>}
              </div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
              <Badge label={log.status}/>
              {log.status!=="Resolved"&&<button onClick={()=>setLogs(p=>p.map(l=>l.id===log.id?{...l,status:"Resolved",resolved:new Date().toISOString().split("T")[0]}:l))} style={{padding:"5px 12px",borderRadius:8,background:C.sage,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>✓ Resolve</button>}
            </div>
          </div>
        </Card>);
      })}
    </div>);
  };

  const AssetsTab=()=>{
    const[sel,setSel]=useState(null);
    const cond=c=>c==="Good"?C.sageD:c==="Fair"?C.warning:C.danger;
    const condBg=c=>c==="Good"?"#E8F5E9":c==="Fair"?"#FFF8E1":"#FFEBEE";
    const totalValue=(assets||[]).reduce((s,a)=>s+a.value*(a.qty||1),0);
    const goodCount=(assets||[]).filter(a=>a.condition==="Good").length;
    const fairCount=(assets||[]).filter(a=>a.condition==="Fair").length;
    const poorCount=(assets||[]).filter(a=>a.condition==="Poor").length;
    const now=new Date();
    const isOverdue=a=>{if(!a.nextService)return false;return new Date(a.nextService)<now;};
    const isDueSoon=a=>{if(!a.nextService)return false;const d=new Date(a.nextService);const diff=(d-now)/(1000*60*60*24);return diff>=0&&diff<=30;};
    const overdueCount=(assets||[]).filter(isOverdue).length;
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:14}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Good",v:goodCount},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"Fair",v:fairCount},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Poor",v:poorCount},{bg:overdueCount>0?"#FFEBEE":"#E8F5E9",b:overdueCount>0?"#EF9A9A":"#81C784",tx:overdueCount>0?C.danger:C.sageD,l:"Service Overdue",v:overdueCount},{bg:C.sandL,b:C.border,tx:C.navy,l:"Total Asset Value",v:`KSh ${(totalValue/1000).toFixed(0)}k`}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:12,padding:"10px 14px",border:`1px solid ${s.b}`}}><div style={{fontSize:18,fontWeight:900,color:s.tx}}>{s.v}</div><div style={{fontSize:10,color:C.textL}}>{s.l}</div></div>))}
      </div>
      {overdueCount>0&&<div style={{padding:"10px 16px",background:"#FFEBEE",border:`1px solid #EF9A9A`,borderRadius:10,marginBottom:12,fontSize:13,color:C.danger,fontWeight:700}}>⚠️ {overdueCount} asset{overdueCount>1?"s":""} overdue for service. Schedule maintenance immediately.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {(assets||[]).map(a=>{
          const overdue=isOverdue(a);const dueSoon=isDueSoon(a);const warrantExpired=a.warranty&&new Date(a.warranty)<now;
          return(<Card key={a.id} style={{cursor:"pointer",border:`1px solid ${overdue?C.danger:dueSoon?"#FFE082":C.border}`}} >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}} onClick={()=>setSel(sel===a.id?null:a.id)}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                  <div style={{fontSize:14,fontWeight:800,color:C.navy}}>{a.name}{a.qty>1&&<span style={{fontSize:11,color:C.textL,fontWeight:400}}> ×{a.qty}</span>}</div>
                  <span style={{fontSize:11,padding:"2px 9px",borderRadius:10,fontWeight:700,background:condBg(a.condition),color:cond(a.condition)}}>{a.condition}</span>
                  {overdue&&<span style={{fontSize:11,padding:"2px 9px",borderRadius:10,fontWeight:700,background:"#FFEBEE",color:C.danger}}>⚠️ Overdue</span>}
                  {!overdue&&dueSoon&&<span style={{fontSize:11,padding:"2px 9px",borderRadius:10,fontWeight:700,background:"#FFF8E1",color:C.warning}}>🔔 Due Soon</span>}
                </div>
                <div style={{fontSize:12,color:C.textM}}>{a.category} · {a.location}</div>
                <div style={{fontSize:11,color:C.textL,marginTop:3}}>Next service: <strong style={{color:overdue?C.danger:C.text}}>{a.nextService}</strong> · Last: {a.lastService}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:16,fontWeight:900,color:C.navy}}>KSh {(a.value*(a.qty||1)).toLocaleString()}</div>
                <div style={{fontSize:10,color:C.textL}}>asset value</div>
                {warrantExpired&&<div style={{fontSize:10,color:C.danger,fontWeight:700,marginTop:3}}>⚠️ Warranty expired</div>}
              </div>
            </div>
            {sel===a.id&&(<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:8}}>
                {[["Purchase Date",a.purchaseDate],["Warranty Until",a.warranty||"—"],["Quantity",a.qty||1]].map(([l,v])=>(<div key={l}><div style={{fontSize:10,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{v}</div></div>))}
              </div>
              {a.notes&&<div style={{fontSize:12,color:C.textM,fontStyle:"italic",background:C.sandL,padding:"8px 12px",borderRadius:8}}>{a.notes}</div>}
            </div>)}
          </Card>);
        })}
      </div>
    </div>);
  };

  const ScheduleTab=()=>{
    const now=new Date();
    const isOverdue=s=>{if(!s.nextDue)return false;return new Date(s.nextDue)<now;};
    const daysUntil=s=>{if(!s.nextDue)return null;return Math.ceil((new Date(s.nextDue)-now)/(1000*60*60*24));};
    const freqColor={Weekly:C.info,Monthly:C.sageD,Quarterly:C.terra};
    const overdueItems=(schedule||[]).filter(isOverdue);
    const createIssue=(task)=>{
      setLogs(p=>[{id:Date.now(),asset:task.task,issue:`Scheduled: ${task.frequency} ${task.category} maintenance`,priority:"Low",parts:"",assignee:task.assignee,partsCost:0,labourHours:0,reported:new Date().toISOString().split("T")[0],resolved:null,status:"Scheduled"},...p]);
      setSchedule(p=>p.map(s=>s.id===task.id?{...s,lastDone:new Date().toISOString().split("T")[0]}:s));
    };
    return(<div>
      {overdueItems.length>0&&<div style={{padding:"10px 16px",background:"#FFEBEE",border:`1px solid #EF9A9A`,borderRadius:10,marginBottom:12,fontSize:13,color:C.danger,fontWeight:700}}>
        🚨 {overdueItems.length} overdue task{overdueItems.length>1?"s":" "}— schedule immediately!
      </div>}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {[["All",""],[" Weekly",C.info],["Monthly",C.sageD],["Quarterly",C.terra]].map(([f,c])=>{
          const key=f.trim();const count=key==="All"?(schedule||[]).length:(schedule||[]).filter(s=>s.frequency===key).length;
          return(<span key={f} style={{padding:"4px 12px",borderRadius:20,background:key==="All"?C.navy:c||C.navy,color:"white",fontSize:11,fontWeight:700}}>{f.trim()} ({count})</span>);
        })}
      </div>
      {["Weekly","Monthly","Quarterly"].map(freq=>{
        const items=(schedule||[]).filter(s=>s.frequency===freq);
        if(!items.length)return null;
        return(<div key={freq} style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:800,color:freqColor[freq],marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>🔄 {freq}</div>
          {items.map(task=>{
            const overdue=isOverdue(task);const days=daysUntil(task);
            return(<Card key={task.id} style={{marginBottom:8,borderLeft:`4px solid ${overdue?C.danger:freqColor[freq]}`,padding:"12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:3}}>{task.task}</div>
                  <div style={{fontSize:11,color:C.textL}}>🔧 {task.assignee} · 📅 {task.dayOrDate} · Last: {task.lastDone}</div>
                  {task.notes&&<div style={{fontSize:11,color:C.textM,marginTop:3,fontStyle:"italic"}}>{task.notes}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  <div style={{fontSize:12,fontWeight:800,color:overdue?C.danger:days!=null&&days<=7?C.warning:C.sageD}}>
                    {overdue?`⚠️ ${Math.abs(days)}d overdue`:days!=null?days===0?"Due today":`Due in ${days}d`:"—"}
                  </div>
                  <button onClick={()=>createIssue(task)} style={{padding:"5px 12px",borderRadius:8,background:C.navy,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>Auto-Create Issue</button>
                </div>
              </div>
            </Card>);
          })}
        </div>);
      })}
    </div>);
  };

  return(<div>
    <SectionTitle title="Maintenance" sub="Issue log · Asset register · Preventive schedule"/>
    <SubTabs tabs={TABS} active={sub} setActive={setSub}/>
    {sub==="log"&&<LogTab/>}
    {sub==="assets"&&<AssetsTab/>}
    {sub==="schedule"&&<ScheduleTab/>}
  </div>);
};

const WaterPowerView=({readings,setReadings})=>{
  const[sub,setSub]=useState("daily");
  const TABS=[["daily","📊","Daily Log"],["monthly","📈","Monthly"],["solar","☀️","Solar"]];
  const latest=readings[0]||{};
  const avgKwh=Math.round(readings.reduce((s,r)=>s+r.electricityKwh,0)/readings.length);
  const avgPump=(readings.reduce((s,r)=>s+r.pumpHours,0)/readings.length).toFixed(1);
  const alerts=[];
  if(latest.electricityKwh>155)alerts.push({icon:"⚡",msg:`High power use: ${latest.electricityKwh} kWh (threshold: 155)`,level:"red"});
  else if(latest.electricityKwh>145)alerts.push({icon:"⚡",msg:`Elevated power: ${latest.electricityKwh} kWh`,level:"yellow"});
  if(latest.tankLevel<50)alerts.push({icon:"💧",msg:`Tank level critical: ${latest.tankLevel}% — pump now`,level:"red"});
  else if(latest.tankLevel<70)alerts.push({icon:"💧",msg:`Tank level low: ${latest.tankLevel}%`,level:"yellow"});
  if(latest.pumpHours>5)alerts.push({icon:"⏱",msg:`Pump ran ${latest.pumpHours} hrs — check for leaks`,level:"red"});
  else if(latest.pumpHours>4)alerts.push({icon:"⏱",msg:`Pump hours elevated: ${latest.pumpHours} hrs`,level:"yellow"});

  const DailyTab=()=>{
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({date:new Date().toISOString().split("T")[0],pumpHours:"",tankLevel:"",electricityKwh:"",solarKwh:"",notes:""});
    const save=()=>{setReadings(p=>[{id:Date.now(),...form,pumpHours:parseFloat(form.pumpHours)||0,tankLevel:parseInt(form.tankLevel)||0,electricityKwh:parseInt(form.electricityKwh)||0,solarKwh:parseInt(form.solarKwh)||0},...p]);setShowForm(false);setForm({date:new Date().toISOString().split("T")[0],pumpHours:"",tankLevel:"",electricityKwh:"",solarKwh:"",notes:""});};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
        {[{icon:"⚡",label:"Avg Daily Power",val:`${avgKwh} kWh`,color:"#F57F17",bg:"#FFF8E1"},{icon:"⏱",label:"Avg Pump Hours",val:`${avgPump} hrs`,color:C.info,bg:"#E3F2FD"},{icon:"🛢",label:"Tank Level",val:`${latest.tankLevel||0}%`,color:latest.tankLevel>50?C.sageD:C.terra,bg:latest.tankLevel>50?"#E8F5E9":"#FFEBEE"},{icon:"☀️",label:"Solar Today",val:`${latest.solarKwh||0} kWh`,color:C.gold,bg:"#FFF8E1"}].map(s=>(<div key={s.label} style={{background:s.bg,borderRadius:14,padding:16,border:`1px solid ${C.border}`}}><div style={{fontSize:26,marginBottom:5}}>{s.icon}</div><div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:C.textL}}>{s.label}</div></div>))}
      </div>
      <Card style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:12}}>⚡ Daily kWh (7 days)</div><div style={{display:"flex",alignItems:"flex-end",gap:8,height:90}}>{readings.slice(0,7).reverse().map((r,i)=>{const h=Math.max((r.electricityKwh/200)*100,4);const col=r.electricityKwh>155?"#E53935":r.electricityKwh>145?"#FB8C00":"#1976D2";return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:9,color:C.textL,fontWeight:700}}>{r.electricityKwh}</div><div style={{width:"100%",height:`${h}%`,background:col,borderRadius:"3px 3px 0 0",minHeight:6}}/><div style={{fontSize:8,color:C.textL}}>{r.date.slice(5)}</div></div>);})}</div></Card>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,#1565C0,#1976D2)`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Reading</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid #1565C0`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Daily Reading</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[["date","Date","date"],["pumpHours","Pump Hours","number"],["tankLevel","Tank Level (%)","number"],["electricityKwh","Grid Electricity (kWh)","number"],["solarKwh","Solar Generated (kWh)","number"]].map(([k,l,t])=>(<Field key={k} label={l}><input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={inp}/></Field>))}<Field label="Notes" col="1/-1"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:"#1565C0",color:"white",padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 1.8fr",gap:8,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Date","Pump","Tank","Grid kWh","Solar","Notes"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
        {readings.map((r,i)=>(
          <div key={r.id} style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 1.8fr",gap:8,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}>
            <div style={{fontSize:12,fontWeight:700}}>{r.date}</div>
            <div style={{fontSize:12,color:r.pumpHours>5?C.danger:r.pumpHours>4?C.warning:C.text}}>⏱ {r.pumpHours}h</div>
            <div style={{fontSize:12,fontWeight:700,color:r.tankLevel<50?C.danger:r.tankLevel<70?C.warning:C.sageD}}>💧 {r.tankLevel}%</div>
            <div style={{fontSize:12,color:r.electricityKwh>155?C.danger:r.electricityKwh>145?C.warning:"#1565C0"}}>⚡ {r.electricityKwh}</div>
            <div style={{fontSize:12,color:C.gold}}>☀️ {r.solarKwh||0}</div>
            <div style={{fontSize:11,color:C.textL,fontStyle:r.notes?"normal":"italic"}}>{r.notes||"—"}</div>
          </div>
        ))}
      </Card>
    </div>);
  };

  const MonthlyTab=()=>{
    const now=new Date();
    const thisMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    const lastMonthDate=new Date(now.getFullYear(),now.getMonth()-1,1);
    const lastMonth=`${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth()+1).padStart(2,"0")}`;
    const thisData=readings.filter(r=>r.date.startsWith(thisMonth));
    const lastData=readings.filter(r=>r.date.startsWith(lastMonth));
    const avg=(arr,key)=>arr.length?parseFloat((arr.reduce((s,r)=>s+(r[key]||0),0)/arr.length).toFixed(1)):0;
    const metrics=[
      {key:"electricityKwh",label:"Avg Daily kWh",icon:"⚡",unit:"kWh",lowerIsBetter:true,color:"#F57F17"},
      {key:"pumpHours",label:"Avg Pump Hours",icon:"⏱",unit:"hrs",lowerIsBetter:true,color:C.info},
      {key:"tankLevel",label:"Avg Tank Level",icon:"💧",unit:"%",lowerIsBetter:false,color:C.sageD},
      {key:"solarKwh",label:"Avg Solar kWh",icon:"☀️",unit:"kWh",lowerIsBetter:false,color:C.gold},
    ];
    const trend=(cur,prev,lowerIsBetter)=>{if(!prev)return null;const pct=Math.round(((cur-prev)/Math.max(prev,1))*100);const good=lowerIsBetter?cur<prev:cur>prev;return{pct,good,arrow:cur>prev?"▲":"▼"};};
    return(<div>
      <div style={{marginBottom:12,padding:"8px 14px",background:C.sandL,borderRadius:8,fontSize:12,color:C.textM}}>Comparing <strong>{thisMonth}</strong> vs <strong>{lastMonth}</strong> · {thisData.length} readings this month, {lastData.length} last month</div>
      {thisData.length===0&&<div style={{padding:20,textAlign:"center",color:C.textL}}>No readings this month yet. Add daily readings to see comparison.</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {metrics.map(m=>{
          const cur=avg(thisData,m.key),prev=avg(lastData,m.key);const t=trend(cur,prev,m.lowerIsBetter);
          return(<Card key={m.key} style={{padding:"14px 18px"}}>
            <div style={{fontSize:22,marginBottom:6}}>{m.icon}</div>
            <div style={{fontSize:11,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{m.label}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:4}}>
              <div style={{fontSize:28,fontWeight:900,color:m.color}}>{cur} <span style={{fontSize:13,fontWeight:400}}>{m.unit}</span></div>
              {t&&<div style={{fontSize:14,fontWeight:800,color:t.good?C.sageD:C.danger}}>{t.arrow} {Math.abs(t.pct)}%</div>}
            </div>
            <div style={{fontSize:12,color:C.textL,marginTop:4}}>Last month: {prev} {m.unit}</div>
            {t&&<div style={{marginTop:8,background:C.sandL,borderRadius:8,overflow:"hidden",height:6}}><div style={{width:`${Math.min(Math.abs(t.pct)+50,100)}%`,height:"100%",background:t.good?C.sageD:C.danger,borderRadius:8}}/></div>}
          </Card>);
        })}
      </div>
      <Card>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>📊 30-Day kWh Trend</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100}}>
          {readings.slice(0,30).reverse().map((r,i)=>{
            const h=Math.max((r.electricityKwh/180)*100,4);
            const col=r.electricityKwh>155?"#E53935":r.electricityKwh>145?"#FB8C00":"#1976D2";
            return(<div key={i} title={`${r.date}: ${r.electricityKwh} kWh`} style={{flex:1,background:col,borderRadius:"2px 2px 0 0",height:`${h}%`,minHeight:4,cursor:"help"}}/>);
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.textL,marginTop:4}}><span>30 days ago</span><span>Today</span></div>
        <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
          {[["Normal (≤145)","#1976D2"],["Caution (146–155)","#FB8C00"],["High (>155)","#E53935"]].map(([l,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.textL}}><div style={{width:10,height:10,borderRadius:2,background:c}}/>{l}</div>))}
        </div>
      </Card>
    </div>);
  };

  const SolarTab=()=>{
    const totalSolar=readings.reduce((s,r)=>s+(r.solarKwh||0),0);
    const totalGrid=readings.reduce((s,r)=>s+r.electricityKwh,0);
    const solarOffsetPct=totalGrid+totalSolar>0?Math.round((totalSolar/(totalGrid+totalSolar))*100):0;
    const avgSolar=readings.length?Math.round(totalSolar/readings.length):0;
    const peakSolar=Math.max(...readings.map(r=>r.solarKwh||0));
    const kwhRate=30;const savedKsh=Math.round(totalSolar*kwhRate);
    return(<div>
      <div style={{background:`linear-gradient(135deg,#F57F17,#FF9800)`,borderRadius:16,padding:"18px 22px",marginBottom:14,color:"white"}}>
        <div style={{fontSize:11,opacity:0.7,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Solar Performance — Lodwar, Turkana</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[["Total Generated",`${totalSolar} kWh`],["Solar Offset",`${solarOffsetPct}%`],["Est. Savings",`KSh ${savedKsh.toLocaleString()}`]].map(([l,v])=>(<div key={l}><div style={{fontSize:24,fontWeight:900}}>{v}</div><div style={{fontSize:10,opacity:0.75,marginTop:2}}>{l}</div></div>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
        {[{icon:"☀️",label:"Avg Solar/Day",val:`${avgSolar} kWh`,color:"#F57F17",bg:"#FFF8E1"},{icon:"🏆",label:"Peak Day",val:`${peakSolar} kWh`,color:C.gold,bg:"#FFF8E1"},{icon:"🌱",label:"Peak Sun Hours",val:"6 hrs/day",color:C.sageD,bg:"#E8F5E9"}].map(s=>(<div key={s.label} style={{background:s.bg,borderRadius:14,padding:16,border:`1px solid ${C.border}`}}><div style={{fontSize:26,marginBottom:5}}>{s.icon}</div><div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:C.textL}}>{s.label}</div></div>))}
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>☀️ Solar vs Grid — Daily Comparison</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:110}}>
          {readings.slice(0,14).reverse().map((r,i)=>{
            const total=(r.electricityKwh+(r.solarKwh||0));const maxH=180;
            const gridH=Math.max((r.electricityKwh/maxH)*100,3);const solH=Math.max(((r.solarKwh||0)/maxH)*100,2);
            return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
              <div title={`Solar: ${r.solarKwh||0} kWh`} style={{width:"100%",height:`${solH}%`,background:"#FF9800",borderRadius:"3px 3px 0 0"}}/>
              <div title={`Grid: ${r.electricityKwh} kWh`} style={{width:"100%",height:`${gridH}%`,background:"#1565C0"}}/>
              <div style={{fontSize:7,color:C.textL,marginTop:2,transform:"rotate(-45deg)",transformOrigin:"top left",width:18}}>{r.date.slice(5)}</div>
            </div>);
          })}
        </div>
        <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}>
          {[["☀️ Solar","#FF9800"],["⚡ Grid","#1565C0"]].map(([l,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textL}}><div style={{width:14,height:14,borderRadius:3,background:c}}/>{l}</div>))}
        </div>
      </Card>
      <Card>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>📊 Solar Offset Progress</div>
        <div style={{marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:C.textM}}>Target: 30% solar offset</div>
          <div style={{fontSize:14,fontWeight:900,color:solarOffsetPct>=30?C.sageD:C.warning}}>{solarOffsetPct}%</div>
        </div>
        <div style={{background:C.border,borderRadius:8,height:14,overflow:"hidden"}}><div style={{width:`${Math.min(solarOffsetPct,100)}%`,height:"100%",background:solarOffsetPct>=30?C.sageD:"#FF9800",borderRadius:8,transition:"width 0.5s"}}/></div>
        <div style={{marginTop:10,fontSize:12,color:C.textL,fontStyle:"italic"}}>"The earth is the Lord's, and everything in it." — Psalm 24:1 ✟ · Lodwar averages 6 peak sun hours daily</div>
      </Card>
    </div>);
  };

  return(<div>
    <SectionTitle title="Water & Power" sub="Daily stewardship of borehole, electricity and solar"/>
    {alerts.length>0&&(<div style={{marginBottom:14,display:"flex",flexDirection:"column",gap:8}}>
      {alerts.map((a,i)=>(<div key={i} style={{padding:"10px 16px",background:a.level==="red"?"#FFEBEE":"#FFF8E1",border:`1px solid ${a.level==="red"?"#EF9A9A":"#FFE082"}`,borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:18}}>{a.icon}</span>
        <div style={{flex:1,fontSize:13,fontWeight:700,color:a.level==="red"?C.danger:C.warning}}>{a.msg}</div>
        <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:8,background:a.level==="red"?C.danger:C.warning,color:"white"}}>{a.level==="red"?"CRITICAL":"CAUTION"}</span>
      </div>))}
    </div>)}
    <SubTabs tabs={TABS} active={sub} setActive={setSub}/>
    {sub==="daily"&&<DailyTab/>}
    {sub==="monthly"&&<MonthlyTab/>}
    {sub==="solar"&&<SolarTab/>}
  </div>);
};

const FinancialsView=({financials,setFinancials,restaurantOrders,pettyCash,setPettyCash,payroll,staff})=>{
  const[sub,setSub]=useState("ledger");
  const FTABS=[["ledger","💰","Ledger"],["pettycash","🪙","Petty Cash"],["budgets","📊","Budgets"],["tax","🧾","Tax"]];
  const tR=financials.reduce((s,f)=>s+f.revenue,0),tE=financials.reduce((s,f)=>s+f.expenses,0);
  const restTot=restaurantOrders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
  const LedgerTab=()=>{
    const[showForm,setShowForm]=useState(false);const[form,setForm]=useState({date:new Date().toISOString().split("T")[0],revenue:"",expenses:"",notes:""});
    const save=()=>{setFinancials(p=>[{id:Date.now(),...form,revenue:parseInt(form.revenue)||0,expenses:parseInt(form.expenses)||0},...p]);setShowForm(false);setForm({date:new Date().toISOString().split("T")[0],revenue:"",expenses:"",notes:""});};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:14}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Accommodation Revenue",v:`KSh ${tR.toLocaleString()}`},{bg:"#E3F2FD",b:"#90CAF9",tx:"#00796B",l:"Restaurant Revenue",v:`KSh ${restTot.toLocaleString()}`},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Expenses",v:`KSh ${tE.toLocaleString()}`},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Net Profit",v:`KSh ${(tR+restTot-tE).toLocaleString()}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.sageD},${C.sage})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Entry</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.sage}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Daily Entry (Accommodation)</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[["date","Date","date"],["revenue","Revenue (KSh)","number"],["expenses","Expenses (KSh)","number"],["notes","Notes","text"]].map(([k,l,t])=>(<Field key={k} label={l}><input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={inp}/></Field>))}</div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.sageD,color:"white",padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 2fr",gap:8,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Date","Revenue","Expenses","Profit","Notes"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>{financials.map((f,i)=>{const p=f.revenue-f.expenses;return(<div key={f.id} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 2fr",gap:8,padding:"11px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}><div style={{fontSize:12,fontWeight:700}}>{f.date}</div><div style={{fontSize:13,fontWeight:800,color:C.sageD}}>+{f.revenue.toLocaleString()}</div><div style={{fontSize:13,fontWeight:800,color:C.danger}}>-{f.expenses.toLocaleString()}</div><div style={{fontSize:13,fontWeight:900,color:p>0?C.info:C.danger}}>{p.toLocaleString()}</div><div style={{fontSize:11,color:C.textL}}>{f.notes}</div></div>);})}</Card>
    </div>);
  };
  const PettyCashTab=()=>{
    const[showForm,setShowForm]=useState(false);const[form,setForm]=useState({date:new Date().toISOString().split("T")[0],amount:"",description:"",receiptNo:"",approvedBy:"",category:"Admin"});
    const spent=(pettyCash||[]).reduce((s,e)=>s+e.amount,0);const balance=PETTY_FLOAT-spent;
    const cats=["Admin","Housekeeping","Kitchen","Maintenance","Pool","Security","Other"];
    const save=()=>{if(!form.amount||!form.description)return;setPettyCash(p=>[{id:Date.now(),...form,amount:parseInt(form.amount)},...p]);setShowForm(false);setForm({date:new Date().toISOString().split("T")[0],amount:"",description:"",receiptNo:"",approvedBy:"",category:"Admin"});};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Petty Float",v:`KSh ${PETTY_FLOAT.toLocaleString()}`},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Total Spent",v:`KSh ${spent.toLocaleString()}`},{bg:balance<3000?"#FFEBEE":balance<8000?"#FFF8E1":"#E8F5E9",b:balance<3000?"#EF9A9A":balance<8000?"#FFE082":"#81C784",tx:balance<3000?C.danger:balance<8000?C.warning:C.sageD,l:"Balance Remaining",v:`KSh ${balance.toLocaleString()}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      {balance<5000&&<div style={{padding:"10px 16px",background:"#FFEBEE",border:"1px solid #EF9A9A",borderRadius:10,marginBottom:14,fontSize:13,color:C.danger,fontWeight:700}}>⚠️ Petty cash balance is low. Please replenish the float.</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:13,fontWeight:800,color:C.navy}}>Petty Cash Entries</div><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.sageD},${C.sage})`,color:"white",padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Expense</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.sage}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>New Petty Cash Entry</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Field label="Date"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={inp}/></Field><Field label="Amount (KSh)"><input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={inp} placeholder="0"/></Field><Field label="Category"><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={inp}>{cats.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="Receipt No"><input type="text" value={form.receiptNo} onChange={e=>setForm(p=>({...p,receiptNo:e.target.value}))} style={inp} placeholder="RC-XXX"/></Field><Field label="Approved By"><input type="text" value={form.approvedBy} onChange={e=>setForm(p=>({...p,approvedBy:e.target.value}))} style={inp}/></Field><Field label="Description"><input type="text" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.sageD,color:"white",padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"1fr 0.7fr 2fr 0.8fr 0.8fr 1fr",gap:8,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Date","Amount","Description","Category","Receipt","Approved By"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>{(pettyCash||[]).map((e,i)=>(<div key={e.id} style={{display:"grid",gridTemplateColumns:"1fr 0.7fr 2fr 0.8fr 0.8fr 1fr",gap:8,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:i%2===0?"white":`${C.sand}40`,alignItems:"center"}}><div style={{fontSize:12,fontWeight:700}}>{e.date}</div><div style={{fontSize:13,fontWeight:800,color:C.danger}}>-{e.amount.toLocaleString()}</div><div style={{fontSize:11,color:C.text}}>{e.description}</div><div><Badge label={e.category}/></div><div style={{fontSize:11,color:C.textL}}>{e.receiptNo||"—"}</div><div style={{fontSize:11,color:C.textL}}>{e.approvedBy||"—"}</div></div>))}{(!pettyCash||pettyCash.length===0)&&<div style={{padding:24,textAlign:"center",color:C.textL,fontSize:13}}>No petty cash entries yet.</div>}</Card>
    </div>);
  };
  const BudgetsTab=()=>{
    const BUDGETS=[{dept:"Housekeeping",budget:80000,depts:["Housekeeping"],color:"#7B1FA2"},{dept:"Kitchen",budget:120000,depts:["Kitchen"],color:"#E65100"},{dept:"Maintenance",budget:60000,depts:["Maintenance"],color:"#1565C0"},{dept:"Marketing / Sales",budget:30000,depts:["Sales","Management"],color:"#00796B"},{dept:"Gardening",budget:15000,depts:["Gardening","Operations"],color:"#388E3C"},{dept:"Pool",budget:10000,depts:["Pool","Security"],color:"#0288D1"},{dept:"Admin",budget:50000,depts:["Administration","Front Office","Finance","Management"],color:"#5D4037"}];
    const curPay=(payroll||[]).filter(p=>p.month===CUR_MONTH);
    const deptActual=(depts)=>curPay.filter(p=>{const s=(staff||[]).find(st=>st.id===p.staffId);return s&&depts.some(d=>s.dept?.toLowerCase().includes(d.toLowerCase()));}).reduce((s,p)=>s+p.gross,0);
    const totalBudget=BUDGETS.reduce((s,b)=>s+b.budget,0);const totalActual=BUDGETS.reduce((s,b)=>s+deptActual(b.depts),0);
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
        {[{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Total Budget",v:`KSh ${totalBudget.toLocaleString()}`},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Payroll Actual",v:`KSh ${totalActual.toLocaleString()}`},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Remaining",v:`KSh ${(totalBudget-totalActual).toLocaleString()}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{marginBottom:12,padding:"8px 14px",background:C.sandL,borderRadius:8,fontSize:12,color:C.textM}}>📅 Budget period: <strong>{CUR_MONTH}</strong> — Actuals computed from payroll records. Non-salary costs not included.</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {BUDGETS.map(b=>{const actual=deptActual(b.depts);const pct=b.budget>0?Math.round((actual/b.budget)*100):0;const over=actual>b.budget;return(
          <Card key={b.dept} style={{padding:"14px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:800,color:C.navy}}>{b.dept}</div>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.textL}}>Budget</div><div style={{fontSize:13,fontWeight:800,color:C.navy}}>KSh {b.budget.toLocaleString()}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.textL}}>Actual</div><div style={{fontSize:13,fontWeight:800,color:over?C.danger:C.sageD}}>KSh {actual.toLocaleString()}</div></div>
                <div style={{background:over?"#FFEBEE":pct>85?"#FFF3E0":"#E8F5E9",padding:"4px 12px",borderRadius:8,fontSize:13,fontWeight:900,color:over?C.danger:pct>85?C.warning:C.sageD,minWidth:54,textAlign:"center"}}>{pct}%</div>
              </div>
            </div>
            <div style={{background:C.border,borderRadius:4,height:10,overflow:"hidden"}}><div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:over?C.danger:pct>85?"#FFA726":b.color,borderRadius:4,transition:"width 0.5s"}}/></div>
            {over&&<div style={{fontSize:11,color:C.danger,fontWeight:700,marginTop:5}}>⚠️ Over budget by KSh {(actual-b.budget).toLocaleString()}</div>}
          </Card>);
        })}
      </div>
    </div>);
  };
  const TaxTab=()=>{
    const curPay=(payroll||[]).filter(p=>p.month===CUR_MONTH);
    const totalPAYE=curPay.reduce((s,p)=>s+p.tax,0);const totalNSSF=curPay.reduce((s,p)=>s+p.nssf,0);const totalNHIF=curPay.reduce((s,p)=>s+p.nhif,0);
    const totalRev=tR+restTot;const vat=Math.round(totalRev*0.16);
    const now=new Date();const next9=new Date(now.getFullYear(),now.getMonth()+1,9);const next15=new Date(now.getFullYear(),now.getMonth()+1,15);const next20=new Date(now.getFullYear(),now.getMonth()+1,20);
    const fmt=d=>d.toLocaleDateString("en-KE",{day:"numeric",month:"long",year:"numeric"});const daysLeft=d=>Math.ceil((d-now)/(1000*60*60*24));
    return(<div>
      <div style={{marginBottom:16,padding:"14px 20px",background:`linear-gradient(135deg,${C.navy},${C.navyM})`,borderRadius:14,color:"white"}}>
        <div style={{fontSize:11,opacity:0.7,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Next KRA Filing Deadline</div>
        <div style={{fontSize:26,fontWeight:900}}>{fmt(next9)}</div>
        <div style={{fontSize:13,opacity:0.8,marginTop:3,color:daysLeft(next9)<=7?"#FFB74D":"white"}}>{daysLeft(next9)} days remaining · PAYE &amp; NHIF due</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[{icon:"🏛",l:"PAYE Tax",v:`KSh ${totalPAYE.toLocaleString()}`,sub:`${curPay.length} employees · ${CUR_MONTH}`,bg:"#FFEBEE",tx:C.danger},{icon:"🏦",l:"NSSF Contributions",v:`KSh ${totalNSSF.toLocaleString()}`,sub:"Employee deductions",bg:"#E3F2FD",tx:C.info},{icon:"🏥",l:"NHIF Contributions",v:`KSh ${totalNHIF.toLocaleString()}`,sub:"Employee deductions",bg:"#E8F5E9",tx:C.sageD},{icon:"🧾",l:"VAT Estimate (16%)",v:`KSh ${vat.toLocaleString()}`,sub:`On KSh ${totalRev.toLocaleString()} revenue`,bg:"#FFF8E1",tx:C.gold}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:14,padding:"14px 18px",border:`1px solid ${C.border}`}}><div style={{fontSize:22,marginBottom:6}}>{s.icon}</div><div style={{fontSize:20,fontWeight:900,color:s.tx}}>{s.v}</div><div style={{fontSize:12,fontWeight:700,color:C.navy,marginTop:3}}>{s.l}</div><div style={{fontSize:11,color:C.textL,marginTop:2}}>{s.sub}</div></div>))}
      </div>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>📋 Compliance Calendar — {CUR_MONTH}</div>
        {[[`PAYE Remittance`,totalPAYE,fmt(next9),daysLeft(next9),"Due"],[`NSSF Remittance`,totalNSSF,fmt(next15),daysLeft(next15),"Due"],[`NHIF Remittance`,totalNHIF,fmt(next9),daysLeft(next9),"Due"],["VAT Return (Est.)",vat,fmt(next20),daysLeft(next20),"Estimate"]].map(([l,v,dl,d,st])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{l}</div><div style={{fontSize:11,color:d<=7?C.danger:C.textL}}>Due: {dl} {d<=7?"⚠️":""}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800,color:C.navy}}>KSh {v.toLocaleString()}</div><Badge label={st}/></div>
          </div>))}
        <div style={{marginTop:14,padding:"10px 12px",background:C.sandL,borderRadius:8,fontSize:12,fontStyle:"italic",color:C.textM,textAlign:"center"}}>"The Lord detests dishonest scales, but accurate weights find favour with him." — Proverbs 11:1 ✟</div>
      </Card>
    </div>);
  };
  return(<div><SectionTitle title="Financials" sub="Revenue, expenses, budgets and tax compliance"/><SubTabs tabs={FTABS} active={sub} setActive={setSub}/>{sub==="ledger"&&<LedgerTab/>}{sub==="pettycash"&&<PettyCashTab/>}{sub==="budgets"&&<BudgetsTab/>}{sub==="tax"&&<TaxTab/>}</div>);
};

const StewardshipView=({readings,financials,restaurantOrders})=>{
  const mR=Math.max(...financials.map(f=>f.revenue));const restTot=restaurantOrders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
  const totalRev=financials.reduce((s,f)=>s+f.revenue,0)+restTot;const totalExp=financials.reduce((s,f)=>s+f.expenses,0);
  return(<div><SectionTitle title="Stewardship Dashboard" sub={`"The earth is the Lord's, and everything in it." — Psalm 24:1`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
      {[{l:"Avg kWh/day",v:`${Math.round(readings.reduce((s,r)=>s+r.electricityKwh,0)/readings.length)} kWh`,icon:"⚡",color:"#F57F17",bg:"#FFF8E1"},{l:"Avg Pump/day",v:`${(readings.reduce((s,r)=>s+r.pumpHours,0)/readings.length).toFixed(1)} hrs`,icon:"💧",color:C.info,bg:"#E3F2FD"},{l:"Total Revenue",v:`KSh ${totalRev.toLocaleString()}`,icon:"💰",color:C.sageD,bg:"#E8F5E9"},{l:"Net Profit",v:`KSh ${(totalRev-totalExp).toLocaleString()}`,icon:"📊",color:C.navy,bg:C.sandL},{l:"Restaurant Rev.",v:`KSh ${restTot.toLocaleString()}`,icon:"🍽",color:"#00796B",bg:"#E0F2F1"}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:14,padding:16,border:`1px solid ${C.border}`}}><div style={{fontSize:26,marginBottom:5}}>{s.icon}</div><div style={{fontSize:18,fontWeight:900,color:s.color}}>{s.v}</div><div style={{fontSize:11,color:C.textL}}>{s.l}</div></div>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.sageD,marginBottom:14}}>💰 Revenue vs Expenses</div><div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>{financials.slice(0,5).reverse().map((f,i)=>{const cap=mR*1.15,rh=(f.revenue/cap)*100,eh=(f.expenses/cap)*100,p=f.revenue-f.expenses;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:9,color:p>0?C.sageD:C.danger,fontWeight:700}}>{(p/1000).toFixed(0)}k</div><div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:90}}><div style={{flex:1,height:`${rh}%`,background:"#4CAF50",borderRadius:"2px 2px 0 0",minHeight:4}}/><div style={{flex:1,height:`${eh}%`,background:"#F44336",borderRadius:"2px 2px 0 0",minHeight:4}}/></div><div style={{fontSize:8,color:C.textL}}>{f.date.slice(5)}</div></div>);})}
      </div><div style={{display:"flex",gap:12,marginTop:8}}>{[["#4CAF50","Accommodation"],["#F44336","Expenses"],["#00796B","Restaurant"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textL}}><div style={{width:10,height:10,borderRadius:2,background:c}}/>{l}</div>)}</div></Card>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.info,marginBottom:14}}>💧 Water Tank Levels</div><div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>{readings.slice(0,7).reverse().map((r,i)=>{const h=(r.tankLevel/100)*100,col=r.tankLevel>75?"#42A5F5":r.tankLevel>50?"#FFC107":"#F44336";return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:9,color:C.textL,fontWeight:700}}>{r.tankLevel}%</div><div style={{width:"100%",height:`${h}%`,background:col,borderRadius:"3px 3px 0 0",minHeight:6}}/><div style={{fontSize:8,color:C.textL}}>{r.date.slice(5)}</div></div>);})}</div><div style={{marginTop:14,padding:"10px 12px",background:C.sand,borderRadius:10,textAlign:"center"}}><div style={{fontSize:12,fontStyle:"italic",color:C.textM}}>"God saw all that He had made, and it was very good." — Genesis 1:31</div></div></Card>
    </div>
  </div>);
};

// ─── SIMPLIFIED HR (full version from previous build) ─────────
const HRView=({staff,setStaff,payroll,setPayroll,advances,setAdvances,leaves,setLeaves,leaveBalances,shifts,setShifts,performance,training=[],setTraining,surveys=[],setSurveys,role})=>{
  const[sub,setSub]=useState("staff");const isAdmin=role?.id==="admin";
  const TABS=isAdmin?[["staff","👥","Staff"],["former","🗂","Former Staff"],["payroll","💵","Payroll"],["reports","📊","Pay Reports"],["advances","💸","Advances"],["leaves","🌴","Leave"],["shifts","🕐","Shifts"],["performance","🏆","Performance"],["training","🎓","Training"],["documents","📁","Documents"],["surveys","📋","Surveys"]]:[["payslip","💵","My Payslip"],["leaves","🌴","My Leave"],["advances","💸","My Advances"]];

  const activeStaff=staff.filter(s=>["Active"].includes(s.status));
  const formerStaff=staff.filter(s=>["Left","Dismissed","Resigned"].includes(s.status));

  const StaffTab=()=>{
    const[sel,setSel]=useState(null);const[editing,setEditing]=useState(null);const[showAddForm,setShowAddForm]=useState(false);
    const[addForm,setAddForm]=useState({name:"",role:"",dept:"",phone:"",idNo:"",hire:"",salary:"",nssf:1080,nhif:500,tax:0,bank:"",acc:"",dob:"",gender:"Male",address:"",emergencyName:"",emergencyPhone:"",emergencyRel:"",nssf_no:"",nhif_no:"",kra_pin:"",notes:"",photo:"👤",status:"Active"});
    const total=activeStaff.reduce((s,st)=>s+st.salary,0);
    const saveEdit=()=>{setStaff(p=>p.map(s=>s.id===editing.id?{...editing}:s));setEditing(null);setSel(null);};
    const saveAdd=()=>{
      const ns={...addForm,id:Date.now(),salary:parseInt(addForm.salary)||0,nssf:parseInt(addForm.nssf)||1080,nhif:parseInt(addForm.nhif)||500,tax:parseInt(addForm.tax)||0,photoUrl:"",leaveDate:null,leaveReason:"",docs:{contract:false,idCopy:false,nhifCard:false,nssf:false,certificates:false}};
      setStaff(p=>[...p,ns]);setShowAddForm(false);
    };
    const DEPTS=["Management","Front Office","Housekeeping","Maintenance","Kitchen","Security","Operations","Finance","Sales","Conference"];
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{bg:C.sandL,b:C.border,tx:C.navy,l:"Active Staff",v:activeStaff.length},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Monthly Payroll",v:`KSh ${total.toLocaleString()}`},{bg:"#FFF3E0",b:"#FFB74D",tx:C.warning,l:"Dept Count",v:[...new Set(activeStaff.map(s=>s.dept))].length}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:12,padding:"10px 16px",border:`1px solid ${s.b}`}}><div style={{fontSize:18,fontWeight:900,color:s.tx}}>{s.v}</div><div style={{fontSize:11,color:C.textL}}>{s.l}</div></div>))}
        </div>
        {isAdmin&&<button onClick={()=>setShowAddForm(!showAddForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Staff</button>}
      </div>
      {showAddForm&&(<Card style={{marginBottom:16,border:`2px solid ${C.navy}`}}>
        <div style={{fontSize:15,fontWeight:800,color:C.navy,marginBottom:14}}>New Staff Member</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[["name","Full Name","text"],["role","Job Title","text"],["phone","Phone","text"],["idNo","ID / Passport No","text"],["hire","Hire Date","date"],["dob","Date of Birth","date"],["salary","Gross Salary (KSh)","number"],["nssf","NSSF (KSh)","number"],["nhif","NHIF (KSh)","number"],["tax","PAYE Tax (KSh)","number"],["bank","Bank Name","text"],["acc","Account No","text"],["nssf_no","NSSF No","text"],["nhif_no","NHIF No","text"],["kra_pin","KRA PIN","text"],["emergencyName","Emergency Contact","text"],["emergencyPhone","Emergency Phone","text"],["emergencyRel","Relationship","text"]].map(([k,l,t])=>(<Field key={k} label={l}><input type={t} value={addForm[k]||""} onChange={e=>setAddForm(p=>({...p,[k]:e.target.value}))} style={inp}/></Field>))}
          <Field label="Department"><select value={addForm.dept} onChange={e=>setAddForm(p=>({...p,dept:e.target.value}))} style={inp}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></Field>
          <Field label="Gender"><select value={addForm.gender} onChange={e=>setAddForm(p=>({...p,gender:e.target.value}))} style={inp}><option>Male</option><option>Female</option><option>Other</option></select></Field>
          <Field label="Photo Emoji"><input value={addForm.photo} onChange={e=>setAddForm(p=>({...p,photo:e.target.value}))} style={inp} placeholder="e.g. 👨‍💼"/></Field>
          <Field label="Notes" col="1/-1"><textarea value={addForm.notes} onChange={e=>setAddForm(p=>({...p,notes:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}}/></Field>
          <Field label="Address" col="1/-1"><input value={addForm.address} onChange={e=>setAddForm(p=>({...p,address:e.target.value}))} style={inp}/></Field>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}><button onClick={saveAdd} style={{background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save Staff</button><button onClick={()=>setShowAddForm(false)} style={{background:C.border,color:C.textM,padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
      </Card>)}
      {/* Edit modal */}
      {editing&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setEditing(null)}>
        <div style={{background:"white",borderRadius:20,padding:28,width:"100%",maxWidth:720,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:16,fontWeight:800,color:C.navy,marginBottom:16}}>✏️ Edit — {editing.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[["name","Full Name","text"],["role","Job Title","text"],["phone","Phone","text"],["idNo","ID / Passport No","text"],["hire","Hire Date","date"],["dob","Date of Birth","date"],["salary","Gross Salary","number"],["nssf","NSSF","number"],["nhif","NHIF","number"],["tax","PAYE Tax","number"],["bank","Bank","text"],["acc","Account No","text"],["nssf_no","NSSF No","text"],["nhif_no","NHIF No","text"],["kra_pin","KRA PIN","text"],["emergencyName","Emergency Contact","text"],["emergencyPhone","Emergency Phone","text"],["emergencyRel","Relationship","text"]].map(([k,l,t])=>(<Field key={k} label={l}><input type={t} value={editing[k]||""} onChange={e=>setEditing(p=>({...p,[k]:e.target.value}))} style={inp}/></Field>))}
            <Field label="Department"><select value={editing.dept||""} onChange={e=>setEditing(p=>({...p,dept:e.target.value}))} style={inp}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></Field>
            <Field label="Gender"><select value={editing.gender||"Male"} onChange={e=>setEditing(p=>({...p,gender:e.target.value}))} style={inp}><option>Male</option><option>Female</option><option>Other</option></select></Field>
            <Field label="Status"><select value={editing.status||"Active"} onChange={e=>setEditing(p=>({...p,status:e.target.value}))} style={inp}><option>Active</option><option>Left</option><option>Dismissed</option></select></Field>
            <Field label="Photo Emoji"><input value={editing.photo||""} onChange={e=>setEditing(p=>({...p,photo:e.target.value}))} style={inp}/></Field>
            {(editing.status==="Left"||editing.status==="Dismissed")&&<><Field label="Leave Date"><input type="date" value={editing.leaveDate||""} onChange={e=>setEditing(p=>({...p,leaveDate:e.target.value}))} style={inp}/></Field><Field label="Leave Reason" col="span 2"><input value={editing.leaveReason||""} onChange={e=>setEditing(p=>({...p,leaveReason:e.target.value}))} style={inp}/></Field></>}
            <Field label="Address" col="1/-1"><input value={editing.address||""} onChange={e=>setEditing(p=>({...p,address:e.target.value}))} style={inp}/></Field>
            <Field label="Notes" col="1/-1"><textarea value={editing.notes||""} onChange={e=>setEditing(p=>({...p,notes:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}}/></Field>
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}><button onClick={saveEdit} style={{background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>💾 Save Changes</button><button onClick={()=>setEditing(null)} style={{background:C.border,color:C.textM,padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
        </div>
      </div>)}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
        {activeStaff.map(s=>{const net=s.salary-s.nssf-s.nhif-s.tax;const isOpen=sel===s.id;const missingDocs=s.docs?Object.values(s.docs).filter(v=>!v).length:0;return(
          <div key={s.id} style={{background:"white",borderRadius:14,overflow:"hidden",border:`2px solid ${isOpen?C.navy:C.border}`,transition:"all 0.2s"}}>
            <div onClick={()=>setSel(isOpen?null:s.id)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.photo}</div><div><div style={{fontSize:13,fontWeight:800,color:"white"}}>{s.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{s.role} · {s.dept}</div></div></div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>{missingDocs>0&&<span style={{background:"#FF5252",color:"white",fontSize:10,fontWeight:800,borderRadius:10,padding:"2px 7px"}}>📁 {missingDocs} missing</span>}<Badge label={s.status}/></div>
            </div>
            <div style={{padding:"12px 16px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                {[["GROSS",`KSh ${s.salary.toLocaleString()}`],["NET",`KSh ${net.toLocaleString()}`],["HIRE",s.hire],["DEPT",s.dept]].map(([l,v])=>(<div key={l}><div style={{fontSize:9,color:C.textL,fontWeight:700,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:C.text,marginTop:2}}>{v}</div></div>))}
              </div>
              {isOpen&&(<div style={{paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10,fontSize:11,color:C.textM}}>
                  {[["📞",s.phone],["🪪",s.idNo],["🏦",s.bank],["💳","****"+s.acc?.slice(-4)],["🎂",s.dob||"—"],["🏠",s.address||"—"],["🆘",`${s.emergencyName||"—"} (${s.emergencyRel||"—"})`],["📱",s.emergencyPhone||"—"]].map(([ic,v])=>(<div key={ic}><span style={{marginRight:4}}>{ic}</span>{v}</div>))}
                </div>
                <div style={{background:"#F8F8F8",borderRadius:8,padding:"9px 11px",marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:800,color:C.navy,marginBottom:5}}>DEDUCTIONS · STATUTORY NUMBERS</div>
                  <div style={{display:"flex",gap:14,fontSize:11,flexWrap:"wrap"}}><span>NSSF: KSh {s.nssf?.toLocaleString()} ({s.nssf_no||"—"})</span><span>NHIF: KSh {s.nhif?.toLocaleString()} ({s.nhif_no||"—"})</span><span>PAYE: KSh {s.tax?.toLocaleString()}</span><span>KRA: {s.kra_pin||"—"}</span></div>
                </div>
                {s.notes&&<div style={{fontSize:11,color:C.textM,fontStyle:"italic",padding:"7px 10px",background:C.sandL,borderRadius:8,marginBottom:10}}>📝 {s.notes}</div>}
                {isAdmin&&<button onClick={()=>setEditing({...s})} style={{width:"100%",padding:"8px",borderRadius:10,background:C.navy,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>✏️ Edit Staff Details</button>}
              </div>)}
            </div>
          </div>
        );})}
      </div>
    </div>);
  };

  const FormerStaffTab=()=>{
    const[sel,setSel]=useState(null);
    return(<div>
      <div style={{padding:"12px 16px",background:"#FFF3E0",borderRadius:12,border:"1px solid #FFB74D",marginBottom:16,fontSize:12,color:C.warning}}>
        ⚠️ Former staff records are kept for legal compliance and future reference only. This list is admin-only.
      </div>
      {formerStaff.length===0&&<div style={{textAlign:"center",padding:40,color:C.textL}}>No former staff records.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {formerStaff.map(s=>{const isOpen=sel===s.id;const statusColor=s.status==="Dismissed"?C.danger:C.textL;return(
          <Card key={s.id} style={{border:`2px solid ${s.status==="Dismissed"?C.danger+"40":C.border}`,cursor:"pointer"}} onClick={()=>setSel(isOpen?null:s.id)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:42,height:42,borderRadius:10,background:C.sandL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,opacity:0.6}}>{s.photo}</div>
                <div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.textL}}>{s.role} · {s.dept}</div><div style={{fontSize:11,color:C.textL}}>Hired: {s.hire} → Left: {s.leaveDate||"—"}</div></div>
              </div>
              <div style={{textAlign:"right"}}><span style={{fontSize:12,fontWeight:800,color:statusColor,background:`${statusColor}15`,padding:"4px 10px",borderRadius:10,border:`1px solid ${statusColor}30`}}>{s.status}</span></div>
            </div>
            {isOpen&&(<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,fontWeight:800,color:C.danger,marginBottom:6}}>Reason for Leaving:</div>
              <div style={{fontSize:13,color:C.text,padding:"8px 12px",background:s.status==="Dismissed"?"#FFEBEE":C.sandL,borderRadius:8,marginBottom:10}}>{s.leaveReason||"Not specified"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:11,color:C.textM}}>
                {[["📞",s.phone],["🪪",s.idNo],["🏦",s.bank],["💰",`Last Salary: KSh ${s.salary?.toLocaleString()}`],["🆘",`${s.emergencyName||"—"} (${s.emergencyRel})`],["📱",s.emergencyPhone||"—"]].map(([ic,v])=>(<div key={ic}>{ic} {v}</div>))}
              </div>
              {s.notes&&<div style={{marginTop:8,fontSize:11,color:C.textM,fontStyle:"italic",padding:"7px 10px",background:C.sandL,borderRadius:8}}>📝 {s.notes}</div>}
            </div>)}
          </Card>
        );})}
      </div>
    </div>);
  };

  const PayrollTab=()=>{
    const monthP=payroll.filter(p=>p.month===CUR_MONTH);const tG=monthP.reduce((s,p)=>s+p.gross,0),tN=monthP.reduce((s,p)=>s+p.net,0),tD=monthP.reduce((s,p)=>s+p.deductions,0);const paid=monthP.filter(p=>p.status==="Paid").length;
    const markPaid=id=>setPayroll(prev=>prev.map(p=>p.id===id?{...p,status:"Paid",paidDate:new Date().toISOString().split("T")[0]}:p));
    const markAll=()=>setPayroll(prev=>prev.map(p=>p.month===CUR_MONTH&&p.status==="Pending"?{...p,status:"Paid",paidDate:new Date().toISOString().split("T")[0]}:p));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>{[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Gross Payroll",v:`KSh ${tG.toLocaleString()}`},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Deductions",v:`KSh ${tD.toLocaleString()}`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Net Payroll",v:`KSh ${tN.toLocaleString()}`},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Paid / Total",v:`${paid}/${monthP.length}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:13,fontWeight:800,color:C.navy}}>Payroll — {CUR_MONTH}</div>{paid<monthP.length&&<button onClick={markAll} style={{background:`linear-gradient(135deg,${C.sageD},${C.sage})`,color:"white",padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>✓ Pay All Pending</button>}</div>
      <Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 0.9fr 0.8fr 0.9fr 1.2fr 1fr 1fr",gap:6,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Staff","Dept","Gross","Deductions","Net","Bank","Status",""].map(h=>(<div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>))}</div>
        {monthP.map((p,i)=>{const s=staff.find(st=>st.id===p.staffId)||{};return(<div key={p.id} style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 0.9fr 0.8fr 0.9fr 1.2fr 1fr 1fr",gap:6,padding:"11px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{s.photo||"👤"}</span><div style={{fontSize:12,fontWeight:700,color:C.text}}>{s.name}</div></div><div style={{fontSize:11,color:C.textM}}>{s.dept}</div><div style={{fontSize:12,fontWeight:700,color:C.sageD}}>{p.gross.toLocaleString()}</div><div style={{fontSize:12,color:C.danger}}>-{p.deductions.toLocaleString()}</div><div style={{fontSize:13,fontWeight:800,color:C.navy}}>{p.net.toLocaleString()}</div><div style={{fontSize:11,color:C.textM}}>{s.bank||"—"}</div><Badge label={p.status}/>{p.status==="Pending"?(<button onClick={()=>markPaid(p.id)} style={{padding:"5px 10px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>Pay</button>):(<div style={{fontSize:10,color:C.textL}}>{p.paidDate}</div>)}</div>);})}
      </Card>
    </div>);
  };

  const PayReportsTab=()=>{
    const allMonths=[...new Set(payroll.map(p=>p.month))].sort((a,b)=>new Date(b.replace(" ","1 "))-new Date(a.replace(" ","1 ")));
    const[selMonth,setSelMonth]=useState(allMonths[0]||CUR_MONTH);const[selStaff,setSelStaff]=useState("all");const[reportType,setReportType]=useState("monthly");
    const monthData=payroll.filter(p=>p.month===selMonth);
    const staffHistory=selStaff!=="all"?payroll.filter(p=>p.staffId===parseInt(selStaff)):[];
    const annualSummary=allMonths.slice(0,12).map(m=>{const mp=payroll.filter(p=>p.month===m);return{month:m,gross:mp.reduce((s,p)=>s+p.gross,0),net:mp.reduce((s,p)=>s+p.net,0),deductions:mp.reduce((s,p)=>s+p.deductions,0),count:mp.length};});
    const deptSummary=()=>{const deps={};monthData.forEach(p=>{const s=staff.find(st=>st.id===p.staffId);const d=s?.dept||"Unknown";if(!deps[d])deps[d]={dept:d,gross:0,net:0,count:0};deps[d].gross+=p.gross;deps[d].net+=p.net;deps[d].count++;});return Object.values(deps).sort((a,b)=>b.gross-a.gross);};
    return(<div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[["monthly","📅 Monthly Register"],["annual","📊 Annual Summary"],["staff","👤 Staff History"],["dept","🏢 By Department"]].map(([t,l])=>(<button key={t} onClick={()=>setReportType(t)} style={{padding:"8px 16px",borderRadius:10,border:`2px solid ${reportType===t?C.navy:C.border}`,background:reportType===t?C.navy:"white",color:reportType===t?"white":C.textM,fontWeight:700,fontSize:12,cursor:"pointer"}}>{l}</button>))}
      </div>
      {reportType==="monthly"&&(<div>
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...inp,width:"auto"}}>{allMonths.map(m=><option key={m}>{m}</option>)}</select>
          <button onClick={()=>exportCSV(`Payroll_${selMonth.replace(" ","_")}`,["Staff","Dept","Gross","NSSF","NHIF","PAYE","Deductions","Net","Status","Paid Date"],monthData.map(p=>{const s=staff.find(st=>st.id===p.staffId)||{};return[s.name,s.dept,p.gross,p.nssf,p.nhif,p.tax,p.deductions,p.net,p.status,p.paidDate||""];}))} style={{background:C.sageD,color:"white",padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📥 Export CSV</button>
          <button onClick={()=>window.print()} style={{background:C.navy,color:"white",padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>🖨 Print</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {[{l:"Gross Payroll",v:`KSh ${monthData.reduce((s,p)=>s+p.gross,0).toLocaleString()}`,bg:"#E8F5E9",tx:C.sageD},{l:"Total Deductions",v:`KSh ${monthData.reduce((s,p)=>s+p.deductions,0).toLocaleString()}`,bg:"#FFEBEE",tx:C.danger},{l:"Net Payroll",v:`KSh ${monthData.reduce((s,p)=>s+p.net,0).toLocaleString()}`,bg:"#E3F2FD",tx:C.info},{l:"Paid",v:`${monthData.filter(p=>p.status==="Paid").length}/${monthData.length}`,bg:"#FFF8E1",tx:C.gold}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:12,padding:"12px 14px"}}><div style={{fontSize:11,color:s.tx,fontWeight:700}}>{s.l}</div><div style={{fontSize:18,fontWeight:900,color:s.tx,marginTop:4}}>{s.v}</div></div>))}
        </div>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 1fr 1fr",gap:6,padding:"9px 14px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Staff","Dept","Gross","NSSF","NHIF","PAYE","Net","Status"].map(h=>(<div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>))}</div>
          {monthData.map((p,i)=>{const s=staff.find(st=>st.id===p.staffId)||{};return(<div key={p.id} style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 1fr 1fr",gap:6,padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:i%2===0?"white":`${C.sand}40`,alignItems:"center"}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:14}}>{s.photo||"👤"}</span><div style={{fontSize:12,fontWeight:700,color:C.text}}>{s.name}</div></div>
            <div style={{fontSize:11,color:C.textL}}>{s.dept}</div>
            <div style={{fontSize:12,fontWeight:700,color:C.sageD}}>{p.gross?.toLocaleString()}</div>
            <div style={{fontSize:11,color:C.textM}}>{p.nssf?.toLocaleString()}</div>
            <div style={{fontSize:11,color:C.textM}}>{p.nhif?.toLocaleString()}</div>
            <div style={{fontSize:11,color:C.textM}}>{p.tax?.toLocaleString()}</div>
            <div style={{fontSize:13,fontWeight:900,color:C.navy}}>{p.net?.toLocaleString()}</div>
            <Badge label={p.status}/>
          </div>);})}
        </Card>
      </div>)}
      {reportType==="annual"&&(<div>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <button onClick={()=>exportCSV("Annual_Payroll_Summary",["Month","Staff Count","Gross","Deductions","Net"],annualSummary.map(m=>[m.month,m.count,m.gross,m.deductions,m.net]))} style={{background:C.sageD,color:"white",padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📥 Export Annual CSV</button>
        </div>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1.5fr",gap:8,padding:"9px 14px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Month","Staff","Gross Payroll","Deductions","Net Payroll"].map(h=>(<div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>))}</div>
          {annualSummary.map((m,i)=>(<div key={m.month} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1.5fr",gap:8,padding:"11px 14px",borderBottom:`1px solid ${C.border}`,background:i%2===0?"white":`${C.sand}40`,alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:800,color:m.month===CUR_MONTH?C.navy:C.text}}>{m.month}{m.month===CUR_MONTH&&<span style={{marginLeft:6,fontSize:10,color:C.terra,fontWeight:700}}>▶ CURRENT</span>}</div>
            <div style={{fontSize:12,color:C.textM}}>{m.count}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.sageD}}>KSh {m.gross.toLocaleString()}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.danger}}>KSh {m.deductions.toLocaleString()}</div>
            <div style={{fontSize:13,fontWeight:900,color:C.navy}}>KSh {m.net.toLocaleString()}</div>
          </div>))}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1.5fr",gap:8,padding:"12px 14px",background:`${C.navy}08`,borderTop:`2px solid ${C.navy}20`}}>
            <div style={{fontSize:12,fontWeight:800,color:C.navy}}>TOTAL ({annualSummary.length} months)</div><div/>
            <div style={{fontSize:13,fontWeight:900,color:C.sageD}}>KSh {annualSummary.reduce((s,m)=>s+m.gross,0).toLocaleString()}</div>
            <div style={{fontSize:13,fontWeight:900,color:C.danger}}>KSh {annualSummary.reduce((s,m)=>s+m.deductions,0).toLocaleString()}</div>
            <div style={{fontSize:13,fontWeight:900,color:C.navy}}>KSh {annualSummary.reduce((s,m)=>s+m.net,0).toLocaleString()}</div>
          </div>
        </Card>
      </div>)}
      {reportType==="staff"&&(<div>
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
          <select value={selStaff} onChange={e=>setSelStaff(e.target.value)} style={{...inp,width:"auto"}}>
            <option value="all">Select a staff member...</option>
            {activeStaff.map(s=><option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
          </select>
          {selStaff!=="all"&&<button onClick={()=>{const s=staff.find(st=>st.id===parseInt(selStaff));exportCSV(`Pay_History_${s?.name?.replace(" ","_")}`,["Month","Gross","NSSF","NHIF","PAYE","Deductions","Net","Status"],staffHistory.map(p=>[p.month,p.gross,p.nssf,p.nhif,p.tax,p.deductions,p.net,p.status]));}} style={{background:C.sageD,color:"white",padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📥 Export CSV</button>}
        </div>
        {selStaff!=="all"&&(()=>{const s=staff.find(st=>st.id===parseInt(selStaff));const net=s?.salary-s?.nssf-s?.nhif-s?.tax;return(<div>
          <Card style={{marginBottom:14,background:`linear-gradient(135deg,${C.navy}08,${C.sage}05)`}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}><span style={{fontSize:32}}>{s?.photo}</span><div><div style={{fontSize:16,fontWeight:800,color:C.navy}}>{s?.name}</div><div style={{fontSize:12,color:C.textM}}>{s?.role} · {s?.dept} · Hired {s?.hire}</div><div style={{fontSize:12,color:C.sageD,fontWeight:700,marginTop:4}}>Gross: KSh {s?.salary?.toLocaleString()} · Net: KSh {net?.toLocaleString()}/month</div></div></div>
          </Card>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:6,padding:"9px 14px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Month","Gross","NSSF","NHIF","PAYE","Net","Status"].map(h=>(<div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>))}</div>
            {staffHistory.map((p,i)=>(<div key={p.id||i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:6,padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:i%2===0?"white":`${C.sand}40`,alignItems:"center"}}>
              <div style={{fontSize:12,fontWeight:700,color:p.month===CUR_MONTH?C.navy:C.text}}>{p.month}</div>
              <div style={{fontSize:12,fontWeight:700,color:C.sageD}}>{p.gross?.toLocaleString()}</div>
              <div style={{fontSize:11,color:C.textM}}>{p.nssf?.toLocaleString()}</div>
              <div style={{fontSize:11,color:C.textM}}>{p.nhif?.toLocaleString()}</div>
              <div style={{fontSize:11,color:C.textM}}>{p.tax?.toLocaleString()}</div>
              <div style={{fontSize:13,fontWeight:900,color:C.navy}}>{p.net?.toLocaleString()}</div>
              <Badge label={p.status}/>
            </div>))}
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:6,padding:"11px 14px",background:`${C.navy}08`,borderTop:`2px solid ${C.navy}20`}}>
              <div style={{fontSize:12,fontWeight:800,color:C.navy}}>TOTAL</div>
              <div style={{fontSize:12,fontWeight:900,color:C.sageD}}>{staffHistory.reduce((s,p)=>s+p.gross,0).toLocaleString()}</div>
              <div/><div/><div/>
              <div style={{fontSize:12,fontWeight:900,color:C.navy}}>{staffHistory.reduce((s,p)=>s+p.net,0).toLocaleString()}</div><div/>
            </div>
          </Card>
        </div>);})()}
      </div>)}
      {reportType==="dept"&&(<div>
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...inp,width:"auto"}}>{allMonths.map(m=><option key={m}>{m}</option>)}</select>
          <button onClick={()=>exportCSV(`Dept_Summary_${selMonth.replace(" ","_")}`,["Department","Staff","Gross","Net"],deptSummary().map(d=>[d.dept,d.count,d.gross,d.net]))} style={{background:C.sageD,color:"white",padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📥 Export CSV</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {deptSummary().map(d=>{const pct=Math.round((d.gross/monthData.reduce((s,p)=>s+p.gross,0))*100)||0;return(<Card key={d.dept} style={{padding:"14px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={{fontSize:14,fontWeight:800,color:C.navy}}>{d.dept}</div><div style={{fontSize:11,color:C.textL}}>{d.count} staff member{d.count!==1?"s":""}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:900,color:C.sageD}}>KSh {d.gross.toLocaleString()}</div><div style={{fontSize:11,color:C.textL}}>Net: KSh {d.net.toLocaleString()}</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,background:C.sandL,borderRadius:20,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:C.navy,borderRadius:20}}/></div>
              <span style={{fontSize:11,fontWeight:700,color:C.navy,width:36,textAlign:"right"}}>{pct}%</span>
            </div>
          </Card>);})}
        </div>
      </div>)}
    </div>);
  };

  const TrainingTab=()=>{
    const[form,setForm]=useState({staffId:"",course:"",completedDate:"",expiryDate:"",certNo:""});const[showForm,setShowForm]=useState(false);
    const today=todayISO();const soon=d=>{if(!d)return false;const diff=(new Date(d)-new Date(today))/(864e5);return diff>=0&&diff<=30;};
    const save=()=>{setTraining(p=>[{id:Date.now(),...form,staffId:parseInt(form.staffId),status:new Date(form.expiryDate)<new Date(today)?"Expired":"Valid"},...p]);setShowForm(false);setForm({staffId:"",course:"",completedDate:"",expiryDate:"",certNo:""});};
    const COURSES=["First Aid & CPR","Food Hygiene & Safety","Fire Safety & Evacuation","Customer Service Excellence","Electrical Safety","Defensive Driving","Health & Safety Induction","Child Safeguarding","Data Protection"];
    const expired=training.filter(t=>t.status==="Expired").length;const expiring=training.filter(t=>soon(t.expiryDate)).length;
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:10}}>
          {[[`${expired} Expired`,"#FFEBEE","#C62828"],[`${expiring} Expiring Soon`,"#FFF3E0","#E65100"],[`${training.filter(t=>t.status==="Valid").length} Valid`,"#E8F5E9","#2E7D32"]].map(([l,bg,tx])=>(<div key={l} style={{background:bg,borderRadius:12,padding:"8px 14px",border:`1px solid ${tx}30`,fontSize:12,fontWeight:800,color:tx}}>{l}</div>))}
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:C.navy,color:"white",padding:"9px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>+ Add Record</button>
      </div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}>
        <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>New Training Record</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Field label="Staff"><select value={form.staffId} onChange={e=>setForm(p=>({...p,staffId:e.target.value}))} style={inp}><option value="">Select...</option>{activeStaff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Course"><select value={form.course} onChange={e=>setForm(p=>({...p,course:e.target.value}))} style={inp}><option value="">Select...</option>{COURSES.map(c=><option key={c}>{c}</option>)}</select></Field>
          <Field label="Cert No"><input value={form.certNo} onChange={e=>setForm(p=>({...p,certNo:e.target.value}))} style={inp}/></Field>
          <Field label="Completed"><input type="date" value={form.completedDate} onChange={e=>setForm(p=>({...p,completedDate:e.target.value}))} style={inp}/></Field>
          <Field label="Expiry"><input type="date" value={form.expiryDate} onChange={e=>setForm(p=>({...p,expiryDate:e.target.value}))} style={inp}/></Field>
        </div>
        <div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
      </Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {training.sort((a,b)=>a.status==="Expired"?-1:b.status==="Expired"?1:0).map(t=>{const s=staff.find(st=>st.id===t.staffId)||{};const isExp=t.status==="Expired";const isSoon=soon(t.expiryDate);const border=isExp?C.danger:isSoon?"#E65100":C.border;return(<Card key={t.id} style={{padding:"12px 16px",border:`2px solid ${border}40`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:18}}>{s.photo||"👤"}</span>
              <div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{s.name}</div><div style={{fontSize:12,fontWeight:700,color:C.navy}}>{t.course}</div><div style={{fontSize:11,color:C.textL}}>Completed: {t.completedDate} · Expires: {t.expiryDate} · Cert: {t.certNo||"—"}</div></div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {isSoon&&!isExp&&<span style={{fontSize:10,fontWeight:800,color:"#E65100",background:"#FFF3E0",padding:"3px 8px",borderRadius:8}}>⚠ Expiring Soon</span>}
              <span style={{fontSize:11,fontWeight:800,color:isExp?C.danger:C.sageD,background:isExp?"#FFEBEE":"#E8F5E9",padding:"4px 10px",borderRadius:10}}>{t.status}</span>
            </div>
          </div>
        </Card>);})}
      </div>
    </div>);
  };

  const DocumentsTab=()=>{
    const DOC_TYPES=["contract","idCopy","nhifCard","nssf","certificates"];
    const DOC_LABELS={contract:"Employment Contract",idCopy:"ID / Passport Copy",nhifCard:"NHIF Card",nssf:"NSSF Card",certificates:"Relevant Certificates"};
    const toggleDoc=(staffId,doc)=>setStaff(p=>p.map(s=>s.id===staffId?{...s,docs:{...s.docs,[doc]:!s.docs?.[doc]}}:s));
    const staffWithDocs=activeStaff.map(s=>({...s,missingCount:DOC_TYPES.filter(d=>!s.docs?.[d]).length})).sort((a,b)=>b.missingCount-a.missingCount);
    const totalMissing=staffWithDocs.reduce((s,st)=>s+st.missingCount,0);
    return(<div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[{bg:totalMissing>0?"#FFEBEE":C.sandL,b:totalMissing>0?"#EF9A9A":C.border,tx:totalMissing>0?C.danger:C.sageD,l:"Missing Documents",v:totalMissing},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Fully Compliant",v:staffWithDocs.filter(s=>s.missingCount===0).length},{bg:"#FFF3E0",b:"#FFB74D",tx:C.warning,l:"Incomplete Files",v:staffWithDocs.filter(s=>s.missingCount>0).length}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:12,padding:"10px 16px",border:`1px solid ${s.b}`}}><div style={{fontSize:18,fontWeight:900,color:s.tx}}>{s.v}</div><div style={{fontSize:11,color:C.textL}}>{s.l}</div></div>))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {staffWithDocs.map(s=>(<Card key={s.id} style={{border:`2px solid ${s.missingCount>0?C.danger+"30":C.sageD+"30"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>{s.photo}</span><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.textL}}>{s.role} · {s.dept}</div></div></div>
            {s.missingCount===0?<span style={{fontSize:11,fontWeight:800,color:C.sageD,background:"#E8F5E9",padding:"4px 10px",borderRadius:10}}>✅ Fully Compliant</span>:<span style={{fontSize:11,fontWeight:800,color:C.danger,background:"#FFEBEE",padding:"4px 10px",borderRadius:10}}>⚠ {s.missingCount} missing</span>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {DOC_TYPES.map(doc=>{const has=s.docs?.[doc];return(<div key={doc} onClick={()=>isAdmin&&toggleDoc(s.id,doc)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:10,background:has?"#E8F5E9":"#FFEBEE",border:`1px solid ${has?"#81C784":"#EF9A9A"}`,cursor:isAdmin?"pointer":"default",fontSize:11,fontWeight:700,color:has?C.sageD:C.danger}}>
              <span>{has?"✅":"❌"}</span>{DOC_LABELS[doc]}
            </div>);})}
          </div>
        </Card>))}
      </div>
    </div>);
  };

  const AdvancesTab=()=>{
    const[showForm,setShowForm]=useState(false);const[form,setForm]=useState({staffId:"",amount:"",reason:"",repayMonths:1});
    const save=()=>{const s=staff.find(st=>st.id===parseInt(form.staffId));setAdvances(p=>[{id:Date.now(),...form,staffId:parseInt(form.staffId),staffName:s?.name||"",amount:parseInt(form.amount)||0,date:new Date().toISOString().split("T")[0],repaidMonths:0,status:"Pending Approval",approvedBy:""},...p]);setShowForm(false);setForm({staffId:"",amount:"",reason:"",repayMonths:1});};
    const approve=id=>setAdvances(p=>p.map(a=>a.id===id?{...a,status:"Active",approvedBy:"Aggrey Ochieng"}:a));
    const reject=id=>setAdvances(p=>p.map(a=>a.id===id?{...a,status:"Rejected"}:a));
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",gap:10}}><div style={{background:"#FFF3E0",borderRadius:12,padding:"10px 14px",border:"1px solid #FFB74D"}}><div style={{fontSize:18,fontWeight:900,color:C.warning}}>KSh {advances.filter(a=>a.status==="Active").reduce((s,a)=>s+a.amount,0).toLocaleString()}</div><div style={{fontSize:11,color:C.textL}}>Outstanding</div></div></div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.terra},${C.terraL})`,color:"white",padding:"10px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ New Advance</button>
      </div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.terra}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Salary Advance Request</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Staff Member"><select value={form.staffId} onChange={e=>setForm(p=>({...p,staffId:e.target.value}))} style={inp}><option value="">Select staff...</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Amount (KSh)"><input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={inp}/></Field><Field label="Repayment (months)"><select value={form.repayMonths} onChange={e=>setForm(p=>({...p,repayMonths:parseInt(e.target.value)}))} style={inp}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} month{n>1?"s":""}</option>)}</select></Field><Field label="Reason"><input value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} style={inp}/></Field></div><div style={{marginTop:10,padding:"8px 12px",background:"#FFF3E0",borderRadius:8,fontSize:11,color:C.warning}}>⚠️ Max 50% of monthly salary. Manager approval required.</div><div style={{display:"flex",gap:10,marginTop:10}}><button onClick={save} style={{background:C.terra,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Submit</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{advances.map(adv=>{const s=staff.find(st=>st.id===adv.staffId);const monthly=Math.round(adv.amount/adv.repayMonths);return(<Card key={adv.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}><div><div style={{display:"flex",gap:9,alignItems:"center",marginBottom:5}}><span style={{fontSize:20}}>{s?.photo||"👤"}</span><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{adv.staffName}</div><div style={{fontSize:11,color:C.textL}}>{s?.role} · {adv.date}</div></div></div><div style={{fontSize:12,color:C.textM,fontStyle:"italic"}}>"{adv.reason}"</div><div style={{fontSize:12,color:C.textL,marginTop:5}}>KSh {adv.amount.toLocaleString()} · KSh {monthly.toLocaleString()}/month · {adv.repayMonths} months</div>{adv.approvedBy&&<div style={{fontSize:11,color:C.textL}}>✓ Approved by {adv.approvedBy}</div>}</div><div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}><Badge label={adv.status}/>{adv.status==="Pending Approval"&&isAdmin&&(<div style={{display:"flex",gap:6}}><button onClick={()=>approve(adv.id)} style={{padding:"5px 12px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>✓ Approve</button><button onClick={()=>reject(adv.id)} style={{padding:"5px 12px",borderRadius:8,background:C.danger,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>✗ Reject</button></div>)}</div></div></Card>);})}</div>
    </div>);
  };

  const LeaveTab=()=>{
    const[showForm,setShowForm]=useState(false);const[form,setForm]=useState({staffId:"",type:"Annual Leave",from:"",to:"",reason:""});
    const TYPES=["Annual Leave","Sick Leave","Compassionate Leave","Maternity Leave","Paternity Leave","Study Leave","Unpaid Leave"];
    const dc=(f,t)=>Math.max(1,Math.round((new Date(t)-new Date(f))/(864e5))+1);
    const save=()=>{const s=staff.find(st=>st.id===parseInt(form.staffId));setLeaves(p=>[{id:Date.now(),...form,staffId:parseInt(form.staffId),staffName:s?.name||"",days:dc(form.from,form.to),status:"Pending",approvedBy:"",appliedOn:new Date().toISOString().split("T")[0]},...p]);setShowForm(false);setForm({staffId:"",type:"Annual Leave",from:"",to:"",reason:""});};
    const approve=id=>setLeaves(p=>p.map(l=>l.id===id?{...l,status:"Approved",approvedBy:"Aggrey Ochieng"}:l));
    const reject=id=>setLeaves(p=>p.map(l=>l.id===id?{...l,status:"Rejected"}:l));
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",gap:10}}>{[["Pending",leaves.filter(l=>l.status==="Pending").length,"#FFF3E0","#E65100"],["Approved",leaves.filter(l=>l.status==="Approved").length,"#E8F5E9","#2E7D32"]].map(([l,v,bg,tx])=>(<div key={l} style={{background:bg,borderRadius:12,padding:"10px 14px",border:`1px solid ${tx}30`,textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:tx}}>{v}</div><div style={{fontSize:11,color:C.textL}}>{l}</div></div>))}</div><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.sage},${C.sageD})`,color:"white",padding:"10px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Apply Leave</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.sage}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Leave Application</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Staff"><select value={form.staffId} onChange={e=>setForm(p=>({...p,staffId:e.target.value}))} style={inp}><option value="">Select...</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Type"><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={inp}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></Field><Field label="From"><input type="date" value={form.from} onChange={e=>setForm(p=>({...p,from:e.target.value}))} style={inp}/></Field><Field label="To"><input type="date" value={form.to} onChange={e=>setForm(p=>({...p,to:e.target.value}))} style={inp}/></Field><Field label="Reason" col="1/-1"><input value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.sageD,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Submit</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Leave Balances 2026</div><Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:8,padding:"9px 14px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Staff","Dept","Annual","Used","Sick","Used"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>{leaveBalances.slice(0,8).map((lb,i)=>{const s=staff.find(st=>st.id===lb.staffId);return(<div key={lb.staffId} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:8,padding:"10px 14px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{s?.name}</div><div style={{fontSize:11,color:C.textL}}>{s?.dept}</div><div style={{fontSize:13,fontWeight:700,color:C.navy}}>{lb.annual}</div><div style={{fontSize:13,fontWeight:700,color:lb.annualUsed>15?C.danger:C.terra}}>{lb.annualUsed}</div><div style={{fontSize:13,fontWeight:700,color:C.navy}}>{lb.sick}</div><div style={{fontSize:13,fontWeight:700,color:lb.sickUsed>5?C.danger:C.terra}}>{lb.sickUsed}</div></div>);})}</Card></div>
      <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Leave Requests</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{leaves.map(l=>(<Card key={l.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{l.staffName}</div><div style={{fontSize:11,color:C.textL,marginBottom:5}}>Applied {l.appliedOn}</div><div style={{display:"flex",gap:14,fontSize:12,color:C.textM,flexWrap:"wrap"}}><span>🌴 {l.type}</span><span>📅 {l.from} → {l.to}</span><span>⏱ {l.days}d</span></div>{l.reason&&<div style={{fontSize:12,color:C.textL,marginTop:4,fontStyle:"italic"}}>"{l.reason}"</div>}</div><div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}><Badge label={l.status}/>{l.status==="Pending"&&isAdmin&&(<div style={{display:"flex",gap:6}}><button onClick={()=>approve(l.id)} style={{padding:"5px 12px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>✓</button><button onClick={()=>reject(l.id)} style={{padding:"5px 12px",borderRadius:8,background:C.danger,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>✗</button></div>)}</div></div></Card>))}</div>
    </div>);
  };

  const ShiftsTab=()=>{
    const[date,setDate]=useState(todayISO);const todayS=shifts.filter(s=>s.date===date);
    const markStatus=(id,st)=>setShifts(prev=>prev.map(s=>s.id===id?{...s,status:st}:s));
    const setOT=(id,hrs)=>setShifts(prev=>prev.map(s=>{if(s.id!==id)return s;const st2=staff.find(st=>st.id===s.staffId);const hourly=(st2?.salary||0)/(30*8);const otPay=Math.round(hourly*1.5*hrs);return{...s,otHours:hrs,otPay,otApproved:hrs>4?false:true};}));
    const approveOT=(id)=>setShifts(prev=>prev.map(s=>s.id===id?{...s,otApproved:true}:s));
    const[addForm,setAddForm]=useState({staffId:"",shift:"Morning 6AM–2PM"});
    const addShift=()=>{const s=staff.find(st=>st.id===parseInt(addForm.staffId));if(!s)return;setShifts(p=>[...p,{id:Date.now(),staffId:parseInt(addForm.staffId),date,shift:addForm.shift,status:"Present",otHours:0,otPay:0,otApproved:false}]);setAddForm({staffId:"",shift:"Morning 6AM–2PM"});};
    const monthOT=shifts.reduce((s,sh)=>s+(sh.otPay||0),0);const pendingApproval=shifts.filter(sh=>sh.otHours>4&&!sh.otApproved).length;
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Monthly OT Cost",v:`KSh ${monthOT.toLocaleString()}`},{bg:pendingApproval>0?"#FFF3E0":"#E8F5E9",b:pendingApproval>0?"#FFB74D":"#81C784",tx:pendingApproval>0?C.warning:C.sageD,l:"Pending OT Approval",v:pendingApproval},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Shifts Today",v:todayS.length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inp,width:"auto"}}/><div style={{display:"flex",gap:8}}>{[["✅ Present",todayS.filter(s=>s.status==="Present").length,"#E8F5E9","#2E7D32"],["⏰ Late",todayS.filter(s=>s.status==="Late").length,"#FFF8E1","#F57F17"],["❌ Absent",todayS.filter(s=>s.status==="Absent").length,"#FFEBEE","#C62828"]].map(([l,v,bg,tx])=>(<div key={l} style={{background:bg,borderRadius:10,padding:"8px 12px",border:`1px solid ${tx}30`}}><span style={{fontSize:13,fontWeight:900,color:tx}}>{v}</span><span style={{fontSize:11,color:C.textL,marginLeft:5}}>{l}</span></div>))}</div></div>
      {isAdmin&&(<Card style={{marginBottom:12,border:`1px solid ${C.navy}30`}}><div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:8}}>Add Shift</div><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><select value={addForm.staffId} onChange={e=>setAddForm(p=>({...p,staffId:e.target.value}))} style={{...inp,width:"auto",flex:2,minWidth:180}}><option value="">Select staff...</option>{staff.filter(s=>s.status==="Active").map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><select value={addForm.shift} onChange={e=>setAddForm(p=>({...p,shift:e.target.value}))} style={{...inp,width:"auto",flex:2,minWidth:180}}>{["Morning 6AM–2PM","Afternoon 2PM–10PM","Night 10PM–6AM","Day 8AM–5PM"].map(sh=><option key={sh}>{sh}</option>)}</select><button onClick={addShift} style={{background:C.navy,color:"white",padding:"10px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>+ Add</button></div></Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>{todayS.length===0&&<div style={{textAlign:"center",padding:32,color:C.textL}}>No shifts for this date.</div>}{todayS.map(sh=>{const s=staff.find(st=>st.id===sh.staffId)||{};const otH=sh.otHours||0;const needsApproval=otH>4&&!sh.otApproved;return(<Card key={sh.id} style={{padding:"12px 14px",border:needsApproval?`1.5px solid ${C.warning}30`:"1px solid transparent"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{s.photo||"👤"}</span><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.textL}}>{s.role} · {sh.shift}</div></div></div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <Badge label={sh.status}/>
            {isAdmin&&<div style={{display:"flex",gap:4}}>{["Present","Late","Absent"].map(st=>(<button key={st} onClick={()=>markStatus(sh.id,st)} style={{padding:"4px 9px",borderRadius:8,border:`1px solid ${SC[st]?.dot||C.border}`,background:sh.status===st?SC[st]?.bg||"white":"white",color:SC[st]?.tx||C.text,fontSize:11,cursor:"pointer",fontWeight:700}}>{st}</button>))}</div>}
          </div>
        </div>
        {isAdmin&&<div style={{display:"flex",gap:10,alignItems:"center",marginTop:10,paddingTop:8,borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textM}}>
            <span style={{fontWeight:700}}>OT Hours:</span>
            <input type="number" min="0" max="12" step="0.5" value={otH} onChange={e=>setOT(sh.id,parseFloat(e.target.value)||0)} style={{...inp,width:64,padding:"4px 8px",fontSize:12}}/>
          </div>
          {otH>0&&<div style={{fontSize:12,color:C.navy,fontWeight:700}}>OT Pay: KSh {(sh.otPay||0).toLocaleString()}</div>}
          {otH>0&&(sh.otApproved?<span style={{fontSize:11,color:C.sageD,fontWeight:700,background:"#E8F5E9",padding:"3px 8px",borderRadius:6}}>✓ OT Approved</span>:<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:C.warning,fontWeight:700}}>{otH>4?"⚠️ Requires approval":"Pending"}</span><button onClick={()=>approveOT(sh.id)} style={{fontSize:11,padding:"4px 10px",borderRadius:7,background:C.warning,color:"white",border:"none",cursor:"pointer",fontWeight:700}}>Approve</button></div>)}
        </div>}
      </Card>);})}</div>
    </div>);
  };

  const PerformanceTab=()=>(<div>
    <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Staff Performance Reviews — Q1 2026</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
      {performance.map(p=>{const s=staff.find(st=>st.id===p.staffId)||{};const score=parseFloat(p.overall);const sc=score>=4.5?"#2E7D32":score>=3.5?"#1565C0":score>=2.5?"#F57F17":"#C62828";return(
        <Card key={p.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:22}}>{s.photo||"👤"}</span><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.textL}}>{s.role} · {p.period}</div></div></div><div style={{textAlign:"center",background:sc+"15",borderRadius:12,padding:"7px 12px",border:`2px solid ${sc}`}}><div style={{fontSize:20,fontWeight:900,color:sc}}>{p.overall}</div><div style={{fontSize:9,color:sc,fontWeight:700}}>/ 5.0</div></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>{[["⏰ Punctuality",p.punctuality],["✨ Work Quality",p.cleanliness],["😊 Guest Satis.",p.guestSatisfaction],["🤝 Teamwork",p.teamwork],["💡 Initiative",p.initiative]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:C.textL}}>{l}</span><span style={{color:"#F9A825"}}>{"★".repeat(v)}{"☆".repeat(5-v)}</span></div>))}</div>
        {p.comments&&<div style={{fontSize:12,color:C.textM,fontStyle:"italic",padding:"7px 9px",background:C.sandL,borderRadius:8,marginBottom:7}}>"{p.comments}"</div>}
        <div style={{fontSize:11,color:C.textL}}>By {p.reviewer} · {p.date}</div>
        </Card>
      );})}
    </div>
  </div>);

  const SurveysTab=()=>{
    const QUESTIONS=[["environment","🏢 Work Environment"],["management","👔 Management Support"],["tools","🔧 Tools & Equipment"],["morale","🤝 Team Morale"],["overall","⭐ Overall Satisfaction"]];
    const periods=[...new Set((surveys||[]).map(s=>s.period))].sort((a,b)=>b.localeCompare(a));
    const[selPeriod,setSelPeriod]=useState(periods[0]||"Q1 2026");
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({environment:5,management:5,tools:5,morale:5,overall:5,comments:""});
    const periodData=(surveys||[]).filter(s=>s.period===selPeriod);
    const avg=(key)=>periodData.length?Math.round((periodData.reduce((s,r)=>s+r[key],0)/periodData.length)*10)/10:0;
    const submit=()=>{setSurveys(p=>[...p,{id:Date.now(),period:selPeriod,submittedDate:new Date().toISOString().split("T")[0],...form,environment:parseInt(form.environment),management:parseInt(form.management),tools:parseInt(form.tools),morale:parseInt(form.morale),overall:parseInt(form.overall)}]);setShowForm(false);setForm({environment:5,management:5,tools:5,morale:5,overall:5,comments:""});};
    const Stars=({val,max=5})=><span style={{color:"#F9A825",fontSize:16}}>{"★".repeat(val)}{"☆".repeat(max-val)}</span>;
    const prevPeriod=periods[periods.indexOf(selPeriod)+1];const prevData=(surveys||[]).filter(s=>s.period===prevPeriod);const prevAvg=(key)=>prevData.length?Math.round((prevData.reduce((s,r)=>s+r[key],0)/prevData.length)*10)/10:null;
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:700,color:C.textM}}>Period:</span>
          <select value={selPeriod} onChange={e=>setSelPeriod(e.target.value)} style={{...inp,width:"auto",padding:"6px 10px"}}>
            {periods.map(p=><option key={p}>{p}</option>)}
          </select>
          <span style={{fontSize:11,color:C.textL}}>{periodData.length} response{periodData.length!==1?"s":""}</span>
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.sageD},${C.sage})`,color:"white",padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>✍️ Submit Anonymous Survey</button>
      </div>
      {showForm&&(<Card style={{marginBottom:16,border:`2px solid ${C.sage}`}}>
        <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:4}}>Staff Satisfaction Survey — {selPeriod}</div>
        <div style={{fontSize:12,color:C.textL,marginBottom:14}}>Anonymous. Your identity is not recorded.</div>
        {QUESTIONS.map(([k,l])=>(
          <div key={k} style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:5}}>{l}</div>
            <div style={{display:"flex",gap:6}}>
              {[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setForm(p=>({...p,[k]:n}))} style={{width:38,height:38,borderRadius:8,border:`2px solid ${form[k]>=n?"#F9A825":C.border}`,background:form[k]>=n?"#FFF8E1":"white",fontSize:16,cursor:"pointer",color:"#F9A825"}}>★</button>))}
              <span style={{fontSize:12,color:C.textL,alignSelf:"center",marginLeft:4}}>{form[k]}/5</span>
            </div>
          </div>))}
        <Field label="Comments (optional)"><input type="text" value={form.comments} onChange={e=>setForm(p=>({...p,comments:e.target.value}))} style={inp} placeholder="Any additional feedback..."/></Field>
        <div style={{display:"flex",gap:10,marginTop:12}}><button onClick={submit} style={{background:C.sageD,color:"white",padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Submit</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
      </Card>)}
      {periodData.length===0?<div style={{textAlign:"center",padding:48,color:C.textL}}>No survey responses for this period yet.</div>:(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginBottom:14}}>
            {QUESTIONS.map(([k,l])=>{const a=avg(k);const pa=prevAvg(k);const trend=pa!=null?a>pa?"▲ "+((a-pa).toFixed(1)):a<pa?"▼ "+((pa-a).toFixed(1)):"—":null;return(
              <div key={k} style={{background:a>=4?"#E8F5E9":a>=3?"#FFF8E1":"#FFEBEE",borderRadius:14,padding:"14px 16px",border:`1px solid ${C.border}`,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{l}</div>
                <div style={{fontSize:28,fontWeight:900,color:a>=4?C.sageD:a>=3?C.gold:C.danger}}>{a.toFixed(1)}</div>
                <Stars val={Math.round(a)}/>
                {trend&&<div style={{fontSize:11,marginTop:4,fontWeight:700,color:trend.startsWith("▲")?C.sageD:trend.startsWith("▼")?C.danger:C.textL}}>{trend} vs {prevPeriod}</div>}
              </div>
            );})}
          </div>
          <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>💬 Comments from {selPeriod}</div>
            {periodData.filter(r=>r.comments).map((r,i)=><div key={i} style={{padding:"8px 12px",marginBottom:6,background:C.sandL,borderRadius:8,fontSize:12,color:C.textM,fontStyle:"italic"}}>"{r.comments}"</div>)}
            {periodData.filter(r=>r.comments).length===0&&<div style={{fontSize:12,color:C.textL}}>No comments for this period.</div>}
          </Card>
        </div>
      )}
    </div>);
  };
  return(<div><SectionTitle title="HR & Payroll" sub={`${activeStaff.length} active staff · ${formerStaff.length} former · CHABBS Resort`}/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="staff"&&<StaffTab/>}{sub==="former"&&<FormerStaffTab/>}{sub==="payroll"&&<PayrollTab/>}{sub==="reports"&&<PayReportsTab/>}{sub==="advances"&&<AdvancesTab/>}{sub==="leaves"&&<LeaveTab/>}{sub==="shifts"&&<ShiftsTab/>}{sub==="performance"&&<PerformanceTab/>}{sub==="training"&&<TrainingTab/>}{sub==="documents"&&<DocumentsTab/>}{sub==="surveys"&&<SurveysTab/>}</div>);
};

const InventoryView=({inventory,setInventory,purchaseOrders,setPurchaseOrders,suppliers})=>{
  const[sub,setSub]=useState("stock");
  const TABS=[["stock","📦","Stock"],["po","📋","Purchase Orders"],["suppliers","🏭","Suppliers"]];
  const TODAY="2026-04-13";
  const daysDiff=(d)=>{if(!d)return null;const ms=new Date(d)-new Date(TODAY);return Math.ceil(ms/(1000*60*60*24));};
  const expiryStatus=(d)=>{if(!d)return null;const diff=daysDiff(d);if(diff<0)return"expired";if(diff<=30)return"soon";return"ok";};

  const StockTab=()=>{
    const[showForm,setShowForm]=useState(false);const[filter,setFilter]=useState("All");
    const[form,setForm]=useState({name:"",category:"Housekeeping",unit:"Pcs",qty:"",minQty:"",unitCost:"",supplier:"",expiryDate:""});
    const CATS=["Housekeeping","Maintenance","Kitchen","Stationery","Security","Other"];
    const save=()=>{setInventory(p=>[{id:Date.now(),...form,qty:parseInt(form.qty)||0,minQty:parseInt(form.minQty)||0,unitCost:parseInt(form.unitCost)||0,lastRestocked:TODAY,expiryDate:form.expiryDate||null},...p]);setShowForm(false);setForm({name:"",category:"Housekeeping",unit:"Pcs",qty:"",minQty:"",unitCost:"",supplier:"",expiryDate:""});};
    const filtered=filter==="All"?inventory:filter==="Low Stock"?inventory.filter(i=>i.qty<=i.minQty):filter==="Expiring"?inventory.filter(i=>expiryStatus(i.expiryDate)==="soon"||expiryStatus(i.expiryDate)==="expired"):inventory.filter(i=>i.category===filter);
    const low=inventory.filter(i=>i.qty<=i.minQty).length;
    const expired=inventory.filter(i=>expiryStatus(i.expiryDate)==="expired").length;
    const expiringSoon=inventory.filter(i=>expiryStatus(i.expiryDate)==="soon").length;
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Total Items",v:inventory.length},{bg:low>0?"#FFEBEE":"#E8F5E9",b:low>0?"#EF9A9A":"#81C784",tx:low>0?C.danger:C.sageD,l:"Low Stock",v:low},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Stock Value",v:`KSh ${inventory.reduce((s,i)=>s+i.qty*i.unitCost,0).toLocaleString()}`},{bg:expired>0?"#FFEBEE":"#FFF8E1",b:expired>0?"#EF9A9A":"#FFE082",tx:expired>0?C.danger:"#F57F17",l:"Expiry Alerts",v:expired>0?`${expired} EXPIRED`:`${expiringSoon} Soon`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      {(expired>0||expiringSoon>0)&&<div style={{background:"#FFEBEE",border:"1px solid #EF9A9A",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.danger,marginBottom:6}}>⚠️ Expiry Alerts</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {inventory.filter(i=>expiryStatus(i.expiryDate)==="expired").map(i=><span key={i.id} style={{fontSize:11,background:"#FFEBEE",border:"1px solid #EF9A9A",borderRadius:20,padding:"3px 10px",color:C.danger,fontWeight:700}}>🚨 EXPIRED: {i.name} ({i.expiryDate})</span>)}
          {inventory.filter(i=>expiryStatus(i.expiryDate)==="soon").map(i=><span key={i.id} style={{fontSize:11,background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:20,padding:"3px 10px",color:"#F57F17",fontWeight:700}}>⚠️ Expiring: {i.name} ({daysDiff(i.expiryDate)}d)</span>)}
        </div>
      </div>}
      {low>0&&<div style={{background:"#FFF3E0",border:"1px solid #FFCC80",borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:20}}>📉</span><div style={{fontSize:13,fontWeight:800,color:"#E65100"}}>Low Stock — {inventory.filter(i=>i.qty<=i.minQty).map(i=>i.name).join(" · ")}</div></div>}
      <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["All","Low Stock","Expiring",...CATS].map(f=>(<button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 13px",borderRadius:20,border:`1px solid ${filter===f?C.navy:C.border}`,background:filter===f?C.navy:"white",color:filter===f?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:filter===f?700:400}}>{f}</button>))}</div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"9px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Item</button>
      </div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Add Item</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Item Name"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp}/></Field><Field label="Category"><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={inp}>{CATS.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="Unit"><input value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))} style={inp}/></Field><Field label="Current Qty"><input type="number" value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))} style={inp}/></Field><Field label="Min Qty"><input type="number" value={form.minQty} onChange={e=>setForm(p=>({...p,minQty:e.target.value}))} style={inp}/></Field><Field label="Unit Cost (KSh)"><input type="number" value={form.unitCost} onChange={e=>setForm(p=>({...p,unitCost:e.target.value}))} style={inp}/></Field><Field label="Supplier"><input value={form.supplier} onChange={e=>setForm(p=>({...p,supplier:e.target.value}))} style={inp}/></Field><Field label="Expiry Date (optional)"><input type="date" value={form.expiryDate} onChange={e=>setForm(p=>({...p,expiryDate:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Add</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 0.8fr 1fr 1.2fr",gap:8,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Item","Category","Qty","Min","Value","Expiry / Supplier"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
        {filtered.map((item,i)=>{const isLow=item.qty<=item.minQty;const es=expiryStatus(item.expiryDate);const diff=daysDiff(item.expiryDate);return(<div key={item.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 0.8fr 1fr 1.2fr",gap:8,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:es==="expired"?"#FFEBEE30":i%2===0?"white":`${C.sand}40`}}>
          <div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{item.name}</div><div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>{isLow&&<span style={{fontSize:9,background:"#FFEBEE",color:C.danger,padding:"2px 7px",borderRadius:10,fontWeight:800}}>LOW</span>}{es==="expired"&&<span style={{fontSize:9,background:"#FFEBEE",color:C.danger,padding:"2px 7px",borderRadius:10,fontWeight:800}}>🚨 EXPIRED</span>}{es==="soon"&&<span style={{fontSize:9,background:"#FFF8E1",color:"#E65100",padding:"2px 7px",borderRadius:10,fontWeight:800}}>⚠️ EXPIRING</span>}</div></div>
          <div style={{fontSize:11,color:C.textM}}>{item.category}</div>
          <div style={{fontSize:13,fontWeight:800,color:isLow?C.danger:C.navy}}>{item.qty} {item.unit}</div>
          <div style={{fontSize:12,color:C.textL}}>{item.minQty}</div>
          <div style={{fontSize:12,color:C.sageD,fontWeight:700}}>KSh {(item.qty*item.unitCost).toLocaleString()}</div>
          <div><div style={{fontSize:11,color:C.textL}}>{item.supplier}</div>{item.expiryDate&&<div style={{fontSize:10,color:es==="expired"?C.danger:es==="soon"?"#E65100":C.textL,fontWeight:700,marginTop:2}}>{es==="expired"?"EXPIRED":es==="soon"?`${diff}d left`:item.expiryDate}</div>}</div>
        </div>);})}
      </Card>
    </div>);
  };

  const POTab=()=>{
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({supplier:"Nairobi Textiles",items:[{name:"",qty:"",unitCost:""}],notes:""});
    const addLine=()=>setForm(p=>({...p,items:[...p.items,{name:"",qty:"",unitCost:""}]}));
    const updateLine=(idx,field,val)=>setForm(p=>({...p,items:p.items.map((it,i)=>i===idx?{...it,[field]:val}:it)}));
    const calcTotal=(items)=>items.reduce((s,it)=>s+(parseInt(it.qty)||0)*(parseInt(it.unitCost)||0),0);
    const save=()=>{
      const nextNum=String(purchaseOrders.length+1).padStart(3,"0");
      const newPO={id:Date.now(),poNumber:`PO-2026-${nextNum}`,supplier:form.supplier,date:TODAY,items:form.items.map(it=>({...it,qty:parseInt(it.qty)||0,unitCost:parseInt(it.unitCost)||0,total:(parseInt(it.qty)||0)*(parseInt(it.unitCost)||0)})),total:calcTotal(form.items),status:"Draft",deliveredDate:"",notes:form.notes};
      setPurchaseOrders(p=>[newPO,...p]);setShowForm(false);setForm({supplier:"Nairobi Textiles",items:[{name:"",qty:"",unitCost:""}],notes:""});
    };
    const advancePO=(id,cur)=>{
      const seq=["Draft","Sent","Delivered","Paid"];const ni=seq.indexOf(cur)+1;if(ni>=seq.length)return;
      setPurchaseOrders(p=>p.map(po=>{if(po.id!==id)return po;const updated={...po,status:seq[ni]};
        if(seq[ni]==="Delivered"){updated.deliveredDate=TODAY;setInventory(inv=>inv.map(item=>{const line=po.items.find(it=>it.name===item.name);return line?{...item,qty:item.qty+line.qty,lastRestocked:TODAY}:item;}));}
        return updated;}));
    };
    const stColor={Draft:"#9E9E9E",Sent:"#2196F3",Delivered:"#4CAF50",Paid:"#2E7D32"};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:16}}>
        {[["Draft","#E0E0E0","#616161"],["Sent","#E3F2FD","#1565C0"],["Delivered","#E8F5E9","#2E7D32"],["Paid","#F3E5F5","#6A1B9A"]].map(([s,bg,tx])=>(<div key={s} style={{background:bg,border:`1px solid ${tx}30`,borderRadius:12,padding:"10px 14px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:tx}}>{purchaseOrders.filter(p=>p.status===s).length}</div><div style={{fontSize:11,color:C.textL}}>{s}</div></div>))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ New Purchase Order</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>New Purchase Order</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}><Field label="Supplier"><select value={form.supplier} onChange={e=>setForm(p=>({...p,supplier:e.target.value}))} style={inp}>{suppliers.map(s=><option key={s.id}>{s.name}</option>)}</select></Field><Field label="Notes"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={inp}/></Field></div>
        <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:8}}>Line Items</div>
        {form.items.map((it,idx)=>(<div key={idx} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:6,alignItems:"center"}}>
          <input value={it.name} onChange={e=>updateLine(idx,"name",e.target.value)} placeholder="Item name" style={inp}/>
          <input type="number" value={it.qty} onChange={e=>updateLine(idx,"qty",e.target.value)} placeholder="Qty" style={inp}/>
          <input type="number" value={it.unitCost} onChange={e=>updateLine(idx,"unitCost",e.target.value)} placeholder="Unit cost" style={inp}/>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,whiteSpace:"nowrap"}}>KSh {((parseInt(it.qty)||0)*(parseInt(it.unitCost)||0)).toLocaleString()}</div>
        </div>))}
        <button onClick={addLine} style={{fontSize:12,color:C.navy,background:"none",border:`1px dashed ${C.navy}`,borderRadius:8,padding:"5px 12px",cursor:"pointer",marginBottom:12}}>+ Add Line</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:800,color:C.navy}}>Total: KSh {calcTotal(form.items).toLocaleString()}</div>
          <div style={{display:"flex",gap:10}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Create PO</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
        </div>
      </Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{purchaseOrders.map(po=>(<Card key={po.id} style={{borderLeft:`4px solid ${stColor[po.status]||C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:8}}>
          <div><div style={{fontSize:14,fontWeight:800,color:C.navy}}>{po.poNumber}</div><div style={{fontSize:12,color:C.textL}}>🏭 {po.supplier} · 📅 {po.date}</div>{po.deliveredDate&&<div style={{fontSize:11,color:C.sageD,marginTop:2}}>✅ Delivered: {po.deliveredDate}</div>}</div>
          <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:900,color:C.navy}}>KSh {po.total.toLocaleString()}</div><Badge label={po.status}/>{po.status!=="Paid"&&<button onClick={()=>advancePO(po.id,po.status)} style={{display:"block",marginTop:6,padding:"5px 12px",borderRadius:8,background:stColor[po.status],color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>→ {["Draft","Sent","Delivered","Paid"][["Draft","Sent","Delivered","Paid"].indexOf(po.status)+1]||"Done"}</button>}</div>
        </div>
        <div style={{background:C.sandL,borderRadius:8,padding:"8px 10px"}}>
          {po.items.map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textM,padding:"2px 0",borderBottom:i<po.items.length-1?`1px solid ${C.border}`:"none"}}><span>{it.name}</span><span style={{color:C.navy,fontWeight:700}}>{it.qty} × KSh {it.unitCost?.toLocaleString()} = KSh {it.total?.toLocaleString()}</span></div>))}
        </div>
        {po.notes&&<div style={{fontSize:11,color:C.textL,marginTop:6,fontStyle:"italic"}}>📝 {po.notes}</div>}
      </Card>))}</div>
    </div>);
  };

  const SuppliersTab=()=>{
    const ratingColor={5:"#4CAF50",4:"#8BC34A",3:"#FFC107",2:"#FF9800",1:"#F44336"};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Total Suppliers",v:suppliers.length},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"Avg Rating",v:(suppliers.reduce((s,x)=>s+x.rating,0)/suppliers.length).toFixed(1)+" ★"},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Categories",v:[...new Set(suppliers.map(s=>s.category))].length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {suppliers.map(s=>(<Card key={s.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div><div style={{fontSize:14,fontWeight:800,color:C.navy}}>{s.name}</div><div style={{fontSize:11,color:C.textL,marginTop:2}}>{s.category}</div></div>
            <div style={{background:`${ratingColor[s.rating]}20`,border:`1px solid ${ratingColor[s.rating]}40`,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:800,color:ratingColor[s.rating]}}>{"★".repeat(s.rating)}{"☆".repeat(5-s.rating)}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,fontSize:12,color:C.textM}}>
            <div>👤 {s.contact} · 📞 {s.phone}</div>
            <div>✉️ {s.email}</div>
            <div style={{display:"flex",gap:12,marginTop:4,flexWrap:"wrap"}}>
              <span style={{background:C.sandL,borderRadius:8,padding:"3px 8px",fontSize:11}}>⏱ {s.leadTime}</span>
              <span style={{background:C.sandL,borderRadius:8,padding:"3px 8px",fontSize:11}}>💳 {s.paymentTerms}</span>
            </div>
            <div style={{fontSize:11,color:C.textL,marginTop:4}}>Last order: {s.lastOrder}</div>
          </div>
          {s.notes&&<div style={{fontSize:11,color:C.textM,marginTop:8,padding:"7px 10px",background:C.sandL,borderRadius:8,fontStyle:"italic"}}>💡 {s.notes}</div>}
        </Card>))}
      </div>
    </div>);
  };

  return(<div><SectionTitle title="Inventory & Procurement" sub="Stock levels, purchase orders and supplier management"/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="stock"&&<StockTab/>}{sub==="po"&&<POTab/>}{sub==="suppliers"&&<SuppliersTab/>}</div>);
};

const FeedbackView=({feedback,setFeedback})=>{
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({guest:"",villa:"Villa 1",rating:5,comment:"",category:"Excellent",recommend:true,nps:9});
  const save=()=>{setFeedback(p=>[{id:Date.now(),...form,date:"2026-04-13",responded:false,respondedBy:"",respondedDate:""},...p]);setShowForm(false);setForm({guest:"",villa:"Villa 1",rating:5,comment:"",category:"Excellent",recommend:true,nps:9});};
  const respond=(id)=>{setFeedback(p=>p.map(f=>f.id===id?{...f,responded:true,respondedBy:"Aggrey Ochieng",respondedDate:"2026-04-13"}:f));};

  // Sentiment tag engine
  const getTags=(comment)=>{const c=(comment||"").toLowerCase();const tags=[];
    if(/room|villa|clean|bed|linen|towel|shower/.test(c))tags.push({t:"🏡 Room",bg:"#E3F2FD",tx:"#1565C0"});
    if(/food|restaurant|chef|meal|kitchen|breakfast|lunch|dinner|nyama|ugali/.test(c))tags.push({t:"🍽 Food",bg:"#FFF8E1",tx:"#F57F17"});
    if(/staff|friendly|service|team|welcome|kind/.test(c))tags.push({t:"👥 Staff",bg:"#E8F5E9",tx:"#2E7D32"});
    if(/pool|swim/.test(c))tags.push({t:"🏊 Pool",bg:"#E0F2F1",tx:"#00695C"});
    if(/value|price|expensive|cheap|money/.test(c))tags.push({t:"💰 Value",bg:"#F3E5F5",tx:"#6A1B9A"});
    if(/christian|faith|church|chapel|prayer|god|blessed/.test(c))tags.push({t:"✟ Faith",bg:"#FCE4EC",tx:"#880E4F"});
    return tags;
  };

  // NPS calculation
  const withNps=feedback.filter(f=>f.nps!=null);
  const promoters=withNps.filter(f=>f.nps>=9).length;
  const passives=withNps.filter(f=>f.nps>=7&&f.nps<=8).length;
  const detractors=withNps.filter(f=>f.nps<=6).length;
  const npsScore=withNps.length>0?Math.round(((promoters-detractors)/withNps.length)*100):0;
  const npsColor=npsScore>=50?"#4CAF50":npsScore>=0?"#FF9800":"#F44336";

  const needsResponse=feedback.filter(f=>!f.responded).length;
  const avg=(feedback.reduce((s,f)=>s+f.rating,0)/feedback.length).toFixed(1);
  const rec=Math.round((feedback.filter(f=>f.recommend).length/feedback.length)*100);

  // Tag distribution
  const tagCounts={};feedback.forEach(f=>{getTags(f.comment).forEach(({t})=>{tagCounts[t]=(tagCounts[t]||0)+1;});});

  return(<div><SectionTitle title="Guest Feedback" sub="Reviews, ratings, NPS and satisfaction tracking"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
      {[{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Avg Rating",v:`${avg}/5`},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Recommend",v:`${rec}%`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Total Reviews",v:feedback.length},{bg:needsResponse>0?"#FFEBEE":"#E8F5E9",b:needsResponse>0?"#EF9A9A":"#81C784",tx:needsResponse>0?C.danger:C.sageD,l:"Needs Response",v:needsResponse}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
    </div>

    {/* NPS Panel */}
    <Card style={{marginBottom:16,padding:"18px 20px"}}>
      <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:14,textTransform:"uppercase",letterSpacing:1}}>Net Promoter Score (NPS)</div>
      <div style={{display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:56,fontWeight:900,color:npsColor,lineHeight:1}}>{npsScore>0?"+":""}{npsScore}</div>
          <div style={{fontSize:11,color:C.textL,marginTop:4}}>{npsScore>=70?"World Class":npsScore>=50?"Excellent":npsScore>=30?"Good":npsScore>=0?"Improving":"Needs Work"}</div>
        </div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:"flex",borderRadius:10,overflow:"hidden",height:20,marginBottom:10}}>
            {withNps.length>0&&<>
              <div style={{flex:detractors,background:"#F44336",minWidth:detractors>0?20:0}} title={`Detractors: ${detractors}`}/>
              <div style={{flex:passives,background:"#FF9800",minWidth:passives>0?20:0}} title={`Passives: ${passives}`}/>
              <div style={{flex:promoters,background:"#4CAF50",minWidth:promoters>0?20:0}} title={`Promoters: ${promoters}`}/>
            </>}
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[["Detractors (0–6)",detractors,"#F44336"],["Passives (7–8)",passives,"#FF9800"],["Promoters (9–10)",promoters,"#4CAF50"]].map(([l,v,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textM}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><span>{l}: <strong style={{color:c}}>{v}</strong></span></div>))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:120}}>
          {Object.entries(tagCounts).map(([t,n])=>(<div key={t} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,fontSize:11}}><span>{t}</span><span style={{fontWeight:800,color:C.navy}}>{n}</span></div>))}
        </div>
      </div>
    </Card>

    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.gold},${C.goldL})`,color:C.text,padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Review</button></div>
    {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.gold}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Guest Review</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Guest Name"><input value={form.guest} onChange={e=>setForm(p=>({...p,guest:e.target.value}))} style={inp}/></Field><Field label="Villa"><select value={form.villa} onChange={e=>setForm(p=>({...p,villa:e.target.value}))} style={inp}>{Array.from({length:10},(_,i)=><option key={i}>Villa {i+1}</option>)}</select></Field><Field label="Stars"><div style={{display:"flex",gap:8,paddingTop:4}}>{[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setForm(p=>({...p,rating:n}))} style={{width:34,height:34,borderRadius:8,border:`2px solid ${form.rating>=n?"#F9A825":C.border}`,background:form.rating>=n?"#FFF8E1":"white",color:"#F9A825",cursor:"pointer",fontSize:18}}>★</button>))}</div></Field><Field label="Recommend?"><div style={{display:"flex",gap:8,paddingTop:4}}>{[[true,"✅ Yes"],[false,"❌ No"]].map(([v,l])=>(<button key={l} onClick={()=>setForm(p=>({...p,recommend:v}))} style={{padding:"8px 14px",borderRadius:10,border:`2px solid ${form.recommend===v?C.navy:C.border}`,background:form.recommend===v?C.navy:"white",color:form.recommend===v?"white":C.textM,cursor:"pointer",fontWeight:700,fontSize:12}}>{l}</button>))}</div></Field><Field label="NPS (0–10): Would recommend?"><div style={{display:"flex",gap:4,paddingTop:4,flexWrap:"wrap"}}>{[0,1,2,3,4,5,6,7,8,9,10].map(n=>(<button key={n} onClick={()=>setForm(p=>({...p,nps:n}))} style={{width:30,height:30,borderRadius:6,border:`2px solid ${form.nps===n?(n>=9?"#4CAF50":n>=7?"#FF9800":"#F44336"):C.border}`,background:form.nps===n?(n>=9?"#E8F5E9":n>=7?"#FFF8E1":"#FFEBEE"):"white",color:n>=9?"#2E7D32":n>=7?"#E65100":"#C62828",cursor:"pointer",fontSize:12,fontWeight:form.nps===n?800:400}}>{n}</button>))}</div></Field><Field label="Comments" col="1/-1"><textarea value={form.comment} onChange={e=>setForm(p=>({...p,comment:e.target.value}))} rows={3} style={{...inp,resize:"vertical"}} placeholder="Guest's feedback..."/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.gold,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}

    <div style={{display:"flex",flexDirection:"column",gap:10}}>{feedback.map(f=>{const tags=getTags(f.comment);return(<Card key={f.id} style={{borderLeft:`4px solid ${f.rating===5?"#4CAF50":f.rating===4?"#2196F3":f.rating===3?"#FF9800":"#F44336"}`,opacity:f.responded?0.8:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:8}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{fontSize:14,fontWeight:800,color:C.text}}>{f.guest}</div>{f.responded&&<span style={{fontSize:10,background:"#E8F5E9",color:C.sageD,padding:"2px 7px",borderRadius:10,fontWeight:800}}>✅ Responded</span>}</div>
          <div style={{fontSize:12,color:C.textL,marginTop:2}}>🏡 {f.villa} · 📅 {f.date}</div>
          {f.nps!=null&&<div style={{fontSize:11,color:f.nps>=9?"#2E7D32":f.nps>=7?"#E65100":"#C62828",fontWeight:700,marginTop:3}}>NPS: {f.nps}/10 · {f.nps>=9?"Promoter":f.nps>=7?"Passive":"Detractor"}</div>}
        </div>
        <div style={{textAlign:"right"}}>
          <span style={{color:"#F9A825",fontSize:16}}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
          <div style={{display:"flex",gap:7,marginTop:5,justifyContent:"flex-end",flexWrap:"wrap"}}><Badge label={f.category}/>{f.recommend&&<span style={{fontSize:11,color:C.sageD,fontWeight:700}}>👍</span>}</div>
        </div>
      </div>
      <div style={{fontSize:13,color:C.textM,fontStyle:"italic",lineHeight:1.7,padding:"9px 12px",background:C.sandL,borderRadius:10,marginBottom:8}}>"{f.comment}"</div>
      {tags.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>{tags.map(({t,bg,tx})=>(<span key={t} style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:bg,color:tx,fontWeight:700}}>{t}</span>))}</div>}
      {!f.responded&&<div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>respond(f.id)} style={{padding:"6px 14px",borderRadius:8,background:C.navy,color:"white",border:"none",cursor:"pointer",fontSize:12,fontWeight:700}}>✍️ Respond</button></div>}
      {f.responded&&f.respondedBy&&<div style={{fontSize:11,color:C.textL,textAlign:"right"}}>Responded by {f.respondedBy} · {f.respondedDate}</div>}
    </Card>);})}</div>
  </div>);
};

const LostFoundView=({items,setItems})=>{
  const[showForm,setShowForm]=useState(false);const[form,setForm]=useState({item:"",foundAt:"",foundBy:"",notes:""});
  const[claimId,setClaimId]=useState(null);const[claimBy,setClaimBy]=useState("");
  const save=()=>{setItems(p=>[{id:Date.now(),...form,foundDate:new Date().toISOString().split("T")[0],status:"In Storage",claimedBy:"",claimDate:""},...p]);setShowForm(false);setForm({item:"",foundAt:"",foundBy:"",notes:""});};
  const confirmClaim=()=>{if(!claimBy.trim())return;setItems(p=>p.map(i=>i.id===claimId?{...i,status:"Claimed",claimedBy:claimBy.trim(),claimDate:new Date().toISOString().split("T")[0]}:i));setClaimId(null);setClaimBy("");};
  return(<div><SectionTitle title="Lost & Found" sub={`${items.filter(i=>i.status==="In Storage").length} items in storage`}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}><div style={{display:"flex",gap:10}}>{[["In Storage",items.filter(i=>i.status==="In Storage").length,"#E3F2FD","#1565C0"],["Claimed",items.filter(i=>i.status==="Claimed").length,"#E8F5E9","#2E7D32"]].map(([l,v,bg,tx])=>(<div key={l} style={{background:bg,borderRadius:12,padding:"10px 14px",border:`1px solid ${tx}30`,textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:tx}}>{v}</div><div style={{fontSize:11,color:C.textL}}>{l}</div></div>))}</div><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Log Found Item</button></div>
    {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Log Found Item</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Item Description" col="1/-1"><input value={form.item} onChange={e=>setForm(p=>({...p,item:e.target.value}))} placeholder="Describe item clearly..." style={inp}/></Field><Field label="Found At"><input value={form.foundAt} onChange={e=>setForm(p=>({...p,foundAt:e.target.value}))} style={inp}/></Field><Field label="Found By"><input value={form.foundBy} onChange={e=>setForm(p=>({...p,foundBy:e.target.value}))} style={inp}/></Field><Field label="Notes" col="1/-1"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Log</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{items.map(item=>(<Card key={item.id} style={{borderLeft:`4px solid ${item.status==="Claimed"?C.sageD:C.info}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}><div><div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:4}}>{item.item}</div><div style={{fontSize:12,color:C.textL,display:"flex",gap:14,flexWrap:"wrap"}}><span>📍 {item.foundAt}</span><span>👤 {item.foundBy}</span><span>📅 {item.foundDate}</span></div>{item.notes&&<div style={{fontSize:12,color:C.textM,marginTop:4,fontStyle:"italic"}}>{item.notes}</div>}{item.status==="Claimed"&&<div style={{fontSize:12,color:C.sageD,marginTop:5,fontWeight:700}}>✅ Claimed by {item.claimedBy} · {item.claimDate}</div>}</div><div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}><Badge label={item.status}/>{item.status==="In Storage"&&(claimId===item.id?(<div style={{display:"flex",gap:6,alignItems:"center"}}><input value={claimBy} onChange={e=>setClaimBy(e.target.value)} placeholder="Claimant name…" style={{...inp,padding:"5px 10px",fontSize:12,width:150}} autoFocus/><button onClick={confirmClaim} style={{padding:"5px 10px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:12,fontWeight:700}}>✓</button><button onClick={()=>{setClaimId(null);setClaimBy("");}} style={{padding:"5px 10px",borderRadius:8,background:C.border,color:C.textM,border:"none",cursor:"pointer",fontSize:12}}>✕</button></div>):(<button onClick={()=>{setClaimId(item.id);setClaimBy("");}} style={{padding:"5px 12px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:12,fontWeight:700}}>Mark Claimed</button>))}</div></div></Card>))}</div>
  </div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── SALES & MARKETING — DIGITAL MARKETING COMMAND CENTRE ────
// ═══════════════════════════════════════════════════════════════

// AI Content Generation Engine (uses Anthropic API)
const AI_CONTENT_TEMPLATES={
  tiktok:[
    {hook:"POV: You checked into a luxury resort in the middle of Turkana desert 🏜️✨",style:"Trending POV",hashtags:"#TurkanaLuxury #HiddenGemKenya #CHABBSResort #DesertOasis #KenyaTravel"},
    {hook:"Wait for it… this is NOT what you expect to find in Lodwar, Kenya 🤯",style:"Surprise Reveal",hashtags:"#Lodwar #UnexpectedLuxury #KenyaResort #TravelKenya #CHABBS"},
    {hook:"3 reasons CHABBS Resort is the best-kept secret in Northern Kenya 🇰🇪",style:"Listicle",hashtags:"#NorthernKenya #ResortLife #CHABBSResort #TurkanaCounty #AfricaTravel"},
    {hook:"How a Christian resort in the desert became Turkana's #1 destination ✟🌴",style:"Story",hashtags:"#ChristianTravel #FaithAndTravel #CHABBSResort #Turkana #GodIsGood"},
  ],
  instagram:[
    {type:"Carousel",topic:"10 Villas, 10 Unique Experiences — swipe to discover CHABBS Resort",cta:"Book your villa today — link in bio 🔗"},
    {type:"Reel",topic:"Sunrise over Turkana from our pool deck 🌅 The view that keeps our guests coming back",cta:"Tag someone who needs this view 👇"},
    {type:"Story Poll",topic:"Which room would YOU choose? 👑 Executive Suite or 🛏 Deluxe Room?",cta:"Vote in our story! Results announced Friday"},
    {type:"Post",topic:"Our Chef Emmanuel's famous Nyama Choma platter 🥩 — the taste of Turkana",cta:"When are you coming to try it? Comment below 👇"},
  ],
  facebook:[
    {type:"Event Post",topic:"Easter Sunrise Service at CHABBS Chapel ⛪ — All guests & community welcome",cta:"RSVP in the comments. Let's celebrate together 🙏"},
    {type:"Testimonial Share",topic:"'Best accommodation in Turkana by far' — MSF Kenya ⭐⭐⭐⭐⭐",cta:"Read more reviews and book your stay at chabbs.co.ke"},
    {type:"Offer Post",topic:"🎁 NGO Special: 15% off Full Board for humanitarian teams (min 5 nights)",cta:"Contact Martha Auma to book: +254 733 100 002"},
    {type:"Photo Album",topic:"Behind the scenes at CHABBS — meet our incredible team of 15 💪",cta:"Our people make the difference. Come experience the warmth!"},
  ],
  linkedin:[
    {type:"Article",topic:"How CHABBS Resort is driving hospitality excellence in Turkana County",cta:"Connect with us for corporate retreat packages"},
    {type:"Update",topic:"Proud to host UNICEF, Red Cross & MSF teams — supporting those who serve 🤝",cta:"Corporate & NGO packages available. DM for details."},
  ],
  twitter:[
    {type:"Thread",topic:"🧵 Why Lodwar is becoming Kenya's next big travel destination — and how CHABBS is leading the way"},
    {type:"Tweet",topic:"Turkana sunsets hit different when you're poolside at CHABBS Resort 🌅🏊 #VisitKenya"},
  ],
  google:[
    {type:"GMB Post",topic:"Special offer: Weekend Getaway Package — Fri–Sun villa stay + pool + meals from KSh 15,000",cta:"Book now"},
    {type:"Review Response",topic:"Thank you [Guest] for the wonderful 5-star review! We're blessed to have hosted you at CHABBS 🙏"},
  ]
};

const SEO_KEYWORDS_DB=[
  {keyword:"luxury resort lodwar",volume:320,difficulty:22,position:3,trend:"up",category:"Brand"},
  {keyword:"best hotel turkana county",volume:480,difficulty:35,position:7,trend:"up",category:"Location"},
  {keyword:"conference venue lodwar kenya",volume:210,difficulty:18,position:2,trend:"stable",category:"Conference"},
  {keyword:"lodwar accommodation",volume:590,difficulty:28,position:5,trend:"up",category:"Location"},
  {keyword:"ngo accommodation turkana",volume:180,difficulty:15,position:1,trend:"up",category:"NGO"},
  {keyword:"christian resort kenya",volume:260,difficulty:30,position:11,trend:"stable",category:"Brand"},
  {keyword:"turkana county hotels",volume:720,difficulty:42,position:8,trend:"up",category:"Location"},
  {keyword:"lodwar conference hall",volume:150,difficulty:12,position:1,trend:"stable",category:"Conference"},
  {keyword:"team retreat northern kenya",volume:140,difficulty:20,position:6,trend:"up",category:"Corporate"},
  {keyword:"honeymoon lodge turkana",volume:90,difficulty:10,position:4,trend:"up",category:"Romance"},
  {keyword:"pool resort lodwar",volume:110,difficulty:14,position:2,trend:"stable",category:"Amenity"},
  {keyword:"nyama choma lodwar restaurant",volume:170,difficulty:8,position:1,trend:"up",category:"Restaurant"},
];

const INITIAL_SOCIAL_POSTS=[
  {id:1,platform:"Instagram",type:"Reel",content:"Sunrise over Turkana from our pool deck 🌅 The view that keeps our guests coming back.\n\n#CHABBSResort #Turkana #KenyaTravel #DesertLuxury",status:"Published",scheduled:"2026-03-15",engagement:{likes:234,comments:18,shares:45,views:3200},author:"Martha Auma"},
  {id:2,platform:"TikTok",type:"POV Video",content:"POV: You checked into a luxury resort in the middle of Turkana desert 🏜️✨\n\n#TurkanaLuxury #HiddenGemKenya #CHABBSResort",status:"Published",scheduled:"2026-03-14",engagement:{likes:892,comments:67,shares:156,views:12400},author:"Martha Auma"},
  {id:3,platform:"Facebook",type:"Offer Post",content:"🎁 Easter Special: Book 3 nights, get the 4th FREE! Valid April 18–22.\n\nFull Board Package includes all meals + pool access.\n\nBook now: +254 733 100 002",status:"Scheduled",scheduled:"2026-03-25",engagement:{likes:0,comments:0,shares:0,views:0},author:"Aggrey Ochieng"},
  {id:4,platform:"LinkedIn",type:"Article",content:"How CHABBS Resort is setting new standards for hospitality in Northern Kenya. From our mineral-rich borehole water management to solar energy — innovation meets faith.",status:"Draft",scheduled:"",engagement:{likes:0,comments:0,shares:0,views:0},author:"Aggrey Ochieng"},
  {id:5,platform:"Google",type:"GMB Post",content:"Weekend Getaway: Fri-Sun villa stay + pool + 2 meals daily from KSh 15,000. ⭐ 4.8 on Google Reviews",status:"Published",scheduled:"2026-03-12",engagement:{likes:12,comments:3,shares:0,views:890},author:"Martha Auma"},
  {id:6,platform:"Instagram",type:"Carousel",content:"Meet the team that makes CHABBS magic happen ✨\n\nSlide 1: Chef Emmanuel & his legendary breakfast\nSlide 2: Grace keeping our villas spotless\nSlide 3: James ensuring a crystal-clear pool\n\n#TeamCHABBS #HospitalityKenya",status:"Scheduled",scheduled:"2026-03-22",engagement:{likes:0,comments:0,shares:0,views:0},author:"Martha Auma"},
  {id:7,platform:"Twitter",type:"Thread",content:"🧵 Why Lodwar is becoming Kenya's next big travel destination:\n\n1/ Turkana's untouched beauty\n2/ Lake Turkana UNESCO heritage\n3/ Luxury options like @CHABBSResort\n4/ Growing NGO hub = infrastructure boom",status:"Draft",scheduled:"",engagement:{likes:0,comments:0,shares:0,views:0},author:"Aggrey Ochieng"},
];

const INITIAL_SOCIAL_INBOX=[
  {id:1,platform:"Instagram",type:"Comment",author:"@safari_ken",avatar:"🦁",content:"This place looks incredible! How far from Lodwar town is it?",postSnippet:"Sunrise over Turkana from our pool deck 🌅",date:"2026-04-05T08:22:00",sentiment:"positive",replied:false,starred:true},
  {id:2,platform:"TikTok",type:"Comment",author:"@nomad_diary",avatar:"🎒",content:"POV content always works! What camera do you use for these shots?",postSnippet:"POV: You checked into a luxury resort in the middle of Turkana desert",date:"2026-04-05T07:45:00",sentiment:"positive",replied:false,starred:false},
  {id:3,platform:"Facebook",type:"Comment",author:"Grace Mutua",avatar:"👩",content:"We stayed there last Christmas and it was amazing! Book early, fills up fast!",postSnippet:"🎁 Easter Special: Book 3 nights, get the 4th FREE!",date:"2026-04-05T06:30:00",sentiment:"positive",replied:true,starred:false},
  {id:4,platform:"Instagram",type:"DM",author:"@ngo_hq_africa",avatar:"🏢",content:"Hi CHABBS! We have a team of 12 coming to Lodwar for a 2-week assignment. Do you have block booking rates for NGOs?",postSnippet:"Direct Message",date:"2026-04-04T17:10:00",sentiment:"neutral",replied:false,starred:true},
  {id:5,platform:"Google",type:"Review",author:"Dr. Amina Hassan",avatar:"👩‍⚕️",content:"Great villas but WiFi was very slow during our stay. Hope they upgrade soon.",postSnippet:"Google My Business",date:"2026-04-04T14:55:00",sentiment:"mixed",replied:false,starred:false},
  {id:6,platform:"TikTok",type:"Comment",author:"@turkana_explorer",avatar:"🏜️",content:"That pool in the desert is wild! Is it freshwater or saltwater?",postSnippet:"POV: You checked into a luxury resort in the middle of Turkana desert",date:"2026-04-04T12:00:00",sentiment:"positive",replied:false,starred:false},
  {id:7,platform:"Facebook",type:"Comment",author:"Rev. John Kamau",avatar:"⛪",content:"Praise God for a Christian resort in Turkana! We must visit with our church group.",postSnippet:"Easter Sunrise Service at CHABBS Chapel",date:"2026-04-04T09:15:00",sentiment:"positive",replied:true,starred:false},
  {id:8,platform:"LinkedIn",type:"Comment",author:"Sarah Njoroge",avatar:"💼",content:"We're planning a team retreat for 20 staff. What's your corporate package pricing?",postSnippet:"How CHABBS Resort is setting new standards for hospitality",date:"2026-04-03T16:20:00",sentiment:"neutral",replied:false,starred:true},
  {id:9,platform:"Instagram",type:"Mention",author:"@turkana_diaries",avatar:"📸",content:"Just found out about @CHABBSResort — adding this to my Kenya bucket list! 🇰🇪",postSnippet:"Mentioned you in a post",date:"2026-04-03T11:40:00",sentiment:"positive",replied:false,starred:false},
  {id:10,platform:"Google",type:"Review",author:"MSF Field Team Lead",avatar:"🏥",content:"Perfect base for our operations. Clean, quiet, great internet (when it works), and the staff are exceptional. Chef Emmanuel's breakfast is world-class.",postSnippet:"Google My Business",date:"2026-04-02T08:00:00",sentiment:"positive",replied:false,starred:false},
];

const INITIAL_EMAIL_CAMPAIGNS=[
  {id:1,name:"Easter Weekend Special",type:"Promotional",subject:"🐣 Easter at CHABBS — Book 3, Get 4th Night FREE",recipients:148,sent:148,opened:89,clicked:34,status:"Sent",date:"2026-03-18"},
  {id:2,name:"Monthly Newsletter — March",type:"Newsletter",subject:"✟ CHABBS Monthly: New pool activities, Chef's menu & Easter plans",recipients:312,sent:312,opened:178,clicked:67,status:"Sent",date:"2026-03-01"},
  {id:3,name:"NGO Partners Update",type:"Targeted",subject:"Special rates for humanitarian teams — Q2 2026",recipients:45,sent:0,opened:0,clicked:0,status:"Draft",date:""},
  {id:4,name:"Post-Stay Thank You",type:"Automated",subject:"Thank you for staying at CHABBS! 🙏 We'd love your feedback",recipients:0,sent:87,opened:62,clicked:41,status:"Active",date:"Automated"},
  {id:5,name:"Win-Back Campaign",type:"Automated",subject:"We miss you! 🌴 Special return offer from CHABBS Resort",recipients:0,sent:23,opened:12,clicked:5,status:"Active",date:"Automated"},
];

const INITIAL_GUEST_CRM=[
  {id:1,name:"Johnson Family",email:"johnson@email.com",phone:"+254 712 345 678",visits:3,lastVisit:"2026-03-16",totalSpend:144000,segment:"VIP Repeat",loyalty:"Gold",birthday:"",notes:"Prefer Villa 2. Kids love the pool."},
  {id:2,name:"UNICEF Field Team",email:"logistics@unicef.ke",phone:"+254 733 456 789",visits:8,lastVisit:"2026-03-15",totalSpend:672000,segment:"Corporate NGO",loyalty:"Platinum",birthday:"",notes:"Block booking every quarter. Invoice billing."},
  {id:3,name:"Bishop Omondi",email:"eomondi@diocese.org",phone:"+254 722 567 890",visits:5,lastVisit:"2026-03-17",totalSpend:120000,segment:"VIP Repeat",loyalty:"Gold",birthday:"1965-08-12",notes:"Always requests Villa 7. Bring Bible to room."},
  {id:4,name:"MSF Kenya",email:"lodwar@msf.org",phone:"+254 734 333 444",visits:4,lastVisit:"2026-03-18",totalSpend:384000,segment:"Corporate NGO",loyalty:"Gold",birthday:"",notes:"Long stays. Appreciate quiet villas."},
  {id:5,name:"Dr. Amina Hassan",email:"amina.h@email.com",phone:"+254 701 678 901",visits:1,lastVisit:"",totalSpend:0,segment:"New Guest",loyalty:"Bronze",birthday:"1988-03-22",notes:"First-time booker. Referred by UNICEF team."},
  {id:6,name:"Grace Mutua",email:"gmutua@gmail.com",phone:"+254 711 222 333",visits:2,lastVisit:"2026-03-10",totalSpend:36000,segment:"Leisure",loyalty:"Silver",birthday:"1990-11-05",notes:"Weekend getaways. Loves the restaurant."},
];

const AUTOMATION_WORKFLOWS=[
  {id:1,name:"Welcome Email Sequence",trigger:"New booking confirmed",steps:["Send welcome email with check-in guide","Send 'What to pack for Turkana' tips (2 days before)","Send arrival day reminder with directions"],status:"Active",runs:87,icon:"📧"},
  {id:2,name:"Post-Stay Review Request",trigger:"Guest checks out",steps:["Wait 24 hours","Send thank-you + review request email","If no review after 3 days → send reminder","If 5-star → ask for Google review"],status:"Active",runs:62,icon:"⭐"},
  {id:3,name:"Birthday Offer",trigger:"Guest birthday (from CRM)",steps:["Send birthday greeting email","Include 20% discount code for birthday stay","If not redeemed in 30 days → send reminder"],status:"Active",runs:8,icon:"🎂"},
  {id:4,name:"Win-Back Campaign",trigger:"No visit in 90+ days",steps:["Send 'We miss you' email with special offer","If no response in 7 days → send SMS","If no response in 14 days → Martha calls personally"],status:"Active",runs:23,icon:"💌"},
  {id:5,name:"NGO Quarterly Check-in",trigger:"Every 3 months for NGO segment",steps:["Send updated rate card to NGO contacts","Include new conference facility photos","Offer block-booking discounts","If interested → auto-create lead in pipeline"],status:"Active",runs:12,icon:"🤝"},
  {id:6,name:"Social Media Auto-Post",trigger:"Content calendar schedule",steps:["Generate AI caption based on template","Resize images for each platform","Queue post for optimal time","Track engagement metrics after 24h/48h/7d"],status:"Active",runs:156,icon:"📱"},
  {id:7,name:"Guest Satisfaction Alert",trigger:"Feedback rating < 4 stars",steps:["Immediately notify Aggrey Ochieng","Auto-generate apology email draft","Create follow-up task for Martha","Log in quality improvement tracker"],status:"Active",runs:3,icon:"🚨"},
  {id:8,name:"Loyalty Tier Upgrade",trigger:"Guest reaches spending threshold",steps:["Bronze→Silver at KSh 50k lifetime","Silver→Gold at KSh 150k lifetime","Gold→Platinum at KSh 500k lifetime","Send congratulations email with new perks"],status:"Active",runs:14,icon:"🏆"},
];

const SalesMarketingView=({leads,setLeads,packages,setPackages,marketingTasks,setMarketingTasks,bookings,villas,role,socialPosts,setSocialPosts,emailCampaigns,setEmailCampaigns,guestCRM,setGuestCRM,socialInbox,setSocialInbox,settings={}})=>{
  const[sub,setSub]=useState("leads");
  const TABS=[["leads","📊","Leads"],["calendar","📅","Calendar"],["social","📱","Social"],["inbox","📥","Inbox"],["ai","🤖","AI Studio"],["seo","🔍","SEO"],["compete","🏆","Competitors"],["email","📧","Email"],["sms","💬","SMS"],["whatsapp","📲","WhatsApp"],["crm","👥","CRM"],["auto","⚡","Automation"],["reviews","⭐","Reviews"],["qr","🔲","QR Codes"],["revenue","💹","Attribution"],["packages","🎁","Packages"],["analytics","📈","Analytics"],["tasks","✅","Tasks"]];

  // ── LEADS TAB (existing, unchanged) ────────────────────────
  const LeadsTab=()=>{
    const[showForm,setShowForm]=useState(false);const STAGES=["Prospecting","Proposal","Negotiation","Won","Lost"];
    const SOURCES=["Website","Referral","Walk-in","Repeat Guest","Social Media","Phone","Google","Email Campaign"];
    const[form,setForm]=useState({name:"",contact:"",phone:"",email:"",source:"Website",stage:"Prospecting",value:"",notes:""});
    const save=()=>{setLeads(p=>[{id:Date.now(),...form,value:parseInt(form.value)||0,created:new Date().toISOString().split("T")[0],lastContact:new Date().toISOString().split("T")[0]},...p]);setShowForm(false);setForm({name:"",contact:"",phone:"",email:"",source:"Website",stage:"Prospecting",value:"",notes:""});};
    const updateStage=(id,stage)=>setLeads(p=>p.map(l=>l.id===id?{...l,stage,lastContact:new Date().toISOString().split("T")[0]}:l));
    const pipeline=leads.filter(l=>!["Won","Lost"].includes(l.stage)).reduce((s,l)=>s+l.value,0);
    const won=leads.filter(l=>l.stage==="Won").reduce((s,l)=>s+l.value,0);
    const stageColor={Prospecting:"#FF9800",Proposal:"#1565C0",Negotiation:"#6A1B9A",Won:"#2E7D32",Lost:"#9E9E9E"};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#FFF3E0",b:"#FFB74D",tx:C.warning,l:"Pipeline Value",v:`KSh ${pipeline.toLocaleString()}`},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Won Value",v:`KSh ${won.toLocaleString()}`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Active Leads",v:leads.filter(l=>!["Won","Lost"].includes(l.stage)).length},{bg:"#F3E5F5",b:"#CE93D8",tx:"#6A1B9A",l:"Conversion",v:`${leads.length?Math.round((leads.filter(l=>l.stage==="Won").length/leads.length)*100):0}%`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{STAGES.map(st=>(<span key={st} style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:`${stageColor[st]}18`,color:stageColor[st],fontWeight:700}}>{st}: {leads.filter(l=>l.stage===st).length}</span>))}</div><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Lead</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>New Lead</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Organisation"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp}/></Field><Field label="Contact Person"><input value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))} style={inp}/></Field><Field label="Phone"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} style={inp}/></Field><Field label="Email"><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={inp}/></Field><Field label="Source"><select value={form.source} onChange={e=>setForm(p=>({...p,source:e.target.value}))} style={inp}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></Field><Field label="Value (KSh)"><input type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} style={inp}/></Field><Field label="Notes" col="1/-1"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} style={{...inp,resize:"vertical"}}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save Lead</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{leads.map(l=>{const sc=stageColor[l.stage]||C.navy;return(
        <Card key={l.id} style={{borderLeft:`4px solid ${sc}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}><div style={{flex:1}}><div style={{fontSize:15,fontWeight:800,color:C.text}}>{l.name}</div><div style={{fontSize:12,color:C.textL,marginTop:2}}>👤 {l.contact} · 📞 {l.phone}</div>{l.email&&<div style={{fontSize:11,color:C.textL}}>✉️ {l.email}</div>}<div style={{fontSize:12,color:C.textM,marginTop:6,fontStyle:"italic"}}>"{l.notes}"</div><div style={{fontSize:11,color:C.textL,marginTop:4}}>Source: {l.source} · Last contact: {l.lastContact}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:900,color:C.navy}}>KSh {l.value.toLocaleString()}</div><Badge label={l.stage}/>{!["Won","Lost"].includes(l.stage)&&(<div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap",justifyContent:"flex-end"}}>{STAGES.filter(s=>s!==l.stage&&s!=="Lost").map(s=>(<button key={s} onClick={()=>updateStage(l.id,s)} style={{padding:"3px 9px",borderRadius:8,border:`1px solid ${stageColor[s]}`,background:"white",color:stageColor[s],fontSize:10,cursor:"pointer",fontWeight:700}}>→ {s}</button>))}</div>)}</div></div></Card>);})}</div>
    </div>);
  };

  // ── SOCIAL MEDIA HUB ───────────────────────────────────────
  const SocialTab=()=>{
    const[filter,setFilter]=useState("All");
    const PLATFORMS=["All","Instagram","TikTok","Facebook","LinkedIn","Twitter","Google"];
    const platColor={Instagram:"#E1306C",TikTok:"#000000",Facebook:"#1877F2",LinkedIn:"#0A66C2",Twitter:"#1DA1F2",Google:"#4285F4"};
    const platIcon={Instagram:"📸",TikTok:"🎵",Facebook:"📘",LinkedIn:"💼",Twitter:"🐦",Google:"🔍"};
    const filtered=filter==="All"?socialPosts:socialPosts.filter(p=>p.platform===filter);
    const totalEng=socialPosts.reduce((s,p)=>s+p.engagement.likes+p.engagement.comments+p.engagement.shares,0);
    const totalViews=socialPosts.reduce((s,p)=>s+p.engagement.views,0);
    const published=socialPosts.filter(p=>p.status==="Published").length;
    const updateStatus=(id,status)=>setSocialPosts(p=>p.map(sp=>sp.id===id?{...sp,status}:sp));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Published",v:published},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Scheduled",v:socialPosts.filter(p=>p.status==="Scheduled").length},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Total Views",v:totalViews.toLocaleString()},{bg:"#F3E5F5",b:"#CE93D8",tx:"#E1306C",l:"Engagement",v:totalEng.toLocaleString()},{bg:C.sandL,b:C.border,tx:C.navy,l:"Drafts",v:socialPosts.filter(p=>p.status==="Draft").length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      {/* Platform filters */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{PLATFORMS.map(p=>(<button key={p} onClick={()=>setFilter(p)} style={{padding:"7px 14px",borderRadius:20,border:`2px solid ${filter===p?(platColor[p]||C.navy):C.border}`,background:filter===p?(platColor[p]||C.navy):"white",color:filter===p?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:filter===p?700:400}}>{platIcon[p]||"📊"} {p}</button>))}</div>
      {/* Posts */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{filtered.map(post=>{const pc=platColor[post.platform]||C.navy;const eng=post.engagement;const hasEng=eng.views>0;return(
        <Card key={post.id} style={{borderLeft:`4px solid ${pc}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:22}}>{platIcon[post.platform]}</span><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{post.platform} — {post.type}</div><div style={{fontSize:11,color:C.textL}}>👤 {post.author}{post.scheduled&&` · 📅 ${post.scheduled}`}</div></div></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><Badge label={post.status}/>{post.status==="Draft"&&<button onClick={()=>updateStatus(post.id,"Scheduled")} style={{padding:"4px 10px",borderRadius:8,background:pc,color:"white",border:"none",cursor:"pointer",fontSize:10,fontWeight:700}}>📅 Schedule</button>}{post.status==="Scheduled"&&<button onClick={()=>updateStatus(post.id,"Published")} style={{padding:"4px 10px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:10,fontWeight:700}}>🚀 Publish</button>}</div>
          </div>
          <div style={{fontSize:12,color:C.textM,lineHeight:1.7,padding:"10px 12px",background:C.sandL,borderRadius:10,marginBottom:10,whiteSpace:"pre-wrap"}}>{post.content}</div>
          {hasEng&&(<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{[["❤️ Likes",eng.likes],["💬 Comments",eng.comments],["🔄 Shares",eng.shares],["👁 Views",eng.views]].map(([l,v])=>(<div key={l} style={{textAlign:"center",padding:"6px 8px",background:`${pc}08`,borderRadius:8,border:`1px solid ${pc}20`}}><div style={{fontSize:14,fontWeight:900,color:pc}}>{v>=1000?(v/1000).toFixed(1)+"k":v}</div><div style={{fontSize:9,color:C.textL}}>{l}</div></div>))}</div>)}
        </Card>);})}</div>
    </div>);
  };

  // ── AI CONTENT GENERATOR (ENHANCED) ───────────────────────
  const AIContentTab=()=>{
    const[platform,setPlatform]=useState("tiktok");
    const[mode,setMode]=useState("single");
    const[generating,setGenerating]=useState(false);
    const[generated,setGenerated]=useState(null);
    const[bulkResults,setBulkResults]=useState(null);
    const[customTopic,setCustomTopic]=useState("");
    const[tone,setTone]=useState("Warm & Faith-inspired");
    const PLATS=[["tiktok","🎵","TikTok"],["instagram","📸","Instagram"],["facebook","📘","Facebook"],["linkedin","💼","LinkedIn"],["twitter","🐦","Twitter"],["google","🔍","Google"]];
    const TONES=["Warm & Faith-inspired","Professional","Fun & Trendy","Urgent Promo","Storytelling"];
    const modeColor={single:"#7C3AED",bulk:"#1565C0",variants:"#E65100",image:"#2E7D32"};
    const callClaude=async(prompt,maxTok=1500)=>{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":settings.claudeApiKey||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:maxTok,system:"You are the social media manager for CHABBS Resort & Conference Centre in Lodwar, Turkana County, Kenya. Christian-run luxury resort: 10 villas, pool, Chef Emmanuel's famous nyama choma, conference venues, stunning Turkana desert views. Brand voice: warm, faith-inspired, professional yet inviting. Include ✟ or scripture naturally where appropriate.",messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      return data.content?.map(b=>b.text||"").join("\n")||"";
    };
    const generateSingle=async(template)=>{
      setGenerating(true);
      try{
        const text=await callClaude(`Generate a ready-to-post ${platform} ${template?.type||template?.style||"post"} about: "${template?.topic||template?.hook||customTopic||"CHABBS Resort experience"}"\nTone: ${tone}\n\nFormat your response:\n1. 📝 CAPTION (platform-optimized length & style)\n2. #️⃣ HASHTAGS (8-10 relevant)\n3. ⏰ BEST TIME TO POST (EAT timezone)\n4. 💡 ENGAGEMENT TIP\n5. 🎯 CTA\n\nAuthentic — reference real Turkana/Lodwar details, not generic travel copy.`);
        setGenerated({platform,content:text,mode:"single",createdAt:new Date().toISOString()});
      }catch(e){
        setGenerated({platform,content:`[Connect Anthropic API key to enable AI generation]\n\n${template?.hook||template?.topic||customTopic}\n\n${template?.hashtags||"#CHABBSResort #Turkana #KenyaTravel"}\n\n⏰ Post 7-9 AM EAT\n🎯 ${template?.cta||"Book your stay — link in bio"}`,mode:"single",createdAt:new Date().toISOString()});
      }
      setGenerating(false);
    };
    const generateBulk=async()=>{
      if(!customTopic)return;
      setGenerating(true);setBulkResults(null);
      try{
        const text=await callClaude(`Generate ready-to-post content for ALL 6 platforms about: "${customTopic}"\nTone: ${tone}\n\nFor each platform: heading, optimized caption, 5 hashtags, best posting time (EAT).\n\nPlatforms: 🎵 TikTok | 📸 Instagram | 📘 Facebook | 💼 LinkedIn | 🐦 Twitter/X | 🔍 Google Business\n\nConcise, platform-native, authentic. Real Turkana/Lodwar/CHABBS details — no generic travel copy.`,2000);
        setBulkResults({topic:customTopic,content:text,createdAt:new Date().toISOString()});
      }catch(e){
        setBulkResults({topic:customTopic,content:`[Connect Anthropic API key]\n\n🎵 TIKTOK: POV entering a luxury desert resort in Turkana...\n📸 INSTAGRAM: ${customTopic} — Turkana sunsets hit different from our pool deck...\n📘 FACEBOOK: ${customTopic} — Experience CHABBS Resort\n💼 LINKEDIN: Innovation meets faith in Turkana County...\n🐦 TWITTER: ${customTopic} #CHABBSResort #Turkana\n🔍 GOOGLE: Visit us in Lodwar, Kenya`,createdAt:new Date().toISOString()});
      }
      setGenerating(false);
    };
    const generateVariants=async(template)=>{
      setGenerating(true);
      try{
        const text=await callClaude(`Generate 3 DISTINCT variants of a ${platform} post about: "${template?.topic||template?.hook||customTopic||"CHABBS Resort"}"\nTone: ${tone}\n\nLabel clearly:\n🅐 VARIANT A — Aspirational (luxury, desire)\n🅑 VARIANT B — Faith & Story (Christian identity, community)\n🅒 VARIANT C — Curiosity Hook (question, surprise reveal)\n\nEach: distinct hook, caption, hashtags, CTA. Meaningfully different — not just rephrasing.`);
        setGenerated({platform,content:text,mode:"variants",createdAt:new Date().toISOString()});
      }catch(e){
        setGenerated({platform,content:`[Connect Anthropic API key]\n\n🅐 VARIANT A — Aspirational\nPOV: You found the most unexpected luxury in Kenya...\n\n🅑 VARIANT B — Faith & Story\nWhere hospitality meets faith in Turkana desert ✟\n\n🅒 VARIANT C — Curiosity\n3 things no one tells you about staying in Lodwar...`,mode:"variants",createdAt:new Date().toISOString()});
      }
      setGenerating(false);
    };
    const generateImageBrief=async()=>{
      if(!customTopic)return;
      setGenerating(true);
      try{
        const text=await callClaude(`Create a visual content brief for CHABBS Resort photography/video team about: "${customTopic}"\n\nInclude:\n📍 SHOOT LOCATIONS at CHABBS\n🎨 MOOD & AESTHETIC (colors, lighting, vibe)\n📸 SHOT LIST (5 specific shots)\n🎬 VIDEO CLIPS (3 Reels/TikTok ideas)\n👗 STYLING (props, wardrobe, staging)\n🌅 BEST SHOOT TIME (Lodwar light conditions)\n📱 PLATFORM FIT (which shots suit which platform)\n\nContext: Lodwar, Turkana — desert golden hour light, pool as hero asset, Chef Emmanuel's kitchen, luxury villa interiors.`);
        setGenerated({platform:"All",content:text,mode:"image",createdAt:new Date().toISOString()});
      }catch(e){
        setGenerated({platform:"All",content:`[Connect Anthropic API key]\n\n📍 SHOOT LOCATIONS: Pool deck at golden hour, Villa exterior, Chef's kitchen\n🎨 MOOD: Warm terracotta + deep navy, desert luxury\n📸 SHOT LIST:\n1. Pool reflection at dusk\n2. Aerial view of villas + desert\n3. Chef Emmanuel plating nyama choma\n4. Guest silhouette against Turkana sunset\n5. Villa bedroom with Turkana art detail\n🎬 VIDEO: Time-lapse sunrise, pool splash slow-mo, kitchen prep\n👗 STYLING: Natural linens, terracotta accents\n🌅 BEST TIME: 6-8 AM or 5:30-7 PM EAT`,mode:"image",createdAt:new Date().toISOString()});
      }
      setGenerating(false);
    };
    const saveAsPost=()=>{
      if(!generated)return;
      setSocialPosts(p=>[{id:Date.now(),platform:generated.platform.charAt(0).toUpperCase()+generated.platform.slice(1),type:generated.mode==="variants"?"AI Variants":generated.mode==="image"?"Creative Brief":"AI Generated",content:generated.content.slice(0,600),status:"Draft",scheduled:"",engagement:{likes:0,comments:0,shares:0,views:0},author:"AI + Martha Auma"},...p]);
      setGenerated(null);
    };
    const templates=AI_CONTENT_TEMPLATES[platform]||[];
    const runCustom=()=>{if(!customTopic||generating)return;mode==="bulk"?generateBulk():mode==="variants"?generateVariants({topic:customTopic}):mode==="image"?generateImageBrief():generateSingle({topic:customTopic});};
    return(<div>
      {/* Header + mode switcher */}
      <div style={{background:"linear-gradient(135deg,#7C3AED,#4F46E5)",borderRadius:16,padding:"22px 26px",marginBottom:18,color:"white"}}>
        <div style={{fontSize:18,fontWeight:900}}>🤖 AI Content Studio</div>
        <div style={{fontSize:13,opacity:0.85,marginTop:4}}>Powered by Claude AI — single posts · all-platform bulk · A/B variants · creative briefs</div>
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {[["single","✏️ Single Post"],["bulk","⚡ All Platforms"],["variants","🔀 3 Variants"],["image","📸 Image Brief"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setMode(id);setGenerated(null);setBulkResults(null);}} style={{padding:"8px 16px",borderRadius:12,border:"2px solid rgba(255,255,255,0.4)",background:mode===id?"rgba(255,255,255,0.25)":"transparent",color:"white",cursor:"pointer",fontSize:12,fontWeight:mode===id?800:500}}>{label}</button>
          ))}
        </div>
      </div>
      {/* Tone selector */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:700,color:C.textM}}>Tone:</span>
        {TONES.map(t=>(<button key={t} onClick={()=>setTone(t)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${tone===t?"#7C3AED":C.border}`,background:tone===t?"#7C3AED":"white",color:tone===t?"white":C.textM,fontSize:11,cursor:"pointer",fontWeight:tone===t?700:400}}>{t}</button>))}
      </div>
      {/* Platform picker (single / variants) */}
      {(mode==="single"||mode==="variants")&&(
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {PLATS.map(([id,icon,name])=>(<button key={id} onClick={()=>{setPlatform(id);setGenerated(null);}} style={{padding:"8px 14px",borderRadius:12,border:`2px solid ${platform===id?"#7C3AED":C.border}`,background:platform===id?"#7C3AED":"white",color:platform===id?"white":C.textM,cursor:"pointer",fontSize:12,fontWeight:platform===id?800:400}}>{icon} {name}</button>))}
        </div>
      )}
      {/* Template cards */}
      {(mode==="single"||mode==="variants")&&templates.length>0&&(<>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>{mode==="variants"?"🔀 Generate 3 Variants":"⚡ Quick Generate"} — {platform.charAt(0).toUpperCase()+platform.slice(1)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10,marginBottom:18}}>
          {templates.map((t,i)=>(<div key={i} onClick={()=>mode==="variants"?generateVariants(t):generateSingle(t)} style={{background:"white",borderRadius:14,padding:"14px 16px",border:`2px solid ${C.border}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=modeColor[mode]} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{fontSize:13,fontWeight:800,color:C.text}}>{t.style||t.type}</div>
            <div style={{fontSize:12,color:C.textM,lineHeight:1.6,marginTop:4}}>{t.hook||t.topic}</div>
            {t.cta&&<div style={{fontSize:11,color:C.sageD,marginTop:6,fontWeight:700}}>🎯 {t.cta}</div>}
            <div style={{fontSize:10,color:modeColor[mode],marginTop:8,fontWeight:700}}>Click to {mode==="variants"?"generate 3 variants →":"generate →"}</div>
          </div>))}
        </div>
      </>)}
      {/* Custom topic input */}
      <Card style={{marginBottom:16,border:`2px solid ${modeColor[mode]}30`}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>
          {mode==="bulk"?"⚡ Topic for All 6 Platforms":mode==="image"?"📸 Creative Brief Topic":mode==="variants"?"🔀 Custom Variant Topic":"✏️ Custom Topic"}
        </div>
        <div style={{display:"flex",gap:10}}>
          <input value={customTopic} onChange={e=>setCustomTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runCustom()} placeholder={mode==="bulk"?"Enter topic → generates for Instagram, TikTok, Facebook, LinkedIn, Twitter & Google...":mode==="image"?"Describe the visual theme or shoot subject...":"Describe what to post about..."} style={{...inp,flex:1}}/>
          <button onClick={runCustom} disabled={generating||!customTopic} style={{padding:"10px 22px",borderRadius:12,border:"none",background:generating?"#E0E0E0":`linear-gradient(135deg,${modeColor[mode]},${modeColor[mode]}BB)`,color:generating?C.textL:"white",cursor:generating?"wait":"pointer",fontWeight:800,fontSize:13,whiteSpace:"nowrap"}}>
            {generating?"⏳ Generating...":mode==="bulk"?"⚡ All Platforms":mode==="variants"?"🔀 3 Variants":mode==="image"?"📸 Brief":"🤖 Generate"}
          </button>
        </div>
      </Card>
      {/* Bulk output */}
      {bulkResults&&(<Card style={{border:"2px solid #1565C0",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:800,color:"#1565C0"}}>⚡ All-Platform Content — "{bulkResults.topic}"</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSocialPosts(p=>[{id:Date.now(),platform:"Multi-Platform",type:"AI Bulk",content:bulkResults.content.slice(0,600),status:"Draft",scheduled:"",engagement:{likes:0,comments:0,shares:0,views:0},author:"AI + Martha Auma"},...p])} style={{padding:"7px 16px",borderRadius:10,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>💾 Save</button>
            <button onClick={()=>navigator.clipboard?.writeText(bulkResults.content)} style={{padding:"7px 16px",borderRadius:10,background:C.navy,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📋 Copy All</button>
          </div>
        </div>
        <div style={{fontSize:12,color:C.textM,lineHeight:1.8,padding:"14px 16px",background:"#EFF6FF",borderRadius:12,whiteSpace:"pre-wrap",maxHeight:500,overflowY:"auto"}}>{bulkResults.content}</div>
      </Card>)}
      {/* Single / Variants / Image output */}
      {generated&&(<Card style={{border:`2px solid ${modeColor[generated.mode]||"#7C3AED"}`,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:800,color:modeColor[generated.mode]||"#7C3AED"}}>
            {generated.mode==="image"?"📸 Creative Brief":generated.mode==="variants"?"🔀 3 Variants":"✨ Generated Content"} — {generated.platform}
          </div>
          <div style={{display:"flex",gap:8}}>
            {generated.mode!=="image"&&<button onClick={saveAsPost} style={{padding:"7px 16px",borderRadius:10,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>💾 Save as Draft</button>}
            <button onClick={()=>navigator.clipboard?.writeText(generated.content)} style={{padding:"7px 16px",borderRadius:10,background:C.navy,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📋 Copy</button>
          </div>
        </div>
        <div style={{fontSize:12,color:C.textM,lineHeight:1.8,padding:"14px 16px",background:generated.mode==="image"?"#F0FFF4":generated.mode==="variants"?"#FFF8F5":"#F8F5FF",borderRadius:12,whiteSpace:"pre-wrap",maxHeight:500,overflowY:"auto"}}>{generated.content}</div>
      </Card>)}
    </div>);
  };

  // ── SEO DASHBOARD ──────────────────────────────────────────
  const SEOTab=()=>{
    const[catFilter,setCatFilter]=useState("All");
    const CATS=["All","Brand","Location","Conference","Corporate","NGO","Restaurant","Amenity","Romance"];
    const filtered=catFilter==="All"?SEO_KEYWORDS_DB:SEO_KEYWORDS_DB.filter(k=>k.category===catFilter);
    const avgPos=Math.round(SEO_KEYWORDS_DB.reduce((s,k)=>s+k.position,0)/SEO_KEYWORDS_DB.length*10)/10;
    const top3=SEO_KEYWORDS_DB.filter(k=>k.position<=3).length;
    const totalVol=SEO_KEYWORDS_DB.reduce((s,k)=>s+k.volume,0);
    const trendIcon={up:"📈",down:"📉",stable:"➡️"};
    const posColor=p=>p<=3?C.sageD:p<=10?C.info:p<=20?"#F57F17":C.danger;
    return(<div>
      <div style={{background:"linear-gradient(135deg,#1565C0,#0D47A1)",borderRadius:16,padding:"20px 24px",marginBottom:16,color:"white"}}>
        <div style={{fontSize:16,fontWeight:900,marginBottom:10}}>🔍 SEO Performance — CHABBS Resort</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[["Avg Position",avgPos,"#64B5F6"],["Top 3 Keywords",top3,"#81C784"],["Tracked Keywords",SEO_KEYWORDS_DB.length,"#FFE082"],["Monthly Volume",totalVol.toLocaleString(),"#CE93D8"]].map(([l,v,c])=>(<div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"10px"}}><div style={{fontSize:22,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:10,opacity:0.7}}>{l}</div></div>))}
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{CATS.map(c=>(<button key={c} onClick={()=>setCatFilter(c)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${catFilter===c?C.navy:C.border}`,background:catFilter===c?C.navy:"white",color:catFilter===c?"white":C.textM,fontSize:11,cursor:"pointer",fontWeight:catFilter===c?700:400}}>{c}</button>))}</div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"2.5fr 0.8fr 0.8fr 0.8fr 0.6fr 1fr",gap:8,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Keyword","Volume","Difficulty","Position","Trend","Category"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
        {filtered.map((k,i)=>(<div key={k.keyword} style={{display:"grid",gridTemplateColumns:"2.5fr 0.8fr 0.8fr 0.8fr 0.6fr 1fr",gap:8,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text}}>🔑 {k.keyword}</div>
          <div style={{fontSize:12,color:C.textM}}>{k.volume}/mo</div>
          <div><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{flex:1,background:C.sandL,borderRadius:20,height:6,overflow:"hidden"}}><div style={{height:"100%",width:`${k.difficulty}%`,background:k.difficulty<25?C.sageD:k.difficulty<40?"#F57F17":C.danger,borderRadius:20}}/></div><span style={{fontSize:10,color:C.textL}}>{k.difficulty}</span></div></div>
          <div style={{fontSize:14,fontWeight:900,color:posColor(k.position)}}>{k.position}</div>
          <div style={{fontSize:14}}>{trendIcon[k.trend]}</div>
          <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:`${C.navy}10`,color:C.navy,fontWeight:700}}>{k.category}</span>
        </div>))}
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>💡 SEO Recommendations</div>
        {[["Create a blog page on chabbs.co.ke targeting 'best hotel turkana county'","High","Position 7 → aim for Top 3"],["Add schema markup for Hotel, Restaurant, and Event Venue","High","Rich snippets in search results"],["Get 10 more Google Reviews this month (currently 4.8★)","Medium","Social proof + local SEO"],["Create location pages for 'lodwar accommodation' and 'turkana conference'","High","Target 1,180 monthly searches"],["Optimize Google Business Profile with weekly posts","Medium","Already posting — increase frequency"]].map(([rec,pri,impact],i)=>(<div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:10,padding:"3px 8px",borderRadius:8,fontWeight:700,background:pri==="High"?"#FFEBEE":pri==="Medium"?"#FFF8E1":"#E8F5E9",color:pri==="High"?C.danger:pri==="Medium"?"#F57F17":C.sageD,height:"fit-content"}}>{pri}</span>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{rec}</div><div style={{fontSize:11,color:C.textL,marginTop:2}}>📊 {impact}</div></div>
        </div>))}
      </Card>
    </div>);
  };

  // ── EMAIL MARKETING ────────────────────────────────────────
  const EmailTab=()=>{
    const totalSent=emailCampaigns.reduce((s,c)=>s+c.sent,0);const totalOpened=emailCampaigns.reduce((s,c)=>s+c.opened,0);const totalClicked=emailCampaigns.reduce((s,c)=>s+c.clicked,0);
    const openRate=totalSent?Math.round((totalOpened/totalSent)*100):0;const clickRate=totalOpened?Math.round((totalClicked/totalOpened)*100):0;
    const abTests=[
      {id:1,campaign:"Easter Weekend Special",variantA:{subject:"🐣 Easter at CHABBS — Book 3 Get 4th FREE",sent:74,opened:48,clicked:22},variantB:{subject:"Your Easter escape awaits in Turkana ✟",sent:74,opened:41,clicked:12},winner:"A",status:"Complete"},
      {id:2,campaign:"NGO Partners Update",variantA:{subject:"Special rates for humanitarian teams — Q2",sent:0,opened:0,clicked:0},variantB:{subject:"CHABBS Resort NGO Discount: 15% off Full Board",sent:0,opened:0,clicked:0},winner:null,status:"Ready"},
    ];
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Campaigns",v:emailCampaigns.length},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Emails Sent",v:totalSent},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Open Rate",v:`${openRate}%`},{bg:"#F3E5F5",b:"#CE93D8",tx:"#6A1B9A",l:"Click Rate",v:`${clickRate}%`},{bg:C.sandL,b:C.border,tx:C.navy,l:"Subscribers",v:guestCRM.length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      {/* A/B Testing Section */}
      <Card style={{marginBottom:16,border:`2px solid #7C3AED30`}}>
        <div style={{fontSize:14,fontWeight:800,color:"#7C3AED",marginBottom:12}}>🧪 A/B Subject Line Tests</div>
        {abTests.map(t=>{const aRate=t.variantA.sent?Math.round((t.variantA.opened/t.variantA.sent)*100):0;const bRate=t.variantB.sent?Math.round((t.variantB.opened/t.variantB.sent)*100):0;return(
          <div key={t.id} style={{marginBottom:14,padding:"12px 14px",background:C.sandL,borderRadius:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:13,fontWeight:800,color:C.text}}>{t.campaign}</div><Badge label={t.status}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["A",t.variantA,aRate],["B",t.variantB,bRate]].map(([label,v,rate])=>(<div key={label} style={{background:"white",borderRadius:10,padding:"10px 12px",border:`2px solid ${t.winner===label?"#7C3AED":C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:12,fontWeight:800,color:t.winner===label?"#7C3AED":C.navy}}>Variant {label} {t.winner===label?"🏆":""}</span>{v.sent>0&&<span style={{fontSize:12,fontWeight:900,color:t.winner===label?C.sageD:C.textM}}>{rate}% open</span>}</div>
                <div style={{fontSize:11,color:C.textM,lineHeight:1.5}}>📧 {v.subject}</div>
                {v.sent>0&&<div style={{display:"flex",gap:8,marginTop:6,fontSize:10,color:C.textL}}><span>Sent: {v.sent}</span><span>Opened: {v.opened}</span><span>Clicked: {v.clicked}</span></div>}
              </div>))}
            </div>
          </div>);})}
      </Card>
      {/* Campaigns list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{emailCampaigns.map(c=>{const or=c.sent?Math.round((c.opened/c.sent)*100):0;const cr=c.opened?Math.round((c.clicked/c.opened)*100):0;return(
        <Card key={c.id} style={{borderLeft:`4px solid ${c.status==="Sent"?C.sageD:c.status==="Active"?C.info:C.gold}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:8}}>
            <div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{c.name}</div><div style={{fontSize:11,color:C.textL}}>📧 {c.subject}</div><div style={{fontSize:11,color:C.textL,marginTop:3}}>{c.type} · {c.date}</div></div>
            <Badge label={c.status}/>
          </div>
          {c.sent>0&&(<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[["📤 Sent",c.sent],["📬 Opened",`${c.opened} (${or}%)`],["🖱 Clicked",`${c.clicked} (${cr}%)`],["👥 Recipients",c.recipients||c.sent]].map(([l,v])=>(<div key={l} style={{textAlign:"center",padding:"8px",background:C.sandL,borderRadius:8}}><div style={{fontSize:13,fontWeight:800,color:C.navy}}>{v}</div><div style={{fontSize:9,color:C.textL}}>{l}</div></div>))}
          </div>)}
        </Card>);})}</div>
    </div>);
  };

  // ── GUEST CRM ──────────────────────────────────────────────
  const CRMTab=()=>{
    const loyaltyColor={Platinum:"#7C3AED",Gold:"#C9952A",Silver:"#90A4AE",Bronze:"#795548"};
    const segColor={"VIP Repeat":"#6A1B9A","Corporate NGO":"#1565C0",Leisure:"#2E7D32","New Guest":"#FF9800"};
    const totalLifetime=guestCRM.reduce((s,g)=>s+g.totalSpend,0);
    const repeatRate=guestCRM.length?Math.round((guestCRM.filter(g=>g.visits>1).length/guestCRM.length)*100):0;
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#F3E5F5",b:"#CE93D8",tx:"#6A1B9A",l:"Total Guests",v:guestCRM.length},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Repeat Rate",v:`${repeatRate}%`},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Lifetime Value",v:`KSh ${(totalLifetime/1000).toFixed(0)}k`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Avg Visits",v:(guestCRM.reduce((s,g)=>s+g.visits,0)/guestCRM.length).toFixed(1)}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{guestCRM.map(g=>(<Card key={g.id} style={{borderLeft:`4px solid ${loyaltyColor[g.loyalty]||C.navy}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:800,color:C.text}}>{g.name}</div><div style={{fontSize:11,color:C.textL,marginTop:2}}>📞 {g.phone}{g.email&&` · ✉️ ${g.email}`}</div><div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}><span style={{fontSize:10,padding:"3px 10px",borderRadius:10,background:`${loyaltyColor[g.loyalty]}15`,color:loyaltyColor[g.loyalty],fontWeight:800,border:`1px solid ${loyaltyColor[g.loyalty]}30`}}>🏆 {g.loyalty}</span><span style={{fontSize:10,padding:"3px 10px",borderRadius:10,background:`${segColor[g.segment]||C.navy}15`,color:segColor[g.segment]||C.navy,fontWeight:700}}>{g.segment}</span></div>{g.notes&&<div style={{fontSize:11,color:C.textM,marginTop:6,fontStyle:"italic"}}>📝 {g.notes}</div>}</div>
          <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:900,color:C.navy}}>KSh {g.totalSpend.toLocaleString()}</div><div style={{fontSize:11,color:C.textL}}>{g.visits} visit{g.visits!==1?"s":""}</div>{g.lastVisit&&<div style={{fontSize:10,color:C.textL}}>Last: {g.lastVisit}</div>}{g.birthday&&<div style={{fontSize:10,color:C.terra,marginTop:4}}>🎂 {g.birthday}</div>}</div>
        </div>
      </Card>))}</div>
    </div>);
  };

  // ── AUTOMATION WORKFLOWS ───────────────────────────────────
  const AutoTab=()=>{
    const activeCount=AUTOMATION_WORKFLOWS.filter(w=>w.status==="Active").length;const totalRuns=AUTOMATION_WORKFLOWS.reduce((s,w)=>s+w.runs,0);
    return(<div>
      <div style={{background:"linear-gradient(135deg,#FF6F00,#FF9800)",borderRadius:16,padding:"20px 24px",marginBottom:18,color:"white"}}>
        <div style={{fontSize:16,fontWeight:900,marginBottom:6}}>⚡ AI Automation Workflows</div>
        <div style={{fontSize:13,opacity:0.9}}>Automated marketing workflows that run 24/7 to acquire, satisfy, and retain guests</div>
        <div style={{display:"flex",gap:16,marginTop:12}}>{[["Active Workflows",activeCount],["Total Runs",totalRuns],["Time Saved","~40 hrs/mo"]].map(([l,v])=>(<div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 14px"}}><div style={{fontSize:18,fontWeight:900}}>{v}</div><div style={{fontSize:10,opacity:0.8}}>{l}</div></div>))}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
        {AUTOMATION_WORKFLOWS.map(w=>(<Card key={w.id} style={{border:`2px solid ${w.status==="Active"?C.sage:C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{w.icon}</span><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{w.name}</div><div style={{fontSize:11,color:C.textL}}>Trigger: {w.trigger}</div></div></div><Badge label={w.status}/></div>
          <div style={{marginBottom:10}}>{w.steps.map((step,i)=>(<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:4}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:`${C.sage}20`,color:C.sageD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0}}>{i+1}</div>
            <div style={{fontSize:12,color:C.textM,lineHeight:1.6}}>{step}</div>
          </div>))}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.textL}}>⚡ {w.runs} runs total</div>
            <div style={{width:36,height:20,borderRadius:10,background:w.status==="Active"?C.sage:C.border,padding:2,cursor:"pointer"}}><div style={{width:16,height:16,borderRadius:8,background:"white",transform:w.status==="Active"?"translateX(16px)":"translateX(0)",transition:"transform 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></div>
          </div>
        </Card>))}
      </div>
    </div>);
  };

  // ── PACKAGES (existing) ────────────────────────────────────
  const PackagesTab=()=>{
    const toggle=id=>setPackages(p=>p.map(pk=>pk.id===id?{...pk,active:!pk.active}:pk));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {packages.map(pk=>(<Card key={pk.id} style={{opacity:pk.active?1:0.55,border:`2px solid ${pk.active?C.gold:C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:32}}>{pk.icon}</span><div><div style={{fontSize:15,fontWeight:800,color:C.navy}}>{pk.name}</div><Badge label={pk.active?"Active":"Inactive"}/></div></div><div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:900,color:C.sageD}}>KSh {pk.price.toLocaleString()}</div><div style={{fontSize:10,color:C.textL}}>{pk.unit}</div></div></div>
          <div style={{fontSize:12,color:C.textM,lineHeight:1.7,marginBottom:12,padding:"8px 10px",background:C.sandL,borderRadius:8}}>{pk.desc}</div>
          <button onClick={()=>toggle(pk.id)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${pk.active?C.danger:C.sageD}`,background:"white",color:pk.active?C.danger:C.sageD,cursor:"pointer",fontSize:12,fontWeight:700}}>{pk.active?"Deactivate":"Activate"}</button>
        </Card>))}
      </div>
    </div>);
  };

  // ── ANALYTICS (enhanced) ───────────────────────────────────
  const AnalyticsTab=()=>{
    const occ=villas.filter(v=>v.status==="Occupied").length;const occRate=occ*10;
    const totalBookRev=bookings.reduce((s,b)=>s+b.amount,0);
    const leadsBySource={};leads.forEach(l=>{leadsBySource[l.source]=(leadsBySource[l.source]||0)+1;});const maxSrc=Math.max(...Object.values(leadsBySource),1);
    const monthlyRev=[{m:"Jan",v:280000},{m:"Feb",v:320000},{m:"Mar",v:410000}];const maxMR=Math.max(...monthlyRev.map(r=>r.v));
    const socialByPlatform={};socialPosts.forEach(p=>{if(!socialByPlatform[p.platform])socialByPlatform[p.platform]={posts:0,views:0,eng:0};socialByPlatform[p.platform].posts++;socialByPlatform[p.platform].views+=p.engagement.views;socialByPlatform[p.platform].eng+=p.engagement.likes+p.engagement.comments+p.engagement.shares;});
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:C.sandL,b:C.border,tx:C.navy,l:"Occupancy Rate",v:`${occRate}%`},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Booking Revenue",v:`KSh ${totalBookRev.toLocaleString()}`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Active Bookings",v:bookings.filter(b=>b.status==="Checked In").length},{bg:"#F3E5F5",b:"#CE93D8",tx:"#6A1B9A",l:"Social Reach",v:`${(socialPosts.reduce((s,p)=>s+p.engagement.views,0)/1000).toFixed(1)}k`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>📊 Monthly Revenue Trend</div><div style={{display:"flex",alignItems:"flex-end",gap:12,height:100}}>{monthlyRev.map((r,i)=>(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{fontSize:10,fontWeight:700,color:C.sageD}}>KSh {(r.v/1000).toFixed(0)}k</div><div style={{width:"100%",height:`${(r.v/maxMR)*90}%`,background:`linear-gradient(180deg,${C.sage},${C.sageD})`,borderRadius:"4px 4px 0 0",minHeight:8}}/><div style={{fontSize:11,color:C.textL,fontWeight:600}}>{r.m}</div></div>))}</div></Card>
        <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>🎯 Lead Sources</div>{Object.entries(leadsBySource).sort((a,b)=>b[1]-a[1]).map(([src,cnt])=>(<div key={src} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{fontWeight:700,color:C.text}}>{src}</span><span style={{color:C.textL}}>{cnt} lead{cnt!==1?"s":""}</span></div><div style={{background:C.sandL,borderRadius:20,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${(cnt/maxSrc)*100}%`,background:C.terra,borderRadius:20}}/></div></div>))}</Card>
      </div>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>📱 Social Media Performance by Platform</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>{Object.entries(socialByPlatform).map(([plat,data])=>(<div key={plat} style={{padding:"12px 14px",background:C.sandL,borderRadius:12,border:`1px solid ${C.border}`}}><div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:6}}>{plat}</div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textL}}><span>{data.posts} posts</span><span>{data.views.toLocaleString()} views</span></div><div style={{fontSize:12,fontWeight:700,color:C.sageD,marginTop:4}}>💬 {data.eng.toLocaleString()} engagements</div></div>))}</div>
      </Card>
    </div>);
  };

  // ── TASKS (existing) ───────────────────────────────────────
  const TasksTab=()=>{
    const toggle=id=>setMarketingTasks(p=>p.map(t=>t.id===id?{...t,status:t.status==="Complete"?"Pending":"Complete"}:t));
    const pc=p=>p==="High"?C.danger:p==="Medium"?C.warning:C.sageD;
    return(<div>
      <div style={{display:"flex",gap:12,marginBottom:14}}>{[["Pending",marketingTasks.filter(t=>t.status!=="Complete").length,"#FFF3E0","#E65100"],["Complete",marketingTasks.filter(t=>t.status==="Complete").length,"#E8F5E9","#2E7D32"]].map(([l,v,bg,tx])=>(<div key={l} style={{background:bg,borderRadius:12,padding:"10px 14px",border:`1px solid ${tx}30`,textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:tx}}>{v}</div><div style={{fontSize:11,color:C.textL}}>{l}</div></div>))}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>{marketingTasks.map(t=>(<Card key={t.id} style={{borderLeft:`4px solid ${pc(t.priority)}`,opacity:t.status==="Complete"?0.65:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><label style={{display:"flex",gap:10,alignItems:"center",flex:1,cursor:"pointer"}}><input type="checkbox" checked={t.status==="Complete"} onChange={()=>toggle(t.id)} style={{width:18,height:18,accentColor:C.sage,cursor:"pointer"}}/><div><div style={{fontSize:13,fontWeight:700,color:C.text,textDecoration:t.status==="Complete"?"line-through":"none"}}>{t.task}</div><div style={{fontSize:11,color:C.textL}}>👤 {t.owner} · 📅 Due: {t.due}</div></div></label><div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:10,padding:"3px 9px",borderRadius:10,fontWeight:700,background:`${pc(t.priority)}18`,color:pc(t.priority)}}>{t.priority}</span><Badge label={t.status}/></div></div></Card>))}</div>
    </div>);
  };

  // ── CONTENT CALENDAR (Rec #1) ───────────────────────────────
  const CalendarTab=()=>{
    const[month]=useState(2);const MNAMES=["Jan","Feb","Mar","Apr"];const DNAMES=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const firstDay=new Date(2026,month,1).getDay(),dim=new Date(2026,month+1,0).getDate();
    const cells=Array.from({length:firstDay+dim},(_,i)=>i<firstDay?null:i-firstDay+1);
    const getPostsForDay=d=>{const ds=`2026-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;return socialPosts.filter(p=>p.scheduled===ds);};
    const platIcon={Instagram:"📸",TikTok:"🎵",Facebook:"📘",LinkedIn:"💼",Twitter:"🐦",Google:"🔍"};
    const platColor={Instagram:"#E1306C",TikTok:"#000",Facebook:"#1877F2",LinkedIn:"#0A66C2",Twitter:"#1DA1F2",Google:"#4285F4"};
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:800,color:C.navy}}>{MNAMES[month]} 2026 Content Calendar</div>
        <div style={{display:"flex",gap:8}}>{[["Published",socialPosts.filter(p=>p.status==="Published").length,C.sageD],["Scheduled",socialPosts.filter(p=>p.status==="Scheduled").length,"#F57F17"],["Drafts",socialPosts.filter(p=>p.status==="Draft").length,C.info]].map(([l,v,c])=>(<span key={l} style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:`${c}15`,color:c,fontWeight:700}}>{l}: {v}</span>))}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>{DNAMES.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:800,color:C.textL,padding:5,textTransform:"uppercase"}}>{d}</div>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((day,i)=>{if(!day)return<div key={i}/>;const posts=getPostsForDay(day);const isToday=day===18;
          return(<div key={i} style={{minHeight:80,borderRadius:10,padding:"6px 8px",border:`2px solid ${isToday?C.navy:C.border}`,background:isToday?`${C.navy}06`:"white",overflow:"hidden"}}>
            <div style={{fontSize:12,fontWeight:isToday?900:600,color:isToday?C.navy:C.textM,marginBottom:4}}>{day}</div>
            {posts.map((p,pi)=>(<div key={pi} style={{fontSize:8,fontWeight:700,color:"white",background:platColor[p.platform]||C.navy,borderRadius:4,padding:"2px 5px",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{platIcon[p.platform]} {p.type}</div>))}
          </div>);})}
      </div>
      <Card style={{marginTop:14}}><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>📅 Upcoming Scheduled Posts</div>
        {socialPosts.filter(p=>p.status==="Scheduled").map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span>{platIcon[p.platform]}</span><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.platform} — {p.type}</div><div style={{fontSize:10,color:C.textL}}>📅 {p.scheduled} · 👤 {p.author}</div></div></div><Badge label={p.status}/></div>))}
      </Card>
    </div>);
  };

  // ── WHATSAPP BUSINESS (Rec #2) ─────────────────────────────
  const WhatsAppTab=()=>{
    const[msgType,setMsgType]=useState("booking");
    const TEMPLATES=[
      {id:"booking",icon:"📅",name:"Booking Confirmation",msg:"Habari {name}! 🙏\n\nYour booking at CHABBS Resort is confirmed:\n📅 {checkin} → {checkout}\n🏡 {villa}\n💰 {amount}\n\nWe look forward to welcoming you!\n\n✟ CHABBS Resort, Lodwar"},
      {id:"checkin",icon:"🏡",name:"Check-in Reminder",msg:"Welcome to Lodwar, {name}! 🌴\n\nYour villa is ready. Check-in is from 2:00 PM.\n\n📍 CHABBS Resort, off Lodwar-Kakuma Rd\n📞 +254 722 100 001\n\nSafe travels! 🚗"},
      {id:"thankyou",icon:"🙏",name:"Post-Stay Thank You",msg:"Thank you for staying at CHABBS, {name}! 🙏\n\nWe hope you enjoyed your time with us. If you have a moment, we'd love a Google review:\n⭐ [Review Link]\n\nGod bless & see you again soon! ✟"},
      {id:"promo",icon:"🎁",name:"Special Offer",msg:"Hi {name}! 🌟\n\nExclusive for past guests:\n🎁 Weekend Getaway — KSh 15,000\nFri–Sun + Pool + 2 meals daily\n\nBook by March 31!\n📞 +254 733 100 002\n\n✟ CHABBS Resort"},
      {id:"broadcast",icon:"📢",name:"Easter Broadcast",msg:"🐣 Easter at CHABBS Resort!\n\n⛪ Sunrise Service — April 20, 6 AM\n🍽 Easter Brunch — KSh 1,200/person\n🏊 Pool Party — All day!\n\nBook your Easter stay:\n📞 +254 722 100 001\n\nChrist is Risen! ✟"},
    ];
    const sel=TEMPLATES.find(t=>t.id===msgType)||TEMPLATES[0];
    return(<div>
      <div style={{background:"linear-gradient(135deg,#128C7E,#25D366)",borderRadius:16,padding:"20px 24px",marginBottom:18,color:"white"}}>
        <div style={{fontSize:18,fontWeight:900}}>📲 WhatsApp Business Hub</div>
        <div style={{fontSize:13,opacity:0.9,marginTop:4}}>Send booking confirmations, promotions, and guest communications via WhatsApp</div>
        <div style={{display:"flex",gap:12,marginTop:12}}>{[["Guest Contacts",guestCRM.length],["Templates",TEMPLATES.length],["Broadcasts","3/week"]].map(([l,v])=>(<div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 14px"}}><div style={{fontSize:16,fontWeight:900}}>{v}</div><div style={{fontSize:10,opacity:0.8}}>{l}</div></div>))}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{TEMPLATES.map(t=>(<button key={t.id} onClick={()=>setMsgType(t.id)} style={{padding:"8px 14px",borderRadius:12,border:`2px solid ${msgType===t.id?"#128C7E":C.border}`,background:msgType===t.id?"#128C7E":"white",color:msgType===t.id?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:msgType===t.id?700:400}}>{t.icon} {t.name}</button>))}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{border:"2px solid #128C7E30"}}><div style={{fontSize:13,fontWeight:800,color:"#128C7E",marginBottom:10}}>📝 Message Preview</div><div style={{background:"#DCF8C6",borderRadius:12,padding:"14px 16px",fontSize:12,color:"#1A1A1A",lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{sel.msg}</div><div style={{display:"flex",gap:8,marginTop:12}}><button style={{flex:1,padding:"10px",borderRadius:10,background:"#128C7E",color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📲 Send to Guest</button><button onClick={()=>{navigator.clipboard?.writeText(sel.msg);}} style={{padding:"10px 16px",borderRadius:10,background:"white",color:"#128C7E",border:"1px solid #128C7E",cursor:"pointer",fontWeight:700,fontSize:12}}>📋 Copy</button></div></Card>
        <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>👥 Quick Send to Recent Guests</div>{guestCRM.slice(0,5).map(g=>(<div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{g.name}</div><div style={{fontSize:10,color:C.textL}}>📞 {g.phone}</div></div><button style={{padding:"4px 12px",borderRadius:8,background:"#25D366",color:"white",border:"none",cursor:"pointer",fontSize:10,fontWeight:700}}>📲 Send</button></div>))}</Card>
      </div>
    </div>);
  };

  // ── SOCIAL INBOX ───────────────────────────────────────────
  const InboxTab=()=>{
    const[filter,setFilter]=useState("All");
    const[replyingTo,setReplyingTo]=useState(null);
    const[replyText,setReplyText]=useState({});
    const[generating,setGenerating]=useState(null);
    const platColor={Instagram:"#E1306C",TikTok:"#000000",Facebook:"#1877F2",LinkedIn:"#0A66C2",Twitter:"#1DA1F2",Google:"#4285F4"};
    const platIcon={Instagram:"📸",TikTok:"🎵",Facebook:"📘",LinkedIn:"💼",Twitter:"🐦",Google:"🔍"};
    const sentColor={positive:C.sageD,negative:C.danger,mixed:"#F57F17",neutral:C.textM};
    const sentEmoji={positive:"😊",negative:"😞",mixed:"😐",neutral:"🔵"};
    const platforms=["All","Instagram","TikTok","Facebook","LinkedIn","Google"];
    const filtered=filter==="All"?socialInbox:socialInbox.filter(m=>m.platform===filter);
    const unread=socialInbox.filter(m=>!m.replied).length;
    const generateReply=async(item)=>{
      setGenerating(item.id);
      if(replyingTo!==item.id)setReplyingTo(item.id);
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":settings.claudeApiKey||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:250,system:"You are Martha Auma, Sales & Marketing Manager at CHABBS Resort & Conference Centre, Lodwar, Kenya. Reply warmly and professionally with natural faith-inspired language. Keep replies concise and platform-appropriate. Sign off as 'CHABBS Team' or 'Martha' naturally.",messages:[{role:"user",content:`Write a reply to this ${item.type} on ${item.platform} from ${item.author}:\n\n"${item.content}"\n\nContext — they saw: "${item.postSnippet}"\n\nWarm, helpful, authentic reply. If booking question → invite to contact us. If complaint → acknowledge & offer resolution. If positive → thank warmly with faith touch. Under 100 words. No generic filler.`}]})});
        const data=await res.json();
        const reply=data.content?.map(b=>b.text||"").join("")||`Thank you ${item.author}! 🙏 We'd love to welcome you to CHABBS. Please reach us on +254 722 100 001 or WhatsApp. God bless! ✟ — Martha, CHABBS`;
        setReplyText(p=>({...p,[item.id]:reply}));
      }catch(e){
        setReplyText(p=>({...p,[item.id]:`Thank you ${item.author}! 🙏 We'd love to welcome you to CHABBS Resort. Please reach us at +254 722 100 001. God bless! ✟ — Martha, CHABBS`}));
      }
      setGenerating(null);
    };
    const markReplied=(id)=>{
      setSocialInbox(p=>p.map(m=>m.id===id?{...m,replied:true}:m));
      setReplyingTo(null);
      setReplyText(p=>{const n={...p};delete n[id];return n;});
    };
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Needs Reply",v:unread},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Replied",v:socialInbox.filter(m=>m.replied).length},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Starred",v:socialInbox.filter(m=>m.starred).length},{bg:C.sandL,b:C.border,tx:C.navy,l:"Total",v:socialInbox.length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {platforms.map(p=>(<button key={p} onClick={()=>setFilter(p)} style={{padding:"7px 14px",borderRadius:20,border:`2px solid ${filter===p?(platColor[p]||C.navy):C.border}`,background:filter===p?(platColor[p]||C.navy):"white",color:filter===p?"white":C.textM,fontSize:12,cursor:"pointer",fontWeight:filter===p?700:400}}>{platIcon[p]||"📊"} {p}</button>))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(item=>{const pc=platColor[item.platform]||C.navy;const isReplying=replyingTo===item.id;return(
          <Card key={item.id} style={{borderLeft:`4px solid ${item.replied?C.border:pc}`,opacity:item.replied?0.72:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:`${pc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{item.avatar}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:C.text}}>{item.author}</div>
                  <div style={{fontSize:10,color:C.textL}}>{platIcon[item.platform]} {item.platform} · {item.type} · {new Date(item.date).toLocaleDateString("en-KE",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                {item.starred&&<span style={{fontSize:14}}>⭐</span>}
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:`${sentColor[item.sentiment]||C.textM}18`,color:sentColor[item.sentiment]||C.textM}}>{sentEmoji[item.sentiment]} {item.sentiment}</span>
                <Badge label={item.replied?"Replied":"Pending"}/>
              </div>
            </div>
            <div style={{fontSize:10,color:C.textL,padding:"4px 8px",background:C.sandL,borderRadius:6,marginBottom:8}}>↩ Re: "{item.postSnippet}"</div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:10}}>"{item.content}"</div>
            {!item.replied&&(isReplying?(
              <div>
                <textarea value={replyText[item.id]||""} onChange={e=>setReplyText(p=>({...p,[item.id]:e.target.value}))} placeholder="Write or edit your reply..." rows={3} style={{...inp,resize:"vertical",marginBottom:8}}/>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={()=>generateReply(item)} disabled={generating===item.id} style={{padding:"7px 14px",borderRadius:10,border:"none",background:generating===item.id?"#E0E0E0":"linear-gradient(135deg,#7C3AED,#4F46E5)",color:generating===item.id?C.textL:"white",cursor:generating===item.id?"wait":"pointer",fontWeight:700,fontSize:12}}>
                    {generating===item.id?"⏳ Generating...":"🤖 AI Draft Reply"}
                  </button>
                  {replyText[item.id]&&<button onClick={()=>{navigator.clipboard?.writeText(replyText[item.id]);markReplied(item.id);}} style={{padding:"7px 14px",borderRadius:10,border:"none",background:C.sageD,color:"white",cursor:"pointer",fontWeight:700,fontSize:12}}>📋 Copy & Done</button>}
                  <button onClick={()=>markReplied(item.id)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"white",color:C.textM,cursor:"pointer",fontSize:12}}>✅ Mark Done</button>
                  <button onClick={()=>setReplyingTo(null)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"white",color:C.textM,cursor:"pointer",fontSize:12}}>✕ Close</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={()=>generateReply(item)} style={{padding:"7px 14px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#7C3AED,#4F46E5)",color:"white",cursor:"pointer",fontWeight:700,fontSize:12}}>🤖 AI Reply</button>
                <button onClick={()=>setReplyingTo(item.id)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"white",color:C.textM,cursor:"pointer",fontSize:12}}>✏️ Manual Reply</button>
                <button onClick={()=>markReplied(item.id)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"white",color:C.textM,cursor:"pointer",fontSize:12}}>✅ Mark Done</button>
              </div>
            ))}
            {item.replied&&<div style={{fontSize:11,color:C.sageD,fontWeight:700}}>✅ Replied</div>}
          </Card>);
        })}
      </div>
    </div>);
  };

  // ── REVIEW AGGREGATOR (Rec #3) ─────────────────────────────
  const ReviewsTab=()=>{
    const[aiResponses,setAiResponses]=useState({});
    const[generating,setGenerating]=useState(null);
    const reviews=[
      {platform:"Google",icon:"🔍",rating:4.8,count:47,recent:[{guest:"Johnson Family",rating:5,text:"Absolutely stunning villas! Best in Turkana.",date:"2026-03-15"},{guest:"Dr. Grace M.",rating:4,text:"Great place, slightly slow restaurant service.",date:"2026-03-10"}]},
      {platform:"TripAdvisor",icon:"🦉",rating:4.6,count:23,recent:[{guest:"Travel_Ken_2026",rating:5,text:"Hidden gem in the desert. Pool is amazing!",date:"2026-03-12"},{guest:"NGOWorker",rating:4,text:"Perfect for field teams. Clean and comfortable.",date:"2026-03-08"}]},
      {platform:"Booking.com",icon:"🅱",rating:9.1,count:31,recent:[{guest:"Verified Guest",rating:9,text:"Excellent breakfast. Friendly staff. Will return!",date:"2026-03-16"},{guest:"Business Traveller",rating:8,text:"Conference room was well-equipped.",date:"2026-03-05"}]},
    ];
    const generateResponse=async(platform,rev)=>{
      const key=`${platform}-${rev.guest}`;
      setGenerating(key);
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":settings.claudeApiKey||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,system:"You are Aggrey Ochieng, General Manager of CHABBS Resort & Conference Centre, Lodwar, Kenya. Write warm, professional, faith-inspired review responses. Be personal and specific. Sign off as 'Aggrey Ochieng, GM — CHABBS Resort ✟'.",messages:[{role:"user",content:`Write a ${platform} review response for this ${rev.rating<=3?"negative/mixed":"positive"} review from ${rev.guest}:\n\n"${rev.text}"\n\nRating: ${rev.rating}/5 (or ${rev.rating}/10 for Booking.com)\n\nIf positive: thank warmly, invite back, mention a specific detail. If mixed/negative: acknowledge, apologise specifically, explain improvement. Under 80 words.`}]})});
        const data=await res.json();
        const response=data.content?.map(b=>b.text||"").join("")||`Dear ${rev.guest}, thank you so much for your review! 🙏 We are blessed to have hosted you at CHABBS and your feedback means the world to us. We hope to welcome you back soon! God bless, Aggrey Ochieng, GM — CHABBS Resort ✟`;
        setAiResponses(p=>({...p,[key]:response}));
      }catch(e){
        setAiResponses(p=>({...p,[key]:`Dear ${rev.guest}, thank you so much for your kind words! 🙏 It is our joy to serve guests like you. We look forward to welcoming you back to CHABBS Resort. God bless! ✟ — Aggrey Ochieng, GM`}));
      }
      setGenerating(null);
    };
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}}>
        {reviews.map(r=>(<Card key={r.platform} style={{textAlign:"center",border:`2px solid ${C.gold}30`}}>
          <div style={{fontSize:28,marginBottom:6}}>{r.icon}</div>
          <div style={{fontSize:14,fontWeight:800,color:C.navy}}>{r.platform}</div>
          <div style={{fontSize:32,fontWeight:900,color:C.gold,margin:"6px 0"}}>{r.rating}{r.platform==="Booking.com"?"/10":"★"}</div>
          <div style={{fontSize:11,color:C.textL}}>{r.count} reviews</div>
        </Card>))}
      </div>
      {reviews.map(r=>(<Card key={r.platform} style={{marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>{r.icon} {r.platform} — Recent Reviews</div>
        {r.recent.map((rev,i)=>{const key=`${r.platform}-${rev.guest}`;return(<div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{rev.guest}</div><div><span style={{color:"#F9A825"}}>{"★".repeat(Math.min(rev.rating,5))}</span><span style={{fontSize:10,color:C.textL,marginLeft:6}}>{rev.date}</span></div></div>
          <div style={{fontSize:12,color:C.textM,fontStyle:"italic",marginBottom:6}}>"{rev.text}"</div>
          {aiResponses[key]?(
            <div>
              <div style={{fontSize:11,padding:"10px 12px",background:"#F0FFF4",borderRadius:8,border:`1px solid ${C.sage}`,color:C.text,lineHeight:1.7,marginBottom:6}}>{aiResponses[key]}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>navigator.clipboard?.writeText(aiResponses[key])} style={{padding:"4px 10px",borderRadius:7,background:C.navy,color:"white",border:"none",cursor:"pointer",fontSize:10,fontWeight:700}}>📋 Copy</button>
                <button onClick={()=>setAiResponses(p=>{const n={...p};delete n[key];return n;})} style={{padding:"4px 10px",borderRadius:7,background:C.sandL,color:C.textM,border:`1px solid ${C.border}`,cursor:"pointer",fontSize:10}}>↺ Regenerate</button>
              </div>
            </div>
          ):(
            <button onClick={()=>generateResponse(r.platform,rev)} disabled={generating===key} style={{padding:"4px 12px",borderRadius:8,background:generating===key?"#E0E0E0":`${C.navy}10`,color:generating===key?C.textL:C.navy,border:`1px solid ${generating===key?C.border:C.navy}30`,cursor:generating===key?"wait":"pointer",fontSize:10,fontWeight:700}}>
              {generating===key?"⏳ Generating...":"🤖 AI Generate Response"}
            </button>
          )}
        </div>);})}
      </Card>))}
    </div>);
  };

  // ── COMPETITOR SEO (Rec #5) ────────────────────────────────
  const CompetitorTab=()=>{
    const competitors=[
      {name:"Turkwel Lodge",location:"Lodwar",rating:3.9,reviews:18,strengths:["Location near airstrip","Budget pricing"],weaknesses:["No pool","Basic rooms","No conference"]},
      {name:"Nawoitorong Guest House",location:"Lodwar",rating:3.5,reviews:12,strengths:["Central location","Cheap rates"],weaknesses:["No amenities","No restaurant","Basic wifi"]},
      {name:"Desert Rose Lodge",location:"Lokichar",rating:4.1,reviews:8,strengths:["Oil sector clients","Modern build"],weaknesses:["30km from Lodwar","Limited capacity","No conference"]},
    ];
    const chabbs={name:"CHABBS Resort",rating:4.8,reviews:47,strengths:["10 luxury villas","Pool + conference","Full restaurant","Christian identity","NGO partnerships"]};
    const keywordGaps=[
      {keyword:"lodwar boutique hotel",volume:90,competitorRank:"None rank",opportunity:"High"},
      {keyword:"turkana team building",volume:60,competitorRank:"None rank",opportunity:"High"},
      {keyword:"lodwar wedding venue",volume:120,competitorRank:"Desert Rose #8",opportunity:"Medium"},
      {keyword:"northern kenya safari lodge",volume:340,competitorRank:"Multiple rank",opportunity:"Medium"},
      {keyword:"lodwar airport hotel",volume:70,competitorRank:"Turkwel #5",opportunity:"High"},
    ];
    return(<div>
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,borderRadius:16,padding:"20px 24px",marginBottom:18,color:"white"}}>
        <div style={{fontSize:16,fontWeight:900,marginBottom:8}}>🏆 Competitive Analysis — Lodwar/Turkana Market</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[chabbs,...competitors].map(c=>(<div key={c.name} style={{background:c.name==="CHABBS Resort"?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 12px",border:c.name==="CHABBS Resort"?"2px solid rgba(255,255,255,0.3)":"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{fontSize:12,fontWeight:800}}>{c.name}</div>
            <div style={{fontSize:24,fontWeight:900,color:c.rating>=4.5?"#81C784":"#FFE082",marginTop:4}}>{c.rating}★</div>
            <div style={{fontSize:10,opacity:0.7}}>{c.reviews} reviews</div>
          </div>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        {competitors.map(c=>(<Card key={c.name}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:8}}>{c.name} <span style={{fontSize:11,color:C.textL,fontWeight:400}}>· {c.location}</span></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><div style={{fontSize:10,fontWeight:800,color:C.sageD,marginBottom:4}}>STRENGTHS</div>{c.strengths.map(s=>(<div key={s} style={{fontSize:11,color:C.textM,marginBottom:3}}>✅ {s}</div>))}</div><div><div style={{fontSize:10,fontWeight:800,color:C.danger,marginBottom:4}}>WEAKNESSES</div>{c.weaknesses.map(w=>(<div key={w} style={{fontSize:11,color:C.textM,marginBottom:3}}>❌ {w}</div>))}</div></div>
        </Card>))}
      </div>
      <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>🔑 Keyword Gap Opportunities</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 1.5fr 0.8fr",gap:8,padding:"8px 12px",background:`${C.navy}07`,borderRadius:8,marginBottom:6}}>{["Keyword","Volume","Competitor Status","Opportunity"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase"}}>{h}</div>)}</div>
        {keywordGaps.map(k=>(<div key={k.keyword} style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 1.5fr 0.8fr",gap:8,padding:"8px 12px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>🔑 {k.keyword}</div><div style={{fontSize:12,color:C.textM}}>{k.volume}/mo</div><div style={{fontSize:11,color:C.textL}}>{k.competitorRank}</div><span style={{fontSize:10,padding:"3px 8px",borderRadius:8,fontWeight:700,background:k.opportunity==="High"?"#E8F5E9":"#FFF8E1",color:k.opportunity==="High"?C.sageD:"#F57F17"}}>{k.opportunity}</span></div>))}
      </Card>
    </div>);
  };

  // ── SMS MARKETING (Rec #6) ─────────────────────────────────
  const SMSTab=()=>{
    const smsCampaigns=[
      {id:1,name:"Easter Promo Blast",msg:"CHABBS Easter Special! Book 3 nights get 4th FREE. Apr 18-22. Call 0722100001. God bless! ✟",recipients:148,sent:148,delivered:142,status:"Sent",date:"2026-03-18"},
      {id:2,name:"Check-in Reminder",msg:"Hi {name}, your villa at CHABBS is ready! Check-in from 2PM. Safe travels to Lodwar 🌴",recipients:0,sent:23,delivered:23,status:"Automated",date:"Ongoing"},
      {id:3,name:"Feedback Request",msg:"Thank you for staying at CHABBS! Rate us on Google: [link]. Your feedback helps us serve better 🙏",recipients:0,sent:45,delivered:43,status:"Automated",date:"Ongoing"},
      {id:4,name:"NGO Quarterly Rates",msg:"New Q2 rates for NGO teams at CHABBS Resort Lodwar. Full board from KSh 5,525/person/day. Martha: 0733100002",recipients:45,sent:0,delivered:0,status:"Draft",date:""},
    ];
    const totalSent=smsCampaigns.reduce((s,c)=>s+c.sent,0);
    return(<div>
      <div style={{background:"linear-gradient(135deg,#00C853,#009624)",borderRadius:16,padding:"20px 24px",marginBottom:18,color:"white"}}>
        <div style={{fontSize:16,fontWeight:900}}>💬 SMS Marketing — Safaricom Bulk SMS</div>
        <div style={{fontSize:13,opacity:0.9,marginTop:4}}>Reach guests directly via SMS — 98% open rate in Kenya</div>
        <div style={{display:"flex",gap:12,marginTop:12}}>{[["SMS Sent",totalSent],["Delivery Rate","97%"],["Contacts",guestCRM.length],["Cost/SMS","KSh 0.80"]].map(([l,v])=>(<div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 14px"}}><div style={{fontSize:16,fontWeight:900}}>{v}</div><div style={{fontSize:10,opacity:0.8}}>{l}</div></div>))}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{smsCampaigns.map(c=>(<Card key={c.id} style={{borderLeft:`4px solid ${c.status==="Sent"?C.sageD:c.status==="Automated"?C.info:C.gold}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:C.text}}>{c.name}</div><div style={{background:"#F0FFF0",borderRadius:8,padding:"8px 10px",marginTop:8,fontSize:12,color:C.textM,lineHeight:1.6,border:"1px solid #C8E6C9"}}>{c.msg}</div><div style={{fontSize:11,color:C.textL,marginTop:6}}>📱 {c.sent} sent · ✅ {c.delivered} delivered · {c.date}</div></div>
          <Badge label={c.status}/>
        </div>
      </Card>))}</div>
    </div>);
  };

  // ── REVENUE ATTRIBUTION (Rec #7) ──────────────────────────
  const RevenueTab=()=>{
    const channels=[
      {channel:"Google Search (SEO)",bookings:18,revenue:432000,cost:0,icon:"🔍",color:"#4285F4"},
      {channel:"Referrals / Word of Mouth",bookings:12,revenue:288000,cost:0,icon:"🗣",color:"#2E7D32"},
      {channel:"Social Media",bookings:8,revenue:192000,cost:15000,icon:"📱",color:"#E1306C"},
      {channel:"Email Campaigns",bookings:5,revenue:120000,cost:3000,icon:"📧",color:"#FF9800"},
      {channel:"Direct / Walk-in",bookings:4,revenue:96000,cost:0,icon:"🚶",color:"#6A1B9A"},
      {channel:"WhatsApp / SMS",bookings:3,revenue:72000,cost:2400,icon:"📲",color:"#128C7E"},
      {channel:"Booking.com / OTA",bookings:2,revenue:48000,cost:7200,icon:"🌐",color:"#003580"},
    ];
    const totalRev=channels.reduce((s,c)=>s+c.revenue,0);const totalCost=channels.reduce((s,c)=>s+c.cost,0);
    const maxRev=Math.max(...channels.map(c=>c.revenue));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Total Revenue",v:`KSh ${(totalRev/1000).toFixed(0)}k`},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Marketing Cost",v:`KSh ${(totalCost/1000).toFixed(1)}k`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"ROI",v:`${Math.round(((totalRev-totalCost)/Math.max(totalCost,1))*100)}%`},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Total Bookings",v:channels.reduce((s,c)=>s+c.bookings,0)},{bg:C.sandL,b:C.border,tx:C.navy,l:"Top Channel",v:"SEO"}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <Card style={{marginBottom:14}}><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>💹 Revenue by Marketing Channel</div>
        {channels.map(c=>{const roi=c.cost>0?Math.round(((c.revenue-c.cost)/c.cost)*100):null;return(<div key={c.channel} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,marginBottom:4}}>
            <span style={{fontWeight:700,color:C.text}}>{c.icon} {c.channel}</span>
            <div style={{display:"flex",gap:14,fontSize:11,color:C.textL}}><span>{c.bookings} bookings</span><span style={{fontWeight:700,color:C.sageD}}>KSh {c.revenue.toLocaleString()}</span>{c.cost>0&&<span style={{color:C.danger}}>Cost: {c.cost.toLocaleString()}</span>}{roi!==null&&<span style={{color:roi>500?C.sageD:C.info,fontWeight:700}}>ROI: {roi}%</span>}</div>
          </div>
          <div style={{background:C.sandL,borderRadius:20,height:10,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.revenue/maxRev)*100}%`,background:c.color,borderRadius:20}}/></div>
        </div>);})}
      </Card>
    </div>);
  };

  // ── QR CODE GENERATOR (Rec #8) ─────────────────────────────
  const QRTab=()=>{
    const qrCodes=[
      {id:1,name:"Restaurant Menu",desc:"Scan to view full digital menu",url:"https://chabbs.co.ke/menu",icon:"🍽",location:"Restaurant tables",scans:234},
      {id:2,name:"WiFi Login",desc:"Auto-connect to CHABBS-Guest WiFi",url:"WIFI:T:WPA;S:CHABBS-Guest;P:Genesis2v15;;",icon:"📶",location:"All villas & lobby",scans:567},
      {id:3,name:"Google Review",desc:"Leave us a 5-star review",url:"https://g.page/chabbs-resort/review",icon:"⭐",location:"Check-out desk",scans:89},
      {id:4,name:"Guest Feedback",desc:"Quick satisfaction survey",url:"https://chabbs.co.ke/feedback",icon:"📝",location:"Villa rooms",scans:156},
      {id:5,name:"Instagram Follow",desc:"Follow @CHABBSResort",url:"https://instagram.com/chabbsresort",icon:"📸",location:"Pool area",scans:312},
      {id:6,name:"Conference Brochure",desc:"Download our conference packages PDF",url:"https://chabbs.co.ke/conference",icon:"🎪",location:"Reception",scans:78},
      {id:7,name:"WhatsApp Booking",desc:"Chat with us to book",url:"https://wa.me/254722100001",icon:"📲",location:"Marketing materials",scans:145},
      {id:8,name:"Easter Event",desc:"Easter 2026 details & RSVP",url:"https://chabbs.co.ke/easter2026",icon:"🐣",location:"Social media",scans:43},
    ];
    const totalScans=qrCodes.reduce((s,q)=>s+q.scans,0);
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Active QR Codes",v:qrCodes.length},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Total Scans",v:totalScans},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Top Code",v:"WiFi"},{bg:C.sandL,b:C.border,tx:C.navy,l:"Avg Scans/Code",v:Math.round(totalScans/qrCodes.length)}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {qrCodes.map(q=>(<Card key={q.id} style={{border:`2px solid ${C.border}`}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}><div style={{width:56,height:56,borderRadius:12,background:`${C.navy}08`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:`2px solid ${C.navy}15`}}>{q.icon}</div><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{q.name}</div><div style={{fontSize:11,color:C.textL}}>{q.desc}</div></div></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:11,color:C.textL}}>📍 {q.location}</div>
            <div style={{fontSize:13,fontWeight:800,color:C.info}}>{q.scans} scans</div>
          </div>
          <div style={{display:"flex",gap:6}}><button style={{flex:1,padding:"7px",borderRadius:8,background:C.navy,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>📥 Download QR</button><button onClick={()=>{navigator.clipboard?.writeText(q.url);}} style={{padding:"7px 12px",borderRadius:8,background:"white",color:C.navy,border:`1px solid ${C.navy}`,cursor:"pointer",fontSize:11,fontWeight:700}}>📋</button></div>
        </Card>))}
      </div>
    </div>);
  };

  return(<div><SectionTitle title="Sales & Marketing — Digital Command Centre" sub="AI content · Social inbox · SEO · Email · CRM · Automation · Lead pipeline"/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="leads"&&<LeadsTab/>}{sub==="calendar"&&<CalendarTab/>}{sub==="social"&&<SocialTab/>}{sub==="inbox"&&<InboxTab/>}{sub==="ai"&&<AIContentTab/>}{sub==="seo"&&<SEOTab/>}{sub==="compete"&&<CompetitorTab/>}{sub==="email"&&<EmailTab/>}{sub==="sms"&&<SMSTab/>}{sub==="whatsapp"&&<WhatsAppTab/>}{sub==="crm"&&<CRMTab/>}{sub==="auto"&&<AutoTab/>}{sub==="reviews"&&<ReviewsTab/>}{sub==="qr"&&<QRTab/>}{sub==="revenue"&&<RevenueTab/>}{sub==="packages"&&<PackagesTab/>}{sub==="analytics"&&<AnalyticsTab/>}{sub==="tasks"&&<TasksTab/>}</div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── GARDENING & LANDSCAPING VIEW ────────────────────────────
// ═══════════════════════════════════════════════════════════════
const GardeningView=({zones,setZones,gardenTasks,setGardenTasks,plants,setPlants})=>{
  const[sub,setSub]=useState("zones");
  const TABS=[["zones","🗺","Zone Overview"],["tasks","📋","Task Manager"],["plants","🌱","Plant Health"],["protocols","🌡","Turkana Protocols"]];
  const zoneColor={Good:C.sageD,"Needs Care":"#F57F17",Critical:C.danger};

  const ZonesTab=()=>(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
      {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Healthy Zones",v:zones.filter(z=>z.status==="Good").length},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"Needs Care",v:zones.filter(z=>z.status==="Needs Care").length},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Critical",v:zones.filter(z=>z.status==="Critical").length},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Total Zones",v:zones.length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
      {zones.map(z=>{const sc=zoneColor[z.status]||C.sageD;return(
        <Card key={z.id} style={{borderLeft:`4px solid ${sc}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{z.icon}</span><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{z.name}</div><div style={{fontSize:11,color:C.textL}}>{z.area}</div></div></div><Badge label={z.status}/></div>
          <div style={{fontSize:12,color:C.textM,marginBottom:8,lineHeight:1.7}}>{z.notes}</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textL}}><span>Last done: {z.lastDone}</span><span style={{fontWeight:700,color:new Date(z.nextDue)<new Date("2026-03-18")?C.danger:C.sageD}}>Next: {z.nextDue}</span></div>
          <div style={{display:"flex",gap:6,marginTop:10}}>{["Good","Needs Care","Critical"].map(st=>(<button key={st} onClick={()=>setZones(p=>p.map(zz=>zz.id===z.id?{...zz,status:st}:zz))} style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${zoneColor[st]}`,background:z.status===st?`${zoneColor[st]}18`:"white",color:zoneColor[st],fontSize:10,cursor:"pointer",fontWeight:700}}>{st}</button>))}</div>
        </Card>);})}
    </div>
  </div>);

  const TasksTab=()=>{
    const[showForm,setShowForm]=useState(false);const[form,setForm]=useState({zone:"",task:"",priority:"Medium",assignee:"Simon Ewoton"});
    const save=()=>{setGardenTasks(p=>[{id:Date.now(),...form,status:"Pending",due:new Date(Date.now()+2*864e5).toISOString().split("T")[0]},...p]);setShowForm(false);setForm({zone:"",task:"",priority:"Medium",assignee:"Simon Ewoton"});};
    const toggle=id=>setGardenTasks(p=>p.map(t=>t.id===id?{...t,status:t.status==="Complete"?"Pending":"Complete"}:t));
    const pc=p=>p==="High"?C.danger:p==="Medium"?C.warning:C.sageD;
    return(<div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.sageD},${C.sage})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Add Task</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.sage}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Zone"><select value={form.zone} onChange={e=>setForm(p=>({...p,zone:e.target.value}))} style={inp}><option value="">Select zone...</option>{zones.map(z=><option key={z.id}>{z.name}</option>)}</select></Field><Field label="Priority"><select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} style={inp}><option>High</option><option>Medium</option><option>Low</option></select></Field><Field label="Task" col="1/-1"><input value={form.task} onChange={e=>setForm(p=>({...p,task:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.sageD,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>{gardenTasks.map(t=>(<Card key={t.id} style={{borderLeft:`4px solid ${pc(t.priority)}`,opacity:t.status==="Complete"?0.6:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><label style={{display:"flex",gap:10,alignItems:"center",flex:1,cursor:"pointer"}}><input type="checkbox" checked={t.status==="Complete"} onChange={()=>toggle(t.id)} style={{width:18,height:18,accentColor:C.sage,cursor:"pointer"}}/><div><div style={{fontSize:13,fontWeight:700,color:C.text,textDecoration:t.status==="Complete"?"line-through":"none"}}>{t.task}</div><div style={{fontSize:11,color:C.textL}}>🗺 {t.zone} · 👤 {t.assignee} · 📅 {t.due}</div></div></label><div style={{display:"flex",gap:6}}><span style={{fontSize:10,padding:"3px 9px",borderRadius:10,fontWeight:700,background:`${pc(t.priority)}18`,color:pc(t.priority)}}>{t.priority}</span><Badge label={t.status}/></div></div></Card>))}</div>
    </div>);
  };

  const PlantsTab=()=>{
    const hc={Healthy:C.sageD,Stressed:"#F57F17","Needs Care":"#E65100"};
    const updateHealth=(id,h)=>setPlants(p=>p.map(pl=>pl.id===id?{...pl,health:h}:pl));
    const waterPlant=id=>setPlants(p=>p.map(pl=>pl.id===id?{...pl,watered:new Date().toISOString().split("T")[0]}:pl));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
        {plants.map(p=>(<Card key={p.id} style={{borderLeft:`4px solid ${hc[p.health]||C.sageD}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>🌱 {p.name}</div><div style={{fontSize:11,color:C.textL}}>📍 {p.zone} · 💧 Watered: {p.watered}</div></div><Badge label={p.health}/></div>
          <div style={{fontSize:12,color:C.textM,fontStyle:"italic",marginBottom:10}}>{p.notes}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><button onClick={()=>waterPlant(p.id)} style={{padding:"5px 12px",borderRadius:8,background:"#E3F2FD",color:C.info,border:"1px solid #90CAF9",cursor:"pointer",fontSize:11,fontWeight:700}}>💧 Water</button>{["Healthy","Stressed","Needs Care"].map(h=>(<button key={h} onClick={()=>updateHealth(p.id,h)} style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${hc[h]}`,background:p.health===h?`${hc[h]}18`:"white",color:hc[h],fontSize:10,cursor:"pointer",fontWeight:700}}>{h}</button>))}</div>
        </Card>))}
      </div>
    </div>);
  };

  const ProtocolsTab=()=>(<div>
    <div style={{background:"linear-gradient(135deg,#FF6F00,#FF9800)",borderRadius:16,padding:"20px 24px",marginBottom:16,color:"white"}}>
      <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>🌡️ Turkana Hot Season Protocols</div>
      <div style={{fontSize:13,lineHeight:1.8,opacity:0.95}}>Lodwar regularly exceeds 40°C. These protocols protect plants, conserve water, and maintain resort aesthetics during extreme heat.</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {[{title:"🌅 Watering Schedule",icon:"💧",color:C.info,items:["Water ONLY before 6:30 AM or after 6:00 PM","Use drip irrigation where possible","Kitchen garden: twice daily in peak heat","Lawn areas: deep soak 3× per week, not daily","Pool deck pots: check soil daily"]},
        {title:"🌳 Heat Protection",icon:"🏜",color:"#E65100",items:["Apply mulch 3–4 inches around all trees","Install shade nets over kitchen garden","No pruning during heat waves (stress risk)","Move potted plants to shaded areas","Monitor neem trees for heat stress signs"]},
        {title:"♻️ Water Conservation",icon:"🚿",color:C.sageD,items:["Redirect AC condensate to garden beds","Collect kitchen grey water for lawn use","No ornamental sprinklers during drought alerts","Report any leaks or broken pipes immediately","Tank level below 50% = emergency conservation mode"]},
        {title:"🔧 Equipment Care",icon:"⚙️",color:C.navy,items:["Clean mower blades weekly (dust buildup)","Service irrigation valves monthly","Store fuel cans in cool shade — never in sun","Sharpen all cutting tools every 2 weeks","Check drip lines for blockages after dust storms"]}
      ].map(sec=>(<Card key={sec.title}><div style={{fontSize:14,fontWeight:800,color:sec.color,marginBottom:12}}>{sec.title}</div>{sec.items.map((item,i)=>(<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}><span style={{color:sec.color,fontSize:12,marginTop:1}}>•</span><span style={{fontSize:12,color:C.textM,lineHeight:1.6}}>{item}</span></div>))}</Card>))}
    </div>
    <div style={{marginTop:14,padding:"12px 16px",background:`linear-gradient(135deg,${C.navy}08,${C.sage}08)`,borderRadius:12,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:13,fontStyle:"italic",color:C.textM}}>"The Lord God placed man in the Garden of Eden to tend and watch over it." — Genesis 2:15</div></div>
  </div>);

  return(<div><SectionTitle title="Gardening & Landscaping" sub="Zone management, plant health & Turkana protocols"/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="zones"&&<ZonesTab/>}{sub==="tasks"&&<TasksTab/>}{sub==="plants"&&<PlantsTab/>}{sub==="protocols"&&<ProtocolsTab/>}</div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── CONFERENCE & EVENTS VIEW ────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const ConferenceView=({events,setEvents,venues})=>{
  const[sub,setSub]=useState("events");
  const TABS=[["events","📅","Events"],["venues","🏛","Venues"],["equipment","🎛","Equipment"],["catering","🍽","Catering"],["timeline","⏱","Timeline"],["revenue","💰","Revenue"]];

  const EventsTab=()=>{
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({name:"",client:"",phone:"",venue:"Turkana Hall",startDate:"",endDate:"",pax:"",catering:"Full Board",deposit:"",total:"",notes:""});
    const save=()=>{setEvents(p=>[{id:Date.now(),...form,pax:parseInt(form.pax)||0,deposit:parseInt(form.deposit)||0,total:parseInt(form.total)||0,status:"Tentative"},...p]);setShowForm(false);setForm({name:"",client:"",phone:"",venue:"Turkana Hall",startDate:"",endDate:"",pax:"",catering:"Full Board",deposit:"",total:"",notes:""});};
    const updateStatus=(id,st)=>setEvents(p=>p.map(e=>e.id===id?{...e,status:st}:e));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Confirmed",v:events.filter(e=>e.status==="Confirmed").length},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"Tentative",v:events.filter(e=>e.status==="Tentative").length},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Total Events",v:events.length},{bg:C.sandL,b:C.border,tx:C.navy,l:"Total Revenue",v:`KSh ${events.reduce((s,e)=>s+e.total,0).toLocaleString()}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ New Event</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>New Event Booking</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Event Name" col="1/-1"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp}/></Field><Field label="Client"><input value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))} style={inp}/></Field><Field label="Phone"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} style={inp}/></Field><Field label="Venue"><select value={form.venue} onChange={e=>setForm(p=>({...p,venue:e.target.value}))} style={inp}>{venues.map(v=><option key={v.id}>{v.name}</option>)}</select></Field><Field label="Pax"><input type="number" value={form.pax} onChange={e=>setForm(p=>({...p,pax:e.target.value}))} style={inp}/></Field><Field label="Start Date"><input type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))} style={inp}/></Field><Field label="End Date"><input type="date" value={form.endDate} onChange={e=>setForm(p=>({...p,endDate:e.target.value}))} style={inp}/></Field><Field label="Catering"><select value={form.catering} onChange={e=>setForm(p=>({...p,catering:e.target.value}))} style={inp}><option>Full Board</option><option>Tea & Lunch</option><option>Dinner Banquet</option><option>Breakfast</option><option>Self-Catered</option></select></Field><Field label="Deposit (KSh)"><input type="number" value={form.deposit} onChange={e=>setForm(p=>({...p,deposit:e.target.value}))} style={inp}/></Field><Field label="Total (KSh)"><input type="number" value={form.total} onChange={e=>setForm(p=>({...p,total:e.target.value}))} style={inp}/></Field><Field label="Notes" col="1/-1"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} style={{...inp,resize:"vertical"}}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{events.map(ev=>{const venue=venues.find(v=>v.name===ev.venue);return(
        <Card key={ev.id} style={{borderLeft:`4px solid ${ev.status==="Confirmed"?C.sageD:ev.status==="Tentative"?"#F57F17":C.info}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:800,color:C.text}}>{ev.name}</div><div style={{fontSize:12,color:C.textL,marginTop:3}}>👤 {ev.client}{ev.phone&&` · 📞 ${ev.phone}`}</div><div style={{fontSize:12,color:C.textM,marginTop:5}}>{venue?.icon||"🏛"} {ev.venue} · 👥 {ev.pax} pax · 🍽 {ev.catering}</div><div style={{fontSize:11,color:C.textL,marginTop:3}}>📅 {ev.startDate} → {ev.endDate}</div>{ev.notes&&<div style={{fontSize:12,color:C.textM,marginTop:5,fontStyle:"italic"}}>📝 {ev.notes}</div>}</div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:900,color:C.navy}}>KSh {ev.total.toLocaleString()}</div><div style={{fontSize:11,color:C.textL}}>Deposit: KSh {ev.deposit.toLocaleString()}</div><div style={{marginTop:6}}><Badge label={ev.status}/></div>{ev.status!=="Confirmed"&&<button onClick={()=>updateStatus(ev.id,"Confirmed")} style={{marginTop:6,padding:"5px 12px",borderRadius:8,background:C.sageD,color:"white",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>✓ Confirm</button>}</div>
          </div>
        </Card>);})}</div>
    </div>);
  };

  const VenuesTab=()=>(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
      {venues.map(v=>(<Card key={v.id}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}><span style={{fontSize:36}}>{v.icon}</span><div><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:800,color:C.navy}}>{v.name}</div><div style={{fontSize:12,color:C.textL}}>Capacity: {v.capacity} guests</div></div></div>
        <div style={{background:C.sandL,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:10,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Rate</div><div style={{fontSize:20,fontWeight:900,color:C.sageD}}>KSh {v.rate.toLocaleString()}</div></div>
          <div style={{fontSize:11,color:C.textL,textAlign:"right"}}>{v.rateUnit}</div>
        </div>
        <div style={{fontSize:11,fontWeight:800,color:C.navy,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Equipment Included</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{v.equipment.map(eq=>(<span key={eq} style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:`${C.navy}08`,color:C.textM,border:`1px solid ${C.border}`}}>{eq}</span>))}</div>
        <div style={{marginTop:12,fontSize:11,color:C.textL}}>📅 {events.filter(e=>e.venue===v.name).length} event{events.filter(e=>e.venue===v.name).length!==1?"s":""} booked</div>
      </Card>))}
    </div>
  </div>);

  const RevenueTab=()=>{
    const confirmed=events.filter(e=>e.status==="Confirmed");const tentative=events.filter(e=>e.status==="Tentative");
    const confRev=confirmed.reduce((s,e)=>s+e.total,0);const tentRev=tentative.reduce((s,e)=>s+e.total,0);
    const totalDeposit=events.reduce((s,e)=>s+e.deposit,0);const totalBal=events.reduce((s,e)=>s+(e.total-e.deposit),0);
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"Confirmed Revenue",v:`KSh ${confRev.toLocaleString()}`},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"Tentative Revenue",v:`KSh ${tentRev.toLocaleString()}`},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Deposits Received",v:`KSh ${totalDeposit.toLocaleString()}`},{bg:"#FFEBEE",b:"#EF9A9A",tx:C.danger,l:"Balance Due",v:`KSh ${totalBal.toLocaleString()}`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 0.8fr 1fr 1fr 1fr 0.8fr",gap:6,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Event","Venue","Pax","Total","Deposit","Balance","Status"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
        {events.map((ev,i)=>(<div key={ev.id} style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 0.8fr 1fr 1fr 1fr 0.8fr",gap:6,padding:"11px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{ev.name}</div><div style={{fontSize:11,color:C.textM}}>{ev.venue}</div><div style={{fontSize:12,color:C.textM}}>{ev.pax}</div><div style={{fontSize:12,fontWeight:800,color:C.navy}}>KSh {ev.total.toLocaleString()}</div><div style={{fontSize:12,color:C.sageD,fontWeight:700}}>KSh {ev.deposit.toLocaleString()}</div><div style={{fontSize:12,color:ev.total-ev.deposit>0?C.danger:C.sageD,fontWeight:700}}>KSh {(ev.total-ev.deposit).toLocaleString()}</div><Badge label={ev.status}/></div>))}
      </Card>
    </div>);
  };

  const EquipmentTab=()=>{
    // Build equipment index: each piece of equipment and which events use it
    const allEquip={};
    venues.forEach(v=>{v.equipment.forEach(eq=>{if(!allEquip[eq])allEquip[eq]={piece:eq,venue:v.name,events:[]};});});
    events.forEach(ev=>{(ev.equipment||[]).forEach(eq=>{if(allEquip[eq])allEquip[eq].events.push(ev);});});
    // Find conflicts: same equipment booked on overlapping dates
    const hasConflict=(eq)=>{const evs=allEquip[eq]?.events||[];for(let i=0;i<evs.length;i++){for(let j=i+1;j<evs.length;j++){const a=evs[i],b=evs[j];if(a.startDate<=b.endDate&&b.startDate<=a.endDate)return true;}}return false;};
    return(<div>
      <div style={{marginBottom:14,padding:"12px 16px",background:"#E3F2FD",border:"1px solid #90CAF9",borderRadius:12,fontSize:12,color:"#1565C0"}}>
        <strong>Equipment Availability</strong> — Shows all AV equipment per venue, assigned events, and booking conflicts.
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {Object.values(allEquip).map(({piece,venue,events:evs})=>{const conflict=hasConflict(piece);return(
          <Card key={piece} style={{borderLeft:`4px solid ${conflict?"#F44336":evs.length>0?C.navy:C.sageD}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:evs.length>0?10:0}}>
              <div><div style={{fontSize:13,fontWeight:800,color:C.text}}>🎛 {piece}</div><div style={{fontSize:11,color:C.textL,marginTop:2}}>📍 {venue}</div></div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {conflict&&<span style={{fontSize:11,background:"#FFEBEE",color:C.danger,padding:"3px 10px",borderRadius:20,fontWeight:800}}>⚠️ CONFLICT</span>}
                <Badge label={evs.length===0?"Available":`${evs.length} Event${evs.length>1?"s":""}`}/>
              </div>
            </div>
            {evs.length>0&&<div style={{display:"flex",flexDirection:"column",gap:4}}>
              {evs.map(ev=>(<div key={ev.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textM,padding:"5px 10px",background:C.sandL,borderRadius:8}}><span>📅 {ev.startDate}–{ev.endDate}</span><span style={{fontWeight:700,color:C.navy}}>{ev.name}</span><Badge label={ev.status}/></div>))}
            </div>}
          </Card>
        );})}
      </div>
    </div>);
  };

  const CateringTab=()=>{
    const[selEvent,setSelEvent]=useState(events[0]?.id||null);
    const ev=events.find(e=>e.id===selEvent);
    // Per-pax quantities for catering types
    const CATERING_RECIPES={
      "Full Board":[{item:"Tea/Coffee",unit:"cups",perPax:3},{item:"Bread/Mandazi",unit:"pcs",perPax:2},{item:"Eggs",unit:"pcs",perPax:2},{item:"Ugali/Rice",unit:"kg",perPax:0.3},{item:"Stew/Protein",unit:"kg",perPax:0.25},{item:"Vegetables",unit:"kg",perPax:0.15},{item:"Water (500ml)",unit:"bottles",perPax:6},{item:"Cooking Gas",unit:"kg",perPax:0.05}],
      "Tea & Lunch":[{item:"Tea/Coffee",unit:"cups",perPax:2},{item:"Bread/Mandazi",unit:"pcs",perPax:2},{item:"Ugali/Rice",unit:"kg",perPax:0.3},{item:"Stew/Protein",unit:"kg",perPax:0.25},{item:"Vegetables",unit:"kg",perPax:0.15},{item:"Water (500ml)",unit:"bottles",perPax:3}],
      "Dinner Banquet":[{item:"Nyama Choma",unit:"kg",perPax:0.4},{item:"Ugali/Rice",unit:"kg",perPax:0.35},{item:"Salad",unit:"kg",perPax:0.15},{item:"Soft Drinks",unit:"bottles",perPax:2},{item:"Water (500ml)",unit:"bottles",perPax:2},{item:"Dessert",unit:"servings",perPax:1}],
      "Breakfast":[{item:"Tea/Coffee",unit:"cups",perPax:2},{item:"Eggs",unit:"pcs",perPax:2},{item:"Bread/Toast",unit:"pcs",perPax:3},{item:"Fruit",unit:"servings",perPax:1},{item:"Water (500ml)",unit:"bottles",perPax:1}],
      "Self-Catered":[],
    };
    const recipe=CATERING_RECIPES[ev?.catering]||[];
    const pax=ev?.pax||0;
    // Cost estimate per item (rough KSh)
    const UNIT_COST={cups:50,pcs:30,kg:200,bottles:60,servings:150};
    return(<div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:6}}>Select Event</div>
        <select value={selEvent||""} onChange={e=>setSelEvent(parseInt(e.target.value))} style={{...inp,maxWidth:400}}>
          {events.map(e=><option key={e.id} value={e.id}>{e.name} ({e.pax} pax · {e.catering})</option>)}
        </select>
      </div>
      {ev&&<Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div><div style={{fontSize:14,fontWeight:800,color:C.navy}}>{ev.name}</div><div style={{fontSize:12,color:C.textL}}>👥 {pax} guests · 🍽 {ev.catering} · 📅 {ev.startDate}–{ev.endDate}</div></div>
          <Badge label={ev.catering}/>
        </div>
        {recipe.length>0?(<>
          <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>🧮 Quantity Estimate</div>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"8px 14px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Item","Per Person","Total Needed","Est. Cost"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase"}}>{h}</div>)}</div>
            {recipe.map((r,i)=>{const total=Math.ceil(r.perPax*pax);const cost=(UNIT_COST[r.unit]||100)*total;return(<div key={r.item} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"9px 14px",borderBottom:`1px solid ${C.border}`,background:i%2===0?"white":`${C.sand}40`,alignItems:"center"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>{r.item}</div>
              <div style={{fontSize:11,color:C.textM}}>{r.perPax} {r.unit}</div>
              <div style={{fontSize:13,fontWeight:800,color:C.navy}}>{total} {r.unit}</div>
              <div style={{fontSize:12,color:C.sageD,fontWeight:700}}>≈ KSh {cost.toLocaleString()}</div>
            </div>);})}
          </Card>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
            <div style={{background:`${C.navy}08`,borderRadius:10,padding:"10px 16px",textAlign:"right"}}>
              <div style={{fontSize:11,color:C.textL}}>Total Catering Estimate</div>
              <div style={{fontSize:18,fontWeight:900,color:C.navy}}>KSh {recipe.reduce((s,r)=>{const total=Math.ceil(r.perPax*pax);return s+(UNIT_COST[r.unit]||100)*total;},0).toLocaleString()}</div>
            </div>
          </div>
        </>):<div style={{fontSize:13,color:C.textL,padding:"20px",textAlign:"center"}}>Self-catered event — no quantities to estimate.</div>}
      </Card>}
    </div>);
  };

  const TimelineTab=()=>{
    const[selEvent,setSelEvent]=useState(events[0]?.id||null);
    const ev=events.find(e=>e.id===selEvent);
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({time:"09:00",duration:60,title:"",type:"Session"});
    const TYPES=["Setup","Registration","Session","Break","Meal","Teardown"];
    const TYPE_COLORS={Setup:"#9E9E9E",Registration:"#2196F3",Session:C.navy,Break:"#FF9800",Meal:"#4CAF50",Teardown:"#795548"};
    const addBlock=()=>{if(!ev||!form.title)return;setEvents(p=>p.map(e=>e.id===selEvent?{...e,timeline:[...( e.timeline||[]),{id:Date.now(),...form,duration:parseInt(form.duration)||60}]}:e));setShowForm(false);setForm({time:"09:00",duration:60,title:"",type:"Session"});};
    const removeBlock=(tid)=>setEvents(p=>p.map(e=>e.id===selEvent?{...e,timeline:(e.timeline||[]).filter(t=>t.id!==tid)}:e));
    const timeline=(ev?.timeline||[]).slice().sort((a,b)=>a.time.localeCompare(b.time));
    return(<div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:6}}>Select Event</div>
        <select value={selEvent||""} onChange={e=>{setSelEvent(parseInt(e.target.value));setShowForm(false);}} style={{...inp,maxWidth:400}}>
          {events.map(e=><option key={e.id} value={e.id}>{e.name} ({e.startDate})</option>)}
        </select>
      </div>
      {ev&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:14,fontWeight:800,color:C.navy}}>{ev.name}</div><div style={{fontSize:11,color:C.textL}}>📅 {ev.startDate} · 👥 {ev.pax} pax</div></div>
          <button onClick={()=>setShowForm(v=>!v)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>+ Add Block</button>
        </div>
        {showForm&&<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Add Schedule Block</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1fr",gap:10,alignItems:"end"}}><Field label="Time"><input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} style={inp}/></Field><Field label="Duration (min)"><input type="number" value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} style={inp}/></Field><Field label="Title"><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Session title..." style={inp}/></Field><Field label="Type"><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={inp}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></Field></div><div style={{display:"flex",gap:10,marginTop:10}}><button onClick={addBlock} style={{background:C.navy,color:"white",padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700}}>Add</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>}
        {timeline.length===0?(<div style={{textAlign:"center",padding:"30px",color:C.textL,fontSize:13}}>No schedule blocks yet. Add blocks to build the event timeline.</div>):(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {timeline.map(block=>{const endH=parseInt(block.time.split(":")[0])+(Math.floor((parseInt(block.time.split(":")[1])+(block.duration||60))/60));const endM=(parseInt(block.time.split(":")[1])+(block.duration||60))%60;const endTime=`${String(endH).padStart(2,"0")}:${String(endM).padStart(2,"0")}`;return(
              <div key={block.id} style={{display:"flex",gap:12,alignItems:"stretch"}}>
                <div style={{width:60,textAlign:"right",paddingTop:10,flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:800,color:C.navy}}>{block.time}</div>
                  <div style={{fontSize:10,color:C.textL}}>{block.duration}m</div>
                </div>
                <div style={{width:4,background:TYPE_COLORS[block.type]||C.navy,borderRadius:4,flexShrink:0}}/>
                <div style={{flex:1,background:`${TYPE_COLORS[block.type]||C.navy}10`,border:`1px solid ${TYPE_COLORS[block.type]||C.navy}30`,borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{block.title}</div><div style={{fontSize:11,color:C.textL,marginTop:2}}>{block.time} – {endTime} · {block.type}</div></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:`${TYPE_COLORS[block.type]||C.navy}20`,color:TYPE_COLORS[block.type]||C.navy,fontWeight:700}}>{block.type}</span>
                    <button onClick={()=>removeBlock(block.id)} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:16,lineHeight:1,padding:"2px 5px"}} title="Remove">×</button>
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}
      </>}
    </div>);
  };

  return(<div><SectionTitle title="Conference & Events" sub={`${events.length} events · ${venues.length} venues · CHABBS Conference Centre`}/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="events"&&<EventsTab/>}{sub==="venues"&&<VenuesTab/>}{sub==="equipment"&&<EquipmentTab/>}{sub==="catering"&&<CateringTab/>}{sub==="timeline"&&<TimelineTab/>}{sub==="revenue"&&<RevenueTab/>}</div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── LAUNDRY VIEW ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const LaundryView=({laundry,setLaundry})=>{
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({villa:"",guestName:"",items:"",assignee:"Grace Akello",notes:""});
  const save=()=>{setLaundry(p=>[{id:Date.now(),...form,stage:"Collected",collectedAt:new Date().toISOString()},...p]);setShowForm(false);setForm({villa:"",guestName:"",items:"",assignee:"Grace Akello",notes:""});};
  const advance=id=>{setLaundry(p=>p.map(j=>{if(j.id!==id)return j;const idx=LAUNDRY_STAGES.indexOf(j.stage);return idx<LAUNDRY_STAGES.length-1?{...j,stage:LAUNDRY_STAGES[idx+1]}:j;}));};
  const stageColor={Collected:"#FF9800",Washing:"#1565C0",Drying:"#6A1B9A",Folded:"#00796B",Delivered:"#2E7D32"};

  return(<div><SectionTitle title="Laundry Management" sub={`${laundry.filter(j=>j.stage!=="Delivered").length} active jobs · CHABBS Laundry`}/>
    <div style={{background:"linear-gradient(135deg,#E3F2FD,#BBDEFB40)",border:"1px solid #90CAF9",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:12}}><div style={{fontSize:22}}>💧</div><div><div style={{fontSize:13,fontWeight:800,color:C.info}}>Salty Water Laundry Advisory — Lodwar Borehole</div><div style={{fontSize:12,color:"#1565C0",lineHeight:1.7,marginTop:2}}>Use extra rinse cycle for all bed linen. Add fabric softener to counter mineral buildup. Inspect whites for yellowing — treat with vinegar pre-soak if needed.</div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}>
      {LAUNDRY_STAGES.map(st=>(<div key={st} style={{background:`${stageColor[st]}12`,borderRadius:12,padding:"10px 14px",textAlign:"center",border:`1px solid ${stageColor[st]}30`}}><div style={{fontSize:20,fontWeight:900,color:stageColor[st]}}>{laundry.filter(j=>j.stage===st).length}</div><div style={{fontSize:11,color:C.textL}}>{st}</div></div>))}
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ New Laundry Job</button></div>
    {showForm&&(<Card style={{marginBottom:14,border:`2px solid ${C.navy}`}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>New Laundry Job</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Villa / Location"><input value={form.villa} onChange={e=>setForm(p=>({...p,villa:e.target.value}))} style={inp} placeholder="e.g. Villa 2"/></Field><Field label="Guest / Source"><input value={form.guestName} onChange={e=>setForm(p=>({...p,guestName:e.target.value}))} style={inp}/></Field><Field label="Items" col="1/-1"><textarea value={form.items} onChange={e=>setForm(p=>({...p,items:e.target.value}))} rows={2} style={{...inp,resize:"vertical"}} placeholder="List items..."/></Field><Field label="Assignee"><select value={form.assignee} onChange={e=>setForm(p=>({...p,assignee:e.target.value}))} style={inp}><option>Grace Akello</option><option>Sarah Lopeyok</option><option>Mary Wanjiku</option></select></Field><Field label="Notes"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:C.navy,color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{laundry.map(j=>{const idx=LAUNDRY_STAGES.indexOf(j.stage);const pct=((idx+1)/LAUNDRY_STAGES.length)*100;const done=j.stage==="Delivered";return(
      <Card key={j.id} style={{borderLeft:`4px solid ${stageColor[j.stage]}`,opacity:done?0.65:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
          <div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{j.villa}</div><div style={{fontSize:12,color:C.textL}}>👤 {j.guestName} · 🧺 {j.assignee}</div></div>
          <Badge label={j.stage}/>
        </div>
        <div style={{fontSize:12,color:C.textM,marginBottom:8}}>{j.items}</div>
        {j.notes&&<div style={{fontSize:11,color:C.textL,fontStyle:"italic",marginBottom:8}}>📝 {j.notes}</div>}
        {/* Progress bar */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{flex:1,background:C.sandL,borderRadius:20,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${stageColor[LAUNDRY_STAGES[0]]},${stageColor[j.stage]})`,borderRadius:20,transition:"width 0.3s"}}/></div>
          <span style={{fontSize:11,fontWeight:700,color:stageColor[j.stage]}}>{Math.round(pct)}%</span>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{LAUNDRY_STAGES.map((st,si)=>(<span key={st} style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:si<=idx?`${stageColor[st]}20`:C.sandL,color:si<=idx?stageColor[st]:C.textL,fontWeight:si===idx?800:400,border:`1px solid ${si<=idx?stageColor[st]+"40":C.border}`}}>{st}</span>))}</div>
        {!done&&<div style={{marginTop:10,textAlign:"right"}}><button onClick={()=>advance(j.id)} style={{padding:"7px 16px",borderRadius:10,border:"none",background:stageColor[LAUNDRY_STAGES[Math.min(idx+1,4)]],color:"white",cursor:"pointer",fontWeight:700,fontSize:12}}>→ {LAUNDRY_STAGES[Math.min(idx+1,4)]}</button></div>}
      </Card>);})}</div>
  </div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── POOL & RECREATION VIEW ─────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const PoolView=({poolChemistry,setPoolChemistry,poolActivities,setPoolActivities,poolMaintenance,setPoolMaintenance})=>{
  const[sub,setSub]=useState("chemistry");
  const TABS=[["chemistry","🧪","Water Chemistry"],["safety","🛟","Safety Status"],["maintenance","🧹","Maintenance Log"],["guide","🎓","Pool Guide"],["activities","🏊","Activities"]];

  const ChemistryTab=()=>{
    const[showForm,setShowForm]=useState(false);
    const[form,setForm]=useState({date:new Date().toISOString().split("T")[0],time:"08:00",ph:"",chlorine:"",turbidity:"",temp:"",tester:"James Okwany",notes:""});
    const getStatus=(ph,cl)=>{if(ph>=7.2&&ph<=7.6&&cl>=1.0&&cl<=3.0)return"Safe";if(ph>=7.0&&ph<=7.8&&cl>=0.5&&cl<=4.0)return"Caution";return"Unsafe";};
    const save=()=>{const ph=parseFloat(form.ph),cl=parseFloat(form.chlorine);setPoolChemistry(p=>[{id:Date.now(),...form,ph,chlorine:cl,turbidity:parseFloat(form.turbidity)||0,temp:parseInt(form.temp)||28,status:getStatus(ph,cl)},...p]);setShowForm(false);setForm({date:new Date().toISOString().split("T")[0],time:"08:00",ph:"",chlorine:"",turbidity:"",temp:"",tester:"James Okwany",notes:""});};
    const latest=poolChemistry[0]||{};
    const statusBg={Safe:"#E8F5E9",Caution:"#FFF8E1",Unsafe:"#FFEBEE"};const statusTx={Safe:C.sageD,Caution:"#F57F17",Unsafe:C.danger};
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:statusBg[latest.status]||"#F5F5F5",b:C.border,tx:statusTx[latest.status]||C.textL,l:"Pool Status",v:latest.status||"—"},{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"pH Level",v:latest.ph||"—"},{bg:"#FFF8E1",b:"#FFE082",tx:C.gold,l:"Chlorine ppm",v:latest.chlorine||"—"},{bg:C.sandL,b:C.border,tx:C.terra,l:"Temperature",v:`${latest.temp||"—"}°C`}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,#1565C0,#1976D2)`,color:"white",padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Log Reading</button></div>
      {showForm&&(<Card style={{marginBottom:14,border:"2px solid #1565C0"}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Water Chemistry Reading</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><Field label="Date"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={inp}/></Field><Field label="Time"><input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} style={inp}/></Field><Field label="Tested By"><select value={form.tester} onChange={e=>setForm(p=>({...p,tester:e.target.value}))} style={inp}><option>James Okwany</option><option>Peter Kimani</option></select></Field><Field label="pH (7.2–7.6)"><input type="number" step="0.1" value={form.ph} onChange={e=>setForm(p=>({...p,ph:e.target.value}))} style={inp} placeholder="7.4"/></Field><Field label="Chlorine ppm (1–3)"><input type="number" step="0.1" value={form.chlorine} onChange={e=>setForm(p=>({...p,chlorine:e.target.value}))} style={inp} placeholder="1.8"/></Field><Field label="Turbidity NTU"><input type="number" step="0.1" value={form.turbidity} onChange={e=>setForm(p=>({...p,turbidity:e.target.value}))} style={inp} placeholder="0.3"/></Field><Field label="Temp °C"><input type="number" value={form.temp} onChange={e=>setForm(p=>({...p,temp:e.target.value}))} style={inp} placeholder="28"/></Field><Field label="Notes" col="2/-1"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={inp}/></Field></div><div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:"#1565C0",color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div></Card>)}
      <Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr 0.8fr 0.8fr 0.6fr 0.8fr 1fr 1.5fr",gap:6,padding:"10px 16px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`}}>{["Date","Time","pH","Cl ppm","NTU","Temp","Tester","Status"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
        {poolChemistry.map((r,i)=>(<div key={r.id} style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr 0.8fr 0.8fr 0.6fr 0.8fr 1fr 1.5fr",gap:6,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"white":`${C.sand}40`}}><div style={{fontSize:12,fontWeight:700}}>{r.date}</div><div style={{fontSize:12,color:C.textM}}>{r.time}</div><div style={{fontSize:13,fontWeight:800,color:r.ph>=7.2&&r.ph<=7.6?C.sageD:C.danger}}>{r.ph}</div><div style={{fontSize:13,fontWeight:800,color:r.chlorine>=1&&r.chlorine<=3?C.sageD:C.danger}}>{r.chlorine}</div><div style={{fontSize:12,color:C.textM}}>{r.turbidity}</div><div style={{fontSize:12,color:C.textM}}>{r.temp}°C</div><div style={{fontSize:11,color:C.textL}}>{r.tester}</div><Badge label={r.status}/></div>))}
      </Card>
    </div>);
  };

  const SafetyTab=()=>{
    const latest=poolChemistry[0]||{};const isSafe=latest.status==="Safe";
    const[checklist,setChecklist]=useState({lifeguard:true,firstAid:true,signage:true,depth:true,lighting:true,fence:true});
    const allGood=Object.values(checklist).every(Boolean)&&isSafe;
    return(<div>
      <div style={{background:allGood?"linear-gradient(135deg,#2E7D32,#4CAF50)":"linear-gradient(135deg,#C62828,#E53935)",borderRadius:20,padding:"30px 28px",marginBottom:20,textAlign:"center",color:"white",boxShadow:`0 8px 32px ${allGood?"rgba(46,125,50,0.3)":"rgba(198,40,40,0.3)"}`}}>
        <div style={{fontSize:52,marginBottom:8}}>{allGood?"🏊":"⚠️"}</div>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:2}}>{allGood?"POOL OPEN":"POOL CLOSED"}</div>
        <div style={{fontSize:14,opacity:0.85,marginTop:6}}>{allGood?"All safety checks passed — swim safe!":"One or more safety checks have failed"}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>Daily Safety Checklist</div>
          {Object.entries(checklist).map(([k,v])=>{const labels={lifeguard:"Lifeguard / Attendant on Duty",firstAid:"First Aid Kit Stocked",signage:"Pool Rules Signage Visible",depth:"Depth Markers Clear",lighting:"Underwater Lights Working",fence:"Pool Fence & Gate Secure"};return(
            <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}><input type="checkbox" checked={v} onChange={()=>setChecklist(p=>({...p,[k]:!p[k]}))} style={{width:18,height:18,accentColor:C.sage,cursor:"pointer"}}/><span style={{fontSize:13,color:v?C.sageD:C.text,fontWeight:v?400:600,textDecoration:v?"none":"none"}}>{labels[k]}</span>{v&&<span style={{marginLeft:"auto",fontSize:14}}>✅</span>}</label>);})}
        </Card>
        <Card><div style={{fontSize:13,fontWeight:800,color:C.danger,marginBottom:14}}>🚨 Emergency Procedures</div>
          {[{title:"Drowning / Near-Drowning",steps:"1. Alert lifeguard 2. Call for help 3. Attempt rescue with pole/ring 4. Begin CPR if trained 5. Call 999"},
            {title:"Chemical Spill",steps:"1. Evacuate pool area immediately 2. Ventilate area 3. Neutralise with water 4. Call James Okwany"},
            {title:"Injury",steps:"1. Remove from water if needed 2. Apply first aid 3. Call Aggrey +254 722 100 001 4. Document incident"},
            {title:"Lightning / Storm",steps:"1. Clear pool immediately 2. Move to nearest building 3. Wait 30 min after last lightning"}
          ].map(e=>(<div key={e.title} style={{marginBottom:12,padding:"10px 12px",background:"#FFEBEE",borderRadius:10}}><div style={{fontSize:12,fontWeight:800,color:C.danger,marginBottom:4}}>{e.title}</div><div style={{fontSize:11,color:C.textM,lineHeight:1.7}}>{e.steps}</div></div>))}
        </Card>
      </div>
    </div>);
  };

  const ActivitiesTab=()=>{
    const toggle=id=>setPoolActivities(p=>p.map(a=>a.id===id?{...a,active:!a.active}:a));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
        {poolActivities.map(a=>(<Card key={a.id} style={{opacity:a.active?1:0.55,border:`2px solid ${a.active?C.sage:C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{a.icon}</span><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{a.name}</div><div style={{fontSize:12,color:C.textL}}>⏰ {a.time}</div></div></div>
            <Badge label={a.active?"Active":"Inactive"}/>
          </div>
          <div style={{fontSize:12,color:C.textM,marginBottom:10}}>📅 {a.days}</div>
          <button onClick={()=>toggle(a.id)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${a.active?C.danger:C.sageD}`,background:"white",color:a.active?C.danger:C.sageD,cursor:"pointer",fontSize:12,fontWeight:700}}>{a.active?"Disable":"Enable"}</button>
        </Card>))}
      </div>
    </div>);
  };

  const MaintenanceLogTab=()=>{
    const TYPES=["Vacuuming","Chemical Dosing","Backwash","Scrubbing","Skimming","Full Clean","Equipment Check","Other"];
    const TYPE_ICONS={Vacuuming:"🔵",["Chemical Dosing"]:"🧪",Backwash:"🔄",Scrubbing:"🪥",Skimming:"🕸",["Full Clean"]:"✨",["Equipment Check"]:"🔧",Other:"📋"};
    const TYPE_COLORS={Vacuuming:"#1565C0",["Chemical Dosing"]:"#6A1B9A",Backwash:"#00796B",Scrubbing:"#E65100",Skimming:"#0277BD",["Full Clean"]:"#2E7D32",["Equipment Check"]:"#F57F17",Other:"#616161"};
    const[showForm,setShowForm]=useState(false);
    const[filter,setFilter]=useState("All");
    const[form,setForm]=useState({date:"2026-04-13",time:"08:00",type:"Vacuuming",description:"",chemical:"",qty:"",unit:"",doneBy:"James Okwany",duration:"",notes:""});
    const save=()=>{
      setPoolMaintenance(p=>[{id:Date.now(),...form,duration:parseInt(form.duration)||0},...p]);
      setShowForm(false);setForm({date:"2026-04-13",time:"08:00",type:"Vacuuming",description:"",chemical:"",qty:"",unit:"",doneBy:"James Okwany",duration:"",notes:""});
    };
    const filtered=filter==="All"?poolMaintenance:poolMaintenance.filter(m=>m.type===filter);
    // KPI: last 30 days count per type
    const thisMonth=poolMaintenance.filter(m=>m.date>="2026-03-14");
    return(<div>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        {[{bg:"#E3F2FD",b:"#90CAF9",tx:C.info,l:"Total Logged",v:poolMaintenance.length},{bg:"#E8F5E9",b:"#81C784",tx:C.sageD,l:"This Month",v:thisMonth.length},{bg:"#F3E5F5",b:"#CE93D8",tx:"#6A1B9A",l:"Chemical Doses",v:poolMaintenance.filter(m=>m.type==="Chemical Dosing").length},{bg:"#FFF8E1",b:"#FFE082",tx:"#F57F17",l:"Full Cleans",v:poolMaintenance.filter(m=>m.type==="Full Clean").length}].map(s=>(<StatBox key={s.l} {...s} value={s.v} label={s.l}/>))}
      </div>
      {/* Filter + add */}
      <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["All",...TYPES].map(f=>(<button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${filter===f?"#1565C0":C.border}`,background:filter===f?"#1565C0":"white",color:filter===f?"white":C.textM,fontSize:11,cursor:"pointer",fontWeight:filter===f?700:400}}>{TYPE_ICONS[f]||""} {f}</button>))}</div>
        <button onClick={()=>setShowForm(v=>!v)} style={{background:"linear-gradient(135deg,#1565C0,#1976D2)",color:"white",padding:"9px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Log Activity</button>
      </div>
      {/* Form */}
      {showForm&&(<Card style={{marginBottom:14,border:"2px solid #1565C0"}}>
        <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Log Pool Maintenance Activity</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={inp}/></Field>
          <Field label="Time"><input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} style={inp}/></Field>
          <Field label="Done By"><select value={form.doneBy} onChange={e=>setForm(p=>({...p,doneBy:e.target.value}))} style={inp}><option>James Okwany</option><option>Peter Kimani</option><option>Simon Ewoton</option></select></Field>
          <Field label="Activity Type"><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={inp}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></Field>
          <Field label="Duration (min)"><input type="number" value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} style={inp} placeholder="30"/></Field>
          <Field label="Description" col="1/-1"><input value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={inp} placeholder="What was done..."/></Field>
          <Field label="Chemical Used (if any)"><input value={form.chemical} onChange={e=>setForm(p=>({...p,chemical:e.target.value}))} style={inp} placeholder="e.g. Chlorine"/></Field>
          <Field label="Quantity"><input value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))} style={inp} placeholder="e.g. 2"/></Field>
          <Field label="Unit"><input value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))} style={inp} placeholder="Litres / Kg / pcs"/></Field>
          <Field label="Notes" col="1/-1"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={inp}/></Field>
        </div>
        <div style={{display:"flex",gap:10,marginTop:12}}><button onClick={save} style={{background:"#1565C0",color:"white",padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>Save</button><button onClick={()=>setShowForm(false)} style={{background:C.border,color:C.textM,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer"}}>Cancel</button></div>
      </Card>)}
      {/* Log table */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((m,i)=>(
          <Card key={m.id} style={{borderLeft:`4px solid ${TYPE_COLORS[m.type]||"#9E9E9E"}`,padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:16}}>{TYPE_ICONS[m.type]||"📋"}</span>
                  <div style={{fontSize:13,fontWeight:800,color:C.text}}>{m.type}{m.description&&` — ${m.description}`}</div>
                </div>
                <div style={{fontSize:11,color:C.textL,display:"flex",gap:14,flexWrap:"wrap"}}>
                  <span>📅 {m.date} {m.time}</span>
                  <span>👤 {m.doneBy}</span>
                  {m.duration>0&&<span>⏱ {m.duration} min</span>}
                </div>
                {m.chemical&&<div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:6,background:"#F3E5F5",border:"1px solid #CE93D8",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#6A1B9A",fontWeight:700}}>🧪 {m.chemical}{m.qty&&` · ${m.qty} ${m.unit}`}</div>}
                {m.notes&&<div style={{fontSize:11,color:C.textM,marginTop:6,fontStyle:"italic"}}>📝 {m.notes}</div>}
              </div>
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:`${TYPE_COLORS[m.type]||"#9E9E9E"}15`,color:TYPE_COLORS[m.type]||"#616161",fontWeight:700,border:`1px solid ${TYPE_COLORS[m.type]||"#9E9E9E"}30`,whiteSpace:"nowrap"}}>{m.type}</span>
            </div>
          </Card>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"30px",color:C.textL,fontSize:13}}>No maintenance activities logged yet.</div>}
      </div>
    </div>);
  };

  const PoolGuideTab=()=>{
    const[section,setSection]=useState("today");
    const SECTIONS=[["today","📋","Today's Routine"],["week","📅","Weekly Plan"],["diagnose","🎨","Diagnose"],["dosing","⚗️","Dosing Guide"],["valves","⚙️","Valve Guide"],["emergency","🆘","Emergency"],["tips","💡","Pro Tips"]];
    const hr=new Date().getHours()+new Date().getMinutes()/60;
    const DAILY=[
      {time:"6:00 AM",hr:6,end:6.5,task:"🔍 Pool Inspection",detail:"Walk around the pool. Check water colour, smell, wall texture (run your hand along the wall — smooth is good), floor visibility, all jets, water level and pump area. This 10-minute check catches 90% of problems early.",valve:"Pump OFF"},
      {time:"6:30 AM",hr:6.5,end:7,task:"🧪 Test Chlorine & pH",detail:"Use the test kit. Record Free Chlorine (target: 2–3 ppm) and pH (target: 7.2–7.4). If chlorine is low, plan to add 150–200 g at sunset. If pH is off, add pH Minus (too high) or soda ash (too low) now.",valve:"Pump OFF"},
      {time:"7:00 AM",hr:7,end:11,task:"🍃 Skim Surface & Start Pump",detail:"Net all surface debris — leaves, insects, dust. Then set valve to FILTER and start pump. Never start the pump with the valve in any position other than FILTER.",valve:"FILTER → ON"},
      {time:"7:00–11:00 AM",hr:7,end:11,task:"💨 Morning Filtration (4 hrs)",detail:"Pump runs continuously. Monitor water clarity. Brush walls if they feel slippery. Do NOT switch the pump off early during this window.",valve:"FILTER ON"},
      {time:"11:00 AM",hr:11,end:18.5,task:"⚙️ Stop Pump — Midday Rest",detail:"Turn pump off to save electricity during peak heat. Pool can rest up to 4 hours maximum. Do NOT add any chemicals during this break.",valve:"Pump OFF"},
      {time:"After 6:30 PM",hr:18.5,end:22,task:"☀️ Add Chlorine & Restart Pump",detail:"Dissolve 150–200 g of Chlorine 90 in a bucket of water first — NEVER add dry granules directly. Pour near the return jets. Set valve to FILTER. Start pump. Adding at sunset is 3× more effective as sunlight cannot destroy it overnight.",valve:"FILTER → ON"},
      {time:"6:30–10:00 PM",hr:18.5,end:22,task:"💨 Evening Filtration (3.5 hrs)",detail:"Pump runs and chlorine circulates all night. This is the most effective window. Total daily pump run should be 8–10 hours.",valve:"FILTER ON"},
      {time:"10:00 PM",hr:22,end:30,task:"⚙️ Stop Pump — End of Day",detail:"Turn pump off. Record total pump hours in the maintenance log. The chlorine added at sunset will protect the pool through the night. Total daily run: 8–10 hours.",valve:"FILTER OFF"},
    ];
    const nextIdx=DAILY.findIndex(t=>hr<t.end);
    const COLORS=[
      {id:"blue",col:"#1a9fd4",label:"Crystal clear blue",meaning:"Perfect",sev:"good",action:"All good — maintain the daily routine. Continue 150–200 g chlorine at sunset. Well done!"},
      {id:"hazy",col:"#8ac4d0",label:"Slightly dull / hazy",meaning:"Low chlorine",sev:"warn",action:"Add 150–200 g Chlorine 90 dissolved in a bucket tonight at sunset. Test again tomorrow morning. If still hazy, increase to 250 g."},
      {id:"cloudy",col:"#cfd8dc",label:"Cloudy white",meaning:"Fine particles / pH off",sev:"warn",action:"Test pH first (target 7.2–7.4). Then add Sparkle-it clarifier 1–2 L near return jets. Run pump 8–12 hrs. Do NOT overdose Sparkle-it — it will make it worse."},
      {id:"lgn",col:"#85b865",label:"Light green",meaning:"Early algae — act now",sev:"danger",action:"Brush ALL walls and floor now. Tonight at sunset: dissolve 3–4 kg Chlorine 90 in a bucket and pour near jets. Run pump continuously for 12–18 hrs. Follow the 9-step recovery in Emergency tab."},
      {id:"dgn",col:"#2d7a3a",label:"Dark green",meaning:"Full algae bloom — CLOSE POOL",sev:"critical",action:"Close pool immediately. Follow the full 9-step recovery in the Emergency tab. This will cost KSh 2,000–4,000 and 24–72 hrs of electricity. Prevention is always 5× cheaper."},
      {id:"yel",col:"#cfc249",label:"Yellow / dusty floor",meaning:"Mustard algae or mineral dust",sev:"warn",action:"Brush the floor very hard. Shock with 3 kg chlorine tonight. Set valve to WASTE and vacuum the floor (do NOT use FILTER — algae will recirculate). Backwash filter immediately after."},
      {id:"red",col:"#b04040",label:"Reddish or brown tinge",meaning:"Iron from borehole water",sev:"danger",action:"⛔ Do NOT shock or add chlorine yet — it will make it worse. Add a metal sequestrant product first. Run pump 8 hrs. Then balance chemistry normally before resuming chlorine."},
    ];
    const[waterCol,setWaterCol]=useState(null);const[wallFeel,setWallFeel]=useState(null);
    const sevBg={good:"#E8F5E9",warn:"#FFF3E0",danger:"#FFEBEE",critical:"#FFEBEE"};
    const sevTx={good:"#2E7D32",warn:"#E65100",danger:"#C62828",critical:"#B71C1C"};
    const DOSES=[
      {id:"daily",label:"☀️ Daily maintenance",cl:"150–200 g",alg:"—",sp:"—",ph:"Only if pH >7.6",pump:"8–10 hrs"},
      {id:"weekly",label:"📅 Weekly maintenance",cl:"—",alg:"4–5 L",sp:"1–1.5 L",ph:"If pH is high",pump:"8 hrs"},
      {id:"shock2wk",label:"⚡ Preventive shock (every 2 wks)",cl:"2–3 kg",alg:"—",sp:"—",ph:"If pH >7.4",pump:"Overnight"},
      {id:"cloudy",label:"☁️ Cloudy white water",cl:"1–2 kg",alg:"—",sp:"1–2 L",ph:"Check first",pump:"8–12 hrs"},
      {id:"lgn",label:"🟢 Light green water",cl:"3–4 kg",alg:"4–5 L (24 hrs after Cl)",sp:"2 L (after algicide)",ph:"If pH >7.4",pump:"12–18 hrs continuous"},
      {id:"dgn",label:"🌿 Dark green / algae bloom",cl:"4–5 kg",alg:"5 L (24 hrs after Cl)",sp:"2–3 L (after algicide)",ph:"If pH >7.4",pump:"24 hrs continuous"},
    ];
    const[situation,setSituation]=useState("daily");
    const dose=DOSES.find(d=>d.id===situation);
    return(<div>
      {/* Section nav pill bar */}
      <div style={{background:"linear-gradient(135deg,#E3F2FD,#E8F5F9)",border:"1px solid #90CAF9",borderRadius:14,padding:"12px 14px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:800,color:"#0d47a1",marginBottom:8}}>🎓 Pool Operations Guide — Step-by-step knowledge for every situation</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {SECTIONS.map(([id,icon,label])=>(
            <button key={id} onClick={()=>setSection(id)} style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${section===id?"#1565C0":C.border}`,background:section===id?"#1565C0":"white",color:section===id?"white":C.textM,fontSize:11,cursor:"pointer",fontWeight:section===id?700:400}}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* TODAY'S ROUTINE */}
      {section==="today"&&<div>
        {nextIdx>=0&&<div style={{background:"linear-gradient(135deg,#0d47a1,#1565C0)",borderRadius:16,padding:"16px 20px",marginBottom:16,color:"white"}}>
          <div style={{fontSize:10,opacity:0.7,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>👆 Your Next Task Right Now</div>
          <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>{DAILY[nextIdx].task}</div>
          <div style={{fontSize:13,opacity:0.88,lineHeight:1.75,marginBottom:10}}>{DAILY[nextIdx].detail}</div>
          <span style={{background:"rgba(255,255,255,0.18)",borderRadius:20,padding:"4px 13px",fontSize:11,fontWeight:700}}>⏰ {DAILY[nextIdx].time} · 🔧 {DAILY[nextIdx].valve}</span>
        </div>}
        {nextIdx===-1&&<div style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",borderRadius:16,padding:"16px 20px",marginBottom:16,color:"white",textAlign:"center"}}><div style={{fontSize:28,marginBottom:8}}>🌙</div><div style={{fontSize:18,fontWeight:900}}>All Done for Today!</div><div style={{fontSize:13,opacity:0.85,marginTop:6}}>Pool is protected overnight. Resume inspection at 6:00 AM tomorrow.</div></div>}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {DAILY.map((t,i)=>{const isPast=hr>=t.end&&i!==DAILY.length-1;const isNow=i===nextIdx;return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",borderRadius:12,border:`2px solid ${isNow?"#1565C0":isPast?C.border+"50":"#B0BEC5"}`,background:isNow?"#E3F2FD":isPast?`${C.sand}50`:"white",opacity:isPast?0.5:1,transition:"all 0.2s"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:isNow?"#1565C0":isPast?"#81C784":"#B0BEC5",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,flexShrink:0,marginTop:1}}>
                {isPast?"✓":i+1}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:isNow?6:0}}>
                  <div style={{fontSize:13,fontWeight:800,color:isNow?"#1565C0":C.text}}>{t.task}</div>
                  <div style={{fontSize:10,color:C.textL,fontWeight:700}}>{t.time}</div>
                </div>
                {(isNow||(!isPast&&i!==nextIdx+1))&&false}
                {isNow&&<div style={{fontSize:12,color:"#0d47a1",lineHeight:1.75}}>{t.detail}</div>}
                <div style={{marginTop:5,display:"inline-block",background:isNow?"#1565C015":C.sandL,borderRadius:20,padding:"2px 10px",fontSize:10,color:isNow?"#1565C0":C.textL,fontWeight:700}}>🔧 {t.valve}</div>
              </div>
            </div>
          );})}
        </div>
        <div style={{marginTop:14,padding:"12px 16px",background:"#FFF8E1",borderRadius:12,border:"1px solid #FFE082",fontSize:12,color:"#E65100",lineHeight:1.75}}>
          <strong>💰 Cost Reality Check:</strong> Daily 150–200 g chlorine = <strong>KSh 50–80/day</strong>. One full algae bloom recovery = <strong>KSh 2,000–4,000 + 24–72 hrs electricity</strong>. Prevention is <strong>always 5× cheaper</strong>.
        </div>
      </div>}

      {/* WEEKLY PLAN */}
      {section==="week"&&<div>
        {[["Mon","Monday",[" Vacuum floor","Test Cl + pH","Daily routine"]],["Tue","Tuesday",[" Brush all walls"," Brush corners & steps","Daily routine"]],["Wed","Wednesday",[" Add Algicure 4–5 L","Full chemistry test (all 6 params)","Daily routine"]],["Thu","Thursday",[" Vacuum floor","Test Cl + pH","Daily routine"]],["Fri","Friday",[" Brush steps & corners","Test Cl + pH","Daily routine"]],["Sat","Saturday",[" Add Sparkle-it 1–1.5 L (near return jets)","Test Cl + pH","Daily routine"]],["Sun","Sunday ⭐",["Backwash 5 min → Rinse 1 min → FILTER","Clean pump basket & strainer","Daily routine"]]].map(([abbr,dayFull,tasks])=>{
          const todayAbbr=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];const isToday=abbr===todayAbbr;const isSun=abbr==="Sun";
          return(<div key={abbr} style={{marginBottom:8,borderRadius:12,border:`2px solid ${isToday?"#1565C0":C.border}`,overflow:"hidden"}}>
            <div style={{padding:"8px 14px",background:isToday?"linear-gradient(135deg,#0d47a1,#1565C0)":isSun?"linear-gradient(135deg,#7B5800,#C9952A)":"#F5F5F5",color:isToday||isSun?"white":C.textM,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,fontWeight:800}}>{dayFull}</div>
              {isToday&&<span style={{fontSize:10,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"2px 10px",fontWeight:700}}>TODAY</span>}
            </div>
            <div style={{padding:"8px 14px",background:isToday?"#E3F2FD08":"white"}}>
              {tasks.map((t,j)=><div key={j} style={{fontSize:12,color:C.textM,display:"flex",gap:6,padding:"3px 0",borderBottom:j<tasks.length-1?`1px solid ${C.border}`:""}}><span style={{color:isToday?"#1565C0":"#0d8a9e",fontWeight:700}}>›</span>{t}</div>)}
            </div>
          </div>);
        })}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:6}}>
          <div style={{background:"#E3F2FD",border:"1px solid #90CAF9",borderRadius:12,padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:800,color:"#1565C0",marginBottom:8}}>🔁 Every 2 Weeks</div>
            {[" Preventive shock: 2–3 kg chlorine at sunset","Run pump overnight after shock","Check CYA stabiliser — top up if below 30 ppm","Review chemical log for usage trends"].map((t,i)=><div key={i} style={{fontSize:11,color:C.textM,display:"flex",gap:6,padding:"4px 0",borderBottom:i<3?`1px solid ${C.border}`:""}}><span style={{color:"#1565C0"}}>›</span>{t}</div>)}
          </div>
          <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:12,padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:800,color:"#E65100",marginBottom:8}}>📆 Monthly</div>
            {["Full 6-parameter chemistry test","Deep backwash 8–10 min (longer than usual)","Inspect pump O-rings and seals","Check pool surface for scale or cracks"].map((t,i)=><div key={i} style={{fontSize:11,color:C.textM,display:"flex",gap:6,padding:"4px 0",borderBottom:i<3?`1px solid ${C.border}`:""}}><span style={{color:"#E65100"}}>›</span>{t}</div>)}
          </div>
        </div>
      </div>}

      {/* DIAGNOSE */}
      {section==="diagnose"&&<div>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>Step 1 — Look at the water. What colour is it?</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {COLORS.map(c=>(
            <button key={c.id} onClick={()=>setWaterCol(c.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 14px",borderRadius:10,border:`2px solid ${waterCol===c.id?c.col:C.border}`,background:waterCol===c.id?`${c.col}18`:"white",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:c.col,flexShrink:0,border:"2px solid rgba(0,0,0,0.12)",boxShadow:waterCol===c.id?`0 0 0 3px ${c.col}40`:""}}/>
              <span style={{fontSize:12,color:C.text,fontWeight:waterCol===c.id?800:400}}>{c.label}</span>
            </button>
          ))}
        </div>
        {waterCol&&(()=>{const c=COLORS.find(x=>x.id===waterCol);return(<div style={{borderRadius:14,border:`2px solid ${sevTx[c.sev]}`,padding:"16px 20px",background:sevBg[c.sev],marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:sevTx[c.sev],marginBottom:6}}>🩺 Diagnosis: {c.meaning}</div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.8}}>{c.action}</div>
        </div>);})()}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18}}>
          <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>Step 2 — Reach down and run your hand along the pool wall. How does it feel?</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[["smooth","✅ Smooth","#E8F5E9","#2E7D32","No algae present. Your daily routine is working. Continue as normal."],["slippery","⚠️ Slippery","#FFF3E0","#E65100","Early algae biofilm is forming — you caught it early! Brush ALL walls and the floor today. Plan a shock treatment (2–3 kg) tonight at sunset."],["slimy","🚨 Slimy","#FFEBEE","#C62828","Active algae. Close the pool immediately — no guests in the water. You need the full 9-step shock recovery protocol. Go to the Emergency tab now."]].map(([id,label,bg,tx,action])=>(
              <button key={id} onClick={()=>setWallFeel(id)} style={{flex:1,minWidth:180,padding:"12px 14px",borderRadius:12,border:`2px solid ${wallFeel===id?tx:C.border}`,background:wallFeel===id?bg:"white",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                <div style={{fontSize:13,fontWeight:800,color:tx,marginBottom:wallFeel===id?8:0}}>{label}</div>
                {wallFeel===id&&<div style={{fontSize:12,color:C.text,lineHeight:1.75}}>{action}</div>}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginTop:14,padding:"12px 14px",background:C.sandL,borderRadius:12,border:`1px solid ${C.border}`,fontSize:12,color:C.textM,lineHeight:1.8}}>
          <strong style={{color:C.navy}}>🧹 Brushing Schedule — Algae always starts in corners</strong><br/>
          Steps & corners: every 2 days · Full walls: twice weekly · Floor (vacuum): every Monday & Thursday
        </div>
      </div>}

      {/* DOSING GUIDE */}
      {section==="dosing"&&<div>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Select your situation today:</div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
          {DOSES.map(d=>(
            <button key={d.id} onClick={()=>setSituation(d.id)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${situation===d.id?"#1565C0":C.border}`,background:situation===d.id?"#1565C0":"white",color:situation===d.id?"white":C.text,fontSize:12,cursor:"pointer",fontWeight:situation===d.id?700:400}}>{d.label}</button>
          ))}
        </div>
        {dose&&<Card style={{border:"2px solid #1565C0"}}>
          <div style={{fontSize:14,fontWeight:900,color:"#1565C0",marginBottom:14}}>{dose.label} — Exact Doses</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["☀️ Chlorine 90",dose.cl,"#E8F5E9","#2E7D32"],["🟢 Algicure",dose.alg,"#E3F2FD","#1565C0"],["✨ Sparkle-it",dose.sp,"#F3E5F5","#6A1B9A"],["⚖️ pH Minus",dose.ph,"#FFF8E1","#E65100"]].map(([label,val,bg,tx])=>(
              <div key={label} style={{background:bg,borderRadius:10,padding:"10px 14px",border:`1px solid ${tx}30`}}>
                <div style={{fontSize:11,color:tx,fontWeight:800,marginBottom:5}}>{label}</div>
                <div style={{fontSize:17,fontWeight:900,color:val==="—"?C.textL:C.text}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{background:`${C.navy}08`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,fontWeight:800,color:C.navy}}>⏱ Pump Runtime Required</div>
            <div style={{fontSize:14,fontWeight:900,color:C.navy}}>{dose.pump}</div>
          </div>
          <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:8}}>⏳ Critical Wait Times Between Chemicals</div>
          {[["pH Minus → then Chlorine","30–60 min","#FFF3E0","#E65100"],["Chlorine (shock) → then Algicure","24 hrs — test Cl <5 ppm first","#FFEBEE","#C62828"],["Chlorine → then Sparkle-it","12 hrs","#FFF8E1","#E65100"],["Algicure → then Sparkle-it","4–6 hrs","#E3F2FD","#1565C0"]].map(([step,wait,bg,tx])=>(
            <div key={step} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 12px",borderRadius:8,background:bg,border:`1px solid ${tx}20`,marginBottom:5}}>
              <div style={{fontSize:12,color:C.text}}>{step}</div>
              <div style={{fontSize:11,fontWeight:800,color:tx,flexShrink:0,marginLeft:10}}>{wait}</div>
            </div>
          ))}
          <div style={{fontSize:12,fontWeight:800,color:C.navy,marginTop:14,marginBottom:8}}>📍 Where to Add Each Chemical</div>
          {[["☀️ Chlorine 90","Near return jets. Dissolve in a bucket of water FIRST. NEVER add dry granules directly to pool."],["⬇️ pH Minus","Deep end only. Pour very slowly. Pump must be ON and running."],["🟢 Algicure","Walk around the pool perimeter and pour evenly around the edges."],["✨ Sparkle-it","Near return jets. Measure carefully — never overdose. Too much makes water cloudier."]].map(([chem,where])=>(
            <div key={chem} style={{padding:"8px 12px",borderRadius:8,background:C.sandL,display:"flex",gap:10,marginBottom:5}}>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,flexShrink:0,width:120}}>{chem}</div>
              <div style={{fontSize:12,color:C.textM,lineHeight:1.7}}>{where}</div>
            </div>
          ))}
        </Card>}
      </div>}

      {/* VALVE GUIDE */}
      {section==="valves"&&<div>
        <div style={{background:"#FFEBEE",border:"2px solid #C62828",borderRadius:12,padding:"14px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:26,flexShrink:0}}>🚨</span>
          <div><div style={{fontSize:13,fontWeight:900,color:"#C62828",marginBottom:5}}>GOLDEN RULE — Memorise This Before Anything Else</div><div style={{fontSize:13,color:"#7A1A10",lineHeight:1.8}}><strong>ALWAYS TURN THE PUMP OFF BEFORE MOVING THE VALVE.</strong> Moving the multiport valve while the pump is running destroys the internal spider gasket. This is the most common and costly pool mistake — it can crack pipes and flood the pump room. Always pump off first. Always.</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[["⚡ FILTER","Normal daily operation. This is the default position — water passes through sand and returns clean to the pool. The valve lives here 99% of the time. Run 8–12 hrs/day.","#E3F2FD","#1565C0","Every day"],["🔄 BACKWASH","Reverses flow to flush accumulated dirt out to the drain. Run until the sight glass clears (3–5 min). ALWAYS follow with RINSE immediately after.","#FFEBEE","#C62828","Every Sunday"],["💧 RINSE","Re-settles the filter sand after a backwash. Sand gets disturbed — this compacts it. Run for exactly 60 seconds after every backwash, then switch to FILTER.","#FFF8E1","#E65100","After every backwash"],["♻️ RECIRCULATE","Bypasses the filter — water moves but is NOT filtered or cleaned. Use only when adding flocculant or during filter repairs. Not for normal operation.","#E8F5E9","#2E7D32","Special cases only"],["🗑️ WASTE","Water drains directly — bypasses filter. Use when vacuuming a green/algae pool (algae clogs the filter rapidly). Watch water level — it drops fast.","#F3E5F5","#6A1B9A","Green pool vacuuming"],["🔒 CLOSED","Complete shutdown. Maintenance only. NEVER start the pump with valve on CLOSED — destroys pump seals and cracks pipes within seconds.","#F5F5F5","#616161","Maintenance only"]].map(([pos,desc,bg,tx,when])=>(
            <div key={pos} style={{borderRadius:12,border:`2px solid ${tx}25`,background:bg,padding:"12px 14px"}}>
              <div style={{fontSize:14,fontWeight:900,color:tx,marginBottom:7}}>{pos}</div>
              <div style={{fontSize:11,color:C.text,lineHeight:1.75,marginBottom:8}}>{desc}</div>
              <span style={{fontSize:10,background:"white",borderRadius:20,padding:"3px 9px",color:tx,fontWeight:700,border:`1px solid ${tx}30`}}>{when}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Step-by-Step Valve Sequences</div>
        {[["🌅 Normal daily run","→ FILTER ON","8–10 hrs/day"],["🧹 Weekly backwash","PUMP OFF → BACKWASH (5 min) → PUMP OFF → RINSE (60 sec) → PUMP OFF → FILTER ON","Every Sunday"],["🌿 Vacuum green pool","PUMP OFF → WASTE (vacuum floor) → PUMP OFF → FILTER ON","Until floor clean"],["🌊 Lower water level","PUMP OFF → WASTE (watch level!) → PUMP OFF → FILTER ON","Minutes only — stay close"]].map(([task,seq,timing])=>(
          <div key={task} style={{marginBottom:8,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{padding:"8px 14px",background:`${C.navy}07`,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,fontWeight:800,color:C.navy}}>{task}</div>
              <div style={{fontSize:11,color:C.textL}}>{timing}</div>
            </div>
            <div style={{padding:"10px 14px",fontSize:12,color:"#1565C0",lineHeight:1.8,fontFamily:"monospace",background:"white",fontWeight:600}}>{seq}</div>
          </div>
        ))}
      </div>}

      {/* EMERGENCY */}
      {section==="emergency"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{title:"🌿 Pool Turned Green",color:"#C62828",bg:"#FFF8F8",steps:["Close pool — no swimming until water is crystal clear","Remove all debris + brush EVERY wall, step, corner and the floor","Backwash filter (5 min) → Rinse (60 sec) → set to FILTER","Test and fix pH to 7.2–7.4. Wait 30–60 minutes before shocking.","SHOCK at SUNSET: light green = 3–4 kg · dark green = 4–5 kg. Dissolve in bucket first. Pour near return jets.","Run pump continuously 12–18 hours. Do NOT switch off. Brush again after 2–3 hrs.","Next morning: vacuum to WASTE (NOT FILTER — algae will clog it). Then backwash again.","Wait for chlorine to drop below 5 ppm (test — usually 24 hrs). THEN add Algicure 5 L around perimeter.","After 4–6 hrs add Sparkle-it 2–3 L. Reopen when: clear blue, floor visible, Cl 1–3 ppm, pH 7.2–7.4."],tip:"Prevention cost: KSh 50–80/day. Recovery cost: KSh 2,000–4,000 + 24–72 hrs electricity."},
        {title:"⚠️ Pump Not Working",color:"#E65100",bg:"#FFF8F4",steps:["Check the pump basket — clear it if full of leaves or debris","Check power supply and circuit breaker (reset if tripped)","Check pump lid seal — if air is getting in, suction fails","Listen for unusual sounds: grinding = bearing failure, humming but no flow = impeller blocked","If not resolved in 15 minutes, call James Okwany immediately"],tip:"While waiting: manually skim the surface every few hours to slow algae growth."},
        {title:"💡 Still Cloudy After Treatment",color:"#1565C0",bg:"#F4F8FF",steps:["Do NOT add more clarifier — overdosing Sparkle-it makes water cloudier, not clearer","Backwash the filter — it may be completely full and clogged","Test and fix pH to exactly 7.2–7.4. This is most often the cause.","Run pump overnight without stopping — patience is needed","If still cloudy next morning: check and top up CYA stabiliser to 30–50 ppm"],tip:"Cloudiness after treatment often means the filter is collecting dead material — keep running."},
        {title:"🔴 Reddish or Brown Water",color:"#6A1B9A",bg:"#FAF4FF",steps:["Do NOT add chlorine or shock — it will react with the iron and make it far worse","This is iron from Lodwar borehole water — very common here","Add a metal sequestrant product. Follow the label dose exactly.","Run pump for 8 hours to circulate the sequestrant","Then test and balance chemistry normally before resuming chlorine treatment"],tip:"Prevent monthly by adding sequestrant as a routine. Lodwar borehole water is high in iron and minerals."},
        {title:"⚗️ Chemical Spill or Accidental Mixing",color:"#B71C1C",bg:"#FFF8F8",steps:["Evacuate the pool area immediately — do not let anyone enter","Do NOT try to clean a chlorine + acid mix — it produces toxic gas","Open all doors and windows to ventilate the area","Flush the area with large amounts of water from a safe distance","Call James Okwany immediately. Do not re-enter until air is clear.","Eye or skin contact with any chemical: flush with running water for 15 minutes continuously"],tip:"Prevention: Store chlorine and acid on SEPARATE shelves in a locked, ventilated room — never together."}].map(sc=>(
          <Card key={sc.title} style={{border:`2px solid ${sc.color}30`,background:sc.bg}}>
            <div style={{fontSize:15,fontWeight:900,color:sc.color,marginBottom:14}}>{sc.title}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
              {sc.steps.map((step,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:sc.color,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:12,color:C.text,lineHeight:1.75,paddingTop:2}}>{step}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"9px 13px",background:"rgba(255,255,255,0.7)",borderRadius:9,fontSize:11,color:sc.color,fontWeight:700,fontStyle:"italic"}}>💡 {sc.tip}</div>
          </Card>
        ))}
      </div>}

      {/* PRO TIPS */}
      {section==="tips"&&<div>
        <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>🏆 Expert Tips — Save Chemicals & Prevent Problems</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
          {[["🌙 Chlorinate at sunset only","Sunlight destroys 90% of chlorine within 2 hours of sunrise. Adding at sunset means every gram works 3× harder overnight."],["🛡 Get CYA to 30–50 ppm first","Without stabiliser, 90% of your chlorine is destroyed by UV in 2 hrs. This is the single most important fix for Lodwar's intense sun."],["🧹 Brush before every shock","Algae hides in a biofilm layer on walls. Brushing breaks it loose so the chemical can reach it. Skipping wastes 50% of shock."],["⚖️ Fix pH BEFORE adding chlorine","At pH 8.0, chlorine is 85% less effective. Always fix pH first, wait 30 min, THEN add chlorine. The order matters enormously."],["✨ Never overdose Sparkle-it","Too much clarifier makes water cloudier. Measure carefully every time — less is always more with this chemical."],["🔄 Backwash after vacuuming algae","When you vacuum dead algae, the filter fills rapidly. Backwash immediately or algae recirculates back into the pool."],["⚡ Shock every 2 weeks preventively","2–3 kg fortnightly is far cheaper than waiting for a 4–5 kg emergency treatment. Prevention always wins."],["🌧 Shock after every heavy rain","Rain dilutes chlorine and deposits nutrients that feed algae within 12 hours. Don't skip this one."],["🎊 Extra chlorine after busy guest days","Sunscreen, sweat and body oils rapidly consume chlorine. After a busy pool day, add an extra 100 g at sunset."]].map(([tip,why])=>(
            <div key={tip} style={{borderRadius:10,border:`1px solid ${C.border}`,padding:"11px 13px",background:"white"}}>
              <div style={{fontSize:12,fontWeight:800,color:C.navy,marginBottom:5}}>{tip}</div>
              <div style={{fontSize:11,color:C.textM,lineHeight:1.75}}>{why}</div>
            </div>
          ))}
        </div>
        <div style={{background:"linear-gradient(135deg,#0e2418,#1a3626)",borderRadius:12,padding:"14px 16px",color:"white",marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:800,color:"#7de0a0",marginBottom:10}}>⚡ Power-Saving Pump Strategy</div>
          {[["Split run: 4 hrs morning + 4 hrs evening (not continuous)","15–25% saving"],["Keep filter clean with weekly backwash — dirty filter overworks motor","Up to 30% saving"],["Run pump during off-peak electricity hours where possible","10–20% saving"],["Prevent algae blooms — saves 24–72 hrs emergency pump time","The biggest saving of all"]].map(([s,v])=>(
            <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.85)"}}>{s}</div>
              <div style={{fontSize:11,fontWeight:800,color:"#7de0a0",flexShrink:0,marginLeft:12}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:800,color:C.danger,marginBottom:10}}>⚠️ Chemical Safety — Non-Negotiable Rules</div>
          {[["⛔ Chlorine 90","#FFEBEE","#C62828","Wear gloves and eye protection ALWAYS. Dissolve in a bucket of water first — NEVER add dry granules directly to the pool. NEVER mix with pH Minus — produces toxic chlorine gas. Store in cool, locked, ventilated room away from fuels."],["⚠️ pH Minus (acid)","#FFF3E0","#E65100","Wear gloves and eye protection. Add acid to water — NEVER water to acid. Pour SLOWLY at the deep end only with pump running. Never mix with chlorine. Eye or skin contact: flush with water for 15 minutes."],["🏠 Storage Rules","#E3F2FD","#1565C0","All chemicals in a separate locked, ventilated room. Chlorine and acid on SEPARATE shelves — never stored near each other. Always in original labelled containers. Never near fuels, paints or fertilisers."]].map(([title,bg,tx,rule])=>(
            <div key={title} style={{borderRadius:10,border:`2px solid ${tx}25`,background:bg,padding:"12px 14px",display:"flex",gap:12,marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:900,color:tx,flexShrink:0,width:110}}>{title}</div>
              <div style={{fontSize:12,color:C.text,lineHeight:1.8}}>{rule}</div>
            </div>
          ))}
        </div>
        <div style={{background:"linear-gradient(135deg,#0d47a1,#1565C0)",borderRadius:12,padding:"14px 16px",color:"white"}}>
          <div style={{fontSize:12,fontWeight:800,marginBottom:10,letterSpacing:0.5}}>🎯 Chemistry Target Ranges — Quick Reference</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
            {[["☀️ Free Chlorine","2–3 ppm","Test daily"],["⚖️ pH","7.2–7.4","Test daily"],["☁️ Combined Chlorine","<0.5 ppm","Test weekly"],["🌊 Total Alkalinity","80–120 ppm","Test weekly"],["🛡 CYA / Stabiliser","30–50 ppm","Test monthly"],["🪨 Calcium Hardness","200–400 ppm","Test monthly"]].map(([param,target,freq])=>(
              <div key={param} style={{padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{param}</div>
                <div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:900,color:"#7defa0"}}>{target}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>{freq}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>);
  };

  return(<div><SectionTitle title="Pool & Recreation" sub="Water chemistry, safety management & activities schedule"/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="chemistry"&&<ChemistryTab/>}{sub==="safety"&&<SafetyTab/>}{sub==="maintenance"&&<MaintenanceLogTab/>}{sub==="guide"&&<PoolGuideTab/>}{sub==="activities"&&<ActivitiesTab/>}</div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── SETTINGS VIEW ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const THEMES={
  "Turkana Earth":{navy:"#0F2744",navyM:"#1A3A5C",sand:"#F4ECD8",sandL:"#FAF6EE",terra:"#B85C38",terraL:"#E07A56",sage:"#5A7A5E",sageD:"#3D5C41",gold:"#C9952A",goldL:"#F0C060"},
  "Ocean Blue":{navy:"#0A3D62",navyM:"#1E6F9F",sand:"#E8F4F8",sandL:"#F0F8FB",terra:"#38A1DB",terraL:"#5BB8E8",sage:"#2E86AB",sageD:"#1A6B8F",gold:"#F0A500",goldL:"#F5C23A"},
  "Savanna Sunset":{navy:"#3D0C11",navyM:"#5C1A22",sand:"#FFF0E0",sandL:"#FFF7F0",terra:"#D4451A",terraL:"#E86B3A",sage:"#B8860B",sageD:"#8B6914",gold:"#DAA520",goldL:"#F0C040"},
  "Forest Green":{navy:"#1B2D1B",navyM:"#2D4A2D",sand:"#F0F5E8",sandL:"#F6FAF0",terra:"#6B8E23",terraL:"#8FBC3A",sage:"#228B22",sageD:"#006400",gold:"#B8860B",goldL:"#DAA520"},
  "Desert Rose":{navy:"#4A1942",navyM:"#6B2D5C",sand:"#FFF0F5",sandL:"#FFF5F8",terra:"#C4557A",terraL:"#D97B99",sage:"#8B5E83",sageD:"#6A3D63",gold:"#B8860B",goldL:"#DAA520"},
  "Midnight Ink":{navy:"#0D0D0D",navyM:"#1A1A2E",sand:"#F0F0F0",sandL:"#F8F8F8",terra:"#E94560",terraL:"#FF6B81",sage:"#16213E",sageD:"#0F3460",gold:"#E94560",goldL:"#FF6B81"},
  "Dark Mode":{navy:"#1E1E2E",navyM:"#2A2A3E",sand:"#2D2D3D",sandL:"#252535",terra:"#F4845F",terraL:"#F7A072",sage:"#7EC8A0",sageD:"#5BA882",gold:"#F5C542",goldL:"#FFD970",text:"#E8E8F0",textM:"#B8B8C8",textL:"#787898",border:"#3A3A4E",bg:"#1A1A2A"},
};

const SettingsView=({settings,setSettings,devotions,role,activityLog=[]})=>{
  const[sub,setSub]=useState("identity");
  const isAdmin=role?.id==="admin";
  if(!isAdmin)return(<div style={{textAlign:"center",padding:60}}><div style={{fontSize:40,marginBottom:14}}>🔒</div><div style={{fontSize:16,fontWeight:700,color:C.text}}>Admin Access Required</div><div style={{fontSize:13,color:C.textL,marginTop:6}}>Settings are available to Admin / Manager role only.</div></div>);
  const TABS=[["identity","🏨","Resort Identity"],["themes","🎨","Theme & Colors"],["modules","📦","Modules"],["roles","🔐","Roles & PINs"],["villas","🏡","Villa Config"],["devotions","✟","Devotions"],["apikeys","🔑","API Keys"],["export","📥","Data Export"],["activitylog","📋","Activity Log"]];

  const IdentityTab=()=>{
    const[local,setLocal]=useState({name:settings.name||"CHABBS",tagline:settings.tagline||"Resort & Conference Centre",location:settings.location||"Lodwar · Turkana County · Kenya",currency:settings.currency||"KSh",motto:settings.motto||"Commit your work to the Lord",crossSymbol:settings.crossSymbol||"✟"});
    const save=()=>setSettings(p=>({...p,...local}));
    return(<Card>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:16}}>Resort Identity</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Resort Name"><input value={local.name} onChange={e=>setLocal(p=>({...p,name:e.target.value}))} style={inp}/></Field>
        <Field label="Tagline"><input value={local.tagline} onChange={e=>setLocal(p=>({...p,tagline:e.target.value}))} style={inp}/></Field>
        <Field label="Location"><input value={local.location} onChange={e=>setLocal(p=>({...p,location:e.target.value}))} style={inp}/></Field>
        <Field label="Currency Symbol"><input value={local.currency} onChange={e=>setLocal(p=>({...p,currency:e.target.value}))} style={inp}/></Field>
        <Field label="Motto / Scripture"><input value={local.motto} onChange={e=>setLocal(p=>({...p,motto:e.target.value}))} style={inp}/></Field>
        <Field label="Cross Symbol"><input value={local.crossSymbol} onChange={e=>setLocal(p=>({...p,crossSymbol:e.target.value}))} style={inp}/></Field>
      </div>
      <button onClick={save} style={{marginTop:16,background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>💾 Save Identity</button>
    </Card>);
  };

  const ThemesTab=()=>{
    const current=settings.theme||"Turkana Earth";
    return(<div>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Choose a colour theme for the entire system</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {Object.entries(THEMES).map(([name,t])=>{const active=current===name;return(
          <div key={name} onClick={()=>setSettings(p=>({...p,theme:name}))} style={{borderRadius:16,overflow:"hidden",cursor:"pointer",border:`3px solid ${active?t.navy:C.border}`,boxShadow:active?`0 4px 20px ${t.navy}30`:"none",transition:"all 0.2s"}}>
            <div style={{background:`linear-gradient(135deg,${t.navy},${t.navyM})`,padding:"16px 18px",color:"white"}}>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:16,fontWeight:800}}>{name}</div>
              {active&&<div style={{fontSize:11,opacity:0.7,marginTop:3}}>✓ Active theme</div>}
            </div>
            <div style={{padding:"12px 16px",background:t.sandL}}>
              <div style={{display:"flex",gap:6,marginBottom:8}}>{[t.navy,t.terra,t.sage,t.gold,t.sand].map((c,i)=>(<div key={i} style={{width:28,height:28,borderRadius:"50%",background:c,border:`2px solid ${t.navy}20`}}/>))}</div>
              <div style={{display:"flex",gap:8}}><span style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:`${t.sage}20`,color:t.sageD,fontWeight:700}}>Badge</span><span style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:`${t.terra}20`,color:t.terra,fontWeight:700}}>Accent</span></div>
            </div>
          </div>);})}
      </div>
    </div>);
  };

  const ModulesTab=()=>{
    const ALL_MODULES=[["dashboard","📊","Dashboard"],["villas","🏡","Villas"],["bookings","📅","Bookings"],["housekeeping","🧹","Housekeeping"],["laundry","👕","Laundry"],["maintenance","🔧","Maintenance"],["waterpower","💧","Water & Power"],["financials","💰","Financials"],["stewardship","📈","Stewardship"],["restaurant","🍽","Restaurant"],["conference","🎪","Conference"],["sales","🎯","Sales"],["gardening","🌿","Gardening"],["pool","🏊","Pool & Rec"],["hr","👥","HR & Payroll"],["inventory","📦","Inventory"],["feedback","⭐","Feedback"],["lostfound","🔍","Lost & Found"],["nightaudit","🌙","Night Audit"]];
    const enabled=settings.enabledModules||ALL_MODULES.map(m=>m[0]);
    const toggle=mod=>{const next=enabled.includes(mod)?enabled.filter(m=>m!==mod):[...enabled,mod];setSettings(p=>({...p,enabledModules:next}));};
    return(<div>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:6}}>Toggle modules on or off</div>
      <div style={{fontSize:12,color:C.textL,marginBottom:16}}>Disabled modules will be hidden from the sidebar for all roles.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
        {ALL_MODULES.map(([id,icon,name])=>{const on=enabled.includes(id);const core=id==="dashboard";return(
          <div key={id} onClick={()=>!core&&toggle(id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:12,background:on?"white":"#F5F5F5",border:`2px solid ${on?C.sage:C.border}`,cursor:core?"not-allowed":"pointer",opacity:on?1:0.55}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>{icon}</span><span style={{fontSize:13,fontWeight:700,color:C.text}}>{name}</span></div>
            <div style={{width:42,height:24,borderRadius:12,background:on?C.sage:C.border,padding:2,transition:"all 0.2s",position:"relative"}}><div style={{width:20,height:20,borderRadius:10,background:"white",transform:on?"translateX(18px)":"translateX(0)",transition:"transform 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></div>
          </div>);})}
      </div>
    </div>);
  };

  const RolesTab=()=>{
    const[roles,setRolesLocal]=useState(settings.roles||ROLES.map(r=>({...r})));
    const update=(idx,key,val)=>{const next=[...roles];next[idx]={...next[idx],[key]:val};setRolesLocal(next);};
    const save=()=>setSettings(p=>({...p,roles}));
    return(<Card>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Roles & Access PINs</div>
      <div style={{marginBottom:8,fontSize:12,color:C.textL}}>Customise role names, labels and PINs for each access level.</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {roles.map((r,i)=>(<div key={r.id} style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 100px",gap:10,alignItems:"center",padding:"10px 14px",background:i%2===0?"white":C.sandL,borderRadius:10,border:`1px solid ${C.border}`}}>
          <span style={{fontSize:22}}>{r.icon}</span>
          <Field label="Name"><input value={r.name} onChange={e=>update(i,"name",e.target.value)} style={{...inp,padding:"7px 10px",fontSize:12}}/></Field>
          <Field label="Label"><input value={r.label} onChange={e=>update(i,"label",e.target.value)} style={{...inp,padding:"7px 10px",fontSize:12}}/></Field>
          <Field label="PIN"><input type="password" value={r.pin} onChange={e=>update(i,"pin",e.target.value)} style={{...inp,padding:"7px 10px",fontSize:12,textAlign:"center",letterSpacing:6}}/></Field>
        </div>))}
      </div>
      <button onClick={save} style={{marginTop:14,background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>💾 Save Roles</button>
    </Card>);
  };

  const VillasTab=()=>{
    const[vConfig,setVConfig]=useState(settings.villaConfig||INITIAL_VILLAS.map(v=>({id:v.id,name:v.name,rateWhole:v.rateWhole,rateRoom:v.rateRoom})));
    const update=(idx,key,val)=>{const next=[...vConfig];next[idx]={...next[idx],[key]:key.includes("rate")?parseInt(val)||0:val};setVConfig(next);};
    const save=()=>setSettings(p=>({...p,villaConfig:vConfig}));
    return(<Card>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Villa Configuration</div>
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",gap:8,padding:"8px 12px",background:`${C.navy}07`,borderRadius:8,marginBottom:8}}>{["#","Villa Name","Whole Villa Rate","Per Room Rate"].map(h=><div key={h} style={{fontSize:10,fontWeight:800,color:C.textL,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {vConfig.map((v,i)=>(<div key={v.id} style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",gap:8,alignItems:"center",padding:"8px 12px",background:i%2===0?"white":C.sandL,borderRadius:8}}>
          <span style={{fontSize:13,fontWeight:800,color:C.navy,width:24,textAlign:"center"}}>{v.id}</span>
          <input value={v.name} onChange={e=>update(i,"name",e.target.value)} style={{...inp,padding:"7px 10px",fontSize:12}}/>
          <input type="number" value={v.rateWhole} onChange={e=>update(i,"rateWhole",e.target.value)} style={{...inp,padding:"7px 10px",fontSize:12}}/>
          <input type="number" value={v.rateRoom} onChange={e=>update(i,"rateRoom",e.target.value)} style={{...inp,padding:"7px 10px",fontSize:12}}/>
        </div>))}
      </div>
      <button onClick={save} style={{marginTop:14,background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>💾 Save Villa Config</button>
    </Card>);
  };

  const DevotionsTab=()=>(<div>
    <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:14}}>Morning Devotions</div>
    <div style={{fontSize:12,color:C.textL,marginBottom:16}}>These devotions are shown to staff at login to start their shift with God's Word.</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
      {devotions.map((d,i)=>(<Card key={i} style={{borderLeft:`4px solid ${[C.navy,C.terra,C.sage,C.gold,C.info,"#6A1B9A",C.sageD][i%7]}`}}>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:800,color:C.navy,marginBottom:6}}>{d.value}</div>
        <div style={{fontSize:12,color:C.textM,fontStyle:"italic",lineHeight:1.7,marginBottom:6}}>"{d.text}"</div>
        <div style={{fontSize:11,color:C.terra,fontWeight:800,marginBottom:8}}>— {d.verse}</div>
        <div style={{fontSize:12,color:C.textL,lineHeight:1.7,padding:"8px 10px",background:C.sandL,borderRadius:8}}>{d.message}</div>
      </Card>))}
    </div>
  </div>);

  const APIKeysTab=()=>{
    const[key,setKey]=useState(settings.claudeApiKey||"");
    const[show,setShow]=useState(false);
    const save=()=>setSettings(p=>({...p,claudeApiKey:key}));
    return(<Card>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:6}}>🤖 Anthropic Claude API Key</div>
      <div style={{fontSize:12,color:C.textL,marginBottom:16}}>Required for AI content generation in Sales & Marketing (social posts, review responses, inbox replies). Get your key at console.anthropic.com.</div>
      <Field label="API Key">
        <div style={{display:"flex",gap:8}}>
          <input type={show?"text":"password"} value={key} onChange={e=>setKey(e.target.value)} placeholder="sk-ant-..." style={{...inp,flex:1,fontFamily:"monospace",fontSize:12,letterSpacing:show?0:2}}/>
          <button onClick={()=>setShow(p=>!p)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"white",cursor:"pointer",fontSize:12}}>{show?"🙈":"👁"}</button>
        </div>
      </Field>
      <div style={{display:"flex",gap:10,marginTop:14,alignItems:"center"}}>
        <button onClick={save} style={{background:C.navy,color:"white",padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700}}>💾 Save API Key</button>
        {settings.claudeApiKey&&<div style={{fontSize:12,color:C.sageD,fontWeight:700}}>✓ Key saved</div>}
      </div>
      <div style={{marginTop:16,padding:"12px 14px",background:`${C.gold}15`,borderRadius:10,border:`1px solid ${C.gold}40`}}>
        <div style={{fontSize:12,fontWeight:700,color:C.terra,marginBottom:4}}>⚠️ Security Note</div>
        <div style={{fontSize:11,color:C.textM,lineHeight:1.6}}>API keys are stored in browser localStorage and used directly from the browser. This is suitable for a trusted local/desktop environment like this system, but do not share or expose your key.</div>
      </div>
    </Card>);
  };

  const DataExportTab=()=>{
    const EXPORTS=[
      {name:"Night Audit Report",icon:"🌙",desc:"End-of-day summary with all departments",format:"CSV",action:()=>exportCSV("NightAudit",["Section","Metric","Value"],[["Occupancy","Villas Occupied","3/10"],["Financials","Revenue","12000"],["Financials","Expenses","3200"],["Restaurant","Orders","5"],["Utilities","Tank Level","85%"]])},
      {name:"Financial Ledger",icon:"💰",desc:"Revenue, expenses, and profit by date",format:"CSV",action:()=>exportCSV("Financials",["Date","Revenue","Expenses","Profit","Notes"],[["2026-03-18","12000","3200","8800","Accommodation + Restaurant"],["2026-03-17","15600","4100","11500",""]])},
      {name:"Guest CRM Database",icon:"👥",desc:"All guest contacts, loyalty tiers, and spend history",format:"CSV",action:()=>exportCSV("GuestCRM",["Name","Email","Phone","Visits","Lifetime Spend","Loyalty","Segment"],[["Johnson Family","johnson@email.com","+254 712 345 678","3","144000","Gold","VIP Repeat"]])},
      {name:"Staff & Payroll",icon:"👥",desc:"Staff directory with salary and deduction details",format:"CSV",action:()=>exportCSV("Staff",["Name","Role","Dept","Salary","NSSF","NHIF","PAYE","Net"],[["Aggrey Ochieng","GM","Management","85000","1080","1700","18600","63620"]])},
      {name:"Marketing Analytics",icon:"📈",desc:"Social media metrics, email campaign results, SEO rankings",format:"CSV",action:()=>exportCSV("Marketing",["Metric","Value"],[["Total Social Views","16490"],["Email Open Rate","57%"],["Top Keyword Position","1"],["Pipeline Value","910000"]])},
      {name:"Bookings Register",icon:"📅",desc:"All reservations with guest details and payment status",format:"CSV",action:()=>exportCSV("Bookings",["Guest","Villa","Check-in","Check-out","Amount","Status","Payment"],[["Johnson Family","Villa 2","2026-03-16","2026-03-20","48000","Checked In","Paid"]])},
      {name:"Inventory Report",icon:"📦",desc:"Stock levels, low stock alerts, and supplier info",format:"CSV",action:()=>exportCSV("Inventory",["Item","Category","Qty","Min","Value","Supplier"],[["Bed Linen Sets","Housekeeping","45","20","112500","Nairobi Textiles"]])},
      {name:"Maintenance Log",icon:"🔧",desc:"All maintenance issues, status, and resolution dates",format:"CSV",action:()=>exportCSV("Maintenance",["Asset","Issue","Priority","Status","Reported","Resolved"],[["AC Unit Villa 3","Filter clogged","High","Open","2026-03-15",""]])},
    ];
    return(<div>
      <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:6}}>Export resort data as CSV files</div>
      <div style={{fontSize:12,color:C.textL,marginBottom:16}}>Download reports for Aggrey's monthly board presentations, accountant submissions, or backup purposes.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {EXPORTS.map(ex=>(<Card key={ex.name} style={{border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}><span style={{fontSize:24}}>{ex.icon}</span><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{ex.name}</div><div style={{fontSize:11,color:C.textL}}>{ex.desc}</div></div></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:`${C.navy}10`,color:C.navy,fontWeight:700}}>{ex.format}</span><button onClick={ex.action} style={{padding:"7px 16px",borderRadius:10,background:C.navy,color:"white",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>📥 Export</button></div>
        </Card>))}
      </div>
    </div>);
  };

  const MODULE_ICONS={bookings:"📅",villas:"🏡",restaurant:"🍽",maintenance:"🔧",system:"⚙️",hr:"👥",inventory:"📦",financials:"💰",sales:"🎯",housekeeping:"🧹",laundry:"👕",pool:"🏊",gardening:"🌿",conference:"🎪",waterpower:"💧"};
  const ActivityLogTab=()=>{
    const[logFilter,setLogFilter]=useState("all");
    const modules=[...new Set(activityLog.map(l=>l.module))];
    const shown=logFilter==="all"?activityLog:activityLog.filter(l=>l.module===logFilter);
    return(<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:14,fontWeight:800,color:C.navy}}>System Activity — Last {activityLog.length} events</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["all",...modules].map(m=>(<button key={m} onClick={()=>setLogFilter(m)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${logFilter===m?C.navy:C.border}`,background:logFilter===m?C.navy:"white",color:logFilter===m?"white":C.textM,fontSize:11,cursor:"pointer",fontWeight:700,textTransform:"capitalize"}}>{m==="all"?"All":m}</button>))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {shown.slice(0,50).map(log=>{const icon=MODULE_ICONS[log.module]||"📌";const ts=new Date(log.timestamp);return(<div key={log.id} style={{display:"flex",gap:12,padding:"10px 14px",background:"white",borderRadius:12,border:`1px solid ${C.border}`,alignItems:"flex-start"}}>
          <div style={{width:32,height:32,borderRadius:10,background:`${C.navy}10`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
              <div style={{fontSize:12,fontWeight:800,color:C.text}}>{log.action}</div>
              <div style={{fontSize:10,color:C.textL,whiteSpace:"nowrap"}}>{ts.toLocaleString("en-KE",{dateStyle:"short",timeStyle:"short"})}</div>
            </div>
            <div style={{fontSize:11,color:C.textM,marginTop:2}}>{log.details}</div>
            <div style={{fontSize:10,color:C.textL,marginTop:3}}>👤 {log.user} · <span style={{textTransform:"capitalize"}}>{log.module}</span></div>
          </div>
        </div>);})}
        {shown.length===0&&<div style={{textAlign:"center",padding:40,color:C.textL}}>No activity logged yet.</div>}
      </div>
    </div>);
  };
  return(<div><SectionTitle title="Settings & Customisation" sub="System configuration — Admin access only"/><SubTabs tabs={TABS} active={sub} setActive={setSub}/>{sub==="identity"&&<IdentityTab/>}{sub==="themes"&&<ThemesTab/>}{sub==="modules"&&<ModulesTab/>}{sub==="roles"&&<RolesTab/>}{sub==="villas"&&<VillasTab/>}{sub==="devotions"&&<DevotionsTab/>}{sub==="apikeys"&&<APIKeysTab/>}{sub==="export"&&<DataExportTab/>}{sub==="activitylog"&&<ActivityLogTab/>}</div>);
};

// ═══════════════════════════════════════════════════════════════
// ─── MY INFO VIEW (SECURE SELF-SERVICE FOR NON-ADMIN) ───────
// ═══════════════════════════════════════════════════════════════
const MyHRView=({staff,payroll,advances,leaves,leaveBalances,shifts,role})=>{
  // Map role to staff member — each role only sees their own data
  const ROLE_STAFF_MAP={receptionist:[3,4,5],housekeeping:[6,7,8],maintenance:[9,10],kitchen:[11,12],sales:[2],grounds:[15]};
  const myIds=ROLE_STAFF_MAP[role?.id]||[];
  const myStaff=staff.filter(s=>myIds.includes(s.id));
  const[selStaff,setSelStaff]=useState(myIds[0]||null);
  const me=staff.find(s=>s.id===selStaff)||myStaff[0]||null;
  if(!me)return(<div style={{textAlign:"center",padding:60}}><div style={{fontSize:40,marginBottom:14}}>👤</div><div style={{fontSize:16,fontWeight:700,color:C.text}}>No Staff Profile Found</div><div style={{fontSize:13,color:C.textL,marginTop:6}}>Contact Admin to link your profile.</div></div>);
  const net=me.salary-me.nssf-me.nhif-me.tax;
  const myPayroll=payroll.filter(p=>p.staffId===me.id);const latestPay=myPayroll[0]||{};
  const myAdvances=advances.filter(a=>a.staffId===me.id);
  const myLeaves=leaves.filter(l=>l.staffId===me.id);
  const myBal=leaveBalances.find(lb=>lb.staffId===me.id)||{annual:21,annualUsed:0,sick:10,sickUsed:0};
  const myShifts=shifts.filter(s=>s.staffId===me.id);
  return(<div>
    <SectionTitle title="My Info" sub="Your personal HR details — confidential"/>
    {/* Staff selector if role has multiple staff */}
    {myStaff.length>1&&(<div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>{myStaff.map(s=>(<button key={s.id} onClick={()=>setSelStaff(s.id)} style={{padding:"8px 16px",borderRadius:12,border:`2px solid ${selStaff===s.id?C.navy:C.border}`,background:selStaff===s.id?C.navy:"white",color:selStaff===s.id?"white":C.text,cursor:"pointer",fontWeight:selStaff===s.id?700:400,fontSize:12}}>{s.photo} {s.name}</button>))}</div>)}
    {/* Profile card */}
    <Card style={{marginBottom:16}}>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:48}}>{me.photo}</div>
        <div><div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:800,color:C.navy}}>{me.name}</div><div style={{fontSize:13,color:C.textM}}>{me.role} · {me.dept}</div><div style={{fontSize:12,color:C.textL,marginTop:4}}>📞 {me.phone} · 🪪 {me.idNo}</div><div style={{fontSize:12,color:C.textL}}>📅 Joined: {me.hire} · Status: <Badge label={me.status}/></div></div>
      </div>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
      {/* Payslip */}
      <Card>
        <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>💵 My Payslip — {latestPay.month||"Current"}</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {[["Gross Salary",`KSh ${me.salary.toLocaleString()}`,C.navy],["NSSF",`-KSh ${me.nssf.toLocaleString()}`,C.danger],["NHIF",`-KSh ${me.nhif.toLocaleString()}`,C.danger],["PAYE Tax",`-KSh ${me.tax.toLocaleString()}`,C.danger]].map(([l,v,c])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:C.sandL,borderRadius:8}}><span style={{fontSize:12,color:C.textM}}>{l}</span><span style={{fontSize:13,fontWeight:700,color:c}}>{v}</span></div>))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 10px",background:`${C.navy}08`,borderRadius:10,marginTop:4}}><span style={{fontSize:14,fontWeight:800,color:C.navy}}>Net Pay</span><span style={{fontSize:18,fontWeight:900,color:C.sageD}}>KSh {net.toLocaleString()}</span></div>
          <div style={{fontSize:11,color:C.textL,marginTop:4}}>🏦 {me.bank} · Acc: ****{me.acc.slice(-4)}</div>
          <Badge label={latestPay.status||"Pending"}/>
        </div>
      </Card>
      {/* Leave balance */}
      <Card>
        <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>🌴 My Leave Balance — 2026</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Annual Leave",myBal.annual,myBal.annualUsed,C.sage],["Sick Leave",myBal.sick,myBal.sickUsed,C.info],["Compassionate",myBal.compassionate||3,myBal.compassionateUsed||0,C.terra]].map(([type,total,used,color])=>{const rem=total-used;const pct=Math.round((used/total)*100);return(<div key={type}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:700,color:C.text}}>{type}</span><span style={{color:C.textL}}>{rem} of {total} remaining</span></div>
            <div style={{background:C.sandL,borderRadius:20,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:20}}/></div>
          </div>);})}
        </div>
        {myLeaves.length>0&&(<div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:10}}><div style={{fontSize:11,fontWeight:800,color:C.navy,marginBottom:6}}>My Leave Requests</div>{myLeaves.map(l=>(<div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.textM}}>{l.type} · {l.from} → {l.to} · {l.days}d</div><Badge label={l.status}/></div>))}</div>)}
      </Card>
    </div>
    {/* Advances */}
    {myAdvances.length>0&&(<Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:10}}>💸 My Salary Advances</div>{myAdvances.map(a=>(<div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>KSh {a.amount.toLocaleString()} — {a.reason}</div><div style={{fontSize:10,color:C.textL}}>Repay: {a.repayMonths} months · Repaid: {a.repaidMonths}</div></div><Badge label={a.status}/></div>))}</Card>)}
    {/* My shifts */}
    {myShifts.length>0&&(<Card><div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:10}}>🕐 My Recent Shifts</div>{myShifts.map(sh=>(<div key={sh.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:12,color:C.textM}}>{sh.date} · {sh.shift}</div><Badge label={sh.status}/></div>))}</Card>)}
    <div style={{marginTop:14,padding:"12px 16px",background:`${C.navy}06`,borderRadius:12,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:12,color:C.textL}}>🔒 This information is confidential. Only you and Admin can see your details.</div><div style={{fontSize:11,color:C.textL,marginTop:4,fontStyle:"italic"}}>"Whatever you do, work at it with all your heart, as working for the Lord." — Col 3:23</div></div>
  </div>);
};

const NightAuditView=({villas,bookings,financials,maintenance,staff,waterPower,restaurantOrders,events,laundry,poolChemistry,gardenZones,leads})=>{
  const today=todayISO();const f=financials[0]||{};const w=waterPower[0]||{};const occ=villas.filter(v=>v.status==="Occupied").length;
  const restRev=restaurantOrders.filter(o=>o.orderedAt?.startsWith(today)&&o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
  const poolLatest=poolChemistry?.[0]||{};const confRev=(events||[]).filter(e=>e.status==="Confirmed").reduce((s,e)=>s+e.total,0);
  const SECTIONS=[
    {title:"🏡 Occupancy",color:C.navy,items:[["Villas Occupied",`${occ}/10 (${occ*10}%)`],["Check-ins",bookings.filter(b=>b.checkIn===today).length],["Check-outs",bookings.filter(b=>b.checkOut===today).length],["Maintenance",villas.filter(v=>v.status==="Maintenance").length],["Cleaning",villas.filter(v=>v.status==="Cleaning").length],["Upcoming Arrivals",bookings.filter(b=>b.checkIn==="2026-03-19"&&b.status==="Upcoming").length]]},
    {title:"💰 Financials",color:C.sageD,items:[["Accommodation Revenue",`KSh ${(f.revenue||0).toLocaleString()}`],["Restaurant Revenue",`KSh ${restRev.toLocaleString()}`],["Conference Revenue",`KSh ${confRev.toLocaleString()}`],["Total Revenue",`KSh ${((f.revenue||0)+restRev).toLocaleString()}`],["Operating Expenses",`KSh ${(f.expenses||0).toLocaleString()}`],["Net Profit",`KSh ${((f.revenue||0)+restRev-(f.expenses||0)).toLocaleString()}`]]},
    {title:"🍽 Restaurant",color:"#00796B",items:[["Orders Today",restaurantOrders.filter(o=>o.orderedAt?.startsWith(today)).length],["Revenue Today",`KSh ${restRev.toLocaleString()}`],["Active Orders",restaurantOrders.filter(o=>["Pending","Preparing","Ready"].includes(o.status)).length],["Room Service",restaurantOrders.filter(o=>o.type==="Room Service"&&o.orderedAt?.startsWith(today)).length]]},
    {title:"🎪 Conference & Events",color:C.terra,items:[["Confirmed Events",(events||[]).filter(e=>e.status==="Confirmed").length],["Tentative",(events||[]).filter(e=>e.status==="Tentative").length],["Confirmed Revenue",`KSh ${confRev.toLocaleString()}`],["Deposits Held",`KSh ${(events||[]).reduce((s,e)=>s+e.deposit,0).toLocaleString()}`]]},
    {title:"🏊 Pool & Recreation",color:"#1565C0",items:[["Pool Status",poolLatest.status||"—"],["pH Level",poolLatest.ph||"—"],["Chlorine ppm",poolLatest.chlorine||"—"],["Water Temp",`${poolLatest.temp||"—"}°C`]]},
    {title:"🌿 Grounds & Garden",color:C.sageD,items:[["Zones OK",(gardenZones||[]).filter(z=>z.status==="Good").length],["Needs Care",(gardenZones||[]).filter(z=>z.status==="Needs Care").length],["Critical",(gardenZones||[]).filter(z=>z.status==="Critical").length],["Total Zones",(gardenZones||[]).length]]},
    {title:"👕 Laundry",color:"#6A1B9A",items:[["Active Jobs",(laundry||[]).filter(j=>j.stage!=="Delivered").length],["Delivered Today",(laundry||[]).filter(j=>j.stage==="Delivered").length],["In Wash",(laundry||[]).filter(j=>["Washing","Drying"].includes(j.stage)).length],["Pending Collection",(laundry||[]).filter(j=>j.stage==="Collected").length]]},
    {title:"🎯 Sales Pipeline",color:C.gold,items:[["Active Leads",(leads||[]).filter(l=>!["Won","Lost"].includes(l.stage)).length],["Pipeline Value",`KSh ${((leads||[]).filter(l=>!["Won","Lost"].includes(l.stage)).reduce((s,l)=>s+l.value,0)/1000).toFixed(0)}k`],["Won This Month",(leads||[]).filter(l=>l.stage==="Won").length],["Conversion Rate",`${(leads||[]).length?Math.round(((leads||[]).filter(l=>l.stage==="Won").length/(leads||[]).length)*100):0}%`]]},
    {title:"💧 Utilities",color:C.info,items:[["Pump Hours",`${w.pumpHours||"—"} hrs`],["Tank Level",`${w.tankLevel||"—"}%`],["Electricity",`${w.electricityKwh||"—"} kWh`],["Notes",w.notes||"—"]]},
    {title:"🔧 Maintenance",color:"#E65100",items:[["Open Issues",maintenance.filter(m=>m.status==="Open").length],["In Progress",maintenance.filter(m=>m.status==="In Progress").length],["High Priority",maintenance.filter(m=>m.priority==="High"&&m.status!=="Resolved").length],["Resolved Today",maintenance.filter(m=>m.resolved===today).length]]},
    {title:"👥 Staffing",color:"#4A148C",items:[["Total Staff",staff.length],["Night Security","Paul Esekon"],["Emergency Contact","Aggrey Ochieng +254 722 100 001"],["Kitchen Close","Chef Emmanuel Liru – 10PM"]]},
  ];
  return(<div><SectionTitle title="Night Audit Report" sub={`End-of-day summary · ${today} · Generated by CHABBS System`}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      {SECTIONS.map(sec=>(<Card key={sec.title}><div style={{fontSize:13,fontWeight:800,color:sec.color,marginBottom:10,paddingBottom:8,borderBottom:`2px solid ${sec.color}20`}}>{sec.title}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{sec.items.map(([l,v])=>(<div key={l} style={{padding:"7px 9px",background:C.sandL,borderRadius:8}}><div style={{fontSize:10,color:C.textL,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{l}</div><div style={{fontSize:13,fontWeight:800,color:C.text,marginTop:2}}>{v}</div></div>))}</div></Card>))}
    </div>
    <Card style={{marginBottom:14}}><div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10,paddingBottom:8,borderBottom:`2px solid ${C.navy}20`}}>👤 Active Guests</div>{bookings.filter(b=>b.status==="Checked In").map(b=>(<div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontSize:12,fontWeight:700}}>{b.guest}</div><div style={{fontSize:11,color:C.textL}}>Villa {b.villaId} · Out: {b.checkOut}</div></div><div style={{display:"flex",gap:7}}><Badge label={b.status}/><Badge label={b.payment}/></div></div>))}</Card>
    <div style={{marginTop:14,padding:"12px 16px",background:`linear-gradient(135deg,${C.navy}08,${C.sage}08)`,borderRadius:12,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:13,fontStyle:"italic",color:C.textM}}>"He who watches over Israel will neither slumber nor sleep." — Psalm 121:4</div><div style={{fontSize:11,color:C.textL,marginTop:3}}>The Lord watches over CHABBS Resort through the night. Rest secure in His care.</div></div>
  </div>);
};

// ─── PERSISTENCE ──────────────────────────────────────────────
const STORAGE_KEY='chabbs_v2';
const loadSaved=(key,def)=>{try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return s[key]??def;}catch{return def;}};

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App(){
  const[user,setUser]=useState(null);const[view,setView]=useState("dashboard");const[devotion,setDevotion]=useState(null);const[showDev,setShowDev]=useState(false);const[col,setCol]=useState(false);
  const[toast,setToast]=useState(null);
  const showToast=(msg,type="info")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  // Core state — initialised from localStorage if available, otherwise seed data
  const[villas,setVillas]=useState(()=>loadSaved('villas',INITIAL_VILLAS));
  const[bookings,setBookings]=useState(()=>loadSaved('bookings',INITIAL_BOOKINGS));
  const[maintenance,setMaintenance]=useState(()=>loadSaved('maintenance',INITIAL_MAINTENANCE));
  const[assets,setAssets]=useState(()=>loadSaved('assets',INITIAL_ASSETS));
  const[schedule,setSchedule]=useState(()=>loadSaved('schedule',PREVENTIVE_SCHEDULE));
  const[housekeeping,setHousekeeping]=useState(()=>loadSaved('housekeeping',INITIAL_HOUSEKEEPING));
  const[waterPower,setWaterPower]=useState(()=>loadSaved('waterPower',INITIAL_WATER));
  const[financials,setFinancials]=useState(()=>loadSaved('financials',INITIAL_FINANCIALS));
  const[staff,setStaff]=useState(()=>loadSaved('staff',INITIAL_STAFF));
  const[payroll,setPayroll]=useState(()=>loadSaved('payroll',INITIAL_PAYROLL));
  const[advances,setAdvances]=useState(()=>loadSaved('advances',INITIAL_ADVANCES));
  const[leaves,setLeaves]=useState(()=>loadSaved('leaves',INITIAL_LEAVES));
  const[leaveBalances,setLeaveBalances]=useState(()=>loadSaved('leaveBalances',INITIAL_LEAVE_BAL));
  const[shifts,setShifts]=useState(()=>loadSaved('shifts',INITIAL_SHIFTS));
  const[performance]=useState(INITIAL_PERFORMANCE);
  const[training,setTraining]=useState(()=>loadSaved('training',INITIAL_TRAINING));
  const[pettyCash,setPettyCash]=useState(()=>loadSaved('pettyCash',INITIAL_PETTY_CASH));
  const[surveys,setSurveys]=useState(()=>loadSaved('surveys',INITIAL_SURVEYS));
  const[inventory,setInventory]=useState(()=>loadSaved('inventory',INITIAL_INVENTORY));
  const[purchaseOrders,setPurchaseOrders]=useState(()=>loadSaved('purchaseOrders',INITIAL_POS));
  const[suppliers]=useState(INITIAL_SUPPLIERS);
  const[feedback,setFeedback]=useState(()=>loadSaved('feedback',INITIAL_FEEDBACK));
  const[lostFound,setLostFound]=useState(()=>loadSaved('lostFound',INITIAL_LOSTFOUND));
  const[restaurantOrders,setRestaurantOrders]=useState(()=>loadSaved('restaurantOrders',INITIAL_RESTAURANT_ORDERS));
  const[menu,setMenu]=useState(()=>loadSaved('menu',INITIAL_MENU));
  const[specials,setSpecials]=useState(()=>loadSaved('specials',[]));
  const[leads,setLeads]=useState(()=>loadSaved('leads',INITIAL_LEADS));
  const[packages,setPackages]=useState(()=>loadSaved('packages',INITIAL_PACKAGES));
  const[marketingTasks,setMarketingTasks]=useState(()=>loadSaved('marketingTasks',INITIAL_MARKETING_TASKS));
  const[socialPosts,setSocialPosts]=useState(()=>loadSaved('socialPosts',INITIAL_SOCIAL_POSTS));
  const[emailCampaigns,setEmailCampaigns]=useState(()=>loadSaved('emailCampaigns',INITIAL_EMAIL_CAMPAIGNS));
  const[guestCRM,setGuestCRM]=useState(()=>loadSaved('guestCRM',INITIAL_GUEST_CRM));
  const[socialInbox,setSocialInbox]=useState(()=>loadSaved('socialInbox',INITIAL_SOCIAL_INBOX));
  const[gardenZones,setGardenZones]=useState(()=>loadSaved('gardenZones',INITIAL_GARDEN_ZONES));
  const[gardenTasks,setGardenTasks]=useState(()=>loadSaved('gardenTasks',INITIAL_GARDEN_TASKS));
  const[plants,setPlants]=useState(()=>loadSaved('plants',INITIAL_PLANTS));
  const[events,setEvents]=useState(()=>loadSaved('events',INITIAL_EVENTS));
  const[laundry,setLaundry]=useState(()=>loadSaved('laundry',INITIAL_LAUNDRY));
  const[poolChemistry,setPoolChemistry]=useState(()=>loadSaved('poolChemistry',INITIAL_POOL_CHEMISTRY));
  const[poolActivities,setPoolActivities]=useState(()=>loadSaved('poolActivities',INITIAL_POOL_ACTIVITIES));
  const[poolMaintenance,setPoolMaintenance]=useState(()=>loadSaved('poolMaintenance',INITIAL_POOL_MAINTENANCE));
  const[settings,setSettings]=useState(()=>loadSaved('settings',{name:"CHABBS",tagline:"Resort & Conference Centre",location:"Lodwar · Turkana County · Kenya",currency:"KSh",motto:"Commit your work to the Lord",crossSymbol:"✟",theme:"Turkana Earth",enabledModules:null,roles:null,villaConfig:null,claudeApiKey:""}));
  const[activityLog,setActivityLog]=useState(()=>loadSaved('activityLog',[{id:1,timestamp:"2026-03-18T08:00:00",user:"System",action:"System Started",details:"CHABBS Resort Management System initialised",module:"system"},{id:2,timestamp:"2026-03-18T07:45:00",user:"Grace Akello",action:"Villa Status Changed",details:"Villa 8 → Cleaning",module:"villas"},{id:3,timestamp:"2026-03-18T07:30:00",user:"Daniel Ekwang",action:"Booking Created",details:"Johnson Family — Villa 2 (2026-03-16→2026-03-20)",module:"bookings"},{id:4,timestamp:"2026-03-18T07:15:00",user:"Chef Emmanuel",action:"Order Placed",details:"Table 3: Grilled Tilapia ×2, Kenyan Chai ×2 — KSh 2,100",module:"restaurant"}]));
  const logActivity=(action,details,module)=>setActivityLog(p=>[{id:Date.now(),timestamp:new Date().toISOString(),user:user?.name||"System",action,details,module},...p].slice(0,200));
  // Auto-save all mutable state to localStorage (debounced 1.5 s)
  const _saveTimer=useRef(null);
  useEffect(()=>{
    clearTimeout(_saveTimer.current);
    _saveTimer.current=setTimeout(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify({villas,bookings,maintenance,assets,schedule,housekeeping,waterPower,financials:financials.slice(0,365),staff,payroll,advances,leaves,leaveBalances,shifts,training,pettyCash,surveys,inventory,purchaseOrders,feedback,lostFound,restaurantOrders:restaurantOrders.slice(0,500),menu,specials,leads,packages,marketingTasks,socialPosts,emailCampaigns,guestCRM,socialInbox,gardenZones,gardenTasks,plants,events,laundry,poolChemistry,poolActivities,poolMaintenance,settings,activityLog}));}catch{}},1500);
  });

  useEffect(()=>{const s=document.createElement("style");s.textContent=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap');*{margin:0;padding:0;box-sizing:border-box;font-family:'DM Sans',sans-serif;}body{background:#FAF6EE;overflow:hidden;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#F4ECD8;}::-webkit-scrollbar-thumb{background:#C9B89A;border-radius:3px;}button,input,select,textarea{font-family:'DM Sans',sans-serif;}`;document.head.appendChild(s);return()=>document.head.removeChild(s);},[]);

  const login=role=>{setUser(role);setDevotion(DEVOTIONS[Math.floor(Math.random()*DEVOTIONS.length)]);setShowDev(true);setView(role.id==="housekeeping"?"housekeeping":role.id==="maintenance"?"maintenance":role.id==="kitchen"?"restaurant":role.id==="sales"?"sales":role.id==="grounds"?"gardening":"dashboard");};

  // Compute alerts for sidebar badges and TopBar
  const alerts={
    maintenance:maintenance.filter(m=>m.status==="Open"||m.status==="In Progress").length,
    restaurant:restaurantOrders.filter(o=>["Pending","Preparing"].includes(o.status)).length,
    inventory:inventory.filter(i=>i.qty<=i.minQty).length,
    housekeeping:housekeeping.filter(t=>t.status!=="Complete").length,
    laundry:laundry.filter(j=>j.stage!=="Delivered").length,
    gardening:gardenZones.filter(z=>z.status==="Critical").length,
    hr:leaves.filter(l=>l.status==="Pending").length+advances.filter(a=>a.status==="Pending Approval").length,
  };

  return !user?<LoginScreen onLogin={login}/>:(
    <><div style={{display:"flex",height:"100vh",overflow:"hidden",background:"#FAF6EE"}}>
      {showDev&&devotion&&<DevotionPopup devotion={devotion} user={user} onClose={()=>setShowDev(false)}/>}
      <Sidebar view={view} setView={setView} role={user} onLogout={()=>{setUser(null);setView("dashboard");}} col={col} setCol={setCol} alerts={alerts}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <TopBar user={user} alerts={alerts} setView={setView}/>
        <main style={{flex:1,overflowY:"auto",padding:24,background:"#FAF6EE"}}>
        {view==="dashboard"   &&<Dashboard villas={villas} bookings={bookings} financials={financials} maintenance={maintenance} staff={staff} restaurantOrders={restaurantOrders} gardenZones={gardenZones} poolChemistry={poolChemistry} laundry={laundry} events={events} leads={leads} setView={setView}/>}
        {view==="villas"      &&<VillasView villas={villas} setVillas={setVillas} role={user} showToast={showToast}/>}
        {view==="bookings"    &&<BookingsView bookings={bookings} setBookings={setBookings} villas={villas} setVillas={setVillas} role={user} logActivity={logActivity}/>}
        {view==="housekeeping"&&<HousekeepingView tasks={housekeeping} setTasks={setHousekeeping}/>}
        {view==="laundry"     &&<LaundryView laundry={laundry} setLaundry={setLaundry}/>}
        {view==="maintenance" &&<MaintenanceView logs={maintenance} setLogs={setMaintenance} assets={assets} setAssets={setAssets} schedule={schedule} setSchedule={setSchedule}/>}
        {view==="waterpower"  &&<WaterPowerView readings={waterPower} setReadings={setWaterPower}/>}
        {view==="financials"  &&<FinancialsView financials={financials} setFinancials={setFinancials} restaurantOrders={restaurantOrders} pettyCash={pettyCash} setPettyCash={setPettyCash} payroll={payroll} staff={staff}/>}
        {view==="stewardship" &&<StewardshipView readings={waterPower} financials={financials} restaurantOrders={restaurantOrders}/>}
        {view==="restaurant"  &&<RestaurantView orders={restaurantOrders} setOrders={setRestaurantOrders} menu={menu} setMenu={setMenu} villas={villas} role={user} specials={specials} setSpecials={setSpecials} showToast={showToast}/>}
        {view==="conference"  &&<ConferenceView events={events} setEvents={setEvents} venues={CONFERENCE_VENUES}/>}
        {view==="sales"       &&<SalesMarketingView leads={leads} setLeads={setLeads} packages={packages} setPackages={setPackages} marketingTasks={marketingTasks} setMarketingTasks={setMarketingTasks} bookings={bookings} villas={villas} role={user} socialPosts={socialPosts} setSocialPosts={setSocialPosts} emailCampaigns={emailCampaigns} setEmailCampaigns={setEmailCampaigns} guestCRM={guestCRM} setGuestCRM={setGuestCRM} socialInbox={socialInbox} setSocialInbox={setSocialInbox} settings={settings}/>}
        {view==="gardening"   &&<GardeningView zones={gardenZones} setZones={setGardenZones} gardenTasks={gardenTasks} setGardenTasks={setGardenTasks} plants={plants} setPlants={setPlants}/>}
        {view==="pool"        &&<PoolView poolChemistry={poolChemistry} setPoolChemistry={setPoolChemistry} poolActivities={poolActivities} setPoolActivities={setPoolActivities} poolMaintenance={poolMaintenance} setPoolMaintenance={setPoolMaintenance}/>}
        {view==="hr"          &&<HRView staff={staff} setStaff={setStaff} payroll={payroll} setPayroll={setPayroll} advances={advances} setAdvances={setAdvances} leaves={leaves} setLeaves={setLeaves} leaveBalances={leaveBalances} shifts={shifts} setShifts={setShifts} performance={performance} training={training} setTraining={setTraining} surveys={surveys} setSurveys={setSurveys} role={user}/>}
        {view==="myhr"        &&<MyHRView staff={staff} payroll={payroll} advances={advances} leaves={leaves} leaveBalances={leaveBalances} shifts={shifts} role={user}/>}
        {view==="inventory"   &&<InventoryView inventory={inventory} setInventory={setInventory} purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} suppliers={suppliers}/>}
        {view==="feedback"    &&<FeedbackView feedback={feedback} setFeedback={setFeedback}/>}
        {view==="lostfound"   &&<LostFoundView items={lostFound} setItems={setLostFound}/>}
        {view==="nightaudit"  &&<NightAuditView villas={villas} bookings={bookings} financials={financials} maintenance={maintenance} staff={staff} waterPower={waterPower} restaurantOrders={restaurantOrders} events={events} laundry={laundry} poolChemistry={poolChemistry} gardenZones={gardenZones} leads={leads}/>}
        {view==="settings"    &&<SettingsView settings={settings} setSettings={setSettings} devotions={DEVOTIONS} role={user} activityLog={activityLog}/>}
      </main>
      </div>
    </div>
    {toast&&(<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:9999,padding:"12px 24px",borderRadius:14,fontWeight:700,fontSize:13,color:"white",background:toast.type==="warning"?"#E65100":toast.type==="success"?"#2E7D32":"#1565C0",boxShadow:"0 6px 24px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",gap:10,minWidth:200,maxWidth:400}}>{toast.type==="warning"?"⚠️":toast.type==="success"?"✅":"ℹ️"} {toast.msg}</div>)}
    </>
  );
}
