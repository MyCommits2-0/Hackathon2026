const DiscountStrategy = require("./DiscountStrategy");

class PercentageDiscount extends DiscountStrategy {
  apply(registration, discount) {
    return (registration.fee * discount.value) / 100;
  }
}

module.exports = PercentageDiscount;