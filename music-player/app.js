const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const a = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar"); 
const ul = document.querySelector("ul");


const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
})

function displayMusic(music){
    title.innerText = music.getName();
    singer.innerText= music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    if(isMusicPlay == true){
        pauseMusic();
    }else{
        playMusic();
    }
})

prev.addEventListener("click", () => {
    prevMusic();
})
function prevMusic(){
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
next.addEventListener("click", () => {
    nextMusic();
})
function nextMusic(){
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

function playMusic() {
    container.classList.add("playing");
    play.classList="fa-solid fa-pause";
    audio.play();
}

function pauseMusic() {
    container.classList.remove("playing");
    play.classList="fa-solid fa-play";
    audio.pause();
}

const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}


audio.addEventListener("loadedmetadata" , () => {
    a.textContent = calculateTime(audio.duration);
    progressBar.max= Math.floor(audio.duration);
});
audio.addEventListener("timeupdate" , () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent= calculateTime(progressBar.value);
})
progressBar.addEventListener("input" , () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
})

let sesDurumu = "sesli";

volumeBar.addEventListener("click" , (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    if(value == 0) {
        audio.muted = true; 
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
    }
    else {
        audio.muted =false;
        sesDurumu = "sesli";
        volume.classList = "fa-solid fa-volume-high";
    }
})

volume.addEventListener("click", () => {
    if(sesDurumu === "sesli") {
        audio.muted = true;
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    }
    else{
        audio.muted =false;
        sesDurumu = "sesli";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = 100;
    }
})

const displayMusicList = (list) => {
    for(i=0; i < list.length; i++){
        let liTag = `
        <li  li-index='${i}'   onclick="selectedMusıc(this)" class="list-group-item" style="text-alig:"center";>
            <image src="img/${list[i].getImg()}" class="buttonImg"></image>
            <span>${list[i].getName()}</span>
        </li> 
        `;
        ul.insertAdjacentHTML("beforeend", liTag);
    }
}   

const selectedMusıc = (li) => {
    const index= li.getAttribute("li-index");
    player.index = index;
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")) {
        if(li.classList.contains("playing")){
            li.classList.remove("playing");
        }

        if(li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => { 
    nextMusic();
})