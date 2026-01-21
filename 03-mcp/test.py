from mcp_server import fetch_web_content

def test_downloader():
    url = "https://github.com/alexeygrigorev/minsearch"
    print(f"Testing fetch_web_content with: {url}")
    
    content = fetch_web_content(url)
    
    if content.startswith("Error"):
        print(f"Test failed: {content}")
    else:
        print(f"Successfully retrieved content!")
        print(f"Number of characters returned: {len(content)}")
        # Print a small snippet to verify markdown
        print("\nContent Preview (first 200 chars):")
        print(content[:200])

def test_search():
    print("Testing search function with: 'minsearch'")

if __name__ == "__main__":
    #test_downloader()
    test_search()

