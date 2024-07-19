const fs = require('fs');  // fs modülünü ekleyin
const path = require('path');  // path modülünü ekleyin
const User = require('./Models/userModel');
const OTP = require('./Models/OTPmodel');
const MovieModel = require('./Models/MovieModel');
const Message = require('./Models/MessageModel');
const createError = require('./Utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const axios = require('axios');
const Movie = require('./Models/MovieModel');

const defaultImage = `data:image/png;base64,${fs.readFileSync(path.join(__dirname, './Image/DefaultUser.png'), { encoding: 'base64' })}`;

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL, // your Hotmail/Outlook email
        pass: process.env.EMAIL_PASSWORD, // your Hotmail/Outlook password
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return next(new createError("Kullanıcı Hali Hazırda Var", 400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
            avatar: defaultImage  // Varsayılan avatarı ekle
        });

        // JWT
        const token = jwt.sign({ _id: newUser._id }, 'secretkey123', {
            expiresIn: '90d',
        });

        const newMessage = new Message({
            owner: newUser._id,
            type: "signup",
        });

        await newMessage.save();

        res.status(201).json({
            status: 'success',
            message: 'Başarıyla Hesap Oluşturuldu',
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                avatar: newUser.avatar,
                verified: newUser.verified,
                votedMovies: newUser.votedMovies,
                watchList: newUser.watchlist,
                watchedList: newUser.watchedlist
            },
        });
    } catch (error) {
        next(error);
    }
};

// Diğer işlevler burada...


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return next(new createError("Kullanıcı Bulunamadı Server çalışıyor", 404))

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return next(new createError("Şifre veya Email Hatalı", 401))

        const token = jwt.sign({ _id: user._id }, 'secretkey123', {
            expiresIn: '90d',
        });

        res.status(200).json({
            status: 'success',
            token,
            message: 'Başarıyla Giriş Yapıldı',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                verified: user.verified,
                votedMovies: user.votedMovies,
                watchList: user.watchlist,
                watchedList: user.watchedlist
            }
        })
    } catch (error) {
        console.log(error);
    }
};

exports.changeProfileData = async (req, res, next) => {
    try {
        const { updatedEmail, updatedName, updatedRole, id, updatedAvatar } = req.body;
        const user = await User.findById(id);

        if (updatedEmail) {
            user.email = updatedEmail;
        }
        if (updatedName) {
            user.name = updatedName;
        }
        if (updatedRole) {
            user.role = updatedRole;
        }
        if (updatedAvatar) {
            user.avatar = updatedAvatar;
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User data updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                verified: user.verified,
                votedMovies: user.votedMovies,
                watchList: user.watchlist,
                watchedList: user.watchedlist
            }
        });
    } catch (error) {
        console.error("Error in changeProfileData:", error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating user data'
        });
    }
};


exports.AdminData = async (req, res, next) => {
    try {
        const today = new Date();

        // Bugünden 30 gün öncesinin tarihini hesapla
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

        // Son 30 gün boyunca oluşturulan kullanıcıları bul
        const usersForLast30Days = await User.find({ createdAt: { $gte: thirtyDaysAgo, $lte: today } });

        // Her bir gün için kaydedilen kullanıcı sayısını hesapla
        const userCountByDay = {};
        // Son 30 gün içindeki her gün için önceden tanımlı olarak 0 kullanıcı sayısı ayarla
        for (let i = new Date(thirtyDaysAgo); i <= today; i.setDate(i.getDate() + 1)) {
            const day = i.toLocaleString('tr-TR', { month: 'long', day: 'numeric' });
            userCountByDay[day] = 0;
        }
        // Son 30 gün içindeki her gün için kullanıcı sayısını güncelle
        usersForLast30Days.forEach(user => {
            const day = user.createdAt.toLocaleString('tr-TR', { month: 'long', day: 'numeric' });
            if (day in userCountByDay) {
                userCountByDay[day]++;
            }
        });

        // Kullanıcı rollerine göre gruplayarak kaç tane kullanıcının olduğunu hesapla
        const userCountByRole = {};
        usersForLast30Days.forEach(user => {
            const role = user.role;
            userCountByRole[role] = (userCountByRole[role] || 0) + 1;
        });

        // Sonuçları gönder
        res.status(200).json({
            usersForLast30Days,
            userCountByDay,
            userCountByRole
        });
    } catch (error) {
        // Hata durumunda hata mesajını gönder
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
    } catch (error) {
        console.error('Kullanıcıyı silme hatası:', error);
        res.status(500).json({ message: 'Kullanıcı silinirken bir hata oluştu.' });
    }
};

exports.Profile = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        const matchedUser = await User.findById(userId);

        if (!matchedUser) {
            return res.status(404).json({ message: 'Kullanıcı Bulunamadı' });
        } else {
            return res.status(200).json({
                UserName: matchedUser.name,
                UserRole: matchedUser.role,
                UserAvatar: matchedUser.avatar,
                UserVerified: matchedUser.verified,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Sunucu Hatası' });
    }
};

exports.SearchProfile = async (req, res, next) => {
    var { SearchedValue } = req.body;

    try {
        var regex = new RegExp(SearchedValue, 'i');

        var matchedUsers = await User.find({ name: regex }).select('name avatar verified role');

        if (matchedUsers.length > 0) {
            return res.status(200).json({ matchedUsers });
        } else {
            return res.json({ matchedUsers, message: 'Kullanıcı Bulunamadı' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Sunucu Hatası' });
    }
};

exports.createVerifyCode = async (req, res, next) => {
    try {
        const ownerId = req.body.userId;

        if (!ownerId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        // Kullanıcının geçerli olup olmadığını kontrol edin
        const user = await User.findById(ownerId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.verified === true) {
            return res.status(400).json({ error: 'User already verified' });
        }

        // OTP kodu oluşturun
        const verifyCode = Math.floor(100000 + Math.random() * 900000);

        // Yeni OTP belgesi oluşturun ve kaydedin
        const newOTP = await OTP.create({
            owner: ownerId,
            code: verifyCode,
        });

        // E-posta içeriği ve başlığı
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: `FURSOY Giriş Kod:${verifyCode}`,
            html: `<body style="background-color: white; display: flex; justify-content: center; align-item:center " ><h1 style="background-color: green; padding:20px; border-radius:7px ">Doğrulama Kodu:${verifyCode}</h1></body>`
        };

        // E-posta gönderme
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to send verification email' });
            } else {
                res.json({ message: 'Verification code sent successfully', newOTP });
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.verifyOTPCode = async (req, res, next) => {
    try {
        const ownerId = req.body.userId;
        const code = parseInt(req.body.code);

        const otp = await OTP.findOne({ owner: ownerId }).sort({ createdAt: -1 });

        if (!otp || otp.code !== code) {
            return next(new createError('Invalid verification code', 400));
        }

        const user = await User.findById(ownerId);
        if (!user) {
            return next(new createError('User not found', 404));
        }

        user.verified = true;
        await user.save();

        await otp.deleteOne();

        res.json({
            message: 'Verification successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                verified: user.verified,
                votedMovies: user.votedMovies,
                watchList: user.watchlist,
                watchedList: user.watchedlist
            }
        });
    } catch (error) {
        console.error("Hata oluştu:", error); // Hata logu
        next(error);
    }
}; // Movie modelini içe aktarın

exports.SearchFilm = async (req, res, next) => {
    const searchedValue = req.body.SearchedValue;

    try {
        // İlgili film verilerini veritabanından alın veya başka bir kaynaktan getirin
        var regex = new RegExp(searchedValue, 'i');
        const films = await MovieModel.find({ originalTitle: regex })
            .sort({ numVotes: -1 }) // numVotes'e göre azalan sıralama
            .limit(10); // Yalnızca ilk 10 filmi al

        // Alınan film detaylarını istemciye gönderin
        res.status(200).json(films);
    } catch (error) {
        console.error('Film arama hatası:', error);
        res.status(500).json({ message: 'Film arama sırasında bir hata oluştu' });
    }
};

exports.Film = async (req, res, next) => {
    const filmId = req.body.filmId;

    try {
        const matchedFilm = await MovieModel.findOne({ tconst: filmId });

        if (matchedFilm) {
            res.status(200).json(matchedFilm);
        } else {
            res.status(404).json({ message: 'Film not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for the film' });
    }
};


exports.VoteFilm = async (req, res, next) => {
    const { filmId, userId, rate } = req.body;

    try {
        // Filmi ve kullanıcıyı veritabanından bulun
        const votedFilm = await MovieModel.findOne({ tconst: filmId });
        const user = await User.findById(userId);

        // Film ve kullanıcı bulunamazsa hata döndür
        if (!votedFilm || !user) {
            return res.status(404).json({ message: 'Film or User not found' });
        }

        // Kullanıcının zaten filme oy verip vermediğini kontrol et
        if (user.votedMovies.includes(votedFilm._id)) {
            return res.status(400).json({ message: 'User has already voted for this film' });
        }

        // Film puanını ve oy sayısını güncelle
        if (!votedFilm.siteTotalRating) {
            votedFilm.siteTotalRating = rate;
        } else {
            votedFilm.siteTotalRating += rate;
        }

        if (!votedFilm.siteNumVotes) {
            votedFilm.siteNumVotes = 1;
        } else {
            votedFilm.siteNumVotes++;
        }

        // Filmi kullanıcının votedMovies listesine ekle
        user.votedMovies.push(votedFilm._id);

        // Film ve kullanıcı belgelerini kaydet
        await votedFilm.save();
        await user.save();


        const newMessage = new Message({
            owner: user._id,
            movie: votedFilm._id,
            type: "votemovie",
            rate: rate
        });

        await newMessage.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token bulunamadı' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, 'secretkey123'); // Token doğrulama
        } catch (error) {
            return res.status(401).json({ message: 'Geçersiz token' });
        }

        const userId = decoded._id; // Token'dan kullanıcı ID'sini alın

        const user = await User.findById(userId).select('-password'); // Parola hariç kullanıcı verilerini alın

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                verified: user.verified,
                votedMovies: user.votedMovies,
                watchList: user.watchlist,
                watchedList: user.watchedlist
            },
            message: 'Kullanıcı başarıyla bulundu'
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.addWatchList = async (req, res, next) => {
    const { userId, filmId, action } = req.body;

    try {
        // Kullanıcı ve film verilerini al
        const user = await User.findById(userId);
        const film = await MovieModel.findOne({ tconst: filmId });

        // Kullanıcı veya film bulunamadığında hata dön
        if (!user || !film) {
            return res.status(404).json({ message: "Kullanıcı veya film bulunamadı" });
        }

        // İzlenecekler listesine ekleme işlemi
        if (action) {
            // Film zaten izlendi listesinde ise hata döndür
            if (user.watchedlist.includes(film._id)) {
                return res.status(400).json({ message: "Bu film İzlenmişler Listesinde" });
            }

            // Film zaten watchlistede ise bilgi mesajı döndür
            if (!user.watchlist.includes(film._id)) {
                user.watchlist.unshift(film._id);
                await user.save();
                return res.status(200).json({
                    message: "Film Kullanıcının İzlenecekler Listesine Eklendi"
                });
            } else {
                return res.status(200).json({ message: "Film zaten watchlistede" });
            }
        } else { // İzlenecekler listeden çıkarma işlemi
            if (!user.watchlist.includes(film._id)) {
                return res.status(400).json({ message: "Bu film zaten kullanıcının watchlistinde değil" });
            }

            // Film watchlisteden çıkar
            user.watchlist = user.watchlist.filter(f => !f.equals(film._id));
            await user.save();
            return res.status(200).json({
                message: "Film kullanıcının watchlistinden kaldırıldı"
            });
        }
    } catch (error) {
        // Hata durumunda daha açıklayıcı bir mesaj döndür
        console.error('Error in addWatchList:', error);
        res.status(500).json({ message: "Bir sorun oluştu", error: error.message });
    }
};

exports.addWatchedList = async (req, res, next) => {
    const { userId, filmId, action } = req.body;

    try {
        const user = await User.findById(userId);
        const film = await MovieModel.findOne({ tconst: filmId });

        if (!user || !film) {
            return res.status(404).json({ message: "Kullanıcı veya film bulunamadı" });
        }

        if (action === true) {
            if (!user.watchedlist.includes(film._id)) {
                user.watchedlist.unshift(film._id);
                user.watchlist = user.watchlist.filter(f => f.toString() !== film._id.toString());
                await user.save();

                return res.json({
                    message: "Film kullanıcının watchedlistine eklendi"
                });
            } else {
                return res.json({ message: "Bu film zaten kullanıcının watchedlistinde" });
            }
        } else if (action === false) {
            if (user.watchedlist.includes(film._id)) {
                user.watchedlist = user.watchedlist.filter(f => f.toString() !== film._id.toString());
                await user.save();

                return res.json({
                    message: "Film kullanıcının watchedlistinden kaldırıldı"
                });
            } else {
                return res.json({ message: "Bu film zaten kullanıcının watchedlistinde değil" });
            }
        } else {
            return res.status(400).json({ message: "Geçersiz işlem talebi" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Bir sorun oluştu" });
    }
};

exports.GetUserWatchFilm = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        } else {
            // Kullanıcının watchlist'indeki film ID'lerini alın
            const filmIds = user.watchlist;

            // Film ID'lerine göre film detaylarını veritabanından çekin
            const films = await MovieModel.find({ '_id': { $in: filmIds } });

            // Dönen filmleri JSON olarak yanıtla
            res.status(200).json(films);
        }

    } catch (error) {
        // Hata durumunda uygun bir hata mesajı gönderin
        console.error('Kullanıcının watchlist\'indeki filmler alınırken bir hata oluştu:', error);
        res.status(500).json({ message: 'Bir sorun oluştu, lütfen tekrar deneyin' });
    }
};

exports.GetUserWatchedFilm = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        } else {
            // Kullanıcının watchlist'indeki film ID'lerini alın
            const filmIds = user.watchedlist;

            // Film ID'lerine göre film detaylarını veritabanından çekin
            const films = await MovieModel.find({ '_id': { $in: filmIds } });

            // Dönen filmleri JSON olarak yanıtla
            res.status(200).json(films);
        }

    } catch (error) {
        // Hata durumunda uygun bir hata mesajı gönderin
        console.error('Kullanıcının watchedlist\'indeki filmler alınırken bir hata oluştu:', error);
        res.status(500).json({ message: 'Bir sorun oluştu, lütfen tekrar deneyin' });
    }
};

exports.GetMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // -1: descending order, 1: ascending order
        res.status(200).json(messages); // Mesajları döndürmek için yanıt ekleyebilirsiniz
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.body.userId; // req.query yerine req.body kullanıyoruz

        const user = await User.findById(userId).select('-password -email');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

exports.GetFilmById = async (req, res, next) => {
    try {
        const filmId = req.body.filmId;

        if (!filmId) {
            return res.status(400).json({ error: 'Film ID is required' });
        }

        const film = await MovieModel.findById(filmId);

        if (!film) {
            return res.status(404).json({ message: 'Film not found' });
        }

        res.status(200).json(film);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};