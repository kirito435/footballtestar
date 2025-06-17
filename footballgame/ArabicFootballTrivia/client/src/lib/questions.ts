export const arabicFootballQuestions = [
  {
    id: 1,
    text: "من سجل هدف الفوز في نهائي كأس العالم 2014؟",
    answers: ["ماريو غوتزه", "ليونيل ميسي", "توماس مولر", "مانويل نوير"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "medium"
  },
  {
    id: 2,
    text: "ما هو النادي الذي يُلقب بـ 'السيدة العجوز'؟",
    answers: ["يوفنتوس", "ميلان", "إنتر ميلان", "نابولي"],
    correctAnswer: 0,
    category: "الأندية",
    difficulty: "easy"
  },
  {
    id: 3,
    text: "من هو أكثر لاعب تسجيلاً للأهداف في التاريخ؟",
    answers: ["كريستيانو رونالدو", "ليونيل ميسي", "بيليه", "مارادونا"],
    correctAnswer: 0,
    category: "اللاعبين",
    difficulty: "easy"
  },
  {
    id: 4,
    text: "في أي بلد أقيمت كأس العالم 2002؟",
    answers: ["اليابان وكوريا الجنوبية", "البرازيل", "ألمانيا", "فرنسا"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "medium"
  },
  {
    id: 5,
    text: "ما هو أول منتخب عربي تأهل لكأس العالم؟",
    answers: ["مصر", "المغرب", "تونس", "الجزائر"],
    correctAnswer: 0,
    category: "المنتخبات العربية",
    difficulty: "hard"
  },
  {
    id: 6,
    text: "من فاز بكأس العالم 2018؟",
    answers: ["فرنسا", "كرواتيا", "بلجيكا", "إنجلترا"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "easy"
  },
  {
    id: 7,
    text: "ما هو النادي الذي يُلقب بـ 'الملكي'؟",
    answers: ["ريال مدريد", "برشلونة", "أتلتيكو مدريد", "فالنسيا"],
    correctAnswer: 0,
    category: "الأندية",
    difficulty: "easy"
  },
  {
    id: 8,
    text: "من هو قائد المنتخب المصري في كأس العالم 2018؟",
    answers: ["محمد صلاح", "أحمد حجازي", "أحمد فتحي", "عصام الحضري"],
    correctAnswer: 0,
    category: "المنتخبات العربية",
    difficulty: "medium"
  },
  {
    id: 9,
    text: "كم مرة فاز البرازيل بكأس العالم؟",
    answers: ["5 مرات", "4 مرات", "6 مرات", "3 مرات"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "medium"
  },
  {
    id: 10,
    text: "من هو الهداف التاريخي لبرشلونة؟",
    answers: ["ليونيل ميسي", "رونالدينيو", "تشافي", "إنييستا"],
    correctAnswer: 0,
    category: "الأندية",
    difficulty: "easy"
  }
];

export const getRandomQuestion = (excludeIds: number[] = []) => {
  const availableQuestions = arabicFootballQuestions.filter(q => !excludeIds.includes(q.id));
  if (availableQuestions.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
};

export const getQuestionsByCategory = (category: string) => {
  return arabicFootballQuestions.filter(q => q.category === category);
};
