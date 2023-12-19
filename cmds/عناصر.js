const axios = require("axios");

const elementsList = [
  { id: 1, name: 'النار - قوة اللهب 🔥', category: 'قوة خارقة تجسد الحماس والحياة، تحتل مكانة كقوة إلهية تسطع في عالم ا', description: 'وصف عنصر1 هناتجسيد للقوة والحرارة، قادرة على تدمير وإحياء، تتألق بسطوع ملهم وتشع بشكل جذاب وقوي', image: `https://i.imgur.com/vVf1YRr.jpg` },
  { id: 2, name: 'الهواء - قوة الرياح 🌪️', category: 'قوة تتحكم في عناصر الطقس، يُعتبر سيدًا للعواصف والرياح الهائجة.', description: 'قوة متقلبة، تتحول من نسمات لطيفة إلى عواصف هائجة، قادرة على الاندفاع بسرعة مذهلة وتغيير مسار الأحداث.', image: `https://i.imgur.com/Kn0KQqP.jpg` },
  { id: 3, name: 'الأرض - قوة الثبات 🌏', category: 'قوة ثابتة وقوية، تحمي وتحافظ على التوازن، تمثل حامية الحياة واالماء :', description: 'قوة تتجلى في الاستقرار والقوة الهادئة، تعزز النمو والثبات، تمنح الحياة الأساس والأمان', image: `https://i.imgur.com/u0XSGkH.png` },
{ id: 4, name: 'الماء - قوة الحياة 🌊', category: 'قوة تتدفق بسلاسة وتنقل الحياة، يُعتبر سيدًا للأنهار ومصدر الحياة.', description: 'قوة تجسد الحياة، قادرة على إعادة النشاط والتجديد، تتدفق بأمان وسلاسة، وتمنح الحياة الفرصة للتزهير', image: `https://i.imgur.com/LYfCPo3.jpg` },
{ id: 5, name: 'الشمس - قوة الضوء ☀️', category: 'قوة تنير الظلام وتُضيء الطريق، تمثل المصدر الرئيسي للأمل والحياة.', description: 'قوة مشعة تضيء الظلام، تمنح الأمل والدفء، تعكس الطاقة الإيجابية والتأثير الإلهي.', image: `https://i.imgur.com/aHKmg48.png` },
{ id: 6, name: 'الأشجار - قوة الحماية 🌲', category: 'قوة تعتبر حراسًا للطبيعة، توفر المأوى وتحمي الكائنات الحية.', description: 'قوة تمنح المأوى والحماية، تنمو بقوة وتتحول إلى درع طبيعي يحمي الكائنات الحية من العواصف والظروف القاسية', image: `https://i.imgur.com/JWPZbRu.jpg` },
{ id: 7, name: 'الحجر - قوة الثبات ⛰️', category: 'قوة تمثل الاستقرار والقوة الصلبة، تُعتبر عمودًا أساسيًا في بنية العالم.', description: 'قوة ثابتة وصلبة، تشكل الأساس وتقاوم الضغوط، تعكس القوة الصلبة والاستقرار', image: `https://i.imgur.com/aHDOYvs.png` },
  // يمكنك تعبئة هذا الجزء بالعناصر التي تريد
];

async function getUserElement(elementIndex) {
  // قم بتحديد معلومات العنصر استنادًا إلى index
  const elementInfo = elementsList.find(element => element.id === elementIndex);

  if (!elementInfo) {
    throw new Error('العنصر غير موجود.');
  }

  return elementInfo;
}

module.exports = {
  elementsList,
  getUserElement,
};
