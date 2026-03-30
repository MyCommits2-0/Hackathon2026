const FlatDiscount = require("./strategies/FlatDiscount");
const PercentageDiscount = require("./strategies/PercentageDiscount");
const EarlyBirdDiscount = require("./strategies/EarlyBirdDiscount");

class DiscountFactory {
  static getStrategy(type) {
    switch (type) {
      case "FLAT":
        return new FlatDiscount();

      case "PERCENTAGE":
        return new PercentageDiscount();

      case "EARLY_BIRD":
        return new EarlyBirdDiscount();

      default:
        throw new Error("Invalid discount type: " + type);
    }
  }
}

module.exports = DiscountFactory;