import { gameRooms, gamePlayers, questions, type GameRoom, type GamePlayer, type Question, type InsertGameRoom, type InsertGamePlayer, type InsertQuestion } from "@shared/schema";
import { db } from "./db";
import { eq, notInArray } from "drizzle-orm";

export interface IStorage {
  // Game Room operations
  createGameRoom(room: InsertGameRoom): Promise<GameRoom>;
  getGameRoom(roomCode: string): Promise<GameRoom | undefined>;
  updateGameRoom(roomCode: string, updates: Partial<GameRoom>): Promise<GameRoom | undefined>;
  deleteGameRoom(roomCode: string): Promise<void>;

  // Game Player operations
  addPlayerToRoom(player: InsertGamePlayer): Promise<GamePlayer>;
  getPlayersInRoom(roomId: number): Promise<GamePlayer[]>;
  updatePlayerScore(playerId: string, roomId: number, score: number): Promise<GamePlayer | undefined>;
  removePlayerFromRoom(playerId: string, roomId: number): Promise<void>;

  // Question operations
  getRandomQuestion(excludeIds?: number[]): Promise<Question | undefined>;
  getQuestionsByCategory(category: string, limit?: number): Promise<Question[]>;
  getAllQuestions(): Promise<Question[]>;
  addQuestion(question: InsertQuestion): Promise<Question>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with Arabic football trivia questions
    this.initializeQuestions();
  }

  private async initializeQuestions() {
    // Check if questions already exist
    const existingQuestions = await db.select().from(questions).limit(1);
    if (existingQuestions.length > 0) {
      return; // Questions already initialized
    }
    const arabicQuestions: InsertQuestion[] = [
      // كأس العالم - سهل
      {
        text: "من فاز بكأس العالم 2022؟",
        answers: ["الأرجنتين", "فرنسا", "البرازيل", "كرواتيا"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "easy"
      },
      {
        text: "من فاز بكأس العالم 2018؟",
        answers: ["فرنسا", "كرواتيا", "بلجيكا", "إنجلترا"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "easy"
      },
      {
        text: "كم مرة فاز البرازيل بكأس العالم؟",
        answers: ["5 مرات", "4 مرات", "6 مرات", "3 مرات"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "easy"
      },
      
      // كأس العالم - متوسط
      {
        text: "من سجل هدف الفوز في نهائي كأس العالم 2014؟",
        answers: ["ماريو غوتزه", "ليونيل ميسي", "توماس مولر", "مانويل نوير"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "medium"
      },
      {
        text: "في أي بلد أقيمت كأس العالم 2002؟",
        answers: ["اليابان وكوريا الجنوبية", "البرازيل", "ألمانيا", "فرنسا"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "medium"
      },
      {
        text: "من هو هداف كأس العالم 2022؟",
        answers: ["كيليان مبابي", "ليونيل ميسي", "جوليان ألفاريز", "أوليفييه جيرو"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "medium"
      },
      
      // كأس العالم - صعب
      {
        text: "في أي عام كانت أول مشاركة لمصر في كأس العالم؟",
        answers: ["1934", "1930", "1938", "1950"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "hard"
      },
      {
        text: "من سجل الهدف الأسرع في تاريخ كأس العالم؟",
        answers: ["هاكان شكور", "كلاوديو كانيجيا", "آلان شيرر", "فابيو غروسو"],
        correctAnswer: 0,
        category: "كأس العالم",
        difficulty: "hard"
      },
      
      // الأندية - سهل
      {
        text: "ما هو النادي الذي يُلقب بـ 'الملكي'؟",
        answers: ["ريال مدريد", "برشلونة", "أتلتيكو مدريد", "فالنسيا"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "easy"
      },
      {
        text: "ما هو النادي الذي يُلقب بـ 'السيدة العجوز'؟",
        answers: ["يوفنتوس", "ميلان", "إنتر ميلان", "نابولي"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "easy"
      },
      {
        text: "من هو الهداف التاريخي لبرشلونة؟",
        answers: ["ليونيل ميسي", "رونالدينيو", "تشافي", "إنييستا"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "easy"
      },
      
      // الأندية - متوسط
      {
        text: "كم مرة فاز ريال مدريد بدوري أبطال أوروبا؟",
        answers: ["15 مرة", "13 مرة", "14 مرة", "12 مرة"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "medium"
      },
      {
        text: "في أي عام تأسس نادي الأهلي المصري؟",
        answers: ["1907", "1905", "1910", "1908"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "medium"
      },
      {
        text: "ما هو ملعب مانشستر يونايتد؟",
        answers: ["أولد ترافورد", "أنفيلد", "ستامفورد بريدج", "الإمارات"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "medium"
      },
      
      // الأندية - صعب
      {
        text: "من هو النادي الذي فاز بأول نسخة من دوري أبطال أوروبا؟",
        answers: ["ريال مدريد", "ميلان", "بنفيكا", "أياكس"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "hard"
      },
      {
        text: "كم نادي عربي وصل لنهائي دوري أبطال أفريقيا عام 2020؟",
        answers: ["ثلاثة أندية", "ناديان", "نادي واحد", "أربعة أندية"],
        correctAnswer: 0,
        category: "الأندية",
        difficulty: "hard"
      },
      
      // اللاعبين - سهل
      {
        text: "من هو أكثر لاعب تسجيلاً للأهداف في التاريخ؟",
        answers: ["كريستيانو رونالدو", "ليونيل ميسي", "بيليه", "مارادونا"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "easy"
      },
      {
        text: "من هو الحائز على الكرة الذهبية 2023؟",
        answers: ["ليونيل ميسي", "كيليان مبابي", "إيرلينغ هالاند", "كريم بنزيما"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "easy"
      },
      {
        text: "من هو أفضل لاعب في العالم عام 2022؟",
        answers: ["ليونيل ميسي", "كريم بنزيما", "كيليان مبابي", "صادي ماني"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "easy"
      },
      
      // اللاعبين - متوسط  
      {
        text: "كم هدف سجل محمد صلاح في موسم 2017-2018 مع ليفربول؟",
        answers: ["44 هدف", "42 هدف", "46 هدف", "40 هدف"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "medium"
      },
      {
        text: "من هو صاحب رقم 10 في منتخب الأرجنتين حالياً؟",
        answers: ["ليونيل ميسي", "باولو ديبالا", "لاوتارو مارتينيز", "أنخيل دي ماريا"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "medium"
      },
      {
        text: "كم مرة فاز زين الدين زيدان بالكرة الذهبية؟",
        answers: ["مرة واحدة", "مرتان", "ثلاث مرات", "لم يفز بها"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "medium"
      },
      
      // اللاعبين - صعب
      {
        text: "من هو أصغر لاعب سجل في كأس العالم؟",
        answers: ["بيليه", "مايكل أوين", "كيليان مبابي", "ليونيل ميسي"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "hard"
      },
      {
        text: "كم مرة فاز رونالدينيو بالكرة الذهبية؟",
        answers: ["مرة واحدة", "مرتان", "ثلاث مرات", "لم يفز بها"],
        correctAnswer: 0,
        category: "اللاعبين",
        difficulty: "hard"
      },
      
      // المنتخبات العربية - سهل
      {
        text: "من هو قائد المنتخب المصري الحالي؟",
        answers: ["محمد صلاح", "أحمد حجازي", "أحمد فتحي", "عصام الحضري"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "easy"
      },
      {
        text: "ما هو أول منتخب عربي تأهل لكأس العالم؟",
        answers: ["مصر", "المغرب", "تونس", "الجزائر"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "easy"
      },
      {
        text: "من فاز بكأس الأمم العربية 2021؟",
        answers: ["الجزائر", "تونس", "مصر", "المغرب"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "easy"
      },
      
      // المنتخبات العربية - متوسط
      {
        text: "كم مرة فازت مصر بكأس الأمم الأفريقية؟",
        answers: ["7 مرات", "6 مرات", "8 مرات", "5 مرات"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "medium"
      },
      {
        text: "في أي كأس عالم وصل المغرب للدور نصف النهائي؟",
        answers: ["كأس العالم 2022", "كأس العالم 2018", "كأس العالم 1986", "كأس العالم 1998"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "medium"
      },
      {
        text: "من هو مدرب المنتخب السعودي الحالي؟",
        answers: ["روبرتو مانشيني", "فان مارفايك", "بيتزي", "رينارد"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "medium"
      },
      
      // المنتخبات العربية - صعب
      {
        text: "في أي عام فاز المغرب بكأس الأمم الأفريقية؟",
        answers: ["1976", "1980", "1988", "1996"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "hard"
      },
      {
        text: "من سجل هدف الفوز للجزائر على ألمانيا في كأس العالم 1982؟",
        answers: ["رابح ماجر", "لخضر بلومي", "صلاح أسد", "دجامل زيداني"],
        correctAnswer: 0,
        category: "المنتخبات العربية",
        difficulty: "hard"
      },
      
      // المدربين - سهل
      {
        text: "من هو مدرب منتخب فرنسا الحالي؟",
        answers: ["ديدييه ديشان", "زين الدين زيدان", "تيري أنري", "أرسين فينجر"],
        correctAnswer: 0,
        category: "المدربين",
        difficulty: "easy"
      },
      {
        text: "من هو مدرب مانشستر سيتي الحالي؟",
        answers: ["بيب غوارديولا", "يورغن كلوب", "أنطونيو كونتي", "كارلو أنشيلوتي"],
        correctAnswer: 0,
        category: "المدربين",
        difficulty: "easy"
      },
      
      // المدربين - متوسط
      {
        text: "من هو المدرب الذي فاز بأكثر عدد من الألقاب مع ريال مدريد؟",
        answers: ["كارلو أنشيلوتي", "زين الدين زيدان", "جوزيه مورينيو", "فلورنتينو بيريز"],
        correctAnswer: 0,
        category: "المدربين",
        difficulty: "medium"
      },
      {
        text: "كم مرة فاز أليكس فيرجسون بالدوري الإنجليزي؟",
        answers: ["13 مرة", "11 مرة", "15 مرة", "9 مرات"],
        correctAnswer: 0,
        category: "المدربين",
        difficulty: "medium"
      },
      
      // المدربين - صعب
      {
        text: "من هو المدرب الوحيد الذي فاز بكأس العالم كلاعب ومدرب؟",
        answers: ["فرانز بيكنباور", "ديدييه ديشان", "زين الدين زيدان", "دييغو سيميوني"],
        correctAnswer: 0,
        category: "المدربين",
        difficulty: "hard"
      },
      {
        text: "من هو أصغر مدرب فاز بدوري أبطال أوروبا؟",
        answers: ["جوليان ناجلسمان", "فرانك لامبارد", "أندريا بيرلو", "تياغو موتا"],
        correctAnswer: 0,
        category: "المدربين",
        difficulty: "hard"
      },

      // أسئلة جديدة - الحراس
      {
        text: "من هو أفضل حارس مرمى في العالم حالياً؟",
        answers: ["إيميليانو مارتينيز", "تيبو كورتوا", "مانويل نوير", "أليسون بيكر"],
        correctAnswer: 0,
        category: "الحراس",
        difficulty: "easy"
      },
      {
        text: "من هو الحارس الذي أنقذ ركلة جزاء في نهائي كأس العالم 2022؟",
        answers: ["إيميليانو مارتينيز", "هوغو يوريس", "دومينيك ليفاكوفيتش", "ياسين بونو"],
        correctAnswer: 0,
        category: "الحراس",
        difficulty: "medium"
      },
      {
        text: "كم ركلة جزاء أنقذ ياسين بونو في كأس العالم 2022؟",
        answers: ["ركلتان", "ركلة واحدة", "ثلاث ركلات", "أربع ركلات"],
        correctAnswer: 0,
        category: "الحراس",
        difficulty: "hard"
      },

      // الحكام
      {
        text: "من هو الحكم الذي أدار نهائي كأس العالم 2022؟",
        answers: ["سيزار راموس", "أنطونيو لاهوز", "بيورن كويبرز", "دانييل أورساتو"],
        correctAnswer: 0,
        category: "الحكام",
        difficulty: "medium"
      },
      {
        text: "من هو أول حكم عربي أدار مباراة في كأس العالم؟",
        answers: ["علي بن ناصر", "عبد الرحمن الزيد", "جاسم الميجل", "فهد المردف"],
        correctAnswer: 0,
        category: "الحكام",
        difficulty: "hard"
      },

      // الأرقام القياسية
      {
        text: "ما هو أكبر فوز في تاريخ كأس العالم؟",
        answers: ["هنغاريا 10-1 السلفادور", "المجر 9-0 كوريا الجنوبية", "يوغوسلافيا 9-0 زائير", "ألمانيا 8-0 العربية السعودية"],
        correctAnswer: 0,
        category: "الأرقام القياسية",
        difficulty: "hard"
      },
      {
        text: "من سجل أسرع هدف في تاريخ الدوريات الأوروبية؟",
        answers: ["آلان شيرر", "هاري كين", "كايلي مبابي", "إيرلينغ هالاند"],
        correctAnswer: 0,
        category: "الأرقام القياسية",
        difficulty: "medium"
      },
      {
        text: "كم هدف سجل ليونيل ميسي في مسيرته مع برشلونة؟",
        answers: ["672 هدف", "650 هدف", "700 هدف", "625 هدف"],
        correctAnswer: 0,
        category: "الأرقام القياسية",
        difficulty: "hard"
      },

      // البطولات الأوروبية
      {
        text: "من فاز بأول نسخة من كأس أوروبا؟",
        answers: ["الاتحاد السوفيتي", "يوغوسلافيا", "إسبانيا", "فرنسا"],
        correctAnswer: 0,
        category: "البطولات الأوروبية",
        difficulty: "hard"
      },
      {
        text: "أي منتخب فاز بيورو 2021؟",
        answers: ["إيطاليا", "إنجلترا", "إسبانيا", "فرنسا"],
        correctAnswer: 0,
        category: "البطولات الأوروبية",
        difficulty: "easy"
      },
      {
        text: "من هو هداف يورو 2021؟",
        answers: ["كريستيانو رونالدو", "هاري كين", "كايلي مبابي", "روميلو لوكاكو"],
        correctAnswer: 0,
        category: "البطولات الأوروبية",
        difficulty: "medium"
      },

      // كوبا أمريكا
      {
        text: "من فاز بكوبا أمريكا 2021؟",
        answers: ["الأرجنتين", "البرازيل", "أوروغواي", "تشيلي"],
        correctAnswer: 0,
        category: "كوبا أمريكا",
        difficulty: "easy"
      },
      {
        text: "كم مرة فازت الأرجنتين بكوبا أمريكا؟",
        answers: ["15 مرة", "14 مرة", "16 مرة", "13 مرة"],
        correctAnswer: 0,
        category: "كوبا أمريكا",
        difficulty: "medium"
      },

      // الدوري الإنجليزي
      {
        text: "من فاز بالدوري الإنجليزي موسم 2023-2024؟",
        answers: ["مانشستر سيتي", "أرسنال", "ليفربول", "نيوكاسل"],
        correctAnswer: 0,
        category: "الدوري الإنجليزي",
        difficulty: "easy"
      },
      {
        text: "من هو أكثر لاعب تسجيلاً في تاريخ الدوري الإنجليزي؟",
        answers: ["آلان شيرر", "واين روني", "هاري كين", "فرانك لامبارد"],
        correctAnswer: 0,
        category: "الدوري الإنجليزي",
        difficulty: "medium"
      },
      {
        text: "كم مرة فاز مانشستر يونايتد بالدوري الإنجليزي؟",
        answers: ["20 مرة", "19 مرة", "21 مرة", "18 مرة"],
        correctAnswer: 0,
        category: "الدوري الإنجليزي",
        difficulty: "medium"
      },

      // الدوري الإسباني
      {
        text: "من فاز بالليغا موسم 2023-2024؟",
        answers: ["ريال مدريد", "برشلونة", "أتلتيكو مدريد", "إشبيلية"],
        correctAnswer: 0,
        category: "الدوري الإسباني",
        difficulty: "easy"
      },
      {
        text: "كم مرة فاز برشلونة بالليغا؟",
        answers: ["27 مرة", "26 مرة", "28 مرة", "25 مرة"],
        correctAnswer: 0,
        category: "الدوري الإسباني",
        difficulty: "medium"
      },

      // الدوري الألماني
      {
        text: "من فاز بالبوندسليغا موسم 2023-2024؟",
        answers: ["باير ليفركوزن", "بايرن ميونخ", "بوروسيا دورتموند", "آر بي لايبزيغ"],
        correctAnswer: 0,
        category: "الدوري الألماني",
        difficulty: "easy"
      },
      {
        text: "كم مرة فاز بايرن ميونخ بالبوندسليغا؟",
        answers: ["32 مرة", "30 مرة", "34 مرة", "28 مرة"],
        correctAnswer: 0,
        category: "الدوري الألماني",
        difficulty: "medium"
      },

      // الدوري الإيطالي
      {
        text: "من فاز بالسيريا أ موسم 2023-2024؟",
        answers: ["إنتر ميلان", "يوفنتوس", "ميلان", "نابولي"],
        correctAnswer: 0,
        category: "الدوري الإيطالي",
        difficulty: "easy"
      },
      {
        text: "كم مرة فاز يوفنتوس بالسيريا أ؟",
        answers: ["36 مرة", "35 مرة", "37 مرة", "34 مرة"],
        correctAnswer: 0,
        category: "الدوري الإيطالي",
        difficulty: "medium"
      },

      // الدوري الفرنسي
      {
        text: "من فاز بالدوري الفرنسي موسم 2023-2024؟",
        answers: ["باريس سان جيرمان", "موناكو", "مرسيليا", "ليون"],
        correctAnswer: 0,
        category: "الدوري الفرنسي",
        difficulty: "easy"
      },

      // كرة القدم النسائية
      {
        text: "من فاز بكأس العالم للسيدات 2023؟",
        answers: ["إسبانيا", "إنجلترا", "أستراليا", "السويد"],
        correctAnswer: 0,
        category: "كرة القدم النسائية",
        difficulty: "easy"
      },
      {
        text: "من هي أفضل لاعبة في العالم 2023؟",
        answers: ["أيتانا بونماتي", "ألكسيا بوتياس", "سام كير", "كايرا والش"],
        correctAnswer: 0,
        category: "كرة القدم النسائية",
        difficulty: "medium"
      },

      // الأولمبياد
      {
        text: "من فاز بذهبية كرة القدم في أولمبياد طوكيو 2021؟",
        answers: ["البرازيل", "إسبانيا", "المكسيك", "اليابان"],
        correctAnswer: 0,
        category: "الأولمبياد",
        difficulty: "medium"
      },

      // أسئلة ثقافية
      {
        text: "في أي عام تأسس الفيفا؟",
        answers: ["1904", "1900", "1908", "1912"],
        correctAnswer: 0,
        category: "التاريخ",
        difficulty: "hard"
      },
      {
        text: "كم دقيقة تستغرق مباراة كرة القدم العادية؟",
        answers: ["90 دقيقة", "85 دقيقة", "95 دقيقة", "100 دقيقة"],
        correctAnswer: 0,
        category: "القوانين",
        difficulty: "easy"
      },
      {
        text: "كم لاعب في كل فريق على أرض الملعب؟",
        answers: ["11 لاعب", "10 لاعبين", "12 لاعب", "9 لاعبين"],
        correctAnswer: 0,
        category: "القوانين",
        difficulty: "easy"
      },
      {
        text: "كم حكم يدير المباراة في كرة القدم؟",
        answers: ["3 حكام", "حكم واحد", "حكمان", "4 حكام"],
        correctAnswer: 0,
        category: "القوانين",
        difficulty: "easy"
      },

      // أسئلة خاصة بالعرب
      {
        text: "من هو أول لاعب عربي يلعب في ريال مدريد؟",
        answers: ["عاصم الحضري", "محمد صلاح", "حكيم زياش", "ياسين بونو"],
        correctAnswer: 0,
        category: "الأرقام القياسية العربية",
        difficulty: "hard"
      },
      {
        text: "ما هو أكبر استاد في العالم العربي؟",
        answers: ["استاد القاهرة", "استاد الملك فهد", "استاد محمد الخامس", "استاد الجزائر"],
        correctAnswer: 0,
        category: "الملاعب",
        difficulty: "medium"
      },
      {
        text: "في أي مدينة يقع استاد لوسيل؟",
        answers: ["الدوحة", "الرياض", "دبي", "أبوظبي"],
        correctAnswer: 0,
        category: "الملاعب",
        difficulty: "easy"
      },

      // أسئلة حديثة 2024
      {
        text: "من فاز بدوري أبطال أوروبا 2024؟",
        answers: ["ريال مدريد", "بوروسيا دورتموند", "بايرن ميونخ", "مانشستر سيتي"],
        correctAnswer: 0,
        category: "أحدث الأخبار",
        difficulty: "easy"
      },
      {
        text: "من فاز بالكأس الذهبية لكوبا أمريكا 2024؟",
        answers: ["الأرجنتين", "كولومبيا", "أوروغواي", "البرازيل"],
        correctAnswer: 0,
        category: "أحدث الأخبار",
        difficulty: "easy"
      },
      {
        text: "من فاز بيورو 2024؟",
        answers: ["إسبانيا", "إنجلترا", "فرنسا", "ألمانيا"],
        correctAnswer: 0,
        category: "أحدث الأخبار",
        difficulty: "easy"
      }
    ];

    try {
      await db.insert(questions).values(arabicQuestions);
      console.log("Questions initialized successfully");
    } catch (error) {
      console.error("Failed to initialize questions:", error);
    }
  }

  async createGameRoom(room: InsertGameRoom): Promise<GameRoom> {
    const [gameRoom] = await db
      .insert(gameRooms)
      .values({
        ...room,
        maxPlayers: room.maxPlayers || 4,
        totalRounds: room.totalRounds || 10,
      })
      .returning();
    return gameRoom;
  }

  async getGameRoom(roomCode: string): Promise<GameRoom | undefined> {
    const [room] = await db
      .select()
      .from(gameRooms)
      .where(eq(gameRooms.roomCode, roomCode));
    return room || undefined;
  }

  async updateGameRoom(roomCode: string, updates: Partial<GameRoom>): Promise<GameRoom | undefined> {
    const [updatedRoom] = await db
      .update(gameRooms)
      .set(updates)
      .where(eq(gameRooms.roomCode, roomCode))
      .returning();
    return updatedRoom || undefined;
  }

  async deleteGameRoom(roomCode: string): Promise<void> {
    await db.delete(gameRooms).where(eq(gameRooms.roomCode, roomCode));
  }

  async addPlayerToRoom(player: InsertGamePlayer): Promise<GamePlayer> {
    const [gamePlayer] = await db
      .insert(gamePlayers)
      .values(player)
      .returning();
    return gamePlayer;
  }

  async getPlayersInRoom(roomId: number): Promise<GamePlayer[]> {
    const players = await db
      .select()
      .from(gamePlayers)
      .where(eq(gamePlayers.roomId, roomId));
    return players;
  }

  async updatePlayerScore(playerId: string, roomId: number, score: number): Promise<GamePlayer | undefined> {
    const [updatedPlayer] = await db
      .update(gamePlayers)
      .set({ score })
      .where(eq(gamePlayers.playerId, playerId))
      .returning();
    return updatedPlayer || undefined;
  }

  async removePlayerFromRoom(playerId: string, roomId: number): Promise<void> {
    await db
      .delete(gamePlayers)
      .where(eq(gamePlayers.playerId, playerId));
  }

  async getRandomQuestion(excludeIds: number[] = []): Promise<Question | undefined> {
    let query = db.select().from(questions);
    
    if (excludeIds.length > 0) {
      query = query.where(notInArray(questions.id, excludeIds));
    }
    
    const availableQuestions = await query;
    
    if (availableQuestions.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }

  async getQuestionsByCategory(category: string, limit = 10): Promise<Question[]> {
    const categoryQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.category, category))
      .limit(limit);
    
    return categoryQuestions;
  }

  async getAllQuestions(): Promise<Question[]> {
    return await db.select().from(questions);
  }

  async addQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }
}

export const storage = new DatabaseStorage();
