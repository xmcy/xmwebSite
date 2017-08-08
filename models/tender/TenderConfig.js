var tenderConfig = {
    chooseDuration: 24 * 3, // 选标时间
    payFirstDuration: 24 * 3, // 定标后支付定金的时间
    payLastDuration: 24 * 7, // 验收后到支付尾款的时间
    feedbackDuration: 24 * 30, // 付完尾款后互相评价的时间

    noneBrandPromotionLimition: 5, // 未购买品牌推广企业每日投标次数限制
    defaultsPerMouthLimition: 3, // 每月违约次数限制
}

module.exports = tenderConfig