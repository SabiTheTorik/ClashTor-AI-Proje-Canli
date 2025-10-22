// src/pages/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowRight } from 'lucide-react'; // İkonları import et

export const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="relative overflow-hidden">
        {/* Arkaplan Efektleri */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-2xl">
            
            <div className="text-center mb-10">
              <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="block text-gray-900 dark:text-white">Hakkımızda: ClashTor AI'nın Hikayesi</span>
              </h1>
            </div>

            <div className="text-left space-y-6 text-gray-700 dark:text-gray-300">
                <p className="text-lg font-semibold border-l-4 border-blue-500 pl-4">
                    ClashTor AI, rekabetçi Clash Royale oyuncularının stratejik kararlarını optimize etmek için geliştirilmiştir.
                </p>
                <p>
                    Biz, mobil oyun sektöründeki tutku ve yapay zekanın gücüne olan inançla yola çıktık. Amacımız, oyuncuların saatlerce süren manuel deneme yanılma süreçlerini, veriye dayalı anlık, kesin AI analizleriyle değiştirmektir.
                </p>
                
                <h3 className="text-2xl font-bold pt-6 text-gray-900 dark:text-white">Neden Bize Güvenmelisiniz?</h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>**Stabil Mimari:** Uygulamamız, Netlify ve Render gibi endüstri standardı bulut hizmetleri üzerine kuruludur, bu da kesintisiz erişim ve hızlı yanıt süreleri sağlar.</li>
                    <li>**Güvenilir Veri:** Supercell API'sine güvenli proxy çözümleri üzerinden erişerek size daima güncel ve doğru maç verileri sunarız.</li>
                    <li>**Kullanıcı Güvenliği:** Tüm oturum ve kullanıcı bilgileri, Firebase Admin SDK'nın sağladığı en üst düzey güvenlik protokolleriyle korunmaktadır.</li>
                </ul>
                
                <h3 className="text-2xl font-bold pt-6 text-gray-900 dark:text-white">Bize Ulaşın</h3>
                <p>
                    Sitenizin sürekli gelişmesi için geri bildirimleriniz bizim için çok değerlidir. Sorularınız, işbirlikleriniz veya bir hata bildirmek için bize ulaşabilirsiniz.
                </p>
                
                <Link to="/contact" className="inline-flex items-center group text-lg font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    <Mail className="h-5 w-5 mr-2" />
                    İletişim Sayfasına Git
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};