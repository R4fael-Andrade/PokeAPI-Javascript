let currentPageUrl = 'https://pokeapi.co/api/v2/pokemon/';

window.onload = async () => {
    showLoading();

    try {
        await loadPokemons(currentPageUrl);
       hideLoading(); 
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadPokemons(url) {
   
    //Carregando conteúdo da página
    const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = '';

    try{
         const response = await fetch(url);
         const responseJson = await response.json();

         for (let i = 0; i < responseJson.results.length; i++ ){
            
            const pokemon = responseJson.results[i];
            const pokemonData = await fetch(pokemon.url);
            const pokemonJson = await pokemonData.json();

            //puxando dados dos pokemons
             const speciesUrl = pokemonJson.species.url;
             const speciesData = await fetch(speciesUrl);
             const speciesJson = await speciesData.json();
             const descricaoEmIngles = speciesJson.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

            //Criando cards e adicionando informações e imagem
            const card = document.createElement("div");
            card.className = 'card';
            
            const pokemonId = document.createElement("span");
            pokemonId.className = 'id';
            pokemonId.innerText = `#${pokemonJson.id}`;

            const pokemonName = document.createElement("span");
            pokemonName.className = 'pokemon-text';
            pokemonName.innerText = pokemonJson.name.toUpperCase();

            const fundo = document.createElement("div");
            fundo.className = 'pokemon-fundo';
            const gifUrl = `./assets/${pokemonJson.id}.gif`;
            fundo.style.backgroundImage = `url(${gifUrl})`;

            const description = document.createElement("div");
            description.className = "pokemon-details-div";
            description.innerText = `${descricaoEmIngles}`;

            const pokemonType = pokemonJson.types.map((type) => type.type.name);
            const typeString = pokemonJson.types.map((type) => type.type.name);
             
            //Aplicando o gradient quando houver mais de um tipo
              let typeColor = [];
               if(typeString.length === 1) {
                   typeColor = gradientColors(typeString);
                   card.style.backgroundImage = typeColor;
              } else if (typeString.length === 2) {
                    const gradient = gradientColors(typeString);
                   card.style.backgroundImage = gradient;
                   
              }
            
           
            //Puxando o tipo
            const types = document.createElement("div");
            types.className = 'pokemon-text';
            types.innerText = `${traduzirTipo(pokemonType)}`

            
           //Aplicando a cor de fundo de cada tipo
            switch(pokemonType[0]){
                
                case "fire":
                    card.style.backgroundColor = '#ff4d4d';
                    break;

                case "water":
                    card.style.backgroundColor = '#6699ff';
                    break;
                    
                case "bug": 
                    card.style.backgroundColor = '#666699';
                    break;    
                case "grass":
                    card.style.backgroundColor = '#39ac71';
                    break;
                case "poison":
                    card.style.backgroundColor = '#9900cc'
                    break;
                case "electric":
                    card.style.backgroundColor = '#cca300';
                    break;
                case "flying":
                    card.style.backgroundColor = '#1a1a00';
                    break;
                case "normal":
                    card.style.backgroundColor = '#a3a3c2';
                    break;
                case "ground":
                    card.style.backgroundColor = '#bf8040';
                    break;
                case "rock":
                    card.style.backgroundColor = '#734d26';
                    break;
                case "ghost":
                        card.style.backgroundColor = '#4040bf';
                        break;
                case "steel":
                        card.style.backgroundColor = '#5c8a8a';
                        break;
                case "psychic":
                        card.style.backgroundColor = '#cc6600';
                        break;
                case "ice":
                        card.style.backgroundColor = '#0066ff';
                        break;
                case "dragon":
                        card.style.backgroundColor = '#007399';
                        break;
                case "dark":
                        card.style.backgroundColor = '#001f4d';
                        break;
                case "fairy":
                            card.style.backgroundColor = '#ff66ff';
                            break;
                case "fighting":
                            card.style.backgroundColor = '#8c1aff';
                            break;
                default:
                    card.style.backgroundColor = '#000';

                    
            }

            const pokemonNameBG = document.createElement("div");
            pokemonNameBG.className = "text-content";

    
            pokemonNameBG.appendChild(pokemonId);  
            pokemonNameBG.appendChild(pokemonName);
            pokemonNameBG.appendChild(fundo);
            pokemonNameBG.appendChild(types);
            pokemonNameBG.appendChild(description);
            card.appendChild(pokemonNameBG);

            
            card.onclick = () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = "visible";

                const modalContent = document.getElementById('modal-content');
                modalContent.innerText = '';

                 const pokemonImage = document.createElement("div");
                 pokemonImage.className = 'pokemon-image';

                 const pokemonId = document.createElement("span");
                 pokemonId.className = 'id';
                 pokemonId.innerText = `#${pokemonJson.id}`;
     
                 const gifUrl = `./assets/${pokemonJson.id}.gif`;
                 pokemonImage.style.backgroundImage = `url(${gifUrl})`;

                const name = document.createElement("span");
                name.className = 'pokemon-details';
                name.innerText = `${pokemonJson.name.toUpperCase()}`;

                const typesModal = document.createElement("span");
                typesModal.className = 'pokemon-details';
                typesModal.innerText = `${traduzirTipo(pokemonType)}`;

                //exibindo descrição 
                 const description = document.createElement("span");
                 description.className = "pokemon-details";
                 description.innerText = `${descricaoEmIngles}`;

                modalContent.appendChild(name)
                modalContent.appendChild(pokemonImage);
                modalContent.appendChild(typesModal);
                modalContent.appendChild(description);
               
            }

            mainContent.appendChild(card);

         }
         
        //Verificando e habilitando próxima e pagina anterior
        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.previous

        backButton.style.visibility = responseJson.previous? "visible" : "hidden"
        nextButton.style.visibility = responseJson.next? "visible" : "hidden"

        currentPageUrl = url;
    } catch (error) {
        alert('Erro ao carregar pokemons');
        console.log(error);
    }

 }
 
 //Função para chamar próxima página
async function loadNextPage() {
    
    if(!currentPageUrl) return;
    
    try {
        showLoading();
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json();

        await loadPokemons(responseJson.next);
        hideLoading();
       
    } catch (error) {
       
        console.log(error);
        alert('Erro ao carregar próxima página');
    }
}

//Função para chamar página anterior
async function loadPreviousPage() {
    if(!currentPageUrl) return;

    try {
        showLoading();
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json();

        await loadPokemons(responseJson.previous);
        hideLoading();
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar página anterior');
    }
}

//exibindo Modal
function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

//Traduzindo o tipo para português
function traduzirTipo(tipoEmIngles) {
     const tiposTraduzidos = {
        
         normal: 'Normal',
         fighting: 'Lutador',
         flying: 'Voador',
         poison: 'Venenoso',
         ground: 'Terra',
         rock: 'Pedra',
         bug: 'Inseto',
         ghost: 'Fantasma',
         steel: 'Metálico',
         fire: 'Fogo',
         water: 'Água',
         grass: 'Grama',
         electric: 'Elétrico',
         psychic: 'Psíquico',
         ice: 'Gelo',
         dragon: 'Dragão',
         dark: 'Sombrio',
         fairy: 'Fada'
     };

     return tipoEmIngles.map(type => tiposTraduzidos[type.toLowerCase()] || type).join(', ');

 }

//Aplicando cor para cada tipo
 function gradientColors(types) {
    const colorMap = {
        'fire': '#ff4d4d',
        'water': '#6699ff',
        'grass': '#39ac71',
        'bug': '#666699',
        'poison': '#9900cc',
        'electric': '#cca300',
        'flying': '#1a1a00',
        'normal': '#e6e6e6',
        'ground': '#bf8040',
        'rock': '#734d26',
        'ghost': '#4040bf',
        'steel': '#5c8a8a',
        'psychic': '#cc6600',
        'ice': '#0066ff',
        'dragon': '#007399',
        'dark': '#001f4d',
        'fairy': '#ff66ff',
        'fighting': '#8c1aff'
    };

    const colors = types.map(type => colorMap[type.toLowerCase()]).join(', ');
    return `linear-gradient(45deg, ${colors})`;
}

//Alterando modo da página
const toogleButton = document.getElementById("modo-escuro-toogle");
const iconeSol = document.getElementById("icone-sol");
const iconeLua = document.getElementById("icone-lua");

let isModoEscuro = localStorage.getItem('modoEscuro') === 'true';


function alternarModo() {
    isModoEscuro = !isModoEscuro;
    if (isModoEscuro) {
        document.body.style.backgroundColor = '#00004d'
        iconeSol.style.display = 'none';
        iconeLua.style.display = 'block';
    } else {
        document.body.style.backgroundColor = '#b3c6ff';
        iconeSol.style.display = 'block';
        iconeLua.style.display = 'none';

    }

    localStorage.setItem('modoEscuro', isModoEscuro);

}

toogleButton.addEventListener("click", alternarModo);

if (isModoEscuro) {
    document.body.style.backgroundColor = "#00004d";
    iconeSol.style.display = "none";
    iconeLua.style.display = "block";
} else {
    document.body.style.backgroundColor = "#b3c6ff";
    iconeSol.style.display = "block";
    iconeLua.style.display = "none";
}

//Função de animação de próxima página
function showLoading() {
    document.querySelector('#loading').style.display = 'flex';
    document.querySelector('.main-content').style.visibility = 'hidden';
}

//Função de animação de página anterior
function hideLoading() {
    document.querySelector('#loading').style.display = 'none';
    document.querySelector('.main-content').style.visibility = 'visible';

}
 




