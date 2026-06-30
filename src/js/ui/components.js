import { recipesGrid, productSection, productsGrid, state, updateProgress, trackProgress } from "../state/appState.js";
let meal ;

export function createNoRecipes() {
  const noRecipesContainer = document.createElement("div");
  const iconContainer = document.createElement("div")
  const icon = document.createElement("span");
  const text = document.createTextNode("No recipes found. Try a different search term.");
  const p = document.createElement("p");

  noRecipesContainer.style.cssText = `display:flex ; flex-flow: column wrap ; justify-content: center; align-items: center; text-align: center; padding-block: 12px `
  iconContainer.style.cssText = `width: 70px; height: 70px; border-radius: 50%; display:flex; justify-content: center; align-items: center; margin-bottom: 16px; background-color: #F3F4F6`
  icon.classList.add("fa-solid", "fa-magnifying-glass");
  icon.style.cssText = `font-size:20px ; color: #99A1AF`
  p.style.cssText = `font-size: 18px; color: #6a7282`

  p.appendChild(text);
  iconContainer.appendChild(icon);
  noRecipesContainer.appendChild(iconContainer)
  noRecipesContainer.appendChild(p);
  recipesGrid.appendChild(noRecipesContainer);
}

export function createNoProducts() {
  const noProductsContainer = document.createElement("div");
  noProductsContainer.classList.add(
    "no-products-placeholder",
    "col-span-full",
    "w-full",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-center",
    "py-12"
  );

  const iconContainer = document.createElement("div");
  iconContainer.classList.add(
    "w-16",
    "h-16",
    "rounded-full",
    "flex",
    "items-center",
    "justify-center",
    "mb-4",
    "bg-gray-100"
  );

  const icon = document.createElement("span");
  icon.classList.add("fa-solid", "fa-box-open", "text-xl", "text-gray-400");

  const text = document.createTextNode("No products to display");
  const searchText = document.createTextNode("Search for a product or browse by category");

  const p = document.createElement("p");
  p.classList.add("text-lg", "text-gray-500", "font-normal");

  const searchP = document.createElement("p");
  searchP.classList.add("text-sm", "text-gray-400");

  searchP.appendChild(searchText);
  p.appendChild(text);
  iconContainer.appendChild(icon);
  noProductsContainer.appendChild(iconContainer);
  noProductsContainer.appendChild(p);
  noProductsContainer.appendChild(searchP);
  productsGrid.appendChild(noProductsContainer);
}

export function createProductModal(product) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in";

  const proteinPercent = Math.min(100, (product.nutrients?.protein || 0) * 2);
  const carbsPercent = Math.min(100, product.nutrients?.carbs || 0);
  const fatPercent = Math.min(100, (product.nutrients?.fat || 0) * 2.5);
  const sugarPercent = Math.min(100, product.nutrients?.sugar || 0);

  const scoreColors = {
    a: { bg: "#10b98120", main: "#10b981", label: "Excellent" },
    b: { bg: "#84cc1620", main: "#84cc16", label: "Good" },
    c: { bg: "#eab30820", main: "#eab308", label: "Moderate" },
    d: { bg: "#f9731620", main: "#f97316", label: "Poor" },
    e: { bg: "#e63e1120", main: "#e63e11", label: "Bad" }
  };

  const grade = (product.nutritionGrade || 'c').toLowerCase();
  const currentScore = scoreColors[grade] || scoreColors['c'];

  const imageDisplay = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain">`
    : `<div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
        <i class="text-4xl text-gray-400">
          <svg class="svg-inline--fa fa-box" data-prefix="fas" data-icon="box" role="img" viewBox="0 0 448 512" aria-hidden="true">
            <path fill="currentColor" d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"></path>
          </svg>
        </i>
      </div>`;

  modalOverlay.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
      <div class="p-6">
        <div class="flex items-start gap-6 mb-6">
          <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            ${imageDisplay}
          </div>
          <div class="flex-1">
            <p class="text-sm text-emerald-600 font-semibold mb-1 truncate">${product.brand || 'Unknown Brand'}</p>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
            <p class="text-sm text-gray-500 mb-3"></p>
            
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${currentScore.bg}">
                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold uppercase" style="background-color: ${currentScore.main}">
                  ${grade}
                </span>
                <div>
                  <p class="text-xs font-bold" style="color: ${currentScore.main}">Nutri-Score</p>
                  <p class="text-[10px] text-gray-600">${currentScore.label}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${product.novaGroup > 2 ? '#e63e1120' : '#10b98120'}">
                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${product.novaGroup > 2 ? '#e63e11' : '#10b981'}">
                  ${product.novaGroup || 'N/A'}
                </span>
                <div>
                  <p class="text-xs font-bold" style="color: ${product.novaGroup > 2 ? '#e63e11' : '#10b981'}">NOVA</p>
                  <p class="text-[10px] text-gray-600">${product.novaGroup >= 4 ? 'Ultra-processed' : product.novaGroup === 3 ? 'Processed' : 'Minimal/Unprocessed'}</p>
                </div>
              </div>
            </div>
          </div>
          <button class="close-product-modal text-gray-400 hover:text-gray-600 p-1">
            <i class="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>
        
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-chart-pie text-emerald-600"></i>
            Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
          </h3>
          
          <div class="text-center mb-4 pb-4 border-b border-emerald-200">
            <p class="text-4xl font-bold text-gray-900">${product.nutrients?.calories?.toFixed(2) || 0}</p>
            <p class="text-sm text-gray-500">Calories</p>
          </div>
          
          <div class="grid grid-cols-4 gap-4">
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercent}%"></div>
              </div>
              <p class="text-lg font-bold text-emerald-600">${product.nutrients?.protein?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Protein</p>
            </div>
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercent}%"></div>
              </div>
              <p class="text-lg font-bold text-blue-600">${product.nutrients?.carbs?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Carbs</p>
            </div>
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPercent}%"></div>
              </div>
              <p class="text-lg font-bold text-purple-600">${product.nutrients?.fat?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Fat</p>
            </div>
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-orange-500 h-2 rounded-full" style="width: ${sugarPercent}%"></div>
              </div>
              <p class="text-lg font-bold text-orange-600">${product.nutrients?.sugar?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Sugar</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-900">${product.nutrients?.saturatedFat?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Saturated Fat</p>
            </div>
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-900">${product.nutrients?.fiber?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Fiber</p>
            </div>
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-900">${product.nutrients?.sodium?.toFixed(2) || 0}g</p>
              <p class="text-xs text-gray-500">Salt</p>
            </div>
          </div>
        </div>
        
        ${product.ingredients ? `
          <div class="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i class="fa-solid fa-list text-gray-600"></i>
              Ingredients
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">${product.ingredients}</p>
          </div>
        ` : ''}
        
        ${product.allergens ? `
          <div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
            <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">
              <i class="fa-solid fa-triangle-exclamation"></i>
              Allergens
            </h3>
            <p class="text-sm text-red-600">${product.allergens}</p>
          </div>
        ` : ''}
        
        <div class="flex gap-3">
          <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${product.barcode}">
            <i class="fa-solid fa-plus mr-2"></i>Log This Food
          </button>
          <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
            <i class="fa-solid fa-xmark mr-1.5 inline md:hidden"></i>Close
          </button>
        </div>
      </div>
    </div>
  `;

  const closeModal = () => {
    modalOverlay.classList.add("animate-fade-out");
    setTimeout(() => modalOverlay.remove(), 200);
  };

  modalOverlay.querySelectorAll(".close-product-modal").forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay) closeModal();
  });

  const logBtn = modalOverlay.querySelector(".add-product-to-log");
  logBtn.addEventListener("click", e => {
    state.log.push(product)
    localStorage.setItem("foodLog", JSON.stringify(state.log));
    closeModal();
    createNotification(`Item logged to your daily intake!`, "#059669");
    updateProgress();
    trackProgress()
  })
  document.body.appendChild(modalOverlay);
}

export function createLoadingSpinner() {
  const style = document.createElement('style');
  style.textContent = `
      .loader {
        width: 50px;
        padding: 8px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #25b09b;
        --_m: 
          conic-gradient(#0000 10%,#000),
          linear-gradient(#000 0 0) content-box;
        -webkit-mask: var(--_m);
                mask: var(--_m);
        -webkit-mask-composite: source-out;
                mask-composite: subtract;
        animation: l3 1s infinite linear;
      }
      @keyframes l3 { to { transform: rotate(1turn); } }
    `;
  document.head.appendChild(style);

  const spinner = document.createElement('div');
  productsGrid.appendChild(spinner)
}

export function createNotification(message, color) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: color,
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "500",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      padding: "14px 28px",
      textAlign: "center"
    }
  }).showToast();
}

export function createLogModal(mealData) {
  meal = mealData
  const overlay = document.createElement('div');
  overlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
  overlay.id = "log-meal-modal";

  const modalBox = document.createElement('div');
  modalBox.className = "bg-white rounded-2xl p-6 max-w-md w-full mx-4";

  const header = document.createElement('div');
  header.className = "flex items-center gap-4 mb-6";

  const img = document.createElement('img');
  img.src = mealData.image || "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg";
  img.alt = mealData.name || "Meal Image";
  img.className = "w-16 h-16 rounded-xl object-cover";

  const titleContainer = document.createElement('div');
  const mainTitle = document.createElement('h3');
  mainTitle.className = "text-xl font-bold text-gray-900";
  mainTitle.textContent = "Log This Meal";

  const subTitle = document.createElement('p');
  subTitle.className = "text-gray-500 text-sm";
  subTitle.textContent = mealData.name || "Chicken Handi";

  titleContainer.appendChild(mainTitle);
  titleContainer.appendChild(subTitle);
  header.appendChild(img);
  header.appendChild(titleContainer);

  const servingsContainer = document.createElement('div');
  servingsContainer.className = "mb-6";

  const label = document.createElement('label');
  label.className = "block text-sm font-semibold text-gray-700 mb-2";
  label.textContent = "Number of Servings";

  const counterFlex = document.createElement('div');
  counterFlex.className = "flex items-center gap-3";

  const decBtn = document.createElement('button');
  decBtn.id = "decrease-servings";
  decBtn.className = "w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center";
  decBtn.innerHTML = `<i class="text-gray-600"><svg class="svg-inline--fa fa-minus w-4 h-4" viewBox="0 0 448 512"><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg></i>`;

  const input = document.createElement('input');
  input.type = "number";
  input.id = "meal-servings";
  input.value = "1";
  input.min = "0.5";
  input.max = "10";
  input.step = "0.5";
  input.className = "w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2";

  const incBtn = document.createElement('button');
  incBtn.id = "increase-servings";
  incBtn.className = "w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center";
  incBtn.innerHTML = `<i class="text-gray-600"><svg class="svg-inline--fa fa-plus w-4 h-4" viewBox="0 0 448 512"><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>`;

  counterFlex.appendChild(decBtn);
  counterFlex.appendChild(input);
  counterFlex.appendChild(incBtn);
  servingsContainer.appendChild(label);
  servingsContainer.appendChild(counterFlex);

  const nutritionBox = document.createElement('div');
  nutritionBox.className = "bg-emerald-50 rounded-xl p-4 mb-6";

  const nutritionLabel = document.createElement('p');
  nutritionLabel.className = "text-sm text-gray-600 mb-2";
  nutritionLabel.textContent = "Estimated nutrition per serving:";

  const grid = document.createElement('div');
  grid.className = "grid grid-cols-4 gap-2 text-center";

  const macros = [
    { id: "modal-calories", val: mealData.calories || 2152, label: "Calories", color: "text-emerald-600" },
    { id: "modal-protein", val: (mealData.protein || 111) + "g", label: "Protein", color: "text-blue-600" },
    { id: "modal-carbs", val: (mealData.carbs || 201) + "g", label: "Carbs", color: "text-amber-600" },
    { id: "modal-fat", val: (mealData.fat || 132) + "g", label: "Fat", color: "text-purple-600" }
  ];

  macros.forEach(macro => {
    const wrapper = document.createElement('div');

    const valueP = document.createElement('p');
    valueP.id = macro.id;
    valueP.className = `text-lg font-bold ${macro.color}`;
    valueP.textContent = macro.val;

    const labelP = document.createElement('p');
    labelP.className = "text-xs text-gray-500";
    labelP.textContent = macro.label;

    wrapper.appendChild(valueP);
    wrapper.appendChild(labelP);
    grid.appendChild(wrapper);
  });

  nutritionBox.appendChild(nutritionLabel);
  nutritionBox.appendChild(grid);

  const actionsFlex = document.createElement('div');
  actionsFlex.className = "flex gap-3";

  const cancelBtn = document.createElement('button');
  cancelBtn.id = "cancel-log-meal";
  cancelBtn.className = "flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all";
  cancelBtn.textContent = "Cancel";

  const confirmBtn = document.createElement('button');
  confirmBtn.id = "confirm-log-meal";
  confirmBtn.className = "flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all";
  confirmBtn.innerHTML = `<i class="mr-2"><svg class="svg-inline--fa fa-clipboard-list w-4 h-4 inline" viewBox="0 0 384 512"><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i> Log Meal`;

  actionsFlex.appendChild(cancelBtn);
  actionsFlex.appendChild(confirmBtn);

  modalBox.appendChild(header);
  modalBox.appendChild(servingsContainer);
  modalBox.appendChild(nutritionBox);
  modalBox.appendChild(actionsFlex);
  overlay.appendChild(modalBox);

  const closeModal = () => overlay.remove();
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  decBtn.addEventListener('click', () => {
    let currentVal = parseFloat(input.value);
    if (currentVal > parseFloat(input.min)) {
      input.value = currentVal - parseFloat(input.step);
    }
  });

  incBtn.addEventListener('click', () => {
    let currentVal = parseFloat(input.value);
    if (currentVal < parseFloat(input.max)) {
      input.value = currentVal + parseFloat(input.step);
    }
  });

  document.body.appendChild(overlay);
  confirmBtn.addEventListener("click", e => {
    state.log.push(mealData)
    localStorage.setItem("foodLog", JSON.stringify(state.log));
    closeModal()
    createAlert()

  })
}

function createAlert() {
  const baseCalories = meal.calories ;
  const mealName = meal.name ;

  Swal.fire({
    title: 'Meal Logged!',
    html: `
      <p style="color: #6b7280; font-size: 1rem; margin-bottom: 0.5rem; font-family: inherit;">
        ${mealName}) has been added to your daily log.
      </p>
      <p style="color: #10b981; font-weight: 700; font-size: 1.25rem; margin: 0; font-family: inherit;">
        +${baseCalories} calories
      </p>
    `,
    icon: 'success',
    iconColor: '#10b981',    
    showConfirmButton: false,    
    timer: 3500,               
    timerProgressBar: false,
    customClass: {
      popup: 'rounded-2xl p-6 max-w-md shadow-xl',
      title: 'text-2xl font-bold text-gray-900 mt-2'
    }
  });
}
