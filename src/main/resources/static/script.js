    // Game functionality & animation 
    
class AudioController {
    constructor() {
        this.flipSound = new Audio('assets/audio/flip.mp3');
        this.matchSound = new Audio('assets/audio/match.mp3');
        this.victorySound = new Audio('assets/audio/victory.mp3');
        this.gameOverSound = new Audio('assets/audio/gameOver.mp3');
    }

    flip() {
        this.flipSound.play();
        setTimeout(() =>{
            this.flipSound.pause();
            this.flipSound.currentTime = 0;
        }, 300)
    }
    match() {
        this.matchSound.play();
        setTimeout(() =>{
            this.matchSound.pause();
            this.matchSound.currentTime = 0;
        }, 3000)
    }
    victory() {
        this.victorySound.play();
    }
    gameOver() {
        this.gameOverSound.play();
    }
}

class MatchCards {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.counter = document.getElementById('flips-count');
        this.audioController = new AudioController();
    }

    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.counter.innerText = this.totalClicks;
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.counter.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }

    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);
        
        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');

        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardType(card) {
        return card.getElementsByClassName('main-icon')[0].src;
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    pauseGame() {
        clearInterval(this.countDown);
        if(document.getElementById('game-start').classList.contains('visible')) {}
        else if(document.getElementById('game-over-text').classList.contains('visible')) {} 
        else if(document.getElementById('victory-text').classList.contains('visible')) {}
        else
            document.getElementById('pause-text').classList.add('visible');
    }

    resumeGame() {
        this.cardToCheck = null;
        this.busy = true;

        setTimeout(() => {
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);

        this.timer.innerText = this.timeRemaining;
        this.counter.innerText = this.totalClicks;
    }

    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let pauseOverlay = document.getElementById('pause-text');
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MatchCards(100, cards);

    overlays.forEach(overLay => {
        overLay.addEventListener('click', () => {
            overLay.classList.remove('visible');
            if(overLay === pauseOverlay)
                game.resumeGame();
            else
                game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

        // Nav animation

    const nav = document.querySelector(".nav-list");
    const navToggle = document.querySelector(".mobile-toggle");

    navToggle.addEventListener("click", () => {
        let visibility = nav.getAttribute("visibility");

        if(visibility === "false") {
            nav.setAttribute("visibility", true);
            navToggle.setAttribute("aria-expanded", true);

            game.pauseGame();
        } else if(visibility === "true") {
            nav.setAttribute("visibility", false);
            navToggle.setAttribute("aria-expanded", false);
        }
    });

        // Login & Register animation

    const openLogin = document.querySelector(".login-button");
    const closeLogin = document.querySelector(".login-close-button");
    const overlay = document.getElementById("overlay");

    openLogin.addEventListener("click", () => {
        var login = document.querySelector(".modal-login");
        if(login == null) return;
        login.classList.add("active");
        overlay.classList.add("active");

        nav.setAttribute("visibility", false);
        navToggle.setAttribute("aria-expanded", false);

        game.pauseGame();
    });

    closeLogin.addEventListener("click", () => {
        var login = document.querySelector(".modal-login.active");
        if(login == null) return;
        login.classList.remove("active");
        overlay.classList.remove("active");
    });

    const openRegister = document.querySelector(".register-button");
    const closeRegister = document.querySelector(".register-close-button");

    openRegister.addEventListener("click", () => {
        var register = document.querySelector(".modal-register");
        if(register == null) return;
        register.classList.add("active");

        var login = document.querySelector(".modal-login.active");
        if(login == null) return;
        login.classList.remove("active");
    })

    closeRegister.addEventListener("click", () => {
        var register = document.querySelector(".modal-register.active");
        if(register == null) return;
        register.classList.remove("active");
        overlay.classList.remove("active");
    });

    const openAgainLogin = document.querySelector(".return-to-login-button");

    openAgainLogin.addEventListener("click", () => {
        var login = document.querySelector(".modal-login");
        if(login == null) return;
        login.classList.add("active");

        var register = document.querySelector(".modal-register.active");
        if(register == null) return;
        register.classList.remove("active");
    })

    overlay.addEventListener("click", () => {
        var login = document.querySelector(".modal-login.active");
        var register = document.querySelector(".modal-register.active");
        if(login != null) {
            login.classList.remove("active");
            overlay.classList.remove("active");
        } else if(register != null) {
            register.classList.remove("active");
            overlay.classList.remove("active");
        } else return;
    });
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}