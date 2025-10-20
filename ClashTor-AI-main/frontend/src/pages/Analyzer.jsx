import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios kullanacağız
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Search, ArrowRight, Crown, TrendingUp, AlertCircle, Sparkles, ArrowDownUp, Save, Zap, Loader2, Info, Check } from 'lucide-react'; // Loader2 ve Info ikonlarını ekledik
import { useToast } from '../hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
// Mock veriyi artık import etmeyeceğiz, API'den gelecek
// import { mockPlayerInfo, mockAnalysisResult, mockCards } from '../mock';

// Örnek: Profile.jsx (ve diğer tüm React dosyalarınızda)
// const API_BASE_URL = 'http://localhost:5000'; // Eski sabit kodlanmış adres

// YENİ DİNAMİK ADRES:
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const Analyzer = () => {
  const { user, loading: authLoading } = useAuth(); // Auth context'ten kullanıcı ve yüklenme durumu
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false); // Analiz yüklenme durumu
  const [analysisData, setAnalysisData] = useState(null); // API'den gelen tüm sonuçlar
  const [errorInfo, setErrorInfo] = useState(null); // API'den gelen yapısal hata
  const [isSaving, setIsSaving] = useState(false); // YENİ: Kaydetme işlemi sırasındaki yüklenme durumu
  const [isSaved, setIsSaved] = useState(false);
  const [analyzeMode, setAnalyzeMode] = useState('most_frequent');

  // AuthContext yüklenirken veya kullanıcı yoksa bekle veya yönlendir
  // Analyzer.jsx içinde
  useEffect(() => {
    // AuthContext yüklenirken bekle
    if (authLoading) return;

    // Yüklenme bittikten sonra KISA BİR GECİKME EKLE
    const timer = setTimeout(() => {
      if (!user) { // Gecikmeden SONRA hala user yoksa yönlendir
        toast({
          title: "Lütfen Giriş Yapın", // Türkçe Başlık
          description: "Analizörü kullanmak için giriş yapmanız gerekmektedir.", // Türkçe Açıklama
          variant: "destructive"
        });
        navigate('/login');
      }
    }, 100); // 100 milisaniye bekle (ayarlanabilir)

    // Component unmount olduğunda timer'ı temizle
    return () => clearTimeout(timer);

  }, [user, authLoading, navigate, toast]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setErrorInfo(null); // Önceki hatayı temizle
    setAnalysisData(null); // Önceki sonucu temizle
    setIsSaved(false); // Yeni analizde kaydetme durumunu sıfırla

    if (!user) { // Teorik olarak useEffect yönlendirir ama ekstra kontrol
      navigate('/login');
      return;
    }

    // Premium kontrolünü frontend'de de yapabiliriz (opsiyonel ama iyi UX)
    if (user.has_used_free_analysis && !user.is_premium) {
      setErrorInfo({
        title: "Analysis Limit Reached",
        message: "You've used your free analysis. Upgrade to Premium for unlimited access."
      });
      return; // API'ye istek atmadan dur
    }

    if (!playerTag.trim()) {
      setErrorInfo({ title: "Player Tag Required", message: "Please enter a player tag to analyze." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`,
        { 
          player_tag: playerTag,
          analyze_mode: analyzeMode // <--- DÜZELTME: Seçili modu buraya ekleyin
        }, // Veriyi JSON olarak gönderiyoruz
        { withCredentials: true }
      );
      setAnalysisData(response.data);// Başarılı cevabı state'e ata
      toast({ title: "Analiz Tamamlandı!", description: "Desteniz analiz edildi." });
    } catch (error) {
      console.error("Analysis API Error:", error.response?.data || error);
      if (error.response?.data?.error_info) {
        setErrorInfo(error.response.data.error_info); // Backend'den gelen yapısal hatayı kullan
        if (error.response.status === 403) { // Limit dolduysa Premium'a yönlendirme butonu için özel durum
          //setErrorInfo içinde mesaj zaten var
        }
      } else {
        setErrorInfo({ title: "Analysis Failed", message: "An unexpected error occurred. Please try again later." });
      }
      toast({ title: "Analysis Failed", description: errorInfo?.message || "Could not analyze the deck.", variant: "destructive" });
    } finally {
      setLoading(false);
      setIsSaved(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysisData || !analysisData.deck_cards || isSaved) return; // Zaten kaydedilmişse tekrar yapma

    setIsSaving(true); // Kaydetme işlemini başlat

    const cardNames = analysisData.deck_cards.map(card => card.name);

    try {
      const response = await axios.post(`${API_BASE_URL}/save-analysis`,
        {
          original_deck: cardNames,
          card_to_remove: analysisData.card_swap_info.remove,
          card_to_add: analysisData.card_swap_info.add,
          original_avg_elixir: analysisData.elixir_info.original,
          new_avg_elixir: analysisData.elixir_info.new || analysisData.elixir_info.original
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // --- BAŞARI DURUMU ---
        toast({ // Önce toast'ı göster
          title: "Analiz Kaydedildi!",
          description: "Profil sayfanızda görebilirsiniz."
        });
        setIsSaved(true); // Kaydedildi olarak işaretle
        // --- ---
      } else {
        throw new Error(response.data.error || 'Analiz kaydedilemedi.');
      }
    } catch (error) {
      // --- HATA DURUMU ---
      console.error("Save Analysis Error:", error);
      toast({
        title: "Kaydetme Başarısız",
        description: error.message || "Analiz kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
      // İsteğe bağlı: Hata sonrası butonu tekrar denenebilir hale getir
      // setIsSaved(false); // Bunu yaparsan kullanıcı tekrar deneyebilir
      // --- ---
    } finally {
      setIsSaving(false); // Kaydetme işlemini bitir (başarılı veya başarısız)
    }
  };

  // AuthContext hala yükleniyorsa veya kullanıcı yoksa boş içerik göster
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 pt-20 pb-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === BAŞLANGIÇ EKRANI (Analiz öncesi) === */}
        {!analysisData && !errorInfo && (
          <Card className="max-w-2xl mx-auto mb-12 shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="h-6 w-6 text-blue-600" />
                Deste Analizörü
              </CardTitle>
              <CardDescription>
                Yapay zeka önerileri için oyuncu etiketini gir. Format: #9VPR8GVY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="#9VPR8GVY"
                    value={playerTag}
                    onChange={(e) => setPlayerTag(e.target.value)}
                    className="flex-1 text-lg py-6 px-4" // Daha büyük input
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || (user.has_used_free_analysis && !user.is_premium)} // Limiti kontrol et
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-6 text-base" // Buton boyutu
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Analiz Et
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
                {/* --- YENİ: Analiz Modu Seçimi --- */}
                <RadioGroup
                  defaultValue="most_frequent"
                  value={analyzeMode}
                  onValueChange={setAnalyzeMode} // Seçim değiştiğinde state'i güncelle
                  className="flex flex-col sm:flex-row gap-4 pt-2"
                  disabled={loading} // Yüklenirken devre dışı bırak
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="most_frequent" id="mode-most-frequent" />
                    <Label htmlFor="mode-most-frequent" className="cursor-pointer">En Çok Oynanan Deste</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last" id="mode-last" />
                    <Label htmlFor="mode-last" className="cursor-pointer">Son Maçtaki Deste</Label>
                  </div>
                </RadioGroup>
                {/* --- YENİ SONU --- */}
                {/* Kullanıcı Durum Mesajı */}
                <div className="text-sm mt-3 flex items-center gap-2 px-1">
                  {user.is_premium ? (
                    <span className="text-green-600 dark:text-green-400"><i className="fa-solid fa-gem mr-1"></i> Premium Aktif: Sınırsız analiz.</span>
                  ) : user.has_used_free_analysis ? (
                    <span className="text-red-600 dark:text-red-400"><AlertCircle className="inline h-4 w-4 mr-1" /> Ücretsiz hakkınız doldu.</span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400"><Info className="inline h-4 w-4 mr-1" /> 1 ücretsiz analiz hakkınız kaldı.</span>
                  )}
                </div>
                {/* Limit dolduysa Premium butonu */}
                {user.has_used_free_analysis && !user.is_premium && (
                  <Button variant="outline" onClick={() => navigate('/premium')} className="w-full mt-4 border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/20">
                    <Zap className="h-4 w-4 mr-2" />
                    Premium'a Yükselt
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* === HATA EKRANI === */}
        {errorInfo && (
          <Card className="max-w-2xl mx-auto mb-12 shadow-lg border-red-500/50 dark:border-red-500/50 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
                {errorInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-400 mb-4">{errorInfo.message}</p>
              {/* Eğer hata limit dolmasıysa, Premium'a yükselt butonu göster */}
              {errorInfo.title === "Analiz Limiti Doldu" && (
                <Button onClick={() => navigate('/premium')} className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white">
                  <Zap className="mr-2 h-4 w-4" />
                  Premium'a Yükselt
                </Button>
              )}
              {/* Başka hatalar için tekrar deneme veya geri butonu */}
              {errorInfo.title !== "Analiz Limiti Doldu" && (
                <Button variant="outline" onClick={() => { setErrorInfo(null); setPlayerTag(''); }}>
                  Tekrar Dene
                </Button>
              )}
            </CardContent>
          </Card>
        )}


        {/* === SONUÇ EKRANI === */}
        {analysisData && !errorInfo && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Analiz Sonuçları</h2>
              <p className="text-gray-600 dark:text-gray-400">
                ({analysisData.analyzed_mode === 'last' ? 'Son Maçtaki Deste' : 'En Çok Oynanan Deste'})
              </p>
            </div>
            {/* --- Oyuncu Bilgisi --- */}
            {analysisData.player_info && (
              <Card className="shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Crown className="h-6 w-6 text-yellow-500" />
                        {analysisData.player_info.name}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {analysisData.player_tag_value} {/* API'den gelen etiket */}
                        {analysisData.player_info.arena?.name && ` • ${analysisData.player_info.arena.name}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysisData.player_info.trophies}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Kupa</div>
                      </div>
                      {analysisData.player_info.clan?.name && (
                        <div className="text-center">
                          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">{analysisData.player_info.clan.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Klan</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* --- Son Savaş Detayları --- */}
            {analysisData.last_battle_details && (
              <Card className="shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Son Ladder Savaşı</CardTitle>
                  <CardDescription>{analysisData.last_battle_details.game_mode}</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const playerCrowns = analysisData.last_battle_details.player_team.crowns;
                    const opponentCrowns = analysisData.last_battle_details.opponent_team.crowns;
                    let resultText = "Beraberlik";
                    let resultClass = "text-gray-500 dark:text-gray-400";
                    if (playerCrowns > opponentCrowns) { resultText = "Zafer"; resultClass = "text-green-600 dark:text-green-400"; }
                    else if (playerCrowns < opponentCrowns) { resultText = "Bozgun"; resultClass = "text-red-600 dark:text-red-400"; }
                    return <div className={`text-center text-xl font-bold mb-4 ${resultClass}`}>{resultText} ({playerCrowns} - {opponentCrowns})</div>;
                  })()}
                  <div className="flex flex-col md:flex-row items-center justify-around gap-4">
                    {/* Oyuncu Takımı */}
                    <div className="text-center">
                      <p className="font-semibold mb-2">{analysisData.last_battle_details.player_team.name}</p>
                      <div className="grid grid-cols-4 gap-1 w-64 mx-auto">
                        {analysisData.last_battle_details.player_team.cards.map((card, idx) => (
                          <img key={idx} src={card.iconUrls.medium} alt={card.name} className="w-full rounded border border-gray-300 dark:border-gray-700" />
                        ))}
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-20 hidden md:block" />
                    {/* Rakip Takım */}
                    <div className="text-center">
                      <p className="font-semibold mb-2">{analysisData.last_battle_details.opponent_team.name}</p>
                      <div className="grid grid-cols-4 gap-1 w-64 mx-auto">
                        {analysisData.last_battle_details.opponent_team.cards.map((card, idx) => (
                          <img key={idx} src={card.iconUrls.medium} alt={card.name} className="w-full rounded border border-gray-300 dark:border-gray-700" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* --- Önerilen Değişiklik --- */}
            {analysisData.card_swap_info && analysisData.card_swap_info.remove && analysisData.card_swap_info.add && (
              <Card className="shadow-xl border-blue-500 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDownUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Önerilen Değişiklik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-8">
                    {/* Çıkarılacak Kart */}
                    <div className="text-center flex flex-col items-center">
                      <div className="w-24 h-auto sm:w-32 rounded-xl overflow-hidden border-4 border-red-500 shadow-lg mb-2">
                        {analysisData.deck_cards.find(c => c.name === analysisData.card_swap_info.remove) ?
                          <img src={analysisData.deck_cards.find(c => c.name === analysisData.card_swap_info.remove).iconUrls.medium} alt={analysisData.card_swap_info.remove} className="w-full h-full object-contain" />
                          : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">Kart Resmi Yok</div>
                        }
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{analysisData.card_swap_info.remove}</div>
                      <Badge variant="destructive" className="mt-1 text-xs">Çıkar</Badge>
                    </div>

                    <ArrowRight className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400 my-4 sm:my-0" />

                    {/* Eklenecek Kart */}
                    <div className="text-center flex flex-col items-center">
                      <div className="w-24 h-auto sm:w-32 rounded-xl overflow-hidden border-4 border-green-500 shadow-lg mb-2">
                        {/* === DEĞİŞİKLİK BURADA === */}
                        {analysisData.added_card_details ?
                          <img
                            src={analysisData.added_card_details.iconUrls?.medium || ''}
                            alt={analysisData.card_swap_info.add}
                            className="w-full h-full object-contain"
                          />
                          : <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-xs text-gray-500 p-2">Resim Yok</div>
                        }
                        {/* === DEĞİŞİKLİK SONU === */}
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{analysisData.card_swap_info.add}</div>
                      <Badge className="mt-1 text-xs bg-green-600 hover:bg-green-700">Ekle</Badge>
                    </div>
                  </div>

                  <Separator className="my-6 bg-blue-200 dark:bg-blue-800" />

                  <div className="flex justify-center items-center gap-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ort. İksir:</span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {analysisData.elixir_info.original} → {analysisData.elixir_info.new || analysisData.elixir_info.original}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* --- AI Analizi --- */}
            {analysisData.analysis_result_html && (
              <Card className="shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    AI Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* HTML içeriğini güvenli bir şekilde render et */}
                  <div
                    className="prose dark:prose-invert max-w-none ai-analysis-content"
                    dangerouslySetInnerHTML={{ __html: analysisData.analysis_result_html.replace(/DEĞİŞİM:.*$/gm, '') }}
                  />

                  {/* Kaydetme Butonu */}
                  {analysisData.card_swap_info && analysisData.card_swap_info.remove && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        id="save-analysis-btn-id" /* ID ekledik (opsiyonel) */
                        onClick={handleSaveAnalysis}
                        disabled={isSaving || isSaved} /* Kaydederken veya kaydedilmişse devre dışı */
                        className={`flex items-center gap-2 text-white transition-colors duration-200 ${isSaved
                          ? 'bg-gray-500 cursor-not-allowed' /* Kaydedildi rengi */
                          : 'bg-green-600 hover:bg-green-700' /* Normal renk */
                          }`}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" /> /* Kaydediliyor ikonu */
                        ) : isSaved ? (
                          <Check className="h-4 w-4" /> /* Kaydedildi ikonu */
                        ) : (
                          <Save className="h-4 w-4" /> /* Normal ikon */
                        )}
                        {isSaving ? 'Kaydediliyor...' : isSaved ? 'Kaydedildi' : 'Analizi Kaydet'}
                      </Button>
                      {!user?.is_premium && (
                        <Button variant="outline" onClick={() => navigate('/premium')} className="flex items-center gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/20">
                          <Zap className="h-4 w-4" />
                          Premium'a Yükselt
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        )}
      </div>
    </div>
  );
};