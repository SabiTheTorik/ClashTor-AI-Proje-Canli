import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuideEvolution = () => {
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
                Kart Evrimi (Evolution) Mekanikleri: Tam Rehber
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Kategori: <strong>Güncel Meta</strong></span>
              <span>Yazılma Tarihi: <strong>24 Ekim 2025</strong></span>
            </div>
          </CardHeader>

          <CardContent>
            {/* Makale İçeriği (SEO için optimize edildi) */}
            <div className="prose dark:prose-invert max-w-none space-y-6 text-lg">
              <p className="lead text-xl">
                Clash Royale'e eklenen Kart Evrimi (Card Evolution) mekaniği, oyunun meta'sını kökten değiştirdi. Artık sadece doğru kartı oynamak yetmiyor; aynı zamanda o kartın "evrimleşmiş" halini ne zaman ve nasıl kullanacağınızı bilmek de kritik bir önem taşıyor. Bu rehberde, evrim mekaniğinin nasıl çalıştığını, "Evrim Döngüsü"nü (Evolution Cycle) ve metayı domine eden evrim kartlarını inceleyeceğiz.
              </p>

              <h2>Kart Evrimi Nedir ve Nasıl Açılır?</h2>
              <p>
                Kart Evrimi, destenizdeki belirli kartlara maç içinde geçici olarak çok güçlü yeni yetenekler veren bir sistemdir. Bir kartın evrimini açmak için "Evrim Parçacıklarına" (Evolution Shards) ihtiyacınız vardır. Bu parçacıklar, sezon dükkanından, özel görevlerden veya Seviye Yükseltme sandıklarından elde edilebilir.
              </p>
              <p>
                Bir kartın evrimini açtığınızda, o kartı destenize eklediğinizde özel bir "Evrim Yuvası"na (Evolution Slot) yerleşir. Bir destede en fazla iki adet evrim yuvası bulunur.
              </p>

              <h3>Evrim Döngüsü (Evolution Cycle) Nasıl Çalışır?</h3>
              <p>
                Bu, sistemin en stratejik parçasıdır. Bir kartın evrimleşmiş halini oynamak için, önce o kartın normal halini maç içinde belirli bir sayıda oynamalısınız. Buna "Evrim Döngüsü" denir.
              </p>
              <ul>
                <li><strong>Örnek: Evrimleşmiş İskeletler (1 Döngü):</strong> İskelet kartını destenizde bir kez oynadıktan sonra, kart elinize bir sonraki gelişinde (yani ikinci oynayışınızda) evrimleşmiş olarak gelir.</li>
                <li><strong>Örnek: Evrimleşmiş Şövalye (2 Döngü):</strong> Şövalye kartını destenizde iki kez oynadıktan sonra, kart elinize bir sonraki gelişinde (yani üçüncü oynayışınızda) evrimleşmiş olarak gelir.</li>
              </ul>
              <p>
                Bu döngü, kartı her evrimleştirdiğinizde sıfırlanır. Yani, evrimleşmiş İskeletleri oynadıktan sonra, tekrar evrimleştirmek için normal İskeletleri bir kez daha oynamanız gerekir. Bu sistemi bilmek, iksir yönetimi kadar önemlidir, çünkü rakibinizin ne zaman güçlü bir hamle yapacağını tahmin etmenizi sağlar.
              </p> {/* <-- HATA DÜZELTİLDİ: Burası </section> değil </p> olmalıydı */}

              <h2>Metayı Dominen Eden Evrim Kartları (Güncel Analiz)</h2>
              <p>
                Evrimler sürekli olarak dengeleme alsa da, bazıları meta üzerinde kalıcı bir etki bırakmıştır. İşte en güçlü evrimlerden birkaçı ve neden güçlü oldukları:
              </p>

              <h4>1. Evrimleşmiş Şövalye (Evolved Knight)</h4>
              <p>
                <strong>Neden Güçlü:</strong> Evrimleşmiş Şövalye, hareket ederken veya saldırırken %60'a varan hasar azaltma kazanır ve canı artar. Bu onu 3 iksirlik bir mini-tanktan, 7-8 iksirlik bir PEKKA kadar dayanıklı bir canavara dönüştürür. Rakip kuleye ulaştığında onu durdurmak inanılmaz zordur.
              </p>
              <p>
                <strong>Nasıl Oynanır:</strong> Genellikle savunmada kullanılır ve hayatta kalarak bir karşı saldırının ana tankı olur. Domuz Binicisi veya Madenci gibi kartlarla mükemmel bir ikili oluşturur.
              </p>

              <h4>2. Evrimleşmiş İskeletler (Evolved Skeletons)</h4>
              <p>
                <strong>Neden Güçlü:</strong> Sadece 1 iksir maliyetine rağmen, Evrimleşmiş İskeletler her saldırdıklarında yeni bir iskelet "doğurur" (spawn). Bu, durdurulmadıkları takdirde 4 iskeletin hızla 10-15 iskelete dönüşebileceği anlamına gelir. Bir Mini Pekka'yı veya Prensi saniyeler içinde çevreleyip yok edebilirler.
              </p>
              <p>
                <strong>Nasıl Oynanır:</strong> Hem savunmada (tank katili olarak) hem de hızlı döngü destelerinde rakibi bunaltmak için kullanılırlar.
              </p>

              <h4>3. Evrimleşmiş Çarpma (Evolved Zap)</h4>
              <p>
                <strong>Neden Güçlü:</strong> 2 iksirlik bu büyü, normal Çarpma'dan farklı olarak 3 kez (toplamda) vurur ve her vuruşu 0.5 saniye sersemletir. Bu, Goblin Fıçısı'nı tamamen durdurabileceği, Cehennem Ejderhası/Kulesi'ni uzun süre sıfırlayabileceği ve Minyon Sürüsü'nü tamamen öldürebileceği anlamına gelir. İnanılmaz çok yönlüdür.
              </p>

              <h2>Evrim Kartlarına Karşı Nasıl Oynanır?</h2>
              <ul>
                <li><strong>Evrimleşmiş Şövalye'ye Karşı:</strong> Onu kulenizden uzak tutun. Bir bina (Tesla, Cehennem Kulesi) ile ortaya çekin veya güçlü hava birlikleri (Minyonlar, Cehennem Ejderhası) ile eritin. Hasar azaltması sadece ilerlerken veya vururken aktiftir, sersemlediğinde (Elektro Büyücü, Çarpma) savunmasız kalır.</li>
                <li><strong>Evrimleşmiş İskeletler'e Karşı:</strong> Tomruk (Log), Oklar (Arrows) veya Zehir (Poison) gibi alan hasarı veren büyülerle hızla temizleyin. Büyümeniz yoksa, Bebek Ejderha veya Büyücü gibi alan hasarı veren birlikler kullanın.</li>
              </ul>

              <h3>Sonuç: Evrim, Yeni Bir Strateji Katmanıdır</h3>
              <p>
                Kart Evrimi, oyuna derin bir stratejik katman ekledi. Artık sadece rakibin elindeki kartları değil, aynı zamanda "Evrim Döngüsü"nün neresinde olduğunu da takip etmeniz gerekiyor. Clashtor AI olarak, yapay zeka analizlerimizde bu evrim kartlarının destenizdeki etkisini ve potansiyel zayıflıklarını da hesaba katmak için çalışıyoruz.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};