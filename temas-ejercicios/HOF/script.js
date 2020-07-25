
const URL = 'https://pokeapi.co/api/v2';

const fetchResource = (resource, id) => fetch(`${URL}/${resource}/${id}`)
  .then(res => res.json()).then(json => console.log(json));

fetchResource('pokemon', 1);

const fetchPokemon = id => fetchResource('pokemon', id);

fetchPokemon(1);

const fetcher = reource => id => fetchResource(reource, id);

const fetchPokemonType = fetcher('pokemon');
fetchPokemonType(2);
