import {
  showLoader, showSection, mainBtns, recipeBtn, productsBtn, foodLogBtn,
  searchInput, resetHeroSection, searchRecipes, recipesGrid, gridBtns,
  gridViewBtn, listViewBtn, backToRecipesBtn, backToRecipes, productSearchInput,
  barcodeInput, mealSections, productSection, foodLogSection, productsGrid,
  header, desc, state, nutriScoreBtns, displayProducts, filterByNutriGrade,
  normalizeData, scanBtn, logBtn, displayFoodLog, logList, deleteItem, trackProgress,
  logMealBtn,
} from "./state/appState.js";
import {
  getRecipes, getCuisineName, getCategory, getProductCategories, getMealById,
  getProduct, getBarcode,
} from "./api/mealdb.js";
import { createNoProducts, createProductModal, createLogModal } from "./ui/components.js";

window.addEventListener("load", e => {
  showLoader();
  showSection(mealSections);
  getRecipes();
  getCuisineName();
  getCategory();
  getProductCategories();
  createNoProducts()
  normalizeData()
  trackProgress()
})

mainBtns.forEach(btn => {
  btn.addEventListener("click", e => {

    mainBtns.forEach(btn => {
      btn.classList.remove("bg-emerald-50", "text-emerald-700");
      btn.classList.add("text-gray-600", "hover:bg-gray-50");

      btn.lastElementChild.classList.remove("font-semibold");
      btn.lastElementChild.classList.add("font-medium");
    });

    e.currentTarget.classList.remove("text-gray-600", "hover:bg-gray-50");
    e.currentTarget.classList.add("bg-emerald-50", "text-emerald-700");

    e.currentTarget.lastElementChild.classList.remove("font-medium");
    e.currentTarget.lastElementChild.classList.add("font-semibold");
  });
});

recipeBtn.addEventListener("click", e => {
  showSection(mealSections);
  header.innerHTML = `Meals & Recipes`
  desc.innerHTML = `Discover delicious and nutritious recipes tailored for you`
});

productsBtn.addEventListener("click", e => {
  showSection(productSection);
  resetHeroSection()
  header.innerHTML = `Product Scanner`
  desc.innerHTML = `Search packaged foods by name or barcode`
});

foodLogBtn.addEventListener("click", e => {
  showSection(foodLogSection);
  resetHeroSection()
  header.innerHTML = `Food Log`
  desc.innerHTML = `Track your daily nutrition and food intake`
  displayFoodLog()
});

searchInput.addEventListener("input", e => {
  searchRecipes()
})

recipesGrid.addEventListener("click", async (e) => {
  const mealCard = e.target.closest('[data-meal-id]');
  if (!mealCard) return;

  const mealId = mealCard.dataset.mealId;

  await getMealById(mealId);
});

gridBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    gridBtns.forEach(btn => {
      btn.classList.remove("bg-white", "rounded-md", "shadow-sm");
      gridViewBtn.firstElementChild.classList.remove("text-gray-700")
    })

    e.currentTarget.classList.add("bg-white", "rounded-md", "shadow-sm");
    e.currentTarget.firstElementChild.classList.add("text-gray-700")
    gridViewBtn.firstElementChild.classList.add("text-gray-500")
  })
})

listViewBtn.addEventListener("click", e => {
  recipesGrid.classList.replace("grid-cols-4", "grid-cols-2")
})

gridViewBtn.addEventListener("click", e => {
  recipesGrid.classList.replace("grid-cols-2", "grid-cols-4")
})

backToRecipesBtn.addEventListener("click", e => {
  backToRecipes()
})

productSearchInput.addEventListener("input", e => {
  getProduct()
})

barcodeInput.addEventListener("input", e => {
  getBarcode()
})

productsGrid.addEventListener("click", async (e) => {
  const productCard = e.target.closest("[data-barcode]");
  const productId = productCard.dataset.barcode;

  const selectedProduct = state.allProducts.find(product => product.barcode == productId);

  if (selectedProduct) await createProductModal(selectedProduct);
});

nutriScoreBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    nutriScoreBtns.forEach(b => {
      b.style.outline = 'none';
    });

    e.currentTarget.style.outline = '2px solid #000';
    const selectedGrade = e.currentTarget.getAttribute("data-grade");

    filterByNutriGrade(selectedGrade)
  });
});

scanBtn.addEventListener("click", e => {
  showSection(productSection);
  resetHeroSection()
  header.innerHTML = `Product Scanner`
  desc.innerHTML = `Search packaged foods by name or barcode`
})

logBtn.addEventListener("click", e => {
  showSection(mealSections);
  header.innerHTML = `Meals & Recipes`
  desc.innerHTML = `Discover delicious and nutritious recipes tailored for you`
})

logList.addEventListener("click", e => {
  const button = e.target.closest(".remove-foodlog-item");
  const index = parseInt(button.getAttribute("data-index"), 10);
  deleteItem(index);
});

logMealBtn.addEventListener("click" , e => {
  const mealData = e.currentTarget._mealData;
  createLogModal(mealData);
})