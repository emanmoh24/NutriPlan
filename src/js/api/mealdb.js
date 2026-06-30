import {
  state, hideLoader, displayRecipes, displayTargetedMeal,
  displayCategoryBtns, displayCuisineBtns, recipesCount,
  displayProducts, displayProductCategoriesBtns, recipesBaseUrl, productsBaseUrl,
  productSearchInput, barcodeInput, apiKey, nutritionUrl, displayNutritionFacts, productsCount, 
} from "../state/appState.js";

import { createLoadingSpinner, createNoProducts, createNotification } from "../ui/components.js"

export async function getRecipes() {
  try {
    const response = await fetch(`${recipesBaseUrl}search`);
    const data = await response.json()
    state.allRecipes = data.results
    hideLoader()
    displayRecipes(state.allRecipes)
  } catch (error) {
  }
}

export async function getMealById(id) {

  try {
    const response = await fetch(`${recipesBaseUrl}${encodeURIComponent(id)}`);
    const data = await response.json();

    state.targetMeal = data.result;
    const { name, ingredients: rawIngredients } = data.result;
    const ingredients = rawIngredients.map(({ ingredient }) => ingredient);
    const mealFacts = { name, ingredients };
    await getNutritionFacts(mealFacts);
    displayTargetedMeal()


  } catch (error) {
  }
}

async function getNutritionFacts(mealData) {
  try {
    const response = await fetch(nutritionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(mealData)
    });

    const data = await response.json()
    state.nutrients = data.data
  } catch (error) {
  }
}

export async function getCategory() {
  try {
    const response = await fetch(`${recipesBaseUrl}categories`);
    const data = await response.json();
    state.categoryList = data.results
    displayCategoryBtns()
  } catch (error) {
  }
}

export async function getCuisineName() {
  try {
    const response = await fetch(`${recipesBaseUrl}areas?limit=8`);
    const data = await response.json();
    state.areaList = data.results;
    displayCuisineBtns()

  } catch (error) {
  }
}

export async function filterByMealType(category) {
  try {
    const response = await fetch(`${recipesBaseUrl}filter?category=${encodeURIComponent(category)}&page=1&limit=25`);
    const data = await response.json();
    state.mealTypeList = data.results

    displayRecipes(state.mealTypeList)
    recipesCount.innerHTML = `Showing ${state.mealTypeList.length} ${category} recipes`


  } catch (error) { }
}

export async function getProduct() {
  state.product = productSearchInput.value
  createLoadingSpinner()
  try {
    const response = await fetch(`${productsBaseUrl}search?q=${encodeURIComponent(state.product)}`);
    const data = await response.json();
    state.allProducts = data.results
    displayProducts(state.allProducts)
    

  } catch (error) { }
}

export async function getProductCategories() {
  try {
    const response = await fetch(`${productsBaseUrl}categories`)
    const data = await response.json();
    state.allProductCategories = data.results
    displayProductCategoriesBtns()
  } catch (error) { }
}

export async function getBarcode() {

  const barcode = barcodeInput.value.trim()
  createLoadingSpinner()

  try {
    const response = await fetch(`${productsBaseUrl}barcode/${encodeURIComponent(barcode)}`);
    const data = await response.json();
    state.targetBarcode = [data.result]
    displayProducts(state.targetBarcode)
  } catch (error) { 
    createNotification("Product not found in database", "#ff2a3a")
  }
}

export async function filterByCategory (category) {
    try {
    const response = await fetch(`${productsBaseUrl}category/${encodeURIComponent(category)}`);
    const data = await response.json();
    state.filteredProducts = data.results

    if (state.filteredProducts.length === 0) {
      productsCount.innerHTML = `No products found `
      productsGrid.innerHTML = ``
      createNoProducts()
    } else {
      
      productsCount.innerHTML = `Found ${state.filteredProducts.length} in  `
      displayProducts(state.filteredProducts)
    }
  } catch (error) { }
}