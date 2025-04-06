from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from supabase import create_client, Client
import random
import time

# Configurações do Supabase
SUPABASE_URL = ""
SUPABASE_KEY = ""
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuração do Selenium
driver = webdriver.Chrome()  # Certifique-se de ter o ChromeDriver instalado e configurado

def scrape_olx_selenium(url):
    driver.get(url)
    time.sleep(5)  # Aguarda o carregamento da página

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    products = soup.find_all('section', {'data-ds-component': 'DS-AdCard'})

    data = []
    for product in products:
        # Nome do produto
        name_tag = product.find('h2', {'class': 'olx-text--title-small'})
        name = name_tag.text.strip() if name_tag else "Nome não encontrado"

        # Preço do produto
        price_tag = product.find('h3', {'class': 'olx-text--body-large'})
        price = price_tag.text.strip().replace('R$', '').replace('.', '').replace(',', '.').strip() if price_tag else "0"
        price = float(price) if price.replace('.', '', 1).isdigit() else 0.0

        # Quilometragem
        mileage_tag = product.find('li', {'class': 'olx-ad-card__labels-item'})
        mileage = mileage_tag.text.strip().replace('km', '').replace('.', '').strip() if mileage_tag else "0"
        mileage = float(mileage) if mileage.isdigit() else 0.0
        mileage_formatted = f"{int(mileage):,}".replace(",", ".")  # Formata a quilometragem com separador de milhar

        # Imagem do produto
        image_tag = product.find('img')
        image = image_tag['src'] if image_tag else "Imagem não encontrada"

        # Link do anúncio (não será enviado ao Supabase)
        link_tag = product.find('a', {'class': 'olx-ad-card__link-wrapper'})
        link = link_tag['href'] if link_tag else "Link não encontrado"

        data.append({
            "id": random.randint(1, 10**18),  # Gera um número inteiro aleatório
            "nome": name,
            "cidade": "Itajubá",
            "estado": "Minas Gerais",
            "preco": price,
            "quilometragem": mileage_formatted,  # Usa a quilometragem formatada
            "imagem": image,
            "link": link 
        })
    return data

# Inserindo os dados no banco de dados Supabase
page = 1
while True:
    print(f"Scraping página {page}...")
    url = f"https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/estado-mg/regiao-de-pocos-de-caldas-e-varginha/itajuba?o={page}"
    #url = f"https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios?o={page}"
    #https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/estado-mg/regiao-de-pocos-de-caldas-e-varginha/itajuba?o=2
    print(f"URL gerada: {url}")
    data = scrape_olx_selenium(url)

    # Imprime os dados
    print(data)

    if not data:  # Para o loop se não houver mais produtos
        print("Não há mais produtos para varrer. Finalizando...")
        break

    # Insere os dados no Supabase
    response = supabase.table("produtos").insert(data).execute()

    # Adiciona um atraso de 10 segundos entre as requisições de páginas
    time.sleep(10)

    page += 1

# Fecha o navegador após o scraping
driver.quit()
