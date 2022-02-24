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
        
        //Xử lý phóng to/ thu nhỏ hình ảnh khi Scroll top
        document.onscroll = function() {
            const newcdWidth = cdWidth - window.scrollY;
            cd.style.width =  newcdWidth > 0 ? newcdWidth + 'px' : 0; //tránh TH newcdWidth nhận giá trị âm
            cd.style.opacity = (newcdWidth/cdWidth);
        };

        //Xử lý quay/dừng đĩa CD
        const cdRotate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], { 
            duration: 10000,         //10s
            iterations: Infinity,
        })
        cdRotate.pause();

        //Bấm vào nút playBtn
        playBtn.onclick = function() {
            if(isPlaying) {
                audio.play();    //Vì isPlaying = true nên khi click vào playBtn sẽ chạy hàm này trước
            }
            else {
                audio.pause();  
            }
        }

        //Khi bài hát được bấm chạy
        audio.onplay = function() { 
            isPlaying = false;                   //isPlaying đổi thành false
            player.classList.add('playing');    //đồng thời icon pause đổi thành icon play
            cdRotate.play();        //quay đĩa CD
        }

        //Khi bài hát được bấm dừng             //Khi click lại vào playBtn vì isPlaying đang false
        audio.onpause = function() {            //nên hàm audio.pause được gọi đến
            isPlaying = true;                  //isPlaying đổi thành true
            player.classList.remove('playing'); //đồng thời icon play đổi thành icon pause
            cdRotate.pause();        //dừng đĩa CD
        }

        //Khi bài hát đang chạy con trỏ trên thanh thgian chạy
        audio.ontimeupdate = function() {       //timeupdate: Fires when the current playback position has changed
            if(audio.duration) {
                const progressPercent = Math.floor(this.currentTime/ this.duration*100 ) ;
                progress.value = progressPercent;
            } else {
                progress.value = 0;
            }
        }

        //Next bài hát khi bấm nút next
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

        //Quay lại bài hát khi bấm nút lùi lại
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

        //Xử lý chuyển bài hát khi audio ended
        //Xử lý lặp lại bài hát khi audio ended
        audio.onended = function() {  
            if(isRepeat) {
                nextBtn.click();
            } else {
                audio.play();
            }
        }

        //Lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songTarget = e.target.closest('.song:not(.active)'); //Chừa ra những bài hát đang chạy
            const optionTarget = e.target.closest('.option'); //Chọn ra phần option

            if(songTarget || optionTarget) {
                //Xử lý khi click vào bài hát
                if(songTarget) {
                    app.currentIndex = Number(songTarget.getAttribute('data-index'));
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                //Xử lý khi click vào option
                if(optionTarget) {

                }

            }  
        }
        
        //Khi bấm nút tua
        progress.onchange = function(e) {
            const seekTime = (e.target.value/100)*audio.duration;
            audio.currentTime = seekTime;
        }

        //Xử lý bật tắt khi bấm nút Random
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

        //Xử lý bật tắt khi bấm nút Repeat
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
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //Lắng nghe/ Xử lý sự kiện (DOM events)
        this.handleEvent();

        //Hiển thị playlist
        this.render();

        //Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();

        //Hiển thị trạng thái ban đầu của button repeat & random
        repeatBtn.classList.toggle('active', !this.isRepeat);
        randomBtn.classList.toggle('active', !this.isRandom);

    }
};

app.start();

