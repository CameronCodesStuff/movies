const PROXY_BASE = 'https://unblockedmovies.detlaffcameron.workers.dev/';
const TMDB_KEY   = '232a7338c36748bff95e5de149a21b95';
const TMDB_BASE  = 'https://api.themoviedb.org/3';

const SERVERS = [
  { name: 'Server 1', movie: (im,tm) => im ? `https://autoembed.co/movie/imdb/${im}` : `https://autoembed.co/movie/tmdb/${tm}`, tv: (im,s,e,tm) => im ? `https://autoembed.co/tv/imdb/${im}-${s}-${e}` : `https://autoembed.co/tv/tmdb/${tm}-${s}-${e}` },
  { name: 'Server 2', movie: (im,tm) => `https://vidlink.pro/movie/${tm}`,                                                       tv: (im,s,e,tm) => `https://vidlink.pro/tv/${tm}/${s}/${e}` },
  { name: 'Server 3', movie: (im,tm) => `https://vidsrc.net/embed/movie?tmdb=${tm}`,                                            tv: (im,s,e,tm) => `https://vidsrc.net/embed/tv?tmdb=${tm}&season=${s}&episode=${e}` },
  { name: 'Server 4', movie: (im,tm) => `https://multiembed.mov/directstream.php?video_id=${tm}&tmdb=1`,                        tv: (im,s,e,tm) => `https://multiembed.mov/directstream.php?video_id=${tm}&tmdb=1&s=${s}&e=${e}` }
];

let currentServer = 0;
let currentImdb = '';
let currentTmdb = '';
let useProxy = false;
let activeCat = 'all';

const CATALOGUE = [
  { cat:'hollywood', title:'Inception',                img:'images/catalogue/inception.jpg',         year:'2010', rating:'8.8', runtime:'2h 42m', synopsis:'Cobb steals information from his targets by entering their dreams. Saito offers to wipe clean his criminal history in payment for performing an inception.', trailer:'https://www.youtube.com/embed/YoHD9XEInc0', search:'Inception 2010' },
  { cat:'hollywood', title:'The Dark Knight',          img:'images/catalogue/dark knight.jpg',        year:'2008', rating:'9.0', runtime:'2h 32m', synopsis:'After Gordon, Dent and Batman begin an assault on Gotham\'s organised crime, the mobs hire the Joker to kill Batman and bring the city to its knees.', trailer:'https://www.youtube.com/embed/LDG9bisJEaI', search:'The Dark Knight 2008' },
  { cat:'hollywood', title:'Parasite',                 img:'images/catalogue/Parasite.jpg',           year:'2019', rating:'8.6', runtime:'2h 12m', synopsis:'The struggling Kim family sees an opportunity when the son starts working for the wealthy Park family and all find a way into the same household.', trailer:'https://www.youtube.com/embed/SEUXfv87Wpk', search:'Parasite 2019' },
  { cat:'hollywood', title:"We're the Millers",        img:"images/catalogue/We're_the_Millers_poster.jpg", year:'2013', rating:'7.0', runtime:'1h 58m', synopsis:'David, a drug dealer, hires a stripper and forms a fake family to smuggle drugs from Mexico.', trailer:'https://www.youtube.com/embed/0Vsy5KzsieQ', search:"We're the Millers 2013" },
  { cat:'hollywood', title:'The Terminal',             img:'images/catalogue/the terminal.jpg',       year:'2004', rating:'7.4', runtime:'2h 8m',  synopsis:'Viktor Navorski gets stranded at an airport when a war rages in his country and must stay there until his identity is confirmed.', trailer:'https://www.youtube.com/embed/hjydAG1lG_8', search:'The Terminal 2004' },
  { cat:'hollywood', title:'The Matrix',               img:'images/catalogue/Matrix.jpg',             year:'1999', rating:'8.7', runtime:'2h 16m', synopsis:'Thomas Anderson is led to fight an underground war against powerful computers who constructed his entire reality with a system called the Matrix.', trailer:'https://www.youtube.com/embed/vKQi3bBA1y8', search:'The Matrix 1999' },
  { cat:'hollywood', title:'Joker',                    img:'images/catalogue/joker.jpg',              year:'2019', rating:'8.4', runtime:'2h 2m',  synopsis:'Arthur Fleck, a party clown, leads an impoverished life and when society brands him a freak he decides to embrace the life of crime and chaos.', trailer:'https://www.youtube.com/embed/zAGVQLHvwOY', search:'Joker 2019' },
  { cat:'hollywood', title:'Hamilton',                 img:'images/catalogue/Hamilton.jpg',           year:'2020', rating:'8.4', runtime:'2h 40m', synopsis:'Alexander Hamilton, an orphan, arrives in New York and after the American Revolution goes on to become first Secretary of the Treasury of the US.', trailer:'https://www.youtube.com/embed/DSCKfXpAGHc', search:'Hamilton 2020' },
  { cat:'hollywood', title:'GoodFellas',               img:'images/catalogue/goodfellas.jpg',         year:'1990', rating:'8.7', runtime:'2h 28m', synopsis:'Young Henry Hill, with his friends Jimmy and Tommy, begins the climb from petty criminal to gangster on the mean streets of New York.', trailer:'https://www.youtube.com/embed/qo5jJpHtI1Y', search:'GoodFellas 1990' },
  { cat:'hollywood', title:'The Shawshank Redemption', img:'images/catalogue/the shawshank.jpg',      year:'1994', rating:'9.3', runtime:'2h 22m', synopsis:'Andy Dufresne, arrested for murders he claims he did not commit, is sentenced to life at Shawshank prison and becomes its most unconventional inmate.', trailer:'https://www.youtube.com/embed/6hB3S9bIaco', search:'The Shawshank Redemption 1994' },
  { cat:'hollywood', title:'The Green Mile',           img:'images/catalogue/green mile.jpg',         year:'1999', rating:'8.6', runtime:'3h 9m',  synopsis:'Paul, head guard of a prison, meets John, accused of murdering two girls, and discovers he has a special gift.', trailer:'https://www.youtube.com/embed/Ki4haFrqSrw', search:'The Green Mile 1999' },
  { cat:'hollywood', title:'Interstellar',             img:'images/catalogue/inter.jpg',              year:'2014', rating:'8.6', runtime:'2h 55m', synopsis:'When Earth becomes uninhabitable, farmer and ex-NASA pilot Cooper is tasked to pilot a spacecraft to find a new planet for humans.', trailer:'https://www.youtube.com/embed/zSWdZVtXT7E', search:'Interstellar 2014' },
  { cat:'hollywood', title:'Avengers: Endgame',        img:'images/endgame.jpg',                      year:'2019', rating:'8.4', runtime:'3h 1m',  synopsis:'After Thanos disintegrates half the universe, the Avengers must reunite to reverse his actions and restore balance — whatever it takes.', trailer:'https://www.youtube.com/embed/TcMBFSGVi1c', search:'Avengers Endgame 2019', tmdb:'299534' },
  { cat:'hollywood', title:'Avengers: Infinity War',   img:'images/catalogue/infinity.jpg',           year:'2018', rating:'8.4', runtime:'2h 40m', synopsis:'The Avengers must stop Thanos from getting his hands on all infinity stones, but Thanos is prepared to go to any lengths.', trailer:'https://www.youtube.com/embed/6ZfuNTqbHE8', search:'Avengers Infinity War 2018', tmdb:'299536' },
  { cat:'hollywood', title:'Spider-Man',               img:'images/catalogue/spider.jpg',             year:'2002', rating:'7.3', runtime:'2h 1m',  synopsis:'Peter Parker, an outcast high school student, gets bitten by a radioactive spider and attains superpowers.', trailer:'https://www.youtube.com/embed/-tnxzJ0SSOw', search:'Spider-Man 2002' },
  { cat:'hollywood', title:'The Dark Knight Rises',    img:'images/catalogue/bat.jpg',                year:'2012', rating:'8.4', runtime:'2h 44m', synopsis:'Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace.', trailer:'https://www.youtube.com/embed/g8evyE9TuYk', search:'The Dark Knight Rises 2012' },
  { cat:'hollywood', title:'The Chronicles of Narnia', img:'images/catalogue/narnia.jpg',             year:'2005', rating:'6.9', runtime:'2h 30m', synopsis:'While playing, Lucy and her siblings find a wardrobe that lands them in the mystical land of Narnia.', trailer:'https://www.youtube.com/embed/ruGHxmjQ180', search:'The Chronicles of Narnia 2005' },

  { cat:'bollywood', title:'Andaz Apna Apna',         img:'images/catalogue/aaa.jpg',                year:'1994', rating:'8.1', runtime:'2h 41m', synopsis:'Amar and Prem, middle-class rivals, compete to win over Raveena, a millionaire\'s daughter.', trailer:'https://www.youtube.com/embed/fd_w7Qw8biU', search:'Andaz Apna Apna 1994' },
  { cat:'bollywood', title:'Chakde India',             img:'images/catalogue/chakde.jpg',             year:'2007', rating:'8.2', runtime:'2h 33m', synopsis:'A tainted former hockey star coaches the Indian women\'s national hockey team to prove his loyalty to the nation.', trailer:'https://www.youtube.com/embed/6a0-dSMWm5g', search:'Chak De India 2007' },
  { cat:'bollywood', title:'Bhaag Milkha Bhaag',      img:'images/catalogue/milkha.jpg',             year:'2013', rating:'8.2', runtime:'3h 9m',  synopsis:'Milkha Singh overcomes agonising obstacles to become a world champion, Olympian and one of India\'s most iconic athletes.', trailer:'https://www.youtube.com/embed/3uICXnnW86U', search:'Bhaag Milkha Bhaag 2013' },
  { cat:'bollywood', title:'A Wednesday',              img:'images/catalogue/wed.jpg',                year:'2008', rating:'8.1', runtime:'1h 44m', synopsis:'A retired police commissioner recounts his most memorable case — a bomb scare in Mumbai by an ordinary commoner.', trailer:'https://www.youtube.com/embed/yry6pBiXx14', search:'A Wednesday 2008' },
  { cat:'bollywood', title:'MS Dhoni: The Untold Story',img:'images/catalogue/dhoni.jpg',            year:'2016', rating:'7.9', runtime:'3h 40m', synopsis:'A boy from Ranchi aspires to play cricket for India and ultimately decides to chase his dreams despite his father\'s wishes.', trailer:'https://www.youtube.com/embed/6L6XqWoS8tw', search:'MS Dhoni The Untold Story 2016' },
  { cat:'bollywood', title:'Drishyam',                 img:'images/catalogue/drishyam.jpg',           year:'2015', rating:'8.2', runtime:'2h 43m', synopsis:'When the disappearance of a policewoman\'s son threatens his family, Vijay leaves no stone unturned to shield them.', trailer:'https://www.youtube.com/embed/AuuX2j14NBg', search:'Drishyam 2015' },
  { cat:'bollywood', title:'Dilwale Dulhania Le Jayenge', img:'images/catalogue/dil.jpg',            year:'1995', rating:'8.1', runtime:'3h 12m', synopsis:'Raj and Simran fall in love across Europe. When Raj learns she is promised to another, he follows her to India to win her over.', trailer:'https://www.youtube.com/embed/oIZ4U21DRlM', search:'Dilwale Dulhania Le Jayenge 1995' },
  { cat:'bollywood', title:'Gangs of Wasseypur',       img:'images/catalogue/gangs of wassepur.jpg',  year:'2012', rating:'8.2', runtime:'2h 40m', synopsis:'A gangster clashes with the ruthless coal-mining kingpin who killed his father in this multigenerational crime saga.', trailer:'https://www.youtube.com/embed/j-AkWDkXcMY', search:'Gangs of Wasseypur 2012' },
  { cat:'bollywood', title:'Sholay',                   img:'images/catalogue/sholay.jpg',             year:'1975', rating:'8.2', runtime:'3h 24m', synopsis:'Two ex-convicts are hired by a retired policeman to help nab the notorious dacoit Gabbar Singh who terrorises Ramgarh.', trailer:'https://www.youtube.com/embed/XjiluhItzIA', search:'Sholay 1975' },
  { cat:'bollywood', title:'Rang De Basanti',          img:'images/catalogue/rdb.jpg',                year:'2006', rating:'8.1', runtime:'2h 51m', synopsis:'When Sue selects students to portray Indian freedom fighters in her film, she unwittingly awakens their patriotism.', trailer:'https://www.youtube.com/embed/QHhnhqxB4E8', search:'Rang De Basanti 2006' },
  { cat:'bollywood', title:'Munna Bhai MBBS',          img:'images/catalogue/mbbs.jpg',               year:'2003', rating:'8.1', runtime:'2h 36m', synopsis:'Munna is a goon who sets out to fulfil his father\'s dream of becoming a doctor.', trailer:'https://www.youtube.com/embed/H0OMXwKrGs8', search:'Munna Bhai MBBS 2003' },
  { cat:'bollywood', title:'KGF',                      img:'images/catalogue/kgf.jpg',                year:'2018', rating:'8.3', runtime:'2h 50m', synopsis:'Rocky, a young man, seeks power and wealth in order to fulfil a promise to his dying mother.', trailer:'https://www.youtube.com/embed/-KfsY-qwBS0', search:'KGF Chapter 1 2018' },

  { cat:'series-hw', title:'Chernobyl',               img:'images/catalogue/chernobyl.jpg',          year:'2019', rating:'9.4', runtime:'5 eps',  synopsis:'In April 1986, Chernobyl suffers one of the worst nuclear disasters in history. Heroes put their lives on the line to save Europe.', trailer:'https://www.youtube.com/embed/s9APLXM9Ei8', search:'Chernobyl TV series 2019', isTv:true },
  { cat:'series-hw', title:'Black Mirror',             img:'images/catalogue/black mirror.jpg',       year:'2011', rating:'8.8', runtime:'5 seasons',synopsis:'In a dystopian future, individuals grapple with the manipulative effects of cutting-edge technology in their personal lives.', trailer:'https://www.youtube.com/embed/V0XOApF5nLU', search:'Black Mirror TV series', isTv:true },
  { cat:'series-hw', title:'Game of Thrones',          img:'images/catalogue/got.jpg',               year:'2011', rating:'9.2', runtime:'8 seasons',synopsis:'Nine noble families wage war for control over Westeros. Meanwhile an ancient force threatens the existence of all living men.', trailer:'https://www.youtube.com/embed/gcTkNV5Vg1E', search:'Game of Thrones TV series', isTv:true },
  { cat:'series-hw', title:'Money Heist',              img:'images/catalogue/money.jpg',             year:'2017', rating:'8.3', runtime:'5 seasons',synopsis:'A criminal mastermind recruits eight people with special abilities to pull off the biggest heist in recorded history.', trailer:'https://www.youtube.com/embed/p_PJbmrX4uk', search:'Money Heist La Casa de Papel', isTv:true },
  { cat:'series-hw', title:'Lucifer',                  img:'images/catalogue/luci.jpg',              year:'2016', rating:'8.1', runtime:'5 seasons',synopsis:'The Devil abandons Hell and retires to Los Angeles, until a murder outside his nightclub draws him into detective work.', trailer:'https://www.youtube.com/embed/-0beFQnB5lY', search:'Lucifer TV series 2016', isTv:true },
  { cat:'series-hw', title:'Sherlock',                 img:'images/catalogue/sherlock series.jpg',   year:'2010', rating:'9.1', runtime:'4 seasons',synopsis:'Dr Watson shares a flat with Sherlock Holmes, an eccentric with a knack for solving the most unusual cases.', trailer:'https://www.youtube.com/embed/xK7S9mrFWL4', search:'Sherlock BBC TV series', isTv:true },
  { cat:'series-hw', title:'The Crown',                img:'images/catalogue/crown.jpeg',            year:'2016', rating:'8.6', runtime:'5 seasons',synopsis:'The series chronicles the reign of Queen Elizabeth II, revealing personal intrigues and political rivalries across the decades.', trailer:'https://www.youtube.com/embed/w1pIbUOc_lU', search:'The Crown Netflix TV series', isTv:true },
  { cat:'series-hw', title:'Firefly',                  img:'images/catalogue/firefly.jpg',           year:'2002', rating:'9.0', runtime:'1 season', synopsis:'500 years in the future after a civil war, the crew of a small transport spaceship takes any job that puts food on the table.', trailer:'https://www.youtube.com/embed/oBZrZij2-g8', search:'Firefly TV series 2002', isTv:true },
  { cat:'series-hw', title:'Top of the Lake',          img:'images/catalogue/top of the lake.jpg',   year:'2013', rating:'7.5', runtime:'2 seasons',synopsis:'A detective investigates the disappearance of a 12-year-old schoolgirl in a small town and grows obsessed with the case.', trailer:'https://www.youtube.com/embed/wGWSB_ezYzs', search:'Top of the Lake TV series', isTv:true },
  { cat:'series-hw', title:'Breaking Bad',             img:'images/catalogue/breaking.jpg',          year:'2008', rating:'9.5', runtime:'5 seasons',synopsis:'Chemistry teacher Walter White discovers he has cancer and enters the meth business to repay medical debts.', trailer:'https://www.youtube.com/embed/HhesaQXLuRY', search:'Breaking Bad TV series', isTv:true },
  { cat:'series-hw', title:'Peaky Blinders',           img:'images/catalogue/peaky.jpg',             year:'2013', rating:'8.8', runtime:'5 seasons',synopsis:'Tommy Shelby leads the Peaky Blinders gang in Birmingham as inspector Chester Campbell attempts to bring him down.', trailer:'https://www.youtube.com/embed/oVzVdvGIC7U', search:'Peaky Blinders TV series', isTv:true },
  { cat:'series-hw', title:'Ozark',                    img:'images/catalogue/ozark.jpg',             year:'2017', rating:'8.4', runtime:'4 seasons',synopsis:'Financial planner Marty Byrde relocates his family to the Ozarks after a money-laundering scheme goes badly wrong.', trailer:'https://www.youtube.com/embed/5hAXVqrljbs', search:'Ozark Netflix TV series', isTv:true },
  { cat:'series-hw', title:'Stranger Things',          img:'images/catalogue/stranger.jpg',          year:'2016', rating:'8.7', runtime:'4 seasons',synopsis:'In 1980s Indiana, a group of young friends witness supernatural forces and secret government exploits.', trailer:'https://www.youtube.com/embed/b9EkMc79ZSU', search:'Stranger Things Netflix TV series', isTv:true },
  { cat:'series-hw', title:'The Witcher',              img:'images/catalogue/witcher.jpg',           year:'2019', rating:'8.5', runtime:'3 seasons',synopsis:'Mutated monster hunter Geralt struggles to find his place in a world where people prove more wicked than beasts.', trailer:'https://www.youtube.com/embed/ndl1W4ltcmg', search:'The Witcher Netflix TV series', isTv:true },
  { cat:'series-hw', title:'WandaVision',              img:'images/catalogue/wanda.jpg',             year:'2021', rating:'8.0', runtime:'1 season', synopsis:'Living idealized suburban lives, super-powered Wanda and Vision begin to suspect that everything is not as it seems.', trailer:'https://www.youtube.com/embed/sj9J2ecsSpo', search:'WandaVision Disney Plus', isTv:true },

  { cat:'series-bw', title:'Mirzapur',                img:'images/catalogue/mirzapur.jpg',           year:'2018', rating:'8.4', runtime:'2 seasons',synopsis:'Akhandanand Tripathi is the mafia boss of Mirzapur. His son Munna, power-hungry and unworthy, continues his father\'s legacy.', trailer:'https://www.youtube.com/embed/ZNeGF-PvRHY', search:'Mirzapur Amazon Prime series', isTv:true },
  { cat:'series-bw', title:'Sacred Games',             img:'images/catalogue/sacred.jpg',            year:'2018', rating:'8.7', runtime:'2 seasons',synopsis:'Officer Sartaj Singh receives a tip about criminal overlord Ganesh Gaitonde, embarking on a dangerous cat-and-mouse chase.', trailer:'https://www.youtube.com/embed/lM1xVnYsirw', search:'Sacred Games Netflix series', isTv:true },
  { cat:'series-bw', title:'Kota Factory',             img:'images/catalogue/kota.jpg',              year:'2019', rating:'9.0', runtime:'2 seasons',synopsis:'Set in Kota — India\'s coaching hub — students come from all over the country to prepare for entrance exams.', trailer:'https://www.youtube.com/embed/pNZQ6msbOvM', search:'Kota Factory TVF series', isTv:true },
  { cat:'series-bw', title:'Aspirants',                img:'images/catalogue/upsc.jpg',              year:'2021', rating:'9.0', runtime:'1 season', synopsis:'A TVF web series following the friendships and struggles of UPSC aspirants living in Delhi.', trailer:'https://www.youtube.com/embed/ViOutJ0kuJY', search:'Aspirants TVF series', isTv:true },
  { cat:'series-bw', title:'TVF Bachelors',            img:'images/catalogue/bach.jpg',              year:'2016', rating:'8.4', runtime:'2 seasons',synopsis:'Four bachelor flatmates deal with a specific daily life problem each episode as a single team.', trailer:'https://www.youtube.com/embed/3kGU6FEFqPM', search:'TVF Bachelors series', isTv:true },
  { cat:'series-bw', title:'Mismatched',               img:'images/catalogue/mismatched.jpg',        year:'2020', rating:'8.4', runtime:'2 seasons',synopsis:'After being set up by their families, two teenagers strike up a tentative friendship at their summer programme.', trailer:'https://www.youtube.com/embed/uYmwNNkix-k', search:'Mismatched Netflix series', isTv:true },
  { cat:'series-bw', title:'Bandish Bandits',          img:'images/catalogue/bandish.jpg',           year:'2020', rating:'8.7', runtime:'1 season', synopsis:'Two singers with contrasting personalities set out on an incredible journey of self-discovery.', trailer:'https://www.youtube.com/embed/UhU57OgGp50', search:'Bandish Bandits Amazon series', isTv:true },
  { cat:'series-bw', title:'Little Things',            img:'images/catalogue/little things.jpg',     year:'2016', rating:'8.3', runtime:'3 seasons',synopsis:'A cohabitating couple in their 20s navigates the ups and downs of work and modern-day relationships in Mumbai.', trailer:'https://www.youtube.com/embed/LhpA-_8cWv8', search:'Little Things Netflix India series', isTv:true },
  { cat:'series-bw', title:'Paatal Lok',               img:'images/catalogue/lok.jpg',               year:'2020', rating:'7.8', runtime:'1 season', synopsis:'A cynical inspector investigates a high-profile case that leads him into a dark realm of the underworld.', trailer:'https://www.youtube.com/embed/cNwWMW4mxO8', search:'Paatal Lok Amazon Prime series', isTv:true },
  { cat:'series-bw', title:'Scam 1992',                img:'images/catalogue/scam.jpg',              year:'2020', rating:'9.5', runtime:'1 season', synopsis:'Harshad Mehta took the stock market to dizzying heights and then had a catastrophic downfall.', trailer:'https://www.youtube.com/embed/ISORfez27og', search:'Scam 1992 Harshad Mehta SonyLIV', isTv:true },
  { cat:'series-bw', title:'TVF Pitchers',             img:'images/catalogue/tvf.jpg',               year:'2015', rating:'9.1', runtime:'1 season', synopsis:'Four friends leave their jobs to build a startup and navigate the highs and lows of entrepreneurship.', trailer:'https://www.youtube.com/embed/84Jk1OqDqOo', search:'TVF Pitchers web series', isTv:true },
  { cat:'series-bw', title:'Criminal Justice',         img:'images/catalogue/criminal.jpg',          year:'2019', rating:'8.1', runtime:'2 seasons',synopsis:'A crime thriller legal drama based on the British series of the same name, set in India.', trailer:'https://www.youtube.com/embed/KPyNH7mZkGc', search:'Criminal Justice India Hotstar', isTv:true },
  { cat:'series-bw', title:'Panchayat',                img:'images/catalogue/panch.jpg',             year:'2020', rating:'8.7', runtime:'2 seasons',synopsis:'An engineering graduate becomes secretary of a Panchayat office in a remote village in Uttar Pradesh.', trailer:'https://www.youtube.com/embed/mojZJ7oeD_g', search:'Panchayat TVF series', isTv:true },
  { cat:'series-bw', title:'Asur',                     img:'images/catalogue/asur.jpg',              year:'2020', rating:'8.4', runtime:'2 seasons',synopsis:'A modern day serial killer with religious ties is hunted in this Indian crime thriller.', trailer:'https://www.youtube.com/embed/LDirQBvwx7g', search:'Asur Voot series', isTv:true },

  { cat:'anime', title:'Death Note',                   img:'images/catalogue/deathnote.jpg',         year:'2006', rating:'9.0', runtime:'37 eps',  synopsis:'Teen genius Light Yagami discovers a mysterious notebook that lets him kill anyone by writing their name in it.', trailer:'https://www.youtube.com/embed/NlJZ-YgAt-c', search:'Death Note anime 2006', isTv:true },
  { cat:'anime', title:'Naruto',                       img:'images/catalogue/naruto.jpg',            year:'2002', rating:'8.3', runtime:'220 eps', synopsis:'Naruto Uzumaki, a boy with a demon fox sealed inside him, is determined to become Hokage — the strongest ninja.', trailer:'https://www.youtube.com/embed/-G9BqkgZXRA', search:'Naruto anime series', isTv:true },
  { cat:'anime', title:'Attack on Titan',              img:'images/catalogue/Aot.jpg',               year:'2013', rating:'9.0', runtime:'75 eps',  synopsis:'After his hometown is destroyed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.', trailer:'https://www.youtube.com/embed/o_go-8TFBXs', search:'Attack on Titan anime', isTv:true },
  { cat:'anime', title:'Demon Slayer',                 img:'images/catalogue/demonSlayer.jpg',       year:'2019', rating:'8.7', runtime:'26 eps',  synopsis:'A youth fights demons and seeks a cure for his sister after finding his family slaughtered and her turned into a demon.', trailer:'https://www.youtube.com/embed/VQGCKyvzIM4', search:'Demon Slayer Kimetsu no Yaiba anime', isTv:true },
  { cat:'anime', title:'One Punch Man',                img:'images/catalogue/one-punch-man.jpg',     year:'2015', rating:'8.8', runtime:'24 eps',  synopsis:'Saitama can defeat any opponent with a single punch but seeks a worthy opponent after growing bored by his strength.', trailer:'https://www.youtube.com/embed/Poo5lqoWSGw', search:'One Punch Man anime 2015', isTv:true },
  { cat:'anime', title:'Tokyo Ghoul',                  img:'images/catalogue/tokyo.jpg',             year:'2014', rating:'7.8', runtime:'48 eps',  synopsis:'A Tokyo college student attacked by a ghoul survives but becomes part ghoul and lives as a fugitive.', trailer:'https://www.youtube.com/embed/ETHpMMV8rJU', search:'Tokyo Ghoul anime 2014', isTv:true },
  { cat:'anime', title:'Fullmetal Alchemist',          img:'images/catalogue/fullMetal.jpg',         year:'2003', rating:'8.5', runtime:'51 eps',  synopsis:'Brothers Edward and Alphonse Elric search for the philosopher\'s stone to restore their damaged bodies.', trailer:'https://www.youtube.com/embed/2Dsa8j_usqI', search:'Fullmetal Alchemist anime 2003', isTv:true },
  { cat:'anime', title:'One Piece',                    img:'images/catalogue/onePiece.jpg',          year:'1999', rating:'8.8', runtime:'981+ eps',synopsis:'Monkey D. Luffy and his pirate crew seek the greatest treasure left by the legendary Pirate Gold Roger.', trailer:'https://www.youtube.com/embed/S8_YwFLCh4U', search:'One Piece anime', isTv:true },
];

let filteredData = [...CATALOGUE];

function setCat(btn, cat) {
  activeCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function filterCatalogue() { applyFilters(); }

function applyFilters() {
  const q = (document.getElementById('cat-search').value || '').toLowerCase().trim();
  filteredData = CATALOGUE.filter(item => {
    const catOk = activeCat === 'all' || item.cat === activeCat;
    const qOk   = !q || item.title.toLowerCase().includes(q) || item.synopsis.toLowerCase().includes(q) || item.year.includes(q);
    return catOk && qOk;
  });
  renderGrid();
}

function badgeFor(cat) {
  if (cat === 'anime')                        return { cls:'anime',  label:'Anime' };
  if (cat === 'series-hw' || cat === 'series-bw') return { cls:'series', label:'Series' };
  return { cls:'movie', label:'Movie' };
}

function renderGrid() {
  const grid  = document.getElementById('cat-grid');
  const noRes = document.getElementById('cat-no-results');
  grid.innerHTML = '';

  if (!filteredData.length) { noRes.style.display = 'block'; return; }
  noRes.style.display = 'none';

  filteredData.forEach((item, idx) => {
    const badge = badgeFor(item.cat);
    const card  = document.createElement('article');
    card.className = 'cat-card';
    card.innerHTML = `
      <div class="cat-card-poster">
        <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.zIndex=1" />
        <div class="cat-poster-fallback" style="z-index:0">
          <span class="fi">🎬</span>
          <span class="ft">${item.title.toUpperCase()}</span>
        </div>
        <div class="cat-card-overlay">
          <button class="cat-play-btn" onclick="event.stopPropagation();playItem(${idx})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          </button>
          <div class="cat-overlay-actions">
            ${item.trailer ? `<button class="cat-trailer-btn" onclick="event.stopPropagation();openTrailer(${idx})">▶ Trailer</button>` : ''}
          </div>
        </div>
        <span class="cat-type-badge ${badge.cls}">${badge.label}</span>
      </div>
      <div class="cat-card-info">
        <div class="cat-card-title">${item.title}</div>
        <div class="cat-card-meta">
          <span class="cat-card-rating">★ ${item.rating}</span>
          <span>${item.year}</span>
          <span>${item.runtime}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => playItem(idx));
    grid.appendChild(card);
  });
}

async function playItem(idx) {
  const item = filteredData[idx];
  openPlayerModal(item.title);

  if (item.tmdb) {
    try {
      const r = await fetch(`${TMDB_BASE}/movie/${item.tmdb}?api_key=${TMDB_KEY}&append_to_response=external_ids`);
      const d = await r.json();
      currentImdb = d.external_ids?.imdb_id || '';
      currentTmdb = item.tmdb;
      loadFrame();
    } catch { currentTmdb = item.tmdb; currentImdb = ''; loadFrame(); }
    return;
  }

  try {
    const endpoint = item.isTv ? 'tv' : 'movie';
    const r = await fetch(`${TMDB_BASE}/search/${endpoint}?api_key=${TMDB_KEY}&query=${encodeURIComponent(item.search || item.title)}`);
    const d = await r.json();
    const hit = d.results?.[0];
    if (hit) {
      const r2 = await fetch(`${TMDB_BASE}/${endpoint}/${hit.id}?api_key=${TMDB_KEY}&append_to_response=external_ids`);
      const d2 = await r2.json();
      currentTmdb = String(hit.id);
      currentImdb = d2.external_ids?.imdb_id || '';
    } else {
      currentTmdb = ''; currentImdb = '';
    }
  } catch { currentTmdb = ''; currentImdb = ''; }
  loadFrame();
}

function loadFrame() {
  const srv    = SERVERS[currentServer];
  const rawUrl = currentTmdb ? srv.movie(currentImdb, currentTmdb) : '';
  if (!rawUrl) { document.getElementById('movie-frame').srcdoc = '<div style="color:#888;display:flex;align-items:center;justify-content:center;height:100%;font-family:sans-serif;font-size:14px">Could not find this title on the streaming servers.</div>'; return; }
  document.getElementById('movie-frame').src = useProxy ? PROXY_BASE + '?url=' + encodeURIComponent(rawUrl) : rawUrl;
}

function openPlayerModal(title) {
  currentServer = 0;
  useProxy = false;
  document.getElementById('proxy-checkbox').checked = false;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('player-modal').classList.add('open');
  document.getElementById('player-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderServerBtns();
}

function renderServerBtns() {
  const btns = document.getElementById('server-btns');
  if (!btns) return;
  btns.innerHTML = SERVERS.map((s, i) =>
    `<button onclick="switchServer(${i})" style="font-size:11px;padding:4px 10px;border-radius:4px;border:1px solid ${i===currentServer?'var(--gold)':'rgba(255,255,255,0.15)'};background:${i===currentServer?'rgba(201,168,76,0.15)':'none'};color:${i===currentServer?'var(--gold)':'var(--grey)'};cursor:pointer;font-family:inherit;transition:all .2s">${s.name}</button>`
  ).join('');
}

function switchServer(idx) {
  currentServer = idx;
  renderServerBtns();
  document.getElementById('movie-frame').src = '';
  setTimeout(loadFrame, 100);
}

function onProxyToggle() {
  useProxy = document.getElementById('proxy-checkbox').checked;
  document.getElementById('movie-frame').src = '';
  setTimeout(loadFrame, 100);
}

function closeModal() {
  document.getElementById('player-modal').classList.remove('open');
  document.getElementById('player-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('movie-frame').src = ''; }, 300);
}

function openTrailer(idx) {
  const item = filteredData[idx];
  const embedUrl = item.trailer.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/');
  document.getElementById('trailer-title').textContent = item.title + ' — Trailer';
  document.getElementById('trailer-frame').src = embedUrl + '?autoplay=1';
  document.getElementById('trailer-modal').classList.add('open');
  document.getElementById('trailer-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeTrailer() {
  document.getElementById('trailer-modal').classList.remove('open');
  document.getElementById('trailer-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('trailer-frame').src = ''; }, 300);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeTrailer(); }
});

window.addEventListener('DOMContentLoaded', () => {
  renderGrid();
});
