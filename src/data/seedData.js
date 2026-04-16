// CHABBS RESORT — SEED DATA

export const DEVOTIONS=[
  {verse:"Colossians 3:23",text:"Whatever you do, work heartily, as for the Lord and not for men.",value:"Excellence",message:"Serve every guest as if serving God Himself. Let excellence be your signature today."},
  {verse:"Mark 10:43-44",text:"Whoever wants to become great among you must be your servant.",value:"Servant Leadership",message:"True greatness at CHABBS is measured by how well we serve — guests, colleagues, and community alike."},
  {verse:"Proverbs 11:3",text:"The integrity of the upright guides them.",value:"Integrity",message:"In every transaction, every report, every interaction — let your yes be yes. Build trust today."},
  {verse:"Genesis 2:15",text:"The Lord God put man in the garden to work it and keep it.",value:"Stewardship",message:"Our water, electricity, and resources are gifts. Use them wisely. Record accurately. Waste nothing."},
  {verse:"Romans 12:13",text:"Share with the Lord's people who are in need. Practice hospitality.",value:"Hospitality",message:"Every guest brings a story. Welcome them warmly. A smile costs nothing but means everything."},
  {verse:"Philippians 4:8",text:"Whatever is true, noble, right, pure, lovely — think about such things.",value:"Purity of Heart",message:"Let the atmosphere of CHABBS reflect the peace of God. Clean spaces, clean hearts, clean hands."},
  {verse:"Luke 16:10",text:"Whoever is faithful in very little is also faithful in much.",value:"Faithfulness",message:"Check the maintenance log. Update the housekeeping record. Small faithfulness builds great character."},
];

export const ROOM_SPECS={
  exec:{name:"Executive",short:"Exec",icon:"👑",ensuite:true,screen:true,bath:true,shower:false,desc:"King bed · Ensuite bathtub · TV screen · Work desk",color:"#C9952A",bg:"#FFF8E1"},
  dl:  {name:"Deluxe Left", short:"DL",icon:"🛏",ensuite:true,screen:false,bath:false,shower:true,desc:"Queen bed · Ensuite shower · Wardrobe",color:"#1565C0",bg:"#E3F2FD"},
  dr:  {name:"Deluxe Right",short:"DR",icon:"🛏",ensuite:true,screen:false,bath:false,shower:true,desc:"Queen bed · Ensuite shower · Wardrobe",color:"#4A148C",bg:"#EDE7F6"},
};
export const VILLA_AMENITIES=[
  {icon:"📺",label:"Sitting Room",detail:"Fully furnished · Smart TV · Sofa set"},
  {icon:"🍽",label:"Dining Room",detail:"6-seater table · Full crockery & cutlery"},
  {icon:"🍳",label:"Kitchen",detail:"Cooker + oven · Microwave · Fridge · Full kitchenware"},
  {icon:"🚗",label:"Parking",detail:"Dedicated parking space · Secure compound"},
];

// ─── RESTAURANT DATA ──────────────────────────────────────────
export const MENU_CATEGORIES=["Breakfast","Lunch","Dinner","Snacks & Sides","Beverages","Desserts"];
export const INITIAL_MENU=[
  // BREAKFAST
  {id:1, name:"Full English Breakfast",cat:"Breakfast",price:650,desc:"Eggs, sausage, bacon, beans, toast, grilled tomato",available:true,emoji:"🍳",prep:15},
  {id:2, name:"Mandazi & Chai",cat:"Breakfast",price:200,desc:"Fresh mandazi with Kenyan spiced chai tea",available:true,emoji:"☕",prep:8},
  {id:3, name:"Fruit Salad Bowl",cat:"Breakfast",price:350,desc:"Fresh tropical fruits with honey drizzle",available:true,emoji:"🍓",prep:10},
  {id:4, name:"Omelette (3 eggs)",cat:"Breakfast",price:420,desc:"Choice of: plain, cheese, vegetable or chicken",available:true,emoji:"🥚",prep:12},
  {id:5, name:"Pancakes & Syrup",cat:"Breakfast",price:380,desc:"Fluffy pancakes with maple syrup & butter",available:true,emoji:"🥞",prep:12},
  {id:6, name:"Uji wa Wimbi",cat:"Breakfast",price:180,desc:"Traditional finger millet porridge",available:true,emoji:"🥣",prep:5},
  // LUNCH
  {id:7, name:"Grilled Tilapia",cat:"Lunch",price:900,desc:"Whole tilapia, grilled or fried, ugali & kachumbari",available:true,emoji:"🐟",prep:25},
  {id:8, name:"Beef Stew & Ugali",cat:"Lunch",price:650,desc:"Slow-cooked Turkana beef stew with fresh ugali",available:true,emoji:"🍲",prep:15},
  {id:9, name:"Chicken Biryani",cat:"Lunch",price:750,desc:"Fragrant basmati rice with spiced chicken",available:true,emoji:"🍛",prep:20},
  {id:10,name:"Club Sandwich",cat:"Lunch",price:550,desc:"Chicken, bacon, lettuce, tomato, on toasted bread",available:true,emoji:"🥪",prep:15},
  {id:11,name:"Vegetable Pilau",cat:"Lunch",price:480,desc:"Spiced rice with seasonal vegetables",available:true,emoji:"🫘",prep:20},
  {id:12,name:"Caesar Salad",cat:"Lunch",price:420,desc:"Romaine, parmesan, croutons, Caesar dressing",available:true,emoji:"🥗",prep:10},
  // DINNER
  {id:13,name:"Nyama Choma Platter",cat:"Dinner",price:1800,desc:"Premium goat/beef, roasted over charcoal. Serves 2–3",available:true,emoji:"🥩",prep:45},
  {id:14,name:"Grilled Chicken Half",cat:"Dinner",price:900,desc:"Marinated half chicken, chips or ugali, coleslaw",available:true,emoji:"🍗",prep:30},
  {id:15,name:"Pasta Arrabiata",cat:"Dinner",price:650,desc:"Penne in spicy tomato sauce, garlic bread",available:true,emoji:"🍝",prep:20},
  {id:16,name:"T-Bone Steak 300g",cat:"Dinner",price:2200,desc:"Premium beef, mushroom sauce, mashed potato, veg",available:true,emoji:"🥩",prep:35},
  {id:17,name:"Camel Meat Stew",cat:"Dinner",price:1200,desc:"Turkana specialty — slow-cooked camel, chapati",available:true,emoji:"🍲",prep:40},
  {id:18,name:"Fish & Chips",cat:"Dinner",price:780,desc:"Battered tilapia fillet, fries, tartar sauce",available:true,emoji:"🐟",prep:20},
  // SNACKS
  {id:19,name:"French Fries",cat:"Snacks & Sides",price:280,desc:"Crispy golden fries with ketchup",available:true,emoji:"🍟",prep:12},
  {id:20,name:"Chicken Wings (6)",cat:"Snacks & Sides",price:480,desc:"BBQ or peri-peri glazed wings",available:true,emoji:"🍗",prep:20},
  {id:21,name:"Spring Rolls (4)",cat:"Snacks & Sides",price:320,desc:"Crispy vegetable spring rolls with sweet chili dip",available:true,emoji:"🥢",prep:15},
  {id:22,name:"Samosas (3)",cat:"Snacks & Sides",price:200,desc:"Beef or vegetable Kenyan samosas",available:true,emoji:"🫓",prep:8},
  {id:23,name:"Chapati (2)",cat:"Snacks & Sides",price:120,desc:"Fresh hand-rolled chapati",available:true,emoji:"🫓",prep:10},
  {id:24,name:"Chips Masala",cat:"Snacks & Sides",price:350,desc:"Spiced fries with tomato & chili masala",available:true,emoji:"🌶️",prep:15},
  // BEVERAGES
  {id:25,name:"Fresh Mango Juice",cat:"Beverages",price:250,desc:"100% fresh pressed mango",available:true,emoji:"🥭",prep:5},
  {id:26,name:"Passion Fruit Juice",cat:"Beverages",price:250,desc:"Fresh passion fruit, chilled",available:true,emoji:"🍹",prep:5},
  {id:27,name:"Mineral Water 500ml",cat:"Beverages",price:80,desc:"Chilled bottled water",available:true,emoji:"💧",prep:1},
  {id:28,name:"Soda (Coke/Fanta/Sprite)",cat:"Beverages",price:120,desc:"330ml can, chilled",available:true,emoji:"🥤",prep:1},
  {id:29,name:"Kenyan Chai",cat:"Beverages",price:150,desc:"Spiced milk tea, Kenyan style",available:true,emoji:"☕",prep:5},
  {id:30,name:"Black Coffee",cat:"Beverages",price:180,desc:"Arabica drip coffee, black or with milk",available:true,emoji:"☕",prep:5},
  {id:31,name:"Avocado Smoothie",cat:"Beverages",price:320,desc:"Blended avocado, milk, honey",available:true,emoji:"🥑",prep:8},
  {id:32,name:"Watermelon Juice",cat:"Beverages",price:220,desc:"Fresh blended watermelon, no sugar",available:true,emoji:"🍉",prep:5},
  // DESSERTS
  {id:33,name:"Malva Pudding",cat:"Desserts",price:350,desc:"Warm sponge pudding, vanilla custard",available:true,emoji:"🍮",prep:15},
  {id:34,name:"Fruit Platter",cat:"Desserts",price:400,desc:"Seasonal tropical fruits",available:true,emoji:"🍍",prep:10},
  {id:35,name:"Ice Cream (2 scoops)",cat:"Desserts",price:280,desc:"Vanilla, chocolate or strawberry",available:true,emoji:"🍨",prep:5},
  {id:36,name:"Mandazi & Honey",cat:"Desserts",price:200,desc:"Fresh mandazi with local honey",available:true,emoji:"🍯",prep:8},
];

export const INITIAL_RESTAURANT_ORDERS=[
  {id:1001,table:"Table 3",type:"Dine In",server:"Daniel Ekwang",items:[{menuId:7,name:"Grilled Tilapia",qty:2,price:900},{menuId:29,name:"Kenyan Chai",qty:2,price:150}],total:2100,status:"Served",orderedAt:"2026-03-18T10:30:00",servedAt:"2026-03-18T11:00:00",paid:true,payMethod:"Cash",notes:""},
  {id:1002,table:"Villa 2 – Room Service",type:"Room Service",server:"Celestine Akiru",items:[{menuId:1,name:"Full English Breakfast",qty:3,price:650},{menuId:25,name:"Fresh Mango Juice",qty:3,price:250}],total:2700,status:"Served",orderedAt:"2026-03-18T07:15:00",servedAt:"2026-03-18T07:45:00",paid:true,payMethod:"Room Charge",notes:"For 3 guests"},
  {id:1003,table:"Table 1",type:"Dine In",server:"Prosper Loyo",items:[{menuId:13,name:"Nyama Choma Platter",qty:1,price:1800},{menuId:19,name:"French Fries",qty:2,price:280},{menuId:28,name:"Soda",qty:3,price:120}],total:2720,status:"Preparing",orderedAt:"2026-03-18T12:45:00",servedAt:null,paid:false,payMethod:"",notes:"No onions on the nyama choma"},
  {id:1004,table:"Table 5",type:"Dine In",server:"Daniel Ekwang",items:[{menuId:10,name:"Club Sandwich",qty:2,price:550},{menuId:31,name:"Avocado Smoothie",qty:2,price:320}],total:1740,status:"Pending",orderedAt:"2026-03-18T13:02:00",servedAt:null,paid:false,payMethod:"",notes:""},
  {id:1005,table:"Villa 3 – Room Service",type:"Room Service",server:"Celestine Akiru",items:[{menuId:30,name:"Black Coffee",qty:4,price:180},{menuId:22,name:"Samosas (3)",qty:2,price:200}],total:1120,status:"Ready",orderedAt:"2026-03-18T14:15:00",servedAt:null,paid:false,payMethod:"",notes:"UNICEF team – 4 people"},
];

export const INITIAL_VILLAS=Array.from({length:10},(_,i)=>{
  const s=["Available","Occupied","Occupied","Available","Maintenance","Available","Occupied","Cleaning","Available","Available"][i];
  const g=["","Johnson Family","NGO Team – UNICEF","","","","Bishop Omondi","","",""][i];
  const occ=s==="Occupied";
  return{id:i+1,name:`Villa ${i+1}`,status:s,guests:g,lastCleaned:"2026-03-17",rateWhole:12000,rateRoom:4500,
    rooms:[{id:`${i+1}-exec`,type:"exec",status:occ?"Occupied":"Available"},{id:`${i+1}-dl`,type:"dl",status:occ?"Occupied":"Available"},{id:`${i+1}-dr`,type:"dr",status:"Available"}]};
});

export const INITIAL_BOOKINGS=[
  {id:1,guest:"Johnson Family",phone:"+254 712 345 678",idNo:"28734561",checkIn:"2026-03-16",checkOut:"2026-03-20",type:"Whole Villa",villaId:2,rooms:[],status:"Checked In",payment:"Paid",amount:48000,nights:4,color:"#1565C0"},
  {id:2,guest:"UNICEF Field Team",phone:"+254 733 456 789",idNo:"ORG-2847",checkIn:"2026-03-15",checkOut:"2026-03-22",type:"Whole Villa",villaId:3,rooms:[],status:"Checked In",payment:"Invoice",amount:84000,nights:7,color:"#6A1B9A"},
  {id:3,guest:"Bishop Emmanuel Omondi",phone:"+254 722 567 890",idNo:"39812045",checkIn:"2026-03-17",checkOut:"2026-03-19",type:"Whole Villa",villaId:7,rooms:[],status:"Checked In",payment:"Paid",amount:24000,nights:2,color:"#2E7D32"},
  {id:4,guest:"Dr. Amina Hassan",phone:"+254 701 678 901",idNo:"47291038",checkIn:"2026-03-19",checkOut:"2026-03-21",type:"Per Room",villaId:1,rooms:["exec"],status:"Upcoming",payment:"Deposit",amount:9000,nights:2,color:"#E65100"},
  {id:5,guest:"Turkana County Governor",phone:"+254 745 789 012",idNo:"GOV-TC-001",checkIn:"2026-03-20",checkOut:"2026-03-23",type:"Whole Villa",villaId:4,rooms:[],status:"Upcoming",payment:"Pending",amount:36000,nights:3,color:"#B71C1C"},
  {id:6,guest:"Rev. Samuel Ekiru",phone:"+254 708 111 222",idNo:"55678901",checkIn:"2026-03-24",checkOut:"2026-03-26",type:"Whole Villa",villaId:6,rooms:[],status:"Upcoming",payment:"Deposit",amount:24000,nights:2,color:"#004D40"},
  {id:7,guest:"Médecins Sans Frontières",phone:"+254 734 333 444",idNo:"MSF-LDW02",checkIn:"2026-03-10",checkOut:"2026-03-18",type:"Whole Villa",villaId:9,rooms:[],status:"Checked Out",payment:"Paid",amount:96000,nights:8,color:"#37474F"},
  {id:8,guest:"Dr. Nakiru Loise",phone:"+254 720 555 666",idNo:"61234567",checkIn:"2026-03-28",checkOut:"2026-03-30",type:"Per Room",villaId:5,rooms:["dl","dr"],status:"Upcoming",payment:"Pending",amount:18000,nights:2,color:"#880E4F"},
];

export const INITIAL_STAFF=[
  {id:1,name:"Aggrey Ochieng",role:"General Manager",dept:"Management",phone:"+254 722 100 001",idNo:"12345678",hire:"2022-01-15",salary:85000,nssf:1080,nhif:1700,tax:18600,bank:"Equity Bank",acc:"0123456789",status:"Active",photo:"👨‍💼"},
  {id:2,name:"Martha Auma",role:"Assistant Manager",dept:"Management",phone:"+254 733 100 002",idNo:"23456789",hire:"2022-03-01",salary:55000,nssf:1080,nhif:1700,tax:9000,bank:"KCB",acc:"1234567890",status:"Active",photo:"👩‍💼"},
  {id:3,name:"Daniel Ekwang",role:"Head Receptionist",dept:"Front Office",phone:"+254 700 100 003",idNo:"34567890",hire:"2022-06-15",salary:38000,nssf:1080,nhif:1000,tax:4800,bank:"Cooperative",acc:"2345678901",status:"Active",photo:"👨‍💻"},
  {id:4,name:"Celestine Akiru",role:"Receptionist",dept:"Front Office",phone:"+254 711 100 004",idNo:"45678901",hire:"2023-01-10",salary:28000,nssf:1080,nhif:1000,tax:2400,bank:"Equity Bank",acc:"3456789012",status:"Active",photo:"👩‍💻"},
  {id:5,name:"Prosper Loyo",role:"Receptionist",dept:"Front Office",phone:"+254 712 100 005",idNo:"56789012",hire:"2023-06-01",salary:28000,nssf:1080,nhif:1000,tax:2400,bank:"Absa",acc:"4567890123",status:"Active",photo:"👨‍💻"},
  {id:6,name:"Grace Akello",role:"Head Housekeeper",dept:"Housekeeping",phone:"+254 701 100 006",idNo:"67890123",hire:"2022-04-20",salary:32000,nssf:1080,nhif:1000,tax:3000,bank:"KCB",acc:"5678901234",status:"Active",photo:"👩‍🍳"},
  {id:7,name:"Sarah Lopeyok",role:"Housekeeper",dept:"Housekeeping",phone:"+254 724 100 007",idNo:"78901234",hire:"2023-02-14",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Equity Bank",acc:"6789012345",status:"Active",photo:"👩"},
  {id:8,name:"Mary Wanjiku",role:"Housekeeper",dept:"Housekeeping",phone:"+254 735 100 008",idNo:"89012345",hire:"2023-09-01",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Cooperative",acc:"7890123456",status:"Active",photo:"👩"},
  {id:9,name:"James Okwany",role:"Head of Maintenance",dept:"Maintenance",phone:"+254 746 100 009",idNo:"90123456",hire:"2022-02-28",salary:40000,nssf:1080,nhif:1000,tax:5400,bank:"KCB",acc:"8901234567",status:"Active",photo:"👨‍🔧"},
  {id:10,name:"Peter Kimani",role:"Maintenance Technician",dept:"Maintenance",phone:"+254 707 100 010",idNo:"01234567",hire:"2023-03-15",salary:28000,nssf:1080,nhif:1000,tax:2400,bank:"Equity Bank",acc:"9012345678",status:"Active",photo:"👨‍🔧"},
  {id:11,name:"Chef Emmanuel Liru",role:"Head Chef",dept:"Kitchen",phone:"+254 718 100 011",idNo:"11234567",hire:"2022-07-01",salary:45000,nssf:1080,nhif:1700,tax:6600,bank:"Absa",acc:"0123456780",status:"Active",photo:"👨‍🍳"},
  {id:12,name:"Joyce Nakwam",role:"Kitchen Assistant",dept:"Kitchen",phone:"+254 729 100 012",idNo:"22345678",hire:"2024-01-15",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Cooperative",acc:"1234567891",status:"Active",photo:"👩‍🍳"},
  {id:13,name:"Paul Esekon",role:"Security Officer",dept:"Security",phone:"+254 740 100 013",idNo:"33456789",hire:"2022-10-01",salary:20000,nssf:1080,nhif:500,tax:0,bank:"KCB",acc:"2345678902",status:"Active",photo:"💂"},
  {id:14,name:"John Losike",role:"Security Officer",dept:"Security",phone:"+254 751 100 014",idNo:"44567890",hire:"2023-07-01",salary:20000,nssf:1080,nhif:500,tax:0,bank:"Equity Bank",acc:"3456789013",status:"Active",photo:"💂"},
  {id:15,name:"Simon Ewoton",role:"Driver / Groundskeeper",dept:"Operations",phone:"+254 762 100 015",idNo:"55678901",hire:"2023-04-20",salary:22000,nssf:1080,nhif:500,tax:0,bank:"Cooperative",acc:"4567890124",status:"Active",photo:"🚗"},
];

export const CUR_MONTH="March 2026";
export const INITIAL_PAYROLL=INITIAL_STAFF.map(s=>{const gross=s.salary,ded=s.nssf+s.nhif+s.tax,net=gross-ded;return{id:s.id,staffId:s.id,month:CUR_MONTH,gross,nssf:s.nssf,nhif:s.nhif,tax:s.tax,deductions:ded,net,status:s.id<=5?"Paid":"Pending",paidDate:s.id<=5?"2026-03-28":null,notes:""};});

export const INITIAL_ADVANCES=[
  {id:1,staffId:7,staffName:"Sarah Lopeyok",amount:5000,reason:"School fees for child",date:"2026-03-05",repayMonths:2,repaidMonths:0,status:"Active",approvedBy:"Aggrey Ochieng"},
  {id:2,staffId:10,staffName:"Peter Kimani",amount:8000,reason:"Medical emergency",date:"2026-02-20",repayMonths:3,repaidMonths:1,status:"Active",approvedBy:"Aggrey Ochieng"},
  {id:3,staffId:12,staffName:"Joyce Nakwam",amount:3000,reason:"House rent deposit",date:"2026-01-15",repayMonths:2,repaidMonths:2,status:"Cleared",approvedBy:"Martha Auma"},
  {id:4,staffId:15,staffName:"Simon Ewoton",amount:6000,reason:"Funeral expenses",date:"2026-03-10",repayMonths:2,repaidMonths:0,status:"Pending Approval",approvedBy:""},
];

export const INITIAL_LEAVES=[
  {id:1,staffId:7,staffName:"Sarah Lopeyok",type:"Annual Leave",from:"2026-04-07",to:"2026-04-14",days:7,reason:"Family visit",status:"Approved",approvedBy:"Grace Akello",appliedOn:"2026-03-12"},
  {id:2,staffId:10,staffName:"Peter Kimani",type:"Sick Leave",from:"2026-03-11",to:"2026-03-12",days:2,reason:"Malaria treatment",status:"Approved",approvedBy:"James Okwany",appliedOn:"2026-03-11"},
  {id:3,staffId:4,staffName:"Celestine Akiru",type:"Compassionate",from:"2026-03-20",to:"2026-03-22",days:3,reason:"Bereavement – uncle",status:"Pending",approvedBy:"",appliedOn:"2026-03-15"},
  {id:4,staffId:12,staffName:"Joyce Nakwam",type:"Annual Leave",from:"2026-04-21",to:"2026-04-25",days:5,reason:"Personal",status:"Pending",approvedBy:"",appliedOn:"2026-03-14"},
  {id:5,staffId:13,staffName:"Paul Esekon",type:"Annual Leave",from:"2026-05-01",to:"2026-05-10",days:10,reason:"Home travel – Turkana",status:"Approved",approvedBy:"Aggrey Ochieng",appliedOn:"2026-03-01"},
];

export const INITIAL_LEAVE_BAL=INITIAL_STAFF.map((s,i)=>({staffId:s.id,annual:21,annualUsed:[7,0,0,0,0,5,7,0,0,0,0,5,10,0,0][i]||0,sick:10,sickUsed:[0,0,0,0,0,0,0,2,0,2,0,0,0,0,0][i]||0,compassionate:3,compassionateUsed:[0,0,0,3,0,0,0,0,0,0,0,0,0,0,0][i]||0}));

export const INITIAL_SHIFTS=[
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

export const INITIAL_PERFORMANCE=[
  {id:1,staffId:3,period:"Q1 2026",punctuality:4,cleanliness:4,guestSatisfaction:5,teamwork:4,initiative:3,overall:4.0,comments:"Excellent front desk presence. Guests love his warm welcome.",reviewer:"Aggrey Ochieng",date:"2026-03-15"},
  {id:2,staffId:6,period:"Q1 2026",punctuality:5,cleanliness:5,guestSatisfaction:5,teamwork:5,initiative:4,overall:4.8,comments:"Outstanding. Villas are immaculate. Sets the standard for the team.",reviewer:"Martha Auma",date:"2026-03-15"},
  {id:3,staffId:9,period:"Q1 2026",punctuality:4,cleanliness:3,guestSatisfaction:4,teamwork:5,initiative:5,overall:4.2,comments:"Great problem solver. Fixed the borehole pump ahead of schedule.",reviewer:"Aggrey Ochieng",date:"2026-03-15"},
  {id:4,staffId:11,period:"Q1 2026",punctuality:5,cleanliness:5,guestSatisfaction:5,teamwork:4,initiative:4,overall:4.6,comments:"Guests rave about the food. Breakfast service is a highlight.",reviewer:"Aggrey Ochieng",date:"2026-03-15"},
];

export const INITIAL_INVENTORY=[
  {id:1,name:"Bed Linen Sets",category:"Housekeeping",unit:"Sets",qty:45,minQty:20,unitCost:2500,lastRestocked:"2026-03-01",supplier:"Nairobi Textiles"},
  {id:2,name:"Towels (Bath)",category:"Housekeeping",unit:"Pcs",qty:90,minQty:30,unitCost:450,lastRestocked:"2026-03-01",supplier:"Nairobi Textiles"},
  {id:3,name:"Toilet Paper Rolls",category:"Housekeeping",unit:"Rolls",qty:200,minQty:80,unitCost:30,lastRestocked:"2026-03-10",supplier:"Mega Superstore"},
  {id:4,name:"Hand Soap (bars)",category:"Housekeeping",unit:"Pcs",qty:80,minQty:40,unitCost:60,lastRestocked:"2026-03-10",supplier:"Mega Superstore"},
  {id:5,name:"Descaling Solution 5L",category:"Maintenance",unit:"Litres",qty:15,minQty:10,unitCost:800,lastRestocked:"2026-02-15",supplier:"Plumbing Hub Lodwar"},
  {id:6,name:"AC Filters",category:"Maintenance",unit:"Pcs",qty:6,minQty:5,unitCost:1200,lastRestocked:"2026-01-20",supplier:"Nairobi HVAC"},
  {id:7,name:"Cooking Gas 13kg",category:"Kitchen",unit:"Cylinders",qty:8,minQty:4,unitCost:3200,lastRestocked:"2026-03-12",supplier:"Afrigas Lodwar"},
  {id:8,name:"Mineral Water 500ml",category:"Kitchen",unit:"Crates",qty:24,minQty:10,unitCost:600,lastRestocked:"2026-03-15",supplier:"Mega Superstore"},
  {id:9,name:"Laundry Detergent 5kg",category:"Housekeeping",unit:"Bags",qty:12,minQty:6,unitCost:1100,lastRestocked:"2026-03-05",supplier:"Mega Superstore"},
  {id:10,name:"Pool Chlorine",category:"Maintenance",unit:"Kgs",qty:20,minQty:8,unitCost:350,lastRestocked:"2026-02-28",supplier:"Plumbing Hub Lodwar"},
  {id:11,name:"Disposable Gloves",category:"Housekeeping",unit:"Boxes",qty:20,minQty:10,unitCost:280,lastRestocked:"2026-03-10",supplier:"Mega Superstore"},
  {id:12,name:"LED Light Bulbs",category:"Maintenance",unit:"Pcs",qty:30,minQty:15,unitCost:180,lastRestocked:"2026-03-01",supplier:"Electronics Hub"},
  {id:13,name:"Tea & Coffee Packs",category:"Kitchen",unit:"Packs",qty:30,minQty:15,unitCost:220,lastRestocked:"2026-03-14",supplier:"Mega Superstore"},
  {id:14,name:"Hand Sanitizer 1L",category:"Housekeeping",unit:"Bottles",qty:18,minQty:10,unitCost:450,lastRestocked:"2026-03-10",supplier:"Mega Superstore"},
];

export const INITIAL_FEEDBACK=[
  {id:1,guest:"Johnson Family",villa:"Villa 2",rating:5,date:"2026-03-15",comment:"Absolutely stunning villas! The executive room is world-class. Staff are incredibly kind.",category:"Excellent",recommend:true},
  {id:2,guest:"UNICEF Field Team",villa:"Villa 3",rating:4,date:"2026-03-16",comment:"Great value for money. Kitchen well-equipped for self-catering. The restaurant food was excellent too!",category:"Very Good",recommend:true},
  {id:3,guest:"MSF Kenya",villa:"Villa 9",rating:5,date:"2026-03-18",comment:"Best accommodation in Turkana by far. Clean, safe, peaceful. The nyama choma was outstanding!",category:"Excellent",recommend:true},
  {id:4,guest:"Grace Mutua",villa:"Villa 1",rating:3,date:"2026-03-10",comment:"Good place overall. Restaurant service was a little slow but food quality was good.",category:"Good",recommend:true},
  {id:5,guest:"Bishop Emmanuel Omondi",villa:"Villa 7",rating:5,date:"2026-03-19",comment:"A truly Christian atmosphere. Food from the kitchen was excellent. Will recommend to our diocese.",category:"Excellent",recommend:true},
];

export const INITIAL_LOSTFOUND=[
  {id:1,item:"Samsung Galaxy S24 – black",foundAt:"Villa 3",foundBy:"Sarah Lopeyok",foundDate:"2026-03-15",status:"Claimed",claimedBy:"UNICEF Team",claimDate:"2026-03-16",notes:"Handed to guest at checkout"},
  {id:2,item:"Blue swimming shorts",foundAt:"Pool Area",foundBy:"James Okwany",foundDate:"2026-03-17",status:"In Storage",claimedBy:"",claimDate:"",notes:"Stored in lost & found box"},
  {id:3,item:"Reading glasses – rectangular",foundAt:"Villa 7",foundBy:"Grace Akello",foundDate:"2026-03-17",status:"In Storage",claimedBy:"",claimDate:"",notes:""},
  {id:4,item:"Leather wallet – brown",foundAt:"Parking",foundBy:"Paul Esekon",foundDate:"2026-03-18",status:"Claimed",claimedBy:"Johnson Family",claimDate:"2026-03-18",notes:"Contained KSh 2,400 – returned intact"},
  {id:5,item:"Child's stuffed elephant toy",foundAt:"Villa 2",foundBy:"Mary Wanjiku",foundDate:"2026-03-19",status:"In Storage",claimedBy:"",claimDate:"",notes:"Will contact guest"},
];

// ─── SALES & MARKETING DATA ─────────────────────────────────
export const INITIAL_LEADS=[
  {id:1,name:"Kenya Red Cross",contact:"Jane Wambui",phone:"+254 720 111 222",email:"jwambui@redcross.ke",source:"Referral",stage:"Negotiation",value:480000,notes:"5-day team retreat, 40 pax. Want full board + conference.",created:"2026-03-01",lastContact:"2026-03-16"},
  {id:2,name:"Tullow Oil Kenya",contact:"Mark Stevens",phone:"+254 733 444 555",email:"mstevens@tullow.com",source:"Website",stage:"Prospecting",value:720000,notes:"Quarterly executive offsite, 20 rooms.",created:"2026-03-10",lastContact:"2026-03-12"},
  {id:3,name:"Diocese of Turkana",contact:"Bishop Peter Ekiru",phone:"+254 722 888 999",email:"bishop@turkanadiocese.org",source:"Walk-in",stage:"Won",value:240000,notes:"Annual clergy conference, 3 days. Booked!",created:"2026-02-15",lastContact:"2026-03-05"},
  {id:4,name:"World Vision Lodwar",contact:"Sarah Oduya",phone:"+254 700 222 333",email:"soduya@wvi.org",source:"Repeat Guest",stage:"Proposal",value:360000,notes:"Monthly team meetings, want 6-month package deal.",created:"2026-03-08",lastContact:"2026-03-15"},
  {id:5,name:"County Governor's Office",contact:"James Loruk",phone:"+254 745 666 777",email:"jloruk@turkana.go.ke",source:"Referral",stage:"Prospecting",value:150000,notes:"Delegation hosting, 2-night stay + banquet.",created:"2026-03-14",lastContact:"2026-03-14"},
  {id:6,name:"AMREF Health Africa",contact:"Dr. Fatma Ali",phone:"+254 711 333 444",email:"fali@amref.org",source:"Website",stage:"Lost",value:500000,notes:"Chose Nairobi venue instead. Follow up Q3.",created:"2026-01-20",lastContact:"2026-02-28"},
];

export const INITIAL_PACKAGES=[
  {id:1,name:"Conference Full Board",desc:"Conference venue + accommodation + all meals + AV equipment",price:8500,unit:"per person/day",icon:"🎪",active:true},
  {id:2,name:"Full Board Package",desc:"Villa accommodation + breakfast, lunch & dinner",price:6500,unit:"per person/day",icon:"🍽",active:true},
  {id:3,name:"Weekend Getaway",desc:"Fri–Sun villa stay + pool + 2 meals daily",price:15000,unit:"per villa/weekend",icon:"🌅",active:true},
  {id:4,name:"NGO/Humanitarian Discount",desc:"15% off full board for NGO teams (min 5 nights)",price:5525,unit:"per person/day",icon:"🤝",active:true},
  {id:5,name:"Honeymoon Suite",desc:"Executive room + champagne + breakfast in bed + pool",price:18000,unit:"per couple/night",icon:"💒",active:true},
  {id:6,name:"Corporate Retreat",desc:"3-day conference package + team building + all meals",price:22000,unit:"per person/3 days",icon:"💼",active:true},
];

export const INITIAL_MARKETING_TASKS=[
  {id:1,task:"Update Google Business listing with new pool photos",priority:"High",owner:"Martha Auma",status:"In Progress",due:"2026-03-20"},
  {id:2,task:"Send follow-up email to World Vision (package proposal)",priority:"High",owner:"Martha Auma",status:"Pending",due:"2026-03-19"},
  {id:3,task:"Post Easter weekend special on social media",priority:"Medium",owner:"Aggrey Ochieng",status:"Pending",due:"2026-03-25"},
  {id:4,task:"Design new conference brochure for Q2",priority:"Medium",owner:"Martha Auma",status:"Pending",due:"2026-04-01"},
  {id:5,task:"Contact Turkana County tourism board for partnership",priority:"Low",owner:"Aggrey Ochieng",status:"Complete",due:"2026-03-10"},
];

// ─── GARDENING & LANDSCAPING DATA ────────────────────────────
export const INITIAL_GARDEN_ZONES=[
  {id:1,name:"Main Entrance & Driveway",icon:"🌴",status:"Good",area:"1,200 sqm",lastDone:"2026-03-17",nextDue:"2026-03-24",notes:"Bougainvillea hedge trimmed"},
  {id:2,name:"Villa Courtyards (1–5)",icon:"🌺",status:"Good",area:"800 sqm",lastDone:"2026-03-16",nextDue:"2026-03-23",notes:"All courtyards mulched"},
  {id:3,name:"Villa Courtyards (6–10)",icon:"🌺",status:"Needs Care",area:"800 sqm",lastDone:"2026-03-10",nextDue:"2026-03-18",notes:"Overdue — heat stress on lawn"},
  {id:4,name:"Pool Surrounds & Deck",icon:"🏊",status:"Good",area:"600 sqm",lastDone:"2026-03-18",nextDue:"2026-03-25",notes:"Deck pots refreshed"},
  {id:5,name:"Conference Centre Gardens",icon:"🌳",status:"Critical",area:"1,500 sqm",lastDone:"2026-03-05",nextDue:"2026-03-12",notes:"Irrigation line burst — needs repair"},
  {id:6,name:"Kitchen Garden & Herb Patch",icon:"🌿",status:"Good",area:"400 sqm",lastDone:"2026-03-17",nextDue:"2026-03-20",notes:"Tomatoes, spinach, herbs thriving"},
];

export const INITIAL_GARDEN_TASKS=[
  {id:1,zone:"Conference Centre Gardens",task:"Repair burst irrigation line – Zone 5",priority:"High",assignee:"Simon Ewoton",status:"In Progress",due:"2026-03-19"},
  {id:2,zone:"Villa Courtyards (6–10)",task:"Mow lawns and apply fertilizer",priority:"High",assignee:"Simon Ewoton",status:"Pending",due:"2026-03-19"},
  {id:3,zone:"Kitchen Garden",task:"Harvest ripe tomatoes and spinach for kitchen",priority:"Medium",assignee:"Simon Ewoton",status:"Complete",due:"2026-03-17"},
  {id:4,zone:"Main Entrance",task:"Prune bougainvillea hedge to shape",priority:"Medium",assignee:"Simon Ewoton",status:"Complete",due:"2026-03-17"},
  {id:5,zone:"Pool Surrounds",task:"Replace dead pot plants with new aloe vera",priority:"Low",assignee:"Simon Ewoton",status:"Pending",due:"2026-03-22"},
];

export const INITIAL_PLANTS=[
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
export const INITIAL_EVENTS=[
  {id:1,name:"Diocese of Turkana Clergy Conference",client:"Bishop Peter Ekiru",phone:"+254 722 888 999",venue:"Turkana Hall",startDate:"2026-04-05",endDate:"2026-04-07",pax:120,catering:"Full Board",deposit:80000,total:240000,status:"Confirmed",notes:"3-day event, need PA system + projector"},
  {id:2,name:"UNICEF Field Staff Training",client:"Dr. Amina Hassan",phone:"+254 701 678 901",venue:"Nile Boardroom",startDate:"2026-03-25",endDate:"2026-03-26",pax:18,catering:"Tea & Lunch",deposit:15000,total:45000,status:"Confirmed",notes:"Need whiteboard + flip charts"},
  {id:3,name:"Turkana County Budget Workshop",client:"James Loruk",phone:"+254 745 666 777",venue:"Turkana Hall",startDate:"2026-04-14",endDate:"2026-04-15",pax:80,catering:"Full Board",deposit:0,total:160000,status:"Tentative",notes:"Awaiting governor approval"},
  {id:4,name:"Wedding Reception – Lokichar Family",client:"Peter Lokichar",phone:"+254 700 999 888",venue:"Sunset Terrace",startDate:"2026-04-19",endDate:"2026-04-19",pax:70,catering:"Dinner Banquet",deposit:50000,total:140000,status:"Confirmed",notes:"Outdoor setup, need decorations"},
  {id:5,name:"Easter Sunrise Service",client:"CHABBS Internal",phone:"",venue:"Chapel",startDate:"2026-04-20",endDate:"2026-04-20",pax:40,catering:"Breakfast",deposit:0,total:0,status:"Confirmed",notes:"Internal event — staff + guests invited"},
];

export const CONFERENCE_VENUES=[
  {id:1,name:"Turkana Hall",capacity:200,rate:25000,rateUnit:"per day",equipment:["PA System","Projector & Screen","Stage","Microphones (4)","Whiteboard"],icon:"🏛"},
  {id:2,name:"Nile Boardroom",capacity:20,rate:8000,rateUnit:"per day",equipment:["Projector","Conference Phone","Whiteboard","Flip Charts"],icon:"🪑"},
  {id:3,name:"Sunset Terrace",capacity:80,rate:15000,rateUnit:"per event",equipment:["Outdoor Lighting","PA System","Portable Stage"],icon:"🌅"},
  {id:4,name:"Chapel",capacity:40,rate:5000,rateUnit:"per event",equipment:["PA System","Piano/Keyboard","Hymn Projector"],icon:"⛪"},
];

// ─── LAUNDRY DATA ────────────────────────────────────────────
export const LAUNDRY_STAGES=["Collected","Washing","Drying","Folded","Delivered"];
export const INITIAL_LAUNDRY=[
  {id:1,villa:"Villa 2",guestName:"Johnson Family",items:"Bed linen (3 sets), towels (6), bathrobes (3)",assignee:"Grace Akello",stage:"Drying",collectedAt:"2026-03-18T08:00:00",notes:"Salty water rinse protocol applied"},
  {id:2,villa:"Villa 3",guestName:"UNICEF Team",items:"Bed linen (3 sets), towels (9), tablecloth (1)",assignee:"Sarah Lopeyok",stage:"Washing",collectedAt:"2026-03-18T09:30:00",notes:"Extra towels requested"},
  {id:3,villa:"Villa 7",guestName:"Bishop Omondi",items:"Bed linen (1 set), towels (2)",assignee:"Mary Wanjiku",stage:"Delivered",collectedAt:"2026-03-17T07:00:00",notes:"Express service"},
  {id:4,villa:"Villa 8",guestName:"(Post checkout clean)",items:"Bed linen (3 sets), towels (6), curtains (2)",assignee:"Grace Akello",stage:"Collected",collectedAt:"2026-03-18T11:00:00",notes:"Deep clean turnover — full wash"},
  {id:5,villa:"Pool Towels",guestName:"Pool Area",items:"Pool towels (12)",assignee:"Sarah Lopeyok",stage:"Folded",collectedAt:"2026-03-18T06:30:00",notes:"Daily pool towel rotation"},
];

// ─── POOL & RECREATION DATA ─────────────────────────────────
export const INITIAL_POOL_CHEMISTRY=[
  {id:1,date:"2026-03-18",time:"08:00",ph:7.4,chlorine:1.8,turbidity:0.3,temp:28,tester:"James Okwany",status:"Safe",notes:"All parameters normal"},
  {id:2,date:"2026-03-17",time:"08:00",ph:7.6,chlorine:1.5,turbidity:0.4,temp:29,tester:"James Okwany",status:"Safe",notes:"Slightly warm — normal for season"},
  {id:3,date:"2026-03-16",time:"08:00",ph:7.2,chlorine:2.1,turbidity:0.2,temp:27,tester:"Peter Kimani",status:"Safe",notes:"Post-shock treatment"},
  {id:4,date:"2026-03-15",time:"08:00",ph:7.8,chlorine:0.8,turbidity:0.6,tester:"James Okwany",temp:30,status:"Caution",notes:"Chlorine low — shock added at 10AM"},
  {id:5,date:"2026-03-14",time:"08:00",ph:7.3,chlorine:1.6,turbidity:0.3,temp:28,tester:"James Okwany",status:"Safe",notes:""},
];

export const INITIAL_POOL_ACTIVITIES=[
  {id:1,name:"Open Swimming",time:"06:00 – 18:00",days:"Daily",icon:"🏊",active:true},
  {id:2,name:"Aqua Aerobics",time:"07:00 – 07:45",days:"Mon, Wed, Fri",icon:"🏋️",active:true},
  {id:3,name:"Children's Swim Hour",time:"10:00 – 11:00",days:"Sat, Sun",icon:"👶",active:true},
  {id:4,name:"Pool Volleyball",time:"15:00 – 16:30",days:"Sat",icon:"🏐",active:false},
  {id:5,name:"Sunset Lounge",time:"17:00 – 19:00",days:"Daily",icon:"🌅",active:true},
  {id:6,name:"Night Swim",time:"19:00 – 21:00",days:"Fri, Sat",icon:"🌙",active:true},
];

export const INITIAL_WATER=[
  {id:1,date:"2026-03-18",pumpHours:4.5,tankLevel:85,electricityKwh:142,notes:"Normal operations"},
  {id:2,date:"2026-03-17",pumpHours:5.0,tankLevel:80,electricityKwh:158,notes:"Extra guests – higher usage"},
  {id:3,date:"2026-03-16",pumpHours:4.0,tankLevel:90,electricityKwh:135,notes:""},
  {id:4,date:"2026-03-15",pumpHours:4.5,tankLevel:88,electricityKwh:147,notes:""},
  {id:5,date:"2026-03-14",pumpHours:3.5,tankLevel:92,electricityKwh:128,notes:"Low occupancy"},
  {id:6,date:"2026-03-13",pumpHours:4.0,tankLevel:89,electricityKwh:139,notes:""},
  {id:7,date:"2026-03-12",pumpHours:4.5,tankLevel:86,electricityKwh:151,notes:""},
];

export const INITIAL_FINANCIALS=[
  {id:1,date:"2026-03-18",revenue:12000,expenses:3200,notes:"Accommodation + Restaurant"},
  {id:2,date:"2026-03-17",revenue:15600,expenses:4100,notes:""},
  {id:3,date:"2026-03-16",revenue:14200,expenses:3800,notes:"Pool maintenance cost"},
  {id:4,date:"2026-03-15",revenue:18000,expenses:5200,notes:"UNICEF team arrival"},
  {id:5,date:"2026-03-14",revenue:8400,expenses:2800,notes:"Weekend slow period"},
];

export const INITIAL_MAINTENANCE=[
  {id:1,asset:"AC Unit – Villa 3",issue:"Filter clogged, reduced airflow",priority:"High",parts:"AC Filter x2",reported:"2026-03-15",resolved:null,status:"Open",assignee:"Peter Kimani"},
  {id:2,asset:"Borehole Pump",issue:"Unusual vibration at startup",priority:"High",parts:"Pump bearing set",reported:"2026-03-16",resolved:null,status:"In Progress",assignee:"James Okwany"},
  {id:3,asset:"Pool Filter",issue:"Routine monthly descale",priority:"Low",parts:"Descaling solution 5L",reported:"2026-03-14",resolved:"2026-03-14",status:"Resolved",assignee:"James Okwany"},
  {id:4,asset:"Showerheads – Villa 1 & 2",issue:"Weekly salty water descale protocol",priority:"Low",parts:"Vinegar solution, wire brush",reported:"2026-03-17",resolved:null,status:"Scheduled",assignee:"Mary Wanjiku"},
  {id:5,asset:"Water Tank Valve",issue:"Slow drip, gasket needed",priority:"Medium",parts:"Rubber gasket x3",reported:"2026-03-16",resolved:"2026-03-17",status:"Resolved",assignee:"Peter Kimani"},
];

export const INITIAL_HOUSEKEEPING=[
  {id:1,villa:"Villa 2",room:"Whole Villa",assignee:"Grace Akello",dueDate:"2026-03-20",bedding:false,bathroom:false,descale:false,common:false,trash:false,status:"Pending"},
  {id:2,villa:"Villa 8",room:"Whole Villa",assignee:"Sarah Lopeyok",dueDate:"2026-03-18",bedding:true,bathroom:true,descale:false,common:true,trash:true,status:"In Progress"},
  {id:3,villa:"Villa 5",room:"Whole Villa",assignee:"Grace Akello",dueDate:"2026-03-17",bedding:true,bathroom:true,descale:true,common:true,trash:true,status:"Complete"},
];

// ─── DESIGN TOKENS ────────────────────────────────────────────
export const C={navy:"#0F2744",navyM:"#1A3A5C",sand:"#F4ECD8",sandL:"#FAF6EE",terra:"#B85C38",terraL:"#E07A56",sage:"#5A7A5E",sageD:"#3D5C41",gold:"#C9952A",goldL:"#F0C060",text:"#1A0F00",textM:"#4A3728",textL:"#8B7355",border:"#E0D4BC",danger:"#C62828",warning:"#E65100",success:"#2E7D32",info:"#1565C0"};
export const SC={
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
export const Badge=({label})=>{const s=SC[label]||{bg:"#F5F5F5",tx:"#616161",dot:"#9E9E9E"};return(<span style={{background:s.bg,color:s.tx,display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}><span style={{width:7,height:7,borderRadius:"50%",background:s.dot}}/>{label}</span>);};
export const inp={width:"100%",padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit",background:"white"};
export const Field=({label,children,col})=>(<div style={col?{gridColumn:col}:{}}><label style={{fontSize:11,color:C.textL,fontWeight:700,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>{label}</label>{children}</div>);
export const SectionTitle=({title,sub})=>(<div style={{marginBottom:20}}><div style={{fontSize:24,fontWeight:800,color:C.navy,fontFamily:"'Playfair Display',Georgia,serif"}}>{title}</div>{sub&&<div style={{fontSize:13,color:C.textL,marginTop:4}}>{sub}</div>}</div>);
export const Card=({children,style={}})=>(<div style={{background:"white",borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",...style}}>{children}</div>);
export const SubTabs=({tabs,active,setActive})=>(<div style={{display:"flex",gap:2,marginBottom:20,background:C.sandL,borderRadius:14,padding:4,width:"fit-content",flexWrap:"wrap"}}>{tabs.map(([k,icon,label])=>(<button key={k} onClick={()=>setActive(k)} style={{padding:"8px 14px",borderRadius:10,border:"none",fontSize:13,fontWeight:700,cursor:"pointer",background:active===k?"white":"transparent",color:active===k?C.navy:C.textL,boxShadow:active===k?"0 2px 8px rgba(0,0,0,0.1)":"none",transition:"all 0.2s",display:"flex",alignItems:"center",gap:5}}><span>{icon}</span>{label}</button>))}</div>);
export const StatBox=({bg,border,tx,label,value})=>(<div style={{background:bg,borderRadius:14,padding:"14px 16px",border:`1px solid ${border}`}}><div style={{fontSize:10,color:tx,fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:20,fontWeight:900,color:tx,marginTop:4}}>{value}</div></div>);

// ─── CALENDAR HELPERS ─────────────────────────────────────────
export const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
export const parseDate=s=>{const[y,m,d]=s.split("-");return new Date(+y,+m-1,+d);};
export const sameDay=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
export const bookingOnDate=(b,date)=>{const ci=parseDate(b.checkIn),co=parseDate(b.checkOut),d=new Date(date);d.setHours(12);return d>=ci&&d<co;};
export const bookingSpansWeek=(b,ws,we)=>{const ci=parseDate(b.checkIn),co=parseDate(b.checkOut);return ci<=we&&co>ws;};


// ─── MARKETING DATA ──────────────────────────────────────────
export const AI_CONTENT_TEMPLATES={
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

export const SEO_KEYWORDS_DB=[
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

export const INITIAL_SOCIAL_POSTS=[
  {id:1,platform:"Instagram",type:"Reel",content:"Sunrise over Turkana from our pool deck 🌅 The view that keeps our guests coming back.\n\n#CHABBSResort #Turkana #KenyaTravel #DesertLuxury",status:"Published",scheduled:"2026-03-15",engagement:{likes:234,comments:18,shares:45,views:3200},author:"Martha Auma"},
  {id:2,platform:"TikTok",type:"POV Video",content:"POV: You checked into a luxury resort in the middle of Turkana desert 🏜️✨\n\n#TurkanaLuxury #HiddenGemKenya #CHABBSResort",status:"Published",scheduled:"2026-03-14",engagement:{likes:892,comments:67,shares:156,views:12400},author:"Martha Auma"},
  {id:3,platform:"Facebook",type:"Offer Post",content:"🎁 Easter Special: Book 3 nights, get the 4th FREE! Valid April 18–22.\n\nFull Board Package includes all meals + pool access.\n\nBook now: +254 733 100 002",status:"Scheduled",scheduled:"2026-03-25",engagement:{likes:0,comments:0,shares:0,views:0},author:"Aggrey Ochieng"},
  {id:4,platform:"LinkedIn",type:"Article",content:"How CHABBS Resort is setting new standards for hospitality in Northern Kenya. From our mineral-rich borehole water management to solar energy — innovation meets faith.",status:"Draft",scheduled:"",engagement:{likes:0,comments:0,shares:0,views:0},author:"Aggrey Ochieng"},
  {id:5,platform:"Google",type:"GMB Post",content:"Weekend Getaway: Fri-Sun villa stay + pool + 2 meals daily from KSh 15,000. ⭐ 4.8 on Google Reviews",status:"Published",scheduled:"2026-03-12",engagement:{likes:12,comments:3,shares:0,views:890},author:"Martha Auma"},
  {id:6,platform:"Instagram",type:"Carousel",content:"Meet the team that makes CHABBS magic happen ✨\n\nSlide 1: Chef Emmanuel & his legendary breakfast\nSlide 2: Grace keeping our villas spotless\nSlide 3: James ensuring a crystal-clear pool\n\n#TeamCHABBS #HospitalityKenya",status:"Scheduled",scheduled:"2026-03-22",engagement:{likes:0,comments:0,shares:0,views:0},author:"Martha Auma"},
  {id:7,platform:"Twitter",type:"Thread",content:"🧵 Why Lodwar is becoming Kenya's next big travel destination:\n\n1/ Turkana's untouched beauty\n2/ Lake Turkana UNESCO heritage\n3/ Luxury options like @CHABBSResort\n4/ Growing NGO hub = infrastructure boom",status:"Draft",scheduled:"",engagement:{likes:0,comments:0,shares:0,views:0},author:"Aggrey Ochieng"},
];

export const INITIAL_EMAIL_CAMPAIGNS=[
  {id:1,name:"Easter Weekend Special",type:"Promotional",subject:"🐣 Easter at CHABBS — Book 3, Get 4th Night FREE",recipients:148,sent:148,opened:89,clicked:34,status:"Sent",date:"2026-03-18"},
  {id:2,name:"Monthly Newsletter — March",type:"Newsletter",subject:"✟ CHABBS Monthly: New pool activities, Chef's menu & Easter plans",recipients:312,sent:312,opened:178,clicked:67,status:"Sent",date:"2026-03-01"},
  {id:3,name:"NGO Partners Update",type:"Targeted",subject:"Special rates for humanitarian teams — Q2 2026",recipients:45,sent:0,opened:0,clicked:0,status:"Draft",date:""},
  {id:4,name:"Post-Stay Thank You",type:"Automated",subject:"Thank you for staying at CHABBS! 🙏 We'd love your feedback",recipients:0,sent:87,opened:62,clicked:41,status:"Active",date:"Automated"},
  {id:5,name:"Win-Back Campaign",type:"Automated",subject:"We miss you! 🌴 Special return offer from CHABBS Resort",recipients:0,sent:23,opened:12,clicked:5,status:"Active",date:"Automated"},
];

export const INITIAL_GUEST_CRM=[
  {id:1,name:"Johnson Family",email:"johnson@email.com",phone:"+254 712 345 678",visits:3,lastVisit:"2026-03-16",totalSpend:144000,segment:"VIP Repeat",loyalty:"Gold",birthday:"",notes:"Prefer Villa 2. Kids love the pool."},
  {id:2,name:"UNICEF Field Team",email:"logistics@unicef.ke",phone:"+254 733 456 789",visits:8,lastVisit:"2026-03-15",totalSpend:672000,segment:"Corporate NGO",loyalty:"Platinum",birthday:"",notes:"Block booking every quarter. Invoice billing."},
  {id:3,name:"Bishop Omondi",email:"eomondi@diocese.org",phone:"+254 722 567 890",visits:5,lastVisit:"2026-03-17",totalSpend:120000,segment:"VIP Repeat",loyalty:"Gold",birthday:"1965-08-12",notes:"Always requests Villa 7. Bring Bible to room."},
  {id:4,name:"MSF Kenya",email:"lodwar@msf.org",phone:"+254 734 333 444",visits:4,lastVisit:"2026-03-18",totalSpend:384000,segment:"Corporate NGO",loyalty:"Gold",birthday:"",notes:"Long stays. Appreciate quiet villas."},
  {id:5,name:"Dr. Amina Hassan",email:"amina.h@email.com",phone:"+254 701 678 901",visits:1,lastVisit:"",totalSpend:0,segment:"New Guest",loyalty:"Bronze",birthday:"1988-03-22",notes:"First-time booker. Referred by UNICEF team."},
  {id:6,name:"Grace Mutua",email:"gmutua@gmail.com",phone:"+254 711 222 333",visits:2,lastVisit:"2026-03-10",totalSpend:36000,segment:"Leisure",loyalty:"Silver",birthday:"1990-11-05",notes:"Weekend getaways. Loves the restaurant."},
];

export const AUTOMATION_WORKFLOWS=[
  {id:1,name:"Welcome Email Sequence",trigger:"New booking confirmed",steps:["Send welcome email with check-in guide","Send 'What to pack for Turkana' tips (2 days before)","Send arrival day reminder with directions"],status:"Active",runs:87,icon:"📧"},
  {id:2,name:"Post-Stay Review Request",trigger:"Guest checks out",steps:["Wait 24 hours","Send thank-you + review request email","If no review after 3 days → send reminder","If 5-star → ask for Google review"],status:"Active",runs:62,icon:"⭐"},
  {id:3,name:"Birthday Offer",trigger:"Guest birthday (from CRM)",steps:["Send birthday greeting email","Include 20% discount code for birthday stay","If not redeemed in 30 days → send reminder"],status:"Active",runs:8,icon:"🎂"},
  {id:4,name:"Win-Back Campaign",trigger:"No visit in 90+ days",steps:["Send 'We miss you' email with special offer","If no response in 7 days → send SMS","If no response in 14 days → Martha calls personally"],status:"Active",runs:23,icon:"💌"},
  {id:5,name:"NGO Quarterly Check-in",trigger:"Every 3 months for NGO segment",steps:["Send updated rate card to NGO contacts","Include new conference facility photos","Offer block-booking discounts","If interested → auto-create lead in pipeline"],status:"Active",runs:12,icon:"🤝"},
  {id:6,name:"Social Media Auto-Post",trigger:"Content calendar schedule",steps:["Generate AI caption based on template","Resize images for each platform","Queue post for optimal time","Track engagement metrics after 24h/48h/7d"],status:"Active",runs:156,icon:"📱"},
  {id:7,name:"Guest Satisfaction Alert",trigger:"Feedback rating < 4 stars",steps:["Immediately notify Aggrey Ochieng","Auto-generate apology email draft","Create follow-up task for Martha","Log in quality improvement tracker"],status:"Active",runs:3,icon:"🚨"},
  {id:8,name:"Loyalty Tier Upgrade",trigger:"Guest reaches spending threshold",steps:["Bronze→Silver at KSh 50k lifetime","Silver→Gold at KSh 150k lifetime","Gold→Platinum at KSh 500k lifetime","Send congratulations email with new perks"],status:"Active",runs:14,icon:"🏆"},
];

