import requests

class Jinawebdownloader:
    """A class to download webpage as markdown from Jinaweb."""
    jina_read_url = "https://r.jina.ai/"

    def __init__(self,timeout: int =10):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        })
    
    def download(self,url:str)->int:
        """ Download webpage as markdown from Jinaweb."""
        #construct the full URL for Jinaweb reader
        full_url = f"{self.jina_read_url}{url}"
        response = self.session.get(full_url,timeout = self.timeout)
        return len(response.text)
    
if __name__ == "__main__":
    #create jinawebdwnloader instance
    downloader = Jinawebdownloader()
    web_site_url ="https://github.com/alexeygrigorev/minsearch"
    print(f"Downloading content from {web_site_url}")
    print(downloader.download(web_site_url))
