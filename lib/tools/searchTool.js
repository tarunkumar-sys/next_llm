import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

/**
 * Tool for internet search
 * No API key required
 */
export const searchTool = new DuckDuckGoSearch({
  name: "internet_search",
  description: `
Use this tool when you need:
- current information
- trending topics
- news
- general web search
Input should be a search query.
`,
});