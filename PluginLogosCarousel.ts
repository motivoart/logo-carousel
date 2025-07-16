
// Handle functionality of LogoCarouelHeader
class LogosCarousel {

    wrappersAttr: string = '';

    constructor(wrappersAttr: string, private options: LogosCarouselOptions) {
        // Default options 
        const defaultsOptions: LogosCarouselOptions = {
            rootMargin: "0px",
            root: null,
            threshold: 0,
            duration: 5, // 5s
            useIntersectionObserver: true,
            imageWidth: '200px',
            imageHeight: 'auto',
            imageGap: 0,
            stopOnHover: false,
        }

        this.options = { ...defaultsOptions, ...options };

        // Find all necessary elements
        this.wrappersAttr = wrappersAttr;

        const wrappers = document.querySelectorAll<HTMLElement>(this.wrappersAttr);

        // Init functionalities
        if (wrappers.length > 0) {
            wrappers.forEach((wrapper, index) => {
                this.init(wrapper, index);
            });
        } else {
            console.error("#PluginLogosCarousel ERROR! Missing elements to properly init logos carousel");
        }
    }

    init(wrapper: HTMLElement, index: number) {

        // create Carousel if row with image is longer than wrapper
        if (this.comparisonWidths(wrapper)) {

            // If use IntersectionObserver
            if (this.options.useIntersectionObserver) {
                this.setUpObserver(wrapper, index);
            } else {

                const logos = this.getLogos(wrapper);

                if (logos.length > 0) {

                    // Create rows
                    this.createCarousel(logos, wrapper, index);

                }
            }
        }
    }

    /**
     *  Function to IntersectionObserver
     */
    setUpObserver(wrapper: HTMLElement, index: number) {
        if ('IntersectionObserver' in window) {

            const wrapperObserver = new IntersectionObserver((entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        if (wrapper.getAttribute('data-lc-active') != "true") {

                            wrapper.setAttribute("data-lc-active", "true");

                            const logos = this.getLogos(wrapper);

                            if (logos.length > 0) {

                                // Create rows
                                this.createCarousel(logos, wrapper, index);

                            }
                        }
                    }
                })
            }, this.getObserverOptions())

            wrapperObserver.observe(wrapper);
        }
    }

    getObserverOptions(): IntersectionObserverInit {
        const observerOptions: IntersectionObserverInit = {
            root: this.options.root,
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold,
        }

        return observerOptions
    }

    /**
     *  Function to get all logos in wrapper
     */
    getLogos(wrapper: HTMLElement) {
        const logos = wrapper.querySelectorAll(`[data-lc-item]`);

        return logos;
    }

    /**
     *  Function to create carousel wrapper
     */
    createCarousel(logos: NodeListOf<Element>, wrapper: HTMLElement, index: number) {

        const style = document.createElement('style');
        document.head.appendChild(style);

        wrapper.setAttribute('style', 'overflow: hidden;');
        const wrapperWidth = wrapper.offsetWidth;

        // create row
        const rowWrapper = document.createElement('div');
        rowWrapper.classList.add('lc__wrapper');
        rowWrapper.setAttribute('style', 'display: flex; align-items: center; white-space: nowrap; width: max-content;');

        const createdRow = logos.length > 0 ? this.createLogos(logos, rowWrapper, wrapper) : rowWrapper;
        const createdRowWidth = createdRow.offsetWidth + (logos.length * this.options.imageGap);

        let wrapperClass = this.wrappersAttr;

        // Create special class to wrapper
        wrapperClass = wrapperClass.replace(/[^a-zA-Z0-9 ]/g, '');
        wrapperClass = `${wrapperClass}-${index}`;

        rowWrapper.classList.add(`lc__wrapper-${wrapperClass}`);

        // add animation and options to style tag
        style.textContent += `
            .lc__wrapper-${wrapperClass} {
                animation: scroll-${wrapperClass} ${this.options.duration}s linear infinite;
            }
            
            .lc__wrapper-${wrapperClass} .lc__image {
                margin-left: ${this.options.imageGap / 2}px;
                margin-right: ${this.options.imageGap / 2}px;
            }

            @keyframes scroll-${wrapperClass} {
                0% {
                    transform: translateX(0);
                }

                100% {
                    transform: translateX(calc(-${createdRowWidth}px));
                }
            }
            `;

        if (this.options.stopOnHover) {
            style.textContent += `
            .lc__wrapper-${wrapperClass}:hover {
                animation-play-state: paused;
            }
            `;
        }

        // add Logos if created row is to short
        this.cloneLogos(logos, rowWrapper, wrapper);



    }

    /**
     *  Function to clone logos
     */
    cloneLogos(logos: NodeListOf<Element>, rowWrapper: HTMLElement, wrapper: HTMLElement) {

        const newRow = this.createLogos(logos, rowWrapper, wrapper);
    }

    /**
     *  Function to create new logos row and add to wrapper 
     */
    createLogos(logos: NodeListOf<Element>, rowWrapper: HTMLElement, wrapper: HTMLElement) {
        let logosList = '';

        // create new logos
        logos.forEach((logo) => {
            if (this.isImage(logo)) {
                logo.classList.add('lc__image');
                logo.removeAttribute('data-lc-item');
                logo.setAttribute('style', `width:${this.options.imageWidth}; height:${this.options.imageHeight};`);
                logosList += `<span class="lc__item" data-lc-item>${logo.outerHTML}</span>`
            } else {
                logo.classList.add('lc__item');
                const img = logo.querySelector(`img`);

                if (img) {
                    img.classList.add('lc__image');
                    img.setAttribute('style', `width:${this.options.imageWidth}; height:${this.options.imageHeight};`);
                }

                logosList += logo.outerHTML;
            }
        });

        // clear wrapper
        wrapper.innerHTML = '';

        // Insert new logos
        rowWrapper.insertAdjacentHTML('beforeend', `${logosList}`);

        // Insert row
        wrapper.insertAdjacentElement('beforeend', rowWrapper);

        return rowWrapper;
    }

    /**
     *  Function to chceck element is image 
     */
    isImage(img: Element) {
        return img instanceof HTMLImageElement;
    }

    /**
     *  Function to comparison width wrapper and new logos wrapper 
     */
    comparisonWidths(wrapper: HTMLElement) {

        const wrapperWidth = wrapper.offsetWidth;
        const logos = this.getLogos(wrapper);
        let logosWrapperWidth = 0;


        logos.forEach((logo) => {
            if (this.isImage(logo)) {
                logo.setAttribute('style', `width:${this.options.imageWidth};`);
                logosWrapperWidth += (logo as HTMLElement).offsetWidth + (logos.length * this.options.imageGap);
            } else {
                const img = logo.querySelector(`img`);
                if (img) {
                    img.setAttribute('style', `width:${this.options.imageWidth}; height:${this.options.imageHeight};`);
                    logosWrapperWidth += img.offsetWidth + (logos.length * this.options.imageGap);
                }
            }
        });

        if (logosWrapperWidth > wrapperWidth) {
            return true;
        } else {
            return false;
        }

    }

}

export type LogosCarouselOptions = {
    rootMargin: string,
    root: Element | null,
    threshold: number,
    duration: number,
    imageWidth: string,
    imageHeight: string,
    imageGap: number,
    stopOnHover: boolean,
    useIntersectionObserver: boolean
}

export default LogosCarousel;