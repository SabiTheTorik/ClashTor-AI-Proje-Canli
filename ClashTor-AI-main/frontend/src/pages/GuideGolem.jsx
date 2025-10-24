import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuideGolem = () => {
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
                Clash Royale Meta Rehberi: Golem Desteleri Nasıl Oynanır?
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Kategori: <strong>Strateji</strong></span>
              <span>Yazılma Tarihi: <strong>24 Ekim 2025</strong></span>
            </div>
          </CardHeader>

          <CardContent>
            {/* Makale İçeriği (SEO için optimize edildi) */}
            <div className="prose dark:prose-invert max-w-none space-y-6 text-lg">
              <p className="lead text-xl">
                Golem desteleri, Clash Royale'deki en korkutucu "Beatdown" (ağır saldırı) stratejilerinden biridir. Yüksek iksir maliyetine rağmen, doğru oynandığında durdurulması neredeyse imkansız olan devasa bir saldırı gücü oluştururlar. Bu rehberde, Golem destelerinin temellerini, kilit kartlarını ve oyun planını detaylıca inceleyeceğiz.
              </p>

              <h2>Golem Stratejisinin Temel Felsefesi</h2>
              <p>
                Golem oynamanın temeli sabırdır. 8 İksirlik maliyetiyle Golem, oyundaki en pahalı tanktır. Bu destenin felsefesi, oyunun ilk dakikalarında (x1 İksir) savunma yapmak, küçük iksir avantajları elde etmek ve rakibin destesini öğrenmektir. Asıl hamle, x2 (ve özellikle x3) İksir başladığında yapılır.
              </p>
              <p>
                "Beatdown" stratejisi, bilerek kulenizden bir miktar hasar almayı (hatta bazen bir kuleyi feda etmeyi) göze alarak, rakibin savunamayacağı kadar büyük bir saldırı (push) oluşturmak anlamına gelir. Golem'i kral kulenizin arkasından bıraktığınızda, köprüye ulaşana kadar biriken 10 iksir ile onu desteklersiniz.
              </p>

              <h3>Kilit Destek Kartları: Golem'in Arkadaşları</h3>
              <p>
                Golem tek başına bir hiçtir. Onu durdurmak kolaydır. Asıl gücü, arkasındaki destek birliklerinden gelir.
              </p>
              <ul>
                <li><strong>Gece Cadısı (Night Witch):</strong> Golem ile mükemmel bir sinerjiye sahiptir. Golem tanklarken, Gece Cadısı yarasalarıyla hava ve kara savunması sağlar. Öldüğünde bıraktığı yarasalar ise hasara devam eder.</li>
                <li><strong>Bebek Ejderha (Baby Dragon):</strong> Golem'in en büyük düşmanları olan Minyon Sürüsü veya İskelet Ordusu gibi "swarm" (sürü) birimlerini temizlemek için idealdir. Alan hasarı (splash) verir ve uçar.</li>
                <li><strong>Oduncu (Lumberjack):</strong> Golem'e yaklaşan tank katillerini (Pekka, Mini Pekka) hızla eritir. Öldüğünde bıraktığı "Öfke Büyüsü", Golem'i ve arkasındaki tüm destek birliklerini hızlandırarak saldırıyı ölümcül hale getirir.</li>
                <li><strong>Büyüler (Kasırga, Yıldırım):</strong> Kasırga (Tornado), rakip savunmacıları Golem'in patlama hasarına veya Bebek Ejderha'nın alan hasarına çekmek için kullanılır. Yıldırım (Lightning) ise Cehennem Kulesi (Inferno Tower) gibi baş belası savunma binalarını sıfırlamak için kritiktir.</li>
              </ul>

              <h2>Oyun Planı: Dakika Dakika Golem Nasıl Oynanır?</h2>
              
              <h3>İlk Dakika (x1 İksir): Sabır ve Savunma</h3>
              <p>
                <strong>ASLA</strong> ilk dakikada, elinizde Golem olsa bile, oynamayın. Rakibiniz diğer hattan hızlı bir saldırı (Domuz Binicisi + Goblinler gibi) yaparsa, 8 iksir harcadığınız için cevap veremez ve kulenizi kaybedersiniz. Bu dakikalarda sadece savunun. Gece Cadısı'nı savunmada kullanın, Bebek Ejderha ile minyonları temizleyin.
              </p>

              <h3>İkinci Dakika (x2 İksir): Saldırıyı Başlatma</h3>
              <p>
                Çift iksir başladığında, doğru anı kollayın. İksiriniz 10'a ulaştığında, Golem'i kral kulenizin *arkasından* bırakın. Bu size, Golem köprüye yürürken 7-8 iksir daha biriktirme zamanı tanır. Rakibiniz panikleyip diğer hattan saldırırsa, onu minimum iksirle savunun (örn: 4 iksirlik Domuz Binicisine karşı 4 iksirlik Oduncu). Golem'in canı çoktur, biraz beklemesinde sakınca yok.
              </p>

              <h3>Son Dakika ve Uzatma (x3 İksir): Yıkım Zamanı</h3>
              <p>
                Golem köprüyü geçtiğinde, biriken iksirinizle destek kartlarınızı (Gece Cadısı, Bebek Ejderha) arkasına ekleyin. Rakibiniz Cehennem Kulesi koyarsa Yıldırım ile sıfırlayın. İskelet Ordusu atarsa Kasırga ile Bebek Ejderha'nın önüne çekin. Bu noktada amaç, rakibi iksirde boğmaktır.
              </p>

              <h2>Golem'e Karşı Nasıl Oynanır? (Counter İpuçları)</h2>
              <ul>
                <li><strong>Cehennem Kulesi/Ejderhası:</strong> Golem'in en büyük düşmanıdır. Elinizde Yıldırım, Çarpma (Zap) veya Elektro Büyücü yoksa Golem'iniz hızla erir.</li>
                <li><strong>Pekka:</strong> Pekka, Golem'i çok hızlı keser. Ancak Pekka'yı Golem'den uzak tutmak için araya İskeletler veya Oduncu gibi kartlar atarak dikkatini dağıtabilirsiniz.</li>
                <li><strong>Zıt Hat Saldırısı:</strong> Rakibiniz Golem'i arkadan bıraktığında, elinizdeki en hızlı saldırı kartlarıyla (Domuz Binicisi, Savaş Koçbaşı, Elit Barbarlar) diğer hattan saldırmak, Golem oyuncusunun planını bozmanın en iyi yoludur.</li>
              </ul>

              <h3>Sonuç: Golem Oynamak Bir Sanattır</h3>
              <p>
                Golem destesi, yüksek risk ve yüksek ödül sunar. İksir yönetimi ve sabır bu destenin anahtarıdır. Eğer ağır, yavaş ve yıkıcı saldırıları seviyorsanız, Golem destesi tam size göre. Clashtor AI aracımızı kullanarak kendi Golem destenizin zayıflıklarını analiz etmeyi unutmayın!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};