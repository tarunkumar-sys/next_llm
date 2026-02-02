import { searchTool } from "./searchTool";
import { WeatherTool } from "./weatherTool";
import { PokemonTool } from "./pokemonTool";

/**
 * All tools available to the agent
 */
export const tools = [
  searchTool,
  new WeatherTool(),
  new PokemonTool(),
];
