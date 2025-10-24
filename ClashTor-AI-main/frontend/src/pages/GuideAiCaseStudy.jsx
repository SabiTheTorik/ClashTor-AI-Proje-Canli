import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuideAiCaseStudy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başa dön linki */}
        <Link 
          to="/guides" 
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm Rehberlere Geri Dön
        </Link>
        
        {/* Makale Kartı */}
        <Card className="shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader>
            {/* Makale Başlığı */}
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Clashtor AI Analizi: Neden "Alev Topu" Yerine "Buz Ruhu" Önerildi?
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Kategori: <strong>Site Özellikleri</strong></span>
              <span>Yazılma Tarihi: <strong>24 Ekim 2025</strong></span>
            </div>
          </CardHeader>

          <CardContent>
            {/* Makale İçeriği (SEO için optimize edildi) */}
            <div className="prose dark:prose-invert max-w-none space-y-6 text-lg">
              <p className="lead text-xl">
                Clashtor AI analizörünü kullanan bazı oyuncular, yapay zekanın önerdiği değişiklikleri ilk başta garipseyebilir. "Neden 4 iksirlik güçlü Alev Topu kartımı çıkarıp yerine 1 iksirlik Buz Ruhu'nu önerdi?" Bu, sık karşılaştığımız bir sorudur ve yapay zekamızın felsefesini açıklamak için harika bir örnektir.
              </p>

              <h2>Vaka İncelemesi: Analiz Edilen Deste</h2>
              <p>
                Kullanıcımızın analiz için sunduğu deste, ortalama 4.1 iksir maliyetine sahip bir "PEKKA Köprü Spam" varyasyonuydu. Deste şu kartları içeriyordu: PEKKA, Savaş Koçbaşı, Büyülü Okçu, Elektro Büyücü, Hayalet, Alev Topu, Çarpma ve Barbar Varili.
              </p>
              <p>
                Yapay zeka, bu oyuncunun son maçlarını incelediğinde iki temel sorun tespit etti:
              </p>
              <ol>
                <li>Deste, "Domuz Binicisi 2.6" veya "Madenci Kontrol" gibi hızlı döngü destelerine karşı sürekli olarak iksirde geri düşüyordu.</li>
                <li>Oyuncu, savunma için PEKKA'ya (7 iksir) veya Büyülü Okçu'ya (4 iksir) güvenmek zorunda kalıyor, ancak bu kartlar eline yeterince hızlı gelmiyordu.</li>
              </ol>

              <h3>Sorun: Yüksek İksir Maliyeti ve Yavaş Döngü</h3>
              <p>
                4.1'lik ortalama iksir maliyeti, bir "Köprü Spam" destesi için fazlasıyla yüksektir. Bu tür desteler, rakibi sürekli baskı altında tutmak için kartlarını hızlıca "çevirebilmelidir" (cycle). Alev Topu (4 iksir) güçlü bir büyü olsa da, destenin zaten yavaş olan döngüsünü daha da yavaşlatıyordu.
              </p>
              <p>
                Rakip 4 iksirlik Domuz Binicisi oynadığında, kullanıcımız savunma için elinde PEKKA (7 iksir) veya Elektro Büyücü (4 iksir) dışında ucuz bir seçenek bulamıyordu. Bu da sürekli olarak "negatif iksir takası" yapmasına neden oluyordu.
              </p>

              <h2>Çözüm: 1 İksirlik Kartın Gücü</h2>
              <p>
                Yapay zeka, "Alev Topu" yerine "Buz Ruhu" önererek iki şeyi hedefledi:
              </p>
              
              <h4>1. Deste Döngüsünü Hızlandırmak</h4>
              <p>
                Alev Topu'nu (4 iksir) çıkarıp Buz Ruhu'nu (1 iksir) eklemek, destenin ortalama iksir maliyetini 3.8'e düşürdü. Bu 0.3'lük azalma, kağıt üzerinde küçük görünse de, oyun içinde devasa bir fark yaratır. Bu değişiklik sayesinde oyuncu, PEKKA veya Savaş Koçbaşı gibi anahtar kartlarına çok daha hızlı bir şekilde geri dönebilir hale geldi.
              </p>

              <h4>2. Ucuz ve Etkili Savunma</h4>
              <p>
                Buz Ruhu, 1 iksire inanılmaz bir değer sunar. Rakibin Domuz Binicisini 1.5 saniyeliğine dondurarak kulenizin ona bir kez daha vurmasını sağlar. İskelet Ordusu'nu veya Yarasaları durdurabilir. Elektro Büyücü ile birleştiğinde, Mini PEKKA gibi büyük tehditleri bile kolayca savunabilir. Oyuncuya, Domuz Binicisi gibi tehditlere karşı 4 iksir (Alev Topu) yerine 1 iksir (Buz Ruhu) harcayarak savunma yapma esnekliği kazandırdı. Bu da +3 iksir avantajı demektir.
              </p>

              <h3>Sonuç: Clashtor AI Felsefesi</h3>
              <p>
                Clashtor AI'ın amacı size "metadaki en iyi desteyi" kopyalatmak değildir. Amacımız, *sizin oyun tarzınıza* ve *sizin destenize* bakarak, onu daha verimli hale getirecek küçük ve stratejik değişiklikler önermektir.
              </p>
              <p>
                Bazen bir destenin ihtiyacı olan şey daha fazla hasar (Alev Topu) değil, daha fazla hız ve esnekliktir (Buz Ruhu). Yapay zekamız, bu ince nüansları tespit etmek ve size rekabet avantajı sağlamak için eğitilmiştir. Analizörümüzü kullanarak kendi destenizdeki gizli potansiyeli keşfedebilirsiniz.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};