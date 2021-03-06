/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/Pause/Seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const PLAYER_STORAGE_KEY = 'MP3-PLAYER';    

const app = {
    currentIndex: 0,
    songs: [
        {
            name: 'Chay-Ve-Noi-Phia-Anh',
            singer: 'Khac-Viet',
            path:'./assets/music/Chay-Ve-Noi-Phia-Anh-Khac-Viet.mp3',
            img: './assets/img/song2.webp',
        },
        {
            name: 'Yeu-Thuong-Tiep-Noi',
            singer: 'Phan-Manh-Quynh-My-Tam',
            path:'./assets/music/Yeu-Thuong-Tiep-Noi-Phan-Manh-Quynh-My-Tam.mp3',
            img: './assets/img/song3.webp',
        },
        {
            name: 'Bai-Ca-Bau-Cu',
            singer: 'AMEE-Grey-D',
            path:'./assets/music/Bai-Ca-Bau-Cu-AMEE-Grey-D.mp3',
            img: './assets/img/song4.webp',
        },
        {
            name: 'thay-moi-co-gai-yeu-anh',
            singer: 'AMEE',
            path:'./assets/music/thay-moi-co-gai-yeu-anh-AMEE.mp3',
            img: './assets/img/song5.webp',
        },
        {
            name: 'Turn-It-Up',
            singer: 'AMEE',
            path:'./assets/music/Turn-It-Up-AMEE.mp3',
            img: './assets/img/song6.webp',
        },
        {
            name: 'Chay-Ve-Noi-Phia-Anh1',
            singer: 'Khac-Viet',
            path:'./assets/music/Chay-Ve-Noi-Phia-Anh-Khac-Viet.mp3',
            img: './assets/img/song2.webp',
        },
        {
            name: 'Yeu-Thuong-Tiep-Noi1',
            singer: 'Phan-Manh-Quynh-My-Tam',
            path:'./assets/music/Yeu-Thuong-Tiep-Noi-Phan-Manh-Quynh-My-Tam.mp3',
            img: './assets/img/song3.webp',
        },
        {
            name: 'Bai-Ca-Bau-Cu1',
            singer: 'AMEE-Grey-D',
            path:'./assets/music/Bai-Ca-Bau-Cu-AMEE-Grey-D.mp3',
            img: './assets/img/song4.webp',
        },
        {
            name: 'thay-moi-co-gai-yeu-anh1',
            singer: 'AMEE',
            path:'./assets/music/thay-moi-co-gai-yeu-anh-AMEE.mp3',
            img: './assets/img/song5.webp',
        },
        {
            name: 'Turn-It-Up1',
            singer: 'AMEE',
            path:'./assets/music/Turn-It-Up-AMEE.mp3',
            img: './assets/img/song6.webp',
        },
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    //Render playlist
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${song.img}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        })
        
        playList.innerHTML = htmls.join('');  
    },

    handleEvent: function() {
        isPlaying = true;
        isRandom = true;
        isRepeat = true;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        
        //X??? l?? ph??ng to/ thu nh??? h??nh ???nh khi Scroll top
        document.onscroll = function() {
            const newcdWidth = cdWidth - window.scrollY;
            cd.style.width =  newcdWidth > 0 ? newcdWidth + 'px' : 0; //tr??nh TH newcdWidth nh???n gi?? tr??? ??m
            cd.style.opacity = (newcdWidth/cdWidth);
        };

        //X??? l?? quay/d???ng ????a CD
        const cdRotate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], { 
            duration: 10000,         //10s
            iterations: Infinity,
        })
        cdRotate.pause();

        //B???m v??o n??t playBtn
        playBtn.onclick = function() {
            if(isPlaying) {
                audio.play();    //V?? isPlaying = true n??n khi click v??o playBtn s??? ch???y h??m n??y tr?????c
            }
            else {
                audio.pause();  
            }
        }

        //Khi b??i h??t ???????c b???m ch???y
        audio.onplay = function() { 
            isPlaying = false;                   //isPlaying ?????i th??nh false
            player.classList.add('playing');    //?????ng th???i icon pause ?????i th??nh icon play
            cdRotate.play();        //quay ????a CD
        }

        //Khi b??i h??t ???????c b???m d???ng             //Khi click l???i v??o playBtn v?? isPlaying ??ang false
        audio.onpause = function() {            //n??n h??m audio.pause ???????c g???i ?????n
            isPlaying = true;                  //isPlaying ?????i th??nh true
            player.classList.remove('playing'); //?????ng th???i icon play ?????i th??nh icon pause
            cdRotate.pause();        //d???ng ????a CD
        }

        //Khi b??i h??t ??ang ch???y con tr??? tr??n thanh thgian ch???y
        audio.ontimeupdate = function() {       //timeupdate: Fires when the current playback position has changed
            if(audio.duration) {
                const progressPercent = Math.floor(this.currentTime/ this.duration*100 ) ;
                progress.value = progressPercent;
            } else {
                progress.value = 0;
            }
        }

        //Next b??i h??t khi b???m n??t next
        nextBtn.onclick = function() {
            if(isRandom) {                
                app.nextSong();         
            } else {
                app.randomSong();
            }
            audio.play();
            app.render();
            app.scrollSongActive();
        }

        //Quay l???i b??i h??t khi b???m n??t l??i l???i
        prevBtn.onclick = function() {
             if(isRandom) {                
                app.prevSong();         
            } else {
                app.randomSong();
            }
            audio.play();
            app.render();
            app.scrollSongActive();
        }

        //X??? l?? chuy???n b??i h??t khi audio ended
        //X??? l?? l???p l???i b??i h??t khi audio ended
        audio.onended = function() {  
            if(isRepeat) {
                nextBtn.click();
            } else {
                audio.play();
            }
        }

        //L???ng nghe h??nh vi click v??o playlist
        playList.onclick = function(e) {
            const songTarget = e.target.closest('.song:not(.active)'); //Ch???a ra nh???ng b??i h??t ??ang ch???y
            const optionTarget = e.target.closest('.option'); //Ch???n ra ph???n option

            if(songTarget || optionTarget) {
                //X??? l?? khi click v??o b??i h??t
                if(songTarget) {
                    app.currentIndex = Number(songTarget.getAttribute('data-index'));
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                //X??? l?? khi click v??o option
                if(optionTarget) {

                }

            }  
        }
        
        //Khi b???m n??t tua
        progress.onchange = function(e) {
            const seekTime = (e.target.value/100)*audio.duration;
            audio.currentTime = seekTime;
        }

        //X??? l?? b???t t???t khi b???m n??t Random
        randomBtn.onclick = function() {
            if(isRandom) {
                isRandom = false;
                randomBtn.classList.add("active");
            } else {
                isRandom = true;
                randomBtn.classList.remove("active");
            }
            app.setConfig('isRandom', isRandom);
        }

        //X??? l?? b???t t???t khi b???m n??t Repeat
        repeatBtn.onclick = function() {
            if(isRepeat) {
                isRepeat = false;
                repeatBtn.classList.add("active");
            } else {
                isRepeat = true;
                repeatBtn.classList.remove("active");
            }
            app.setConfig('isRepeat', isRepeat);
        }
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    prevSong: function() {
        if( this.currentIndex <= this.songs.length) {
            this.currentIndex--;
        };
        if (this.currentIndex < 0){
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },     

    randomSong: function() {
        let newIndex;       // newIndex = undifined = 0
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        // console.log("1:" + newIndex, this.currentIndex);
        this.currentIndex = newIndex;
        // console.log("2:" + newIndex, this.currentIndex);
        this.loadCurrentSong();
    },

    scrollSongActive: function() {
        setTimeout( () => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end",
            })
        }, 300);
    },

    start: function() {
        //G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();

        //?????nh ngh??a c??c thu???c t??nh cho Object
        this.defineProperties();

        //L???ng nghe/ X??? l?? s??? ki???n (DOM events)
        this.handleEvent();

        //Hi???n th??? playlist
        this.render();

        //T???i th??ng tin b??i h??t ?????u ti??n
        this.loadCurrentSong();

        //Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
        repeatBtn.classList.toggle('active', !this.isRepeat);
        randomBtn.classList.toggle('active', !this.isRandom);

    }
};

app.start();

