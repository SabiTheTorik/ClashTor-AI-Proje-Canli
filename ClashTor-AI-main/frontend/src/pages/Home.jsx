import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Button import edildiğinden emin ol
import { ArrowRight, Shield, Zap, Users, TrendingUp } from 'lucide-react'; // İkonları import et
import { useAuth } from '../contexts/AuthContext'; // Auth context'i import et

export const Home = () => {
  const { user } = useAuth(); // Kullanıcı durumunu al

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="relative overflow-hidden">
        {/* Arkaplan Efektleri */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 z-10"> {/* z-index eklendi */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
              <Zap className="h-4 w-4" />
              <span>AI Destekli Deste Analizi</span> {/* Türkçe Çeviri */}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="block text-gray-900 dark:text-white">Arenaya</span> {/* Türkçe Çeviri */}
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Hükmet {/* Türkçe Çeviri */}
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Clash Royale destelerini yapay zeka ile analiz et, kişiselleştirilmiş öneriler al ve zayıflıklarını gidermek için mükemmel kart değişimlerini bul. {/* Türkçe Çeviri */}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to={user ? '/analyzer' : '/register'}>
                <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1"> {/* Transform eklendi */}
                  {user ? 'Analize Başla' : 'Ücretsiz Başla'} {/* Türkçe Çeviri & Dinamik Metin */}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/decks">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1"> {/* Stil güncellendi */}
                  Destelere Göz At {/* Türkçe Çeviri */}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">AI Destekli Analiz</h3> {/* Türkçe Çeviri */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Gelişmiş yapay zeka maç geçmişinizi analiz eder ve deste zayıflıklarını hassasiyetle belirler. {/* Türkçe Çeviri */}
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Akıllı Öneriler</h3> {/* Türkçe Çeviri */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kupa aralığınıza ve oyun tarzınıza göre kişiselleştirilmiş kart değiştirme önerileri alın. {/* Türkçe Çeviri */}
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4 shadow-sm">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Topluluk Desteleri</h3> {/* Türkçe Çeviri */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Topluluk tarafından paylaşılan başarılı deste yapılarına göz atın ve onlardan öğrenin. {/* Türkçe Çeviri */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Desteni geliştirmeye hazır mısın? {/* Türkçe Çeviri */}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Yapay zeka destekli analizi ile kazanma oranını artıran binlerce oyuncuya katılın. {/* Türkçe Çeviri */}
            </p>
            <Link to={user ? '/analyzer' : '/register'} className="w-full sm:w-auto"> {/* Link'e de w-full ekle */}
              <Button
                size="lg"
                className="w-full sm:w-auto group bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {user ? 'Hemen Analiz Et' : 'Ücretsiz Denemeyi Başlat'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};