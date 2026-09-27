# Zira3i AI — الوثيقة الشاملة الكاملة للمشروع

**🌾 الطبيب الزراعي الذكي — من الصورة إلى القرار**

---

## جدول المحتويات

1. [نظرة عامة](#1-نظرة-عامة)
2. [المشكلة](#2-المشكلة)
3. [الحل](#3-الحل)
4. [تدفق المستخدم (User Flow)](#4-تدفق-المستخدم-user-flow)
5. [البنية التقنية الكاملة](#5-البنية-التقنية-الكاملة)
6. [إعداد بيئة GPU من الصفر](#6-إعداد-بيئة-gpu-من-الصفر)
7. [كود الـ API الكامل](#7-كود-الـ-api-الكامل)
8. [الشبكة والوصول الخارجي](#8-الشبكة-والوصول-الخارجي)
9. [الواجهة (Frontend)](#9-الواجهة-frontend)
10. [نتائج الاختبارات الفعلية](#10-نتائج-الاختبارات-الفعلية)
11. [المشاكل المفتوحة](#11-المشاكل-المفتوحة)
12. [التوسعات: GPS والطقس وIoT](#12-التوسعات-gps-والطقس-وiot)
13. [المستخدمون (Personas)](#13-المستخدمون-personas)
14. [خارطة الطريق المستقبلية](#14-خارطة-الطريق-المستقبلية)
15. [ملحق: كل الأوامر المرجعية](#15-ملحق-كل-الأوامر-المرجعية)

---

## 1. نظرة عامة

| | |
|---|---|
| **اسم المنتج** | Zira3i AI — الطبيب الزراعي الذكي |
| **الفئة المستهدفة** | صغار ومتوسطي الفلاحين في الجزائر والمغرب العربي |
| **المنصة** | تطبيق ويب (Next.js/React)، RTL كامل |
| **محرك الذكاء الاصطناعي** | AgriChat (LoRA) فوق LLaVA-OneVision-Qwen2-7B — self-hosted، بدون API خارجي مدفوع |
| **البنية التحتية** | NVIDIA L40S (48GB VRAM) عبر Brev/massedcompute |

---

## 2. المشكلة

الفلاحون، خصوصًا في المناطق الريفية بالجزائر، يواجهون:
- تأخرًا في تشخيص أمراض النباتات ونقص التغذية، مما يؤدي لخسائر في المحصول.
- غياب استشاري زراعي متاح فورًا وبتكلفة منخفضة.
- صعوبة الوصول لمعلومة موثوقة بالعربية المبسطة وقابلة للتطبيق ميدانيًا.

---

## 3. الحل

تطبيق ويب بسيط: يرفع المزارع صورة لورقة نبتة و/أو يكتب وصف المشكلة، فيقوم الذكاء الاصطناعي بـ:
1. تشخيص المرض أو النقص الغذائي.
2. تقدير درجة الخطورة ونسبة الثقة في التشخيص.
3. اقتراح علاج عملي، خطوات وقاية، وجدول ري/تسميد.
4. تسليم كل ذلك بصيغة تقرير قابل للتحميل (PDF/TXT)، بالعربية أو الفرنسية، مع مشاركة مباشرة عبر واتساب.

---

## 4. تدفق المستخدم (User Flow)

```
1. صورة وسياق  → رفع صورة الورقة + نوع المحصول + الموقع (GPS) + طور النمو
2. استدلال ويقين → AgriChat يحلل الصورة ويُخرج تشخيصًا بدرجة يقين
3. إجراء الآن   → خطوات عاجلة مطلوبة اليوم
4. لا تفعل     → تحذيرات صريحة مما يجب تجنبه فورًا
5. موعد المتابعة → تاريخ إعادة الفحص الميداني المقترح
```

النتيجة النهائية تُعرض كبطاقة تحتوي: اسم المرض (عربي + اسم علمي)، خطورة، درجة يقين، أدلة بصرية داعمة، خطة تدخل مرقّمة، تحذير "لا تفعل"، ظروف حدوث الإصابة، تدخل كيميائي/بيولوجي، توجيهات تسميد وري، وإجراءات وقاية للموسم القادم — مع أزرار تحميل PDF/TXT ومشاركة واتساب.

---

## 5. البنية التقنية الكاملة

```
[صورة الورقة] ──┐
[وصف نصي]    ──┼──► API (FastAPI) ──► Context Builder ──► AgriChat (LLaVA-OneVision)
[GPS الموقع]  ──┤                                              │
[بيانات الطقس]──┘                                              ▼
                                              تشخيص JSON منظم + خطة قرار ميدانية
```

### الطبقات

| الطبقة | التقنية | التفاصيل |
|---|---|---|
| **الواجهة** | Next.js / React | RTL كامل، عربي/فرنسي/إنجليزي، قراءة صوتية |
| **API** | FastAPI + Uvicorn | محمي بـ `X-API-Key`، يُخرج JSON منظم |
| **المحرك الذكي** | LLaVA-OneVision-Qwen2-7B + AgriChat (LoRA عبر PEFT) | self-hosted، bfloat16 |
| **البنية التحتية** | NVIDIA L40S (48GB) على Brev/massedcompute | بدون اعتماد على API خارجي مدفوع |

### لماذا bfloat16؟
لأن الـL40S يدعم BF16، فيقلّ استهلاك VRAM بشكل كبير مقارنةً بـFP32، مع الحفاظ على دقة مناسبة للاستدلال.

---

## 6. إعداد بيئة GPU من الصفر

بيئة الخادم: Ubuntu، Python 3.12، venv في `/home/shadeform/.venv`.

```bash
# تفعيل البيئة الافتراضية
source /home/shadeform/.venv/bin/activate

# تثبيت المتطلبات
python -m pip install -U torch transformers peft accelerate pillow huggingface_hub
python -m pip install -U torchvision   # مطلوب لمعالج LLaVA-OneVision (صور/فيديو)
python -m pip install fastapi uvicorn python-multipart

# تسجيل الدخول لـ Hugging Face
hf auth login

# تحميل الموديلات
hf download boudiafA/AgriChat --local-dir ~/AgriChat
hf download llava-hf/llava-onevision-qwen2-7b-ov-hf --local-dir ~/LLaVA-OneVision
```

### التحقق من البيئة
```bash
python -c "import torch; print('Torch:', torch.__version__); print('CUDA:', torch.version.cuda); print('GPU:', torch.cuda.get_device_name(0)); print('CUDA available:', torch.cuda.is_available())"
```

النتيجة المتوقعة:
```
Torch: 2.14.0+cu130
CUDA: 13.0
GPU: NVIDIA L40S
CUDA available: True
```

### اختبار تحميل الموديل + الـ Adapter
```python
import torch
from transformers import LlavaOnevisionForConditionalGeneration, AutoProcessor
from peft import PeftModel

base = "/home/shadeform/LLaVA-OneVision"
adapter = "/home/shadeform/AgriChat"

processor = AutoProcessor.from_pretrained(base)
model = LlavaOnevisionForConditionalGeneration.from_pretrained(
    base, torch_dtype=torch.bfloat16, device_map="auto",
)
model = PeftModel.from_pretrained(model, adapter)

print("GPU:", torch.cuda.get_device_name(0))
print("VRAM used:", round(torch.cuda.memory_allocated() / 1024**3, 2), "GB")
```

**النتيجة الفعلية:** `GPU: NVIDIA L40S` — `VRAM used: 16.24 GB` (من أصل 48GB).

---

## 7. كود الـ API الكامل

`/home/shadeform/api_server.py` — بدون أي اعتماد على Gemini أو أي API خارجي:

```python
import io
import os
import json
import re
import secrets
import torch
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from transformers import LlavaOnevisionForConditionalGeneration, AutoProcessor
from peft import PeftModel

BASE = "/home/shadeform/LLaVA-OneVision"
ADAPTER = "/home/shadeform/AgriChat"

API_KEY = os.environ.get("ZIRA3I_API_KEY") or secrets.token_urlsafe(24)
if not os.environ.get("ZIRA3I_API_KEY"):
    print(f"\n>>> No ZIRA3I_API_KEY set. Generated one for this session:\n>>> {API_KEY}\n")

app = FastAPI(title="Zira3i AI - AgriChat API")

print("Loading processor...")
processor = AutoProcessor.from_pretrained(BASE)

print("Loading base model...")
model = LlavaOnevisionForConditionalGeneration.from_pretrained(
    BASE, torch_dtype=torch.bfloat16, device_map="auto",
)

print("Loading AgriChat adapter...")
model = PeftModel.from_pretrained(model, ADAPTER)
model.eval()

print("Model ready. API is up.")

DEFAULT_PROMPT = (
    "Analyze this plant image and respond ONLY with a JSON object with exactly these keys: "
    "disease, severity (low/medium/high), confidence (a percentage like '80%'), "
    "treatment, prevention, watering. Do not add any text before or after the JSON."
)


def verify_key(x_api_key: str | None):
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def try_extract_json(text: str):
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()
    try:
        return json.loads(cleaned), True
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0)), True
        except json.JSONDecodeError:
            pass
    return None, False


@app.get("/health")
def health():
    return {"status": "ok", "gpu": torch.cuda.get_device_name(0)}


@app.post("/diagnose")
async def diagnose(
    file: UploadFile = File(...),
    question: str = Form(default=DEFAULT_PROMPT),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
):
    verify_key(x_api_key)

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    conversation = [
        {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": question},
            ],
        },
    ]
    prompt = processor.apply_chat_template(conversation, add_generation_prompt=True)
    inputs = processor(images=image, text=prompt, return_tensors="pt").to(model.device, torch.bfloat16)

    with torch.no_grad():
        output = model.generate(**inputs, max_new_tokens=300, do_sample=False)

    raw_response = processor.decode(
        output[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True
    )

    parsed, ok = try_extract_json(raw_response)

    return {
        "question": question,
        "diagnosis_raw": raw_response,
        "diagnosis": parsed if ok else None,
        "structured": ok,
    }
```

### تشغيل السيرفر
```bash
export ZIRA3I_API_KEY="مفتاحك_القوي_هنا"
python -m uvicorn api_server:app --app-dir /home/shadeform --host 0.0.0.0 --port 8000
```

---

## 8. الشبكة والوصول الخارجي

### مشكلة "HTTP port" في Brev (لا تستخدمها لـ API)
منصة Brev توفر قسمين مختلفين تمامًا للوصول الخارجي:

| القسم | الطبيعة | مناسب لـ |
|---|---|---|
| **HTTP port / Secure Link** | محمي بـPomerium (تسجيل دخول OAuth عبر المتصفح) | تطبيقات بشرية (Jupyter، لوحات تحكم) — **غير مناسب لـcurl/API** |
| **TCP/UDP Ports** | تمرير مباشر (raw TCP passthrough)، بلا مصادقة على مستوى الشبكة | API آلي — الحماية تكون عبر API Key في التطبيق نفسه |

محاولة استخدام رابط "HTTP port" مع `curl` ترجع `302 Found` وصفحة تسجيل دخول Pomerium بدل الرد الفعلي.

### فتح المنفذ الصحيح
من لوحة Brev → **TCP/UDP Ports → Open Port**:
- Port number: `8000`
- Protocol: `TCP`
- Allowed Sources: `0.0.0.0/0` (الحماية عبر API Key لا الشبكة)

النتيجة: `global.prd.ga.run.brev.nvidia.com:XXXXX → 8000`

### الجدار الناري على مستوى السيرفر (ufw + iptables)
```bash
# ufw
sudo /usr/sbin/ufw allow 8000/tcp
sudo /usr/sbin/ufw status numbered

# iptables (سلسلة DOCKER-USER) — يجب الإدراج قبل سطر DROP
sudo iptables -I DOCKER-USER -p tcp --dport 8000 -j ACCEPT
sudo iptables -L DOCKER-USER -n --line-numbers
```

### الاختبار النهائي من جهاز خارجي
```bash
curl http://global.prd.ga.run.brev.nvidia.com:XXXXX/health
# → {"status": "ok", "gpu": "NVIDIA L40S"}

curl -X POST http://global.prd.ga.run.brev.nvidia.com:XXXXX/diagnose \
  -H "X-API-Key: مفتاحك" \
  -F "file=@/path/to/image.jpg"
```

---

## 9. الواجهة (Frontend)

واجهة عربية RTL كاملة (مع دعم فرنسي/إنجليزي)، تحتوي:
- شريط علوي: تبديل اللغة (EN/FR/عربي)، زر صامت/صوت، دليل الفلاح، مفتاح النموذج مُعدّ.
- نموذج سياق سريع (4 حقول): نوع المحصول (بطاطس، طماطم، قمح وحبوب، شجرة الزيتون، حمضيات وبرتقال، فلفل وحار، نخيل التمر، محصول آخر)، طور النمو، الموقع (GPS أو يدوي)، رفع صورة الورقة.
- وصف نصي اختياري + أزرار أعراض شائعة سريعة (بقع زيتية داكنة، مسحوق أبيض دقيقي، اصفرار بين العروق، اسوداد وتعفن الساق، بثور صدأ برتقالية).
- بطاقة النتيجة: اسم المرض + الاسم العلمي، خطورة، يقين، أدلة بصرية وسياقية داعمة، خطة قرار ميدانية مرقّمة، تحذير "لا تفعل" بارز بالأحمر، موعد إعادة الفحص، ظروف حدوث الإصابة، تدخل كيميائي (بفترة أمان قبل الجني)، مكافحة بيولوجية، توجيهات تسميد وري، إجراءات وقاية للموسم القادم.
- أزرار: تحميل TXT، نسخ، استماع صوتي، مشاركة واتساب، تصدير PDF كامل.
- سجل تشخيصات الجلسة (اختياري الحفظ محليًا على الجهاز).
- تنويه واضح: "هذا التقرير هو أداة استرشادية لدعم القرار الزراعي، ولا يعني الفحص الميداني والمباشر للمهندس الزراعي أو المرشد المعتمد لدى المعهد الوطني لحماية النباتات (INPV)."

---

## 10. نتائج الاختبارات الفعلية

| الاختبار | النتيجة |
|---|---|
| تحميل الموديل + Adapter | ✅ نجح — 16.24 GB VRAM |
| تشخيص صورة حقيقية (إنجليزي) | ✅ Powdery Mildew، وصف وعلاج متماسكان |
| تشخيص صورة حقيقية (عربي) | ⚠️ "الفطير الوراثي"، "تفاحات سوداء" — هلوسة لغوية غير متماسكة |
| طلب JSON منظم مباشرة من AgriChat | ✅ نجح (`structured: true`) — Powdery Mildew مع كل الحقول الستة صحيحة |
| API Key (رفض بدون مفتاح) | ✅ يرجع 401 كما هو متوقع |
| الوصول الخارجي عبر HTTP port/Secure Link | ❌ فشل (302 → Pomerium login) |
| الوصول الخارجي عبر TCP/UDP Ports | ✅ نجح بعد فتح المنفذ في ufw/iptables/Brev |
| تشخيص صورة مُصنّعة (canvas) + وصف عربي | ⚠️ تشخيص (Leaf Spot) لا يطابق الوصف النصي المُرسل (بقع زيتية بنية وزغب أبيض) — يحتاج تحقيقًا في تمرير الوصف للموديل |

---

## 11. المشاكل المفتوحة

1. **الدعم العربي ضعيف** — AgriChat يُخرج نصًا عربيًا غير متماسك لغويًا وعلميًا؛ الإنجليزية تعمل بشكل جيد ومتماسك.
2. **تشغيل غير دائم** — السيرفر يعمل حاليًا foreground فقط في الطرفية؛ يحتاج `systemd` أو `tmux`/`nohup` ليبقى يعمل بعد إغلاق الجلسة.
3. **تناقض محتمل بين الوصف النصي والصورة** — في اختبار الصورة المُصنّعة، الموديل بدا يتجاهل الوصف العربي المُرسل؛ يحتاج تتبعًا للتأكد من أن الـbackend يمرر `description` فعليًا داخل الـprompt.
4. **لا يوجد تخزين دائم** — لا قاعدة بيانات أو حسابات مستخدمين (خارج النطاق الحالي عمدًا).

---

## 12. التوسعات: GPS والطقس وIoT

### GPS (جاهز للتنفيذ)
```python
import httpx

async def get_location_name(lat: float, lon: float) -> str:
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"lat": lat, "lon": lon, "format": "json", "accept-language": "ar"}
    headers = {"User-Agent": "Zira3iAI/1.0"}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params, headers=headers, timeout=5)
        data = r.json()
        addr = data.get("address", {})
        return addr.get("state") or addr.get("county") or data.get("display_name", "")
```
مجاني بالكامل عبر Nominatim (OpenStreetMap)، حد استخدام تقريبي: طلب واحد/ثانية.

### الطقس (جاهز للتنفيذ)
```python
async def get_weather(lat: float, lon: float) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat, "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
        "daily": "precipitation_probability_max,temperature_2m_max,temperature_2m_min",
        "forecast_days": 3, "timezone": "auto",
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params, timeout=5)
        return r.json()

def weather_to_context(weather: dict) -> str:
    cur = weather["current"]
    rain_prob = weather["daily"]["precipitation_probability_max"][0]
    return (
        f"Current field conditions: temperature {cur['temperature_2m']}°C, "
        f"relative humidity {cur['relative_humidity_2m']}%, "
        f"rain probability next 24h: {rain_prob}%, "
        f"wind speed {cur['wind_speed_10m']} km/h."
    )
```
مجاني بالكامل عبر Open-Meteo، بدون مفتاح API.

### دمجهما في `/diagnose`
```python
context_parts = []
if lat is not None and lon is not None:
    location_name = await get_location_name(lat, lon)
    weather = await get_weather(lat, lon)
    context_parts.append(f"Location: {location_name}.")
    context_parts.append(weather_to_context(weather))

context_text = " ".join(p for p in context_parts if p)
full_question = f"{context_text}\n\n{question}" if context_text else question
```

### IoT — إمكانية مستقبلية 🔮 (غير مُفعَّلة حاليًا)
عند توفر حسّاسات فعلية في الحقل مستقبلًا (رطوبة تربة، حرارة/رطوبة هواء محلية، بلل الأوراق)، تُستقبل عبر نقطة `/iot/ingest` بسيطة من ESP32/Arduino عبر WiFi، وتُحوَّل لسياق نصي بنفس منطق الطقس أعلاه — بدون أي حاجة لإعادة تدريب AgriChat، لأن الإضافة نصّية بحتة.

**المبدأ العام لكل التوسعات:** لا نُدرّب الموديل على بيانات جديدة؛ نبني **Context Builder** يحوّل كل مصدر بيانات (GPS، طقس، IoT مستقبلًا) إلى نص يُدرج في الـprompt جانب الصورة — AgriChat يقرأه كسياق إضافي فقط.

---

## 13. المستخدمون (Personas)

| الشخصية | الحاجة |
|---|---|
| فلاح صغير أو متوسط | تشخيص سريع بدون خبرة تقنية، بلغته المحلية |
| مستشار/مرشد زراعي | أداة مساعدة لفحص عدة حالات بسرعة (Batch) |

---

## 14. خارطة الطريق المستقبلية

1. دعم صوتي كامل بالعربية الدارجة الجزائرية.
2. تطبيق موبايل (React Native / Flutter) للعمل شبه دون اتصال.
3. تدريب نموذج تصنيف/تشخيص محلي إضافي على أمراض شائعة في الجزائر موثقة، لحل مشكلة تماسك العربية جذريًا.
4. لوحة تحكم للمرشدين الزراعيين لتتبع الحالات على مستوى منطقة/ولاية.
5. تفعيل حسّاسات IoT الحقلية عند توفرها فعليًا.
6. تشغيل دائم للـAPI عبر `systemd` بدل التشغيل اليدوي.

---

## 15. ملحق: كل الأوامر المرجعية

```bash
# تفعيل البيئة
source /home/shadeform/.venv/bin/activate

# فحص من يستخدم منفذًا معينًا وإيقافه
sudo lsof -i :8000
kill -9 <PID>

# تشغيل السيرفر
export ZIRA3I_API_KEY="مفتاحك"
python -m uvicorn api_server:app --app-dir /home/shadeform --host 0.0.0.0 --port 8000

# اختبار محلي
curl -X POST http://localhost:8000/diagnose \
  -H "X-API-Key: مفتاحك" \
  -F "file=@/home/shadeform/test_plant.webp"

# اختبار خارجي (من جهازك الشخصي، لا من داخل السيرفر)
curl http://global.prd.ga.run.brev.nvidia.com:XXXXX/health
curl -X POST http://global.prd.ga.run.brev.nvidia.com:XXXXX/diagnose \
  -H "X-API-Key: مفتاحك" \
  -F "file=@/path/to/local/image.jpg"

# تثبيت دائم للمتغيرات البيئية
echo 'export ZIRA3I_API_KEY="مفتاحك"' >> ~/.bashrc
source ~/.bashrc
```

---

*Zira3i AI — نظام دعم القرار الزراعي الميداني والتدخل الميداني للفلاح الجزائري والمغاربي. إفصاح استرشادي دائم: هذا التقرير أداة استرشادية لدعم القرار الزراعي، ولا يُغني عن الفحص الميداني والمباشر للمهندس الزراعي أو المرشد المعتمد لدى المعهد الوطني لحماية النباتات (INPV).*
