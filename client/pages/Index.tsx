import {
  Search,
  ShoppingCart,
  Star,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Header Bar */}
      <div className="bg-primary-dark py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6 text-primary-accent">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>0096550153100</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@takhtitcode.com</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Facebook className="w-4 h-4 text-primary-accent hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 text-primary-accent hover:text-white cursor-pointer transition-colors" />
            <Youtube className="w-4 h-4 text-primary-accent hover:text-white cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 text-primary-accent hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-primary-dark text-white px-4 py-2 rounded-lg font-bold text-xl">
              تخطيط كود
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-text-primary hover:text-primary-dark font-medium transition-colors"
            >
              الرئيسية
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              من نحن
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              الخدمات
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              المتجر
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              تواصل معنا
            </a>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <Input
                placeholder="ابح�� عن المنتجات..."
                className="w-64 rounded-l-none"
              />
              <Button className="bg-primary-green hover:bg-primary-green/90 rounded-r-none px-4">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -left-2 bg-primary-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                0
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[600px] bg-gradient-to-br from-primary-dark via-primary-dark/90 to-primary-blue/20 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-white">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                حلول برمجية
                <br />
                <span className="text-primary-accent">متطورة ومبتكرة</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                نحن نقدم أفضل الحلول التقنية والبرمجية لتطوير أعمالك ونقلها إلى
                المستوى التالي من خلال تقنيات حديثة ومتطورة
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary-accent text-primary-dark hover:bg-primary-accent/90 font-semibold"
                >
                  ابدأ مشروعك الآن
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-dark"
                >
                  تعرف على خدماتنا
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-primary-dark">
              خدماتنا
            </h2>
            <p className="text-text-secondary text-lg mb-12">
              نقدم مجموعة شاملة من الخدمات التقنية المتميزة
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card-light rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-primary-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-primary-green" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-dark">
                  تطوير المواقع
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  تصميم وتطوير مواقع احترافية متجاوبة مع جميع الأجهزة باستخدام
                  أحدث التقنيات
                </p>
              </div>

              <div className="bg-card-light rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-primary-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-dark">
                  المتاجر الإلكترونية
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  بناء متاجر إلكترونية متطورة مع أنظمة دفع آمنة وإدارة متكاملة
                  للمنتجات
                </p>
              </div>

              <div className="bg-card-light rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-primary-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-primary-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-dark">
                  التطبيقات المحمولة
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  تطوير تطبيقات محمولة متطورة لأنظمة iOS و Android بأعلى معايير
                  الجودة
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products/Portfolio Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-primary-dark">
              أعمالنا المميزة
            </h2>
            <p className="text-text-secondary text-lg mb-12">
              مجموعة من أفضل مشاريعنا المنجزة
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-blue to-primary-green"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-primary-dark">
                    متجر إلكتروني متطور
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    منصة ت��ارة إلكترونية شاملة مع نظام إدارة متقدم
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary-accent fill-current" />
                      <span className="text-sm text-text-secondary">
                        تم التقييم
                      </span>
                    </div>
                    <span className="text-primary-blue font-semibold">
                      مشروع مكتمل
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-accent to-primary-green"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-primary-dark">
                    تطبيق محمول
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    تطبيق محمول متطور مع واجهة مستخدم عصرية
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary-accent fill-current" />
                      <span className="text-sm text-text-secondary">
                        تم التقييم
                      </span>
                    </div>
                    <span className="text-primary-blue font-semibold">
                      مشروع مكتمل
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-dark to-primary-blue"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-primary-dark">
                    موقع شركة
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    موقع ��حترافي لشركة تقنية مع تصميم عصري
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary-accent fill-current" />
                      <span className="text-sm text-text-secondary">
                        تم التقييم
                      </span>
                    </div>
                    <span className="text-primary-blue font-semibold">
                      مشروع مكتمل
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-primary-dark">
                  لماذا تختارنا
                </h2>
                <div className="grid gap-6">
                  <div className="bg-card-light rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary-dark">
                      رؤيتنا
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      أن نكون الشريك التقني الأول للشركات في المنطقة من خلال
                      تقديم حلول برمجية مبتكرة ومتطورة
                    </p>
                  </div>
                  <div className="bg-card-light rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary-dark">
                      مهمتنا
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      تمكين الشركات من النجاح في العصر الرقمي من خلال حلول تقنية
                      عالية الجودة وخدمة عملاء متميزة
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-green text-white rounded-full p-2 mt-1">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-2">
                      خبرة واسعة
                    </h4>
                    <p className="text-text-secondary">
                      أكثر من 10 سنوات من الخبرة في تطوير الحلول التقنية
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-blue text-white rounded-full p-2 mt-1">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-2">
                      جودة عالية
                    </h4>
                    <p className="text-text-secondary">
                      نلتزم بأع��ى معايير الجودة في جميع مشاريعنا
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-accent text-primary-dark rounded-full p-2 mt-1">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-2">
                      دعم مستمر
                    </h4>
                    <p className="text-text-secondary">
                      نقدم دعماً فنياً مستمراً لضمان نجاح مشروعك
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">جاهز لبدء مشروعك؟</h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              لا تتردد في التواصل معنا لمناقشة فكرتك وتحويلها إلى حقيقة رقمية
              متميزة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-accent text-primary-dark hover:bg-primary-accent/90 font-semibold"
              >
                تواصل معنا الآن
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-dark"
              >
                احصل على عرض سعر
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="bg-primary-accent text-primary-dark px-4 py-2 rounded-lg font-bold text-xl mb-6 inline-block">
                تخطيط كود
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                شركة رائدة في مجال تطوير الحلول البرمجية والتقنية، نقدم خدمات
                متميزة لمساعدة الشركات على التطور والنمو في العصر الرقمي
              </p>
              <div className="space-y-2 text-gray-300">
                <p>الرياض، المملكة العربية السعودية</p>
                <p>+966550153100</p>
                <p>info@takhtitcode.com</p>
              </div>
            </div>

            <div>
              <h3 className="text-primary-accent text-lg font-semibold mb-6">
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    من نحن
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    الخدمات
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    أعمالنا
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary-accent text-lg font-semibold mb-6">
                روابط مهمة
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    شروط الاستخدام
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-primary hover:text-white transition-colors"
                  >
                    الدعم الفني
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 تخطيط كود، جميع الحقوق محفوظة
            </p>
            <div className="flex items-center gap-4">
              <Facebook className="w-5 h-5 text-primary-accent hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-primary-accent hover:text-white cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-primary-accent hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-primary-accent hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed Elements */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="secondary"
          size="sm"
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          <Globe className="w-4 h-4 ml-2" />
          العربية
        </Button>
      </div>
    </div>
  );
}
