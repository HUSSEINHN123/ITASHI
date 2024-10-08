const axios = require('axios');

const link = [
  "https://i.imgur.com/fJXrW4G.jpg",
           "https://i.imgur.com/WOwmGDZ.jpg",
           "https://i.imgur.com/j9dQoJn.jpg",
           "https://i.imgur.com/00djhfU.jpg",
           "https://i.imgur.com/8cmr0rD.jpg",
           "https://i.imgur.com/2ef7HGn.jpg",
           "https://i.imgur.com/3YU22dJ.jpg",
           "https://i.imgur.com/hOyOu9i.jpg",
           "https://i.imgur.com/3RrCuRk.jpg",
           "https://i.imgur.com/nUAPq86.jpg",
           "https://i.imgur.com/1xtVoAL.jpg",
           "https://i.imgur.com/eg8vsJl.jpg",
           "https://i.imgur.com/sPD0nTg.jpg",
           "https://i.imgur.com/1FBPswL.jpg",
           "https://i.imgur.com/HUVE4JW.jpg",
           "https://i.imgur.com/3pjkNU8.jpg",
           "https://i.imgur.com/j3ttc3p.jpg",
           "https://i.imgur.com/yP9anep.jpg",
           "https://i.imgur.com/zXcmcBN.jpg",
           "https://i.imgur.com/Y3Ds1hR.jpg",
           "https://i.imgur.com/9uY6JWw.jpg",
           "https://i.imgur.com/rzlIhPi.jpg",
           "https://i.imgur.com/sfk1mbj.jpg",
           "https://i.imgur.com/93ExztO.jpg",
           "https://i.imgur.com/01IzEy3.jpg",
           "https://i.imgur.com/fg1JqSN.jpg",
           "https://i.imgur.com/UzlwVC0.jpg",
           "https://i.imgur.com/0yLAWhp.jpg",
           "https://i.imgur.com/EmNbmO7.jpg",
           "https://i.imgur.com/Z8iEzU8.jpg",
           "https://i.imgur.com/pi0tg0r.jpg",
           "https://i.imgur.com/Z6LzNjI.jpg",
           "https://i.postimg.cc/pr3T7pRy/couple-3581038-1280.webp",
    // ... (same as provided in the initial code)
];

const love = [
     "الحب هو البوصلة التي ترشدنا في رحلة الحياة.",
    "في سيمفونية الوجود، ليكن الحب هو اللحن الذي يتردد في قلبك." 
    ,"أن تحب بعمق هو أن تعيش بشكل كامل، وتحتضن جمال كل لحظة."
    ,"الحب هو اللغة التي تتجاوز الكلمات، وتخاطب القلب مباشرة." 
    ,"في نسيج العلاقات، دع الحب ينسج الخيوط التي تربط القلوب ببعضها البعض." 
    ,"أن تحب وأن تكون محبوباً هو أن ترقص على إيقاع التواصل والتفاهم." 
    ,"الحب هو النغم الخالد الذي يتردد في أروقة الزمن، ويتناغم العصور."
    ,"في حديقة العواطف، ليكن الحب الزهرة المتفتحة التي تضفي اللون على روحك.",
    "الحب غير المشروط هو احتضان الإلهي في نفسك وفي الآخرين."
    ,"الحب هو الهمس اللطيف الذي يتردد صداه في حجرات القلب فيهدئ ويريح.",
    "في رواية الحياة الكبرى، ليكن الحب هو الموضوع المتكرر الذي يثري كل فصل.",
    "أن تحب بشدة هو أن تقف كمنارة للدفء وسط رياح العالم الباردة." 
    ,"الحب هو الفن الذي يحول لوحة الحياة إلى تحفة فنية من التجارب المشتركة.",
    "في رقصة الارتباط، ليكن الحب الكوريغرافيا الرشيقة التي توحد النفوس.",
    "الحب الحقيقي هو احتضان العيوب والاحتفال بتفرد كل كائن." 
    ,"الحب هو الجسر الذي يعبر أنهار الاختلاف، ويربط شواطئ التفاهم.",
    "في معرض العواطف، ليكن الحب التحفة الفنية التي تثير الفرح والحنان.",
    "الحب العميق هو الغوص في محيط العواطف، واكتشاف الكنوز المخفية بداخله.",

    , "الحب هو البوصلة التي ترشدنا خلال متاهات التحديات، مؤدياً إلى النور.",
        "في شعر العلاقات، دع الحب يكون الآيات البليغة التي تلامس أعماق الروح.",
        "أن تحب بشغف هو أن تشعل اللهب الذي يدفئ حتى أبرد الليالي.",
        "الحب هو السيمفونية التي تلعب في القلب، خلقاً للحان متناغمة من الارتباط.",
        "في فسيفساء الحياة، دع الحب يكون البلاط الحيوي الذي يضيف الجمال والمعنى للصورة.",
        "أن تحب بإخلاص هو أن ترى الشرارة الإلهية داخل كل كائن، معززاً الرأفة.",
        "الحب هو العطر الذي يتردد في الهواء، يترك خلفه درباً من الدفء والحلاوة.",
        "في نسيج الزمن، دع الحب يكون الخيط الذهبي الذي يتخلل العصور.",
        "أن تحب بكل قلبك هو أن تقدم كامل وجودك، مخلقاً رابطاً لا يمكن كسره.",
        "الحب هو الطاقة التي تدفعنا إلى الأمام، مما يجعل رحلة الحياة ذات معنى.",
        "في رقصة العواطف، دع الحب يكون الشريك الرشيق الذي يقود إلى الفرح والتحقيق.",
        "أن تحب بعمق هو أن تغوص في بئر العواطف، اكتشاف الكنوز المخفية في داخلها.",
        "الحب هو الراسخ الذي يحافظ على استقرارنا في عواصف الحياة، يوفر الاستقرار والعزاء.",
        "في حديقة الارتباطات، دع الحب يكون البذرة التي تتفتح في علاقات جميلة.",
        "أن تحب بدون قيود هو أن تصب اللطف والرأفة في كأس الوجود.",
    "الحب هو الشمس التي تنير أظلم الزوايا، تجلب الدفء والإضاءة.",
    "في نسيج الوجود، دع الحب يكون اللون الحيوي الذي يرسم كل لحظة بالجمال.",
    "أن تحب بحماس هو أن تكون مصباحًا من الضوء، تبدد الظلال التي قد تعبر طريقك.",
    "الحب هو اللحن الذي يلعب في القلب، خلقاً لسيمفونية متناغمة من الارتباط.",
    "في معرض العواطف، دع الحب يكون التحفة الفنية التي تستحضر الفرح والرقة.",
    "أن تحب بعمق هو أن تغوص في محيط العواطف، اكتشاف الكنوز المخفية في داخله.",
    "الحب هو البوصلة التي ترشدنا خلال متاهات التحديات، مؤدياً إلى النور.",
    "في شعر العلاقات، دع الحب يكون الآيات البليغة التي تلامس أعماق الروح.",
    "أن تحب بشغف هو أن تشعل اللهب الذي يدفئ حتى أبرد الليالي.",
    "الحب هو السيمفونية التي تلعب في القلب، خلقاً للحان متناغمة من الارتباط.",
    "في فسيفساء الحياة، دع الحب يكون البلاط الحيوي الذي يضيف الجمال والمعنى للصورة.",
    "أن تحب بإخلاص هو أن ترى الشرارة الإلهية داخل كل كائن، معززاً الرأفة.",
    "الحب هو العطر الذي يتردد في الهواء، يترك خلفه درباً من الدفء والحلاوة.",
    "في نسيج الزمن، دع الحب يكون الخيط الذهبي الذي يتخلل العصور.",
    "أن تحب بكل قلبك هو أن تقدم كامل وجودك، مخلقاً رابطاً لا يمكن كسره.",
    "الحب هو الطاقة التي تدفعنا إلى الأمام، مما يجعل رحلة الحياة ذات معنى.",
    "في رقصة العواطف، دع الحب يكون الشريك الرشيق الذي يقود إلى الفرح والتحقيق.",
    "أن تحب بعمق هو أن تغوص في بئر العواطف، اكتشاف الكنوز المخفية في داخلها.",
    "الحب هو الراسخ الذي يحافظ على استقرارنا في عواصف الحياة، يوفر الاستقرار والعزاء.",
    "في حديقة الارتباطات، دع الحب يكون البذرة التي تتفتح في علاقات جميلة.",
    "أن تحب بدون قيود هو أن تصب اللطف والرأفة في كأس الوجود.",
    "الحب هو الشمس التي تنير أظلم الزوايا، تجلب الدفء والإضاءة.",
    "في نسيج الوجود، دع الحب يكون اللون الحيوي الذي يرسم كل لحظة بالجمال.",
    "أن تحب بحماس هو أن تكون مصباحًا من الضوء، تبدد الظلال التي قد تعبر طريقك.",
    "وعد بالحب هو التزام مكتوب بحبر الصدق.",
    "في سيمفونية اتصالنا، وعودي هي النوتات التي تخلق لحناً متناغماً.",
    "مع كل دقة في قلبي، أعدك بترديد لحن الحب الذي يرن بيننا.",
    "الوعود هي الخيوط التي تنسج نسيج الثقة في نسيج علاقتنا.",
    "في حديقة الالتزام، وعدي هي البذور التي تتفتح إلى زهور الحب الدائم.",
    "مثل النجوم التي تتلألأ في سماء الليل، وعدي هي وجود دائم في وسع حبنا الواسع.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي الأحجار الزاوية التي تدعم قوس أحلامنا المشتركة، خلقاً لجسر نحو مستقبل مليء بالحب.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "تماماً كما تعد القمر بإضاءة الليل، أعدك بأن أكون نوراً مرشداً في ظلمة التحديات.",
    "الوعود هي صدى الحب الذي يرن في أروقة ذكرياتنا المشتركة.",
    "مع كل نفس، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "في سيمفونية اتصالنا، وعدي هي النوتات التي تخلق لحناً متناغماً.",
    "الوعود هي المنارات التي ترشدنا خلال العواصف، ضمانًا للعثور على طريقنا إلى بعضنا البعض.",
    "مع كل دقة، أتعهد بأن أحتفظ بالوعود التي تشكل إيقاع قصتنا الدائمة للحب.",
    "تمامًا كما يعد الشمس بيوم جديد، أعدك بأن أجلب الدفء والنور إلى لوحة حياتنا المشتركة.",
    "الوعود هي النجوم التي تضيء سماء رحلتنا في الليل، خلقًا لكوكبة من الحب.",
    "في فسيفساء تجاربنا المشتركة، وعدي هي البلاط الملون الذي يخلق تحفة فنية من الحب.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي المراسي التي تحافظ على استقرار سفينة حبنا في بحار الحياة المتقلبة.",
    "تمامًا كما يتموج الرياح خلال الأشجار، وعدي هي كلمات لطيفة تطمئن وتواسي.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "الوعود هي الجسور التي تمتد عبر أنهار الشك، ربطًا بين شواطئ الثقة والفهم.",
    "مع كل دقة، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "في سيمفونية اتصالنا، وعدي هي النوتات التي تخلق لحناً متناغماً.",
    "الوعود هي المنارات التي ترشدنا خلال العواصف، ضمانًا للعثور على طريقنا إلى بعضنا البعض.",
    "مع كل نفس، أعدك بأن أملئ هواءنا المشترك بالحب واللطف والدعم الثابت.",
    "الوعود هي النجوم التي تضيء سماء رحلتنا في الليل، خلقًا لكوكبة من الحب.",
    "في فسيفساء تجاربنا المشتركة، وعدي هي البلاط الملون الذي يخلق تحفة فنية من الحب.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي المراسي التي تحافظ على استقرار سفينة حبنا في بحار الحياة المتقلبة.",
    "تمامًا كما يتموج الرياح خلال الأشجار، وعدي هي كلمات لطيفة تطمئن وتواسي.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "الوعود هي الجسور التي تمتد عبر أنهار الشك، ربطًا بين شواطئ الثقة والفهم.",
    "مع كل دقة، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "في سيمفونية اتصالنا، وعدي هي النوتات التي تخلق لحناً متناغماً.",
    "الوعود هي المنارات التي ترشدنا خلال العواصف، ضمانًا للعثور على طريقنا إلى بعضنا البعض.",
    "مع كل نفس، أعدك بأن أملئ هواءنا المشترك بالحب واللطف والدعم الثابت.",
    "الوعود هي النجوم التي تضيء سماء رحلتنا في الليل، خلقًا لكوكبة من الحب.",
    "في فسيفساء تجاربنا المشتركة، وعدي هي البلاط الملون الذي يخلق تحفة فنية من الحب.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي المراسي التي تحافظ على استقرار سفينة حبنا في بحار الحياة المتقلبة.",
    "تمامًا كما تهمس الرياح خلال الأشجار، وعدي هي كلمات لطيفة تطمئن وتواسي.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "الوعود هي الجسور التي تمتد عبر أنهار الشك، ربطًا بين شواطئ الثقة والفهم.",
    "مع كل دقة، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "في سيمفونية اتصالنا، وعدي هي النوتات التي تخلق لحناً متناغماً.",
    "الوعود هي المنارات التي ترشدنا خلال العواصف، ضمانًا للعثور على طريقنا إلى بعضنا البعض.",
    "مع كل نفس، أعدك بأن أملئ هواءنا المشترك بالحب واللطف والدعم الثابت.",
    "الوعود هي النجوم التي تضيء سماء رحلتنا في الليل، خلقًا لكوكبة من الحب.",
    "في فسيفساء تجاربنا المشتركة، وعدي هي البلاط الملون الذي يخلق تحفة فنية من الحب.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي المراسي التي تحافظ على استقرار سفينة حبنا في بحار الحياة المتقلبة.",
    "تمامًا كما تهمس الرياح خلال الأشجار، وعدي هي كلمات لطيفة تطمئن وتواسي.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "الوعود هي الجسور التي تمتد عبر أنهار الشك، ربطًا بين شواطئ الثقة والفهم.",
    "مع كل دقة، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "في سيمفونية اتصالنا، وعدي هي النوتات التي تخلق لحناً متناغماً.",
    "الوعود هي المنارات التي ترشدنا خلال العواصف، ضمانًا للعثور على طريقنا إلى بعضنا البعض.",
    "مع كل نفس، أعدك بأن أملئ هواءنا المشترك بالحب واللطف والدعم الثابت.",
    "الوعود هي النجوم التي تضيء سماء رحلتنا في الليل، خلقًا لكوكبة من الحب.",
    "في فسيفساء تجاربنا المشتركة، وعدي هي البلاط الملون الذي يخلق تحفة فنية من الحب.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي المراسي التي تحافظ على استقرار سفينة حبنا في بحار الحياة المتقلبة.",
    "تمامًا كما تهمس الرياح خلال الأشجار، وعدي هي كلمات لطيفة تطمئن وتواسي.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "الوعود هي الجسور التي تمتد عبر أنهار الشك، ربطًا بين شواطئ الثقة والفهم.",
    "مع كل دقة، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "في سيمفونية اتصالنا، وعدي هي النوتات التي تخلق لحناً متناغماً.",
    "الوعود هي المنارات التي ترشدنا خلال العواصف، ضمانًا للعثور على طريقنا إلى بعضنا البعض.",
    "مع كل نفس، أعدك بأن أملئ هواءنا المشترك بالحب واللطف والدعم الثابت.",
    "الوعود هي النجوم التي تضيء سماء رحلتنا في الليل، خلقًا لكوكبة من الحب.",
    "في فسيفساء تجاربنا المشتركة، وعدي هي البلاط الملون الذي يخلق تحفة فنية من الحب.",
    "مع كل شروق للشمس، أجدد الوعد بأن أحترمك وأكرمك كأثمن هدية في حياتي.",
    "الوعود هي المراسي التي تحافظ على استقرار سفينة حبنا في بحار الحياة المتقلبة.",
    "تمامًا كما تهمس الرياح خلال الأشجار، وعدي هي كلمات لطيفة تطمئن وتواسي.",
    "في رقصة الزمن، وعدي هي الحركات الرشيقة التي تقودنا خطوة بخطوة في رحلتنا.",
    "الوعود هي الجسور التي تمتد عبر أنهار الشك، ربطًا بين شواطئ الثقة والفهم.",
    "مع كل دقة، أتنفس التزامًا بأن أحبك بلا قيود، متنفسًا وعود الولاء الأبدي.",
    "انتظار الحب مثل العناية بحديقة؛ كلما أستثمرت المزيد من الصبر، كلما أصبحت أجمل.",
    "في فن انتظار الحب، كل لحظة هي رسم على لوحة الانتظار.",
    "الصبر في الحب هو المفتاح الذي يفتح أبواب علاقة جميلة ومفرحة.",
    "انتظار الحب ليس فعلًا سلبيًا وإنما رحلة اكتشاف الذات والنمو.",
    "مثل الكوكون الذي ينتظر الفراشة، يُحول الحب نفسه ويظهر بشكل أجمل مع الصبر.",
    "الصبر في الحب ليس مجرد فضيلة؛ بل هو شهادة على قوة التزامك.",
    "في سيمفونية الانتظار، كل نوتة تذكير بأن أفضل الأمور تستحق الوقت والترقب.",
    "انتظار الحب مثل زرع البذور؛ يحتاج إلى وقت ورعاية وصبر لتزهر حديقة الحب.",
    "الصبر هو النحات الذي يشكل الحب إلى تحفة تستحق الانتظار.",
    "في فسيفساء الحب، الانتظار هو الخيط الذي يمر من خلال كل لحظة، خلقًا لقصة صمود.",
    "انتظار الحب ليس اختبارًا للزمن بل رحلة فهم واستعداد.",
    "الصبر في الحب هو النسيم اللطيف الذي يحمل عبير الترقب.",
    "في فن الانتظار، كل دقة قلب هي لحن من الترقب لبداية سيمفونية الحب.",
    "انتظار الحب ليس الوقوف بلا حراك؛ إنها رقصة ديناميكية من النمو واكتشاف الذات.",
    "الصبر في الحب هو البوصلة التي ترشدك خلال منعطفات الانتظار.",
    "في فسيفساء الزمن، انتظار الحب هو الخيط الذهبي الذي يضيف ثراءً وعمقًا للنسيج.",
    "انتظار الحب ليس حساب الأيام بل جعل الأيام تحمل قيمة في الترقب لشيء جميل.",
    "الصبر هو الكيمياء التي تحول الانتظار إلى تجربة تحويلية ومثرية.",
    "في رقصة الانتظار، كل خطوة هي إيقاع تقودك أقرب إلى لحن الحب.",
    "انتظار الحب مثل العناية بحديقة؛ كلما أستثمرت المزيد من الصبر، كلما أصبحت أجمل.",
    "في فن انتظار الحب، كل لحظة هي تكوين على لوحة الانتظار.",
    "الصبر في الحب هو المفتاح الذي يفتح أبواب علاقة جميلة ومفرحة.",
    "انتظار الحب ليس فعلًا سلبيًا وإنما رحلة اكتشاف الذات والنمو.",
    "مثل الكوكون الذي ينتظر الفراشة، يُحول الحب نفسه ويظهر بشكل أجمل مع الصبر.",
    "الصبر في الحب ليس مجرد فضيلة؛ بل هو شهادة على قوة التزامك.",
    "في سيمفونية الانتظار، كل نوتة تذكير بأن أفضل الأمور تستحق الوقت والترقب.",
    "انتظار الحب مثل زرع البذور؛ يحتاج إلى وقت ورعاية وصبر لتزهر حديقة الحب.",
    "الصبر هو النحات الذي يشكل الحب إلى تحفة تستحق الانتظار.",
    "في فسيفساء الحب، الانتظار هو الخيط الذي يمر من خلال كل لحظة، خلقًا لقصة صمود.",
    "انتظار الحب ليس اختبارًا للزمن بل رحلة فهم واستعداد.",
    "الصبر في الحب هو النسيم اللطيف الذي يحمل عبير الترقب.",
    "في فن الانتظار، كل دقة قلب هي لحن من الترقب لبداية سيمفونية الحب.",
    "انتظار الحب ليس الوقوف بلا حراك؛ إنها رقصة ديناميكية من النمو واكتشاف الذات.",
    "الصبر في الحب هو البوصلة التي ترشدك خلال منعطفات الانتظار.",
    "في فسيفساء الزمن، انتظار الحب هو الخيط الذهبي الذي يضيف ثراءً وعمقًا للنسيج.",
    "انتظار الحب ليس حساب الأيام بل جعل الأيام تحمل قيمة في الترقب لشيء جميل.",
    "الصبر هو الكيمياء التي تحول الانتظار إلى تجربة تحويلية ومثرية.",
    // ... (same as provided in the initial code)
];

async function loveMessage(api, threadID) {
  try {
    const randomImage = link[Math.floor(Math.random() * link.length)];
    const randomLoveMessage = love[Math.floor(Math.random() * love.length)];

    const response = await axios.get(randomImage, { responseType: 'stream' });

    api.sendMessage({
      body: `✨ تفضل إليك رسائل الحب التحفيزية \n ${randomLoveMessage}`,
      attachment: response.data,
    }, threadID);
  } catch (error) {
    console.error('Error sending love with image:', error);
  }
}

module.exports = loveMessage;
