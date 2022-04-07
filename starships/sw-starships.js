import { starships } from "../data/starships.js"
import { removeChildren, getLastNumber } from "../utils/index.js"

    const nav = document.querySelector('.nav')
    const navList = document.querySelector('.navList')
    const shipViewer = document.querySelector('.shipViewer')

    const modal = document.querySelector('.modal')
    const closeButton = document.querySelector('.modal-close')
    // TODO: add a click event listener for the modal-background div as well
    const shipMessage = document.querySelector('.box p')

    closeButton.addEventListener('click', () => modal.classList.toggle('is-active'))



document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
      console.log($target);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });





function populateNav() {
  starships.forEach((starship) => {
    const listItem = document.createElement('li')
    
    const anchor = document.createElement('a')
    anchor.href = '#'
    anchor.textContent = starship.name
    anchor.addEventListener('click', () => populateShipView(starship))

    listItem.appendChild(anchor)
    navList.appendChild(listItem)
  })
}

populateNav()

function populateShipView(shipData) {
  removeChildren(shipViewer)

  const shipImage = document.createElement('img')
  let shipNum = getLastNumber(shipData.url)
  shipImage.src = `https://starwars-visualguide.com/assets/img/starships/${shipNum}.jpg`
  shipImage.addEventListener('error', () => {
    console.log("Image error!!!!!!")
    shipImage.hidden = true
    shipMessage.textContent = `The ship known as ${shipData.name} is currently in space port for repairs.`
    modal.classList.toggle('is-active')
  })

  shipViewer.appendChild(shipImage)

}