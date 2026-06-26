const PROXY_BASE = 'https://unblockedmovies.detlaffcameron.workers.dev/';
const TMDB_KEY   = '232a7338c36748bff95e5de149a21b95';
const TMDB_BASE  = 'https://api.themoviedb.org/3';
const IMG_BASE   = 'https://image.tmdb.org/t/p/w342';

const SERVERS = [
  { name:'Server 1', movie:(im,tm)=>im?`https://autoembed.co/movie/imdb/${im}`:`https://autoembed.co/movie/tmdb/${tm}`,    tv:(im,s,e,tm)=>im?`https://autoembed.co/tv/imdb/${im}-${s}-${e}`:`https://autoembed.co/tv/tmdb/${tm}-${s}-${e}` },
  { name:'Server 2', movie:(im,tm)=>`https://vidlink.pro/movie/${tm}`,                                                     tv:(im,s,e,tm)=>`https://vidlink.pro/tv/${tm}/${s}/${e}` },
  { name:'Server 3', movie:(im,tm)=>`https://vidsrc.net/embed/movie?tmdb=${tm}`,                                          tv:(im,s,e,tm)=>`https://vidsrc.net/embed/tv?tmdb=${tm}&season=${s}&episode=${e}` },
  { name:'Server 4', movie:(im,tm)=>`https://multiembed.mov/directstream.php?video_id=${tm}&tmdb=1`,                      tv:(im,s,e,tm)=>`https://multiembed.mov/directstream.php?video_id=${tm}&tmdb=1&s=${s}&e=${e}` }
];

const CATALOGUE = [
  { cat:'hollywood', title:'Inception',                    tmdb:'27205',  poster:'/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', year:'2010', rating:'8.8', runtime:'2h 42m', synopsis:'Cobb steals information from his targets by entering their dreams. Saito offers to wipe clean his criminal history in payment for performing an inception.', trailer:'YoHD9XEInc0' },
  { cat:'hollywood', title:'The Dark Knight',              tmdb:'155',    poster:'/qJ2tW6WMUDux911r6m7haRef0WH.jpg', year:'2008', rating:'9.0', runtime:'2h 32m', synopsis:'After Gordon, Dent and Batman begin an assault on Gotham\'s crime, the mobs hire the Joker to kill Batman and bring the city to its knees.', trailer:'LDG9bisJEaI' },
  { cat:'hollywood', title:'Parasite',                     tmdb:'496243', poster:'/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', year:'2019', rating:'8.6', runtime:'2h 12m', synopsis:'The struggling Kim family sees an opportunity when the son starts working for the wealthy Park family, and all of them find a way into the same household.', trailer:'SEUXfv87Wpk' },
  { cat:'hollywood', title:"We're the Millers",            tmdb:'131634', poster:'/uwfMSvKSSeVCVBQd5q8MwYCGRoT.jpg', year:'2013', rating:'7.0', runtime:'1h 58m', synopsis:'David, a drug dealer, hires a stripper and forms a fake family to smuggle drugs from Mexico.', trailer:'0Vsy5KzsieQ' },
  { cat:'hollywood', title:'The Terminal',                 tmdb:'7232',   poster:'/xPBQjEpAQmG4VRnhGUWNqkLLzrU.jpg', year:'2004', rating:'7.4', runtime:'2h 8m',  synopsis:'Viktor Navorski gets stranded at an airport when a war rages in his country and must stay there until his identity is confirmed.', trailer:'hjydAG1lG_8' },
  { cat:'hollywood', title:'The Matrix',                   tmdb:'603',    poster:'/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', year:'1999', rating:'8.7', runtime:'2h 16m', synopsis:'Thomas Anderson is led to fight an underground war against powerful computers who constructed his entire reality with a system called the Matrix.', trailer:'vKQi3bBA1y8' },
  { cat:'hollywood', title:'Joker',                        tmdb:'475557', poster:'/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', year:'2019', rating:'8.4', runtime:'2h 2m',  synopsis:'Arthur Fleck, a party clown, leads an impoverished life and when society brands him a freak he decides to embrace the life of crime and chaos.', trailer:'zAGVQLHvwOY' },
  { cat:'hollywood', title:'GoodFellas',                   tmdb:'769',    poster:'/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', year:'1990', rating:'8.7', runtime:'2h 28m', synopsis:'Young Henry Hill, with his friends Jimmy and Tommy, begins the climb from petty criminal to gangster on the mean streets of New York.', trailer:'qo5jJpHtI1Y' },
  { cat:'hollywood', title:'The Shawshank Redemption',     tmdb:'278',    poster:'/9cqNxx0GxF0bAY0dsDX3LTVZM9E.jpg', year:'1994', rating:'9.3', runtime:'2h 22m', synopsis:'Andy Dufresne, sentenced to life at Shawshank prison for murders he claims he did not commit, becomes its most unconventional inmate.', trailer:'6hB3S9bIaco' },
  { cat:'hollywood', title:'The Green Mile',               tmdb:'497',    poster:'/velWPhVMQeQKcxggNEU8YmIo52R.jpg', year:'1999', rating:'8.6', runtime:'3h 9m',  synopsis:'Paul, head guard of a prison, meets John, accused of murdering two girls, and discovers he has a special gift.', trailer:'Ki4haFrqSrw' },
  { cat:'hollywood', title:'Interstellar',                 tmdb:'157336', poster:'/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', year:'2014', rating:'8.6', runtime:'2h 55m', synopsis:'When Earth becomes uninhabitable, farmer and ex-NASA pilot Cooper is tasked to pilot a spacecraft to find a new planet for humans.', trailer:'zSWdZVtXT7E' },
  { cat:'hollywood', title:'Avengers: Endgame',            tmdb:'299534', poster:'/or06FN3Dka5tukK1e9sl16pB3iy.jpg', year:'2019', rating:'8.4', runtime:'3h 1m',  synopsis:'After Thanos disintegrates half the universe, the Avengers must reunite to reverse his actions and restore balance — whatever it takes.', trailer:'TcMBFSGVi1c' },
  { cat:'hollywood', title:'Avengers: Infinity War',       tmdb:'299536', poster:'/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', year:'2018', rating:'8.4', runtime:'2h 40m', synopsis:'The Avengers must stop Thanos from getting his hands on all the infinity stones before he can carry out his catastrophic plan.', trailer:'6ZfuNTqbHE8' },
  { cat:'hollywood', title:'Spider-Man',                   tmdb:'557',    poster:'/gh4cZbhZxyTbgxQPxzkIZNBSXfd.jpg', year:'2002', rating:'7.3', runtime:'2h 1m',  synopsis:'Peter Parker, an outcast high school student, gets bitten by a radioactive spider and attains superpowers.', trailer:'-tnxzJ0SSOw' },
  { cat:'hollywood', title:'The Dark Knight Rises',        tmdb:'49026',  poster:'/hr0L2aueqlP2BYUblTTjmtn1r4E.jpg', year:'2012', rating:'8.4', runtime:'2h 44m', synopsis:'Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace.', trailer:'g8evyE9TuYk' },
  { cat:'hollywood', title:'The Chronicles of Narnia',     tmdb:'806',    poster:'/qNBAXBIQlnOThrVvA6mA2B5ggkR.jpg', year:'2005', rating:'6.9', runtime:'2h 30m', synopsis:'While playing, Lucy and her siblings find a wardrobe that lands them in the mystical land of Narnia.', trailer:'ruGHxmjQ180' },
  { cat:'hollywood', title:'Hamilton',                     tmdb:'556574', poster:'/ocad1VLMBMOaJbvGOF0HgExaONE.jpg', year:'2020', rating:'8.4', runtime:'2h 40m', synopsis:'The story of Alexander Hamilton — immigrant, Founding Father, revolutionary — told through hip-hop and musical theatre.', trailer:'DSCKfXpAGHc' },
  { cat:'hollywood', title:'Dunkirk',                      tmdb:'374720', poster:'/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg', year:'2017', rating:'7.8', runtime:'1h 46m', synopsis:'Allied soldiers are surrounded by the German army and evacuated during a fierce battle in World War II.', trailer:'F-eMt3SrfFU' },
  { cat:'hollywood', title:'1917',                         tmdb:'530915', poster:'/iZf0KyrE25z1sage4SYFLCCrMi9.jpg', year:'2019', rating:'8.3', runtime:'1h 59m', synopsis:'Two British soldiers are sent on a seemingly impossible mission to deliver a message deep in enemy territory.', trailer:'YqNYrYUiMfg' },

  { cat:'bollywood', title:'Andaz Apna Apna',              tmdb:'43768',  poster:'/oLfSlBMYENvqCJDMnm70RuwkNJA.jpg', year:'1994', rating:'8.1', runtime:'2h 41m', synopsis:'Amar and Prem, middle-class rivals, compete to win over Raveena, a millionaire\'s daughter.', trailer:'fd_w7Qw8biU' },
  { cat:'bollywood', title:'Chak De! India',               tmdb:'22272',  poster:'/A37C5BKJJK77alPqJFmmsMasjBE.jpg', year:'2007', rating:'8.2', runtime:'2h 33m', synopsis:'A tainted former hockey star coaches the Indian women\'s national hockey team to prove his loyalty to the nation.', trailer:'6a0-dSMWm5g' },
  { cat:'bollywood', title:'Bhaag Milkha Bhaag',           tmdb:'164021', poster:'/A5jnmjzB5CaBgmv53EHgMkUqDi5.jpg', year:'2013', rating:'8.2', runtime:'3h 9m',  synopsis:'Milkha Singh overcomes agonising obstacles to become a world champion, Olympian and one of India\'s most iconic athletes.', trailer:'3uICXnnW86U' },
  { cat:'bollywood', title:'A Wednesday',                  tmdb:'43514',  poster:'/m0AHsJwnlvxMsWb3FPuF0k3TbmQ.jpg', year:'2008', rating:'8.1', runtime:'1h 44m', synopsis:'A retired police commissioner recounts his most memorable case — a bomb scare in Mumbai by an ordinary commoner.', trailer:'yry6pBiXx14' },
  { cat:'bollywood', title:'MS Dhoni: The Untold Story',   tmdb:'381309', poster:'/7iHkSjMjGaOLU9VG04TXOTgJwuq.jpg', year:'2016', rating:'7.9', runtime:'3h 40m', synopsis:'A boy from Ranchi aspires to play cricket for India and ultimately decides to chase his dreams.', trailer:'6L6XqWoS8tw' },
  { cat:'bollywood', title:'Drishyam',                     tmdb:'297254', poster:'/5iGJJFQOFfaVxmTtEdFSHjlwVNB.jpg', year:'2015', rating:'8.2', runtime:'2h 43m', synopsis:'When the disappearance of a policewoman\'s son threatens his family, Vijay leaves no stone unturned to shield them.', trailer:'AuuX2j14NBg' },
  { cat:'bollywood', title:'Dilwale Dulhania Le Jayenge',  tmdb:'19404',  poster:'/2CAL2433ZeIihfX1Hb2139CX0pW.jpg', year:'1995', rating:'8.1', runtime:'3h 12m', synopsis:'Raj and Simran fall in love across Europe. When Raj learns she is promised to another, he follows her to India to win her over.', trailer:'oIZ4U21DRlM' },
  { cat:'bollywood', title:'Gangs of Wasseypur',           tmdb:'90560',  poster:'/cNtAslrDhNqCmNxgNkyJDeXQnli.jpg', year:'2012', rating:'8.2', runtime:'2h 40m', synopsis:'A gangster clashes with the ruthless coal-mining kingpin who killed his father in this epic multigenerational crime saga.', trailer:'j-AkWDkXcMY' },
  { cat:'bollywood', title:'Sholay',                       tmdb:'14309',  poster:'/3JkEJMRBmkM5VCMzMUDQFGYN6Ne.jpg', year:'1975', rating:'8.2', runtime:'3h 24m', synopsis:'Two ex-convicts are hired by a retired policeman to help nab the notorious dacoit Gabbar Singh who terrorises Ramgarh.', trailer:'XjiluhItzIA' },
  { cat:'bollywood', title:'Rang De Basanti',              tmdb:'21955',  poster:'/q1AzjMXqJMhXEV6Fmf9bSFNMSVs.jpg', year:'2006', rating:'8.1', runtime:'2h 51m', synopsis:'When Sue selects students to portray Indian freedom fighters in her film, she unwittingly awakens their patriotism.', trailer:'QHhnhqxB4E8' },
  { cat:'bollywood', title:'Munna Bhai MBBS',              tmdb:'22853',  poster:'/sFT9p6rlIhTFVKHRDMXPlRbGAjH.jpg', year:'2003', rating:'8.1', runtime:'2h 36m', synopsis:'Munna is a goon who sets out to fulfil his father\'s dream of becoming a doctor.', trailer:'H0OMXwKrGs8' },
  { cat:'bollywood', title:'KGF: Chapter 1',               tmdb:'529816', poster:'/9VQCl5HIOBP0oLSBKxobEOumFEz.jpg', year:'2018', rating:'8.3', runtime:'2h 36m', synopsis:'Rocky, a young man, seeks power and wealth in order to fulfil a promise to his dying mother.', trailer:'-KfsY-qwBS0' },
  { cat:'bollywood', title:'Dangal',                       tmdb:'368006', poster:'/tVRPdcObzNFfzEAveTfJmSsZJ7t.jpg', year:'2016', rating:'8.3', runtime:'2h 41m', synopsis:'Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers.', trailer:'x_7YlGv9u1g' },

  { cat:'series-hw', title:'Breaking Bad',    tmdb:'1396',  poster:'/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',  year:'2008', rating:'9.5', runtime:'5 seasons', synopsis:'Chemistry teacher Walter White discovers he has cancer and enters the meth business to repay medical debts, partnering with Jesse Pinkman.', trailer:'HhesaQXLuRY', isTv:true },
  { cat:'series-hw', title:'Game of Thrones', tmdb:'1399',  poster:'/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',  year:'2011', rating:'9.2', runtime:'8 seasons', synopsis:'Nine noble families wage war for control over Westeros. Meanwhile an ancient force threatens the existence of all living men.', trailer:'gcTkNV5Vg1E', isTv:true },
  { cat:'series-hw', title:'Chernobyl',       tmdb:'87108', poster:'/hlLXt2tOPy1e7QLXXIv8NNMqna4.jpg',  year:'2019', rating:'9.4', runtime:'5 eps',     synopsis:'In April 1986, Chernobyl suffers one of the worst nuclear disasters in history. Heroes put their lives on the line to save Europe.', trailer:'s9APLXM9Ei8', isTv:true },
  { cat:'series-hw', title:'Stranger Things', tmdb:'66732', poster:'/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',  year:'2016', rating:'8.7', runtime:'4 seasons', synopsis:'In 1980s Indiana, a group of young friends witness supernatural forces and secret government exploits.', trailer:'b9EkMc79ZSU', isTv:true },
  { cat:'series-hw', title:'Peaky Blinders',  tmdb:'60574', poster:'/vUUqzWa2LnHIVqkaKVn3NYjQkEs.jpg',  year:'2013', rating:'8.8', runtime:'6 seasons', synopsis:'Tommy Shelby leads the Peaky Blinders gang in Birmingham as inspector Chester Campbell attempts to bring him down.', trailer:'oVzVdvGIC7U', isTv:true },
  { cat:'series-hw', title:'Ozark',           tmdb:'69740', poster:'/pCGyPVrI9Fzc8NOE5oJ7GCeVCrO.jpg',  year:'2017', rating:'8.4', runtime:'4 seasons', synopsis:'Financial planner Marty Byrde relocates his family to the Ozarks after a money-laundering scheme goes badly wrong.', trailer:'5hAXVqrljbs', isTv:true },
  { cat:'series-hw', title:'Sherlock',        tmdb:'19885', poster:'/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg',  year:'2010', rating:'9.1', runtime:'4 seasons', synopsis:'Dr Watson shares a flat with Sherlock Holmes, an eccentric with a knack for solving the most unusual cases.', trailer:'xK7S9mrFWL4', isTv:true },
  { cat:'series-hw', title:'The Witcher',     tmdb:'71912', poster:'/e4aqizYQ8eeTGNZMq6WiFfqoZMd.jpg',  year:'2019', rating:'8.5', runtime:'3 seasons', synopsis:'Mutated monster hunter Geralt struggles to find his place in a world where people often prove more wicked than the beasts.', trailer:'ndl1W4ltcmg', isTv:true },
  { cat:'series-hw', title:'Money Heist',     tmdb:'71446', poster:'/MoEKaPFHABtA1xKoOteirGaHl1.jpg',   year:'2017', rating:'8.3', runtime:'5 seasons', synopsis:'A criminal mastermind recruits eight people with special abilities to pull off the biggest heist in recorded history.', trailer:'p_PJbmrX4uk', isTv:true },
  { cat:'series-hw', title:'Lucifer',         tmdb:'63174', poster:'/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg',  year:'2016', rating:'8.1', runtime:'6 seasons', synopsis:'The Devil abandons Hell and retires to Los Angeles, until a murder outside his nightclub draws him into detective work.', trailer:'-0beFQnB5lY', isTv:true },
  { cat:'series-hw', title:'The Crown',       tmdb:'65494', poster:'/1M876KPjulVwppEpldhdc8V4o68.jpg',  year:'2016', rating:'8.6', runtime:'6 seasons', synopsis:'The series chronicles the reign of Queen Elizabeth II, revealing personal intrigues and political rivalries across the decades.', trailer:'w1pIbUOc_lU', isTv:true },
  { cat:'series-hw', title:'Black Mirror',    tmdb:'42009', poster:'/7PRddO7z7mcPi21nZTCMGShAyy1.jpg',  year:'2011', rating:'8.8', runtime:'6 seasons', synopsis:'In a dystopian future, individuals grapple with the manipulative effects of cutting-edge technology on their personal lives.', trailer:'V0XOApF5nLU', isTv:true },
  { cat:'series-hw', title:'WandaVision',     tmdb:'85271', poster:'/glKDfE6btIRcmuj5KbMBx4sBKQU.jpg',  year:'2021', rating:'8.0', runtime:'1 season',  synopsis:'Super-powered Wanda and Vision live idealized suburban lives and begin to suspect that everything is not as it seems.', trailer:'sj9J2ecsSpo', isTv:true },
  { cat:'series-hw', title:'Firefly',         tmdb:'1437',  poster:'/7RBHWbsWEXVFlfuQUDB1CIeMQrg.jpg',  year:'2002', rating:'9.0', runtime:'1 season',  synopsis:'500 years in the future, the crew of a small transport spaceship takes any job that puts food on the table.', trailer:'oBZrZij2-g8', isTv:true },

  { cat:'series-bw', title:'Mirzapur',        tmdb:'78264',  poster:'/qMPCqzr00gMB5NWrjPDhSBFfTVH.jpg', year:'2018', rating:'8.4', runtime:'3 seasons', synopsis:'Akhandanand Tripathi is the mafia boss of Mirzapur. His power-hungry son Munna continues the criminal legacy.', trailer:'ZNeGF-PvRHY', isTv:true },
  { cat:'series-bw', title:'Sacred Games',    tmdb:'77055',  poster:'/o5gZCzQP4nkjEJ1dPDlrxIEbq7A.jpg', year:'2018', rating:'8.7', runtime:'2 seasons', synopsis:'Officer Sartaj Singh receives a tip about criminal overlord Ganesh Gaitonde, embarking on a dangerous cat-and-mouse chase.', trailer:'lM1xVnYsirw', isTv:true },
  { cat:'series-bw', title:'Scam 1992',       tmdb:'98879',  poster:'/jePPJFHbwWGCLPJcDJJYjkfMBZ5.jpg', year:'2020', rating:'9.5', runtime:'1 season',  synopsis:'Harshad Mehta took the stock market to dizzying heights and then had a catastrophic downfall.', trailer:'ISORfez27og', isTv:true },
  { cat:'series-bw', title:'Panchayat',       tmdb:'99762',  poster:'/toDdFGFRV8cRekKHjePiJaOqAKB.jpg', year:'2020', rating:'8.7', runtime:'3 seasons', synopsis:'An engineering graduate becomes secretary of a Panchayat office in a remote village in Uttar Pradesh.', trailer:'mojZJ7oeD_g', isTv:true },
  { cat:'series-bw', title:'Kota Factory',    tmdb:'96676',  poster:'/z1p33VCRiSBBfHYwwJ5M4N7VYuP.jpg', year:'2019', rating:'9.0', runtime:'2 seasons', synopsis:'Set in Kota — India\'s coaching hub — students come from across the country to prepare for entrance exams.', trailer:'pNZQ6msbOvM', isTv:true },
  { cat:'series-bw', title:'Paatal Lok',      tmdb:'101135', poster:'/rcXSBvqfj8MuViJqnGfDDfN0WeO.jpg', year:'2020', rating:'7.8', runtime:'1 season',  synopsis:'A cynical inspector investigates a high-profile case that leads him into a dark realm of the underworld.', trailer:'cNwWMW4mxO8', isTv:true },
  { cat:'series-bw', title:'Asur',            tmdb:'96552',  poster:'/kqjL17yufvn9OVLyXYpvtyrFfak.jpg', year:'2020', rating:'8.4', runtime:'2 seasons', synopsis:'A modern day serial killer with religious ties is hunted by a forensic expert and his former mentor.', trailer:'LDirQBvwx7g', isTv:true },
  { cat:'series-bw', title:'Bandish Bandits', tmdb:'106135', poster:'/fq3DSn6LgaMEI57RXvj1pDHKTbw.jpg', year:'2020', rating:'8.7', runtime:'1 season',  synopsis:'Two singers with contrasting personalities set out on an incredible journey of self-discovery together.', trailer:'UhU57OgGp50', isTv:true },
  { cat:'series-bw', title:'Mismatched',      tmdb:'110316', poster:'/a0l9ICRS1fGYlhK3hkBXJVGbFMC.jpg', year:'2020', rating:'8.4', runtime:'2 seasons', synopsis:'After being set up by their families, two teenagers strike up a tentative friendship at their summer programme.', trailer:'uYmwNNkix-k', isTv:true },
  { cat:'series-bw', title:'TVF Pitchers',    tmdb:'64490',  poster:'/9Fn0ZCQAIG4u0c7OXZdXEFYaJnS.jpg', year:'2015', rating:'9.1', runtime:'2 seasons', synopsis:'Four friends leave their jobs to build a startup and navigate the highs and lows of entrepreneurship.', trailer:'84Jk1OqDqOo', isTv:true },
  { cat:'series-bw', title:'Criminal Justice',tmdb:'93784',  poster:'/lCIRZBKsLBuTqifPRnOknEWxR6a.jpg', year:'2019', rating:'8.1', runtime:'3 seasons', synopsis:'An Indian crime thriller legal drama following wrongful accusation cases through the criminal justice system.', trailer:'KPyNH7mZkGc', isTv:true },

  { cat:'anime', title:'Death Note',          tmdb:'13916',  poster:'/g2bOl8e5F4FmEBFmLdMdRG7FmCh.jpg', year:'2006', rating:'9.0', runtime:'37 eps',   synopsis:'Teen genius Light Yagami discovers a mysterious notebook that lets him kill anyone by writing their name in it.', trailer:'NlJZ-YgAt-c', isTv:true },
  { cat:'anime', title:'Naruto',              tmdb:'46260',  poster:'/xppeysfvDKVx775MFuH8Z9Ex9iP.jpg', year:'2002', rating:'8.3', runtime:'220 eps',  synopsis:'Naruto Uzumaki, a boy with a demon fox sealed inside him, is determined to become the strongest ninja.', trailer:'-G9BqkgZXRA', isTv:true },
  { cat:'anime', title:'Attack on Titan',     tmdb:'1429',   poster:'/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg', year:'2013', rating:'9.0', runtime:'87 eps',   synopsis:'After his hometown is destroyed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.', trailer:'o_go-8TFBXs', isTv:true },
  { cat:'anime', title:'Demon Slayer',        tmdb:'85937',  poster:'/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg', year:'2019', rating:'8.7', runtime:'44 eps',   synopsis:'A youth fights demons and seeks a cure for his sister after finding his family slaughtered and her turned into a demon.', trailer:'VQGCKyvzIM4', isTv:true },
  { cat:'anime', title:'One Punch Man',       tmdb:'65930',  poster:'/iE3s0lG5QVdEHOEZnoAxjmMtvne.jpg', year:'2015', rating:'8.8', runtime:'24 eps',   synopsis:'Saitama can defeat any opponent with a single punch but seeks a worthy opponent after growing bored by his strength.', trailer:'Poo5lqoWSGw', isTv:true },
  { cat:'anime', title:'Tokyo Ghoul',         tmdb:'61374',  poster:'/pRZA4bHjsWgFi7eBQSyCPADJ8Lc.jpg', year:'2014', rating:'7.8', runtime:'48 eps',   synopsis:'A Tokyo college student attacked by a ghoul survives but becomes part ghoul and lives as a fugitive on the run.', trailer:'ETHpMMV8rJU', isTv:true },
  { cat:'anime', title:'Fullmetal Alchemist: Brotherhood', tmdb:'31911', poster:'/5ZFjAtPlTByRBMiivlnhzPnJAHz.jpg', year:'2009', rating:'9.1', runtime:'64 eps', synopsis:'Brothers Edward and Alphonse Elric search for the philosopher\'s stone to restore their severely damaged bodies.', trailer:'--IcmZkvL0Q', isTv:true },
  { cat:'anime', title:'One Piece',           tmdb:'37854',  poster:'/e3NBGiAifW9Xt8xD5tQfOmPAc8d.jpg', year:'1999', rating:'8.8', runtime:'1000+ eps', synopsis:'Monkey D. Luffy and his pirate crew seek the greatest treasure left by the legendary Pirate Gold Roger.', trailer:'S8_YwFLCh4U', isTv:true },
];

let currentServer = 0;
let currentImdb   = '';
let currentTmdb   = '';
let useProxy      = false;
let activeCat     = 'all';
let filteredData  = [...CATALOGUE];

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
    const qOk   = !q || item.title.toLowerCase().includes(q) || item.year.includes(q);
    return catOk && qOk;
  });
  renderGrid();
}

function badgeFor(cat) {
  if (cat === 'anime')                             return { cls:'anime',  label:'Anime' };
  if (cat === 'series-hw' || cat === 'series-bw') return { cls:'series', label:'Series' };
  return { cls:'movie', label:'Movie' };
}

function posterUrl(item) {
  return item.poster ? IMG_BASE + item.poster : '';
}

function renderGrid() {
  const grid  = document.getElementById('cat-grid');
  const noRes = document.getElementById('cat-no-results');
  grid.innerHTML = '';
  if (!filteredData.length) { noRes.style.display = 'block'; return; }
  noRes.style.display = 'none';

  filteredData.forEach((item, idx) => {
    const badge   = badgeFor(item.cat);
    const imgSrc  = posterUrl(item);
    const card    = document.createElement('article');
    card.className = 'cat-card';
    card.innerHTML = `
      <div class="cat-card-poster">
        ${imgSrc ? `<img src="${imgSrc}" alt="${item.title}" loading="lazy" />` : ''}
        <div class="cat-poster-fallback">
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

function playItem(idx) {
  const item = filteredData[idx];
  currentTmdb = item.tmdb;
  currentImdb = '';
  openPlayerModal(item.title);
  loadFrame(item.isTv);
}

function loadFrame(isTv) {
  const srv = SERVERS[currentServer];
  const rawUrl = isTv
    ? srv.tv(currentImdb, 1, 1, currentTmdb)
    : srv.movie(currentImdb, currentTmdb);
  document.getElementById('movie-frame').src = useProxy
    ? PROXY_BASE + '?url=' + encodeURIComponent(rawUrl)
    : rawUrl;
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
  const item = filteredData.find(i => i.tmdb === currentTmdb);
  setTimeout(() => loadFrame(item?.isTv), 100);
}

function onProxyToggle() {
  useProxy = document.getElementById('proxy-checkbox').checked;
  document.getElementById('movie-frame').src = '';
  const item = filteredData.find(i => i.tmdb === currentTmdb);
  setTimeout(() => loadFrame(item?.isTv), 100);
}

function closeModal() {
  document.getElementById('player-modal').classList.remove('open');
  document.getElementById('player-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('movie-frame').src = ''; }, 300);
}

function openTrailer(idx) {
  const item = filteredData[idx];
  document.getElementById('trailer-title').textContent = item.title + ' — Trailer';
  document.getElementById('trailer-frame').src = `https://www.youtube.com/embed/${item.trailer}?autoplay=1`;
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

window.addEventListener('DOMContentLoaded', renderGrid);
