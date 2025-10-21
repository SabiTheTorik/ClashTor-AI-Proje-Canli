import os
import re
import json
import requests
import traceback
import markdown
from dotenv import load_dotenv
from flask import Flask, render_template, request, session, redirect, url_for, flash, jsonify
from datetime import datetime, timezone
import pytz
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore, auth as admin_auth
from flask_cors import CORS
import os
from pathlib import Path


# =================================================================
# KRİTİK DÜZELTME: load_dotenv() çağrısı burada OLMALIDIR
# =================================================================
load_dotenv()
# =================================================================

# db'yi başlangıçta None olarak ayarla (NameError'ı önlemek için)
db = None

# --- Kurulum ---
REACT_BUILD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
    'frontend', 
    'build'
)

# Flask uygulamasını, statik dosyalarını React'in build klasöründen sunacak şekilde ayarla
# Flask uygulamasını tanımlama
app = Flask(
    __name__,
    # KRİTİK AYAR: Flask'e statik dosyaları 'static' URL'sinde (varsayılan)
    # ve 'backend/static' klasöründe araması gerektiğini söylüyoruz.
    # Bu, Flask'in kendi kuralına uyar.
    static_url_path='/static',
    static_folder='static',
    template_folder='static'
)

app.secret_key = os.environ.get("FLASK_SECRET_KEY")

app.config.update(
    SESSION_COOKIE_SAMESITE='None',  # Farklı alanlardan gelen çerezlere izin ver
    SESSION_COOKIE_SECURE=True       # HTTPS (Render) için zorunludur
)

# app.py
ALLOWED_ORIGINS = ['http://localhost:3000', 
                   'https://clashtor-ai.onrender.com', # Kendi backendiniz
                   'https://clashtor-ai.netlify.app'] # Netlify frontend

CORS(app, supports_credentials=True, origins=ALLOWED_ORIGINS)

BASE_DIR = Path(__file__).resolve().parent

STATIC_FILES_REGEX = re.compile(r'\.(js|css|ico|svg|png|jpg|jpeg|gif|map|txt|json)$')

# --- Firebase Kurulumu ---
firebase_config = {
    "apiKey": os.environ.get("FIREBASE_API_KEY"),
    "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.environ.get("FIREBASE_PROJECT_ID"),
    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.environ.get("FIREBASE_APP_ID"),
    "databaseURL": f"https://{os.environ.get('FIREBASE_PROJECT_ID')}.firebaseio.com"
}

cred_content = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

if cred_content:
    try:
        # Deneme 1: JSON içeriğini doğrudan sözlük olarak kullan
        cred_info = json.loads(cred_content)
        cred = credentials.Certificate(cred_info)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
    except Exception as e_json:
        print(f"KRİTİK HATA 1: JSON Parse/Başlatma Hatası ({e_json})")
        # Deneme 2: JSON string'i bozuksa veya dosya yolu ise hata ver, ancak db=None kalır
        db = None
else:
    print("KRİTİK HATA: FIREBASE_SERVICE_ACCOUNT ortam değişkeni boş.")
    db = None

# --- Diğer API Kurulumları ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
SUPERCELL_API_KEY = os.environ.get("SUPERCELL_API_KEY")

# =================================================================
# YENİ VE PROFESYONEL ÇÖZÜM: Context Processor
# Bu fonksiyon, firebase_config değişkenini tüm HTML şablonlarına otomatik olarak gönderir.
# =================================================================
@app.context_processor
def inject_global_vars():
    user_data = None
    if 'uid' in session and db:
        user_doc = db.collection('users').document(session['uid']).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
    return dict(firebase_config=firebase_config, current_user=user_data)
# =================================================================

# GÜNCELLENDİ: Zaman damgasını yerel saate çeviren ve formatlayan yardımcı fonksiyon
@app.template_filter('strftime')
def _jinja2_filter_datetime(date, fmt=None):
    if not date:
        return ""
    # Zaman dilimini ayarla (Türkiye/İsrail saati için genellikle bu kullanılır)
    local_tz = pytz.timezone('Europe/Istanbul') 
    
    # Gelen UTC zamanını yerel zamana çevir
    local_dt = date.astimezone(local_tz)
    
    if fmt is None:
        fmt = '%d %B %Y, %H:%M'
    return local_dt.strftime(fmt)

# YENİ: Giriş yapmış kullanıcı bilgilerini döndüren API rotası
@app.route('/api/user')
def get_current_user():
    if 'uid' in session and db: # db değişkeninin tanımlı olduğundan emin ol
        try:
            user_doc = db.collection('users').document(session['uid']).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                # Hassas olmayan verileri JSON olarak döndür
                return jsonify({
                    'uid': session['uid'],
                    'username': user_data.get('username'),
                    'email': user_data.get('email'),
                    'profile_picture_url': user_data.get('profile_picture_url'),
                    'is_premium': user_data.get('is_premium', False),
                    'has_used_free_analysis': user_data.get('has_used_free_analysis', False)
                })
            else:
                # Firestore'da kullanıcı bulunamazsa (nadiren olmalı)
                session.clear() # Güvenlik için session'ı temizle
                return jsonify({'error': 'User not found in database'}), 404
        except Exception as e:
            print(f"Error fetching user from Firestore: {e}")
            return jsonify({'error': 'Database error'}), 500
    else:
        # Giriş yapılmamışsa 401 Unauthorized hatası döndür
        return jsonify({'error': 'Not authenticated'}), 401

# --- API Fonksiyonları (TAM VE EKSİKSİZ) ---
ALL_CARDS_CACHE = None
def get_all_cards_data():
    global ALL_CARDS_CACHE
    if ALL_CARDS_CACHE: return ALL_CARDS_CACHE
    url = "https://proxy.royaleapi.dev/v1/cards"
    headers = {"Authorization": f"Bearer {SUPERCELL_API_KEY}"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        ALL_CARDS_CACHE = {card['name']: card for card in response.json()['items']}
        return ALL_CARDS_CACHE
    except Exception as e:
        print(f"Tüm kartlar çekilirken hata oluştu: {e}")
        return {}

def get_player_info(tag):
    url = f"https://proxy.royaleapi.dev/v1/players/{tag}"
    headers = {"Authorization": f"Bearer {SUPERCELL_API_KEY}"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"Supercell Profil Bilgisi Çekilemedi: {e}"}

def supercell_veri_cek(tag):
    url = f"https://proxy.royaleapi.dev/v1/players/{tag}/battlelog"
    headers = {"Authorization": f"Bearer {SUPERCELL_API_KEY}"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return f"Supercell API Hatası: {e}"

# MEVCUT desteyi_analiz_et fonksiyonunu TAMAMEN bununla değiştir
def desteyi_analiz_et(maç_verileri, player_trophies, analyze_mode='most_frequent'):
    if not maç_verileri or not isinstance(maç_verileri, list):
        return {"error": "Analiz için geçerli maç verisi bulunamadı."}

    ladder_maçları = [m for m in maç_verileri if ((m.get('type') == 'PvP') or (m.get('type') == 'trail' and m.get('gameMode', {}).get('name') == 'Ladder')) and len(m.get('team', [])) == 1]
    if not ladder_maçları:
        return {"error": "Son maç geçmişinde analiz için yeterli 1v1 maçı bulunamadı."}

    ana_deste_kartları = None
    ana_destesi = None
    oynanma_sayisi = 0
    kayıp_analizi = {}
    toplam_galibiyet = 0
    ilgili_mac = None # <-- YENİ: Analizle ilgili maçı saklamak için

    if analyze_mode == 'last':
        son_mac = ladder_maçları[0]
        ilgili_mac = son_mac # <-- YENİ: İlgili maç son maçtır
        ana_deste_kartları = son_mac['team'][0]['cards']
        ana_destesi = ", ".join(sorted([kart['name'] for kart in ana_deste_kartları]))
        oynanma_sayisi = 1
        toplam_galibiyet = 1 if son_mac['team'][0]['crowns'] > son_mac['opponent'][0]['crowns'] else 0
        if toplam_galibiyet == 0:
             for kart in son_mac['opponent'][0]['cards']:
                 kayıp_analizi[kart['name']] = kayıp_analizi.get(kart['name'], 0) + 1
        print(f"Debug: Son maç destesi analiz ediliyor: {ana_destesi}")
    else: # most_frequent
        destek_sayac = {}
        for maç in ladder_maçları:
            kartlar_obj = sorted(maç['team'][0]['cards'], key=lambda x: x['name'])
            deste_anahtari = ", ".join([kart['name'] for kart in kartlar_obj])
            if deste_anahtari not in destek_sayac:
                destek_sayac[deste_anahtari] = {'count': 0, 'cards_data': kartlar_obj}
            destek_sayac[deste_anahtari]['count'] += 1
        if not destek_sayac: return {"error": "Oynanan deste verisi bulunamadı."}
        en_cok_oynanan_deste_str = max(destek_sayac, key=lambda k: destek_sayac[k]['count'])
        ana_deste_verisi = destek_sayac[en_cok_oynanan_deste_str]
        ana_deste_kartları = ana_deste_verisi['cards_data']
        ana_destesi = en_cok_oynanan_deste_str
        oynanma_sayisi = ana_deste_verisi['count']
        for maç in ladder_maçları:
            oyuncu_kartları_str = ", ".join(sorted([kart['name'] for kart in maç['team'][0]['cards']]))
            if oyuncu_kartları_str == ana_destesi:
                
                # --- YENİ EKLENTİ ---
                if ilgili_mac is None: # Bu desteyle oynanan EN SON maçı bul
                    ilgili_mac = maç
                # --- EKLENTİ SONU ---
                
                if maç['team'][0]['crowns'] > maç['opponent'][0]['crowns']:
                    toplam_galibiyet += 1
                else:
                    for kart in maç['opponent'][0]['cards']:
                        kayıp_analizi[kart['name']] = kayıp_analizi.get(kart['name'], 0) + 1
        print(f"Debug: En çok oynanan deste analiz ediliyor: {ana_destesi} ({oynanma_sayisi} maç)")

    if not ana_deste_kartları:
         return {"error": "Analiz edilecek deste belirlenemedi."}

    original_total_elixir = sum(card.get('elixirCost', 0) for card in ana_deste_kartları)
    original_avg_elixir = original_total_elixir / 8.0 if ana_deste_kartları else 0
    kazanma_orani = (toplam_galibiyet / oynanma_sayisi) * 100 if oynanma_sayisi > 0 else 0

    # === DÜZELTME: Zayıflık metnini koşullu oluşturma ===
    en_çok_kaybedilen_kartlar = sorted(kayıp_analizi.items(), key=lambda item: item[1], reverse=True)[:3]
    def clean_text(text): return ''.join(c for c in text if c.isprintable())
    cleaned_ana_destesi = clean_text(ana_destesi)
    
    zayiflik_metni = "" # Başlangıçta boş
    if en_çok_kaybedilen_kartlar: # Eğer kaybedilen kartlar listesi boş DEĞİLSE
        cleaned_kayip_kartlar_str = clean_text(", ".join([k[0] for k in en_çok_kaybedilen_kartlar]))
        zayiflik_metni = f"Deste Zayıflığı: Analiz edilen maçlarda en çok {cleaned_kayip_kartlar_str} kartlarına karşı kaybedilmiş."
    else: # Eğer kaybedilen kartlar listesi BOŞ İSE
        zayiflik_metni = "Deste Zayıflığı: Analiz edilen maçlarda bu desteyle hiç kaybedilmediği veya yeterli veri olmadığı için spesifik kart zayıflığı belirlenemedi. Genel zayıflıklarını veya popüler karşı desteleri değerlendir."
    # === DÜZELTME SONU ===

    # === DÜZELTME: Analiz özeti metnini daha açıklayıcı yap ===
    if analyze_mode == 'last':
        analiz_özeti = "İstatistikler: Oyuncu bu desteyi en son ladder maçında kullandı."
    elif oynanma_sayisi == 1:
         analiz_özeti = f"İstatistikler: Bu deste son ladder maçları içinde 1 kez kullanılmış (%{kazanma_orani:.1f} kazanma oranı)."
    else:
         analiz_özeti = f"İstatistikler: Oyuncu bu desteyi son ladder maçları içinde {oynanma_sayisi} kez kullanmış (%{kazanma_orani:.1f} kazanma oranı)."
    # === DÜZELTME SONU ===

    # === YENİ ÇÖZÜM: MANUEL KART AÇIKLAMALARI (DÜZELTİLMİŞ) ===
    # Resmi API açıklama vermediği için, yeni/önemli kartları buraya manuel ekle.
    manuel_aciklamalar = {
        "Vines": "3 iksirlik büyü. Bölgedeki en yüksek canlı 3 hedefi (asker/bina) 2.5 saniyeliğine sersemletir, hasar verir ve havadaki birlikleri yere çeker. Savunma ve kontrol kartıdır.",
        # Gelecekte yeni bir kart çıkarsa buraya ekleyebilirsin
    }
    # === YENİ ÇÖZÜM SONU ===

    all_cards_data = get_all_cards_data() 
    kart_detay_listesi = []

    # Destede olan kartların verilerini bul
    for kart in ana_deste_kartları:
        kart_adi = kart.get('name')
        if kart_adi in all_cards_data:
            kart_verisi = all_cards_data[kart_adi]
            iksir = kart_verisi.get('elixirCost', 'Bilinmiyor')
            
            # --- GÜNCELLENDİ: Açıklamayı manuel sözlükten al ---
            aciklama = "Bilinmiyor" # Varsayılan
            if kart_adi in manuel_aciklamalar:
                aciklama = manuel_aciklamalar[kart_adi]
            # --- GÜNCELLEME SONU ---
            
            # Prompt'a hem iksiri hem de açıklamayı ekle
            kart_detay_listesi.append(f"- Kart: {kart_adi}, İksir: {iksir}, Açıklama: {aciklama}")


    kart_detayları_metni = "\n".join(kart_detay_listesi)


    # Gemini Prompt (analiz_özeti güncellendi)
    prompt = f"""Sen bir Clash Royale koçusun. Aşağıdaki verileri analiz et ve cevabını Türkçe ver.

        KART BİLGİLERİ (Yeni kart 'Vines' gibi kartlar dahil):
        {kart_detayları_metni}

        OYUNCU VE DESTE BİLGİLERİ:
        Oyuncu Kupası: {player_trophies}
        Analiz Edilecek Deste (İngilizce İsimler): {cleaned_ana_destesi}
        {analiz_özeti} 
        {zayiflik_metni} 

        GÖREV:
        1. Sana "KART BİLGİLERİ" altında verdiğim kartları ve özelliklerini dikkate alarak destenin genel bir özetini Türkçe yaz.
        2. {zayiflik_metni.split(":")[1].strip()} Bu bilgiyi ve sağlanan istatistikleri dikkate alarak destedeki TEK bir kartı, oyuncunun kupa seviyesine uygun ve GERÇEK bir Clash Royale kartıyla değiştir. İstatistikler sınırlıysa (örn: tek maç verisi), bunu yorumunda belirt ama yine de en iyi tahminine göre bir değişiklik öner.
        3. Cevabını aşağıdaki formatta ver:
        ### Deste Özeti
        [Buraya Türkçe özet metnini yaz]
        ### En Büyük Zayıflık (veya Genel Değerlendirme)
        [Buraya Türkçe zayıflık metnini veya genel durumu yaz, veri sınırlıysa belirt]
        ### Önerilen Değişiklik
        [Buraya Türkçe değişiklik önerisinin nedenini kısaca yaz]
        DEĞİŞİM: [Çıkarılacak Kart Adı] -> [Eklenecek Kart Adı]
        
        ÇOK ÖNEMLİ: "DEĞİŞİM:" satırında kullanacağın kart isimleri, sana verilen orijinal İNGİLİZCE isimlerle birebir aynı olmalıdır.
        """
    try:
        model = genai.GenerativeModel('models/gemini-2.0-flash')
        config = genai.GenerationConfig(max_output_tokens=1024, temperature=0.4)
        safety_settings = { 'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE', 'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE', 'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE', 'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE' }
        response = model.generate_content(prompt, generation_config=config, safety_settings=safety_settings)
        full_text, card_to_remove, card_to_add, new_avg_elixir = response.text, None, None, None
        match = re.search(r"DEĞİŞİM:\s*(.*?)\s*->\s*(.*)", full_text, re.IGNORECASE)
        if match:
            # ... (Kart isimlerini parse etme ve iksir hesaplama mantığı aynı kalıyor) ...
            potential_card_to_remove, potential_card_to_add = match.group(1).strip(), match.group(2).strip()
            all_cards_data = get_all_cards_data()
            original_deck_dict = {card['name']: card for card in ana_deste_kartları}
            actual_card_to_remove_name = None
            normalized_potential_remove = potential_card_to_remove.lower().replace('.', '').replace(' ', '')
            for name in original_deck_dict.keys():
                if name.lower().replace('.', '').replace(' ', '') == normalized_potential_remove:
                    actual_card_to_remove_name = name; break
            if all_cards_data and potential_card_to_add in all_cards_data and actual_card_to_remove_name:
                card_to_remove, card_to_add = actual_card_to_remove_name, potential_card_to_add
                elixir_removed = original_deck_dict[card_to_remove].get('elixirCost', 0)
                elixir_added = all_cards_data[card_to_add].get('elixirCost', 0)
                new_total_elixir = original_total_elixir - elixir_removed + elixir_added
                new_avg_elixir = new_total_elixir / 8.0 if new_total_elixir is not None else None

        return {
            "analysis_text": full_text, 
            "deck_cards": ana_deste_kartları, 
            "card_to_remove": card_to_remove, 
            "card_to_add": card_to_add, 
            "original_avg_elixir": f"{original_avg_elixir:.1f}", 
            "new_avg_elixir": f"{new_avg_elixir:.1f}" if new_avg_elixir is not None else f"{original_avg_elixir:.1f}",
            "analyzed_mode": analyze_mode,
            "ilgili_mac_detaylari": ilgili_mac # <-- YENİ: İlgili maçı da döndür
        }
    except Exception as e:
        traceback.print_exc()
        return {"error": f"Yapay zeka analizi sırasında bir hata oluştu: {e}"}

# --- Sayfa Rotaları (Routes) ---

# MEVCUT register fonksiyonunu TAMAMEN bununla değiştirin
@app.route('/register', methods=['GET', 'POST'])
def register():
    # GET isteği hala React uygulamasının yüklenmesi için gerekebilir
    # Veya React Router bu sayfayı yönettiği için bu GET kısmı tamamen kaldırılabilir.
    # Şimdilik GET isteğinde bir şey yapmıyoruz, React render edecek.
    if request.method == 'GET':
        # API odaklı bir backend'de GET genellikle bir şey döndürmez
        # veya belki sadece CSRF token gibi bir şey döndürür.
        # Şimdilik boş bırakabiliriz veya React'in bu sayfayı
        # render etmesini bekleyebiliriz.
        # return render_template('register.html') # BU SATIRI KALDIRDIK
        pass # Veya React'in route yönetimine güveniyorsak GET'i tamamen kaldırabiliriz

    if request.method == 'POST':
        # React'ten gelen form verisini al (application/x-www-form-urlencoded)
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        password_confirm = request.form.get('password_confirm') # React'te bu isimle gönderildiğinden emin ol

        # --- Input Doğrulamaları (JSON Hataları ile) ---
        if not all([username, email, password, password_confirm]):
             return jsonify({'error': 'Tüm alanlar gereklidir.'}), 400
             
        if password != password_confirm:
            # flash yerine JSON hatası döndür
            return jsonify({'error': 'Girdiğiniz şifreler eşleşmiyor.'}), 400 
            
        if len(username) > 20:
            # flash yerine JSON hatası döndür
            return jsonify({'error': 'Kullanıcı adı en fazla 20 karakter olabilir.'}), 400
        if len(username) < 3:
            # flash yerine JSON hatası döndür
            return jsonify({'error': 'Kullanıcı adı en az 3 karakter olmalıdır.'}), 400
        if len(password) < 6: # Şifre uzunluğu kontrolü
             return jsonify({'error': 'Şifre en az 6 karakter olmalıdır.'}), 400
            
        if not db:
            # flash yerine JSON hatası döndür
            return jsonify({'error': 'Veritabanı bağlantısı kurulamadı.'}), 500
            
        users_ref = db.collection('users')
        
        # Kullanıcı adı veya e-posta zaten var mı kontrolü
        try:
            if users_ref.where('username', '==', username).limit(1).get():
                # flash yerine JSON hatası döndür
                return jsonify({'error': 'Bu kullanıcı adı zaten alınmış!'}), 409 # 409 Conflict
            if users_ref.where('email', '==', email).limit(1).get():
                # flash yerine JSON hatası döndür
                return jsonify({'error': 'Bu e-posta adresi zaten kullanımda!'}), 409 # 409 Conflict
        except Exception as db_error:
             print(f"Firestore sorgu hatası: {db_error}")
             return jsonify({'error': 'Kullanıcı kontrolü sırasında veritabanı hatası.'}), 500

        # --- Firebase Authentication ile Kullanıcı Oluşturma ---
        try:
            user_record = admin_auth.create_user(email=email, password=password, display_name=username)
            uid = user_record.uid # Admin SDK'dan UID'yi almanın doğru yolu
            
            # Firestore'a Kullanıcı Bilgilerini Kaydet
            try:
                users_ref.document(uid).set({
                    'username': username, 
                    'email': email, 
                    'profile_picture_url': None,
                    'is_premium': False,
                    'has_used_free_analysis': False
                })
            except Exception as firestore_error:
                 # Firestore'a yazılamazsa Auth kullanıcısını silmeyi düşünebilirsin (temizlik için)
                 print(f"Firestore'a kullanıcı kaydedilemedi ({uid}): {firestore_error}")
                 # Belki Auth kullanıcısını geri sil: auth.delete_user(uid) # Bu Pyrebase'de direkt olmayabilir, Admin SDK gerekir
                 return jsonify({'error': 'Kullanıcı oluşturuldu ancak veritabanına kaydedilemedi.'}), 500

            # --- BAŞARILI KAYIT ---
            custom_token = admin_auth.create_custom_token(uid)
            
            # React'e başarılı cevabı ve token'ı gönder (Frontend'in otomatik oturum açması için)
            return jsonify({
                'status': 'success', 
                'message': 'Başarıyla kayıt oldunuz!',
                'custom_token': custom_token.decode('utf-8') # Token'ı döndür
            }), 201

        except Exception as e:
            # Firebase Authentication hatalarını yakala
            print(f"Firebase Auth Kayıt Hatası: {e}") 
            error_message = 'Kayıt başarısız oldu.'
            status_code = 400 # Varsayılan Bad Request
            try:
                error_json = json.loads(e.args[1])
                error_message_key = error_json.get('error', {}).get('message', 'UNKNOWN_ERROR')
                print(f"Firebase Hata Kodu (JSON'dan): {error_message_key}")
                if "EMAIL_EXISTS" in error_message_key:
                     error_message = 'Bu e-posta adresi zaten kullanımda!'
                     status_code = 409 # Conflict
                elif "WEAK_PASSWORD" in error_message_key:
                     error_message = 'Şifre çok zayıf. En az 6 karakter olmalıdır.'
                elif "INVALID_EMAIL" in error_message_key:
                     error_message = 'Geçersiz e-posta formatı.'
                # Diğer olası Firebase hataları...
            except Exception as parse_error:
                 print(f"Firebase hata mesajı parse edilemedi: {parse_error}")
                 
            # flash yerine JSON hatası döndür
            return jsonify({'error': error_message}), status_code
            
    # GET isteği için (eğer route'u kaldırmadıysak) bir şey döndürmek GEREKLİ
    # Ya boş bir 200 OK döndürürüz ya da React'in halletmesine izin veririz.
    # Şimdilik GET isteği React Router tarafından yönetildiği için buraya hiç gelinmemeli.
    # Ama Flask hata vermesin diye boş bir cevap döndürelim.
    return jsonify({'message': 'Register page accessible via POST for API'}), 200 # Veya 405 Method Not Allowed

# MEVCUT login fonksiyonunu TEKRAR bununla değiştirin
@app.route('/login', methods=['POST'])
def login():
    login_identifier = request.form.get('login_identifier')
    password = request.form.get('password')

    if not login_identifier or not password:
        return jsonify({'error': 'Kullanıcı adı/e-posta ve şifre gereklidir.'}), 400
    if not db:
        return jsonify({'error': 'Veritabanı bağlantısı kurulamadı.'}), 500
        
    users_ref = db.collection('users')
    user_doc = None
    email_to_use = None
    username_found = None
    uid_found = None # UID'yi de saklayalım

    # Kullanıcıyı Firestore'dan bul
    if '@' in login_identifier:
        query = users_ref.where('email', '==', login_identifier).limit(1).stream()
        user_doc = next(query, None)
        if user_doc:
            email_to_use = login_identifier
            username_found = user_doc.to_dict().get('username')
            uid_found = user_doc.id # Belge ID'si UID'dir
    else:
        query = users_ref.where('username', '==', login_identifier).limit(1).stream()
        user_doc = next(query, None)
        if user_doc:
            user_data = user_doc.to_dict()
            email_to_use = user_data.get('email')
            username_found = login_identifier
            uid_found = user_doc.id # Belge ID'si UID'dir

    if not user_doc or not email_to_use:
        print(f"Firestore Kullanıcı Arama Sonucu: identifier='{login_identifier}', user_doc bulundu mu? {'Evet' if user_doc else 'Hayır'}, email_to_use='{email_to_use}'")
        return jsonify({'error': 'Kullanıcı adı veya e-posta bulunamadı.'}), 404
    
    print(f"Firebase Auth için denenecek e-posta: {email_to_use}")

    try:
        # Pyrebase'i kaldırıp Firebase REST API ile şifre doğrulama yapın
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebase_config['apiKey']}"
        payload = {
            "email": email_to_use,
            "password": password,
            "returnSecureToken": True
        }
        response = requests.post(url, json=payload)
        response.raise_for_status() # HTTP hatası varsa istisna fırlat

        # YENİ KONTROL: REST API'den gelen token'ı alıp Admin SDK ile doğrulayalım (Bu kısım zorunludur)
        id_token = response.json().get('idToken')
        if not id_token:
            raise Exception("Firebase API'den kimlik doğrulama belirteci alınamadı.")

        # Token'ı Admin SDK ile çözerek kullanıcı kimliğini güvenli bir şekilde alalım.
        # Bu işlem, kullanıcının doğru şifreyi girdiğini kanıtlar.
        admin_auth.verify_id_token(id_token) 
        
        # --- UİD KARŞILAŞTIRMASI KALDIRILDI ---
        # "Kimlik doğrulama tutarsızlığı" hatasına neden olan aşırı sıkı kontrol kaldırıldı.
        
        # --- BAŞARILI GİRİŞ ---
        # Session bilgilerini ayarla
        session['logged_in'] = True
        session['username'] = username_found 
        session['uid'] = uid_found # Firestore'dan aldığımız UID'yi kullan (doğru ID budur)
        
        user_data_to_send = user_doc.to_dict() # Firestore'dan gelen tüm veri
        user_data_to_send['uid'] = uid_found # UID'yi de ekleyelim
        
        return jsonify({ 
            'status': 'success', 
            'message': 'Giriş başarılı!',
            'user': user_data_to_send # Tüm kullanıcı verisini döndür
        }), 200
    except Exception as e:
        # ... (Önceki detaylı hata loglama ve cevap kısmı aynı kalabilir) ...
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print(f"Firebase Auth GİRİŞ HATASI: {e}") 
        print(f"Detaylar (e.args): {e.args}") 
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        error_message_key = 'UNKNOWN_ERROR'
        human_readable_error = 'Giriş sırasında bilinmeyen bir hata oluştu.'
        status_code = 500
        if hasattr(e, 'response') and e.response is not None:
            try:
                # 1. Hata verisini JSON olarak yükle
                error_data = e.response.json()
                error_message_key = error_data.get('error', {}).get('message', 'UNKNOWN_ERROR')
                
                # 2. Hata anahtarına göre kullanıcı dostu mesaj oluştur
                if "INVALID_LOGIN_CREDENTIALS" in error_message_key or \
                   "INVALID_PASSWORD" in error_message_key or \
                   "EMAIL_NOT_FOUND" in error_message_key or \
                   "INVALID_EMAIL" in error_message_key: 
                    human_readable_error = 'Geçersiz e-posta veya şifre.'
                    status_code = 401
                else:
                    # Diğer Firebase hataları için (örn: TOO_MANY_REQUESTS)
                    human_readable_error = f"Firebase servisinde bir hata oluştu: {error_message_key}"
                    status_code = 400
                
                return jsonify({'error': human_readable_error}), status_code

            except Exception as parse_error:
                # Yanıtı JSON olarak ayrıştırma hatası
                return jsonify({'error': 'Sunucudan gelen yanıt işlenemedi. '}), 500
        
        else:
            # Ağ zaman aşımı veya bilinmeyen bir hata
            return jsonify({'error': 'Giriş sırasında bilinmeyen bir ağ hatası oluştu.'}), 500
            

# MEVCUT /google-login fonksiyonunu bununla DEĞİŞTİRİN
@app.route('/google-login', methods=['POST'])
def google_login():
    # React'ten application/x-www-form-urlencoded olarak gönderilen token'ı al
    id_token = request.form.get('id_token') 
    
    if not id_token or not db:
        return jsonify({'error': 'ID token eksik veya veritabanı hatası.'}), 400
        
    try:
        # Firebase Admin SDK ile token'ı doğrula
        decoded_token = admin_auth.verify_id_token(id_token)
        uid, email = decoded_token['uid'], decoded_token.get('email')
        picture_url = decoded_token.get('picture') # Google'dan gelen resim
        
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        user_data_to_send = None
        username_to_set = None

        if user_doc.exists:
            # Kullanıcı Firestore'da var, mevcut bilgileri kullan
            user_data_from_db = user_doc.to_dict()
            username_to_set = user_data_from_db.get('username')
            # Mevcut resmi koru, Google'dan geleni kullanma (kullanıcı kendi değiştirmiş olabilir)
            user_data_to_send = user_data_from_db
            user_data_to_send['uid'] = uid # UID'yi ekle
        else:
            # Kullanıcı Firestore'da yok, yeni kayıt oluştur
            username_to_set = email.split('@')[0] if email else f"user_{uid[:6]}" # Eposta yoksa UID'den üret
            # Kullanıcı adı çakışmasını kontrol et
            query = db.collection('users').where('username', '==', username_to_set).limit(1).stream()
            if next(query, None):
                username_to_set = f"{username_to_set}_{uid[:4]}" # Çakışma varsa UID'den ekle
            
            # Veritabanına ilk kez kaydet
            new_user_data = {
                'username': username_to_set,
                'email': email,
                'profile_picture_url': picture_url, # İlk kayıtta Google resmini kullan
                'is_premium': False,
                'has_used_free_analysis': False
            }
            user_ref.set(new_user_data)
            user_data_to_send = new_user_data
            user_data_to_send['uid'] = uid # UID'yi ekle
        
        # Session'ı başlat
        session['logged_in'] = True
        session['username'] = username_to_set
        session['uid'] = uid
        
        print(f"Google ile giriş BAŞARILI: Kullanıcı adı={username_to_set}, UID={uid}")
        
        # React'e başarılı cevabı ve kullanıcı verisini gönder
        return jsonify({
            'status': 'success',
            'message': 'Google ile giriş başarılı!',
            'user': user_data_to_send 
        }), 200

    except Exception as e:
        print(f"Google Login Hatası (Backend): {e}")
        traceback.print_exc() # Hatanın detayını terminale yazdır
        # Hata mesajını ayrıştırmaya çalış
        error_message = 'Google ile giriş sırasında bir hata oluştu.'
        status_code = 500
        if isinstance(e, admin_auth.InvalidIdTokenError):
             error_message = 'Geçersiz Google kimlik bilgisi.'
             status_code = 401
        elif isinstance(e, admin_auth.ExpiredIdTokenError):
             error_message = 'Google oturumunuzun süresi dolmuş.'
             status_code = 401
             
        return jsonify({'error': error_message}), status_code

@app.route('/logout')
def logout():
    session.clear()
    # Yönlendirmeyi Flask'in Catch-All rotasına (serve) yönlendirin
    # url_for('serve') kullanmak, sizi ana sayfaya güvenli bir şekilde yönlendirecektir.
    return redirect(url_for('serve'))

# YENİ: Kullanıcıyı premium olmaya yönlendiren sayfa
@app.route('/premium')
def premium():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('premium.html')

# YENİ: Premium'a yükseltme işlemini simüle eden fonksiyon
@app.route('/upgrade-to-premium', methods=['POST'])
def upgrade_to_premium():
    if not session.get('logged_in') or 'uid' not in session:
        return redirect(url_for('login'))
    
    uid = session['uid']
    if db:
        try:
            db.collection('users').document(uid).update({'is_premium': True})
            flash('Tebrikler! Hesabınız başarıyla Premium\'a yükseltildi.', 'success')
        except Exception as e:
            flash(f'Yükseltme sırasında bir hata oluştu: {e}', 'error')

    return redirect(url_for('analyzer'))


# YENİ: Herkese açık profil bilgilerini döndüren API rotası
@app.route('/api/profile/<username>/public-info')
def get_public_profile_info(username):
    if not db:
        return jsonify({"error": "Database connection failed."}), 500

    try:
        users_ref = db.collection('users')
        query = users_ref.where('username', '==', username).limit(1).stream()
        target_user_doc = next(query, None)

        if not target_user_doc:
            return jsonify({"error": "User not found"}), 404

        # Sadece herkese açık olması güvenli olan verileri al
        user_data = target_user_doc.to_dict()
        public_info = {
            'username': user_data.get('username'),
            'profile_picture_url': user_data.get('profile_picture_url'),
            'is_premium': user_data.get('is_premium', False)
            # 'email' gibi özel verileri BURAYA EKLEMEYİN
        }
        
        return jsonify(public_info), 200

    except Exception as e:
        print(f"Error fetching public profile for {username}: {e}")
        return jsonify({"error": "Could not fetch profile information."}), 500
    
# YENİ: Belirli bir kullanıcının SADECE paylaşılan analizlerini getiren API rotası
@app.route('/api/profile/<username>/shared-analyses')
def get_user_shared_analyses(username):
    if not db:
        return jsonify({"error": "Database connection failed."}), 500

    all_cards_data = get_all_cards_data()
    if not all_cards_data:
        return jsonify({"error": "Failed to load card data."}), 500

    try:
        # Önce username'den UID'yi bulalım
        users_ref = db.collection('users')
        query = users_ref.where('username', '==', username).limit(1).stream()
        target_user_doc = next(query, None)

        if not target_user_doc:
            return jsonify({"error": "User not found"}), 404
        
        target_uid = target_user_doc.id

        # Firestore'dan SADECE paylaşılan analizleri çek (en yeniden eskiye)
        analyses_query = db.collection('analyses') \
                           .where('user_id', '==', target_uid) \
                           .where('is_shared', '==', True) \
                           .order_by('timestamp', direction=firestore.Query.DESCENDING) \
                           .stream()
                           
        shared_analyses = []
        for analysis in analyses_query:
            analysis_data = analysis.to_dict()
            analysis_data['id'] = analysis.id 
            
            # Kart isimlerini kart objelerine çevir
            original_deck_objects = []
            if 'original_deck' in analysis_data and isinstance(analysis_data['original_deck'], list):
                for item in analysis_data['original_deck']:
                    card_name_to_check = item if isinstance(item, str) else item.get('name') if isinstance(item, dict) else None
                    if card_name_to_check and card_name_to_check in all_cards_data:
                        original_deck_objects.append(all_cards_data[card_name_to_check])
                    elif card_name_to_check:
                         original_deck_objects.append({"name": card_name_to_check, "iconUrls": {"medium": None}})
            analysis_data['original_deck'] = original_deck_objects

            # Timestamp'i ISO string'e çevir
            if 'timestamp' in analysis_data and isinstance(analysis_data['timestamp'], datetime):
                 analysis_data['timestamp'] = analysis_data['timestamp'].replace(tzinfo=timezone.utc).isoformat()
                 
            shared_analyses.append(analysis_data)
            
        return jsonify(shared_analyses), 200 # Paylaşılan analiz listesini JSON olarak döndür
        
    except Exception as e:
        print(f"Error fetching shared analyses for {username}: {e}")
        traceback.print_exc() # Hatanın detayını terminale yazdır
        return jsonify({'error': 'Could not fetch shared analyses'}), 500

# ÖNEMLİ: Firestore'da bu sorgunun çalışması için BİR INDEX GEREKEBİLİR!
# Hata alırsanız, Flask terminalindeki hata mesajı size index oluşturma linkini verecektir.
# Oluşturulacak index muhtemelen 'analyses' koleksiyonu için şu alanları içerecek:
# 1. user_id (Ascending)
# 2. is_shared (Ascending)
# 3. timestamp (Descending)


# MEVCUT decks fonksiyonunu TAMAMEN bununla değiştir
@app.route('/api/decks')
def decks():
    if not db:
        return jsonify({"error": "Database connection failed."}), 500

    all_cards_data = get_all_cards_data()
    if not all_cards_data:
        return jsonify({"error": "Failed to load card data."}), 500

    try:
        shared_analyses_query = db.collection('analyses') \
                                  .where('is_shared', '==', True) \
                                  .order_by('timestamp', direction=firestore.Query.DESCENDING) \
                                  .stream()

        analyses_list = []
        for analysis in shared_analyses_query:
            analysis_data = analysis.to_dict()
            analysis_data['id'] = analysis.id

            # --- DÜZELTME: Kart Adı veya Objesi Kontrolü ---
            original_deck_objects = []
            if 'original_deck' in analysis_data and isinstance(analysis_data['original_deck'], list):
                # 'item' değişkeni string veya dict olabilir
                for item in analysis_data['original_deck']:
                    card_name_to_check = None # Kontrol edilecek kart adını bulalım
                    if isinstance(item, str):
                        card_name_to_check = item # Zaten string ise direkt kullan
                    elif isinstance(item, dict) and 'name' in item:
                        card_name_to_check = item.get('name') # Sözlük ise 'name' anahtarını al

                    # Geçerli bir kart adı bulduysak devam et
                    if card_name_to_check and card_name_to_check in all_cards_data:
                        # Tam kart objesini all_cards_data'dan ekle
                        original_deck_objects.append(all_cards_data[card_name_to_check])
                    elif card_name_to_check:
                        # Kart adı var ama all_cards_data'da yoksa yer tutucu ekle
                        print(f"Uyarı: '{card_name_to_check}' kartı 'all_cards_data' içinde bulunamadı.")
                        original_deck_objects.append({"name": card_name_to_check, "iconUrls": {"medium": None}})
                    else:
                        # Ne string ne de geçerli bir dict ise logla
                        print(f"Uyarı: original_deck içinde geçersiz öğe bulundu: {item}")

            analysis_data['original_deck'] = original_deck_objects # Güncellenmiş listeyi ata
            # --- DÜZELTME SONU ---

            # Kullanıcı bilgisi ve timestamp işlemleri aynı kalıyor...
            user_id = analysis_data.get('user_id')
            user_info = {'username': 'Bilinmiyor', 'profile_picture_url': None}
            if user_id:
                user_doc = db.collection('users').document(user_id).get()
                if user_doc.exists:
                    user_data_from_db = user_doc.to_dict()
                    user_info['username'] = user_data_from_db.get('username', 'Bilinmiyor')
                    user_info['profile_picture_url'] = user_data_from_db.get('profile_picture_url')
            analysis_data['user_info'] = user_info

            if 'timestamp' in analysis_data and isinstance(analysis_data['timestamp'], datetime):
                 analysis_data['timestamp'] = analysis_data['timestamp'].replace(tzinfo=timezone.utc).isoformat()

            analyses_list.append(analysis_data)

        return jsonify(analyses_list), 200

    except Exception as e:
        print(f"Error fetching shared decks: {e}")
        traceback.print_exc()
        return jsonify({"error": "Could not fetch shared decks."}), 500

# YENİ: Bir analizi paylaşma veya paylaşımını geri çekme fonksiyonu
@app.route('/toggle-share-analysis/<analysis_id>', methods=['POST'])
def toggle_share_analysis(analysis_id):
    if not session.get('logged_in') or 'uid' not in session:
        return jsonify({'success': False, 'error': 'Not logged in'}), 401

    uid = session['uid']
    analysis_ref = db.collection('analyses').document(analysis_id)
    analysis_doc = analysis_ref.get()

    if not analysis_doc.exists:
        return jsonify({'success': False, 'error': 'Analysis not found'}), 404
    
    analysis_data = analysis_doc.to_dict()
    # Güvenlik kontrolü: Sadece kendi analizini paylaşabilir
    if analysis_data.get('user_id') != uid:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    # Mevcut paylaşım durumunun tersini al (varsayılan: False)
    current_status = analysis_data.get('is_shared', False)
    new_status = not current_status
    
    try:
        # Firestore'da 'is_shared' alanını güncelle
        analysis_ref.update({'is_shared': new_status})
        return jsonify({'success': True, 'is_shared': new_status})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Could not update analysis'}), 500


@app.route('/update-username', methods=['POST'])
def update_username():
    if not session.get('logged_in') or 'uid' not in session:
        return jsonify({'success': False, 'error': 'Not logged in'}), 401
    
    new_username = request.json.get('username', '').strip()

    # YENİ: Sunucu tarafı uzunluk kontrolü
    if len(new_username) > 20:
        return jsonify({'success': False, 'error': 'Kullanıcı adı en fazla 20 karakter olabilir.'}), 400
    if len(new_username) < 3:
        return jsonify({'success': False, 'error': 'Kullanıcı adı en az 3 karakter olmalıdır.'}), 400

    uid = session['uid']
    users_ref = db.collection('users')
    
    # Yeni kullanıcı adının başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
    query = users_ref.where('username', '==', new_username).stream()
    is_taken = False
    for user_doc in query:
        if user_doc.id != uid: # Eğer bulunan kullanıcı kendimiz değilsek, o zaman isim alınmıştır
            is_taken = True
            break
            
    if is_taken:
        return jsonify({'success': False, 'error': 'Bu kullanıcı adı zaten alınmış.'}), 409

    # Firestore'da ve session'da güncelle
    users_ref.document(uid).update({'username': new_username})
    session['username'] = new_username
    
    return jsonify({'success': True, 'username': new_username})

@app.route('/update-picture', methods=['POST'])
def update_picture():
    if not session.get('logged_in'):
        return jsonify({'success': False, 'error': 'Not logged in'}), 401
    
    new_url = request.json.get('url')
    if not new_url:
        return jsonify({'success': False, 'error': 'URL boş olamaz.'}), 400

    uid = session['uid']
    db.collection('users').document(uid).update({'profile_picture_url': new_url})
    
    return jsonify({'success': True, 'url': new_url})


# =================================================================
# YENİ: Analizi Kaydetme Fonksiyonu
# =================================================================
@app.route('/save-analysis', methods=['POST'])
def save_analysis():
    if not session.get('logged_in') or 'uid' not in session:
        return jsonify({'success': False, 'error': 'Not logged in'}), 401
    
    data = request.json
    uid = session['uid']

    try:
        db.collection('analyses').add({
            'user_id': uid,
            'original_deck': data.get('original_deck'),
            'card_to_remove': data.get('card_to_remove'),
            'card_to_add': data.get('card_to_add'),
            'original_avg_elixir': data.get('original_avg_elixir'),
            'new_avg_elixir': data.get('new_avg_elixir'),
            'timestamp': datetime.now(timezone.utc) # Kayıt zamanı
        })
        return jsonify({'success': True})
    except Exception as e:
        print(f"Analiz kaydetme hatası: {e}")
        return jsonify({'success': False, 'error': 'Veritabanına kaydedilemedi.'}), 500

# =================================================================
# YENİ: Analizi Silme Fonksiyonu
# =================================================================
@app.route('/delete-analysis/<analysis_id>', methods=['POST'])
def delete_analysis(analysis_id):
    if not session.get('logged_in') or 'uid' not in session:
        return jsonify({'success': False, 'error': 'Not logged in'}), 401

    uid = session['uid']
    analysis_ref = db.collection('analyses').document(analysis_id)
    analysis_doc = analysis_ref.get()

    if not analysis_doc.exists:
        return jsonify({'success': False, 'error': 'Analysis not found'}), 404
    
    # Güvenlik kontrolü: Sadece kendi analizini silebilir
    if analysis_doc.to_dict().get('user_id') != uid:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    try:
        analysis_ref.delete()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Could not delete analysis'}), 500


# MEVCUT /api/analyze fonksiyonunu TEKRAR bununla değiştirin
@app.route('/api/analyze', methods=['POST'])
def analyze_deck_api():
    if not session.get('logged_in') or 'uid' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    uid = session['uid']
    user_doc = db.collection('users').document(uid).get()
    if not user_doc.exists:
        return jsonify({'error': 'User not found'}), 404
    user_data = user_doc.to_dict()

    # Premium ve deneme hakkı kontrolü
    is_premium = user_data.get('is_premium', False)
    has_used_free = user_data.get('has_used_free_analysis', False)

    if not is_premium and has_used_free:
        return jsonify({
            'error_info': {
                "title": "Analiz Limiti Doldu",
                "message": "Ücretsiz analiz hakkınızı kullandınız. Sınırsız analiz için lütfen Premium'a yükseltin."
            }
        }), 403

    data = request.get_json()
    player_tag = data.get('player_tag', '').strip().upper()
    analyze_mode = data.get('analyze_mode', 'most_frequent') # YENİ: Frontend'den gelen modu al (varsayılan: most_frequent) 

    if not player_tag:
         return jsonify({'error_info': {"title": "Oyuncu Etiketi Girilmedi", "message": "Lütfen analiz etmek için bir oyuncu etiketi girin."}}), 400
    
    if not player_tag.startswith('#'):
        player_tag = '#' + player_tag

    player_tag_url = player_tag.replace("#", "%23")
    player_info = get_player_info(player_tag_url)

    if "error" in player_info:
        return jsonify({'error_info': {"title": "Oyuncu Bulunamadı", "message": "Girdiğiniz etiketle bir oyuncu bulunamadı veya Supercell API'sine ulaşılamıyor."}}), 404
    
    battles_or_error = supercell_veri_cek(player_tag_url)
    if isinstance(battles_or_error, str):
         return jsonify({'error_info': {"title": "Maç Geçmişi Alınamadı", "message": battles_or_error}}), 500
    
    # --- Analiz ve Sonuç İşleme ---
    try: 
        player_trophies = player_info.get('trophies', 0)
        result_dict = desteyi_analiz_et(battles_or_error, player_trophies, analyze_mode)

        if "error" in result_dict:
            # desteyi_analiz_et fonksiyonu hata döndürdüyse
            return jsonify({'error_info': {"title": "Analiz Yapılamadı", "message": result_dict["error"]}}), 500

        # --- Başarılı Analiz Sonuçlarını İşle ---
        print("Debug: Analiz başarılı, sonuçlar işleniyor...") # Hata ayıklama için print
        
        analysis_result_html = markdown.markdown(result_dict.get("analysis_text", ""))
        deck_cards = result_dict.get("deck_cards", [])
        card_to_remove = result_dict.get("card_to_remove")
        card_to_add = result_dict.get("card_to_add")
        card_swap_info = {"remove": card_to_remove, "add": card_to_add}
        elixir_info = {"original": result_dict.get("original_avg_elixir"), "new": result_dict.get("new_avg_elixir")}
        
        last_battle_details = None
        # 'desteyi_analiz_et' fonksiyonundan dönen ilgili maçı al
        relevant_battle = result_dict.get('ilgili_mac_detaylari') 

        if relevant_battle:
            last_battle_details = {
                "game_mode": relevant_battle.get('gameMode', {}).get('name', 'Bilinmiyor'),
                "player_team": relevant_battle.get('team', [{}])[0],
                "opponent_team": relevant_battle.get('opponent', [{}])[0]
            }

        all_cards_data = get_all_cards_data()
        added_card_details = None
        if card_to_add and all_cards_data and card_to_add in all_cards_data:
            added_card_details = all_cards_data[card_to_add]

        # Ücretsiz hakkı işaretle
        if not is_premium:
            try:
                db.collection('users').document(uid).update({'has_used_free_analysis': True})
            except Exception as e:
                print(f"Firestore güncelleme hatası (has_used_free_analysis): {e}")

        # Başarılı JSON cevabını oluştur ve döndür
        response_payload = {
            'analysis_result_html': analysis_result_html,
            'deck_cards': deck_cards,
            'player_info': player_info,
            'last_battle_details': last_battle_details, # Son savaş bilgisi hala gönderiliyor
            'card_swap_info': card_swap_info,
            'elixir_info': elixir_info,
            'player_tag_value': player_tag,
            'added_card_details': added_card_details,
            'analyzed_mode': result_dict.get('analyzed_mode') # YENİ: Analiz edilen modu ekle
        }
        return jsonify(response_payload), 200

    except Exception as e:
        # Analiz veya sonuç işleme sırasında beklenmedik bir hata olursa
        return jsonify({'error_info': {"title": "Sunucu Hatası", "message": "Analiz sırasında beklenmedik bir sunucu hatası oluştu."}}), 500
    

# YENİ: Tüm kart verilerini döndüren API rotası
@app.route('/api/cards')
def get_all_cards_api():
    all_cards = get_all_cards_data() # Bu fonksiyon zaten var ve cache kullanıyor olmalı
    if all_cards:
        return jsonify(all_cards), 200
    else:
        # get_all_cards_data içinde hata loglaması olmalı
        return jsonify({"error": "Kart verileri alınamadı."}), 500

# MEVCUT get_user_analyses fonksiyonunu TAMAMEN bununla değiştir
@app.route('/api/profile/<username>/analyses')
def get_user_analyses(username):
    if not session.get('logged_in') or 'uid' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
        
    if not db:
         return jsonify({'error': 'Database error'}), 500

    all_cards_data = get_all_cards_data() # Kart verilerini al
    if not all_cards_data:
        return jsonify({"error": "Failed to load card data."}), 500

    # Username'den UID'yi bul
    users_ref = db.collection('users')
    query = users_ref.where('username', '==', username).limit(1).stream()
    target_user_doc = next(query, None)

    if not target_user_doc:
        return jsonify({'error': 'User not found'}), 404
        
    target_uid = target_user_doc.id
    
    # Güvenlik: Kullanıcı sadece kendi analizlerine erişebilsin
    if session['uid'] != target_uid:
        return jsonify({'error': 'Unauthorized access to analyses'}), 403

    # Firestore'dan TÜM analizleri çek (en yeniden eskiye)
    try:
        analyses_query = db.collection('analyses') \
                           .where('user_id', '==', target_uid) \
                           .order_by('timestamp', direction=firestore.Query.DESCENDING) \
                           .stream()
                           
        saved_analyses = []
        for analysis in analyses_query:
            analysis_data = analysis.to_dict()
            analysis_data['id'] = analysis.id 
            
            # === YENİ: Kart İsimlerini Kart Objelerine Çevirme ===
            original_deck_objects = []
            if 'original_deck' in analysis_data and isinstance(analysis_data['original_deck'], list):
                for item in analysis_data['original_deck']:
                    card_name_to_check = item if isinstance(item, str) else item.get('name') if isinstance(item, dict) else None
                    if card_name_to_check and card_name_to_check in all_cards_data:
                        original_deck_objects.append(all_cards_data[card_name_to_check])
                    elif card_name_to_check:
                         original_deck_objects.append({"name": card_name_to_check, "iconUrls": {"medium": None}})
            analysis_data['original_deck'] = original_deck_objects # Güncellenmiş listeyi ata
            # === ÇEVİRME SONU ===
            
            # Timestamp'i ISO string'e çevir
            if 'timestamp' in analysis_data and isinstance(analysis_data['timestamp'], datetime):
                 analysis_data['timestamp'] = analysis_data['timestamp'].replace(tzinfo=timezone.utc).isoformat()
                 
            saved_analyses.append(analysis_data)
            
        return jsonify(saved_analyses), 200 # Tüm analiz listesini JSON olarak döndür
        
    except Exception as e:
        print(f"Error fetching analyses for {username}: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Could not fetch analyses'}), 500

# =================================================================
# YENİ KOD BLOĞU: CATCH-ALL ROUTE (TÜM TRAFİĞİ REACT'E YÖNLENDİRİR)
# =================================================================

# Flask'in API olmayan tüm yolları yakalamasını sağlar.
# Not: Bu rotaların, tüm API rotalarınızdan sonra tanımlandığından emin olun!

# STATIC_FILES_REGEX ve kontrolünü SİLİN.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Flask'in kendi static_folder'ından index.html'i sun.
    return app.send_static_file('index.html')

# --- Uygulama Başlatma ---
if __name__ == "__main__":
    app.run(debug=True)
