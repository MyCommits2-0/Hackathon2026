const DiscountStrategy = require("./DiscountStrategy");

class EarlyBirdDiscount extends DiscountStrategy {
  apply(registration, discount) {
    const today = new Date();
    if (today >= new Date(discount.start_date) && today <= new Date(discount.end_date)) {
      return (registration.fee * discount.value) / 100;
    }
    return 0;
  }
}

module.exports = EarlyBirdDiscount;