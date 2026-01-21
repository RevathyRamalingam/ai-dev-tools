import requests
import os
import zipfile
import io
import minsearch

class Search:
    def __init__(self, zip_url="https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"):
        self.zip_url = zip_url
        self.zip_filename = "main.zip"
        self.docs = []
        self.index = None

    def download_docs(self):
        """Downloads the zip file from the specified URL."""
        if os.path.exists(self.zip_filename):
            print(f"{self.zip_filename} already exists. Skipping download.")
            return self.zip_filename
            
        print(f"Downloading {self.zip_url}...")
        response = requests.get(self.zip_url)
        if response.status_code == 200:
            with open(self.zip_filename, 'wb') as f:
                f.write(response.content)
            print(f"Successfully downloaded to {self.zip_filename}")
            return self.zip_filename
        else:
            print(f"Failed to download. Status code: {response.status_code}")
            return None

    def load_docs(self):
        """Extracts and reads .md and .mdx files from the zip."""
        if not os.path.exists(self.zip_filename):
            print("Zip file not found. Please download first.")
            return []

        print(f"Extracting files from {self.zip_filename}...")
        self.docs = []
        with zipfile.ZipFile(self.zip_filename, 'r') as z:
            for file_info in z.infolist():
                if file_info.filename.endswith(('.md', '.mdx')):
                    # Remove 'fastmcp-main/' prefix
                    clean_filename = file_info.filename.replace('fastmcp-main/', '', 1)
                    
                    with z.open(file_info) as f:
                        content = f.read().decode('utf-8', errors='ignore')
                        self.docs.append({
                            'filename': clean_filename,
                            'content': content
                        })
        
        print(f"Loaded {len(self.docs)} documentation files.")
        return self.docs

    def index_docs(self):
        """Index the loaded documentation using minsearch."""
        if not self.docs:
            print("No documents loaded. Please load documents first.")
            return
        
        print("Indexing documents...")
        self.index = minsearch.Index(
            text_fields=["content"],
            keyword_fields=["filename"]
        )
        self.index.fit(self.docs)
        print("Indexing complete.")

    def search(self, query, num_results=5):
        """Search the documentation index."""
        if not self.index:
            print("Index not initialized. Indexing now...")
            self.index_docs()
        
        print(f"Searching for: '{query}'")
        return self.index.search(
            query=query,
            num_results=num_results
        )

if __name__ == "__main__":
    search_engine = Search()
    search_engine.download_docs()
    search_engine.load_docs()
    search_engine.index_docs()
    
    # Test search
    query = "demo"
    results = search_engine.search(query)
    
    print(f"\nSearch results for '{query}':")
    for i, res in enumerate(results, 1):
        print(f"{i}. {res['filename']}")
        # print(f"   Preview: {res['content'][:100]}...")
