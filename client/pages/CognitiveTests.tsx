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
  Apple
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function CognitiveTests() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState("menu");
  const [testSession, setTestSession] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isTestActive: false,
    testType: ""
  });
  const [feedback, setFeedback] = useState(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // بيانات الصور المرفقة - مصححة حسب المحتوى الفعلي
  const imageCategories = {
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
        name: "وشاح",
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
        name: "أحذية رياضية",
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
        name: "��ميص",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa4a6d473f5fb43f18d40b4df6568691f?format=webp&width=800",
        category: "ملابس"
      }
    ],
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
        name: "بصل أحمر",
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
    fruits: [
      {
        id: 1,
        name: "عنب مختلط",
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
        name: "توت أسود",
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
    food: [
      {
        id: 1,
        name: "خيار",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F8691ed83b7434d08af3374ff5b93824d?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 2,
        name: "جزر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb986297ad7c349daa4bc4cc1d97085cc?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 3,
        name: "طماطم",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F91d60d50f8f6461f94db54d5f81265be?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 4,
        name: "بصل",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F793222dcb33f4642aa6253c90cdc392f?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 5,
        name: "ثوم",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F7027cc0b30f646c5a264be0f71a4a0a0?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 6,
        name: "باذنجان",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F16a8fb132bf941c5b78d0b83afc9fe49?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 7,
        name: "فلفل أخضر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F8b298b7119ee460c9636216d7db59a9d?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 8,
        name: "فطر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fe294ceefdadb4d4ea175c8c7df4efa86?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 9,
        name: "بطاطس",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F934953a939b3429f80e24ef402339e6a?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 10,
        name: "عنب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F4fac31da6fc6430ea785b18a04e9619b?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 11,
        name: "كرز",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F99f30099d7ba407982ae098eea98bd0a?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 12,
        name: "موز",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fc6452635bcb5423f91f73be23e069129?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 13,
        name: "أناناس",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fe9b45c0781994f3e8c301e466cc3afdb?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 14,
        name: "برتقال",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa0a8a1743a044678a5788cb781fd3f14?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 15,
        name: "عنب أحمر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F113bbc8fdbdb4ef5a2fdf650f3940739?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 16,
        name: "فراولة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb64e31c417f34adc942b7514c3e38602?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 17,
        name: "تفاح",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F546b00f6c81947f7bc5e2bffee0fb0ff?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 18,
        name: "ليمون",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F1aaffded6b2c4bd2ae5a436345e5796a?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 19,
        name: "خوخ",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa86743cc0a724321bb57fcda1d55852f?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 20,
        name: "عنب أخضر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F94022a0bd4ff4e6d84a625bdf37ef5a6?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 21,
        name: "بطيخ",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fc8f96384f92e4b34ad6ee861050ceb3f?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 22,
        name: "تمر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F6105aeeac2c34b0dbc7e9a6ebd2dd90b?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 23,
        name: "توت",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Ff2d501123a604a018594aabd1856707e?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 24,
        name: "رمان",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F7c2d1ef2ba1449ea8fa3d2e1dcaaed18?format=webp&width=800",
        category: "طعام"
      },
      {
        id: 25,
        name: "مشمش",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fcd138451db15487498db4ddcc3cc5e2c?format=webp&width=800",
        category: "طعام"
      }
    ],
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
        category: "حيوانات"
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
        category: "حيوانات"
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
        category: "حيوانات"
      }
    ],
    vehicles: [
      {
        id: 1,
        name: "طائرة هليكو��تر",
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
        name: "سف��نة",
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

  const colors = [
    { name: "أحمر", color: "#ef4444", rgb: "239,68,68" },
    { name: "أزرق", color: "#3b82f6", rgb: "59,130,246" },
    { name: "أخضر", color: "#22c55e", rgb: "34,197,94" },
    { name: "أصفر", color: "#eab308", rgb: "234,179,8" },
    { name: "برتقالي", color: "#f97316", rgb: "249,115,22" },
    { name: "بنفسجي", color: "#a855f7", rgb: "168,85,247" },
    { name: "وردي", color: "#ec4899", rgb: "236,72,153" },
    { name: "بني", color: "#a3a3a3", rgb: "163,163,163" }
  ];

  const numbers = [
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

  const shapes = [
    { name: "دائرة", type: "circle", description: "شكل دائري" },
    { name: "مربع", type: "square", description: "شكل بأربعة أضلاع متساوية" },
    { name: "مثلث", type: "triangle", description: "شكل بثلاثة أضلاع" },
    { name: "مستطيل", type: "rectangle", description: "شكل بأربعة أضلاع مستطيل" },
    { name: "نجمة", type: "star", description: "شكل نجمة" },
    { name: "قلب", type: "heart", description: "شكل قلب" },
    { name: "معين", type: "diamond", description: "شكل معين" },
    { name: "بيضاوي", type: "oval", description: "شكل بيضاوي" }
  ];

  const bodyParts = [
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

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
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

  // اختبار التعرف على الحيوانات
  const AnimalRecognitionTest = () => {
    const [currentAnimal, setCurrentAnimal] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomAnimal = imageCategories.animals[Math.floor(Math.random() * imageCategories.animals.length)];
      const wrongOptions = imageCategories.animals
        .filter(animal => animal.id !== randomAnimal.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomAnimal, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentAnimal(randomAnimal);
      setOptions(allOptions);
      playAudio(`ما اسم هذا الحيوان؟`);
    };

    if (testSession.isTestActive && !currentAnimal && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الحيوانات
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
              <Button onClick={() => startTest('animals')} className="bg-green-600 hover:bg-green-700">
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
          <CardTitle className="text-center">اختبار التعرف على الحيوانات</CardTitle>
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

          {currentAnimal && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={currentAnimal.src}
                  alt={currentAnimal.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">ما اسم هذا الحيوان؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentAnimal.name, "ما اسم هذا الحيوان؟");
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

  // اختبار التعرف على ا��مركبات
  const VehicleRecognitionTest = () => {
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomVehicle = imageCategories.vehicles[Math.floor(Math.random() * imageCategories.vehicles.length)];
      const wrongOptions = imageCategories.vehicles
        .filter(vehicle => vehicle.id !== randomVehicle.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomVehicle, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentVehicle(randomVehicle);
      setOptions(allOptions);
      playAudio(`ما اسم هذه المركبة؟`);
    };

    if (testSession.isTestActive && !currentVehicle && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار المركبات
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
              <Button onClick={() => startTest('vehicles')} className="bg-blue-600 hover:bg-blue-700">
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
          <CardTitle className="text-center">اختبار التعرف على المركبات</CardTitle>
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

          {currentVehicle && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={currentVehicle.src}
                  alt={currentVehicle.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">ما اسم هذه المركبة؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentVehicle.name, "ما اسم هذه المركبة؟");
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

  // اختبار التعرف على الملابس
  const ClothesRecognitionTest = () => {
    const [currentClothes, setCurrentClothes] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomClothes = imageCategories.clothes[Math.floor(Math.random() * imageCategories.clothes.length)];
      const wrongOptions = imageCategories.clothes
        .filter(clothes => clothes.id !== randomClothes.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomClothes, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentClothes(randomClothes);
      setOptions(allOptions);
      playAudio(`ما اسم هذه القطعة من الملابس؟`);
    };

    if (testSession.isTestActive && !currentClothes && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الملابس
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
              <Button onClick={() => startTest('clothes')} className="bg-indigo-600 hover:bg-indigo-700">
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
          <CardTitle className="text-center">اختبار التعرف على الملابس</CardTitle>
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

          {currentClothes && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={currentClothes.src}
                  alt={currentClothes.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">ما اسم هذه القطعة من الملابس؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentClothes.name, "ما اسم هذه القطعة من الملابس؟");
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

  // اختبار التعرف على الطعام
  const FoodRecognitionTest = () => {
    const [currentFood, setCurrentFood] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomFood = imageCategories.food[Math.floor(Math.random() * imageCategories.food.length)];
      const wrongOptions = imageCategories.food
        .filter(food => food.id !== randomFood.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomFood, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentFood(randomFood);
      setOptions(allOptions);
      playAudio(`ما اسم هذا الطعام؟`);
    };

    if (testSession.isTestActive && !currentFood && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              م��خص اختبار الطعام
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
              <Button onClick={() => startTest('food')} className="bg-emerald-600 hover:bg-emerald-700">
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
          <CardTitle className="text-center">اختبار التعرف على الطعام</CardTitle>
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

          {currentFood && (
            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={currentFood.src}
                  alt={currentFood.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">ما اسم هذا الطعام؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentFood.name, "ما اسم هذا الطعام؟");
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

  // اختبار الألوان
  const ColorRecognitionTest = () => {
    const [currentColor, setCurrentColor] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const wrongOptions = colors
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
                />
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

  // اختبار الأرقام
  const NumberRecognitionTest = () => {
    const [currentNumber, setCurrentNumber] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
      const wrongOptions = numbers
        .filter(num => num.number !== randomNumber.number)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomNumber, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentNumber(randomNumber);
      setOptions(allOptions);
      playAudio(`ما هو هذا الرقم؟`);
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
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-8xl font-bold text-blue-600">{currentNumber.symbol}</div>
                </div>
                <p className="text-lg font-semibold mb-4">ما هو هذا الرقم؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentNumber.name, "ما هو هذا الرقم؟");
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

  // اختبار الأشكال الهندسية
  const ShapeRecognitionTest = () => {
    const [currentShape, setCurrentShape] = useState(null);
    const [options, setOptions] = useState([]);

    const renderShape = (shape) => {
      const baseStyle = "w-32 h-32";

      switch (shape.type) {
        case 'circle':
          return <div className={`${baseStyle} bg-blue-500 rounded-full`} />;
        case 'square':
          return <div className={`${baseStyle} bg-red-500`} />;
        case 'triangle':
          return <div className={`${baseStyle} bg-green-500`} style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }} />;
        case 'rectangle':
          return <div className="w-40 h-24 bg-yellow-500" />;
        case 'star':
          return <div className={`${baseStyle} bg-purple-500`} style={{
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }} />;
        case 'heart':
          return <div className={`${baseStyle} bg-pink-500`} style={{
            clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")'
          }} />;
        case 'diamond':
          return <div className={`${baseStyle} bg-orange-500`} style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }} />;
        case 'oval':
          return <div className="w-40 h-24 bg-teal-500 rounded-full" />;
        default:
          return <div className={`${baseStyle} bg-gray-500`} />;
      }
    };

    const generateQuestion = () => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const wrongOptions = shapes
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
                  {renderShape(currentShape)}
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
                      handleAnswer(option.name, currentShape.name, "ما اسم هذا الشكل��");
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

  // اختبار أعضاء الجسم
  const BodyPartsTest = () => {
    const [currentBodyPart, setCurrentBodyPart] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomBodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
      const wrongOptions = bodyParts
        .filter(part => part.name !== randomBodyPart.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [randomBodyPart, ...wrongOptions].sort(() => 0.5 - Math.random());

      setCurrentBodyPart(randomBodyPart);
      setOptions(allOptions);
      playAudio(`ما اسم هذا العضو؟`);
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
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-8xl">{currentBodyPart.emoji}</div>
                </div>
                <p className="text-lg font-semibold mb-4">ما اسم هذا العضو؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentBodyPart.name, "ما اسم هذا العضو؟");
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

  // القائمة الرئيسية
  const MainMenu = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">اختبارات الإدراك والمكتسبات القبلية</h1>
          <p className="text-purple-100">تقييم قدرات الطفل المعرفية والإدراكية</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('animals')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على الحيوانات</h3>
                <p className="text-gray-600">تقييم معرفة أسماء الحيوانات</p>
              </div>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('vehicles')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على المركبات</h3>
                <p className="text-gray-600">تقييم معرفة أسماء المركبات</p>
              </div>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('clothes')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Shirt className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على الملابس</h3>
                <p className="text-gray-600">تقييم معرفة أسماء الملابس</p>
              </div>
            </div>
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('food')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Apple className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على الطعام</h3>
                <p className="text-gray-600">تقييم معرفة أسماء الأطعمة</p>
              </div>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('colors')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف ع��ى الألوان</h3>
                <p className="text-gray-600">تقييم معرفة الألوان الأساسية</p>
              </div>
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('shapes')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Shapes className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأشكال الهندسية</h3>
                <p className="text-gray-600">تقييم معرفة الأشكال الهندسية</p>
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('numbers')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأرقام 1-10</h3>
                <p className="text-gray-600">تقييم معرفة الأرقام العربية</p>
              </div>
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('bodyparts')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">أعضاء الجسم</h3>
                <p className="text-gray-600">تقييم معرفة أجزاء الجسم</p>
              </div>
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentTest = () => {
    switch (currentTest) {
      case "animals":
        return <AnimalRecognitionTest />;
      case "vehicles":
        return <VehicleRecognitionTest />;
      case "clothes":
        return <ClothesRecognitionTest />;
      case "food":
        return <FoodRecognitionTest />;
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
