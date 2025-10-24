import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuideElixir = () => {
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
                İksir Yönetimi 101: Yeni Başlayanlar İçin İpuçları
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Kategori: <strong>Temel Bilgiler</strong></span>
              <span>Yazılma Tarihi: <strong>24 Ekim 2025</strong></span>
            </div>
          </CardHeader>

          <CardContent>
            {/* Makale İçeriği (SEO için optimize edildi) */}
            <div className="prose dark:prose-invert max-w-none space-y-6 text-lg">
              <p className="lead text-xl">
                Clash Royale'de yeni bir oyuncuysanız, oyunu kazanmanın kule yıkmaktan daha fazlası olduğunu hızla fark edersiniz. Asıl savaş, ekranın altındaki mor çubukta verilir. İksir (Elixir), sizin "paranızdır". Bu rehberde, iksir yönetiminin temellerini ve "Pozitif İksir Takası"nın oyunu nasıl kazandırdığını öğreneceksiniz.
              </p>

              <h2>Pozitif İksir Takası (Positive Elixir Trade) Nedir?</h2>
              <p>
                En basit tanımıyla, rakibinizin harcadığından daha az iksir harcayarak onun kartlarını savunmaktır. Her başarılı "pozitif takas", sizi bir sonraki saldırınız için avantajlı konuma getirir. Unutmayın, Clash Royale birikim oyunudur.
              </p>
              <p>
                İşte yeni başlayanlar için en yaygın pozitif iksir takası örnekleri:
              </p>
              <ul>
                <li><strong>Örnek 1:</strong> Rakibiniz 5 iksirlik Minyon Sürüsü oynadı. Siz bu sürüyü 3 iksirlik Oklar ile tamamen temizlediniz. <strong>Sonuç: +2 İksir avantajı.</strong></li>
                <li><strong>Örnek 2:</strong> Rakibiniz 6 iksirlik İskelet Ordusu + Goblin Fıçısı (toplam 9 iksir) kombinasyonu yaptı. Siz bunları 3 iksirlik Tomruk (Log) ve 2 iksirlik Çarpma (Zap) (toplam 5 iksir) ile savundunuz. <strong>Sonuç: +4 İksir avantajı.</strong></li>
                <li><strong>Örnek 3:</strong> Rakibinizin 5 iksirlik Büyücü'sünü, kulenizin menziline girdikten sonra 1 iksirlik İskeletler ile durdurdunuz. <strong>Sonuç: +4 İksir avantajı.</strong></li>
              </ul>
              <p>
                Bu küçük avantajlar biriktikçe, rakibinizin 5 iksirlik bir saldırısına cevap verecek iksiri kalmazken, sizin elinizde 10 iksir birikmiş olur.
              </p>

              <h3>Kart Döngüsü ve İksir Maliyeti</h3>
              <p>
                Destenizin "Ortalama İksir Maliyeti" (Average Elixir Cost), oyun tarzınızı doğrudan etkiler. Clashtor AI analizörümüz de bu metriğe çok önem verir.
              </p>
              <ul>
                <li><strong>Düşük Maliyetli Desteler (örn: 2.6 Domuz Binicisi):</strong> Ortalama maliyeti 3.0'ın altında olan bu desteler, "hızlı döngü" (fast cycle) üzerine kuruludur. Amaçları, ucuz kartlarla (Buz Ruhu, İskeletler) hızla savunma yapıp, ana saldırı kartınıza (Domuz Binicisi) tekrar tekrar ulaşmaktır. İksir yönetimi burada çok hızlı olmalıdır.</li>
                <li><strong>Yüksek Maliyetli Desteler (örn: Golem, Pekka):</strong> Ortalama maliyeti 3.8'in üzerinde olan bu desteler, "ağır saldırı" (beatdown) üzerine kuruludur. Bu destelerde iksir yönetimi "sabır" gerektirir. Amaç, x2 İksir başlayana kadar pozitif takaslar yaparak iksir biriktirmektir.</li>
              </ul>

              <h2>Rakibin İksirini Saymak: Neden Önemli?</h2>
              <p>
                Profesyonel oyuncuları izlerken, sürekli olarak rakibin iksirini saydıklarını duyarsınız. Bu, geleceği görmektir.
              </p>
              <p>
                Basit bir senaryo düşünün: Rakibiniz az önce 7 iksirlik PEKKA oynadı. Bu ne anlama gelir?
              </p>
              <ol>
                <li>Rakibinizin elinde maksimum 3 iksir kaldı (10 - 7 = 3).</li>
                <li>PEKKA'yı savunmak için büyük bir harcama yapmayacak.</li>
                <li><strong>FIRSAT:</strong> Şimdi, diğer hattan 4 iksirlik Domuz Binicisi veya 5 iksirlik Prens göndermenin tam zamanıdır. Rakibinizin bu saldırıyı savunacak iksiri YOKTUR.</li>
              </ol>
              <p>
                Rakibin ne zaman "zayıf" (iksiri az) olduğunu bilmek, size bedava kule hasarı verme şansı tanır.
              </p>
              
              <h2>Agresif vs. Pasif Oyun: Ne Zaman Saldırmalı?</h2>
              <ul>
                <li><strong>x1 İksir (İlk 2 Dakika):</strong> Genellikle pasif oynama ve iksir avantajı arama zamanıdır. 10 iksirde bekleyip rakibin ilk hamlesini yapmasını beklemek (eğer sızdırma yapmıyorsanız) akıllıcadır.</li>
                <li><strong>x2 İksir (Son Dakika ve Uzatma):</strong> Oyunun hızlandığı andır. Ağır destelerin (Golem, LavaLoon) parladığı zamandır çünkü biriken iksir avantajını büyük bir saldırıya dönüştürebilirler. Hızlı desteler ise savunma yapmakta zorlanan rakibi cezalandırır.</li>
              </ul>

              <h3>Sonuç: İksir, Sizin Kaynağınızdır</h3>
              <p>
                İksiri boşa harcamayın. Her kartı bir amaç için oynayın. Sadece "kart atmış olmak için" kart oynamayın. Her zaman "Bu 3 iksiri harcıyorum, karşılığında ne alacağım?" diye düşünün. Pozitif iksir takasını alışkanlık haline getirdiğinizde, kupa kazanmaya başladığınızı göreceksiniz.
              </p>
              <p>
                Kendi destenizin iksir ortalamasının metaya uygun olup olmadığını görmek için Clashtor AI analizörümüzü kullanabilirsiniz!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};