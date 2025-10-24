import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios import et
import { useAuth } from '../contexts/AuthContext'; // Gerekirse kullanıcı bilgisi için
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator'; // Separator eklendi
import { Calendar, Share2, ArrowDownUp, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast'; // Hata gösterimi için
import { Link } from 'react-router-dom';
import { mockCards } from '../mock'; // Kart resimleri için geçici olarak kullanılıyor

// Örnek: Profile.jsx (ve diğer tüm React dosyalarınızda)
// const API_BASE_URL = 'http://localhost:5000'; // Eski sabit kodlanmış adres

// YENİ DİNAMİK ADRES:
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const Decks = () => {
  const { user } = useAuth(); // Gerekirse kullanıcı bilgisi için
  const { toast } = useToast();
  const [copiedDeckId, setCopiedDeckId] = useState(null);

  // --- YENİ: State'ler ---
  const [sharedAnalyses, setSharedAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCards, setAllCards] = useState(null); // Kart resimleri için
  const [loadingCards, setLoadingCards] = useState(true);

  // --- YENİ: API'den Veri Çekme ---
  useEffect(() => {
    const fetchData = async () => {
      // Önce Kartlar
      setLoadingCards(true);
      try {
        const cardsResponse = await axios.get(`${API_BASE_URL}/api/cards`);
        setAllCards(cardsResponse.data);
      } catch (error) {
        console.error("Kart verileri çekilirken hata:", error);
        setAllCards({}); // Hata durumunda boş obje
      } finally {
        setLoadingCards(false);
      }

      // Sonra Paylaşılan Desteler
      setLoading(true);
      try {
        // Not: /api/decks rotası giriş gerektirmiyor olabilir, backend'e bağlı.
        // Gerekirse withCredentials eklenebilir.
        const response = await axios.get(`${API_BASE_URL}/api/decks`);
        setSharedAnalyses(response.data);
      } catch (error) {
        console.error("Paylaşılan desteler çekilirken hata:", error);
        toast({ title: "Hata", description: "Paylaşılan desteler yüklenemedi.", variant: "destructive" });
        setSharedAnalyses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]); // Bağımlılıkları ekle

  // --- Render ---
  if (loading || loadingCards) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Decks.jsx -> Decks fonksiyonunun içine

  const isMobile = () => {
    // Mobil cihaz tespiti için basit bir regex
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };



  // Profile.jsx ve Decks.jsx dosyalarındaki
  // MEVCUT handleCopyDeck fonksiyonunu AŞAĞIDAKİ İLE DEĞİŞTİR:
  // ('isMobile' fonksiyonu aynı kalabilir)

  const handleCopyDeck = async (deck, analysisId) => {
    // 1. Deste var mı kontrol et
    if (!deck || deck.length === 0) {
      toast({ title: "Hata", description: "Destede kart bulunamadı.", variant: "destructive" });
      return;
    }

    // 2. Kart ID'lerini al
    let cardIds = [];
    for (const card of deck) {
      if (!card.id) {
        // Player tag'a ihtiyacımız kalmadığı için bu eski kayıtlar da çalışacak!
        toast({ title: "Kopyalanamadı", description: "Bu destenin (eski veri) kart ID bilgisi eksik.", variant: "destructive" });
        return;
      }
      cardIds.push(card.id);
    }
    const cardIdString = cardIds.join(';');

    // 3. === SİTEDE GÖRDÜĞÜN LİNKE GÖRE PARAMETRELER ===
    const slotsString = '0;0;0;0;0;0;0;0'; // 8 slot
    const staticL = 'Royals';
    const staticTT = '159000002'; // Sitede gördüğün varsayılan token

    // 4. === NİHAİ LİNK FORMATI ===
    // /en/ yolunu ve l, slots, tt parametrelerini kullanıyoruz.
    const deckLink = `https://link.clashroyale.com/en/?clashroyale://copyDeck?deck=${cardIdString}&l=${staticL}&slots=${slotsString}&tt=${staticTT}`;


    // 5. === CİHAZ KONTROLÜ (Aynı kaldı) ===
    if (isMobile()) {
      // --- MOBİL CİHAZ ---
      toast({
        title: "Clash Royale Açılıyor...",
        description: "Deste oyuna aktarılıyor."
      });
      window.location.href = deckLink;

    } else {
      // --- MASAÜSTÜ CİHAZ ---
      try {
        await navigator.clipboard.writeText(deckLink);
        toast({
          title: "Deste Linki Kopyalandı!",
          description: "Masaüstünde olduğunuz için link panonuza kopyalandı."
        });
        setCopiedDeckId(analysisId);
        setTimeout(() => setCopiedDeckId(null), 2000);
      } catch (err) {
        toast({ title: "Kopyalanamadı", description: "Panoya yazma izni alınamadı.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Topluluk Desteleri</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Topluluk tarafından paylaşılan başarılı deste yapılarını ve AI önerilerini keşfedin.
          </p>
        </div>

        {sharedAnalyses.length === 0 ? (
          <Card className="shadow-xl border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardContent className="py-16 text-center text-gray-500 dark:text-gray-400">
              Henüz kimse deste paylaşmadı. İlk paylaşan sen ol!
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedAnalyses.map((analysis) => (
              <Card key={analysis.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col">
                <CardHeader className="pb-4">
                  {/* Kullanıcı Bilgisi */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 group">
                      <Link
                        to={`/profile/${analysis.user_info?.username}`}
                        // hover:opacity-80 yerine renk değişimi ve geçiş eklendi
                        className="hover:opacity-80 transition-opacity rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label={`${analysis.user_info?.username} profiline git`}
                      >
                        <Avatar className="h-8 w-8 ring-1 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all"> {/* group-hover eklendi */}
                          <AvatarImage src={analysis.user_info?.profile_picture_url} alt={analysis.user_info?.username} />
                          <AvatarFallback className="text-xs avatar-fallback-gradient">
                            {analysis.user_info?.username?.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      {/* === === */}
                      <div>
                        {/* === YENİ: Link eklendi (Username) === */}
                        <Link
                          to={`/profile/${analysis.user_info?.username}`}
                          // hover:underline kaldırıldı, renk değişimi ve geçiş eklendi
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                        >
                          {analysis.user_info?.username || 'Bilinmiyor'}
                        </Link>
                        {/* === === */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5"> {/* mt-0.5 eklendi */}
                          <Calendar className="h-3 w-3" />
                          {analysis.timestamp ? new Date(analysis.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </div>
                    </div>
                    {/* Paylaşım Rozeti (API sadece paylaşılanları döndürdüğü için her zaman görünmeli) */}
                    <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 text-xs">
                      <Share2 className="h-3 w-3 mr-1" /> Paylaşıldı
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <ArrowDownUp className="h-4 w-4 text-blue-600" />
                    AI Önerisi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  {/* Deste */}
                  <div className="grid grid-cols-4 gap-2">
                    {analysis.original_deck && analysis.original_deck
                      // === YENİ SIRALAMA KODU BAŞLANGICI ===
                      .slice() // 1. Orijinal diziyi kopyala
                      .sort((a, b) => { // 2. Kopyayı sırala
                        const aIsEvo = a?.evolutionLevel > 0 ? 1 : 0;
                        const bIsEvo = b?.evolutionLevel > 0 ? 1 : 0;
                        return bIsEvo - aIsEvo;
                      })
                      // === YENİ SIRALAMA KODU SONU ===
                      .slice(0, 8) // 3. Sıralanmış diziden ilk 8'i al (bu satır zaten vardı)
                      .map((card, idx) => {
                        // === YENİ BASİT MANTIK ===
                        const isEvolved = card?.evolutionLevel > 0;
                        // Evrimleşmişse 'evolutionMedium' URL'ini, değilse 'medium' URL'ini al
                        const imageUrl = (isEvolved && card.iconUrls?.evolutionMedium)
                          ? card.iconUrls.evolutionMedium
                          : card.iconUrls?.medium;
                        const currentCardName = card?.name;
                        // === MANTIK SONU ===

                        return imageUrl ? (
                          // Eğer resim varsa, IMG etiketini render et
                          <div key={idx} className="relative aspect-[3/4]">
                            <img
                              src={imageUrl} // <-- Doğru resim URL'i burada
                              alt={currentCardName || 'Kart'}
                              className="w-full h-full object-contain rounded border border-gray-300 dark:border-gray-700" // <-- Çerçeve/border artık normal
                            />
                            {analysis.card_to_remove === currentCardName && (
                              <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center rounded">
                                <i className="fa-solid fa-minus text-white text-xl"></i>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Eğer resim YOKSA, yer tutucuyu render et
                          <div key={idx} className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded text-xs flex items-center justify-center text-center text-gray-500 p-1">
                            {currentCardName || '?'}
                          </div>
                        );
                      })}
                  </div>
                  {/* === YENİ: KARTIN ALT KISMI (mt-auto ile alta itilir) === */}
                  <div className="mt-auto space-y-4 pt-4"> {/* pt-4 boşluk için */}

                    {/* Değişim Bilgisi (Eski div'i buraya taşı) */}
                    <div className="text-sm space-y-2 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <div className="flex justify-between items-center"><span>Çıkar:</span><span className="font-medium text-red-600 dark:text-red-400">{analysis.card_to_remove || '-'}</span></div>
                      <div className="flex justify-between items-center"><span>Ekle:</span><span className="font-medium text-green-600 dark:text-green-400">{analysis.card_to_add || '-'}</span></div>
                      <Separator className="my-2 bg-blue-200 dark:bg-blue-800/50" />
                      <div className="flex justify-between items-center"><span>Ort. İksir:</span><span className="font-semibold text-blue-700 dark:text-blue-300">{analysis.original_avg_elixir || '?'} → {analysis.new_avg_elixir || '?'}</span></div>
                    </div>

                    {/* === YENİ Kopyala Butonu === */}
                    <Button
                      onClick={() => handleCopyDeck(analysis.original_deck, analysis.id)}
                      variant="outline"
                      className="w-full"
                    >
                      {copiedDeckId === analysis.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Kopyalandı!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Desteyi Oyuna Kopyala
                        </>
                      )}
                    </Button>
                    {/* === YENİ KOPYALA BUTONU SONU === */}
                  </div>
                  {/* === YENİ WRAPPER SONU === */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};