import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuidePekka = () => {
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
                PEKKA ve Mini PEKKA: Farkları ve Kullanım Alanları
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Kategori: <strong>Kart Analizi</strong></span>
              <span>Yazılma Tarihi: <strong>24 Ekim 2025</strong></span>
            </div>
          </CardHeader>

          <CardContent>
            {/* Makale İçeriği (SEO için optimize edildi) */}
            <div className="prose dark:prose-invert max-w-none space-y-6 text-lg">
              <p className="lead text-xl">
                Clash Royale arenasının en korkulan seslerinden biri "P.A.N.C.A.K.E.S." (Pankekler) diye bağıran Mini PEKKA'nın sesidir. Ancak, onun büyük ablası olan PEKKA da devasa kılıcıyla oyundaki en güçlü tank katillerinden biridir. İkisi de zırhlı ve yüksek hasar veren birimler olsalar da, kullanım alanları ve stratejik rolleri tamamen farklıdır. Bu rehberde, PEKKA ve Mini PEKKA'yı karşılaştıracağız.
              </p>

              <h2>Rol Karşılaştırması: Tank mı, Suikastçı mı?</h2>
              <p>
                İki kart arasındaki en temel fark, iksir maliyetleri ve buna bağlı rolleridir.
              </p>
              
              <h4>PEKKA (7 İksir): Yürüyen Kale ve Savunma Duvarı</h4>
              <p>
                7 İksir maliyetiyle PEKKA, bir destenin "ana savunma kartı" veya "ana saldırı tankı" olarak işlev görür. Devasa bir can havuzuna ve tek vuruşta (single-target) muazzam bir hasara sahiptir. 
              </p>
              <ul>
                <li><strong>Görevi:</strong> Rakibin Golem, Elektro Dev veya Mega Şövalye gibi ağır tanklarını eritmek.</li>
                <li><strong>Strateji:</strong> PEKKA ile başarılı bir savunma yaptıktan sonra, hayatta kalan PEKKA'nın arkasına destek birlikleri (Elektro Büyücü, Büyülü Okçu) ekleyerek onu ölümcül bir karşı saldırıya dönüştürürsünüz.</li>
                <li><strong>Zayıflığı:</strong> Çok yavaştır ve "swarm" (sürü) birimlere (İskelet Ordusu, Goblinler) karşı savunmasızdır.</li>
              </ul>

              <h4>Mini PEKKA (4 İksir): Camdan Suikastçı (Glass Cannon)</h4>
              <p>
                4 İksir maliyetiyle Mini PEKKA, çok daha esnek bir roldedir. Canı PEKKA'ya göre çok daha azdır ancak saniye başına hasarı (DPS) şaşırtıcı derecede yüksektir ve çok daha hızlı koşar.
              </p>
              <ul>
                <li><strong>Görevi:</strong> Rakibin Domuz Binicisi, Madenci veya Savaş Koçbaşı gibi "mini-tank"larını veya kuleye odaklanmış birimlerini hızla yok etmek.</li>
                <li><strong>Strateji:</strong> Genellikle hızlı "döngü" destelerinde savunma/suikastçı olarak kullanılır. Savunma yaptıktan sonra, önüne bir Buz Ruhu veya arkasına Alev Topu atarak hızlı bir karşı saldırı başlatılabilir.</li>
                <li><strong>Zayıflığı:</strong> PEKKA gibi o da sürülere karşı zayıftır. 1 iksirlik İskeletler bile onu durdurabilir. "Camdan Top" tabiri, yüksek hasarına rağmen kolayca ölmesini ifade eder.</li>
              </ul>

              <h2>Rakamlarla Karşılaştırma: Güç ve Zayıflık</h2>
              <p>
                Bu iki kartı seçerken iksir maliyetinin ötesine bakmak gerekir.
              </p>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Özellik</th>
                    <th className="text-left p-2">PEKKA (Seviye 11)</th>
                    <th className="text-left p-2">Mini PEKKA (Seviye 11)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">İksir Maliyeti</td>
                    <td className="p-2"><strong>7</strong></td>
                    <td className="p-2"><strong>4</strong></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Can Puanı</td>
                    <td className="p-2">~4900 (Çok Yüksek)</td>
                    <td className="p-2">~1800 (Orta)</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Hasar (DPS)</td>
                    <td className="p-2">~380 (Yüksek)</td>
                    <td className="p-2">~540 (Çok Yüksek)</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Hız</td>
                    <td className="p-2">Yavaş</td>
                    <td className="p-2">Hızlı</td>
                  </tr>
                </tbody>
              </table>
              <p>
                Tabloya baktığımızda, Mini PEKKA'nın DPS'sinin (saniye başına hasar) PEKKA'dan daha yüksek olduğunu görüyoruz! Ancak düşük canı, bu hasarı vermeden ölmesine neden olabilir.
              </p>

              <h2>Stratejik Kullanım: Hangi Destede Hangisi?</h2>
              
              <h4>PEKKA Desteleri (Kontrol / Bridge Spam)</h4>
              <p>
                PEKKA kullanıyorsanız, desteniz onun etrafında şekillenir. "PEKKA Bridge Spam" (PEKKA Köprü Spam) en popüler destelerden biridir. Bu destede PEKKA ana savunmacıdır. Rakip ağır bir hamle yaptığında PEKKA ile karşılarsınız. Rakip pasifse, Savaş Koçbaşı ve Hayalet gibi kartlarla köprüden baskı kurarsınız. PEKKA'nın yanında mutlaka alan hasarı veren (Bebek Ejderha, Elektro Büyücü, Zehir) kartlar olmalıdır.
              </p>

              <h4>Mini PEKKA Desteleri (Hızlı Döngü / Hog Rider)</h4>
              <p>
                Mini PEKKA bir destek kartıdır. Genellikle "Domuz Binicisi 2.6" veya "X-Yayı" gibi hızlı döngü destelerinde veya "Madenci Kontrol" destelerinde savunma amaçlı bulunur. 4 iksir maliyeti, destenizin ortalama iksirini düşük tutar ve ana saldırı kartınıza hızla geri dönmenizi sağlar.
              </p>

              <h3>Sonuç: Ne Zaman Hangisini Seçmeli?</h3>
              <p>
                Kararınız tamamen metaya ve destenizin ihtiyacına bağlıdır.
              </p>
              <ul>
                <li>Eğer meta Golem, Elektro Dev gibi ağır tanklarla doluysa, <strong>PEKKA</strong> en iyi savunmacınızdır.</li>
                <li>Eğer meta Domuz Binicisi, Savaş Koçbaşı veya Madenci gibi hızlı ve can sıkıcı kartlarla doluysa, <strong>Mini PEKKA</strong> daha iyi bir seçimdir.</li>
                <li>Ağır bir "Beatdown" destesi kurmak istiyorsanız <strong>PEKKA</strong> kullanın.</li>
                <li>Hızlı, agresif ve düşük iksirli bir deste istiyorsanız <strong>Mini PEKKA</strong>'yı tercih edin.</li>
              </ul>
              <p>
                Kendi destenizdeki tank katilinin işe yarayıp yaramadığını merak ediyorsanız, Clashtor AI analizörümüze etiketinizi girerek destenizin zayıflıklarını görebilirsiniz!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};