from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from supabase import create_client, Client
import random
import time

# Configurações do Supabase
SUPABASE_URL = "https://ansjxhspngkttwsxnwjt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2p4aHNwbmdrdHR3c3hud2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTYxMTcsImV4cCI6MjA1ODQzMjExN30.zXShD_yUtIlz97jZDSsOVfkP3F9OcHlHL0KwoR4pvfg"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuração do Selenium
driver = webdriver.Chrome()  # Certifique-se de ter o ChromeDriver instalado e configurado

def scrape_mercadolivre_selenium(url):
    driver.get(url)
    time.sleep(5)  # Aguarda o carregamento da página

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    products = soup.find_all('li', {'class': 'ui-search-layout__item'})

    data = []
    for product in products:
        # Nome do produto
        name_tag = product.find('a', {'class': 'poly-component__title'})
        name = name_tag.text.strip() if name_tag else "Nome não encontrado"

        # Link do anúncio
        link = name_tag['href'] if name_tag and 'href' in name_tag.attrs else "Link não encontrado"

        # Preço do produto
        price_tag = product.find('span', {'class': 'andes-money-amount__fraction'})
        price = price_tag.text.strip().replace('.', '').replace(',', '.') if price_tag else "0"
        price = float(price) if price.replace('.', '', 1).isdigit() else 0.0

        # Ano e quilometragem
        attributes_list = product.find('ul', {'class': 'poly-attributes-list'})
        if attributes_list:
            attributes = attributes_list.find_all('li', {'class': 'poly-attributes-list__item'})
            year = attributes[0].text.strip() if len(attributes) > 0 else "0"
            year = int(year) if year.isdigit() else 0
            mileage = attributes[1].text.strip().replace('Km', '').replace('.', '').strip() if len(attributes) > 1 else "0"
            mileage = float(mileage) if mileage.isdigit() else 0.0
            mileage_formatted = f"{int(mileage):,}".replace(",", ".")  # Formata a quilometragem com separador de milhar
        else:
            year = 0
            mileage_formatted = "0"

        # Cidade e estado
        location_tag = product.find('span', {'class': 'poly-component__location'})
        if location_tag:
            location = location_tag.text.strip()
            if " - " in location:
                city, state = location.split(" - ", 1)
            else:
                city, state = location, "Estado não encontrado"
        else:
            city, state = "Cidade não encontrada", "Estado não encontrado"

        # Imagem do produto
        image_tag = product.find('img', {'class': 'poly-component__picture poly-component__picture--contain'})
        if image_tag:
            print("Imagem encontrada:", image_tag)
            # Tenta capturar o link da imagem nos atributos 'src' ou 'data-src'
            image = image_tag.get('src') or image_tag.get('data-src') or "Imagem não encontrada"
            # Ignora placeholders
            if image.startswith("data:image"):
                print("Placeholder detectado:", image)
                image = "Imagem não encontrada"
            else:
                print("Imagem capturada:", image)
        else:
            print("Nenhuma imagem encontrada para este produto.")
            image = "Imagem não encontrada"

        data.append({
            "id": random.randint(1, 10**18),  # Gera um número inteiro aleatório
            "nome": name,
            "preco": price,
            "ano": year,
            "quilometragem": mileage_formatted,  # Usa a quilometragem formatada
            "cidade": "Itajubá",                   #city,
            "estado": "Minas Gerais",              #state,
            "imagem": image,
            "link": link  # Adiciona o link do anúncio
        })
    return data

# Inserindo os dados no banco de dados Supabase
page = 1
while True:
    print(f"Scraping página {page}...")
    #url = f'https://lista.mercadolivre.com.br/veiculos/carros-caminhonetes/_Desde_{(page-1)*50}_NoIndex_True'
    #https://lista.mercadolivre.com.br/veiculos/carros-caminhonetes-em-itajuba-minas-gerais/_Desde_49_NoIndex_True
    url = f'https://lista.mercadolivre.com.br/veiculos/carros-caminhonetes-em-itajuba-minas-gerais/_Desde_{(page-1)*50}_NoIndex_True'
    print(f"URL gerada: {url}")
    data = scrape_mercadolivre_selenium(url)

    # Imprime os dados
    print(data)

    if not data:  # Para o loop se não houver mais produtos
        print("Não há mais produtos para varrer. Finalizando...")
        break

    # Insere os dados no Supabase
    response = supabase.table("produtos").insert(data).execute()

    # Adiciona um atraso de 5 segundos entre as requisições de páginas
    time.sleep(5)

    page += 1

# Fecha o navegador após o scraping
driver.quit()
