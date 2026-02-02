import { Tool } from "@langchain/core/tools";

/**
 * Pokémon tool
 * Fetches Pokémon info by name
 */
export class PokemonTool extends Tool {
  name = "get_pokemon";
  description = `
Use this tool to get Pokémon information.
Input should be a Pokémon name.
`;

  async _call(pokemonName) {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
    );

    if (!res.ok) {
      return "Pokémon not found.";
    }

    const data = await res.json();

    return `
Name: ${data.name}
Height: ${data.height}
Weight: ${data.weight}
Base experience: ${data.base_experience}
`;
  }
}
