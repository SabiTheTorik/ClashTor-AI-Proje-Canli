import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // signInWithGoogle'ı buradan alacağız
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Separator } from '../components/ui/separator'; // Ayırıcı için
import { AlertCircle, User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'; // Loader2 eklendi
import { useToast } from '../hooks/use-toast';

// Google ikonu (Login.jsx'ten kopyalandı)
const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        <path fill="none" d="M1 1h22v22H1z"/>
    </svg>
);

export const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false); // Genel yüklenme durumu
  const [googleLoading, setGoogleLoading] = useState(false); // Google için ayrı yüklenme durumu
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, signInWithGoogle } = useAuth(); // signInWithGoogle eklendi
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Kullanıcı adı 3 ile 20 karakter arasında olmalıdır');
      return;
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true); // Eposta/Şifre kaydı yüklenmesini başlat

    try {
      await register(formData.username, formData.email, formData.password, formData.confirmPassword);
      toast({
        title: "Hesap Oluşturuldu!",
        description: "ClashTor AI'ye hoş geldiniz.",
      });
      navigate('/analyzer');
    } catch (err) {
      setError(err.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
      toast({
        title: "Kayıt Başarısız",
        description: err.message || "Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false); // Eposta/Şifre kaydı yüklenmesini bitir
    }
  };

  // --- YENİ: Google ile Kayıt Handler ---
  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true); // Google yüklenmesini başlat
    try {
      await signInWithGoogle(); // AuthContext'teki fonksiyonu çağır
      toast({
        title: "Google ile Giriş Başarılı!", // Kayıt olsa bile giriş yapmış oluyor
        description: "Başarıyla giriş yaptınız.",
      });
      navigate('/analyzer'); // Başarılı sonrası yönlendir
    } catch (err) {
      setError(err.message || 'Google ile kayıt/giriş yapılamadı.');
      // AuthContext'teki fonksiyon zaten hata mesajını logladı/toast yaptı (isteğe bağlı)
    } finally {
      setGoogleLoading(false); // Google yüklenmesini bitir
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 px-4 py-12">
      {/* ... (Arkaplan efektleri) ... */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-800 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hesap Oluştur
          </CardTitle>
          <CardDescription className="text-center text-base">
            Destelerini geliştiren binlerce oyuncuya katıl
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Eposta/Şifre Formu */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && ( /* Hata Mesajı */
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {/* Kullanıcı Adı */}
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Kullanıcı Adınız"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10"
                  required
                  minLength={3}
                  maxLength={20} // Maksimum uzunluk burada tanımlı
                  autoComplete="username"
                />
              </div>
              {/* YENİ: Karakter Sayacı */}
              <p className="text-xs text-right text-gray-500 dark:text-gray-400 pr-1">
                {formData.username.length} / 20
              </p>
            </div>
            {/* E-posta */}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="e-posta@adresiniz.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10" required autoComplete="email" />
              </div>
            </div>
            {/* Şifre */}
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'} // Dinamik type
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10" // Sağdan boşluk
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Şifre Onayla */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifreyi Onayla</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'} // Dinamik type
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10" // Sağdan boşluk
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {/* Kayıt Ol Butonu */}
            <Button type="submit" disabled={loading || googleLoading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Hesap oluşturuluyor...</> : 'Kayıt Ol'}
            </Button>
          </form>

          {/* --- YENİ: VEYA Ayırıcı ve Google Butonu --- */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">VEYA</span></div>
          </div>
          <Button variant="outline" onClick={handleGoogleSignUp} disabled={loading || googleLoading} className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm">
             {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
             Google ile Kayıt Ol {/* Türkçe Çeviri */}
          </Button>
          {/* --- YENİ SONU --- */}

        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Giriş Yap
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};