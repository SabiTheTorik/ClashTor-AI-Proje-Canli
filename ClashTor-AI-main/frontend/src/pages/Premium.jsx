import React, { useState } from 'react'; // useState'i import et
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Zap, Crown, Sparkles, AlertTriangle, X } from 'lucide-react'; // X ikonunu ekledik

export const Premium = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // --- YENİ: Modal (pop-up) penceresinin durumunu yönetmek için ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- YENİ: QR KOD RESMİNİN URL'Sİ ---
  // BURAYI KENDİ QR KOD RESMİNİN URL'Sİ İLE DEĞİŞTİR
  const QR_CODE_URL = '/garanti-qr.jpg';

  // --- YENİ: Modal penceresini açan fonksiyon ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  // --- YENİ: Modal penceresini kapatan fonksiyon ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const features = [
    'Sınırsız deste analizi',
    'Gelişmiş yapay zeka önerileri',
    'Öncelikli destek',
    'Özel meta analizleri',
    'Sınırsız analiz kaydetme',
    'Reklamsız deneyim'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 mb-6">
            <Crown className="h-4 w-4" />
            <span>Premium Plan</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">Premium'a Yükselt</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sınırsız analizlerin kilidini açın ve Clash Royale oyununuzu bir üst seviyeye taşıyın
          </p>
        </div>

        {user?.is_premium && (
          <Card className="shadow-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <p className="text-green-700 dark:text-green-400 font-medium flex items-center justify-center gap-2 text-lg">
                <Crown className="h-5 w-5" />
                Siz zaten Premium üyesiniz!
              </p>
            </CardContent>
          </Card>
        )}

        {!user?.is_premium && (
          <Card className="shadow-2xl border-2 border-yellow-500 dark:border-yellow-500 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-900 dark:to-yellow-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl" />
            
            <CardHeader className="relative text-center pb-8">
              <div className="inline-flex mx-auto p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 mb-4">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Premium Erişim</CardTitle>
              <div className="flex items-baseline justify-center gap-2">
                {/* --- DEĞİŞİKLİK 1: FİYAT GÜNCELLENDİ --- */}
                <span className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">249,99 TL</span>
                {/* "/ay" yazan span kaldırıldı */}
              </div>
              <CardDescription className="mt-2 text-base">Tek seferlik ödeme, taahhüt yok</CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-8">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-300">Önemli Bilgi</h4>
                    <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                      Ödemeyi tamamladıktan sonra, lütfen ödeme dekontunu ve siteye kayıtlı <strong>kullanıcı adınızı</strong> 
                      {/* --- KENDİ E-POSTA ADRESİNİ YAZ --- */}
                      <strong> sabi.yomtov@gmail.com</strong> e-posta adresine gönderin.
                      Hesabınız 24 saat içinde manuel olarak onaylanacaktır.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleOpenModal} // <-- DEĞİŞİKLİK 2: Fonksiyon değişti
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white text-lg py-6 shadow-xl shadow-yellow-500/25 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 group"
                >
                  <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  QR ile Ödeme Yap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/analyzer')} className="text-gray-600 dark:text-gray-400">
            Belki daha sonra
          </Button>
        </div>
      </div>

      {/* --- DEĞİŞİKLİK 3: YENİ MODAL PENCERE KODU --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal} // Dışarıya tıklayınca kapat
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 relative max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()} // İçeriye tıklayınca kapanmasın
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={handleCloseModal}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <h3 className="text-lg font-medium text-center mb-4 text-gray-900 dark:text-white">Garanti Bankası QR Kod</h3>
            
            <img 
              src={QR_CODE_URL} 
              alt="Garanti QR Kod" 
              className="w-full h-auto rounded-md border dark:border-gray-700"
            />
            
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
              Ödemeyi tamamlamak için lütfen bu QR kodu taratın.
            </p>
          </div>
        </div>
      )}
      {/* --- MODAL KODU SONU --- */}
    </div>
  );
};