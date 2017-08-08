var priceConfig = {
  precisePromotionPrice: 100, // 精准推广基础费用

  // 时间周期折扣
  discountOneQuarter: 0.7,
  discountHalfYear: 0.6,
  discountOneYear: 0.5,

  discountRate: [1, 0.9, 0.8, 0.7, 0.6],

  // 省份数量折扣 最多5个省份
  province1: 1, 
  // one quarter = 210
  // half year = 360
  // one year = 600

  province2: 0.9,
  // one quarter = 378
  // half year = 648
  // one year = 1080

  province3: 0.8,
  // one quarter = 504
  // half year = 864
  // one year = 1440

  province4: 0.7,
  // one quarter = 588
  // half year = 1008
  // one year = 1680

  province5: 0.6,
  // one quarter = 630
  // half year = 1080
  // one year = 1800
}

module.exports = priceConfig
