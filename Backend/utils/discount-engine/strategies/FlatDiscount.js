const DiscountStrategy = require("./DiscountStrategy");

class FlatDiscount extends DiscountStrategy {
  apply(registration, discount) {
    return discount.value;
  }
}

module.exports = FlatDiscount;