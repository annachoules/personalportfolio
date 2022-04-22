import { removeChildren } from "../utils/index.js"

const getAPIData = async (url) => {
  try {
    const result = await fetch(url)
    return await result.json()
  } catch (error) {
    console.error(error)
  }
}

class Pokemon {
  constructor(name, height, weight, abilities, types) {
    ;(this.id = 9001),
      (this.name = name),
      (this.height = height),
      (this.weight = weight),
      (this.abilities = abilities),
      (this.types = types)
  }
}

const pokeHeader = document.querySelector('header')
const pokeGrid = document.querySelector('.pokegrid')
const newButton = document.createElement('button')
newButton.textContent = 'New Pokemon'
pokeHeader.appendChild(newButton)
newButton.addEventListener('click', () => {
  const pokeName = prompt('What is the name of your new Pokemon?', 'Anna')
  const pokeHeight = prompt("What is the Pokemon's power?", 'water')
  const pokeWeight = prompt("What is the Pokemon's weight?", 2000)
  const pokeAbilities = prompt(
    "What are your Pokemon's abilities? (use a comma separated list)",
  )
  const pokeTypes = prompt(
    "What are your Pokemon's types? (up to 2 types separated by a space)",
  )

  const newPokemon = new Pokemon(
    pokeName,
    pokeHeight,
    pokeWeight,
    makeAbilitiesArray(pokeAbilities),
    makeTypesArray(pokeTypes),
  )
  console.log(newPokemon)
  populatePokeCard(newPokemon)
})

function makeAbilitiesArray(commaString) {
  // example comma string 'run-away, gluttony'
  return commaString.split(',').map((abilityName) => {
    return { ability: { name: abilityName } }
  })
}

function makeTypesArray(spacedString) {
  // example spaced string 'poison flying'
  return spacedString.split(' ').map((typeName) => {
    return { type: { name: typeName } }
  })
}

const grassButton = document.createElement('button')
grassButton.textContent = 'Show Grass Power'
pokeHeader.appendChild(grassButton)
grassButton.addEventListener('click', () => {
  removeChildren(pokeGrid)
  for(const pokemon of filterPokemonByType('grass')) {
    populatePokeCard(pokemon)
  }
})

const groundButton = document.createElement('button')
groundButton.textContent = 'Show Ground Power'
pokeHeader.appendChild(groundButton)
groundButton.addEventListener('click', () => {
  removeChildren(pokeGrid)
  for(const pokemon of filterPokemonByType('ground')) {
    populatePokeCard(pokemon)
  }
})

const fireButton = document.createElement('button')
fireButton.textContent = 'Show Fire Power'
pokeHeader.appendChild(fireButton)
fireButton.addEventListener('click', () => {
  removeChildren(pokeGrid)
  for(const pokemon of filterPokemonByType('fire')) {
    populatePokeCard(pokemon)
  }
})


const loadedPokemon = []

async function loadPokemon(offset = 0, limit = 25) {
  const data = await getAPIData(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
  )
  for (const nameAndUrl of data.results) {
    const singlePokemon = await getAPIData(nameAndUrl.url)
    const simplifiedPokemon = {
      id: singlePokemon.id,
      height: singlePokemon.height,
      weight: singlePokemon.weight,
      name: singlePokemon.name,
      abilities: singlePokemon.abilities,
      types: singlePokemon.types,
      moves: singlePokemon.moves.slice(0, 3),
    }
    loadedPokemon.push(simplifiedPokemon)
    populatePokeCard(simplifiedPokemon)
  }
}

function populatePokeCard(pokemon) {
  const pokeScene = document.createElement('div')
  pokeScene.className = 'scene'
  const pokeCard = document.createElement('div')
  pokeCard.className = 'card'
  pokeCard.addEventListener('click', () =>
  pokeCard.classList.toggle('is-flipped'),
  )
  // populate the front of the card
  pokeCard.appendChild(populateCardFront(pokemon))
  pokeCard.appendChild(populateCardBack(pokemon))
  pokeScene.appendChild(pokeCard)
  pokeGrid.appendChild(pokeScene)
}

function populateCardFront(pokemon) {
  const pokeFront = document.createElement('figure')
  pokeFront.className = 'cardFace front'

  const pokeType = pokemon.types[0].type.name
  //const pokeType2 = pokemon.types[1]?.type.name
  // console.log(pokeType, pokeType2)
  pokeFront.style.setProperty('background', getPokeTypeColor(pokeType))

 /*  if(pokeType2) {
    pokeFront.style.setProperty('background', `linear-gradient(${getPokeTypeColor(pokeType)}, ${getPokeTypeColor(pokeType2)})`)
  } */

  const pokeImg = document.createElement('img')
  if (pokemon.id === 9001) {
    pokeImg.src = '../images/pokeball.png'
  } else {
    pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  }
  const pokeCaption = document.createElement('figcaption')
  pokeCaption.textContent = pokemon.name

  pokeFront.appendChild(pokeImg)
  pokeFront.appendChild(pokeCaption)
  return pokeFront
}

function populateCardBack(pokemon) {
  const pokeBack = document.createElement('div')
  pokeBack.className = 'cardFace back'
  const label = document.createElement('h4')
  label.textContent = 'Abilities'
  pokeBack.appendChild(label)

  const abilityList = document.createElement('ul')
  pokemon.abilities.forEach((abilityItem) => {
    const listItem = document.createElement('li')
    listItem.textContent = abilityItem.ability.name
    abilityList.appendChild(listItem)
  })
//pokemon.types.forEach(typeItem)


  pokeBack.appendChild(abilityList)

  return pokeBack
}

function getPokeTypeColor(pokeType) {
  // if(pokeType === 'grass') return '#00FF00'
  let color
  switch (pokeType) {
    case 'grass':
      color = '#78C850'
      break
    case 'fire':
      color = '#F08030'
      break
    case 'water':
      color = '#6890F0'
      break
    case 'bug':
      color = '#A8B820'
      break
    case 'normal':
      color = '#A8A878'
      break
    case 'flying':
      color = '#A890F0'
      break
    case 'poison':
      color = '#A040A0'
      break
    case 'electric':
      color = '#F8D030'
      break
    case 'psychic':
      color = '#F85888'
      break
    case 'ground':
      color = '#E0C068'
      break
    default:
      color = '#888888'
  }
  return color
}

function filterPokemonByType(type) {
  return loadedPokemon.filter((pokemon) => pokemon.types[0].type.name === type)
}

await loadPokemon(0, 25)

console.log(filterPokemonByType('grass'))
// not figured out yet what the UI might be for sorted/filtered pokemon...
