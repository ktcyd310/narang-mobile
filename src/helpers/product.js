// get product discount price
export const getDiscountPrice = (price, discount) => {
  return discount && discount > 0
    ? (price - price * (discount / 100)).toFixed(2)
    : price;
};

// get products
export const getProducts = (products, limit, type, category) => {
  const finalProducts = category
    ? products.filter(
        product => product.category.filter(single => single === category)[0]
      )
    : products;
  if (type && type === "bestSeller") {
    return (
      finalProducts &&
      finalProducts
        .sort((a, b) => {
          return b.saleCount - a.saleCount;
        })
        .slice(0, limit ? limit : finalProducts.length)
    );
  }
  return (
    finalProducts &&
    finalProducts.slice(0, limit ? limit : finalProducts.length)
  );
};

// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color) => {
  let productInCart = cartItems.filter(
    single =>
      single.id === product.id &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true)
  )[0];
  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      return cartItems.filter(
        single =>
          single.id === product.id && single.selectedProductColor === color
      )[0].quantity;
    } else {
      return cartItems.filter(single => product.id === single.id)[0].quantity;
    }
  } else {
    return 0;
  }
};


// shop top filter toggle
export const toggleShopTopFilter = e => {
  const shopTopFilterWrapper = document.querySelector("#shop-filter-menu");
  const subscriptionFilterWrapper = document.querySelector("#subscription-menu");

  // 확장된 영역을 축소시키는 케이스
  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.overflow = 'hidden'

    e.currentTarget.classList.remove('active')
    e.currentTarget.classList.toggle('disabled')

    shopTopFilterWrapper.style.height = null;

    // 확장 케이스
  } else {

    shopTopFilterWrapper.style.overflow = 'visible'

    e.currentTarget.classList.remove('disabled')
    e.currentTarget.classList.toggle("active");
    shopTopFilterWrapper.style.height =
      shopTopFilterWrapper.children[0].clientHeight + "px";

    //요금제 필터 축소
    subscriptionFilterWrapper.style.height = null;

  }
};

// 요금제 필터
export const toggleSubscriptionFilter = e => {
  const shopTopFilterWrapper = document.querySelector("#shop-filter-menu");
  const subscriptionFilterWrapper = document.querySelector("#subscription-menu");

  subscriptionFilterWrapper.classList.toggle("active");

  // 확장된 영역을 축소시키는 케이스
  if (subscriptionFilterWrapper.style.height) {
    subscriptionFilterWrapper.style.height = null;

    // 확장 케이스
  } else {
    subscriptionFilterWrapper.style.height =
        document.querySelector("#subscription-menu").scrollHeight + "px";

    //필터 축소
    shopTopFilterWrapper.style.height = null;
    shopTopFilterWrapper.style.overflow = 'hidden';
  }
  e.currentTarget.classList.toggle("active");
};

export const subscriptionFilterButton = (en, value) => {

  let buttons = document.querySelectorAll("#subscription-filter-button")
  buttons.forEach(item => {
    item.classList.remove("active")
  })

  en.currentTarget.classList.toggle("active");

  let text = document.querySelector("#filter-text")
  text.innerText = value
  text.innerHTML = value
};

// product 필터
export const productFilterButton = (en, value) => {

  let buttons = document.querySelectorAll("#product-filter-button")

  //en.currentTarget.parentNode.previousElementSibling.classList[0].toggle("active");

  //dropdown menu 삭제
  en.currentTarget.parentNode.classList.remove("show")
  en.currentTarget.parentNode.classList.toggle("hide")

  en.currentTarget.parentNode.previousElementSibling.innerHTML = value

};

// product 필터
export const planTypeButton = (en) => {

  let buttons = document.querySelectorAll("#plan-type-tab")
  buttons.forEach(item => {
    item.classList.remove("active")
  })

};




// get individual element
const getIndividualItemArray = array => {
  let individualItemArray = array.filter(function(v, i, self) {
    return i === self.indexOf(v);
  });
  return individualItemArray;
};

// get individual categories
export const getIndividualCategories = products => {
  let productCategories = [];
  products &&
    products.map(product => {
      return (
        product.category &&
        product.category.map(single => {
          return productCategories.push(single);
        })
      );
    });
  const individualProductCategories = getIndividualItemArray(productCategories);
  return individualProductCategories;
};

// get individual colors
export const getIndividualColors = products => {
  let productColors = [];
  products &&
    products.map(product => {
      return (
        product.variation &&
        product.variation.map(single => {
          return productColors.push(single.color);
        })
      );
    });
  const individualProductColors = getIndividualItemArray(productColors);
  return individualProductColors;
};

//get products based on filter
export const getSortedProducts = (products, sortType, sortValue) => {
  if (products && sortType && sortValue) {
    if (sortType === "category") {
      return products.filter(
        product => product.category.filter(single => single === sortValue)[0]
      );
    }

    if (sortType === "color") {
      return products.filter(
        product =>
          product.variation &&
          product.variation.filter(single => single.color === sortValue)[0]
      );
    }
  }
  return products;
};

export const setActiveSort = e => {
  const filterButtons = document.querySelectorAll(
    ".shop-filter-block__color li button, .shop-filter-block__category li button"
  );
  filterButtons.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};
