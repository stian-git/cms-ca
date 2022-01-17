const storage = window.localStorage;

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
