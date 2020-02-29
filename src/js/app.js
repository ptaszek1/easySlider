class clearSlider {
    constructor(domElement,config = {}) {
        this.main = domElement;
        this.random = false;
        this.autoplay = false;
        this.navigation = false;
        this.pagination = false;
        this.next;
        this.prev;
        this.paginationItems = [];
        this.speed = 400;
        this.activeSlide = 0;
        this.slidesPerView = 1;
        this.sizes;
        this.autoplaySpeed;
        this.spaceBetween = 0;
        this.autoplayDirection;
        Object.assign(this,config);
        this.init();
        this.setEventResize();
        this.setEventClick();
    }
    setEventClick() {
        let self = this;
        self.next.addEventListener("click", this.nextSlide.bind(this));
        self.prev.addEventListener("click", this.prevSlide.bind(this));
        for(let i = 0; i < self.paginationItems.length; i++) {
            self.paginationItems[i].addEventListener("click", function () {
                self.paginationSetActive(this)
            });
        }
    }
    setEventResize(){
        window.addEventListener("resize", this.setSize.bind(this));
    }
    init() {
        this.slides = this.getSlides();
        this.wrapper = this.getWrapper();
        this.parent = this.getParent();
        this.sizes = this.slidesSize();
        this.randomValue = this.randomSlide();
        // this.error = this.error();
        this.createPagination();
        this.setSize();
        this.setSlideIndex();
        this.setActiveSlide();
        this.getNavigation();
        this.runAutoplay();
        this.setSpaceBetween();
        
    }
    getParent() {
        return (typeof this.main === 'string' && this.main.length > 1) ? document.querySelector(this.main): '';
    }
    getSlides() {
        if(this.main) {
            return document.querySelectorAll(this.main + ' .es-slide');
        }
    }
    getWrapper() {
        if(this.main) {
            return document.querySelector(this.main + ' .es-wrapper');
        }
    }
    slidesSize() {
        return {
            width: this.parent.offsetWidth,
            height: this.parent.offsetHeight
        }
    }
    setSize() {
        if(this.slides.length > 0) {
            for(let i = 0; i < this.slides.length; i++) {
                if(this.slidesPerView > 1 && this.slidesPerView <= this.slides.length) {
                    if(this.spaceBetween > 0) {
                        this.slides[i].style.width = ((this.sizes.width / this.slidesPerView) - ((this.spaceBetween / this.slidesPerView * this.slidesPerView) - (this.spaceBetween / this.slidesPerView))) + 'px';
                    } else {
                        this.slides[i].style.width = (this.sizes.width / this.slidesPerView) + 'px';
                    }
                } else {
                    this.slides[i].style.width = this.sizes.width + 'px';
                }
            }
        }
    }
    setSlideIndex() {
        if(this.slides.length > 0) {
            for(let i = 0; i < this.slides.length; i++) {
                this.slides[i].dataset.index = i +1;
            }
        }
    }
    setActiveSlide(){
        let activeSlideIndex = this.activeSlide -1;

        if(activeSlideIndex > this.slides.length - this.slidesPerView) {
            activeSlideIndex = this.activeSlide - this.slidesPerView;
        }
        // If random is set to true.
        if(this.random === true) {
            activeSlideIndex = this.randomValue -1;
        }
        if(this.slides.length >= this.slidesPerView && activeSlideIndex >= 0 && this.activeSlide <= this.slides.length) {
            for(var i = 0; i < this.slides.length; i++) {
                this.slides[i].classList.remove('es-active-slide','es-previous-slide','es-next-slide')
            }
            // Set active slide
            this.slides[activeSlideIndex].classList.add('es-active-slide');
            if(this.slidesPerView > 1) {
                this.wrapper.style.transform = `translate3d(${((-this.sizes.width * activeSlideIndex) / this.slidesPerView) - ((this.spaceBetween / this.slidesPerView) * activeSlideIndex)}px, 0px, 0px)`;  
            } else {
                this.wrapper.style.transform = `translate3d(-${this.sizes.width * (activeSlideIndex)}px, 0px, 0px)`;
            }
            setTimeout(()=> {
                this.wrapper.style.transitionDuration = this.speed + 'ms';
            },1)
            // Set previous slide
            if(this.slides[activeSlideIndex].previousElementSibling !== null) {
                this.slides[activeSlideIndex].previousElementSibling.classList.add('es-previous-slide');
            } else if(this.slides.length > 2) {
                this.slides[this.slides.length-1].classList.add('es-previous-slide');
            }
            // Set next slide
            if(this.slides[activeSlideIndex].nextElementSibling !== null) {
                this.slides[activeSlideIndex].nextElementSibling.classList.add('es-next-slide');
            } else if(this.slides.length > 2) {
                this.slides[0].classList.add('es-next-slide');
            }
        } else {
            console.log('błąd')
        }
    }
    randomSlide() {
        return Math.floor(Math.random() * (this.slides.length - 1 + 1)) + 1;
    }
    getNavigation() {
        if(this.navigation === true) {
            const navigationWrapper = document.querySelector('.es-navigation');
            if(navigationWrapper) {
                this.next = navigationWrapper.querySelector('.es-navigation-right');
                this.prev = navigationWrapper.querySelector('.es-navigation-left');
            }
        }
    }
    nextSlide() {
        if(this.activeSlide <= this.slides.length - this.slidesPerView) {
            this.activeSlide++;
            this.setActiveSlide();
        }
    }
    prevSlide() {
        if(this.activeSlide >= 2) {
            this.activeSlide--;
            this.setActiveSlide();
        }
        this.setActiveSlide();
    }
    runAutoplay() {
        if(this.autoplay === true) {
            if(this.autoplayDirection === 'left') {
                setInterval(() => {
                    this.activeSlide--;
                    this.setActiveSlide();
                }, this.autoplaySpeed);
            } else {
                setInterval(() => {
                    if(this.activeSlide <= this.slides.length - this.slidesPerView) {
                        this.activeSlide++;
                    }
                    this.setActiveSlide();
                }, this.autoplaySpeed);
            }
        }
    }
    createPagination() {
        if(this.main && this.pagination === true) {
            let pagination = document.createElement('div');
            pagination.classList.add('es-pagination');
            this.parent.appendChild(pagination);

            for(let i = 0; i < this.slides.length; i++) {
                let paginationEl = document.createElement('div');
                paginationEl.classList.add('es-pagination-item')
                paginationEl.setAttribute('data-index', i + 1);
                pagination.appendChild(paginationEl);

                // Create array with pagination elements
                this.paginationItems.push(paginationEl);
            }
        }
    }
    paginationSetActive(paginationButton) {
        if(Number(paginationButton.dataset.index) - (this.slidesPerView -1) < 1) {
            this.activeSlide = paginationButton.dataset.index;
            console.log('pierwszy if')
        } else {
            this.activeSlide = Number(paginationButton.dataset.index) - (this.slidesPerView -1);
        }
       this.setActiveSlide();
    }
    setSpaceBetween() {
        if(this.spaceBetween > 0 && this.slidesPerView > 1) {
            for(var i = 0; i < this.slides.length; i++) {
                this.slides[i].style.marginRight = this.spaceBetween + 'px';
            }
        }
    }
}


const simpleSlider = new clearSlider('.es-container',{
    speed: 300,
    slidesPerView: 4,
    activeSlide: 12,
    navigation: true,
    autoplay: false,
    autoplaySpeed: 500,
    autoplayDirection: 'left',
    pagination: true,
});

console.log(simpleSlider);
