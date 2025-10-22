import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowDownUp, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

// --- STATİK AI ANALİZ ÖRNEĞİ ---
// Bu metni, kendi yaptığınız gerçek bir analizden kopyalayıp yapıştırın.
const MOCK_AI_OUTPUT = `
### Deste Özeti
Bu deste, X-Bow ve Roket kartları etrafında dönen, düşük iksir ortalamasına (2.9) sahip hızlı bir döngü destesi (Cycle Deck) olarak tasarlanmıştır. Erken oyunda Goblin Fıçısı ve İskeletler ile rakibi baskı altına alırken, asıl amacı X-Bow'u korumaktır. Savunma için Valkür ve İskelet Ordusu gibi yer birliklerini kullanır.

### En Büyük Zayıflık
Deste Zayıflığı: Analiz edilen maçlarda en çok "Mega Knight" ve "P.E.K.K.A" kartlarına karşı kaybedilmiş. Bu, destenin yüksek canlı tankları durdurmakta zorlandığını gösteriyor. Valkür, tanklara karşı yetersiz kalmaktadır.

### Önerilen Değişiklik
Bu deste tanklara karşı çok zayıf olduğu için, ağır vuran ve hem karadan hem havadan savunma yapabilen bir kart eklenmelidir. Düşük iksir maliyetini korumak için, Yüksek Canlı Birlik ile değiştirme önerilir.
DEĞİŞİM: Valkyrie -> Ice Golem
`;

// Bu AI çıktısı formatına göre (sizin formatınız), değişim bilgilerini çıkaralım:
const getSwapInfo = (output) => {
    const match = output.match(/DEĞİŞİM:\s*(.*?)\s*->\s*(.*)/i);
    return match ? { remove: match[1].trim(), add: match[2].trim() } : { remove: "Valkyrie", add: "Ice Golem" };
};

const swapInfo = getSwapInfo(MOCK_AI_OUTPUT);


export const ExampleAnalysis = () => {

    // Gerçek AI çıktısı burada HTML olarak gösterilir
    const analysisHtml = MOCK_AI_OUTPUT.replace(/\n/g, '<br/>');

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                        Giriş Yapmadan Önce AI Analiz Örneği
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Uygulamamızın tam gücünü görmek ister misiniz? İşte bir oyuncunun destesi için yapay zekamızın ürettiği örnek sonuç.
                    </p>
                </div>

                {/* --- ÖNERİ KARTI (Temel Kart Değişimi) --- */}
                <Card className="shadow-xl border-blue-500 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 mb-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <ArrowDownUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            AI Önerisi: Tek Kart Değişimi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center gap-4 text-xl font-bold text-gray-900 dark:text-white">
                            <Badge variant="destructive" className="text-base p-2">ÇIKAR: {swapInfo.remove}</Badge>
                            <ArrowRight className="h-6 w-6 text-blue-600" />
                            <Badge className="bg-green-600 hover:bg-green-700 text-base p-2">EKLE: {swapInfo.add}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* --- AI TAM METİN ANALİZİ --- */}
                <Card className="shadow-xl border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            Detaylı Yapay Zeka Raporu
                        </CardTitle>
                        <CardDescription>Bu çıktı, gerçek maç verilerine dayanmaktadır.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="prose dark:prose-invert max-w-none ai-analysis-content"
                            dangerouslySetInnerHTML={{ __html: analysisHtml }}
                        />
                    </CardContent>
                </Card>
        

                {/* --- CTA - Giriş Yap Butonu --- */}
                <div className="text-center mt-10">
                    {/* KRİTİK: Link'e w-full sm:w-auto ekle */}
                    <Link to="/register" className="w-full sm:w-auto inline-block">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
                        >
                            Hemen Kayıt Ol ve Analizini Başlat
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};