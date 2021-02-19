const searchButton = document.getElementById('inputDivSearchButton')
searchButton.addEventListener('click', renderAssociations)
const userInput = document.getElementById('inputDivUserInput')
userInput.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
        renderAssociations()
    }
});

let loaderAnimation = document.querySelector('.hiddenLoader');

const defaultFunctions = {
    removeLoader: () => {
        let animatedLoader = document.querySelector('.lds-ellipsis')
        animatedLoader.classList.remove('lds-ellipsis')
        animatedLoader.classList.add('hiddenLoader')
        loaderAnimation.classList.remove('lds-ellipsis')
        loaderAnimation.classList.add('hiddenLoader')
    },

    setLoader: () => {
        loaderAnimation.classList.remove('hiddenLoader')
        loaderAnimation.classList.add('lds-ellipsis')
    }
}

class association {
    constructor(meaning, partOfSpeech, weight){
        this.meaning = meaning
        this.partOfSpeech = partOfSpeech;
        this.weight = weight;
    }
}

async function _getAssociations () {
    let userInput = document.getElementById('inputDivUserInput').value
    try {
        console.log('go')
        let data = await fetch(`https://api.wordassociations.net/associations/v1.0/json/search?apikey=5b4acb51-a76e-4d05-9349-8044794dea94&text=${userInput}&lang=ru&limit=10`, {mode: 'cors'})
        let words = await data.json()
        return words
    } catch {
        console.log('error')
    }
}

async function _setAssociations () {
    let firstAssociation = new association
    let secondAssociation = new association
    let data = await _getAssociations()
    let synonymArray = []

    firstAssociation.meaning = data.response[0].items[0].item
    firstAssociation.partOfSpeech = data.response[0].items[0].pos
    firstAssociation.weight = data.response[0].items[0].weight

    secondAssociation.meaning = data.response[0].items[1].item
    secondAssociation.partOfSpeech = data.response[0].items[1].pos
    secondAssociation.weight = data.response[0].items[1].weight
    
    synonymArray.push(firstAssociation, secondAssociation)
    return synonymArray
}

async function renderAssociations() {
    defaultFunctions.setLoader()
    let array = await _setAssociations()
    defaultFunctions.removeLoader()
    array.forEach(element => {
        let container = document.createElement('div')
        container.classList.add('.wordContainer')
        let synonymContainer = document.getElementById('synonymContainer')
        synonymContainer.appendChild(container)
        container.textContent = element.meaning
    })
}
