'use strict';

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
    postData( item );
});

function postData( form ) {
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
        
        const object = {};
        formData.forEach( function( value, key ) {
            object[key] = value;
        });


        fetch('js/server.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then( data => data.text)
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


















// Используем классы для карточек

class LinkConstructor {
    constructor( href, linkName, parentSelector ) {
        this.href       = href;
        this.linkName   = linkName;
        this.parent     = document.querySelector( parentSelector );
    }
    
    render() {
        const div = document.createElement( 'div' );
        div.innerHTML = `
            <a href=${this.href} class="header__link">${this.linkName}</a>
        `;
        this.parent.append(div);
    }
    
}//LinkConstructor
new LinkConstructor(
    '#',
    'Второй пункт',
    '.header__links'
).render();


new LinkConstructor(
    '#',
    'Доставка питания',
    '.header__links'
).render();

new LinkConstructor(
    'https://learn.javascript.ru/introduction-browser-events',
    'Введение в браузерные события',
    '.header__links'
).render();

// class TitleConstructor {
//     constructor( className, title, parentSelector ) {
//         this.className      = className;
//         this.title          = title;
//         this.parent         = document.querySelector( parentSelector );
//     }
//     render() {
//         const div = document.createElement( 'div' );
//         div.classList.add( this.className );
//         div.innerHTML = `
//             ${this.title}
//         `;
//        this.parent.append( div ); 
//     }
// }
// new TitleConstructor(
//     'title',
//     'Заказывай пробный день прямо сейчас!',
//     '.order'
// ).render();

// class FormConstructor {
//     constructor(action, className, parentSelctor ) {
//         this.action     = action;
//         this.className  = className;
//         this.parent     = document.querySelector( parentSelctor );        
//     }
//     render() {
//         const form = document.createElement( 'form' );
//         form.action = this.action;
//         form.classList.add( this.className );
//         this.parent.append( form );
//     }
// }

// new FormConstructor(
//     '#',
//     'order__form',
//     '.order'
// ).render();



// class InputConstructor {
//     constructor( required, placeholder, name, type, className, parentSelector ) {
//         this.required       = required;
//         this.placeholder    = placeholder;
//         this.name           = name;
//         this.type           = type;
//         this.className      = className;
//         this.parent         = document.querySelector( parentSelector );
//     }
//     render() {
//         const input = document.createElement( 'input' );
//         input.classList = this.className;
//         input.required = this.required;
//         input.placeholder = this.placeholder;
//         input.name = this.name;
//         input.type = this.type;

//         this.parent.prepend( input );
//     }
// }

// new InputConstructor(
//     'required',
//     'Ваш номер телефона',
//     'phone',
//     'phone',
//     'order__input',
//     '.order__form'
// ).render();

// new InputConstructor(
//     'required',
//     'Ваше имя',
//     'name',
//     'text',
//     'order__input',
//     '.order__form'
// ).render();


// class ImgConstructor {
//     constructor(src, alt, parentSelector) {
//         this.src    = src;
//         this.alt    = alt;
//         this.parent = document.querySelector( parentSelector );
//     }
//     render() {
//         const img = document.createElement( 'img' );
//         img.src = this.src;
//         img.alt = this.alt;

//         this.parent.append( img );
//     }
// }
// new ImgConstructor(
//     'icons/right.svg',
//     'right',
//     '.order__form'

// ).render();

// class ButtonConstructor {
//     constructor( title, parentSelector, ...clasess ) {
//         this.clasess    = clasess;
//         this.title      = title;
//         this.parent     = document.querySelector( parentSelector );
//     }
//     render() {
//         const button = document.createElement( 'button' );
//         this.clasess.forEach( ( className ) => {
//             button.classList.add(className);
//         });
//         button.innerHTML = `${this.title}`;

//         this.parent.append( button );
//     }
// }
// new ButtonConstructor(
//     'Перезвонить мне',
//     '.order__form',
//     'btn',
//     'btn_dark',
//     'btn_min'
// ).render();


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

new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    `Меню "Фитнес" - это новый подход к приготовлению блюд:
     больше свежих овощей и фруктов. Продукт активных и здоровых людей.
     Это абсолютно новый продукт с оптимальной ценой и высоким качеством!`,
     9,
    '.menu .container',
    "menu__item",
    'big'
).render();

new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    `В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!`,
    15,
    '.menu .container',
    "menu__item"
    
).render();

new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    `Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.`,
    13,
    '.menu .container',
    "menu__item"
    
).render();

























});//window











