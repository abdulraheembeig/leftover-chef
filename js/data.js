/* =========================================================================
 * Leftover Chef — FIXED DATA
 * Everything the app knows about food lives here. No server, no API.
 *
 * shelf = how fast it spoils (3 = use today, 2 = a few days, 1 = keeps).
 * The zero-waste score gives more credit for rescuing perishable items.
 * ========================================================================= */
var LC = (window.LC = window.LC || {});

LC.Data = {
  GROUPS: [
    { id: "cooked", label: "Cooked leftovers" },
    { id: "dairy", label: "Bread, eggs & dairy" },
    { id: "veg", label: "Vegetables & fruit" },
  ],

  INGREDIENTS: [
    // Cooked leftovers
    { id: "rice", name: "Cooked rice", emoji: "🍚", group: "cooked", shelf: 3 },
    { id: "chapati", name: "Chapati / roti", emoji: "🫓", group: "cooked", shelf: 2 },
    { id: "dal", name: "Leftover dal", emoji: "🥣", group: "cooked", shelf: 3 },
    { id: "idli", name: "Idli", emoji: "⚪", group: "cooked", shelf: 3 },
    { id: "dosa_batter", name: "Dosa batter", emoji: "🥞", group: "cooked", shelf: 3 },
    { id: "chicken", name: "Cooked chicken", emoji: "🍗", group: "cooked", shelf: 3 },
    { id: "noodles", name: "Boiled noodles", emoji: "🍜", group: "cooked", shelf: 3 },

    // Bread, eggs & dairy
    { id: "bread", name: "Bread slices", emoji: "🍞", group: "dairy", shelf: 2 },
    { id: "egg", name: "Eggs", emoji: "🥚", group: "dairy", shelf: 2 },
    { id: "milk", name: "Milk", emoji: "🥛", group: "dairy", shelf: 3 },
    { id: "curd", name: "Curd", emoji: "🫙", group: "dairy", shelf: 3 },
    { id: "paneer", name: "Paneer", emoji: "🧈", group: "dairy", shelf: 3 },
    { id: "cheese", name: "Cheese", emoji: "🧀", group: "dairy", shelf: 1 },

    // Vegetables & fruit
    { id: "onion", name: "Onion", emoji: "🧅", group: "veg", shelf: 1 },
    { id: "tomato", name: "Tomato", emoji: "🍅", group: "veg", shelf: 2 },
    { id: "potato", name: "Potato", emoji: "🥔", group: "veg", shelf: 1 },
    { id: "spinach", name: "Spinach", emoji: "🥬", group: "veg", shelf: 3 },
    { id: "capsicum", name: "Capsicum", emoji: "🫑", group: "veg", shelf: 2 },
    { id: "carrot", name: "Carrot", emoji: "🥕", group: "veg", shelf: 1 },
    { id: "peas", name: "Green peas", emoji: "🫛", group: "veg", shelf: 2 },
    { id: "coriander", name: "Coriander", emoji: "🌿", group: "veg", shelf: 3 },
    { id: "lemon", name: "Lemon", emoji: "🍋", group: "veg", shelf: 1 },
    { id: "banana", name: "Ripe banana", emoji: "🍌", group: "veg", shelf: 3 },
    { id: "coconut", name: "Grated coconut", emoji: "🥥", group: "veg", shelf: 2 },
  ],

  // Assumed to be in every kitchen. Never counted as "missing".
  STAPLES: [
    "salt", "oil / ghee", "sugar", "mustard seeds", "cumin", "turmeric",
    "chilli powder", "garam masala", "green chillies", "ginger-garlic paste",
    "atta / maida", "besan", "soy sauce", "butter",
  ],

  /* Recipe shape:
   *  uses:     main leftovers (ingredient ids). Not ticked = must buy.
   *  optional: nice-to-have. Count as "rescued" if ticked, never "missing".
   *  staples:  from STAPLES, shown for completeness only.
   */
  RECIPES: [
    {
      id: "lemon-rice", name: "Lemon Rice", time: 15, difficulty: "Easy", veg: true,
      uses: [["rice", "2 cups"], ["lemon", "1"]],
      optional: [["coriander", "a handful"], ["coconut", "2 tbsp"]],
      staples: ["oil / ghee", "mustard seeds", "turmeric", "green chillies", "salt"],
      steps: [
        "Heat oil, crackle mustard seeds, add green chillies and turmeric.",
        "Add the cold rice and toss until every grain is yellow.",
        "Switch off the heat, squeeze in the lemon and add salt.",
        "Finish with coriander or coconut if you have it.",
      ],
    },
    {
      id: "curd-rice", name: "Curd Rice", time: 10, difficulty: "Easy", veg: true,
      uses: [["rice", "2 cups"], ["curd", "1 cup"]],
      optional: [["coriander", "a handful"], ["carrot", "1, grated"]],
      staples: ["salt", "oil / ghee", "mustard seeds", "green chillies"],
      steps: [
        "Mash the rice lightly with a splash of water or milk.",
        "Mix in the curd and salt.",
        "Temper mustard seeds and green chillies in oil, pour over.",
        "Top with grated carrot and coriander.",
      ],
    },
    {
      id: "tomato-rice", name: "Tomato Rice", time: 20, difficulty: "Easy", veg: true,
      uses: [["rice", "2 cups"], ["tomato", "2"], ["onion", "1"]],
      optional: [["coriander", "a handful"], ["peas", "1/4 cup"]],
      staples: ["oil / ghee", "mustard seeds", "chilli powder", "turmeric", "salt"],
      steps: [
        "Sauté sliced onion in oil until soft.",
        "Add chopped tomato, chilli powder, turmeric and salt. Cook to a mush.",
        "Fold in the rice and peas, heat through.",
        "Garnish with coriander.",
      ],
    },
    {
      id: "veg-fried-rice", name: "Veg Fried Rice", time: 20, difficulty: "Medium", veg: true,
      uses: [["rice", "2 cups"], ["onion", "1"], ["carrot", "1"], ["capsicum", "1"]],
      optional: [["peas", "1/4 cup"]],
      staples: ["oil / ghee", "soy sauce", "ginger-garlic paste", "salt"],
      steps: [
        "Heat oil on high. Fry ginger-garlic for 30 seconds.",
        "Add finely chopped onion, carrot, capsicum and peas. Stir-fry 3 min.",
        "Add the cold rice and soy sauce. Toss on high heat.",
        "Taste, adjust salt, serve hot.",
      ],
    },
    {
      id: "egg-fried-rice", name: "Egg Fried Rice", time: 15, difficulty: "Easy", veg: false,
      uses: [["rice", "2 cups"], ["egg", "2"], ["onion", "1"]],
      optional: [["capsicum", "1/2"], ["coriander", "a handful"]],
      staples: ["oil / ghee", "soy sauce", "salt"],
      steps: [
        "Scramble the eggs in hot oil, push them to one side.",
        "Add chopped onion (and capsicum) and fry until glossy.",
        "Add the rice and soy sauce. Toss everything together on high heat.",
        "Season, top with coriander, serve.",
      ],
    },
    {
      id: "chicken-fried-rice", name: "Chicken Fried Rice", time: 20, difficulty: "Medium", veg: false,
      uses: [["rice", "2 cups"], ["chicken", "1 cup, shredded"], ["egg", "1"], ["onion", "1"]],
      optional: [["capsicum", "1/2"], ["carrot", "1"]],
      staples: ["oil / ghee", "soy sauce", "ginger-garlic paste", "salt"],
      steps: [
        "Scramble the egg in hot oil and set aside.",
        "Fry onion and ginger-garlic, add the shredded chicken.",
        "Add rice, soy sauce and the egg. Toss on high heat.",
        "Season and serve.",
      ],
    },
    {
      id: "rice-kheer", name: "Rice Kheer", time: 25, difficulty: "Easy", veg: true,
      uses: [["rice", "1 cup"], ["milk", "3 cups"]],
      optional: [["coconut", "2 tbsp"]],
      staples: ["sugar", "oil / ghee"],
      steps: [
        "Bring the milk to a boil, then lower the heat.",
        "Mash the rice a little and add it to the milk.",
        "Simmer, stirring, until thick (about 15 min).",
        "Add sugar and coconut. Serve warm or chilled.",
      ],
    },
    {
      id: "rice-cutlets", name: "Rice & Potato Cutlets", time: 30, difficulty: "Medium", veg: true,
      uses: [["rice", "1 cup"], ["potato", "2, boiled"], ["onion", "1"]],
      optional: [["coriander", "a handful"], ["carrot", "1, grated"], ["peas", "1/4 cup"]],
      staples: ["besan", "chilli powder", "garam masala", "salt", "oil / ghee"],
      steps: [
        "Mash rice and potato together.",
        "Mix in chopped onion, coriander, spices and 2 tbsp besan.",
        "Shape into flat cutlets.",
        "Shallow-fry until golden on both sides.",
      ],
    },
    {
      id: "coconut-rice", name: "Coconut Rice", time: 15, difficulty: "Easy", veg: true,
      uses: [["rice", "2 cups"], ["coconut", "1/2 cup"]],
      optional: [["coriander", "a handful"]],
      staples: ["oil / ghee", "mustard seeds", "green chillies", "salt"],
      steps: [
        "Temper mustard seeds and green chillies in oil.",
        "Add coconut and roast 1 minute.",
        "Fold in the rice and salt, heat through.",
      ],
    },
    {
      id: "chapati-noodles", name: "Chapati Noodles", time: 15, difficulty: "Easy", veg: true,
      uses: [["chapati", "4"], ["onion", "1"], ["capsicum", "1"]],
      optional: [["carrot", "1"], ["tomato", "1"]],
      staples: ["oil / ghee", "soy sauce", "chilli powder", "salt"],
      steps: [
        "Roll up the chapatis and cut into thin strips.",
        "Stir-fry onion, capsicum and carrot on high heat.",
        "Add soy sauce, chilli powder and the chapati strips.",
        "Toss for 2 minutes and serve.",
      ],
    },
    {
      id: "kothu-chapati", name: "Egg Kothu Chapati", time: 15, difficulty: "Medium", veg: false,
      uses: [["chapati", "4"], ["egg", "2"], ["onion", "1"], ["tomato", "1"]],
      optional: [["coriander", "a handful"]],
      staples: ["oil / ghee", "garam masala", "chilli powder", "salt"],
      steps: [
        "Tear the chapatis into small pieces.",
        "Fry onion and tomato with spices until soft.",
        "Crack in the eggs and scramble.",
        "Add chapati pieces and chop everything together with the spatula.",
      ],
    },
    {
      id: "chicken-roll", name: "Chicken Kathi Roll", time: 15, difficulty: "Easy", veg: false,
      uses: [["chapati", "2"], ["chicken", "1 cup"], ["onion", "1"]],
      optional: [["capsicum", "1/2"], ["curd", "2 tbsp"], ["lemon", "1/2"]],
      staples: ["oil / ghee", "chilli powder", "garam masala", "salt"],
      steps: [
        "Toss the chicken with spices in a hot pan.",
        "Warm the chapatis on a tawa.",
        "Fill with chicken, raw onion and capsicum.",
        "Add a spoon of curd and a squeeze of lemon, roll tight.",
      ],
    },
    {
      id: "dal-paratha", name: "Dal Paratha", time: 25, difficulty: "Medium", veg: true,
      uses: [["dal", "1 cup"], ["onion", "1"]],
      optional: [["coriander", "a handful"]],
      staples: ["atta / maida", "salt", "oil / ghee", "cumin"],
      steps: [
        "Knead the leftover dal into atta instead of water.",
        "Add chopped onion, coriander, cumin and salt.",
        "Roll out parathas.",
        "Cook on a hot tawa with ghee until spotted brown.",
      ],
    },
    {
      id: "dal-palak", name: "Dal Palak", time: 15, difficulty: "Easy", veg: true,
      uses: [["dal", "1 cup"], ["spinach", "1 bunch"], ["tomato", "1"]],
      optional: [["onion", "1"]],
      staples: ["oil / ghee", "cumin", "ginger-garlic paste", "salt"],
      steps: [
        "Temper cumin and ginger-garlic in ghee.",
        "Add onion and tomato, cook soft.",
        "Add chopped spinach until it wilts.",
        "Pour in the dal, simmer 5 minutes.",
      ],
    },
    {
      id: "bread-upma", name: "Bread Upma", time: 15, difficulty: "Easy", veg: true,
      uses: [["bread", "6 slices"], ["onion", "1"], ["tomato", "1"]],
      optional: [["coriander", "a handful"], ["capsicum", "1/2"]],
      staples: ["oil / ghee", "mustard seeds", "turmeric", "salt"],
      steps: [
        "Cut the bread into small cubes.",
        "Temper mustard seeds, add onion and tomato, cook soft.",
        "Add turmeric, salt and the bread cubes.",
        "Sprinkle a little water, toss and serve.",
      ],
    },
    {
      id: "masala-french-toast", name: "Masala French Toast", time: 15, difficulty: "Easy", veg: false,
      uses: [["bread", "4 slices"], ["egg", "2"], ["onion", "1/2"]],
      optional: [["coriander", "a handful"], ["tomato", "1/2"], ["milk", "2 tbsp"]],
      staples: ["chilli powder", "salt", "butter"],
      steps: [
        "Beat the eggs with milk, chopped onion, coriander, chilli and salt.",
        "Dip each bread slice on both sides.",
        "Toast on a buttered pan until golden.",
      ],
    },
    {
      id: "aloo-bread-roll", name: "Aloo Bread Rolls", time: 30, difficulty: "Medium", veg: true,
      uses: [["bread", "6 slices"], ["potato", "3, boiled"], ["onion", "1"]],
      optional: [["peas", "1/4 cup"], ["coriander", "a handful"]],
      staples: ["oil / ghee", "garam masala", "chilli powder", "salt"],
      steps: [
        "Mash potatoes with onion, peas, coriander and spices.",
        "Wet each bread slice, squeeze out water.",
        "Put filling in the centre, close it into a roll.",
        "Shallow-fry until crisp.",
      ],
    },
    {
      id: "veg-cheese-sandwich", name: "Veg Cheese Sandwich", time: 10, difficulty: "Easy", veg: true,
      uses: [["bread", "4 slices"], ["cheese", "2 slices"], ["tomato", "1"]],
      optional: [["capsicum", "1/2"], ["onion", "1/2"]],
      staples: ["butter", "salt"],
      steps: [
        "Butter the bread.",
        "Layer sliced tomato, onion, capsicum and cheese.",
        "Toast on a pan or grill until the cheese melts.",
      ],
    },
    {
      id: "masala-omelette", name: "Masala Omelette", time: 10, difficulty: "Easy", veg: false,
      uses: [["egg", "3"], ["onion", "1"], ["tomato", "1"]],
      optional: [["capsicum", "1/2"], ["coriander", "a handful"], ["cheese", "1 slice"]],
      staples: ["oil / ghee", "chilli powder", "salt"],
      steps: [
        "Beat eggs with chopped onion, tomato, capsicum, coriander and salt.",
        "Pour into a hot oiled pan.",
        "Cook until set, fold, add cheese if you have it.",
      ],
    },
    {
      id: "paneer-bhurji", name: "Paneer Bhurji", time: 15, difficulty: "Easy", veg: true,
      uses: [["paneer", "200 g"], ["onion", "1"], ["tomato", "1"]],
      optional: [["capsicum", "1/2"], ["coriander", "a handful"], ["peas", "1/4 cup"]],
      staples: ["oil / ghee", "turmeric", "garam masala", "salt"],
      steps: [
        "Sauté onion, then tomato, until soft.",
        "Add turmeric, garam masala and salt.",
        "Crumble in the paneer and capsicum, cook 3 minutes.",
        "Finish with coriander. Eat with chapati or bread.",
      ],
    },
    {
      id: "idli-fry", name: "Masala Idli Fry", time: 10, difficulty: "Easy", veg: true,
      uses: [["idli", "6"], ["onion", "1"]],
      optional: [["coriander", "a handful"], ["tomato", "1"], ["capsicum", "1/2"]],
      staples: ["oil / ghee", "mustard seeds", "chilli powder", "salt"],
      steps: [
        "Cut the idlis into quarters.",
        "Temper mustard seeds, fry onion (and tomato, capsicum).",
        "Add chilli powder and the idli pieces, toss until crisp at the edges.",
      ],
    },
    {
      id: "onion-uttapam", name: "Onion Tomato Uttapam", time: 20, difficulty: "Easy", veg: true,
      uses: [["dosa_batter", "2 cups"], ["onion", "1"], ["tomato", "1"]],
      optional: [["carrot", "1, grated"], ["capsicum", "1/2"], ["coriander", "a handful"]],
      staples: ["oil / ghee", "green chillies", "salt"],
      steps: [
        "Pour a thick round of batter on a hot tawa.",
        "Press chopped onion, tomato and the other veg into the top.",
        "Drizzle oil around, cook, flip once.",
      ],
    },
    {
      id: "hakka-noodles", name: "Veg Hakka Noodles", time: 15, difficulty: "Easy", veg: true,
      uses: [["noodles", "2 cups"], ["onion", "1"], ["capsicum", "1"], ["carrot", "1"]],
      optional: [["egg", "1"]],
      staples: ["oil / ghee", "soy sauce", "ginger-garlic paste", "salt"],
      steps: [
        "Stir-fry ginger-garlic and the sliced veg on high heat.",
        "Add the noodles and soy sauce.",
        "Toss 2 minutes. Add a scrambled egg if you like.",
      ],
    },
    {
      id: "banana-pancakes", name: "Banana Pancakes", time: 20, difficulty: "Easy", veg: true,
      uses: [["banana", "2"], ["milk", "1/2 cup"]],
      optional: [["egg", "1"]],
      staples: ["atta / maida", "sugar", "butter"],
      steps: [
        "Mash the bananas.",
        "Whisk in milk, the egg, 1 cup flour and a spoon of sugar.",
        "Cook small rounds on a buttered pan, flip when bubbles appear.",
      ],
    },
    {
      id: "banana-shake", name: "Banana Milkshake", time: 5, difficulty: "Easy", veg: true,
      uses: [["banana", "2"], ["milk", "2 cups"]],
      optional: [],
      staples: ["sugar"],
      steps: ["Blend banana, cold milk and sugar until smooth.", "Serve right away."],
    },
    {
      id: "raita", name: "Onion Tomato Raita", time: 5, difficulty: "Easy", veg: true,
      uses: [["curd", "1 cup"], ["onion", "1/2"], ["tomato", "1/2"]],
      optional: [["coriander", "a handful"]],
      staples: ["salt", "cumin"],
      steps: ["Whisk the curd smooth.", "Stir in chopped onion, tomato, coriander, salt and roasted cumin."],
    },
  ],
};

/* ---- Extra recipe facts: meal type, equipment, Restaurant Mode notes ----
 * meals:     breakfast | lunch | dinner | snacks | dessert
 * equipment: what you need beyond a knife and a bowl ([] = no cooking)
 * flair:     1-5, how much a chef could do with it (Restaurant Mode ranks by this)
 * chef:      plated name, why the flavours work, how to present it
 */
LC.Data.MEALS = ["breakfast", "lunch", "dinner", "snacks", "dessert"];
LC.Data.EQUIPMENT = { stove: "Stove", blender: "Blender" };
(function () {
  var X = {
    "lemon-rice": [["lunch"], ["stove"], 3, "Citrus-tempered rice with toasted coconut", "Lemon's sharpness cuts the starch, and mustard seeds add a nutty pop.", "Press into a ring mould and top with coconut and one coriander leaf."],
    "curd-rice": [["lunch", "dinner"], ["stove"], 2, "Chilled curd rice with tempered spice oil", "Cool, tangy curd meets the hot tempering.", "Serve in a small bowl and pour the tempering over at the table."],
    "tomato-rice": [["lunch", "dinner"], ["stove"], 3, "Slow-cooked tomato rice", "Tomato cooked down to a jam brings sweetness and acidity to plain rice.", "Shape into a dome and finish with peas and coriander."],
    "veg-fried-rice": [["lunch", "dinner"], ["stove"], 3, "Wok-tossed garden rice", "High heat chars the vegetables; soy adds savoury depth.", "Serve in a shallow bowl with the colourful vegetables on top."],
    "egg-fried-rice": [["lunch", "dinner"], ["stove"], 3, "Golden egg fried rice", "Egg coats each grain and onion adds sweetness.", "Pack into a bowl, turn it out onto the plate, top with coriander."],
    "chicken-fried-rice": [["lunch", "dinner"], ["stove"], 4, "Smoky chicken and egg rice", "Shredded chicken soaks up the soy; egg softens the heat.", "Pile it high with chicken pieces showing on top."],
    "rice-kheer": [["dessert"], ["stove"], 4, "Creamy rice pudding with coconut", "Milk reduced slowly turns lightly caramel and thickens with the rice starch.", "Serve chilled in a small glass with coconut on top."],
    "rice-cutlets": [["snacks"], ["stove"], 4, "Crisp rice and potato croquettes", "A crisp crust against a soft, spiced centre.", "Stack three, with a spoon of raita on the side."],
    "coconut-rice": [["lunch"], ["stove"], 3, "Coconut tempered rice", "Sweet coconut balances the green chilli heat.", "Serve in a neat round with extra coconut on top."],
    "chapati-noodles": [["snacks", "dinner"], ["stove"], 4, "Street-style roti ribbons", "Roti strips take on soy and chilli like hand-cut noodles.", "Twirl with a fork into a nest, vegetables on top."],
    "kothu-chapati": [["dinner"], ["stove"], 4, "Chopped roti with egg and spice", "Chopping blends egg, spice and roti into one texture.", "Serve in a heap with onion rings on the side."],
    "chicken-roll": [["lunch", "snacks"], ["stove"], 4, "Spiced chicken kathi wrap", "Raw onion crunch and cool curd balance the spiced chicken.", "Cut on the diagonal and stand both halves upright."],
    "dal-paratha": [["breakfast", "dinner"], ["stove"], 3, "Lentil-kneaded flatbread", "Dal makes the dough soft and adds protein.", "Fold into quarters and serve with a spoon of curd."],
    "dal-palak": [["lunch", "dinner"], ["stove"], 3, "Spinach and lentil stew", "Earthy spinach melts into the creamy dal.", "Serve in a bowl with a swirl of ghee on top."],
    "bread-upma": [["breakfast"], ["stove"], 2, "Savoury bread crumble", "Bread soaks up the tempered tomato like a stuffing.", "Spoon into a ring mould and top with coriander."],
    "masala-french-toast": [["breakfast"], ["stove"], 4, "Savoury masala French toast", "Onion and chilli turn French toast savoury.", "Cut into triangles and overlap them on the plate."],
    "aloo-bread-roll": [["snacks"], ["stove"], 4, "Crisp potato-stuffed bread rolls", "Crunchy fried bread around a soft spiced filling.", "Cut one roll in half to show the filling."],
    "veg-cheese-sandwich": [["breakfast", "snacks"], ["stove"], 3, "Grilled cheese and tomato toastie", "Melted cheese with the sharpness of tomato.", "Cut into quarters and stack two of them."],
    "masala-omelette": [["breakfast"], ["stove"], 3, "Masala omelette", "Onion, tomato and chilli give the egg full flavour.", "Fold into thirds and garnish with coriander."],
    "paneer-bhurji": [["breakfast", "dinner"], ["stove"], 4, "Spiced paneer scramble", "Soft paneer soaks up the onion-tomato masala.", "Serve in a small bowl with warm bread beside it."],
    "idli-fry": [["breakfast", "snacks"], ["stove"], 4, "Crisp masala idli bites", "Leftover idli crisps up and takes on the tempered spice.", "Put two pieces on a toothpick and serve as bites."],
    "onion-uttapam": [["breakfast", "dinner"], ["stove"], 3, "Onion-tomato uttapam", "Tangy batter with sweet, caramelised onion.", "Cut into wedges like a pizza."],
    "hakka-noodles": [["dinner", "snacks"], ["stove"], 3, "Wok-fried Hakka noodles", "Ginger, garlic and soy over crunchy vegetables.", "Twirl into a tall nest with tongs."],
    "banana-pancakes": [["breakfast", "dessert"], ["stove"], 4, "Ripe banana pancakes", "Overripe banana adds sweetness and keeps them moist.", "Stack three and top with banana slices."],
    "banana-shake": [["breakfast", "snacks"], ["blender"], 2, "Banana milkshake", "Ripe banana thickens cold milk without ice cream.", "Serve in a tall glass with a banana slice on the rim."],
    "raita": [["lunch", "dinner", "snacks"], [], 2, "Onion-tomato raita", "Cool curd balances spicy main dishes.", "Serve in a small bowl dusted with roasted cumin."],
  };
  LC.Data.RECIPES.forEach(function (r) {
    var x = X[r.id];
    if (!x) throw new Error("Missing extra facts for " + r.id);
    r.meals = x[0]; r.equipment = x[1]; r.flair = x[2];
    r.chef = { title: x[3], pairing: x[4], plating: x[5] };
  });
})();
