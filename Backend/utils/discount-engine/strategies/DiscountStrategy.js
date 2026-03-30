class DiscountStrategy {
  apply(registration, discount) {
    throw new Error("apply() must be implemented");
  }
}

module.exports = DiscountStrategy;