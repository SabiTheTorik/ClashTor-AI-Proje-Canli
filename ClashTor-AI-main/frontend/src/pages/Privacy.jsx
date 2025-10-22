// src/pages/Privacy.jsx

import React from 'react';
import { Shield, Mail, ArrowRight } from 'lucide-react'; 
import { Link } from 'react-router-dom';

export const Privacy = () => {
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
                <span className="block text-gray-900 dark:text-white">Gizlilik Politikası</span>
              </h1>
              <p className="text-sm text-gray-500 mt-2">Son Güncelleme: 22 Ekim 2025</p>
            </div>

            {/* GİZLİLİK METNİ */}
            <div className="text-left space-y-6 text-gray-700 dark:text-gray-300">
                <p>
                    ClashTor AI'yı kullandığınız için teşekkür ederiz. Gizliliğiniz ve verilerinizin güvenliği bizim için en önemli önceliktir. Bu politika, hizmetimizi kullanırken bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
                </p>
                
                <h3 className="text-xl font-bold pt-4 text-gray-900 dark:text-white">1. Topladığımız Bilgiler</h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>**Kişisel Kimlik Bilgileri:** Kayıt sırasında sağladığınız **Kullanıcı Adı** ve **E-posta Adresi**. Bu bilgiler, Firebase Authentication hizmetleri tarafından güvenli bir şekilde saklanır.</li>
                    <li>**Kullanım Verileri:** Kaydettiğiniz tüm deste analizleri ve kart değişim önerileri (sadece sizin için veya paylaşıldığı takdirde).</li>
                </ul>
                
                <h3 className="text-xl font-bold pt-4 text-gray-900 dark:text-white">2. Verilerin Kullanımı</h3>
                <p>Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Hesabınızı oluşturmak ve yönetmek için.</li>
                    <li>Oturumunuzu sürdürmek ve size özel analiz sonuçlarını göstermek için.</li>
                    <li>İzin vermeniz halinde, hizmetimizdeki güncellemeler ve yenilikler hakkında sizi bilgilendirmek için.</li>
                </ul>

                <h3 className="text-xl font-bold pt-4 text-gray-900 dark:text-white">3. Çerezler (Cookies)</h3>
                <p>
                    Oturumunuzu yönetmek ve giriş durumunuzu korumak için **oturum çerezleri (session cookies)** kullanırız. Bu çerezler, tarayıcınız ile sunucumuz arasındaki iletişimi güvenli hale getirmek için **HTTP Secure (HTTPS)** protokolü altında işlenir.
                </p>

                <h3 className="text-xl font-bold pt-4 text-gray-900 dark:text-white">4. Veri Güvenliği ve Üçüncü Taraflar</h3>
                <p>
                    Verilerinizin güvenliği için en son güvenlik önlemlerini kullanırız. Tüm kullanıcı verileri ve şifreler, Google'ın **Firebase** ve **Firestore** hizmetlerinde şifrelenmiş olarak saklanır. Hesap bilgilerinizi izniniz olmadan üçüncü taraflarla **asla** paylaşmayız.
                </p>

                <h3 className="text-xl font-bold pt-4 text-gray-900 dark:text-white">5. İletişim</h3>
                <p>
                    Gizlilik politikamız veya veri uygulamalarımız hakkında sorularınız varsa, lütfen <Link to="/contact" className="text-blue-500 hover:underline">İletişim sayfamızı</Link> ziyaret edin veya doğrudan bize yazın.
                </p>
            </div>
            {/* GİZLİLİK METNİ SONU */}

          </div>
        </div>
      </div>
    </div>
  );
};