import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // axios'u import et
import firebase from 'firebase/compat/app'; // Eğer v8 (compat) kullanıyorsan
import 'firebase/compat/auth';

// Mock verisini artık doğrudan kullanmayacağız, sadece başlangıçta bir referans olabilir.
// import { mockUser } from '../mock'; 



// Backend adresini merkezi bir yerde tanımla (daha sonra .env'e taşınabilir)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
// --- Firebase Konfigürasyonu ---
// Bu bilgileri .env dosyasından almak daha güvenlidir
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let auth; // Declare variables outside
let googleProvider;

// Firebase'i başlat (eğer zaten başka yerde yapılmadıysa)
if (!firebase.apps.length) {
    if (!firebaseConfig.apiKey) {
        console.error("Firebase API Key .env dosyasından okunamadı!");
    } else {
        try { // Add try...catch for initialization
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase başarıyla başlatıldı."); 
            // --- DEĞİŞİKLİK: auth ve provider'ı İÇERİ TAŞI ---
            auth = firebase.auth();
            googleProvider = new firebase.auth.GoogleAuthProvider();
            // --- ---
        } catch (initError) {
             console.error("Firebase başlatılırken hata oluştu:", initError);
             // Initialization failed, maybe set auth/provider to null or handle error
             auth = null; 
             googleProvider = null;
        }
    }
} else {
     console.log("Firebase zaten başlatılmış.");
     // Firebase zaten başlatılmışsa, auth ve provider'ı burada da almamız GEREKİR
     auth = firebase.auth();
     googleProvider = new firebase.auth.GoogleAuthProvider();
}

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Başlangıçta yükleniyor durumu

  // Kullanıcı oturumunu backend'den kontrol eden fonksiyon
  const checkUserSession = async () => {
    setLoading(true);
    try {
      // Flask backend'ine istek at
      const response = await axios.get(`${API_BASE_URL}/api/user`, {
        withCredentials: true // Session cookie'sinin gönderilmesi için ÇOK ÖNEMLİ
      });
      setUser(response.data); // Başarılı olursa kullanıcı verisini state'e ata
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Kullanıcı giriş yapmamış (checkUserSession).");
      } else {
        console.error("Kullanıcı bilgisi alınırken hata (checkUserSession):", error);
        // Backend çalışmıyorsa veya başka bir hata varsa kullanıcıya bilgi verilebilir
        // Örneğin bir toast mesajı ile: toast({ variant: "destructive", title: "Sunucuya bağlanılamadı." })
      }
      setUser(null); // Hata durumunda veya giriş yapılmamışsa kullanıcıyı null yap
    } finally {
      setLoading(false); // Yüklenme tamamlandı
    }
  };

  useEffect(() => {
    checkUserSession(); // Sayfa yüklendiğinde oturumu kontrol et
  }, []); // [] -> Bu effect sadece bileşen ilk render olduğunda çalışır

  // --- Gerçek API İstekleri ---

  const login = async (loginIdentifier, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`,
        new URLSearchParams({
          'login_identifier': loginIdentifier,
          'password': password
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true
        }
      );

      // --- DEĞİŞİKLİK BURADA ---
      if (response.data && response.data.status === 'success' && response.data.user) {
        // Backend'den gelen kullanıcı bilgisini DOĞRUDAN state'e ata
        setUser(response.data.user);
        console.log("Login başarılı, kullanıcı bilgisi backend'den alındı:", response.data.user);
        // Artık checkUserSession çağırmaya gerek yok!
        // await checkUserSession(); // <-- BU SATIRI SİL veya YORUM SATIRI YAP
        return response.data.user; // Başarı durumunu veya kullanıcı verisini döndür
      } else {
        // Backend 'success' demedi veya 'user' objesi gelmedi
        throw new Error(response.data?.error || 'Bilinmeyen giriş hatası');
      }
      // --- DEĞİŞİKLİK SONU ---

    } catch (error) {
      console.error("Login hatası:", error.response?.data || error.message);
      // Hata mesajını fırlatmadan önce setUser(null) yapmak iyi olabilir
      setUser(null);
      const errorMessage = error.response?.data?.error || 'Giriş başarısız oldu. Bilgileri kontrol edin.';
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`,
        new URLSearchParams({
          'username': username,
          'email': email,
          'password': password,
          'password_confirm': confirmPassword
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true
        }
      );
      // Kayıt başarılıysa genellikle login sayfasına yönlendirilir,
      // bu yüzden burada checkUserSession çağırmaya gerek olmayabilir.
      // Flask tarafında flash mesajı gösterilecektir.
      return response.data;
    } catch (error) {
      console.error("Register hatası:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Kayıt başarısız oldu. Lütfen tekrar deneyin.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout sırasında hata:", error);
      // Hata olsa bile frontend'den çıkış yap
    } finally {
      setUser(null); // Kullanıcı state'ini temizle
      // localStorage'ı mock için kullanıyorduk, artık gerek yok.
      // localStorage.removeItem('mockUser'); 
    }
  };

  // --- YENİ: Google ile Giriş Fonksiyonu ---
  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
            console.error("Firebase Auth başlatılmadı veya kullanılamıyor.");
            throw new Error("Google ile giriş şu anda kullanılamıyor.");
        }
    try {
      // Firebase Google Popup'ını aç
      const result = await auth.signInWithPopup(googleProvider); // v8
      // VEYA v9+ için: const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      if (user) {
        // Firebase'den ID token'ı al
        const idToken = await user.getIdToken(/* forceRefresh */ true);
        const idTokenString = String(idToken); // Token'ı zorla string'e çevir
        
        // 2. Token'ı Backend'e gönder
        const response = await axios.post(`${API_BASE_URL}/google-login`,
            new URLSearchParams({ 'id_token': idTokenString }), // <-- DÜZELTİLMİŞ SATIR
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true
            }
        );

        if (response.data && response.data.status === 'success' && response.data.user) {
          // Başarılı giriş sonrası backend'den gelen kullanıcı verisiyle state'i güncelle
          setUser(response.data.user);
          return response.data.user; // Başarı durumunu döndür
        } else {
          throw new Error(response.data?.error || 'Google girişi backend doğrulaması başarısız.');
        }
      } else {
        throw new Error("Google ile kullanıcı bilgisi alınamadı.");
      }
    } catch (error) {
      console.error("Google ile Giriş Hatası:", error.response?.data || error.message || error);
      // Firebase'in spesifik hata kodlarını yakalayabilirsin (örn: error.code === 'auth/popup-closed-by-user')
      const errorMessage = error.response?.data?.error || error.message || 'Google ile giriş sırasında bir hata oluştu.';
      // Kullanıcı popup'ı kapattıysa hata göstermeyebiliriz
      if (error.code !== 'auth/popup-closed-by-user') {
        // toast({ title: "Giriş Başarısız", description: errorMessage, variant: "destructive" }); // Toast burada gösterilebilir
      }
      throw new Error(errorMessage); // Hatanın UI'da yakalanması için fırlat
    }
  };

  // updateUser fonksiyonu backend'e istek atmalı (şimdilik sadece frontend'de güncelliyor)
  // Gerekirse /update-username ve /update-picture için ayrı API istekleri eklenebilir.
  const updateUser = (updates) => {
    if (!user) return; // Kullanıcı yoksa güncelleme yapma
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    // Backend'i de güncellemek için API isteği eklenebilir. Örnek:
    /*
    axios.post(`${API_BASE_URL}/update-profile`, updates, { withCredentials: true })
      .catch(err => console.error("Profil güncellenemedi:", err));
    */
    // localStorage'a artık gerek yok.
    // localStorage.setItem('mockUser', JSON.stringify(updatedUser));
  };


  return (
    // Değer olarak gerçek fonksiyonları geçiyoruz
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
