var publishConfig = {
    //户外
    zhaoming: ['无照明', '内照明', '外照明'], // 照明类型
    zuixiaozhouqi: ['一天', '一周', '半月', '一月', '一季度', '半年', '一年'],//最小投放周期
    dailifangshi: ['自有媒体', '独家代理', '行业代理', '一般代理'],//代理方式

    //报纸
    baozhileixing: ['晚报', '日报', '晨报', '都市', '时事', '故事', '文摘', '考试', '机关', '法制', '体育', '学术', '广电', '经济', '财经', '金融', '股票', '教育', '辅导', '艺术', '军事', '汽车', '科技', '人才', '摄影', '生活', '旅游', '健康', '青年', '老年', '女性', '工人', '初中', '高中', '大学', '母婴', '军警', '建筑', '交通', '农林', '畜牧', '工业', '通讯', '航空', '食品', '餐饮', '药品', '医疗', '五金', '灯饰', '电器', '包装', '服装', '美容', '渔业', '能源', '园艺', '地产', '广告', 'DM', '出版', 'IT', '部委', '建材', '经理', '外语', '外贸', '高端', '电子', '文学', '其它' ],
    faxingzhouqi: ['日', '周', '半月', '月', '双月', '季', '半年', '年', '其它'],
    baozhiguanggaoxingshi: ['工商硬广', '软文', '报花', '中缝', '分类', '报眼', '其它'],
    banmianguige: ['整版', '半版', '1/3版', '1/4版', '1/6版', '跨页整版', '对页', '其它'],

    //电视
    dianshilanmuleibei: ['卫视', '新闻', '综合', '文艺', '体育', '军事', '科技', '农业', '国际', '戏曲', '教育', '儿童', '影视', '法制', '旅游', '都市', '经济', '公共', '音乐', '其它'],
    dianshiguanggaoxingshi: ['时段', '栏目', '赞助', '冠名', '其它'],
    guigeshichang: { guige1: ['5S', '10S', '15S', '20S', '30S', '60S', '其它'], guige2: ['月', '季度', '半年', '年', '其它'] }, 

    //材料
    cailiaopinpai: ['OMAX', '东升', '贺彩', '鸿盛', '汇能', '惠普HP', '佳能CANON', '俊彩', '辣彩', '利盟LEXMARK', '普瑞科PRINKER', '图品', 'HYCO', 'NTSPRAY', '飞扬', '恒武', '金梦', '南拓', '蓬源', '鹏健', '斯普瑞', '五星', '鑫三环', '粤伯斯', '粤仍斯', '长原', 'XSJ', 'YH', 'YIKA', 'ZG', '琛乐锦', '国达', '启昌', '五环', '鑫汇', '鑫来达', '鑫龙', '永发', '中港', '追光', '3M', 'LG', 'OLOY', '大爱一通', '大慧', '光宇', '汇顶', '力美', '四方', '天畅', '心远', '心之远', '玉龙', '长龙', 'GS', '东烨', '富乐', '港都', '汇美', '柯达', '罗兰', '美捷', '尼卡', '山富', '盛普SPD', '新狮', '艺美佳', '爱家飘', '晨阳', '诚建', '华懋', '赛博', '森环', '森通', '天地隆源', '添利', '兔宝宝', '鑫富士', '真信', '振中', '正山', 'MAYCOOL', '奥瑞斯', '奥斯特', '哈尼塔', '韩泰HANTAI', '火鸟智能光学', '佳洁', '雷朋', '龙的', '欧得尔', '犀牛皮', '新兰', '大爱一生'],

    //设备
    shebeipinpai: ['ASHOW', '爱博纳', '爱普生', '奥威', '春雷', '飞腾', '飞图', '飞阳', '工正', '宏华', '极限', '金智达', '九色谱', '柯尼卡（KONICA）', '蓝图', '力宇', '罗兰ROLAND', '皮卡', '锐牧', '瑞德', '赛博', '三旗', '胜彩优捷', '雅色兰', '一山', 'EVOLIS', 'EPSON', 'MIMAKI', 'NOVAJET', '彩星', '极速', '乐彩', '魔彩MAGIC', 'COLOUR', '神彩', '泰美斯', '武藤', '瀛和PLASMS', 'CUTTER', '永丽', '富士施乐', '惠普HP', '佳能CANON', '柯尼卡美能达KONICAMI', '利盟LEXMARK', '联想', '三星SAMSUNG', '兄弟', '中崎', 'JBL', 'MOHJ', 'mono', '博世', '创鑫', '峰彩', '凯歌', '凯利', '科悦', '亿鑫', '忆江南', '东华', '彩神', 'GT', '艾杰特', '幻影', '极光', '荆维', '罗兰', '普捷', '锐智', '泰腾捷', '天彩', '武腾', '鑫罗兰', '旭丽', '永俪', '瀛和', '速腾', '天彩世纪风', '超星', '创新友利友', '创艺', '东旭', '方圆', '飞扬', '福顺德', '功铭', '嘉臣', '嘉信', '金龙', '京美', '精益', '凯马', '力远', '罗特RUOTER', '美杰特', '名仕', '铭龙', '铭威', '锐捷', '赛霸', '赛迪克', '世纪雕龙', '腾达', '腾泽', '万科', '啄木鸟', '大众001', '宏基', '杰创越', '开发', '摩海', '卓越', '诚信', '广孚', '精鼎', 'JESSBERGER佳士伯', 'NE宁贤', 'WITLED', '飞碟', '皇辉', '捷顺', '龙鼎', '锐凌', '润天', '盛大', '苏米特', '同思创', '鑫宇', '亿芯', '万人迷', '尼圣尔', '展锋', 'LC', 'TIC', '得利高', '富发', '恒彩', '恒晖', '恒开', '龙昌LONGCHANG', '玛莱宝MARABU', '荣龙', '三恒', '特印', '优印', '忠科', '飞行船', '精工', '龙润', '睿腾', '新福龙', '京丽源', '路易达', 'ZH', '得伟DEWALT', '东立', '多马', '格锐', '汇盛', '雷诺LERO', '伦达', '罗森博格', '美克', '牧田MAKITA', '前沿', '日立HITACHI', '盛隆', '研润', '中粤', 'DATACARD', 'EVOLIS爱丽', 'FARGO', 'SCYH', '斑马ATACARD', '斑马ZEBRA', '呈妍', '呈研', '德奈米克', '鼎新', '法哥FARGO', '时创', '万木春', 'OPLER', '彩霸', '光宏', '宏鑫', '皇冠', '金图', '金图凌翔', '金阳', '金园韩江', '科彩', '凌翔', '顺达', '永达YACHTEC', 'GCC星云', '博汇', '洪海光电', '吉彦', '金成', '金锐', '群英激光', '泰普圣', '易柯', '兆宇', 'TQ', '津元', 'HOBDAR', 'wincor', '阿尔泰', '格瑞斯CriusTouch', '古德', '基石', '迦百农', '康坤', '科瑞', '科玮', '森威特', '神话', '沈鹰', '永工', '莱赛激光', '鹏源', '丽标佳能', '亮点', 'lyp', 'MDKON', '佰仕佳', '晨景', '德澜仕', '鼎誉', '格瑞斯', '公交候车亭', '皓博', '皇家显示', '晶元', '钧道', '蓝通', '乐辰', '美晶', '蒙莱', '奇美', '蔷薇', '三喜', '深中祥', '晟昊', '晟昊光显', '视康达', '特邦达', '鑫亿光', '应天海乐', '宇硕', '中媒', '3M', 'Touch', '3QVIDEO', 'BHC', 'CNDW媒帝', 'Dolphin', 'felind', 'iavtek', 'JOMVS', 'Kedro', '柯卓', 'marvel', 'PGL', 'PIA', 'Sunv', 'TOSN', 'unccr', 'yidao', 'YUYANG', '宝创', '宝锐视', '博龙', '多客', '恩迪视', '恩佐瑞视', '方雅FOUNYA', '飞通', '格特隆', '冠众', '广缘科技', '广缘牌', '洪海', '汇百美', '汇川', '洁诺', '今创', '金石光电', '京航', '卡帕尔', '宽博', '乐云', '理想品牌', '立升', '罗美', '迈格伟业', '媒帝', '欧泰嘉', '千代田', '容大彩晶', '厦科', '圣世欣荣', '顺泰', '泰恒', '拓美', '万佳电子', '维度', '西派', '祥云', '鑫视康', '兴通达', '轩逸', '耀奇', '易控', '益拓', '永恒没', '永恒美', '优视达', '宇柯世纪', '众视广', '卓美华视', 'GLMB', '苍穹', '东风', '福田', '豪胜', '景想', '驹王', '绿地', '亿屏', '奕硕', '大爱一通', '铭扬', '千禧', '腾景', '奥耐克', '百闻', '博翔', '川美', '鼎星', '翻得丽', '翻得美', '凤祥', '金桥', '金三角', '浪图', '浪图牌', '仟诚', '仟诚三面翻', '青于蓝', '瑞博利', '艺彩', '昱立', '元创', 'HappyTouch', 'skele', 'zszz', '大邦雅风', '大部', '大易', '德纳', '东莞贝尔', '风火轮', '高天', '格言', '冠测', '广缘', '国产750写真机', '海牛', '宏焊', '泓通', '华钢', '华源彤达', '汇顶', '杰科', '金宝来', '筋斗云', '景奕', '九成', '凯迪', '科宝', '克格博', '乐博', '耐恩', '南京志纯', '日源', '世纪星', '天驰', '威尔特', '小九', '鑫众', '一格', '翌腾', '宇唐', '中邦华睿'],

    //杂志
    zazhileixing: ['月刊', '半月', '双月', 'DM', '时尚', '家庭', '管理', '经济', '商业', '娱乐', '休闲', '旅游', '音乐', '科普', '科技', '考试', '体育', '艺术', '文学', '交际', '摄影', '法制', '人文', '动漫', '军事', '外文', '学术', '服饰', '人才', '影视', '汽车', '交通', '航空', '通讯', '物流', '家居', '建筑', '建材', '五金', '地产', '灯饰', '广告', '传媒', '教育', '医疗', '药品', '健康', '美容', '食品', '酒店餐饮', '工业', '农林', '鱼牧', '园艺', '能源', '金融', '证券', 'IT', '男性', '女性', '老年', '青年', '工人', '农民', '高中', '初中', '大学', '小学', '母婴', '军警', '周刊', '时事', '生活', '消费', '电力', '其它'],
    zazhiguanggaoxingshi: ['工商硬广', '软文', '其它'],

    //广播
    guangboleixing: ['新闻', '经济', '国际', '交通', '文艺', '科技', '教育', '老年', '健康', '生活', '体育', '旅游', '儿童', '农业', '军事', '戏曲', '城市', '乡村', '音乐'],
    guangboguanggaoxingshi: ['时段', '报时', '特约', '冠名', '专题', '其它'],
    shiduanpinci: { shiduan: ['5S', '10S', '15S', '20S', '30S', '60S', '其它'], pinci: ['1次/天', '2次/天', '3次/天', '4次/天', '5次/天', '其它'] }, 

    //需求行业类别
    hangyeleibie: ['汽车', '教育', '医疗', '房地产', 'IT电脑', '食品饮料', '糖酒茶叶', '家电通讯', '家居建材', '餐饮休闲', '服装服饰', '招商投资', '金融保险', '保健品药品', '其它行业']
}

module.exports = publishConfig;