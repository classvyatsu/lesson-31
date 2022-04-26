/*jshint esversion: 6 */
//select header
window.addEventListener("DOMContentLoaded", () => {
  const selectHeader = document.querySelector(".select__header");
  const selectBody = document.querySelector(".select__body");
  const selectItem = document.querySelectorAll(".select__item");
  const selectSpan = document.querySelector(".select__title");
  const selectImg = document.querySelector(".select__header img");

  selectHeader.addEventListener("click", () => {
    if (selectBody.classList.contains("select__body--active")) {
      selectBody.classList.remove("select__body--active");
      selectImg.style.transform = "rotate(0deg)";
      selectBody.style.maxHeight = null;
    } else {
      selectBody.classList.add("select__body--active");
      selectImg.style.transform = "rotate(180deg)";
      selectBody.style.maxHeight = selectBody.scrollHeight + "px";
    }
  });

  selectItem.forEach((item) => {
    item.addEventListener("click", () => {
      selectSpan.textContent = item.textContent;
      selectBody.classList.remove("select__body--active");
      selectImg.style.transform = "rotate(0deg)";
      selectBody.style.maxHeight = null;
    });
  });

  //maps
  let flag = 0;

  window.addEventListener("scroll", function () {
    let scrollY = window.scrollY;
    let mapOffset = document.querySelector(".map").offsetTop;

    if (scrollY >= mapOffset - 500 && flag == 0) {
      let center = [55.67555451365476, 37.50218546744996];
      function init() {
        let map = new ymaps.Map("map-element", {
          center: center,
          zoom: 11,
        });

        let playsmark = new ymaps.Placemark(
          center,
          {},
          {
            iconLayout: "default#image",
            iconImageHref: "img/maps/mark-cart.svg",
            iconImageSize: [70, 100],
            iconImageOffset: [-40, 70],
          }
        );

        map.controls.remove("geolocationControl"); // удаляем геолокацию
        map.controls.remove("searchControl"); // удаляем поиск
        map.controls.remove("trafficControl"); // удаляем контроль трафика
        map.controls.remove("typeSelector"); // удаляем тип
        map.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
        map.controls.remove("zoomControl"); // удаляем контрол зуммирования
        map.controls.remove("rulerControl"); // удаляем контрол правил
        map.behaviors.disable(["scrollZoom"]); // отключаем скролл карты

        map.geoObjects.add(playsmark);
      }

      ymaps.ready(init);

      flag = 1;
    }
  });

  //mobile menu
  const headerMobile = document.querySelector(".header-mobile"),
    burger = document.querySelector(".header__burger"),
    cross = document.querySelector(".header__cross"),
    body = document.querySelector("body");

  burger.addEventListener("click", () => {
    headerMobile.classList.toggle("active");
    burger.style.display = "none";
    cross.style.display = "block";
    body.classList.add("noscroll");
  });

  cross.addEventListener("click", () => {
    headerMobile.classList.toggle("active");
    burger.style.display = "block";
    cross.style.display = "none";
    body.classList.remove("noscroll");
  });

  //modal
  const modal = document.querySelector(".modal"),
    modalButtons = document.querySelectorAll(".button-modal");

  modalButtons.forEach((item) => {
    item.addEventListener("click", () => {
      headerMobile.classList.remove("active");
      burger.style.display = "block";
      cross.style.display = "none";
      body.classList.remove("noscroll");
      modal.classList.add("active__modal");
      body.classList.add("noscroll");
    });
  });

  modal.addEventListener("click", (e) => {
    const isModal = e.target.closest(".modal__inner");

    if (!isModal) {
      modal.classList.remove("active__modal");
      body.classList.remove("noscroll");
    }
  });

  //slider
  const swiper = new Swiper(".slider", {
    loop: true,
    pagination: {
      el: ".slider__pagination",
    },
    navigation: {
      nextEl: ".slider__arrow-right",
      prevEl: ".slider__arrow-left",
    },
  });

  //iform send

  const form = document.querySelector(".form__elements"),
    telSelector = form.querySelector('input[type="tel"]'),
    inputMask = new Inputmask("+7 (999) 999-99-99");

  inputMask.mask(telSelector);

  const validation = new JustValidate(".form__elements");

  validation
    .addField("#name", [
      {
        rule: "minLength",
        value: 2,
        errorMessage: "Количество символов меньше 2!",
      },
      {
        rule: "maxLength",
        value: 30,
        errorMessage: "Количество символов больше 30!",
      },
      {
        rule: "required",
        value: "true",
        errorMessage: "Введите имя!",
      },
    ])

    .addField("#check", [
      {
        rule: "required",
        value: "true",
        errorMessage: "Подтвердите согласие на обработку личных данных!",
      },
    ])

    .addField("#telephone", [
      {
        rule: "required",
        value: "true",
        errorMessage: "Введите номер телефона!",
      },
      {
        rule: "function",
        validator: function () {
          const phone = telSelector.inputmask.unmaskedvalue();
          return phone.length === 10;
        },
        errorMessage: "Введите корректный номер телефона!",
      },
    ])
    .onSuccess((e) => {
      if (document.querySelector("#check").checked) {
        const sendForm = (data) => {
          return fetch("mail.php", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }).then((res) => res.json());
        };

        const dataForm = new FormData(e.target);
        const user = {};

        dataForm.forEach((val, key) => {
          user[key] = val;
        });

        sendForm(user).then((data) => {
          alert("Спасибо! Наш менеджер свяжется с Вами в близжайшее время!");
          //console.log("Письмо успешно отправлено!");
        });

        e.target.reset();
      }
    });

  //accordeon

  const accordeon = document.querySelector(".facts__items"),
    tab = document.querySelectorAll(".facts__item"),
    answer = document.querySelectorAll(".facts__answer"),
    plus = document.querySelectorAll(".facts__plus"),
    minus = document.querySelectorAll(".facts__minus"),
    open = document.querySelectorAll(".facts__open--style");

  accordeon.addEventListener("click", (e) => {
    const target = e.target.closest(".facts__item");

    if (target) {
      tab.forEach((item, i) => {
        if (
          item === target &&
          !target.classList.contains("facts__item--active")
        ) {
          answer[i].classList.add("active__answer");
          tab[i].classList.add("facts__item--active");
          plus[i].style.display = "none";
          minus[i].style.display = "flex";
          open[i].style.background = "#0074D4";
        } else {
          answer[i].classList.remove("active__answer");
          tab[i].classList.remove("facts__item--active");
          plus[i].style.display = "flex";
          minus[i].style.display = "none";
          open[i].style.background = "#37A5FF";
        }
      });
    }
  });
});

// $(".facts__item").click(function (e) {
//   $(".facts__answer").removeClass("active__answer");
//   $(".facts__item").removeClass("facts__item--active");
//   $(".facts__plus").css("display", "flex");
//   $(".facts__minus").css("display", "none");

//   let target = $(e.target.closest(".facts__item"));
//   if (target) {
//     $(this).find(".facts__answer").addClass("active__answer");
//     $(this).addClass("facts__item--active");
//     $(this).find(".facts__plus").css("display", "none");
//     $(this).find(".facts__minus").css("display", "flex");
//   }
// });
