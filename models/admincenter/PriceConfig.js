var priceConfig = {
  priorShowPrice: 500, // 优先展示
  eBookPrice: 500, // 数字期刊
  VRPrice: 500, // VR展馆
  weMediaPrice: 500, // 自媒体渠道

  // 1项服务则扣
  discountOneQuarter1: 1.0,
  discountHalfYear1: 0.9,
  discountOneYear1: 0.8,
  // one quarter = 1500
  // half year = 2700
  // one year = 4800

  // 2项服务则扣
  discountOneQuarter2: 0.9,
  discountHalfYear2: 0.8,
  discountOneYear2: 0.7,
  // one quarter = 2700
  // half year = 4800
  // one year = 8400

  // 3项服务则扣
  discountOneQuarter3: 0.8,
  discountHalfYear3: 0.7,
  discountOneYear3: 0.6,
  // one quarter = 3600
  // half year = 6300
  // one year = 10800

  // 4项服务则扣
  discountOneQuarter4: 0.7,
  discountHalfYear4: 0.6,
  discountOneYear4: 0.5
  // one quarter = 4200
  // half year = 7200
  // one year = 12000
}

module.exports = priceConfig
