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
    // Fetching all jackets like this, makes it probably slow to use the live-search.
    if (id) {
        getProductsURL = baseUrlCMS + "wp-json/wc/v3/products/" + id;
        try {
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            const data = await result.json();
            //console.log(data);
            return data;
        } catch (error) {
            // jacketsContainer.innerHTML =
            //     "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            console.log("Unable to retrieve jackets from API: " + error);
        }
    } else {
        try {
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            data = await result.json();
            //console.log(data);
            storage.setItem("AllProducts", JSON.stringify(data));
            return data;
        } catch (error) {
            // NB: Below error is not available in the checkout. Maybe missing another place too?
            jacketsContainer.innerHTML =
                "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            console.log("Unable to retrieve jackets from API: " + error);
        }
    }
}
