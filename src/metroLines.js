// Metro hatları ve istasyonları
export const metroLines = [
  {
    id: 1,
    name: "M1A Hattı",
    color: "#e72419",
    railwayType: "Metro",
    stations: [
      {
        id: 1,
        name: "Yenikapı",
        location: { lat: 41.00557755694778, lng: 28.950457563563546 },
      },
      {
        id: 2,
        name: "Aksaray",
        location: { lat: 41.01207799449946, lng: 28.94815235769824 },
      },
      {
        id: 3,
        name: "Emniyet-Fatih",
        location: { lat: 41.01786033824504, lng: 28.93918062825805 },
      },
      {
        id: 4,
        name: "Topkapı-Ulubatlı",
        location: { lat: 41.02472287530622, lng: 28.93018681223749 },
      },
      {
        id: 5,
        name: "Bayrampaşa-Maltepe",
        location: { lat: 41.03436259003804, lng: 28.92140057669758 },
      },
      {
        id: 6,
        name: "Sağmalcılar",
        location: { lat: 41.041122697635736, lng: 28.9074375129944 },
      },
      {
        id: 7,
        name: "Kocatepe",
        location: { lat: 41.048496211637314, lng: 28.895543112963935 },
      },
      {
        id: 8,
        name: "Otogar",
        location: { lat: 41.04024561976906, lng: 28.89452945263826 },
        crossStation: true,
      },
      {
        id: 9,
        name: "Terazidere",
        location: { lat: 41.030546454049336, lng: 28.897786957713883 },
      },
      {
        id: 10,
        name: "Davutpaşa-YTÜ",
        location: { lat: 41.02048319631843, lng: 28.90032973146628 },
      },
      {
        id: 11,
        name: "Merter",
        location: { lat: 41.007388105458915, lng: 28.896315225325452 },
      },
      {
        id: 12,
        name: "Zeytinburnu",
        location: { lat: 41.001822401263226, lng: 28.889962669949902 },
      },
      {
        id: 13,
        name: "Bakırköy-İncirli",
        location: { lat: 40.99675052992498, lng: 28.8753070967955 },
      },
      {
        id: 14,
        name: "Bahçelievler",
        location: { lat: 40.99581581332061, lng: 28.86356697781565 },
      },
      {
        id: 15,
        name: "Ataköy-Şirinevler",
        location: { lat: 40.99144440508425, lng: 28.845761024473973 },
      },
      {
        id: 16,
        name: "Yenibosna",
        location: { lat: 40.98943130021033, lng: 28.83687142715354 },
      },
      {
        id: 17,
        name: "DTM - İstanbul Fuar Merkezi",
        location: { lat: 40.98704468593208, lng: 28.828527002515752 },
      },
      {
        id: 18,
        name: "Atatürk Havalimani",
        location: { lat: 40.97962420690618, lng: 28.821169212897438 },
      },
    ],
  },
  {
    id: 2,
    name: "M1B Hattı",
    color: "#e72419",
    railwayType: "Metro",
    stations: [
      {
        id: 19,
        name: "Yenikapı",
        location: { lat: 41.00557755694778, lng: 28.950457563563546 },
      },
      {
        id: 20,
        name: "Aksaray",
        location: { lat: 41.01207799449946, lng: 28.94815235769824 },
      },
      {
        id: 21,
        name: "Emniyet-Fatih",
        location: { lat: 41.01786033824504, lng: 28.93918062825805 },
      },
      {
        id: 22,
        name: "Topkapı-Ulubatlı",
        location: { lat: 41.02472287530622, lng: 28.93018681223749 },
      },
      {
        id: 23,
        name: "Bayrampaşa-Maltepe",
        location: { lat: 41.03436259003804, lng: 28.92140057669758 },
      },
      {
        id: 24,
        name: "Sağmalcılar",
        location: { lat: 41.041122697635736, lng: 28.9074375129944 },
      },
      {
        id: 25,
        name: "Kocatepe",
        location: { lat: 41.048496211637314, lng: 28.895543112963935 },
      },
      {
        id: 26,
        name: "Otogar",
        location: { lat: 41.04024561976906, lng: 28.89452945263826 },
      },
      {
        id: 27,
        name: "Esenler",
        location: { lat: 41.03765397073063, lng: 28.88855430913355 },
      },
      {
        id: 28,
        name: "Menderes",
        location: { lat: 41.0428518039887, lng: 28.878636276716435 },
      },
      {
        id: 29,
        name: "Üçyüzlü",
        location: { lat: 41.03657503697282, lng: 28.87062608907891 },
      },
      {
        id: 30,
        name: "Bağcılar Meydan",
        location: { lat: 41.03470656200058, lng: 28.856407024201 },
      },
      {
        id: 31,
        name: "Kirazlı-Bağcılar",
        location: { lat: 41.03220179623386, lng: 28.842883877488486 },
      },
    ],
  },
  //M2
  {
    id: 3,
    name: "M2 Hattı",
    color: "#009944",
    railwayType: "Metro",
    stations: [
      {
        id: 32,
        name: "Yenikapı",
        location: { lat: 41.00557755694778, lng: 28.950457563563546 },
      },
      {
        id: 33,
        name: "Vezneciler - İstanbul Üniversitesi",
        location: { lat: 41.01250175063931, lng: 28.959629568128946 },
      },
      {
        id: 34,
        name: "Haliç",
        location: { lat: 41.023000597582715, lng: 28.96672176052353 },
      },
      {
        id: 35,
        name: "Şişhane",
        location: { lat: 41.0283537695122, lng: 28.972951108638327 },
      },
      {
        id: 36,
        name: "Taksim",
        location: { lat: 41.03701843550389, lng: 28.98576738358649 },
      },
      {
        id: 37,
        name: "Osmanbey",
        location: { lat: 41.05307578745314, lng: 28.987476848823874 },
      },
      {
        id: 38,
        name: "Şişli-Mecidiyeköy",
        location: { lat: 41.064655177627216, lng: 28.99272945136874 },
      },
      {
        id: 39,
        name: "Gayrettepe",
        location: { lat: 41.069272129217936, lng: 29.011439886906075 },
      },
      {
        id: 40,
        name: "Levent",
        location: { lat: 41.07583868512707, lng: 29.01435110229876 },
      },
      {
        id: 41,
        name: "4. Levent",
        location: { lat: 41.08610924396391, lng: 29.00703785678138 },
      },
      {
        id: 42,
        name: "Sanayi Mahallesi",
        location: { lat: 41.094387527883406, lng: 29.005146736207966 },
      },
      {
        id: 43,
        name: "Seyrantepe",
        location: { lat: 41.101116545756796, lng: 28.99552464310417 },
      },
      {
        id: 44,
        name: "İTÜ-Ayazağa",
        location: { lat: 41.10837043366006, lng: 29.021223477275825 },
      },
      {
        id: 45,
        name: "Atatürk Oto Sanayi",
        location: { lat: 41.118693162089144, lng: 29.024587026893094 },
      },
      {
        id: 46,
        name: "Darüşşafaka",
        location: { lat: 41.12921786526191, lng: 29.02538481888793 },
      },
      {
        id: 47,
        name: "Hacıosman",
        location: { lat: 41.13992845190866, lng: 29.030714704177818 },
      },
    ],
  },
  {
    id: 4,
    name: "M3 Hattı",
    color: "#00a8e1",
    railwayType: "Metro",
    stations: [
      {
        id: 48,
        name: "Bakırköy Sahil",
        location: { lat: 40.97347245455608, lng: 28.868099984740287 },
      },
      {
        id: 49,
        name: "Özgürlük Meydanı",
        location: { lat: 40.98169645400623, lng: 28.87383443629994 },
      },
      {
        id: 50,
        name: "İncirli",
        location: { lat: 40.99750952298506, lng: 28.87514683936975 },
      },
      {
        id: 51,
        name: "Haznedar",
        location: { lat: 41.00469497237254, lng: 28.871770876890828 },
      },
      {
        id: 52,
        name: "İlkyuva",
        location: { lat: 41.01195405718419, lng: 28.865178266716548 },
      },
      {
        id: 53,
        name: "Yıldıztepe",
        location: { lat: 41.01944095300224, lng: 28.85790712225384 },
      },
      {
        id: 54,
        name: "Molla Gürani",
        location: { lat: 41.02616461805744, lng: 28.84789145790801 },
      },
      {
        id: 55,
        name: "Kirazlı-Bağcılar",
        location: { lat: 41.032233134989326, lng: 28.842883625759306 },
      },
      {
        id: 56,
        name: "Yenimahalle",
        location: { lat: 41.04028352376274, lng: 28.836121457420877 },
      },
      {
        id: 57,
        name: "Mahmutbey",
        location: { lat: 41.055082506110764, lng: 28.830437408352427 },
      },
      {
        id: 58,
        name: "İstoç",
        location: { lat: 41.065137973479494, lng: 28.825800875467973 },
      },
      {
        id: 59,
        name: "İkitelli Sanayi",
        location: { lat: 41.07130718453822, lng: 28.803749157060864 },
      },
      {
        id: 60,
        name: "Turgut Özal",
        location: { lat: 41.08087959509018, lng: 28.797483489306227 },
      },
      {
        id: 61,
        name: "Siteler",
        location: { lat: 41.088012911375436, lng: 28.796660743062827 },
      },
      {
        id: 62,
        name: "Başak Konutları",
        location: { lat: 41.09714436631391, lng: 28.79081459085608 },
      },
      {
        id: 63,
        name: "Başakşehır-Metrokent",
        location: { lat: 41.10771228762244, lng: 28.801221282925905 },
      },
      {
        id: 64,
        name: "Onurkent",
        location: { lat: 41.113340566678346, lng: 28.790300346119505 },
      },
      {
        id: 65,
        name: "Şehir Hastanesi",
        location: { lat: 41.10325622452649, lng: 28.777696835813565 },
      },
      {
        id: 66,
        name: "Toplu Konutlar",
        location: { lat: 41.10708009568599, lng: 28.768052489131907 },
      },
      {
        id: 67,
        name: "Kayaşehir Merkez",
        location: { lat: 41.1189938722257, lng: 28.76636722787516 },
      },
    ],
  },
  {
    id: 5,
    name: "M4 Hattı",
    color: "#e91e76",
    railwayType: "Metro",
    stations: [
      {
        id: 68,
        name: "Kadıköy",
        location: { lat: 40.990583867360556, lng: 29.022105256544556 },
      },
      {
        id: 69,
        name: "Ayrılık Çeşmesi",
        location: { lat: 41.00024371196179, lng: 29.030206902070447 },
      },
      {
        id: 70,
        name: "Acıbadem",
        location: { lat: 41.001730383895435, lng: 29.045292920784764 },
      },
      {
        id: 71,
        name: "Ünalan",
        location: { lat: 40.99801790148272, lng: 29.060664080910318 },
      },
      {
        id: 72,
        name: "Göztepe",
        location: { lat: 40.99382146369466, lng: 29.07107506407333 },
      },
      {
        id: 73,
        name: "Yenisahra",
        location: { lat: 40.984585127403875, lng: 29.09046655965986 },
      },
      {
        id: 74,
        name: "Pegasus-Kozyatağı",
        location: { lat: 40.974846300947156, lng: 29.09932117054409 },
      },
      {
        id: 75,
        name: "Bostancı",
        location: { lat: 40.96479112377203, lng: 29.10536785380164 },
      },
      {
        id: 76,
        name: "Küçükyalı",
        location: { lat: 40.94892246935291, lng: 29.122327461413434 },
      },
      {
        id: 77,
        name: "Maltepe",
        location: { lat: 40.93582235409479, lng: 29.139065532169866 },
      },
      {
        id: 78,
        name: "Huzurevi",
        location: { lat: 40.92994555910681, lng: 29.146777355956846 },
      },
      {
        id: 79,
        name: "Gülsuyu",
        location: { lat: 40.923920681717085, lng: 29.154526257847667 },
      },
      {
        id: 80,
        name: "Esenkent",
        location: { lat: 40.92083608856989, lng: 29.166301155360454 },
      },
      {
        id: 81,
        name: "Hastane-Adliye",
        location: { lat: 40.916290003288985, lng: 29.178435469000206 },
      },
      {
        id: 82,
        name: "Soğanlık",
        location: { lat: 40.9127165567423, lng: 29.19282820255478 },
      },
      {
        id: 83,
        name: "Kartal",
        location: { lat: 40.90666229077897, lng: 29.211098344356937 },
      },
      {
        id: 84,
        name: "Yakacık-Adnan Kahvecı",
        location: { lat: 40.896734935635386, lng: 29.226954111095534 },
      },
      {
        id: 85,
        name: "Pendik",
        location: { lat: 40.88839642602733, lng: 29.238159272234693 },
      },
      {
        id: 86,
        name: "Tavşantepe",
        location: { lat: 40.882270909048756, lng: 29.24843888861699 },
      },
      {
        id: 87,
        name: "Fevzi Çakmak - Hastane",
        location: { lat: 40.88919075162807, lng: 29.2624510298631 },
      },
      {
        id: 88,
        name: "Yayalar-Şeyhli",
        location: { lat: 40.904076162522, lng: 29.27528249925981 },
      },
      {
        id: 89,
        name: "Kurtköy",
        location: { lat: 40.91028572510846, lng: 29.29661158177121 },
      },
      {
        id: 90,
        name: "Sabiha Gökçen Havalimanı",
        location: { lat: 40.90641683390656, lng: 29.310996479378556 },
      },
    ],
  },
  {
    id: 6,
    name: "Halkalı-Gebze Banliyö Hattı (Marmaray-TCDD)",
    color: "#63656a",
    railwayType: "Marmaray",
    stations: [
      {
        id: 91,
        name: "Ayrılık Çeşmesi",
        location: { lat: 41.00024371196179, lng: 29.030206902070447 },
      },
      {
        id: 92,
        name: "Üsküdar",
        location: { lat: 41.02566688047731, lng: 29.015010356006606 },
      },
      {
        id: 93,
        name: "Sirkeci",
        location: { lat: 41.01356651734699, lng: 28.976825215793156 },
      },
      {
        id: 94,
        name: "Yenikapı",
        location: { lat: 41.00557755694778, lng: 28.950457563563546 },
      },
    ],
  },
  {
    id: 7,
    name: "M5 Hattı",
    color: "#663165",
    railwayType: "Metro",
    stations: [
      {
        id: 95,
        name: "Üsküdar",
        location: { lat: 41.02566688047731, lng: 29.015010356006606 },
      },
      {
        id: 96,
        name: "Fıstıkağacı",
        location: { lat: 41.02818234313364, lng: 29.028548878847598 },
      },
      {
        id: 97,
        name: "Bağlarbaşı",
        location: { lat: 41.02166726265411, lng: 29.035429801978456 },
      },
    ],
  },
];

export default metroLines;
