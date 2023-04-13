let products = [
  {
    id: 1,
    name: "Áo kiểu nữ cam đất phối cổ trắng dập ly",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, velit.",
    price: 250000,
    image:
      "https://image.yes24.vn/Upload/ProductImage/anhduong201605/1947415_L.jpg?width=550&height=550",
    count: 1,
  },
  {
    id: 2,
    name: "Áo trắng bèo lé đen tay loe dễ thương",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, velit.",
    price: 350000,
    image:
      "https://image.yes24.vn/Upload/ProductImage/anhduong201605/1914666_L.jpg?width=550&height=550",
    count: 1,
  },
];

$.each(products, function (index, product) {
  const $product = $(`
  <li class="row">
    <div class="col left">
      <div class="thumbnail">
        <a href="#">
          <img src="https://via.placeholder.com/200x150" alt="${
            product.name
          }" />
        </a>
      </div>
      <div class="detail">
        <div class="name"><a href="#">${product.name}</a></div>
        <div class="description">
          ${product.description}
        </div>
        <div class="price">${product.price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}</div>
      </div>
    </div>

    <div class="col right">
      <div class="quantity">
        <input type="number" class="quantity" step="1" value="${
          product.count
        }" />
      </div>

      <div class="remove">
        <span class="close"
          ><i class="fa fa-times" aria-hidden="true"></i
        ></span>
      </div>
    </div>
  </li>
  `);

  // tim ra cai de xu ly  ben trong products
  $quantity = $("input.quantity", $product);
  $remove = $(".remove", $product);

  $quantity.on("input", { $el: $quantity, product }, updateQuantity);

  $remove.on(
    "click",
    { $el: $product, productId: product.id },
    deleteProductItem
  );

  $product.appendTo($(".products"));

  if (products.length === 0) {
    $a = $("a");
  }
});

// - Cập nhật số lượng sản phẩm hiện có trong giỏ hàng
function updateProductItem() {
  const total = products.reduce(function (total, product) {
    return (total += product.count);
  }, 0);

  $(".count .value").text(total);
}

const $callback = $.Callbacks();
$callback.add(updateProductItem);

$callback.add(updateTotalPrice);

// - Xóa sản phẩm khỏi giỏ hàng
function deleteProductItem(e) {
  const $el = e.data.$el;
  const $productId = e.data.product;

  $el.remove();

  const index = products.findIndex(function (product) {
    return product.id == $productId;
  });

  products.splice(index, 1);

  $callback.fire();
}

// - Thay đổi số lượng sản phẩm
function updateQuantity(e) {
  const $quantity = e.data.$el;
  const count = Number($quantity.val());
  const product = e.data.product;

  if (count > 0) {
    product.count = count;
  } else {
    product.count = 1;
    $quantity.val(1);
  }
  product.count = count;

  $callback.fire();
}

// tinh tong tien
function calcSubTotalPrice() {
  const totalPrice = products.reduce(function (total, product) {
    return (total += product.price * product.count);
  }, 0);
  return totalPrice;
}

// - Cập nhật tổng tiền
function updateTotalPrice(e) {
  const subTotal = calcSubTotalPrice();
  const vat = subTotal * 0.05;
  const discount = promotionCode[currenCode] || 0;
  const total = subTotal + vat - (discount / 100) * subTotal;

  $(".subtotal .value").text(
    subTotal.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    })
  );

  $(".vat .value").text(
    vat.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    })
  );

  $(".total .value").text(
    total.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    })
  );
}

// - Áp dụng mã giảm giá

let promotionCode = {
  A: 10,
  B: 20,
  C: 30,
  D: 40,
  E: 50,
};

let currenCode;

const $promotion = $(".promotion");
const $promoCode = $("#promo-code", $promotion);
const $promobtn = $("button", $promotion);

$promobtn.on("click", function () {
  const code = $promoCode.val();

  if (code.toUpperCase() in promotionCode) {
    const discount = promotionCode[code.toUpperCase()];

    currenCode = code.toUpperCase();

    $discount = $(".discount");
    $discount.removeClass("hide");
    $(".value", $discount).text(`${discount}%`);

    $callback.fire();
    alert("ban da ap dung ma thanh cong");
  }
});

$callback.fire();
