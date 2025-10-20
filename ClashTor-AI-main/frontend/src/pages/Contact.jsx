import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Mail, CheckCircle } from 'lucide-react'; // İkonları import et

// --- YENİ İLETİŞİM FORMU BİLEŞENİ ---
function ContactForm() {
  // --- BURAYA DİKKAT ---
  // Formspree'den alacağın YENİ İLETİŞİM ID'sini buraya yapıştır
  const [state, handleSubmit] = useForm('mqayjrjd');

  if (state.succeeded) {
    // --- BAŞARI MESAJI ---
    return (
      <div className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Teşekkürler!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          İletişim mesajınız başarıyla alındı. En kısa sürede dönüş yapacağız.
        </p>
      </div>
    );
  }

  // --- FORMUN KENDİSİ ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Adınız */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adınız
        </label>
        <input
          id="name"
          type="text"
          name="name" // Formspree bu 'name'i kullanır
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          placeholder="Sabi Yomtov"
        />
      </div>

      {/* E-posta Adresiniz */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          E-posta Adresiniz
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          placeholder="ornek@gmail.com"
        />
        <ValidationError 
          prefix="E-posta" 
          field="email"
          errors={state.errors}
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Mesajınız */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          placeholder="Merhaba, siteniz hakkında..."
        />
        <ValidationError 
          prefix="Mesaj" 
          field="message"
          errors={state.errors}
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Gönder Butonu (Mavi Stil) */}
      <div>
        <button
          type="submit"
          disabled={state.submitting}
          className="w-full inline-flex items-center justify-center group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.submitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
        </button>
      </div>
    </form>
  );
}


// --- ANA SAYFA BİLEŞENİ (Stil için) ---
export const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 z-10">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-xl">
            
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
                <Mail className="h-8 w-8" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="block text-gray-900 dark:text-white">İletişim</span>
              </h1>
            </div>

            {/* Formu buraya yerleştiriyoruz */}
            <ContactForm />

          </div>
        </div>
      </div>
    </div>
  );
};