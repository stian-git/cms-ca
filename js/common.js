const storage = window.localStorage;
const baseUrlCMS = "https://tekniskpotet.no/rainydays/";
const authConsumerKey = "ck_34ff56c60c7369ee8c203d18f5e4f2179b7d596f";
const authConsumerSecret = "cs_1cd09593ba430b4a32cac4c96362fd75b24e3e1e";
const loaderIcon = document.querySelector(".fa-compact-disc");

let jacket;

basketCounterContainer = document.querySelector(".basket_items-number");

// Updates basket item counter:
function updateBasketItemCount() {
    let counter = 0;
    if (storage.getItem("Basket")) {
        let basketArray = storage.getItem("Basket").split(";");
        let currentItemCount;
        basketArray.forEach((item) => {
            currentItemCount = Number(item.match(/\w+$/)[0]);
            counter += currentItemCount;
        });
    }
    basketCounterContainer.innerHTML = counter;
}
updateBasketItemCount();

// Add or removes items from the basket using +/- or add to basket-button.
function addOrRemoveFromBasket(num, arr, arridx) {
    let oldItemData = arr[arridx];
    let oldItemCount = Number(oldItemData.match(/\w+$/)[0]);
    let newItemCount = oldItemCount + num;
    // Makes sure the item count can`t go below 1.
    if (newItemCount == 0) {
        newItemCount = 1;
    }
    let newItemData = oldItemData.replace("," + oldItemCount, "," + newItemCount);
    arr[arridx] = newItemData;
    storage.setItem("Basket", arr.join(";"));
}

let headers = new Headers();
headers.set("Authorization", "Basic " + btoa(authConsumerKey + ":" + authConsumerSecret));

async function getProducts(id) {
    let getProductsURL = baseUrlCMS + "wp-json/wc/v3/products";
    let data;
    if (id) {
        // Used by Jacketdetails page:
        getProductsURL = baseUrlCMS + "wp-json/wc/v3/products/" + id;
        try {
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            data = await result.json();
        } catch (error) {
            document.querySelector(".jacket-details").innerHTML = "<p>An error occured retrieving the jacket. Please refresh the page to try again.</p>";
        }
    } else {
        try {
            // Used by jackets and checkout page.
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            data = await result.json();
            storage.setItem("AllProducts", JSON.stringify(data));
        } catch (error) {
            if (window.location.pathname == "/checkout.html") {
                // Checkout Page:
                document.querySelector("main").innerhtml = "<p>An error occured retrieving the basket details. Please refresh the page to try again.</p>";
            } else {
                // Jackets page.
                document.querySelector(".main__jacketlist").innerHTML = "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            }
        }
    }
    return data;
}

// banner- carousel
const topBannerContainer = document.querySelector(".banner_container.top");
const bottomBannerContainer = document.querySelector(".banner_container.bottom");

async function getBannerData() {
    let getBannerDataURL = baseUrlCMS + "wp-json/wc/v3/products/?category=25";
    try {
        const result = await fetch(getBannerDataURL, { method: "GET", headers: headers });
        const data = await result.json();
        return data;
    } catch (error) {
        // No error is displayed because this is not an important element.
    }
}

let counter = 0;
function displayBanners(productData) {
    const imgArray = ["https://tekniskpotet.no/rainydays/wp-content/uploads/2022/01/jacket-id6.jpg", "https://tekniskpotet.no/rainydays/wp-content/uploads/2022/01/jacket-id2.jpg"];
    const bannerHTML = `
    <a href="jacketdetails.html?id=${productData[0].id}" alt="Banner Image" title="banner image">
        <img src="${productData[0].images[0].src}" class="banner_image" alt="Offer: Banner advertisement for one of our jackets" aria-label="Offer: Banner advertisement for one of our jackets"/>
    </a>
    <a href="jacketdetails.html?id=${productData[0].id}" class="banner_text" title="Jacket banner text">Rainy days - Gets you out of the comfort zone.</a>
    `;
    topBannerContainer.innerHTML = bannerHTML;
    bottomBannerContainer.innerHTML = bannerHTML;
    const myInterval = setInterval(() => {
        if (counter >= productData.length) {
            counter = 0;
            return;
        }
        const prodId = productData[counter].id;
        const prodImg = productData[counter].images[0].src;
        document.querySelector(".banner_container.top .banner_image").src = prodImg;
        document.querySelector(".banner_container.bottom .banner_image").src = prodImg;
        document.querySelector(".banner_container.top .banner_text").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.top a").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.bottom .banner_text").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.bottom a").href = "jacketdetails.html?id=" + prodId;
        counter++;
    }, 10000);
}

// Make sure we retrieve the productData before adding the banner.
getBannerData().then((bannerData) => {
    displayBanners(bannerData);
});
