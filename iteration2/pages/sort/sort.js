//数据
let dataList = [{
  idx: 0,
  _laji_biao: '_laji-biao0',
  content_bg_color: 'content0',
  content_img: '/image/recyclable_waste.png',
  title: '可回收物',
  introduction: '就是再生资源，指生活垃圾中未经污染、适宜回收循环利用的废物，主要包括废弃电器电子产品、废纸张、废塑料、废玻璃、废金属等五类，是现阶段生活垃圾分类的主要工作和影响垃圾减量的重要因素。\n \n',
  examples_title: '主要分类：',
  examples: '1. 电器电子产品类\n2. 纸类\n3. 塑料类\n4. 金属类\n5. 玻璃类\n6. 办公用品类\n \n',
  yaoqiu: '投放建议：',
  yaoqiu_content: '• 轻投轻放\n • 清洁干燥、避免污染，废纸尽量平整\n • 立体包装请清空内容物，清洁后压扁投放 \n • 有尖锐边角的，应包裹后投放',
},
{
  idx: 1,
  _laji_biao: '_laji-biao1',
  content_bg_color: 'content1',
  content_img: '/image/householdfood_waste.png',
  title: '湿垃圾',
  introduction: '又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物\n \n',
  examples_title: '主要分类：',
  examples: '1. 食材废料\n2. 剩菜剩饭\n3. 过期食品\n4. 瓜皮果核\n5. 花卉植物\n6. 中药药渣\n \n',
  yaoqiu: '投放建议：',
  yaoqiu_content: '• 纯流质的食物垃圾，如牛奶等，应直接倒进下水口 \n • 有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器',
},
{
  idx: 2,
  _laji_biao: '_laji-biao2',
  content_bg_color: 'content2',
  content_img: '/image/residual_waste.png',
  title: '干垃圾',
  introduction: '指除可回收物、有害垃圾、餐厨垃圾外的其他生活垃圾，即现环卫体系主要收集和处理的垃圾。\n   \n',
  examples_title: '主要分类：',
  examples: '1. 纸类，塑料类中不可回收部分\n2. 玻璃类，金属类中不可回收部分\n3. 纺织物，木竹类中不可回收部分\n4. 灰土类、砖瓦陶瓷类废弃物\n \n',
  yaoqiu: '投放建议',
  yaoqiu_content: '• 尽量沥干水分\n • 难以辨识类别的生活垃圾投入干垃圾容器内',
},
{
  idx: 3,
  _laji_biao: '_laji-biao3',
  content_bg_color: 'content3',
  content_img: '/image/hazardous_waste.png',
  title: '有害垃圾',
  introduction: '指生活垃圾中对人体健康或自然环境造成直接或潜在危害的物质，必须单独收集、运输、存贮，由环保部门认可的专业机构进行特殊安全处理。\n \n',
  examples_title: '主要分类：',
  examples: '1. 电池类\n2. 含汞类\n3. 废药类\n4. 油漆\n5. 废农药类\n \n',
  yaoqiu: '投放建议：',
  yaoqiu_content: '• 投放时请注意轻放\n • 易破损的请连带包装或包裹后轻放3如易挥发，请密封后投放',
}
]

Page({
data: {
  currentData: {},
  xuan: [{
      id: 0,
      name: '可回收物'
  }, {
      id: 1,
      name: '湿垃圾'
  }, {
      id: 2,
      name: '干垃圾'
  }, {
      id: 3,
      name: '有害垃圾',
  }],
},
//点击选中
xuanzhong: function (e) {
  var id = e.currentTarget.dataset.item.id;
  this.setData({
      currentData: dataList[id]
  })
},
onLoad: function (options) {
  //默认选中第一个
  this.setData({
      currentData: dataList[0]
  })
},
//   去垃圾分类列表
goList() {
  wx.navigateTo({
      url: '/pages/sortList/sortList',
  })
}
})