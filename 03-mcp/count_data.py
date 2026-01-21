import re
from mcp_server import fetch_web_content

def calculate_word_count():
    url = "https://datatalks.club/"
    print(f"Fetching content from: {url}")
    
    content = fetch_web_content(url)
    
    if content.startswith("Error"):
        print(f"Failed to fetch content: {content}")
        return

    # Count word "data" case-insensitively
    # Using regex to find whole words "data"
    word_to_find = "data"
    matches = re.findall(rf'\b{word_to_find}\b', content, re.IGNORECASE)
    print(content)
    count = len(matches)
    
    print(f"\nAnalysis Results:")
    print(f"URL: {url}")
    print(f"Word to find: '{word_to_find}'")
    print(f"Occurrences found: {count}")
    
    # Also show total character count for context
    print(f"Total content length: {len(content)} characters")

if __name__ == "__main__":
    calculate_word_count()
