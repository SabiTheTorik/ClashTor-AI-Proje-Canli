import React from 'react';
import { Link } from 'react-router-dom';
// Navbar'daki SVG ikonunu import ediyoruz
import NavbarSvgIcon from '../assets/navbar-icon.svg';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Üst Kısım: Her şeyi ortalamak için flex-col kullanıyoruz */}
        <div className="flex flex-col items-center gap-6">

          {/* 1. Logo ve Başlık (Ortalanmış) */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img src={NavbarSvgIcon} alt="ClashTor AI Logo" className="h-8 w-8" />
              <div className="absolute inset-0 blur-xl bg-blue-500/20 group-hover:bg-blue-500/40 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              ClashTor AI
            </span>
          </Link>

          {/* 2. Footer Linkleri (Logonun altında, yan yana) */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              İletişim
            </Link>
            <Link to="/report-bug" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Hata Bildir
            </Link>
            {/* YENİ LİNKLERİ BURAYA EKLEYİN (Adsense için ZORUNLU) */}
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Hakkımızda</Link>
            <Link to="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Gizlilik Politikası</Link>

            {/* === YENİ EKLENEN LİNK === */}
            <Link to="/guides" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Rehberler</Link>
            {/* === LİNK SONU === */}
          </div>
        </div>

        {/* Alt Kısım: Ayırıcı Çizgi ve Telif Hakkı */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 ClashTor AI. Tüm hakları saklıdır.
          </p>
        </div>

      </div>
    </footer>
  );
};