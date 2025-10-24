import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// İleride bu listeyi makalelerinle dolduracaksın
const guidesList = [
  {
    title: 'Clash Royale Meta Rehberi: Golem Desteleri Nasıl Oynanır?',
    description: 'Golem destelerinin güçlü ve zayıf yanları, temel stratejiler ve Goleme karşı nasıl oynanacağı hakkında detaylı bir rehber.',
    link: '/guides/golem-meta-guide', // Henüz bu sayfalar yok, ama tıklanabilir yapıyoruz
    category: 'Strateji'
  },
  {
    title: 'İksir Yönetimi 101: Yeni Başlayanlar İçin İpuçları',
    description: 'İksir avantajı nedir? Nasıl elde edilir? Oyun kazanmanızı sağlayacak temel iksir yönetimi taktikleri bu rehberde.',
    link: '/guides/elixir-management-101',
    category: 'Temel Bilgiler'
  },
  {
    title: 'Kart Evrimi (Evolution) Mekanikleri Tam Rehber',
    description: 'Evrimleşmiş kartlar nasıl çalışır? Hangi kartları evrimleştirmek daha avantajlı? En son dengelemeler ve analizler.',
    link: '/guides/evolution-mechanics',
    category: 'Güncel Meta'
  },
  {
    title: 'Pekka ve Mini Pekka: Farkları ve Kullanım Alanları',
    description: 'Bu iki popüler kart arasındaki temel farklar nelerdir? Hangi destede hangisini tercih etmelisiniz?',
    link: '/guides/pekka-vs-mini-pekka',
    category: 'Kart Analizi'
  },
  {
    title: 'Clashtor AI Analizi: Neden "Buz Ruhu" Önerildi?',
    description: 'Yapay zekamızın deste döngüsünü (cycle) nasıl hızlandırdığını ve küçük bir değişikliğin oyunu nasıl etkilediğini inceliyoruz.',
    link: '/guides/ai-analysis-ice-spirit',
    category: 'Site Özellikleri'
  }
];

export const Guides = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Clash Royale Rehberleri</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Oyununuzu geliştirmek, meta destelerini öğrenmek ve stratejinizi mükemmelleştirmek için uzman rehberlerimiz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidesList.map((guide, index) => (
            <Link to={guide.link} key={index} className="block group">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                     <BookOpen className="h-6 w-6 text-blue-600" />
                     <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{guide.category}</span>
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    {guide.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>Daha fazla rehber ve analiz yakında eklenecektir. Takipte kalın!</p>
        </div>
      </div>
    </div>
  );
};