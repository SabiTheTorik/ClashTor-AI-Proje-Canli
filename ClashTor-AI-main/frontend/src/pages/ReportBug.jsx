import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { AlertTriangle, CheckCircle } from 'lucide-react'; // CheckCircle ekledik

// --- YENİ FORM BİLEŞENİ ---
function BugReportForm() {
  // --- BURAYA DİKKAT ---
  // Formspree'den alacağın ID'yi 'SENIN_FORM_ID_N' yazan yere yapıştır
  const [state, handleSubmit] = useForm('xkgqedyd'); 

  if (state.succeeded) {
    // --- BAŞARI MESAJI ---
    return (
      <div className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Teşekkürler!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Hata bildiriminiz başarıyla alındı.
        </p>
      </div>
    );
  }

  // --- FORMUN KENDİSİ ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hangi Sayfadaydınız? (Örn: Analiz Sayfası)
        </label>
        <input
          id="page"
          type="text"
          name="sayfa"
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          placeholder="Örn: /analyzer"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hatanın Açıklaması
        </label>
        <textarea
          id="description"
          name="aciklama"
          rows={4}
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          placeholder="Ne yapmaya çalışıyordunuz ve ne oldu?"
        />
        <ValidationError 
          prefix="Açıklama" 
          field="aciklama"
          errors={state.errors}
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          E-posta Adresiniz (İsteğe bağlı)
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          placeholder="Size geri dönüş yapabilmemiz için"
        />
        <ValidationError 
          prefix="E-posta" 
          field="email"
          errors={state.errors}
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={state.submitting} // Gönderilirken butonu kilitle
          className="w-full inline-flex items-center justify-center group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.submitting ? 'Gönderiliyor...' : 'Hata Bildirimini Gönder'}
        </button>
      </div>
    </form>
  );
}

// --- ANA SAYFA BİLEŞENİ (Stil için) ---
export const ReportBug = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 z-10">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-xl">
            
            {/* Formun içeriği buraya gelecek (veya başarı mesajı) */}
            {/* Önce başlığı ve ikonu ekleyelim */}
            
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6 shadow-sm">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="block text-gray-900 dark:text-white">Hata Bildir</span>
              </h1>
            </div>

            {/* Form bileşenini buraya yerleştiriyoruz */}
            <BugReportForm />

          </div>
        </div>
      </div>
    </div>
  );
};