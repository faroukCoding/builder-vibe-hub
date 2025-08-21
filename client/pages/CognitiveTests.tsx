import {
  ArrowLeft,
  Brain,
  Eye,
  Palette,
  Shapes,
  Car,
  Heart,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Volume2,
  Home,
  Star,
  Shirt,
  Apple,
  Carrot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

// =============================================================================
// DATA DEFINITIONS
// =============================================================================

interface TestItem {
  id: number;
  name: string;
  src: string;
  category: string;
}

interface TestSession {
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  currentQuestion: number;
  isTestActive: boolean;
  testType: string;
}

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

// =============================================================================
// IMAGE CATEGORIES - PROPERLY ORGANIZED BY ACTUAL CONTENT
// =============================================================================

const IMAGE_CATEGORIES = {
  // الملابس والإكسسوارات
  clothes: [
    {
      id: 1,
      name: "بدلة رسمية",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5581dd13e7614e508185741483efb417?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 2,
      name: "ربطة عنق",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F97cdfa6b148a494db9f6899c1d766e47?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 3,
      name: "وشاح شتوي",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fbd9717ee86334f08a792864780f53887?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 4,
      name: "قفازات",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F56f902a4cc1343e0970ecf447c54ffef?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 5,
      name: "��ذاء ر��اضي",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F22a372c46a5240b3a6a530be95dfe12d?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 6,
      name: "جوارب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F0fa7216b9e704dcf8ed2fa71dcc0b4f9?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 7,
      name: "تنورة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fadebd9eb74c2414b9dba46679536a966?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 8,
      name: "فستان",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fccd949c8a80d424d85f64dca3ce8d1bd?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 9,
      name: "قبعة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F6fd23237e667429f8fb3ae7bd71eaf96?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 10,
      name: "جاكيت",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fccabfd5123524d85b0ab3000f4d4c545?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 11,
      name: "بنطلون",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fe29382794879491384e2df520674e988?format=webp&width=800",
      category: "ملابس"
    },
    {
      id: 12,
      name: "قميص",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa4a6d473f5fb43f18d40b4df6568691f?format=webp&width=800",
      category: "ملابس"
    }
  ],

  // الخضروات - مصححة حسب المحتوى الفعلي
  vegetables: [
    {
      id: 1,
      name: "خيار",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F8691ed83b7434d08af3374ff5b93824d?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 2,
      name: "جزر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb986297ad7c349daa4bc4cc1d97085cc?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 3,
      name: "طماطم",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F91d60d50f8f6461f94db54d5f81265be?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 4,
      name: "بصل",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F793222dcb33f4642aa6253c90cdc392f?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 5,
      name: "ثوم",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F7027cc0b30f646c5a264be0f71a4a0a0?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 6,
      name: "باذنجان",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F16a8fb132bf941c5b78d0b83afc9fe49?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 7,
      name: "فلفل أخضر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F8b298b7119ee460c9636216d7db59a9d?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 8,
      name: "فطر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fe294ceefdadb4d4ea175c8c7df4efa86?format=webp&width=800",
      category: "خضروات"
    },
    {
      id: 9,
      name: "بطاطس",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F934953a939b3429f80e24ef402339e6a?format=webp&width=800",
      category: "خضروات"
    }
  ],

  // الفواكه - مصححة حسب المحت��ى الفعلي
  fruits: [
    {
      id: 1,
      name: "عنب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F4fac31da6fc6430ea785b18a04e9619b?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 2,
      name: "كرز",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F99f30099d7ba407982ae098eea98bd0a?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 3,
      name: "موز",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fc6452635bcb5423f91f73be23e069129?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 4,
      name: "أناناس",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fe9b45c0781994f3e8c301e466cc3afdb?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 5,
      name: "برتقال",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa0a8a1743a044678a5788cb781fd3f14?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 6,
      name: "عنب أحمر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F113bbc8fdbdb4ef5a2fdf650f3940739?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 7,
      name: "فراولة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb64e31c417f34adc942b7514c3e38602?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 8,
      name: "تفاح",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F546b00f6c81947f7bc5e2bffee0fb0ff?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 9,
      name: "ليمون",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F1aaffded6b2c4bd2ae5a436345e5796a?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 10,
      name: "خوخ",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa86743cc0a724321bb57fcda1d55852f?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 11,
      name: "عنب أخضر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F94022a0bd4ff4e6d84a625bdf37ef5a6?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 12,
      name: "بطيخ",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fc8f96384f92e4b34ad6ee861050ceb3f?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 13,
      name: "تمر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F6105aeeac2c34b0dbc7e9a6ebd2dd90b?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 14,
      name: "توت",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Ff2d501123a604a018594aabd1856707e?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 15,
      name: "رمان",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F7c2d1ef2ba1449ea8fa3d2e1dcaaed18?format=webp&width=800",
      category: "فواكه"
    },
    {
      id: 16,
      name: "مشمش",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fcd138451db15487498db4ddcc3cc5e2c?format=webp&width=800",
      category: "فواكه"
    }
  ],

  // الحيوانات (الموجودة مسبقاً)
  animals: [
    {
      id: 1,
      name: "أسد",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F98a7789d43744a46988dda779122f2dc?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 2,
      name: "نمر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5d5d832e02ec4a92a62b029ff20388a6?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 3,
      name: "دب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F25d2db6beec64c938f1b3f106525863e?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 4,
      name: "ثعلب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Ff9da0592a9534bcbb8b8ec0fa3700363?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 5,
      name: "زرافة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F6932171555a342309126302e012c11d3?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 6,
      name: "ذئب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F18ff4c13294840f49ef57311d63b3d67?format=webp&width=800",
      category: "حي��انات"
    },
    {
      id: 7,
      name: "ديك",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F85d6f143bfd542af91bc9e23c31bce0d?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 8,
      name: "جمل",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F81ed82645a254678b25be28d54b0b66b?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 9,
      name: "بطة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb8383ff406544f75a5888bd2613d9e49?format=webp&width=800",
      category: "حي��انات"
    },
    {
      id: 10,
      name: "دجاجة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fdb7fb90da95846b98bf4c482240cd189?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 11,
      name: "حصان",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5523aa9398b14586bca9bffd1ff4b325?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 12,
      name: "حمار",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb107c72f7a1645299f3e5c23a9b04b8f?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 13,
      name: "أرنب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F70b43ed85183406481a3d760811c6416?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 14,
      name: "بقرة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F81b10719ec974592adcf3ef1fd740e75?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 15,
      name: "خروف",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F2027cb53fd2846e1b16b0fafc4d85cc9?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 16,
      name: "كلب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F1def7d453ce04c81a7e7e97df6e2fd50?format=webp&width=800",
      category: "حيوانات"
    },
    {
      id: 17,
      name: "قطة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5d5d832e02ec4a92a62b029ff20388a6?format=webp&width=800",
      category: "حيوا��ات"
    }
  ],

  // المركبات
  vehicles: [
    {
      id: 1,
      name: "طائرة هليكوبتر",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fdbe4a29629e1473a96ed091dd66f1950?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 2,
      name: "سيارة إطفاء",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Ff2add4a77dbb4d8abae8b7621e504230?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 3,
      name: "جرار زراعي",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa9187d2671754e51943af7947d02ae30?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 4,
      name: "سيارة إسعاف",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5272a8084f114b36be05e3435795b5b1?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 5,
      name: "شاحنة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F18ebe955ad0b49eeaf3b47acc5d31af1?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 6,
      name: "دراجة نارية",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F57f0bef6a1c144ea967dd6843b6bccd6?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 7,
      name: "دراجة هوائية",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F79b66164ae24496daae69e1995a04783?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 8,
      name: "ترام",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fca56b6f9185f43ff85df99fc195db0f7?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 9,
      name: "سفينة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fd87d5df245b343c195098269b0394b9f?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 10,
      name: "حافلة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb8fe0a7b5baf4a8abbba37cbe393790d?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 11,
      name: "طائرة",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fcba25725a99c48688321df072fd908c1?format=webp&width=800",
      category: "مركبات"
    },
    {
      id: 12,
      name: "سيارة جيب",
      src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F3a190ff018184a3b98882ae31cba1f9b?format=webp&width=800",
      category: "مركبات"
    }
  ]
};

// =============================================================================
// OTHER DATA CATEGORIES
// =============================================================================

const COLORS = [
  { name: "أحمر", color: "#ef4444", rgb: "239,68,68" },
  { name: "أزرق", color: "#3b82f6", rgb: "59,130,246" },
  { name: "أخضر", color: "#22c55e", rgb: "34,197,94" },
  { name: "أصفر", color: "#eab308", rgb: "234,179,8" },
  { name: "برتقالي", color: "#f97316", rgb: "249,115,22" },
  { name: "بنفسجي", color: "#a855f7", rgb: "168,85,247" },
  { name: "وردي", color: "#ec4899", rgb: "236,72,153" },
  { name: "بني", color: "#a3a3a3", rgb: "163,163,163" }
];

const NUMBERS = [
  { number: 1, name: "واحد", symbol: "١" },
  { number: 2, name: "اثنان", symbol: "٢" },
  { number: 3, name: "ثلاثة", symbol: "٣" },
  { number: 4, name: "أربعة", symbol: "٤" },
  { number: 5, name: "خمسة", symbol: "٥" },
  { number: 6, name: "ستة", symbol: "٦" },
  { number: 7, name: "سبعة", symbol: "٧" },
  { number: 8, name: "ثمانية", symbol: "٨" },
  { number: 9, name: "تسعة", symbol: "٩" },
  { number: 10, name: "عشرة", symbol: "١٠" }
];

const SHAPES = [
  { name: "دائرة", type: "circle", description: "شكل دائري" },
  { name: "مربع", type: "square", description: "شكل بأربعة أضلاع متساوية" },
  { name: "مثلث", type: "triangle", description: "شكل بثلاثة أضلاع" },
  { name: "مستطيل", type: "rectangle", description: "شكل بأربعة أضلاع مستطيل" },
  { name: "نجمة", type: "star", description: "شكل نجمة" },
  { name: "قلب", type: "heart", description: "شكل قلب" },
  { name: "معين", type: "diamond", description: "شكل معين" },
  { name: "بيضاوي", type: "oval", description: "شكل بيضاوي" }
];

const BODY_PARTS = [
  { name: "عين", emoji: "👁️", category: "وجه" },
  { name: "أنف", emoji: "👃", category: "وجه" },
  { name: "فم", emoji: "👄", category: "وجه" },
  { name: "أذن", emoji: "👂", category: "وجه" },
  { name: "يد", emoji: "✋", category: "أطراف" },
  { name: "قدم", emoji: "🦶", category: "أطراف" },
  { name: "رأس", emoji: "🗣️", category: "جسم" },
  { name: "بطن", emoji: "🫃", category: "جسم" },
  { name: "ظهر", emoji: "🫲", category: "جسم" },
  { name: "ركبة", emoji: "🦵", category: "أطراف" }
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CognitiveTests() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState("menu");
  const [testSession, setTestSession] = useState<TestSession>({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isTestActive: false,
    testType: ""
  });
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // واجهة التحقق من الصور
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [currentVerificationIndex, setCurrentVerificationIndex] = useState(0);
  const [verificationData, setVerificationData] = useState<{item: TestItem, originalCategory: string}[]>([]);
  const [correctedImages, setCorrectedImages] = useState<TestItem[]>([]);

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
    }
  };

  // =============================================================================
  // IMAGE VERIFICATION FUNCTIONS
  // =============================================================================

  const startImageVerification = () => {
    const allImages: {item: TestItem, originalCategory: string}[] = [];

    Object.entries(IMAGE_CATEGORIES).forEach(([categoryKey, items]) => {
      items.forEach(item => {
        allImages.push({ item, originalCategory: categoryKey });
      });
    });

    setVerificationData(allImages);
    setCurrentVerificationIndex(0);
    setIsVerificationMode(true);
    setCorrectedImages([]);
  };

  const handleImageCorrection = (correctedItem: TestItem, newCategory: string) => {
    const updatedItem = { ...correctedItem, category: newCategory };
    setCorrectedImages(prev => [...prev, updatedItem]);

    if (currentVerificationIndex < verificationData.length - 1) {
      setCurrentVerificationIndex(prev => prev + 1);
    } else {
      // انتهاء التحقق
      setIsVerificationMode(false);
      alert(`تم الانتهاء من التحقق! تم تصحيح ${correctedImages.length + 1} صورة.`);
    }
  };

  const skipImageVerification = () => {
    if (currentVerificationIndex < verificationData.length - 1) {
      setCurrentVerificationIndex(prev => prev + 1);
    } else {
      setIsVerificationMode(false);
      alert(`تم الانتهاء من التحقق! تم تصحيح ${correctedImages.length} صورة.`);
    }
  };

  const handleAnswer = (selectedAnswer: string, correctAnswer: string, questionText: string) => {
    if (!testSession.isTestActive) return;

    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      setFeedback({ type: 'success', message: 'ممتاز! إجابة صحيحة!' });
      setTestSession(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: prev.currentQuestion + 1
      }));
      playAudio('ممتاز! إجابة صحيحة!');
    } else {
      setFeedback({ type: 'error', message: `غير صحيح. الإجابة الصحيحة هي: ${correctAnswer}` });
      setTestSession(prev => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: prev.currentQuestion + 1
      }));
      playAudio(`غير صحيح. الإجابة الصحيحة هي ${correctAnswer}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (testSession.currentQuestion >= 10) {
        endTest();
      }
    }, 3000);
  };

  const startTest = (testType: string) => {
    setTestSession({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      currentQuestion: 1,
      isTestActive: true,
      testType
    });
    setCurrentTest(testType);
  };

  const endTest = () => {
    setTestSession(prev => ({ ...prev, isTestActive: false }));
  };

  const resetTest = () => {
    setTestSession({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      currentQuestion: 1,
      isTestActive: false,
      testType: ""
    });
    setCurrentTest("menu");
    setFeedback(null);
  };

  // =============================================================================
  // REUSABLE TEST COMPONENT
  // =============================================================================

  const ImageRecognitionTest = ({
    category,
    categoryArabic,
    question,
    images,
    testType,
    color
  }: {
    category: string;
    categoryArabic: string;
    question: string;
    images: TestItem[];
    testType: string;
    color: string;
  }) => {
    const [currentItem, setCurrentItem] = useState<TestItem | null>(null);
    const [options, setOptions] = useState<TestItem[]>([]);

    const generateQuestion = () => {
      const randomItem = images[Math.floor(Math.random() * images.length)];
      const wrongOptions = images
        .filter(item => item.id !== randomItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomItem, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentItem(randomItem);
      setOptions(allOptions);
      playAudio(question);
    };

    if (testSession.isTestActive && !currentItem && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار {categoryArabic}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest(testType)} className={`bg-${color}-600 hover:bg-${color}-700`}>
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
              <Button onClick={resetTest} variant="outline">
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">اختبار التعرف على {categoryArabic}</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentItem && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={currentItem.src}
                  alt={currentItem.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">{question}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentItem.name, question);
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // =============================================================================
  // TEST COMPONENTS
  // =============================================================================

  const ClothesRecognitionTest = () => (
    <ImageRecognitionTest
      category="clothes"
      categoryArabic="الملابس"
      question="ما اسم هذه القطعة من الملابس؟"
      images={IMAGE_CATEGORIES.clothes}
      testType="clothes"
      color="indigo"
    />
  );

  const VegetablesRecognitionTest = () => (
    <ImageRecognitionTest
      category="vegetables"
      categoryArabic="الخضروات"
      question="ما اسم هذه الخضروات؟"
      images={IMAGE_CATEGORIES.vegetables}
      testType="vegetables"
      color="green"
    />
  );

  const FruitsRecognitionTest = () => (
    <ImageRecognitionTest
      category="fruits"
      categoryArabic="الفواكه"
      question="ما اسم هذه الفاكهة؟"
      images={IMAGE_CATEGORIES.fruits}
      testType="fruits"
      color="red"
    />
  );

  const AnimalsRecognitionTest = () => (
    <ImageRecognitionTest
      category="animals"
      categoryArabic="الحيوانات"
      question="ما اسم هذا الحيوان؟"
      images={IMAGE_CATEGORIES.animals}
      testType="animals"
      color="emerald"
    />
  );

  const VehiclesRecognitionTest = () => (
    <ImageRecognitionTest
      category="vehicles"
      categoryArabic="المركبات"
      question="ما اسم هذه المركبة؟"
      images={IMAGE_CATEGORIES.vehicles}
      testType="vehicles"
      color="blue"
    />
  );

  // =============================================================================
  // OTHER TEST COMPONENTS (COLORS, NUMBERS, SHAPES, BODY PARTS)
  // =============================================================================

  const ColorRecognitionTest = () => {
    const [currentColor, setCurrentColor] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);

    const generateQuestion = () => {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const wrongOptions = COLORS
        .filter(color => color.name !== randomColor.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomColor, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentColor(randomColor);
      setOptions(allOptions);
      playAudio(`ما لون هذا المربع؟`);
    };

    if (testSession.isTestActive && !currentColor && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الألوان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('colors')} className="bg-purple-600 hover:bg-purple-700">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
              <Button onClick={resetTest} variant="outline">
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">اختبار التعرف على الألوان</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentColor && (
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300"
                  style={{ backgroundColor: currentColor.color }}
                ></div>
                <p className="text-lg font-semibold mb-4">ما لون هذا المربع؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentColor.name, "ما لون هذا المربع؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const NumberRecognitionTest = () => {
    const [currentNumber, setCurrentNumber] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);

    const generateQuestion = () => {
      const randomNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
      const wrongOptions = NUMBERS
        .filter(number => number.number !== randomNumber.number)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomNumber, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentNumber(randomNumber);
      setOptions(allOptions);
      playAudio(`ما هذا الرقم؟`);
    };

    if (testSession.isTestActive && !currentNumber && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الأرقام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('numbers')} className="bg-red-600 hover:bg-red-700">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
              <Button onClick={resetTest} variant="outline">
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">اختبار التعرف على الأرقام</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentNumber && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300 bg-white flex items-center justify-center">
                  <span className="text-8xl font-bold text-blue-600">{currentNumber.symbol}</span>
                </div>
                <p className="text-lg font-semibold mb-4">ما هذا الرقم؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentNumber.name, "ما هذا ��لرقم؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const ShapeRecognitionTest = () => {
    const [currentShape, setCurrentShape] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);

    const renderShape = (shapeType: string, size: string = 'w-32 h-32') => {
      const shapeClass = `${size} mx-auto`;

      switch (shapeType) {
        case 'circle':
          return <div className={`${shapeClass} bg-blue-500 rounded-full`}></div>;
        case 'square':
          return <div className={`${shapeClass} bg-red-500`}></div>;
        case 'triangle':
          return <div className={`${shapeClass} bg-green-500`} style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>;
        case 'rectangle':
          return <div className={`w-40 h-24 mx-auto bg-yellow-500`}></div>;
        case 'star':
          return <Star className={`${shapeClass} text-purple-500 fill-current`} />;
        case 'heart':
          return <Heart className={`${shapeClass} text-pink-500 fill-current`} />;
        case 'diamond':
          return <div className={`${shapeClass} bg-indigo-500 transform rotate-45`}></div>;
        case 'oval':
          return <div className={`w-40 h-24 mx-auto bg-orange-500 rounded-full`}></div>;
        default:
          return <div className={`${shapeClass} bg-gray-500`}></div>;
      }
    };

    const generateQuestion = () => {
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const wrongOptions = SHAPES
        .filter(shape => shape.name !== randomShape.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomShape, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentShape(randomShape);
      setOptions(allOptions);
      playAudio(`ما اسم هذا الشكل؟`);
    };

    if (testSession.isTestActive && !currentShape && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الأشكال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('shapes')} className="bg-orange-600 hover:bg-orange-700">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
              <Button onClick={resetTest} variant="outline">
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">اختبار التعرف على الأشكال</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentShape && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300 bg-white flex items-center justify-center">
                  {renderShape(currentShape.type, 'w-32 h-32')}
                </div>
                <p className="text-lg font-semibold mb-4">ما اسم هذا الشكل؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentShape.name, "ما اسم هذا الشكل؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const BodyPartsTest = () => {
    const [currentBodyPart, setCurrentBodyPart] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);

    const generateQuestion = () => {
      const randomBodyPart = BODY_PARTS[Math.floor(Math.random() * BODY_PARTS.length)];
      const wrongOptions = BODY_PARTS
        .filter(part => part.name !== randomBodyPart.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomBodyPart, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentBodyPart(randomBodyPart);
      setOptions(allOptions);
      playAudio(`ما اسم هذا الجزء من الجسم؟`);
    };

    if (testSession.isTestActive && !currentBodyPart && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار أعضاء الجسم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('bodyparts')} className="bg-teal-600 hover:bg-teal-700">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
              <Button onClick={resetTest} variant="outline">
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">اختبار التعرف على أعضاء الجسم</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentBodyPart && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300 bg-white flex items-center justify-center">
                  <span className="text-8xl">{currentBodyPart.emoji}</span>
                </div>
                <p className="text-lg font-semibold mb-4">ما اسم هذا الجزء من الجسم؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentBodyPart.name, "ما اسم هذا الجزء من الجسم؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // =============================================================================
  // MAIN MENU COMPONENT
  // =============================================================================

  const MainMenu = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">اختبارات الإدراك والمكتسبات القبلية</h1>
          <p className="text-purple-100">برنامج شامل لتقييم المهارات الإدراكية والمعرفية للأطفال</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {/* Image Recognition Tests */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-300" onClick={() => startTest('clothes')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Shirt className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الملابس</h3>
                <p className="text-gray-600 text-sm">التعرف على قطع الملابس</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              12 قطعة ملابس • صور حقيقية
            </div>
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300" onClick={() => startTest('vegetables')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Carrot className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الخضروات</h3>
                <p className="text-gray-600 text-sm">التعرف على أنواع الخضروات</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              9 أنواع خضروات • صور حقيقية
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-red-300" onClick={() => startTest('fruits')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Apple className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الفواكه</h3>
                <p className="text-gray-600 text-sm">التعرف على أنواع الفواكه</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              16 نوع فاكهة • صور حقيقية
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-emerald-300" onClick={() => startTest('animals')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الحيوانات</h3>
                <p className="text-gray-600 text-sm">التعرف على أسماء الحيوانات</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              17 حيوان • صور حقيقية
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300" onClick={() => startTest('vehicles')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">المركبات</h3>
                <p className="text-gray-600 text-sm">التعرف على أنواع المركبات</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              12 مركبة • صور حقيقية
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        {/* Basic Concepts Tests */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300" onClick={() => startTest('colors')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الألوان</h3>
                <p className="text-gray-600 text-sm">التعرف على الألوان الأساسية</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              8 ألوان أساسية • مفاهيم بصرية
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-red-300" onClick={() => startTest('numbers')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأرقام</h3>
                <p className="text-gray-600 text-sm">التعرف على الأرقام 1-10</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              الأرقام العربية 1-10 • مفاهيم عددية
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الا��تبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-300" onClick={() => startTest('shapes')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Shapes className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأشكال</h3>
                <p className="text-gray-600 text-sm">التعرف على الأشكال الهندسية</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              8 أشكال هندسية • مفاهيم مكانية
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-teal-300" onClick={() => startTest('bodyparts')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">أعضاء الجسم</h3>
                <p className="text-gray-600 text-sm">التعرف على أجزاء الجسم</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              10 أعضاء جسم • مفاهيم تشريحية
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Image Verification Section */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Eye className="w-5 h-5" />
            تحقق من صحة الصور والأسماء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            استخدم هذه الأداة لمراجعة جميع الصور والتأكد من صحة أسمائها وتصنيفها
          </p>
          <Button
            onClick={startImageVerification}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Eye className="w-4 h-4 ml-2" />
            ابدأ التحقق من الصور
          </Button>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Brain className="w-5 h-5" />
            معلومات مهمة حول الاختبارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">هدف الاختبارات:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• تقييم المكتسبات القبلية للأطفال</li>
                <li>• قياس مستوى الإدراك البصري والسمعي</li>
                <li>• تحديد نقاط القوة والضعف المعرفية</li>
                <li>• إعداد خطط العلاج المناسبة</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">معايير التقييم:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• كل اختبار يحتوي على 10 أسئلة</li>
                <li>• تغذية راجعة فورية باللغة العربية</li>
                <li>• حساب دقيق لنسبة النجاح</li>
                <li>• إمكانية إعادة الاخ��بار عدة مرات</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // =============================================================================
  // IMAGE VERIFICATION COMPONENT
  // =============================================================================

  const ImageVerification = () => {
    if (!verificationData[currentVerificationIndex]) return null;

    const { item, originalCategory } = verificationData[currentVerificationIndex];
    const progress = ((currentVerificationIndex + 1) / verificationData.length) * 100;

    const categories = [
      { key: 'clothes', name: 'ملابس', color: 'blue' },
      { key: 'vegetables', name: 'خضروات', color: 'green' },
      { key: 'fruits', name: 'فواكه', color: 'red' },
      { key: 'animals', name: 'حيوانات', color: 'yellow' },
      { key: 'vehicles', name: 'مركبات', color: 'purple' }
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                التحقق من الصور والأسماء
              </CardTitle>
              <Badge variant="outline">
                {currentVerificationIndex + 1} من {verificationData.length}
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* الصورة الحالية */}
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-lg">
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-48 h-48 object-contain rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold">الاسم المقترح: "{item.name}"</p>
                <p className="text-sm text-gray-600">الفئة الحالية: {item.category}</p>
              </div>
            </div>

            {/* أسئلة التحقق */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">هل هذه المعلومات صحيحة؟</h3>

              {/* إذا كان الاسم صحيحاً */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => skipImageVerification()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                  نعم، الاسم والفئة صحيحان
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentVerificationIndex(prev => prev + 1)}
                >
                  تحتاج تصحيح
                </Button>
              </div>

              {/* إذا كان يحتاج تصحيح */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">اختر الفئة الصحيحة:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <Button
                      key={category.key}
                      variant="outline"
                      onClick={() => {
                        const newName = prompt(`أدخل الاسم الصحيح للصورة في فئة ${category.name}:`);
                        if (newName) {
                          handleImageCorrection(
                            { ...item, name: newName },
                            category.name
                          );
                        }
                      }}
                      className="h-auto p-3 flex flex-col items-center gap-2 border-2"
                    >
                      <span className="font-semibold">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* أدوات التحكم */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentVerificationIndex > 0) {
                      setCurrentVerificationIndex(prev => prev - 1);
                    }
                  }}
                  disabled={currentVerificationIndex === 0}
                >
                  السابق
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsVerificationMode(false)}
                >
                  إيقاف التحقق
                </Button>

                <Button
                  variant="outline"
                  onClick={skipImageVerification}
                >
                  تخطي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // =============================================================================
  // RENDER LOGIC
  // =============================================================================

  const renderCurrentTest = () => {
    switch (currentTest) {
      case "clothes":
        return <ClothesRecognitionTest />;
      case "vegetables":
        return <VegetablesRecognitionTest />;
      case "fruits":
        return <FruitsRecognitionTest />;
      case "animals":
        return <AnimalsRecognitionTest />;
      case "vehicles":
        return <VehiclesRecognitionTest />;
      case "colors":
        return <ColorRecognitionTest />;
      case "numbers":
        return <NumberRecognitionTest />;
      case "shapes":
        return <ShapeRecognitionTest />;
      case "bodyparts":
        return <BodyPartsTest />;
      default:
        return <MainMenu />;
    }
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentTest === "menu") {
                    navigate('/specialist-dashboard');
                  } else {
                    resetTest();
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentTest === "menu" ? "العودة للوحة التحكم" : "القائمة الرئيسية"}
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    اختبارات الإدراك
                  </h1>
                  <p className="text-gray-600">Ortho Smart</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/specialist-dashboard')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderCurrentTest()}
      </div>
    </div>
  );
}
