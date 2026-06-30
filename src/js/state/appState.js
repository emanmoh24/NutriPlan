import { getRecipes, filterByMealType, filterByCategory } from "../api/mealdb.js";
import { createNoProducts, createNoRecipes, } from "../ui/components.js";

export const header = document.querySelector("#header h1");
export const desc = document.querySelector("#header p")
export const recipesBaseUrl = "https://nutriplan-api.vercel.app/api/meals/";
export const productsBaseUrl = "https://nutriplan-api.vercel.app/api/products/";
export const nutritionUrl = "https://nutriplan-api.vercel.app/api/nutrition/analyze";
export const apiKey = "26vXxPsh6xozvvtXRRZxbQo2veAsTaHu7KdQe16P";
const filterSection = document.querySelector("#search-filters-section");
const allRecipesSection = document.querySelector("#all-recipes-section");
export const recipesCount = document.querySelector("#recipes-count");
export const recipesGrid = document.querySelector("#recipes-grid");
const cuisines = document.querySelector("#cuisines");
const categorySection = document.querySelector("#categories-grid");
export const searchInput = document.querySelector("#search-input");
export const mealSections = Array.from(document.querySelectorAll('[data-section="meal"]'));
export const productSection = document.querySelector("#products-section");
export const foodLogSection = document.querySelector("#foodlog-section");
const mealDetailsSection = document.querySelector("#meal-details");
export const recipeBtn = document.querySelector("#meal");
export const productsBtn = document.querySelector("#product-scanner");
export const foodLogBtn = document.querySelector("#food-log");
const allSections = [...mealSections, productSection, foodLogSection, mealDetailsSection];
export const backToRecipesBtn = document.querySelector("#back-to-meals-btn");
export const productSearchInput = document.querySelector("#product-search-input");
export const productsGrid = document.querySelector("#products-grid");
export const barcodeInput = document.querySelector("#barcode-input");
export const gridViewBtn = document.querySelector("#grid-view-btn");
export const listViewBtn = document.querySelector("#list-view-btn");
export const gridBtns = [gridViewBtn, listViewBtn]
const productCategoryBtns = document.querySelector("#product-categories");
const loader = document.querySelector("#app-loading-overlay");
export const mainBtns = document.querySelectorAll(".nav-link");
export const productsCount = document.querySelector("#products-count");
const heroServing = document.querySelector("#hero-servings");
export const heroCalories = document.querySelector("#hero-calories");
const heroSection = document.querySelector("#hero-section");
export const nutriScoreBtns = document.querySelectorAll("[data-grade]");
export const logMealBtn = document.querySelector("#log-meal-btn");
export const scanBtn = document.querySelector(".scan-product");
export const logBtn = document.querySelector(".log-meal");
export const logList = document.querySelector("#logged-items-list")

let CuisineList = [];

export const state = {
  allRecipes: [],
  targetMeal: null,
  categoryList: [],
  areaList: [],
  mealTypeList: [],
  allProducts: [],
  product: null,
  allProductCategories: [],
  targetBarcode: null,
  nutrients: null,
  calories: null,
  nGrade: null,
  filteredProducts: [],
  log: [],
};

export function showLoader() {
  loader.style.display = "flex"
}

export function hideLoader() {
  loader.style.display = "none"
}

export function showSection(activeSections) {

  const targets = [activeSections].flat();

  allSections.forEach(section => {
    if (section) {
      section.style.display = targets.includes(section) ? "block" : "none";
    }
  });
}

export function resetHeroSection() {
  document.querySelector("#hero-section").innerHTML = ``;
}

export function displayRecipes(array) {
  let box = "";

  array.forEach(recipe => {
    box += `<div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${recipe.id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${recipe.thumbnail}"
                  alt="${recipe.name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${recipe.category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${recipe.area === null ? `International` : recipe.area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${recipe.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${recipe.instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${recipe.category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${recipe.area === null ? `International` : recipe.area}
                  </span>
                </div>
              </div>
            </div>`
  })

  recipesGrid.innerHTML = box;

  if (array.length === 0) {
    createNoRecipes()
  }
}

export function searchRecipes() {
  let searchResults = [];

  const searchedData = searchInput.value;
  const searchTerm = searchedData.trim().toLowerCase();

  state.allRecipes.forEach(recipe => {

    if (recipe.name.toLowerCase().includes(searchTerm)) {
      searchResults.push(recipe)
    }
  });

  displayRecipes(searchResults)
  recipesCount.innerHTML = `Showing ${searchResults.length} recipes for "${searchedData}"`
}

export function displayCuisineBtns() {
  let box = `<button data-cuisine="all cuisines" class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all">
          All Cuisines
        </button>`;

  state.areaList.forEach(area => {
    box += `
            <button data-cuisine="${area.name}"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            >
              ${area.name}
            </button>`
  })


  cuisines.innerHTML = box;
  setHoverEffect()
  // allCuisinesBtn = document.querySelector('[data-cuisine="all cuisines"]')
}

function setHoverEffect() {
  const buttons = cuisines.querySelectorAll('#cuisines button');

  buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.1)";
      button.style.transition = "0.3s";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.transition = "0.3s";
    });

    button.addEventListener("click", e => {
      buttons.forEach(btn => {
        btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
        btn.classList.remove("bg-emerald-600", "text-white", "hover:bg-emerald-700");
      });

      e.currentTarget.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
      e.currentTarget.classList.add("bg-emerald-600", "text-white", "hover:bg-emerald-700");

      const selectedCuisine = e.currentTarget.getAttribute("data-cuisine");
      filterByCuisine(selectedCuisine)

    });
  });
}

async function filterByCuisine(cuisine) {

  if (cuisine.toLowerCase() === "all cuisines") {
    try {
      await getRecipes();
      recipesCount.innerHTML = `Showing all recipes`;
    } catch (error) {
    }
    return;
  }

  try {
    const response = await fetch(`${recipesBaseUrl}filter?area=${encodeURIComponent(cuisine)}&page=1&limit=25`);
    const data = await response.json();
    CuisineList = data.results;

    displayRecipes(CuisineList);
    recipesCount.innerHTML = `Showing ${CuisineList.length} ${cuisine} recipes`;

  } catch (error) {
  }
}

export function displayCategoryBtns() {
  const categoryStyle = {
    Beef: {
      badge: "background-color: #FEF1F1; border-color: #FFD6D6",
      hoverBorder: "#FF2E59",
      icon: '<i class="fa-solid fa-drumstick-bite"></i>',
      gradient: "background-image: linear-gradient(to top left, #FF2E59, #FF5F65)"
    },
    Chicken: {
      badge: "background-color: #FFF9EB; border-color: #FFEAA7",
      hoverBorder: "#FF7600",
      icon: '<i class="fa-solid fa-drumstick-bite"></i>',
      gradient: "background-image: linear-gradient(to top left, #FF7600, #FFB200)"
    },
    Dessert: {
      badge: "background-color: #FDF1F4; border- color: #FFD2E7",
      hoverBorder: "#FF2E63",
      icon: '<i class="fa-solid fa-cake-candles"></i>',
      gradient: "background-image: linear-gradient(to top left, #FF2E63, #FC5FAC)"
    },
    Lamb: {
      badge: "background-color: #FFF9EB; border-color: #FFE3C4",
      hoverBorder: "#FE9800",
      icon: '<i class="fa-solid fa-drumstick-bite"></i>',
      gradient: "background-image: linear-gradient(to top left, #FE9800, #FF8B00)"
    },
    Miscellaneous: {
      badge: "background-color: #F8FAFB; border-color: #E2E8F0",
      hoverBorder: "#6F7889",
      icon: '<i class="fa-solid fa-bowl-rice"></i>',
      gradient: "background-image: linear-gradient(to top left, #6F7889, #8C9DB4)"
    },
    Pasta: {
      badge: "background-color: #FEFBE9; border-color: #FFF2CC",
      hoverBorder: "#FD9F00",
      icon: '<i class="fa-solid fa-bowl-food"></i>',
      gradient: "background-image: linear-gradient(to top left, #FD9F00, #FDC300)"
    },
    Pork: {
      badge: "background-color: #FEF1F2; border-color: #FFD6D6",
      hoverBorder: "#FB333E",
      icon: '<i class="fa-solid fa-bacon"></i>',
      gradient: "background-image: linear-gradient(to top left, #FB333E, #FF5E77)"
    },
    Seafood: {
      badge: "background-color: #EDFAFE; border-color: #C9F3FF",
      hoverBorder: "#228AFF",
      icon: '<i class="fa-solid fa-fish"></i>',
      gradient: "background-image: linear-gradient(to top left, #228AFF, #00CBF5)"
    },
    Side: {
      badge: "background-color: #EDFDF4; border-color: #D4EDDA",
      hoverBorder: "#00C07C",
      icon: '<i class="fa-solid fa-plate-wheat"></i>',
      gradient: "background-image: linear-gradient(to top left, #00C07C, #00DC74)"
    },
    Starter: {
      badge: "background-color: #EDFDFD; border-color: #D1F8F5",
      hoverBorder: "#00BBD7",
      icon: '<i class="fa-solid fa-utensils"></i>',
      gradient: "background-image: linear-gradient(to top left, #00BBD7, #00D3C0)"
    },
    Vegan: {
      badge: "background-color: #EDFDF4; border-color: #D4EDDA",
      hoverBorder: "#00CA5A",
      icon: '<i class="fa-solid fa-leaf"></i>',
      gradient: "background-image: linear-gradient(to top left, #00CA5A, #00D38D)"
    },
    Vegetarian: {
      badge: "background-color: #F3FEEF; border-color: #E1FAD4",
      hoverBorder: "#00CC4B",
      icon: '<i class="fa-solid fa-seedling"></i>',
      gradient: "background-image: linear-gradient(to top left, #00CC4B, #8FE300)"
    }
  };

  const defaultStyle = {
    badge: "background-color: #F8FAFB; border-color: #E2E8F0",
    hoverBorder: "#6F7889",
    icon: '<i class="fa-solid fa-utensils"></i>',
    gradient: "background-image: linear-gradient(to top left, #6F7889, #8C9DB4)"
  };

  const box = state.categoryList.slice(0, 12).map(category => {
    const style = categoryStyle[category.name] || defaultStyle;
    const baseBorderColor = style.badge.split("border-color: ")[1] || "#E2E8F0";

    return `
      <div style="${style.badge}"
        class="category-card bg-gradient-to-br rounded-xl p-3 border hover:shadow-md cursor-pointer transition-all group"
        data-category="${category.name}"
        data-default-border="${baseBorderColor}"
        data-hover-border="${style.hoverBorder}"
      >
        <div class="flex items-center gap-2.5">
          <div 
            class="text-white w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
            style="${style.gradient}"
          >
            ${style.icon}
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">${category.name}</h3>
          </div>
        </div>
      </div>
    `;
  }).join("");

  categorySection.innerHTML = box;
  setCategoryBtns();
}

function setCategoryBtns() {
  const buttons = Array.from(categorySection.children);

  buttons.forEach(button => {
    const defaultBorder = button.getAttribute("data-default-border");
    const hoverBorder = button.getAttribute("data-hover-border");

    button.addEventListener("click", e => {
      const category = e.currentTarget.getAttribute("data-category");
      filterByMealType(category);
    });

    button.addEventListener("mouseenter", () => {
      button.style.borderColor = hoverBorder;
    });

    button.addEventListener("mouseleave", () => {
      button.style.borderColor = defaultBorder;
    });
  });
}

export function displayTargetedMeal() {
  showSection(mealDetailsSection)
  mealSections.forEach(section => {
    section.style.display = "none"
  })

  mealDetailsSection.classList.remove("hidden")
  heroSection.innerHTML = `<div class="relative h-80 md:h-96">
              <img
                src="${state.targetMeal.thumbnail}"
                alt="${state.targetMeal.name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${state.targetMeal.category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${state.targetMeal.area}</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >${state.targetMeal.tags[1] || "Cassarole"}</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${state.targetMeal.name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">${state.nutrients.servings} servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">${state.nutrients.perServing.calories} cal/serving</span>
                  </span>
                </div>
              </div>
            </div>`

  const ingredients = document.querySelector("#ingredients");
  const ingredientsSection = state.targetMeal.ingredients.map(item => `
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
      <input
        type="checkbox"
        class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
      />
      <span class="text-gray-700">
        <span class="font-medium text-gray-900">${item.measure}</span> ${item.ingredient}
      </span>
    </div>
  `).join('');

  ingredients.innerHTML = ` <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${state.targetMeal.ingredients.length} items</span
                  >
                </h2>
                ${ingredientsSection}`;

  const instructions = document.querySelector("#instructions");
  const instructionsSection = state.targetMeal.instructions.map((step, index) => `
    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
        ${index + 1}
      </div>
      <p class="text-gray-700 leading-relaxed pt-2">
        ${step}
      </p>
    </div>
  `).join('');

  instructions.innerHTML = `  <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                ${instructionsSection}`;

  const video = document.querySelector("#video");
  const videoId = state.targetMeal.youtube.split('v=')[1]?.split('&')[0];
  video.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  video.setAttribute("src", `https://www.youtube-nocookie.com/embed/${videoId}`);
  displayNutritionFacts()

  logMealBtn._mealData = {
      id: state.targetMeal.id,
      name: state.targetMeal.name,
      image: state.targetMeal.thumbnail,
      calories: state.nutrients?.perServing?.calories || 0,
      protein: state.nutrients?.perServing?.protein || 0,
      carbs: state.nutrients?.perServing?.carbs || 0,
      fat: state.nutrients?.perServing?.fat || 0
    };
}

export function displayNutritionFacts() {
  const nutritionContainer = document.querySelector("#nutrition-facts-container");
  const nutrient = state.nutrients;

  const protein = parseFloat(nutrient.perServing.protein) || 0;
  const carbs = parseFloat(nutrient.perServing.carbs) || 0;
  const fat = parseFloat(nutrient.perServing.fat) || 0;
  const fiber = parseFloat(nutrient.perServing.fiber) || 0;
  const sugar = parseFloat(nutrient.perServing.sugar) || 0;

  const totalNutrients = protein + carbs + fat + fiber + sugar;

  const proteinPercent = totalNutrients ? Math.round((protein / totalNutrients) * 100) : 0;
  const carbsPercent = totalNutrients ? Math.round((carbs / totalNutrients) * 100) : 0;
  const fatPercent = totalNutrients ? Math.round((fat / totalNutrients) * 100) : 0;
  const fiberPercent = totalNutrients ? Math.round((fiber / totalNutrients) * 100) : 0;
  const sugarPercent = totalNutrients ? Math.round((sugar / totalNutrients) * 100) : 0;
  nutritionContainer.innerHTML = `
    <p class="text-sm text-gray-500 mb-4">Per serving</p>

    <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
      <p class="text-sm text-gray-600">Calories per serving</p>
      <p class="text-4xl font-bold text-emerald-600">${nutrient.perServing.calories || 0}</p>
      <p class="text-xs text-gray-500 mt-1">Total: ${nutrient.totals?.calories || 0} cal</p>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-gray-700">Protein</span>
        </div>
        <span class="font-bold text-gray-900">${protein}g</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-2">
        <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${proteinPercent}%"></div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-gray-700">Carbs</span>
        </div>
        <span class="font-bold text-gray-900">${carbs}g</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-2">
        <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${carbsPercent}%"></div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
          <span class="text-gray-700">Fat</span>
        </div>
        <span class="font-bold text-gray-900">${fat}g</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-2">
        <div class="bg-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${fatPercent}%"></div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-orange-500"></div>
          <span class="text-gray-700">Fiber</span>
        </div>
        <span class="font-bold text-gray-900">${nutrient.perServing.fiber || 0}g</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-2">
        <div class="bg-orange-500 h-2 rounded-full transition-all duration-500" style="width: ${fiberPercent}%"></div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-pink-500"></div>
          <span class="text-gray-700">Sugar</span>
        </div>
        <span class="font-bold text-gray-900">${nutrient.perServing.sugar || 0}g</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-2">
        <div class="bg-pink-500 h-2 rounded-full transition-all duration-500" style="width: ${sugarPercent}%"></div>
      </div>
    </div>

    <div class="mt-6 pt-6 border-t border-gray-100">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Vitamins & Minerals (% Daily Value)</h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="flex justify-between"><span class="text-gray-600">Vitamin A</span><span class="font-medium">15%</span></div>
        <div class="flex justify-between"><span class="text-gray-600">Vitamin C</span><span class="font-medium">25%</span></div>
        <div class="flex justify-between"><span class="text-gray-600">Calcium</span><span class="font-medium">4%</span></div>
        <div class="flex justify-between"><span class="text-gray-600">Iron</span><span class="font-medium">12%</span></div>
      </div>
    </div>
  `;

  heroServing.innerHTML = `${nutrient.servings} servings`
  heroCalories.innerHTML = `${nutrient.perServing.calories} cal/serving`
}

export function backToRecipes() {

  mealDetailsSection.classList.add("hidden");

  mealSections.forEach(section => {
    section.style.display = "flex"
  })
}

export function displayProducts(array) {
  let box = '';

  const scoreColors = {
    a: { bg: "bg-emerald-500/20", text: "text-emerald-600", mainBg: "bg-emerald-500" },
    b: { bg: "bg-lime-500/20", text: "text-lime-600", mainBg: "bg-lime-500" },
    c: { bg: "bg-amber-500/20", text: "text-amber-600", mainBg: "bg-amber-500" },
    d: { bg: "bg-orange-500/20", text: "text-orange-600", mainBg: "bg-orange-500" },
    e: { bg: "bg-red-500/20", text: "text-red-600", mainBg: "bg-red-500" }
  };

  state.allProducts = array || [];

  state.allProducts.forEach(product => {

    const grade = (product.nutritionGrade || 'c').toLowerCase();
    const currentScore = scoreColors[grade] || scoreColors['c'];

    const isUltraProcessed = (product.novaGroup || 0) > 2;
    const novaBg = isUltraProcessed ? "bg-red-500" : "bg-emerald-500";

    const rawCalories = product.nutrients?.calories || 0;
    const displayedCalories = rawCalories.toFixed(2);

    const imageElement = product.image
      ? `<img
          class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        />`
      : `<div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          <i class="text-4xl text-gray-400" data-fa-i2svg="">
            <svg class="svg-inline--fa fa-box" data-prefix="fas" data-icon="box" role="img" viewBox="0 0 448 512" aria-hidden="true">
              <path fill="currentColor" d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"></path>
            </svg>
          </i>
        </div>`;

    box += `<div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${product.barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  ${imageElement}

                  <div
                    class="absolute top-2 left-2 ${currentScore.mainBg} text-white text-xs font-bold px-2 py-1 rounded uppercase shadow-sm"
                  >
                    Nutri-Score ${grade}
                  </div>

                  <div
                    class="absolute top-2 right-2 ${novaBg} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                    title="NOVA ${product.novaGroup || 'N/A'}"
                  >
                    ${product.novaGroup || '—'}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${product.brand || 'Unknown Brand'}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${product.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>100g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${displayedCalories} kcal</span
                    >
                  </div>

                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${(product.nutrients?.protein || 0).toFixed(2)}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${(product.nutrients?.carbs || 0).toFixed(2)}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${(product.nutrients?.fat || 0).toFixed(2)}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${(product.nutrients?.sugar || 0).toFixed(2)}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`;
  });

  if (barcodeInput.value.trim() !== "") {
    if (array && array.length > 0 && array[0] !== null) {
      productsCount.innerHTML = `Found product: ${array[0].name}`;
      productsGrid.innerHTML = box;
    } else {
      productsGrid.innerHTML = '';
      createNoProducts();
      productsCount.innerHTML = `No product found with barcode: "${barcodeInput.value}"`;
    }
  } else {
    if (array && array.length > 0) {
      productsCount.innerHTML = `Found ${array.length} products for "${state.product || ''}"`;
      productsGrid.innerHTML = box;
    } else {
      productsGrid.innerHTML = '';
      createNoProducts();
      productsCount.innerHTML = `No products found for "${state.product || ''}"`;
    }
  }
}

export function displayProductCategoriesBtns() {
  const { 8: BreakfastCereals, 1: Beverages, 0: Snacks, 2: Dairy, 14: Fruits,
    15: Vegetables, 9: Breads, 16: Meats, 17: Fish, 20: Sauces } = state.allProductCategories;
  const finalCategories = [BreakfastCereals, Beverages, Snacks, Dairy, Fruits, Vegetables, Breads, Meats, Fish, Sauces]
  const btnsStyle = {
    Snacks: {
      icon: '<i class="fa-solid fa-cookie mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #B147FF, #D148D0 , #F138A2)"
    },
    Beverages: {
      icon: '<i class="fa-solid fa-bottle-water mr-1.5" ></i>',
      gradient: "background-image: linear-gradient(to right, #2982FF, #00A1EE , #00B7DC)"
    },
    Dairy: {
      icon: '<i class="fa-solid fa-cheese mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #00B9FF, #139BFF , #2A81FF)"
    },
    "Breakfast Cereals": {
      icon: '<i class="fa-solid fa-wheat-awn mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #FE9700, #FF8100 , #FF6A00)"
    },
    Fruits: {
      icon: '<i class="fa-solid fa-apple-whole mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #FB2B3A, #FE2748 , #FF2155)"
    },
    Vegetables: {
      icon: '<i class="fa-solid fa-carrot mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #00C852, #00C269 , #00BD7A)"
    },
    Breads: {
      icon: '<i class="fa-solid fa-bread-slice mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #E37600, #EA9500 , #EFAD00)"
    },
    Meats: {
      icon: '<i class="fa-solid fa-drumstick-bite mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #E70014, #EA002E , #EC003E)"
    },
    "Fish & Seafood": {
      icon: '<i class="fa-solid fa-fish mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #00B4DD, #0090EC , #0F62FA)"
    },
    Sauces: {
      icon: '<i class="fa-solid fa-jar mr-1.5"></i>',
      gradient: "background-image: linear-gradient(to right, #FF6800, #FF5016 , #FB2E35)"
    },
  }

  const defaultStyle = {
    icon: '<i class="fa-solid fa-cookie mr-1.5"></i>',
    gradient: "background-image: linear-gradient(to top left, #000, #000 , #000)"
  }

  const box = finalCategories.map(category => {

    const style = btnsStyle[category.name] || defaultStyle

    return `<button style="${style.gradient}"
                class="product-category-btn px-4 py-2 text-white rounded-lg text-sm font-medium whitespace-nowrap hover:bg-emerald-200 transition-all"
              >
                ${style.icon} ${category.name}
              </button>`

  }).join("")
  productCategoryBtns.innerHTML = box
  setProductCategoryBtns()
}

export function filterByNutriGrade(grade) {
  if (grade === "") {
    displayProducts(state.allProducts);
    return;
  }

  const targetGrade = grade.toLowerCase();
  let selectedProducts = [];

  state.allProducts.forEach(product => {
    const productGrade = (product.nutritionGrade || '').toLowerCase();

    if (targetGrade === productGrade) {
      selectedProducts.push(product);
    }
  });

  displayProducts(selectedProducts);
}

function setProductCategoryBtns() {
  const buttons = Array.from(productCategoryBtns.children);

  buttons.forEach(button => {
    button.addEventListener("click", e => {
      const target = e.currentTarget
      filterByCategory(target)
    })
  })

}

export function normalizeData() {
  const date = document.querySelector("#foodlog-date");

  const today = new Date();
  const options = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);
  date.innerHTML = `${formattedDate}`
}

export function displayFoodLog() {
  const logged = JSON.parse(localStorage.getItem("foodLog")) || [];
  let box = '';

  logged.forEach((meal, index) => {
    const productName = meal.name || 'Unknown Item';
    const brandName = meal.brand || meal.name || 'Product';
    const logTime = meal.loggedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const calories = meal.nutrients?.calories?.toFixed(0) || 0;
    const protein = meal.nutrients?.protein?.toFixed(1) || 0;
    const carbs = meal.nutrients?.carbs?.toFixed(1) || 0;
    const fat = meal.nutrients?.fat?.toFixed(1) || 0;

    box += `
      <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="text-blue-600 text-xl">
              <svg class="svg-inline--fa fa-box w-5 h-5" viewBox="0 0 448 512" aria-hidden="true">
                <path fill="currentColor" d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"></path>
              </svg>
            </i>
          </div>
          <div>
            <p class="font-semibold text-gray-900">${productName}</p>
            <p class="text-sm text-gray-500">
              ${brandName}
              <span class="mx-1">•</span>
              <span class="text-blue-600">Product</span>
            </p>
            <p class="text-xs text-gray-400 mt-1">${logTime}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-lg font-bold text-emerald-600">${calories}</p>
            <p class="text-xs text-gray-500">kcal</p>
          </div>
          <div class="hidden md:flex gap-2 text-xs text-gray-500">
            <span class="px-2 py-1 bg-blue-50 rounded">${protein}g P</span>
            <span class="px-2 py-1 bg-amber-50 rounded">${carbs}g C</span>
            <span class="px-2 py-1 bg-purple-50 rounded">${fat}g F</span>
          </div>
          <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
            <i>
              <svg class="svg-inline--fa fa-trash-can w-4 h-4" viewBox="0 0 448 512" aria-hidden="true">
                <path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path>
              </svg>
            </i>
          </button>
        </div>
      </div>`;
  });

  if (logged.length === 0) {
    logList.innerHTML = `<div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">
                  Add meals from the Meals page or scan products
                </p>
              </div>`
  } else {
    logList.innerHTML = box;
  }
}

export function deleteItem(index) {
  state.log.splice(index, 1);
  localStorage.setItem("foodLog", JSON.stringify(state.log));
  displayFoodLog();
  updateProgress()
  trackProgress()
}

export function updateProgress() {
  // 1. Fetch and parse logs from localStorage
  const loggedItems = JSON.parse(localStorage.getItem("foodLog")) || [];

  // 2. Define daily targets (matching your HTML defaults)
  const targets = {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65
  };

  // 3. Calculate accumulated totals
  const totals = loggedItems.reduce((acc, item) => {
    acc.calories += item.nutrients?.calories || 0;
    acc.protein += item.nutrients?.protein || 0;
    acc.carbs += item.nutrients?.carbs || 0;
    acc.fat += item.nutrients?.fat || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // 4. Calculate progress percentages (capped at 100%)
  const percentages = {
    calories: Math.min(100, (totals.calories / targets.calories) * 100),
    protein: Math.min(100, (totals.protein / targets.protein) * 100),
    carbs: Math.min(100, (totals.carbs / targets.carbs) * 100),
    fat: Math.min(100, (totals.fat / targets.fat) * 100)
  };

  // 5. Update the DOM without changing structural classes
  // We locate the 4 sequential progress card blocks within your grid wrapper
  const progressGrid = document.querySelector(".grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4");
  
  if (!progressGrid) return; // Guard clause if element isn't in DOM yet

  const cards = progressGrid.children;

  // Macros mapping matches the structural index of your HTML snippet
  const macroOrder = ['calories', 'protein', 'carbs', 'fat'];

  macroOrder.forEach((macro, index) => {
    const card = cards[index];
    if (!card) return;

    // Select the "0 / Target unit" text container
    const statusText = card.querySelector(".text-sm.text-gray-500");
    // Select the actual moving bar div
    const progressBar = card.querySelector(".rounded-full > div");

    if (statusText) {
      const unit = macro === 'calories' ? 'kcal' : 'g';
      // Format totals nicely (0 decimals for calories, 1 decimal for macronutrients)
      const displayTotal = macro === 'calories' ? totals[macro].toFixed(0) : totals[macro].toFixed(1);
      statusText.textContent = `${displayTotal} / ${targets[macro]} ${unit}`;
    }

    if (progressBar) {
      progressBar.style.width = `${percentages[macro]}%`;
    }
  });
}

export function trackProgress() {
  // 1. Get logs from localStorage
  const loggedItems = JSON.parse(localStorage.getItem("foodLog")) || [];

  // 2. Generate the last 7 days ending at today
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trackingDays = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0); // Clear time for strict day matching

    trackingDays.push({
      dateString: d.toDateString(), 
      dayName: daysOfWeek[d.getDay()],
      dayNum: d.getDate(),
      calories: 0,
      itemCount: 0,
      isToday: d.toDateString() === today.toDateString()
    });
  }

  // 3. Aggregate Calorie data per day from foodLog
  loggedItems.forEach(item => {
    const itemDate = item.loggedAt ? new Date(item.loggedAt) : new Date();
    itemDate.setHours(0, 0, 0, 0);
    const logDateStr = itemDate.toDateString();

    const targetDay = trackingDays.find(day => day.dateString === logDateStr);
    if (targetDay) {
      targetDay.calories += item.nutrients?.calories || 0;
      targetDay.itemCount += 1;
    }
  });

  // 4. Build layout adjustments with fixed vertical spacing
  const annotations = [];
  const shapes = [];

  trackingDays.forEach((day, index) => {
    const xPos = index; 

    // Background Highlight Pill for current day
    if (day.isToday) {
      shapes.push({
        type: 'rect',
        xref: 'x', yref: 'paper',
        x0: xPos - 0.42, x1: xPos + 0.42,
        y0: -0.08, y1: 1.08,
        fillcolor: '#e0e7ff', // Light blue background
        line: { width: 0 },
        layer: 'below'
      });
    }

    const labelColor = '#6b7280'; 
    const valueColor = day.calories > 0 ? '#059669' : '#9ca3af'; 
    const valueWeight = day.calories > 0 ? 'bold' : 'normal';

    // Row 1: Day Name (e.g. Wed)
    annotations.push({
      x: xPos, y: 0.90, xref: 'x', yref: 'paper',
      text: day.dayName,
      showarrow: false,
      font: { family: 'Inter, sans-serif', size: 13, color: labelColor },
      yanchor: 'center'
    });

    // Row 2: Day of Month Number (e.g. 24)
    annotations.push({
      x: xPos, y: 0.65, xref: 'x', yref: 'paper',
      text: `<b>${day.dayNum}</b>`,
      showarrow: false,
      font: { family: 'Inter, sans-serif', size: 15, color: '#111827' },
      yanchor: 'center'
    });

    // Row 3: Calorie Digits
    annotations.push({
      x: xPos, y: 0.38, xref: 'x', yref: 'paper',
      text: `<span style="font-weight: ${valueWeight}">${day.calories.toFixed(0)}</span>`,
      showarrow: false,
      font: { family: 'Inter, sans-serif', size: 18, color: valueColor },
      yanchor: 'center'
    });

    // Row 4: Units Tag & Sub-items (Pushed down to prevent structural overlapping)
    const unitText = day.calories > 0 
      ? `kcal<br><span style="color: #9ca3af; font-size: 11px; font-weight: normal;">${day.itemCount} items</span>` 
      : 'kcal';

    annotations.push({
      x: xPos, y: 0.12, xref: 'x', yref: 'paper',
      text: unitText,
      showarrow: false,
      font: { family: 'Inter, sans-serif', size: 12, color: '#9ca3af' },
      yanchor: 'top' // Allows multi-line strings to expand downward without pushing upward
    });
  });

  // 5. Configuration and Initialization Properties
  const data = [{
    x: [0, 1, 2, 3, 4, 5, 6],
    y: [0, 0, 0, 0, 0, 0, 0],
    type: 'bar',
    showlegend: false,
    hoverinfo: 'none'
  }];

  const layout = {
    height: 140,
    margin: { l: 10, r: 10, t: 10, b: 10 },
    xaxis: {
      showgrid: false,
      zeroline: false,
      showline: false,
      ticks: '',
      showticklabels: false,
      range: [-0.6, 6.6],
      fixedrange: true
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showline: false,
      ticks: '',
      showticklabels: false,
      range: [0, 1],
      fixedrange: true
    },
    shapes: shapes,
    annotations: annotations,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };

  const config = { responsive: true, displayModeBar: false };

  Plotly.newPlot('weekly-chart', data, layout, config);
}





