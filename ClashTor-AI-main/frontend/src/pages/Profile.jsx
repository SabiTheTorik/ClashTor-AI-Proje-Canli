import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Giriş yapmış kullanıcı bilgisi için
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
// Gerekli tüm ikonları import et
import { Crown, Edit, Trash2, Share2, EyeOff, Calendar, Zap, ArrowDownUp, Loader2, Info, Copy, Check } from 'lucide-react'; // <-- Copy ve Check eklendi
import { useToast } from '../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../components/ui/alert-dialog';

// Örnek: Profile.jsx (ve diğer tüm React dosyalarınızda)
// const API_BASE_URL = 'http://localhost:5000'; // Eski sabit kodlanmış adres

// YENİ DİNAMİK ADRES:
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const Profile = () => {
  const { username } = useParams(); // URL'den görüntülenen profilin kullanıcı adı
  const { user: loggedInUser, updateUser, loading: authLoading } = useAuth(); // Giriş yapmış kullanıcı ve yüklenme durumu
  const { toast } = useToast();
  const [copiedDeckId, setCopiedDeckId] = useState(null);
  const navigate = useNavigate();

  // --- State Tanımlamaları ---
  const [profileUser, setProfileUser] = useState(null); // Görüntülenen profilin bilgileri
  const [loadingProfile, setLoadingProfile] = useState(true); // Profil bilgisi yükleniyor mu?
  const [analyses, setAnalyses] = useState([]); // Gösterilecek analizler (kendi veya paylaşılan)
  const [loadingAnalyses, setLoadingAnalyses] = useState(false); // Analizler yükleniyor mu?
  const [allCards, setAllCards] = useState(null); // Tüm kartların bilgisi (resimler için)
  const [loadingCards, setLoadingCards] = useState(true); // Kartlar yükleniyor mu?
  const [isOwnProfile, setIsOwnProfile] = useState(false); // Bu profil bana mı ait?
  const [editingUsername, setEditingUsername] = useState(false); // Kullanıcı adı düzenleme modu aktif mi?
  const [newUsername, setNewUsername] = useState(''); // Düzenlenen yeni kullanıcı adı
  const [profilePicUrl, setProfilePicUrl] = useState(''); // Profil resmi URL input'u için state
  const [isProfilePicDialogOpen, setIsProfilePicDialogOpen] = useState(false); // Resim güncelleme dialog'u açık mı?
  const [isUpdatingPic, setIsUpdatingPic] = useState(false); // Resim güncelleniyor mu?
  const [analysisToDelete, setAnalysisToDelete] = useState(null); // Silinecek analizin ID'sini tutar
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Dialog açık mı?

  // --- Veri Çekme Effectleri ---

  // 1. Kart verilerini çek (her zaman)
  useEffect(() => {
    let isMounted = true;
    const fetchCards = async () => {
      if (!isMounted) return;
      setLoadingCards(true);
      try {
        const cardsResponse = await axios.get(`${API_BASE_URL}/api/cards`);
        if (isMounted) setAllCards(cardsResponse.data);
      } catch (error) {
        console.error("Kart verileri çekilirken hata:", error);
        if (isMounted) toast({ title: "Hata", description: "Kart bilgileri yüklenemedi.", variant: "destructive" });
        if (isMounted) setAllCards({});
      } finally {
        if (isMounted) setLoadingCards(false);
      }
    };
    fetchCards();
    return () => { isMounted = false; };
  }, [toast]);

  // 2. Profil bilgilerini çek ve isOwnProfile'ı ayarla
  useEffect(() => {
    let isMounted = true;
    const fetchProfileUser = async () => {
      // Gerekli kontroller
      if (!username || authLoading || !isMounted) {
        if (isMounted) setLoadingProfile(false);
        return;
      }
      if (isMounted) setLoadingProfile(true);

      // Kendi profili mi?
      const ownProfileCheck = loggedInUser?.username === username;
      if (isMounted) setIsOwnProfile(ownProfileCheck);

      // Veriyi çek
      if (ownProfileCheck) { // Kendi profili
        if (isMounted) {
          setProfileUser(loggedInUser);
          setNewUsername(loggedInUser.username || '');
          setLoadingProfile(false);
        }
      } else { // Başkasının profili
        try {
          const response = await axios.get(`${API_BASE_URL}/api/profile/${username}/public-info`);
          if (isMounted) {
            setProfileUser(response.data);
          }
        } catch (error) { // Hata yönetimi
          console.error(`Profil bilgisi (${username}) çekilirken hata:`, error);
          if (isMounted) {
            toast({ title: "Hata", description: error.response?.status === 404 ? "Profil bulunamadı." : "Profil bilgisi yüklenemedi.", variant: "destructive" });
            setProfileUser(null);
          }
        } finally {
          if (isMounted) setLoadingProfile(false);
        }
      }
    };

    fetchProfileUser();
    return () => { isMounted = false; }; // Cleanup
  }, [username, loggedInUser, authLoading, toast]); // Bağımlılıklar

  // 3. Analizleri çek (profil bilgisi yüklendikten sonra, isOwnProfile'a göre)
  useEffect(() => {
    let isMounted = true;
    const fetchAnalyses = async () => {
      // Profil yüklenmediyse veya username yoksa bekle
      if (loadingProfile || !username || !isMounted) {
        if (isMounted) setLoadingAnalyses(false);
        return;
      }

      // Doğru API endpoint'ini seç
      const analysesApiUrl = isOwnProfile
        ? `${API_BASE_URL}/api/profile/${username}/analyses`
        : `${API_BASE_URL}/api/profile/${username}/shared-analyses`;

      if (isMounted) setLoadingAnalyses(true);
      try {
        const config = isOwnProfile ? { withCredentials: true } : {};
        const response = await axios.get(analysesApiUrl, config);
        if (isMounted) setAnalyses(response.data);
      } catch (error) { // Hata yönetimi
        console.error(`Analizler (${analysesApiUrl}) çekilirken hata:`, error);
        if (isOwnProfile && (error.response?.status === 401 || error.response?.status === 403) && isMounted) {
          // Kendi analizlerini çekerken yetki hatası
          toast({ title: "Oturum Hatası", description: "Analizlerinizi yüklemek için giriş yapmanız gerekiyor.", variant: "destructive" });
        } else if (isMounted && error.response?.status !== 404) {
          toast({ title: "Hata", description: "Analizler yüklenemedi.", variant: "destructive" });
        }
        if (isMounted) setAnalyses([]);
      } finally {
        if (isMounted) setLoadingAnalyses(false);
      }
    };

    fetchAnalyses(); // Çekmeyi başlat

    return () => { isMounted = false; }; // Cleanup
  }, [isOwnProfile, username, loadingProfile, toast]); // Bağımlılıklar


  // --- Eylemler (API İstekleri İle) ---

  const handleUsernameUpdate = async () => {
    if (newUsername.length < 3 || newUsername.length > 20) { /* ... Hata mesajı ... */ return; }
    try {
      const response = await axios.post(`${API_BASE_URL}/update-username`, { username: newUsername }, { withCredentials: true });
      if (response.data.success) {
        updateUser({ username: newUsername }); // AuthContext'i güncelle
        setEditingUsername(false);
        toast({ title: "Kullanıcı Adı Güncellendi!" });
        // URL'yi yeni kullanıcı adıyla güncelle (isteğe bağlı)
        navigate(`/profile/${newUsername}`, { replace: true });
      } else { throw new Error(response.data.error); }
    } catch (error) {
      console.error("Username Update Error:", error);
      toast({ title: "Güncelleme Başarısız", description: error.message, variant: "destructive" });
    }
  };

  const handleProfilePicUpdate = async () => {
    if (!profilePicUrl) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/update-picture`, { url: profilePicUrl }, { withCredentials: true });
      if (response.data.success) {
        updateUser({ profile_picture_url: profilePicUrl }); // AuthContext'i güncelle
        setIsProfilePicDialogOpen(false); // Dialog'u kapat
        setProfilePicUrl(''); // Input'u temizle
        toast({ title: "Profil Resmi Güncellendi!" });
      } else { throw new Error(response.data.error); }
    } catch (error) {
      console.error("Profile Pic Update Error:", error);
      toast({ title: "Güncelleme Başarısız", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteAnalysis = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/delete-analysis/${id}`, {}, { withCredentials: true });
      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast({ title: "Analiz Silindi" });
    } catch (error) { /* ... Hata mesajı ... */ }
  };

  // YENİ: Dialog onaylandığında çalışan fonksiyon
  const confirmDeleteAnalysis = async () => {
    if (!analysisToDelete) return; // Silinecek ID yoksa çık

    const idToDelete = analysisToDelete; // ID'yi geçici değişkene al
    setAnalysisToDelete(null); // State'i hemen temizle (isteğe bağlı)
    // setIsDeleteDialogOpen(false); // Dialog zaten kendi kapanacak

    try {
      // Backend API'sini çağır
      await axios.post(`${API_BASE_URL}/delete-analysis/${idToDelete}`, {}, { withCredentials: true });
      // Frontend state'inden sil
      setAnalyses(prev => prev.filter(a => a.id !== idToDelete));
      toast({ title: "Analiz Silindi" });
    } catch (error) {
      console.error("Delete Analysis Error:", error);
      toast({ title: "Silme Başarısız", description: "Analiz silinirken bir hata oluştu.", variant: "destructive" });
    }
  };

  const handleToggleShare = async (id) => {
    const analysis = analyses.find(a => a.id === id);
    if (!analysis) return;
    const wasShared = analysis.is_shared; // Önceki durumu sakla
    try {
      const response = await axios.post(`${API_BASE_URL}/toggle-share-analysis/${id}`, {}, { withCredentials: true });
      if (response.data.success) {
        setAnalyses(prev => prev.map(a => a.id === id ? { ...a, is_shared: response.data.is_shared } : a));
        console.log("Toast çağrılmadan hemen önce. Durum:", wasShared ? "Paylaşım Kaldırıldı" : "Analiz Paylaşıldı!"); // <-- EKLE
        toast({ title: wasShared ? "Paylaşım Kaldırıldı" : "Analiz Paylaşıldı!" });
        console.log("Toast çağrıldıktan hemen sonra.");
      } else { throw new Error(response.data.error); }
    } catch (error) { /* ... Hata mesajı ... */ }
  };

  const isMobile = () => {
    // Mobil cihaz tespiti için basit bir regex
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // MEVCUT handleCopyDeck fonksiyonunu AŞAĞIDAKİ İLE DEĞİŞTİR
  // (Bu fonksiyon artık isMobile() fonksiyonunu kullanacak)
  // Profile.jsx ve Decks.jsx dosyalarındaki
  // MEVCUT handleCopyDeck fonksiyonunu AŞAĞIDAKİ İLE DEĞİŞTİR:

  // Profile.jsx ve Decks.jsx dosyalarındaki
  // MEVCUT handleCopyDeck fonksiyonunu AŞAĞIDAKİ İLE DEĞİŞTİR:

  // Profile.jsx ve Decks.jsx dosyalarındaki
  // MEVCUT handleCopyDeck fonksiyonunu AŞAĞIDAKİ İLE DEĞİŞTİR:

  const handleCopyDeck = async (deck, analysisId) => {
    // 1. Destede kart var mı kontrol et
    if (!deck || deck.length === 0) {
      toast({ title: "Hata", description: "Destede kart bulunamadı.", variant: "destructive" });
      return;
    }

    // 2. Kart ID'lerini al
    let cardIds = [];
    for (const card of deck) {
      if (!card.id) {
        toast({ title: "Kopyalanamadı", description: "Bu destenin (eski veri) kart ID bilgisi eksik.", variant: "destructive" });
        return;
      }
      cardIds.push(card.id);
    }

    // 3. ID'leri noktalı virgülle birleştir
    const cardIdString = cardIds.join(';');
    // 8 kart için 8 tane "0" slot bilgisi
    const slotsString = '0;0;0;0;0;0;0;0';

    // 4. === SENİN SAĞLADIĞIN DOĞRU LİNK FORMATI ===
    // Bu, "https" wrapper'ı içinde "clashroyale://" deep link'ini barındırır.
    const correctDeckLink = `https://link.clashroyale.com/tr?clashroyale://copyDeck?deck=${cardIdString}&slots=${slotsString}`;


    // 5. === CİHAZ KONTROLÜ (Aynı kaldı) ===
    if (isMobile()) {
      // --- MOBİL CİHAZ ---
      // Bu linke yönlendirme, sunucudan oyunu açma komutunu tetiklemeli.
      toast({
        title: "Clash Royale Açılıyor...",
        description: "Deste oyuna aktarılıyor."
      });

      // Yönlendirmeyi yap
      window.location.href = correctDeckLink;

    } else {
      // --- MASAÜSTÜ CİHAZ ---
      // Linki panoya kopyala
      try {
        await navigator.clipboard.writeText(correctDeckLink);

        toast({
          title: "Deste Linki Kopyalandı!",
          description: "Masaüstünde olduğunuz için link panonuza kopyalandı."
        });

        // Butonun metnini 2 saniyeliğine değiştir
        setCopiedDeckId(analysisId);
        setTimeout(() => {
          setCopiedDeckId(null);
        }, 2000);

      } catch (err) {
        console.error('Failed to copy deck link: ', err);
        toast({ title: "Kopyalanamadı", description: "Panoya yazma izni alınamadı.", variant: "destructive" });
      }
    }
  };

  // --- Render ---

  // Ana yüklenme durumları (Auth, Kartlar, Profil Bilgisi)
  if (authLoading || loadingCards || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Giriş yapmamış ve kendi profiline bakmıyorsa veya kullanıcı bulunamadıysa mesaj göster
  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <Card className="p-8">
          <CardTitle>Profil Bulunamadı</CardTitle>
          <CardDescription className="mt-2">Görüntülemeye çalıştığınız profil bulunamadı veya giriş yapmanız gerekiyor.</CardDescription>
          <Button onClick={() => navigate('/login')} className="mt-4">Giriş Yap</Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Profil Bilgileri Kartı --- */}
        <Card className="mb-8 shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-blue-50 dark:from-blue-950/30 via-transparent to-transparent p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Sol Taraf: Avatar ve İsim */}
              <div className="flex items-center gap-4 sm:gap-6">
                <Dialog open={isProfilePicDialogOpen} onOpenChange={setIsProfilePicDialogOpen}>
                  <DialogTrigger asChild>
                    {isOwnProfile ? (
                      <div className="relative group cursor-pointer flex-shrink-0">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-blue-500/30 border-2 border-white dark:border-gray-900">
                          <AvatarImage src={profileUser.profile_picture_url} alt={profileUser.username} className="object-cover" />
                          <AvatarFallback className="text-2xl avatar-fallback-gradient">
                            {profileUser.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isOwnProfile && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Edit className="h-6 w-6 text-white" />
                          </div>)}
                      </div>
                    ) : (
                      <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-blue-500/30 border-2 border-white dark:border-gray-900 flex-shrink-0">
                        <AvatarImage src={profileUser.profile_picture_url} alt={profileUser.username} className="object-cover" />
                        <AvatarFallback className="text-2xl avatar-fallback-gradient">
                          {profileUser.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </DialogTrigger>
                  {/* Profil Resmi Güncelleme Dialog'u */}
                  {isOwnProfile && (
                    <DialogContent>
                      <DialogHeader><DialogTitle>Profil Resmini Güncelle</DialogTitle><DialogDescription>Resminizin URL adresini girin.</DialogDescription></DialogHeader>
                      <div className="space-y-4 py-4">
                        <Label htmlFor="profilePicUrl">Resim URL</Label>
                        <Input id="profilePicUrl" value={profilePicUrl} onChange={(e) => setProfilePicUrl(e.target.value)} placeholder="https://..." />
                        <Button onClick={handleProfilePicUpdate} className="w-full">Güncelle</Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>

                {/* İsim, Email ve Premium Rozeti */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {editingUsername && isOwnProfile ? (
                      <div className="flex items-center gap-2">
                        <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="h-9" maxLength={20} />
                        <Button size="sm" onClick={handleUsernameUpdate}>Kaydet</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingUsername(false); setNewUsername(profileUser.username || ''); }}>İptal</Button>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-2xl sm:text-3xl font-bold">{profileUser.username || 'Kullanıcı'}</CardTitle>
                        {isOwnProfile && (
                          <Button size="icon" variant="ghost" onClick={() => setEditingUsername(true)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  {isOwnProfile ? (
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400">{profileUser.email || 'E-posta yok'}</CardDescription>
                  ) : (
                    <CardDescription className="... italic">E-posta Gizli</CardDescription>
                  )}
                  {profileUser.is_premium && (
                    <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white flex items-center gap-1 shadow-sm border border-yellow-600/50">
                      <Crown className="h-3 w-3" /> Premium
                    </Badge>
                  )}
                </div>
              </div>

              {/* Sağ Taraf: Premium Yükseltme Butonu (Sadece kendi profili ve premium değilse) */}
              {!profileUser.is_premium && isOwnProfile && (
                <Button onClick={() => navigate('/premium')} className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Zap className="mr-2 h-4 w-4" />
                  Premium'a Yükselt
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* --- Kaydedilmiş Analizler Bölümü --- */}
        <div className="space-y-6 mt-12">
          {(isOwnProfile || (!loadingAnalyses && analyses.length > 0)) && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-300 dark:border-gray-700">
              {isOwnProfile ? 'Kaydedilmiş Analizler' : 'Paylaşılan Analizler'}
            </h2>
          )}

          {loadingAnalyses ? (
            <div className="flex justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
          ) : analyses.length === 0 ? (isOwnProfile ? (
            <Card className="shadow-lg border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="py-16 text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-4">Henüz kaydedilmiş bir analiziniz yok.</p>
                <Button onClick={() => navigate('/analyzer')}>İlk Analizini Yap</Button>
              </CardContent>
            </Card>) : (<Card> </Card>)
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ArrowDownUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Deste Analizi
                      </CardTitle>
                      {analysis.is_shared ? (
                        <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                          <Share2 className="h-3 w-3 mr-1" /> Paylaşıldı
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Özel</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1.5 text-xs pt-1">
                      <Calendar className="h-3 w-3" />
                      {analysis.timestamp ? new Date(analysis.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tarih Yok'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    {/* Deste */}
                    <div className="grid grid-cols-4 gap-2">
                      {analysis.original_deck
                        // === YENİ SIRALAMA KODU BAŞLANGICI ===
                        .slice() // Orijinal diziyi değiştirmemek için kopyala
                        .sort((a, b) => {
                          // Kartların evrim durumu (varsa 1, yoksa 0)
                          const aIsEvo = a?.evolutionLevel > 0 ? 1 : 0;
                          const bIsEvo = b?.evolutionLevel > 0 ? 1 : 0;

                          // b'yi a'nın önüne al (yani evoları başa topla)
                          return bIsEvo - aIsEvo;
                        }).map((card, idx) => {
                          // === YENİ BASİT MANTIK ===
                          const isEvolved = card?.evolutionLevel > 0;
                          const imageUrl = (isEvolved && card.iconUrls?.evolutionMedium)
                            ? card.iconUrls.evolutionMedium
                            : card.iconUrls?.medium;
                          const currentCardName = card?.name;
                          // === MANTIK SONU ===

                          return imageUrl ? ( // Resim URL'si varsa
                            <div key={idx} className="relative aspect-[3/4]">
                              <img
                                src={imageUrl} // <-- Doğru resim URL'i burada
                                alt={currentCardName || 'Kart'}
                                className="w-full h-full object-contain rounded border border-gray-300 dark:border-gray-700" // <-- Çerçeve/border artık normal
                              />
                              {analysis.card_to_remove === currentCardName && (
                                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center rounded">
                                  <i className="fa-solid fa-minus text-white text-3xl"></i>
                                </div>
                              )}
                            </div>
                          ) : ( // Resim URL'si yoksa placeholder
                            <div key={idx} className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded text-xs flex items-center justify-center text-center text-gray-500 p-1">
                              {currentCardName || '?'}
                            </div>
                          );
                        })}
                    </div>
                    {/* Değişim */}
                    <div className="text-sm space-y-2 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50 flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><i className="fa-solid fa-minus text-red-500 w-3"></i> Çıkar:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">{analysis.card_to_remove || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><i className="fa-solid fa-plus text-green-500 w-3"></i> Ekle:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{analysis.card_to_add || '-'}</span>
                      </div>
                      <Separator className="my-2 bg-blue-200 dark:bg-blue-800/50" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><img src="https://cdn.royaleapi.com/static/img/ui/elixir.png" alt="Elixir" className="w-4 h-4" /> Ort. İksir:</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{analysis.original_avg_elixir || '?'} → {analysis.new_avg_elixir || '?'}</span>
                      </div>
                    </div>
                    {/* Butonlar (Sadece kendi profili ise) */}
                    {isOwnProfile && (
                      <div className="flex gap-2 pt-2 mt-auto">

                        {/* Paylaş Butonu (Mevcut) */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleShare(analysis.id)}
                          className="flex-1 text-xs"
                        >
                          {analysis.is_shared ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
                          {analysis.is_shared ? 'Paylaşımı Kaldır' : 'Paylaş'}
                        </Button>

                        {/* === YENİ KOPYALA BUTONU === */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyDeck(analysis.original_deck, analysis.id)}
                          className="flex-1 text-xs"
                        >
                          {copiedDeckId === analysis.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Kopyalandı
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Kopyala
                            </>
                          )}
                        </Button>
                        {/* === BUTON SONU === */}
                        {/* === SİLME BUTONU GÜNCELLEMESİ === */}
                        <AlertDialog open={isDeleteDialogOpen && analysisToDelete === analysis.id} onOpenChange={(open) => { if (!open) setAnalysisToDelete(null); setIsDeleteDialogOpen(open); }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                // API'yi HEMEN ÇAĞIRMA! Sadece ID'yi sakla ve state'i ayarla.
                                setAnalysisToDelete(analysis.id);
                                // setIsDeleteDialogOpen(true); // Bu satıra gerek yok, Trigger zaten açar
                              }}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Sil</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu analiz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setAnalysisToDelete(null)}>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => confirmDeleteAnalysis()}
                                className="bg-red-600 hover:bg-red-700" // Yıkıcı eylem stili
                              >
                                Evet, Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {/* === GÜNCELLEME SONU === */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};