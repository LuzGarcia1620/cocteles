document.getElementById('searchButton').addEventListener('click', fetchCocktail);

function fetchCocktail() {
    const inputElement = document.getElementById('cocktailName');
    const cocktailName = inputElement.value.trim();
    const resultDiv = document.getElementById('result');

    if (!cocktailName) {
        alert("¡Escribe el nombre de un cóctel!");
        return;
    }
    
    //esto es para buscar el coctel en la API
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`;
    resultDiv.innerHTML = '<h2>Cargando...</h2>';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                //aqui manejamos errores de red o respuestas no exitosas
                throw new Error('Respuesta del servidor no válida');
            }
            return response.json();
        })
        .then(data => {
            const cocktail = data.drinks ? data.drinks[0] : null;

            if (!cocktail) {
                resultDiv.innerHTML = `<p>No se encontró el cóctel: <strong>${cocktailName}</strong></p>`;
                return;
            }
            
            //mostrar los datos del coctel
            resultDiv.innerHTML = `
                <h2>${cocktail.strDrink}</h2>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" width="200" height="300">
                <p><strong>Categoría:</strong> ${cocktail.strCategory}</p>
                <p><strong>Instrucciones:</strong> ${cocktail.strInstructions}</p>
                <p><strong>Ingrediente 1:</strong> ${cocktail.strIngredient1}</p>
            `;
        })
        .catch(error => {
            //aqui manejamos errores de fetch o parseo
            resultDiv.innerHTML = `<p style="color: red;">Error al procesar la respuesta: ${error.message}</p>`;
        });
}
