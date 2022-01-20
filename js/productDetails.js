const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const jacketId = params.get("id");
const jacketContainer = document.querySelector(".jacket-details");
const jacketName = document.querySelector(".jacketname__h1");
let buyButton;
let checkoutbutton;
//console.log(jacketId);

// clears the size-variables for each run.

async function showProductDetails() {
    jacket = await getProducts(jacketId);
    const averageRating = Math.abs(jacket.average_rating);
    console.log(jacket);
    //console.log("Avg.Rating: " + averageRating);

    let sizeS = "";
    let sizeM = "";
    let sizeL = "";
    let sizeXL = "";
    let sizeXXL = "";

    let jacketSizes = [];
    jacket.attributes[1].options.forEach((size) => {
        jacketSizes.push(size.toUpperCase());
    });
    jacketSizes.forEach((size) => {
        //Adds a string to each size that are present on the given jacket. Strings that remain blank will not be displayed.
        switch (size) {
            case "S":
                sizeS = `<input type="radio" name="size" id="size-s" value="size-s" hidden="true"><label for="size-s"><img src="../images/size-s.png" aria-label="Size: S"></label>`;
                break;
            case "M":
                sizeM = `<input type="radio" name="size" id="size-m" value="size-m" hidden="true"><label for="size-m"><img src="../images/size-m.png" aria-label="Size: M"></label>`;
                break;
            case "L":
                sizeL = `<input type="radio" name="size" id="size-l" value="size-l" hidden="true"><label for="size-l"><img src="../images/size-l.png" aria-label="Size: L"></label>`;
                break;
            case "XL":
                sizeXL = `<input type="radio" name="size" id="size-xl" value="size-xl" hidden="true"><label for="size-xl"><img src="../images/size-xl.png" aria-label="Size: XL"></label>`;
                break;
            case "XXL":
                sizeXXL = `<input type="radio" name="size" id="size-xxl" value="size-xxl" hidden="true"><label for="size-xxl"><img src="../images/size-xxl.png" aria-label="Size: XXL"></label>`;
                break;
            default:
                break;
        }
    });
    let genderMale = `<input type="radio" name="gender" id="male" value="male" hidden="true"><label for="male" class="gender"><p class="required"><img src="../images/outline_male_red_24dp.png"><span class="tooltip_top tooltip_gendertop">Male</span></p></label>`;
    let genderFemale = `<input type="radio" name="gender" id="female" value="female" hidden="true"><label for="female" class="gender"><p class="required"><img src="../images/outline_female_red_24dp.png"><span class="tooltip_top tooltip_gendertop">Female</span></p></label>`;
    if (jacket.attributes[0].options.length == 1) {
        if (jacket.attributes[0].options[0] == "female") {
            genderMale = "";
        } else {
            genderFemale = "";
        }
    }

    //console.log("Images: " + jacket.images.length);
    const jacketReviews = await getReviews(jacket.id);
    let jacketReviewsHTML = "<i>There are no reviews for this product yet.</i>";
    if (jacketReviews.length > 0) {
        jacketReviewsHTML = "";
        jacketReviews.forEach((review) => {
            jacketReviewsHTML += `<img src="../images/${review.rating}-stars.png" aria-label="Rating-stars: ${review.rating}" title="Rating-stars: ${review.rating}">
            <blockquote>${review.review}</blockquote>
            <p class="reviewername">${review.reviewer}</p>`;
        });
    }

    let thumbsHTML = "";

    for (let i = 0; i < jacket.images.length; i++) {
        let thumbImage = jacket.images[i].src.replace(".jpg", "-150x150.jpg");
        let fullsizeImage = "changeProductImage(`" + jacket.images[i].src.replace(".jpg", "-450x450.jpg") + "`)";
        thumbsHTML += `
        <div>
            <img src="${thumbImage}" alt="${jacket.name}" 
        class="thumbimage" onclick="${fullsizeImage}" onerror="this.style.display='none'"/>
        </div>`;
    }

    jacketContainer.innerHTML = `
        <section class="jacketdetails__images">
            <img src="${jacket.images[0].src.replace(".jpg", "-300x300.jpg")}" alt="${
        jacket.name
    }" class="product-image" title="${jacket.name}" onerror="this.style.display='none'"/>
            <div class="product-image_thumbnails">
                ${thumbsHTML}
            </div>
        </section>
        <section class="jacketdetails__intro_form">
            <h3>${jacket.name}</h3>
            <p class="ratingstars">
                <a href="#jacketdetails_reviews" title="View Reviews">
                <img src="../images/${averageRating}-stars.png" aria-label="Review Stars: ${averageRating}">
                </a>
            </p>
            ${jacket.short_description}
            <p>
                <a href="#jacket_details" alt="Read details for this jacket" title="Read details about this jacket">Read more...</a>
            </p>
            <form action="checkout.html" class="form_orderdetails" onsubmit="return false">
                <fieldset>
                    <legend>Select Gender:</legend>
                    ${genderFemale}
                    ${genderMale}
                </fieldset>
                <fieldset>
                    <legend>Select Size:</legend>
                    ${sizeS}
                    ${sizeM}
                    ${sizeL}
                    ${sizeXL}
                    ${sizeXXL}
                </fieldset>
                <p class="product-specific__price">${jacket.price} NOK</p>
                <input type="hidden" value="${jacketId}" id="id" name="id">
                <button type="submit" class="jacket-cta addtobasket" aria-label="Click to buy now">Add to basket</button>
                <a href="checkout.html" title="Checkout"><button type="button" class="jacket-cta checkout" aria-label="Click to buy now">Checkout</button></a>
            </form>
        </div>
        </section>
        <section class="jacketdetails__details">
            <h2 id="jacket_details">Details</h2>
            <p>${jacket.description}</p>
            <p><a href="#top" alt="Scroll to the top" title="Scroll to the top of page">To the top...</a></p>

        </section>
        <section class="jacketdetails__reviews">
            <h2 id="jacketdetails_reviews">Reviews</h2>
            ${jacketReviewsHTML}
        </section>`;

    buyButton = document.querySelector("button[type=submit].jacket-cta");
    buyButton.disabled = true;
    buyButton.addEventListener("click", addToBasket);
    const selectionForm = document.querySelector(".form_orderdetails");
    selectionForm.addEventListener("change", checkSections);

    // Displays the checkout-button on document load if there are items in the basket.
    checkoutbutton = document.querySelector("button.checkout");
    if (basketCounterContainer.innerHTML == 0) {
        checkoutbutton.style.display = "none";
    }
}

async function getReviews(id) {
    let getProductReviewUrl = baseUrlCMS + "wp-json/wc/v3/products/reviews/?product=" + id;
    let reviewArray = [];
    try {
        const result = await fetch(getProductReviewUrl, { method: "GET", headers: headers });
        reviewArray = await result.json();
    } catch (error) {
        console.log("Catching reviews failed, returning empty array");
    }
    return reviewArray;
}

function changeProductImage(newImg) {
    const mainImageContainer = document.querySelector(".product-image");
    mainImageContainer.src = newImg;
    // Below line is to make the page recover if the selected img is missing.
    //mainImageContainer.style.display = "inline";
}

showProductDetails();

//let buyButton = document.querySelector("button[type=submit].jacket-cta");
//console.log(buyButton);
//buyButton.disabled = true;
// clears the selections upon loading.
let selectedSize;
let selectedGender;

// Checks if both size and gender is selected.
function checkSections() {
    selectedSize = document.querySelector("input[name=size]:checked");
    selectedGender = document.querySelector("input[name=gender]:checked");
    if (selectedSize && selectedGender) {
        buyButton.disabled = false;
    } else {
        buyButton.disabled = true;
    }
}

// Adds item to basket, shows checkout-button, updates basket count, and displays a confirmation of the action to the user.
function addToBasket(event) {
    //event.preventDefault();
    let jacketData = `${jacketId},${selectedSize.value},${selectedGender.value},1`;
    checkoutbutton.style.display = "inline-block";
    addToStorage(jacketData);
    updateBasketItemCount();
    buyButton.innerText = "Item added";
    buyButton.id = "added";
    setTimeout(() => {
        buyButton.id = "";
        buyButton.innerText = "Add to basket";
    }, 1500);
}

// updates the storage with new item.
function addToStorage(str) {
    // clear the basket:
    let currentBasket = [];
    // Check if something is in the basket already:
    if (storage.getItem("Basket")) {
        // convert existing storage-string to an array:
        currentBasket = storage.getItem("Basket").split(";");
        // check if item already exist, returns a boolean (if it exists, the alreadyInBasket-function adds it):
        let duplicateCheckResult = alreadyInBasket(str, currentBasket);
        if (duplicateCheckResult == false) {
            // if item doesn`t already exist we add it.
            currentBasket.push(str);
        }
        // we add the new string including the new item to the basket.
        storage.setItem("Basket", currentBasket.join(";"));
    } else {
        // If this is the first item in the basket, we just write it as it is.
        storage.setItem("Basket", str);
    }
}

// Checks if item is already in basket and updates the number +1 if it exists.
function alreadyInBasket(str, basketArray) {
    // splits the string after the gender, returning the item counter.
    let trimmedSearchString = str.match(/(.*)le/)[0];
    let match;
    for (let i = 0; i < basketArray.length; i++) {
        match = basketArray[i].search(trimmedSearchString);
        if (match >= 0) {
            basketArray = addOrRemoveFromBasket(1, basketArray, i);
            // stop iterating on first match:
            return basketArray;
        }
    }
    return false;
}
