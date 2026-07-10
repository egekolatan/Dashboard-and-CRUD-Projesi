const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'novadash_super_secret_session_token_key_98765';

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow custom base64 avatars

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../projelerim')));

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Token bulunamadı, yetkisiz erişim.' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
        req.user = user;
        next();
    });
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }
    
    const db = readDb();
    const emailLower = email.toLowerCase();
    
    if (db.users.some(u => u.email === emailLower)) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email: emailLower,
            password: hashedPassword,
            avatar: name.charAt(0).toUpperCase()
        };
        
        db.users.push(newUser);
        
        // Initialize dashboard data structure for user
        db.dashboardData[emailLower] = {
            tasks: [],
            transactions: [],
            notes: [],
            quickNote: '',
            city: 'İzmir',
            theme: 'dark',
            accent: '#3b82f6'
        };
        
        writeDb(db);
        res.status(201).json({ message: 'Kayıt başarıyla tamamlandı!' });
    } catch (e) {
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'E-posta ve şifre gereklidir.' });
    }
    
    const db = readDb();
    const emailLower = email.toLowerCase();
    const user = db.users.find(u => u.email === emailLower);
    
    if (!user) {
        return res.status(400).json({ message: 'E-posta veya şifre hatalı!' });
    }
    
    try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'E-posta veya şifre hatalı!' });
        }
        
        const token = jwt.sign({ name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                avatar: user.avatar || user.name.charAt(0).toUpperCase()
            }
        });
    } catch (e) {
        res.status(500).json({ message: 'Giriş yapılırken hata oluştu.' });
    }
});

// Update Profile Settings
app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const { name, avatar, city, theme, accent } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === req.user.email);
    
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    
    const userDash = db.dashboardData[req.user.email] || {};
    if (city) userDash.city = city;
    if (theme) userDash.theme = theme;
    if (accent) userDash.accent = accent;
    
    db.dashboardData[req.user.email] = userDash;
    
    writeDb(db);
    res.json({
        message: 'Profil başarıyla güncellendi.',
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    });
});

// ----------------------------------------------------
// PRODUCT CRUD ENDPOINTS (Global but owner-managed)
// ----------------------------------------------------

// Get all products
app.get('/api/products', authenticateToken, (req, res) => {
    const db = readDb();
    res.json(db.products);
});

// Create product
app.post('/api/products', authenticateToken, (req, res) => {
    const { name, category, price, stock } = req.body;
    if (!name || !category || price === undefined || stock === undefined) {
        return res.status(400).json({ message: 'Eksik ürün bilgisi.' });
    }
    
    const db = readDb();
    const newProduct = {
        id: Date.now().toString(),
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        createdBy: req.user.name,
        creatorEmail: req.user.email
    };
    
    db.products.push(newProduct);
    writeDb(db);
    res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', authenticateToken, (req, res) => {
    const { name, category, price, stock } = req.body;
    const db = readDb();
    const product = db.products.find(p => p.id === req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı.' });
    if (product.creatorEmail !== req.user.email) {
        return res.status(403).json({ message: 'Bu ürünü düzenleme yetkiniz yok.' });
    }
    
    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    
    writeDb(db);
    res.json(product);
});

// Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const db = readDb();
    const product = db.products.find(p => p.id === req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı.' });
    if (product.creatorEmail !== req.user.email) {
        return res.status(403).json({ message: 'Bu ürünü silme yetkiniz yok.' });
    }
    
    db.products = db.products.filter(p => p.id !== req.params.id);
    writeDb(db);
    res.json({ message: 'Ürün başarıyla silindi.' });
});

// ----------------------------------------------------
// DASHBOARD ENDPOINTS
// ----------------------------------------------------

// Get user dashboard data
app.get('/api/dashboard/data', authenticateToken, (req, res) => {
    const db = readDb();
    const userDash = db.dashboardData[req.user.email] || {
        tasks: [],
        transactions: [],
        notes: [],
        quickNote: '',
        city: 'İzmir',
        theme: 'dark',
        accent: '#3b82f6'
    };
    res.json(userDash);
});

// Save user dashboard data
app.post('/api/dashboard/data', authenticateToken, (req, res) => {
    const { tasks, transactions, notes, quickNote, city, theme, accent } = req.body;
    const db = readDb();
    const userDash = db.dashboardData[req.user.email] || {};
    
    if (tasks !== undefined) userDash.tasks = tasks;
    if (transactions !== undefined) userDash.transactions = transactions;
    if (notes !== undefined) userDash.notes = notes;
    if (quickNote !== undefined) userDash.quickNote = quickNote;
    if (city !== undefined) userDash.city = city;
    if (theme !== undefined) userDash.theme = theme;
    if (accent !== undefined) userDash.accent = accent;
    
    db.dashboardData[req.user.email] = userDash;
    writeDb(db);
    res.json({ message: 'Dashboard verileri başarıyla kaydedildi.' });
});

// Reset Password (Şifre Sıfırlama)
app.post('/api/auth/reset-password', async (req, res) => {
    const { name, email, newPassword } = req.body;
    if (!name || !email || !newPassword) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }
    
    const db = readDb();
    const emailLower = email.toLowerCase();
    const user = db.users.find(u => u.email === emailLower);
    
    if (!user) {
        return res.status(400).json({ message: 'E-posta adresi sistemde kayıtlı değil!' });
    }
    
    if (user.name.toLowerCase() !== name.toLowerCase()) {
        return res.status(400).json({ message: 'Girdiğiniz ad soyad bilgisi kayıtlı kullanıcıyla eşleşmiyor!' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        writeDb(db);
        res.json({ message: 'Şifreniz başarıyla sıfırlandı! Yeni şifrenizle giriş yapabilirsiniz.' });
    } catch (e) {
        res.status(500).json({ message: 'Şifre sıfırlanırken hata oluştu.' });
    }
});

// ----------------------------------------------------
// AI CHAT ENDPOINT
// ----------------------------------------------------
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Mesaj gereklidir.' });
    }

    const db = readDb();
    const userEmail = req.user.email;
    const userData = db.dashboardData[userEmail] || {};
    
    // Extract context for the assistant
    const tasksInfo = (userData.tasks || []).map(t => `- [${t.completed ? 'x' : ' '}] ${t.text}`).join('\n');
    const transactionsInfo = (userData.transactions || []).map(t => `- ${t.type === 'income' ? 'Gelir' : 'Gider'}: ${t.amount} TL (${t.category} - ${t.description})`).join('\n');
    const notesInfo = (userData.notes || []).map(n => `- ${n.title}: ${n.body}`).join('\n');

    const systemPrompt = `Sen bu panelin (NovaDash) yapay zeka asistanısın. Kullanıcının adı: ${req.user.name}, e-posta adresi: ${req.user.email}.
Kullanıcının panel verileri aşağıdadır:
GÖREVLER:
${tasksInfo || 'Görev bulunmuyor.'}

İŞLEMLER (BÜTÇE):
${transactionsInfo || 'İşlem kaydı bulunmuyor.'}

NOTLAR:
${notesInfo || 'Not bulunmuyor.'}

Lütfen kullanıcının sorularını bu verilere göre veya genel bilgi dahilinde yanıtla. Yanıtların Türkçe, samimi, net ve yardımcı olsun. Lütfen markdown formatı kullanabilirsin ama çok karmaşık yapma.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // Fallback to Demo/Local Mode
        const msgLower = message.toLowerCase();
        let reply = '';
        if (msgLower.includes('görev') || msgLower.includes('yapılacak')) {
            const count = (userData.tasks || []).length;
            const active = (userData.tasks || []).filter(t => !t.completed).length;
            reply = `Şu an aktif ${active} adet tamamlanmamış göreviniz var. Toplam görev sayınız ise ${count}. Görevlerinizi 'Görevler' sekmesinden yönetebilirsiniz!`;
        } else if (msgLower.includes('bütçe') || msgLower.includes('para') || msgLower.includes('gelir') || msgLower.includes('gider') || msgLower.includes('işlem')) {
            const txs = userData.transactions || [];
            const totalIncome = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
            const totalExpense = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
            reply = `Bütçe durumunuz: Toplam Geliriniz **${totalIncome} TL**, Toplam Gideriniz **${totalExpense} TL**. Net durumunuz ise **${totalIncome - totalExpense} TL**.`;
        } else if (msgLower.includes('not')) {
            const count = (userData.notes || []).length;
            reply = `Panelde şu an ${count} adet kayıtlı notunuz bulunuyor. Sol menüden 'Notlar' sekmesine geçerek tüm notlarınızı detaylıca inceleyebilirsiniz.`;
        } else if (msgLower.includes('merhaba') || msgLower.includes('selam')) {
            reply = `Merhaba ${req.user.name}! Ben NovaDash Yapay Zeka Asistanınız. Size bütçeniz, görevleriniz, notlarınız veya genel konularda yardımcı olabilirim. Ne hakkında konuşmak istersiniz?`;
        } else {
            reply = `Merhaba! Şu anda Demo Modundayım (GEMINI_API_KEY tanımlanmamış). Bana bütçeniz, notlarınız veya görevleriniz ile ilgili temel sorular sorabilirsiniz. Örneğin: 'bütçe durumum nedir?' veya 'aktif görevlerim neler?'.`;
        }
        return res.json({ response: reply, isDemo: true });
    }

    try {
        const requestBody = {
            contents: [],
            systemInstruction: {
                parts: [
                    { text: systemPrompt }
                ]
            }
        };

        if (history && Array.isArray(history)) {
            history.forEach(item => {
                requestBody.contents.push({
                    role: item.role === 'user' ? 'user' : 'model',
                    parts: [{ text: item.text }]
                });
            });
        }
        
        requestBody.contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt oluşturulamadı.';
        res.json({ response: generatedText, isDemo: false });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: 'Yapay zeka yanıtı üretilirken bir sunucu hatası oluştu.' });
    }
});


// Serve main redirect for root path
app.get('/', (req, res) => {
    res.redirect('/auth-crud/');
});

// Create default admin on server startup if not present
const seedDb = () => {
    const db = readDb();
    const adminEmail = 'egekolatan114@gmail.com';
    if (!db.users.some(u => u.email === adminEmail)) {
        bcrypt.hash('Ege352008', 10).then(hashedPassword => {
            db.users.push({
                name: 'Ege Kolatan',
                email: adminEmail,
                password: hashedPassword,
                avatar: 'E'
            });
            db.dashboardData[adminEmail] = {
                tasks: [],
                transactions: [],
                notes: [],
                quickNote: '',
                city: 'İzmir',
                theme: 'dark',
                accent: '#3b82f6'
            };
            writeDb(db);
            console.log('Default admin seeded.');
        });
    }
};
seedDb();

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
