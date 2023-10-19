const express = require ('express')
const app = express();
const mongoose = require('mongoose');
const soru = require('./models/soru.model');
const pageRoute = require('./routes/page.route');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require("path");



app.use(express.json());
app.use(express.urlencoded({extended: true}));
const server = http.createServer( app);
const io = socketIO(server);
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect('mongodb://127.0.0.1:27017').then(()=>
{
    console.log("DB bağlandı");
});

app.set('view engine', 'twig');


app.use("/", pageRoute);


app.get("/soru_kayit", async (req,res,next) =>{
    try {
        await soru.insertMany([
            {
               Soru: "İlk programlanabilir bilgisayar fikrini ortaya atan ve bilgisayarın muciti olarak kabul edilen bilim insanı kimdir ?",
               A: "Wright kardeşler",
               B: "Charles Babbage",
               C: "Paul Dirac",
               D: "Thomas Hunt Morgan",
               Cevap: "Charles Babbage"
            },
            {
                Soru: "İnternet ilk olarak hangi alanda kullanılmıştır ?",
                A: "Bilim alanında kullanılmıştır",
                B: "Askeri alanda kullanılmıştır.",
                C: "Sağlık alanında kullanılmıştır.",
                D: "Eğitim alanında kullanılmıştır.",
                Cevap: "Askeri alanda kullanılmıştır."
            },
            {
                Soru: "John Backus liderliğinde bir ekip tarafından geliştirilen başarılı ilk üst düzey programlama dili hangisidir ?",
                A: "FORTRAN",
                B: "LISP",
                C: "ALGOL",
                D: "COBOL",
                Cevap: "FORTRAN"
            },
            {
                Soru: "Speedtest tarafından açıklanan listede dünyanın en hızlı internet ortalamasına sahip ülke hangisidir?",
                A: "Tayland",
                B: "Çin",
                C: "Singapur",
                D: "ABD",
                Cevap: "Singapur"
            },
            {
                Soru: "İlk bilgisayar programcısı olarak kabul edilen İngiliz asıllı bilim insanı kimdir ?",
                A: "David Goodall",
                B: "John Frederic Daniell",
                C: "Roger Bacon",
                D: "Ada Lovelace",
                Cevap: "Ada Lovelace"
            },
            {
                Soru: "Dünyada genel olarak internet üzerinden en fazla arama yapılan arama motoru hangisidir ?",
                A: "Yandex",
                B: "Bing",
                C: "Google",
                D: "Baidu",
                Cevap: "Google"
            },
            {
                
                Soru: "Google'ın geliştiricilerinin orijinal bir imla değişikliği yaparak “Google” olarak adlandırdığı ismin kökeni olan matematik teriminin adı nedir?",
                A: "Googol",
                B: "Googl",
                C: "Googlo",
                D: "Goog",
                Cevap: "Googol"
            },
            {
                Soru: "İlk Kişisel Bilgisayar virüsü hangisidir?",
                A: "Trap Doors",
                B: "Conficker",
                C: "Brain",
                D: "Exploit.",
                Cevap: "Brain"
            },
            {
                Soru: "Google’ın bünyesinde bulunan Android ilk ne zaman piyasaya sunulmuştur?",
                A: "22 Ekim 2003",
                B: "14 Aralık 2000",
                C: "9 Temmuz 2010",
                D: "23 Eylül 2008",
                Cevap: "23 Eylül 2008"
            },
            
            {
                Soru: "Hangisi Google’ın güncel hizmetlerinden değildir?",
                A: "Google Maps",
                B: "Google Sheets",
                C: "Google Meet",
                D: "Google Play Music",
                Cevap: "Google Play Music"
            },
            {
                Soru: "Yaşar Üniversitesi Google Developer Student Clubs da 2023-2024 akademik döneminde Core Team de kaç kişi vardır?",
                A: "20",
                B: "18",
                C: "24",
                D: "22",
                Cevap: "24"
            },
            {
                Soru: "Araştırma şirketlerin verileri sonucu 2023 yılında dünya da en çok kullanılan yazılım dili hangisidir?",
                A: "C",
                B: "JavaScript",
                C: "Pyhton",
                D: "C++",
                Cevap: "JavaScript"
            },
            {
                Soru: "Hangisi Google’ın kurucularından biridir ? ",
                A: "Mark Zuckerberg",
                B: "Larry Page",
                C: "Sundar Pichai",
                D: "Andrew McCollu",
                Cevap: "Larry Page"
            },
            {
                Soru: "Google’ın yan kuruluşlarından olan YouTube’da en çok hangi video türleri izleniyor? ",
                A: "Makyaj Videoları",
                B: "Oyun Videoları",
                C: "Müzik Videoları",
                D: "Eğitim Videoları",
                Cevap: "Müzik Videoları"
            },
            {
                Soru: "Google’ın logosunda bulunan harflerin hangisinin rengi yanlış verilmiştir ? ",
                A: "G - mavi",
                B: "E - kırmızı",
                C: "L - sarı",
                D: "O - kırmızı",
                Cevap: "L - sarı"
            },

  
        ])
        res.send("sorular saved successfully");
    
    } catch (error) {
            console.log("soru-kayit error: "+error);
        }
    })



const odalar = {};
let first = 0;

async function getDistinctSorular() {
    const questions = await soru.find({});
    return questions;
  }


let sorular = getDistinctSorular();
let index = 0;
let test = {
    question: sorular[0],
    xd: "12345xdxd" , // startta yollanacak hash key
    length: sorular.length
};

let sıralama = 0;





io.on('connection', (socket) => {

    socket.on('odaKatil',(infos)=>{
        let odaAdi = infos.odaAdi;
        let kullaniciAdi = infos.username;
    
        if(!odalar[odaAdi])
        {
            odalar[odaAdi] = {};
        }
    
          if(!odalar[odaAdi][kullaniciAdi])
          {
            odalar[odaAdi][kullaniciAdi] = []
            odalar[odaAdi][kullaniciAdi].push({puan:0});
            odalar[odaAdi][kullaniciAdi].push({streak:0});
            io.to(socket.id).emit("sıralama",sıralama);
            sıralama++;
          }
          else
          {
            io.to(socket.id).emit("hataliAd","hata");
          }
           
    })
    
    socket.on("start", info => {
       io.in(info.odaAdi).emit("başlatıdlı", test)
       index = 1;
    })
    
    socket.on("cevap", valueler =>{
    if(valueler.cevap == true)  // cevap doğru ise ilk mi diye kontrol et
    {
    if(first == 0)  // ilkse ekstra puan ver 
    {
    odalar[odaAdi][socket.id].puan+=15;
    odalar[odaAdi][socket.id].streak++;
    first = 1;     // başkası ilk olmasın
    
    }
    else
    {
    odalar[odaAdi][socket.id].puan+=10;    // ilk değilse normal puan ver streak ver
    odalar[odaAdi][socket.id].streak++;
    }
    
    
    }
    else   // yanlış ise puan verme streak sıfırla
    {
    odalar[odaAdi][socket.id].streak= 0;
    }
    
    
    })
    
    
    socket.on("dashboard", value => {
        const kullanıcılar = Object.entries(odalar[value.odaAdi]).map(([kullaniciAdi, kullanici]) => {
            return {
                kullaniciAdi: kullaniciAdi,
                puan: kullanici.puan,
                streak: kullanici.streak
            };
        });
    
        kullanıcılar.sort((a, b) => b.puan - a.puan); // Puanlara göre sırala
        io.in(value.odaAdi).emit("getDashboard", kullanıcılar); // Sıralanmış kullanıcıları gönder
    });
    
    socket.on("next",value =>  {
        if(index < sorular.length)
        {
            io.in("next",sorular[index])//öne yolla
            index++;
            first = 0;
        }
        else
        {
            io.in("next","bitti"); // sorular bittiyse öne bitti diye yolla oyun sonu ekranını ver.
        }
    
    })
    
    
    
    
    })


    
const PORT = 80;
app.listen(PORT,()=>{
console.log(`App is running on ${PORT}`)
})
