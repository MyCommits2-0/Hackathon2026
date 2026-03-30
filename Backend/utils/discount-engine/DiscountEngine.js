const DiscountFactory = require("./DiscountFactory");

class DiscountEngine {
  static calculate(registration, discount) {
    if (!discount) return 0;

    const strategy = DiscountFactory.getStrategy(discount.type);

    const discountAmount = strategy.apply(registration, discount);

    return discountAmount;
  }
}

module.exports = DiscountEngine;