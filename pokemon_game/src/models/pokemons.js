const pokemonsModel = {
    getAll: 'SELECT * FROM pokemons',
    getById: 'SELECT * FROM pokemons WHERE id = ?',
    getExisting: 'SELECT * FROM pokemons WHERE name = ? OR image = ?',
    addPokemon: 'INSERT INTO pokemons (name, image) VALUES (?, ?)',
    editPokemon: 'UPDATE pokemons SET name = COALESCE(?, name), image = COALESCE(?, image) WHERE id = ?',
    pokemonvalid: 'SELECT * FROM pokemons WHERE (name = ? OR image = ?) AND id != ?',
    eliminarPokemon: 'DELETE FROM pokemons WHERE id = ?',
    get3Random:'SELECT * FROM pokemons ORDER BY RAND() LIMIT 3',

}

module.exports = pokemonsModel;