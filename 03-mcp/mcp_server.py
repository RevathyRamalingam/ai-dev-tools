import requests
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

def fetch_web_content(url: str) -> str:
    """
    Fetch content of any web page as markdown using Jina Reader.
    
    Args:
        url: The URL of the web page to fetch.
    """
    jina_url = f"https://r.jina.ai/{url}"
    try:
        response = requests.get(jina_url, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        return f"Error fetching content: {str(e)}"

@mcp.tool(name="fetch_web_content")
def fetch_web_content_tool(url: str) -> str:
    """Fetch content of any web page as markdown using Jina Reader."""
    return fetch_web_content(url)


if __name__ == "__main__":
    mcp.run()
