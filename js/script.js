'use strict';
// const axios = require('axios').default;

window.addEventListener('DOMContentLoaded', () => {

    
    const tabheader     = document.querySelector( '.tabheader__items' ),
          tabcontent    = document.querySelectorAll( '.tabcontent' ),
          tabItem       = document.querySelectorAll( '.tabheader__item' ),
          btn           = document.querySelectorAll( '[data-modal]' ),
          modal         = document.querySelector( '.modal' ),
          modalClose    = document.querySelector( '[data-close]' ),
          body          = document.querySelector( 'body');

//////////////////////////////////////////////Модальное окно
    let showModal = ( body, modal ) => {
        body.addEventListener( 'click', ( e ) => {
            btn.forEach( ( item ) => {
                if ( e.target == item ) {
                    modal.classList.add('show');
                    body.style.overflow = 'hidden';
                    clearInterval( modalTimerId);
                }
            });
        });
    };    
    showModal(body, modal );


    let hideElement = ( elem, closeButton, selector, event ) => {
        elem.addEventListener( event, ( e ) => {
            if ( e.target == closeButton ) {
                elem.classList.remove( selector );
                body.style.overflow = '';
            } else if ( e.target == elem ) {
                elem.classList.remove( selector );
                body.style.overflow = '';
            }        
        });
    };
    hideElement( modal, modalClose, 'show', 'click' );

    let removeSelectorFromAnElementKeyDown = ( elem, selector, keydown) => {
        document.addEventListener( 'keydown', ( e ) => {
            if( e.code === keydown && elem.classList.contains( selector )) {
                elem.classList.remove( selector );
                console.log( e.code );
            }
        });
    };
    removeSelectorFromAnElementKeyDown(modal, 'show', 'Escape');

    let openModal = () => {
        modal.classList.add( 'show' );
        modal.classList.remove( 'hide' );
        document.body.style.overflow = 'hidden';
    };

    let closeModal = () => {
        modal.classList.add( 'hide' );
        modal.classList.remove( 'show' );
        document.body.style.overflow = '';
    }
    const modalTimerId = setTimeout(openModal,600000);
//////////////////////////////////////////////////////////////////

///////////////////////////////////////////////show hide tabcontent
    let hideTabContent = () => {
        tabcontent.forEach( ( item ) => {
            item.classList.add( 'hide' );
            item.classList.remove( 'show', 'fade' );
        });
        tabItem.forEach( ( item ) => {
            item.classList.remove( 'tabheader__item_active' );
        });
    };

    let showTabContent = ( i = 0 ) => {
        tabcontent[i].classList.add( 'show', 'fade' );
        tabcontent[i].classList.remove( 'hide' );
        tabItem[i].classList.add( 'tabheader__item_active' );
    };
    hideTabContent();
    showTabContent();

    let parentListener = ( parent, child ) => {
        parent.addEventListener( 'click', ( e ) => {
            child.forEach( ( item, i ) => {
                if (e.target && e.target == item ) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        });
    };
    parentListener( tabheader, tabItem );
        
    let activeClassToggle = ( elem ) => {
        elem.addEventListener( 'click', ( e ) => {
            if ( !e.target.classList.contains( 'tabheader__item_active')) {
                e.target.classList.toggle('tabheader__item_active');
            } 
        });
    };
    activeClassToggle( tabheader );
/////////////////////////////////////////////////////////////////////
   
////////////////////////////////////////////////////////////////timer
const deadline = '2020-12-25';

let getTimeRemaining = ( endtime ) => {
    const t       = Date.parse( endtime ) - Date.parse( new Date() ),
          days    = Math.floor( t / (1000 * 60 * 60 * 24) ),
          hours   = Math.floor( ( t / (1000 * 60 * 60) % 24 ) ),
          minutes = Math.floor( ( t / 1000 / 60 ) % 60 ),
          seconds = Math.floor( ( t / 1000 ) % 60 );
    return {
        'total'  : t,
        'days'   : days,
        'hours'  : hours,
        'minutes': minutes,
        'seconds': seconds
    };
};

let getZero = ( num ) => {
    if ( num >= 0 && num < 10 ) {
        return `0${num}`;
    } else {
        return num;
    }
};

let setClock = ( selector, endtime ) => {
    const timer        = document.querySelector( selector ),
          days         = timer.querySelector( '#days'),
          hours        = timer.querySelector( '#hours' ),
          minutes      = timer.querySelector( '#minutes' ),
          seconds      = timer.querySelector( '#seconds' ),
          timeInterval = setInterval( updateClock, 1000 );
    updateClock();

    function updateClock() {
        const t = getTimeRemaining( endtime );
        days.innerHTML = getZero( t.days );
        hours.innerHTML = getZero( t.hours );
        minutes.innerHTML = getZero( t.minutes );
        seconds.innerHTML = getZero( t.seconds );

        if ( t.total <= 0 ) {
            clearInterval(timeInterval);
        }
    }
};

setClock( '.timer', deadline );
//////////////////////////////////////////////////////////////////////\
/////////////////////////////////////////////////////////////////////  \
////////////////////////////////////////////////////////////////////    \


let showModalByScroll = () => {
    if ( window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight ) {
        openModal();
        window.removeEventListener( 'scroll', showModalByScroll );
    }
};
window.addEventListener('scroll', showModalByScroll);
// console.log( window.pageYOffset);
// console.log(document.documentElement.clientHeight);
// console.log( document.documentElement.scrollHeight);

//document.documentElement.clientHeight = Высота видимой части окна
//document.documentElement.clientWidth = Ширина видимой части окна
//window.innerWidth - Вся ширина с полосой прокрутки





// Forms
const forms = document.querySelectorAll( 'form' );
const message = {
    loading : 'img/form/spinner.svg',
    success : 'Спасибо!',
    failure : 'Что-то пошло не так...'
};
forms.forEach( ( item ) => {
    bindPostData( item );
});

const postData = async ( url, data ) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });
    return await res.json();
};


function bindPostData( form ) {
    form.addEventListener( 'submit', ( e )  => {
        e.preventDefault();//Убераем перезагрузку по клику на кнопке 
        const statusMessage = document.createElement( 'img' );
        statusMessage.src = message.loading;
        statusMessage.textContent = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        
        form.insertAdjacentElement('afterend', statusMessage );
        const formData = new FormData( form ); // во внутрь мы помещаем форму из которой нам нужно собрать данные
        
        const json = JSON.stringify( Object.fromEntries( formData.entries ) );

        postData('http://localhost:3000/requests', json )
        .then( ( data ) => {
            console.log( data );
            showThanksModal( message.success);
            statusMessage.remove();
        }).catch( () => {
            showThanksModal( message.failure);
        }).finally( () => {
            form.reset();
        })
    });
} //formData

function showThanksModal( message ) {
    const prevModalDialog = document.querySelector( '.modal__dialog' );

    prevModalDialog.classList.add( 'hide' );
    openModal();
    const thanksModal = document.createElement( 'div' );
    thanksModal.classList.add( 'modal__dialog' );
    thanksModal.innerHTML = `
        <div class='modal__content'>   
            <div class='modal__close' data-close>
                x
            </div>
            <div class='modal__title'>
                ${message}
            </div>
        </div>
    `;
    document.querySelector( '.modal').append( thanksModal );
    setTimeout( () => {
        thanksModal.remove();
        //prevModalDialog.classList.add( 'show' );
        prevModalDialog.classList.remove( 'hide' );
        closeModal();
    }, 2000)
}




fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));




// function getDates(startDate, stopDate) {
//     var dateArray = [];
//     var currentDate = moment(startDate);
//     var stopDate = moment(stopDate);
//     while (currentDate <= stopDate) {
//     dateArray.push( moment(currentDate).format('YYYYMMDD') )
//     currentDate = moment(currentDate).add(1, 'days');
//     }
//     return dateArray;
//     }

// let result = [];
// let startDate = '20201010';
// let endDate   = '20201020'
// //let dateArr = ['20201011', '20201012', '20201013', '20201014', '20201015', '20201016', '20201017'];
// let dateArr = getDates(startDate, endDate);
// console.log( dateArr )
// for ( let date of dateArr ) {
//     fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${date}&json`)

//     .then(response => response.json())
//     .then( ( json ) => {
//         json.forEach( ( item ) => {
//             if( item.cc === 'USD' ) {
//                 result.push(` ${item.rate} ${item.exchangedate}`);
//             }
            
//         })
//     })
// }
// console.log(result)




// const getResource = async ( url ) => {
//     const res = await fetch( url );

//     if ( !res.ok ) {
//         throw new Error(`Could not fetch ${url}, status ${res.status}` )
//     }

//     return await res.json();
// };



// getResource('http://localhost:3000/menu')
//     .then( data => {
//         data.forEach( ({img, altimg, title, descr, price}) => {
//             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
//         })
//     });

axios.get('http://localhost:3000/menu')
    .then( ( data ) => {
        data.data.forEach( ({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        })
    })

class MenuCard {
    constructor( src, alt, title, descr, price, parentSelector, ...clasess ) {
        this.src      = src;
        this.alt      = alt;
        this.title    = title;
        this.descr    = descr;
        this.price    = price;
        this.clasess  = clasess;
        this.parent   = document.querySelector( parentSelector );
        this.transfer = 27;
        this.changeToUAH();
    }

    changeToUAH() {
        this.price = this.price * this.transfer;
    }
    render() {
        const element = document.createElement( 'div' );
        if ( this.clasess.length === 0 ) {
            this.element = 'menu__item';
            element.classList.add( this.element );
        } else {
            this.clasess.forEach( ( className ) => {
                element.classList.add(className);
            });
        }
        
        element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        `;
        this.parent.append( element );
    }

}//MenuCard

   
 
class BankGov {
    constructor( txt, rate, cc, exchangedate, parentSelector ) {
        this.txt            = txt;
        this.rate           = rate;
        this.cc             = cc;
        this.exchangedate   = exchangedate;
        this.parent         = document.querySelector( parentSelector );
    }
    render() {
        const div = document.createElement( 'div' );
        div.innerHTML = `
            <p>${this.rate}</p>
            
            <p>${this.exchangedate}</p>
        `;
        this.parent.append( div );
    }
}



const current = 'USD';
let dateArr = ['20201010', '20201011', '20201012', '20201013' , '20201014', '20201015', '20201016',
               '20201017', '20201018', '20201019', '20201020'];


for ( let date of dateArr) {
axios.get(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${date}&json`)
    .then(data => {
        data.data.forEach( ({txt, rate, cc, exchangedate}) => {
            if ( cc === current ) {
                new BankGov(txt, rate, cc, exchangedate, '.block' ).render();
            }
        })
    })
} 








const slides          = document.querySelectorAll('.offer__slide'),
      slider          = document.querySelector('.offer__slider'),
      prev            = document.querySelector('.offer__slider-prev'),
      next            = document.querySelector('.offer__slider-next'),
      sliderCurrent   = document.querySelector('#current'),
      sliderTotal     = document.querySelector('#total'),
      slidesWrapper   = document.querySelector('.offer__slider-wrapper'),
      slidesField     = document.querySelector('.offer__slider-inner'),
      width           = window.getComputedStyle(slidesWrapper).width;

    slidesField.style.width = 100 * slides.length + '%';
    slides.forEach( ( slide ) => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';
    
    const indicators = document.createElement( 'ol' ),
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for ( let i = 0; i < slides.length; i++ ) {
        const dot = document.createElement( 'li' );
        dot.setAttribute( 'data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if ( i == 0 ) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);

    }


    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

let slideIndex = 1;
let offset = 0;

next.addEventListener( 'click', () => {
    if ( offset == +width.slice(0, width.length - 2 ) * (slides.length - 1)) {
        offset = 0;
    } else {
         offset += +width.slice(0, width.length - 2 );
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if( slideIndex == slides.length ) {
        slideIndex = 1;
    } else {
        slideIndex++;
    }

    if( slides.length < 10 ) {
        sliderCurrent.textContent = `0${slideIndex}`
    } else {
        sliderCurrent.textContent = slideIndex;
    }

    dots.forEach( ( dot ) => {
        dot.style.opacity = '.5';
    });
    dots[slideIndex - 1].style.opacity = 1;
});

prev.addEventListener( 'click', () => {
    if ( offset == 0) {
        offset = +width.slice(0, width.length - 2 ) * (slides.length - 1);
    } else {
         offset -= +width.slice(0, width.length - 2 );
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if ( slideIndex == 1 ) {
        slideIndex = slides.length;
    } else {
        slideIndex--;
    }

    if ( slides.length < 10 ) {
        sliderCurrent.textContent = `0${slideIndex}`;
    } else {
        sliderCurrent.textContent = slideIndex;
    }

    dots.forEach( ( dot ) => {
        dot.style.opacity = '.5';
    });
    dots[slideIndex - 1].style.opacity = 1;
})

dots.forEach( ( dot ) => {
    dot.addEventListener( 'click', ( e ) => {
        const slideTo = e.target.getAttribute( 'data-slide-to' );

        slideIndex = slideTo;
        offset =  +width.slice(0, width.length - 2 ) * (slideTo - 1);

        slidesField.style.transform = `translateX(-${offset}px)`;
        
        if ( slides.length < 10 ) {
            sliderCurrent.textContent = `0${slideIndex}`;
        } else {
            sliderCurrent.textContent = slideIndex;
        }

        dots.forEach( ( dot ) => {
            dot.style.opacity = '.5';
        });
        dots[slideIndex - 1].style.opacity = 1;
        
    })
})


if ( slides.length < 10 ) {
    sliderTotal.textContent = `0${slides.length}`;
    sliderCurrent.textContent = `0${slideIndex}`;
} else {
    sliderTotal.textContent = slides.length;
    sliderCurrent.textContent = slideIndex;
}


// Калькулятор каллорий

const result       = document.querySelector('.calculating__result');

let sex, height, weight, age, ratio;

if( localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
} else {
    sex = 'female';
    localStorage.setItem('sex', 'female');
}

if( localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
} else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375);
}

let initLocalSettings = (selector, activeClass ) => {
    const elements = document.querySelectorAll( selector );

    elements.forEach( ( elem ) => {
        elem.classList.remove( activeClass ); 
        if ( elem.getAttribute('id') === localStorage.getItem('sex')) {
            elem.classList.add( activeClass );
        }
        if ( elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
            elem.classList.add( activeClass );
        }
    });
}

initLocalSettings( '#gender div', 'calculating__choose-item_active' );
initLocalSettings( '.calculating__choose_big div', 'calculating__choose-item_active' );

let calcTotal = () => {
    if ( !sex || !height || !weight || !age || !ratio ) {
        result.textContent = '______';

        return;
    }
    if ( sex === 'female' ) {
        result.textContent = Math.round( ( 447.6 + ( 9.2 * weight ) + ( 3.1 * height ) - ( 4.3 * age ) ) * ratio );
    } else {
        result.textContent = Math.round( ( 88.36 + ( 13.4 * weight ) + ( 4.8 * height ) - ( 5.7 * age ) ) * ratio );
    }
}

calcTotal();




let getStaticInformation = ( selector, activeClass ) => {
    const elements = document.querySelectorAll( selector );
    elements.forEach( ( elem ) => {
        elem.addEventListener( 'click', ( e ) => {
            if ( e.target.getAttribute('data-ratio') ) {
                ratio = +e.target.getAttribute('data-ratio');
                localStorage.setItem( 'ratio', +e.target.getAttribute('data-ratio') );
            } else {
                sex = e.target.getAttribute('id');
                localStorage.setItem( 'sex', e.target.getAttribute('id') );
            }
            elements.forEach( ( item ) => {
                item.classList.remove( activeClass );
                
            });
            e.target.classList.add( activeClass );
            calcTotal();
        });
    })

}
getStaticInformation( '#gender div', 'calculating__choose-item_active');
getStaticInformation( '.calculating__choose_big div', 'calculating__choose-item_active');

let getDynamicInformation = (selector) => {
    const input = document.querySelector( selector );

    input.addEventListener( 'input', () => {
        if ( input.value.match(/\D/g) ) {
            input.style.border = '2px solid tomato';
        } else {
            input.style.border = 'none';
        }
        switch(input.getAttribute('id')) {
            case 'height':
                if ( +input.value > 220 ) {
                    input.value = '';
                }
                height = +input.value;
                break;
            case 'weight':
                if ( +input.value > 250) {
                    input.value = '';
                }
                weight = +input.value;
                break;
            case 'age':
                if ( +input.value > 80 ) {
                    input.value = '';
                }
                age = +input.value;
                break;
        }
        calcTotal();
    });
    
}

getDynamicInformation('#height');
getDynamicInformation('#weight');
getDynamicInformation('#age');








});//window











