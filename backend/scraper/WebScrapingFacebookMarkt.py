from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from supabase import create_client, Client
import os
import time
import random
import json
import getpass
import dotenv

# Carregar variáveis de ambiente (se existir)
dotenv.load_dotenv()

# Configurações do Supabase
SUPABASE_URL = "https://ansjxhspngkttwsxnwjt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2p4aHNwbmdrdHR3c3hud2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTYxMTcsImV4cCI6MjA1ODQzMjExN30.zXShD_yUtIlz97jZDSsOVfkP3F9OcHlHL0KwoR4pvfg"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def setup_driver():
    """Configura e retorna o driver do Selenium com as opções adequadas"""
options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Comentado para facilitar a depuração
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")  # Desativa notificações
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # Mascarar automação
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    return driver

def get_credentials():
    """Obtém credenciais do Facebook de forma segura"""
    # Tenta obter do ambiente
    email = os.environ.get("FACEBOOK_EMAIL")
    password = os.environ.get("FACEBOOK_PASSWORD")
    
    # Se não existir no ambiente, solicita ao usuário
    if not email:
        email = input("Digite seu email do Facebook: ")
    
    if not password:
        password = getpass.getpass("Digite sua senha do Facebook: ")
        
    # Opcionalmente, salva em arquivo .env para uso futuro
    save = input("Salvar credenciais para uso futuro? (s/n): ").lower()
    if save == 's':
        with open(".env", "w") as f:
            f.write(f"FACEBOOK_EMAIL={email}\n")
            f.write(f"FACEBOOK_PASSWORD={password}\n")
        print("Credenciais salvas em arquivo .env")
        
    return email, password

def login_facebook(driver, email, password):
    """Realiza login no Facebook"""
    try:
        print("Acessando página de login do Facebook...")
    driver.get("https://www.facebook.com/")
        
        # Aceitar cookies se o banner aparecer
        try:
            cookie_button = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Permitir')]"))
            )
            cookie_button.click()
            print("Banner de cookies aceito")
        except:
            pass  # Se não aparecer, continua
        
        # Preenchimento de formulário com espera para elementos
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password_input = driver.find_element(By.ID, "pass")
        
        # Digitação lenta para parecer humano
        for char in email:
            email_input.send_keys(char)
            time.sleep(random.uniform(0.05, 0.1))
            
        for char in password:
            password_input.send_keys(char)
            time.sleep(random.uniform(0.05, 0.1))
        
        # Clicar no botão de login
        login_button = driver.find_element(By.NAME, "login")
        login_button.click()
        
        print("\n=== VERIFICAÇÃO DE LOGIN ===")
        print("1. Aguardando você resolver o CAPTCHA (se aparecer)")
        print("2. Após resolver o CAPTCHA e visualizar a página do Facebook")
        
        # Sempre aguardar confirmação do usuário, independente de detectar CAPTCHA
        confirma = input("\nVocê resolveu o CAPTCHA e já está logado no Facebook? (s/n): ").lower()
        
        if confirma != 's':
            print("Login interrompido pelo usuário.")
            return False
            
        print("Continuando com o script...")
        
        # Verificar se o login foi bem-sucedido
        try:
            # Método 1: Verificar URLs típicas após o login
            if "facebook.com" in driver.current_url and "login" not in driver.current_url:
                print("Login confirmado pela URL.")
                return True
                
            # Método 2: Tentar encontrar elementos que confirmem o login
            login_indicators = [
                "//div[@aria-label='Conta' or @aria-label='Account']",
                "//a[@aria-label='Página inicial' or @aria-label='Home']",
                "//div[@aria-label='Menu principal' or @aria-label='Main menu']",
                "//div[@role='banner']//div[@role='navigation']"
            ]
            
            for indicator in login_indicators:
                try:
                    if driver.find_element(By.XPATH, indicator):
                        print(f"Login confirmado! Elemento encontrado: {indicator}")
                        return True
                except:
                    continue
                    
            # Se chegou aqui, não encontrou indicadores de login
            print("Aviso: Não foi possível confirmar o login automaticamente.")
            
            # Dar uma última chance ao usuário para confirmar manualmente
            confirma_final = input("Você confirma que está logado no Facebook? (s/n): ").lower()
            if confirma_final == 's':
                print("Login confirmado manualmente pelo usuário.")
                return True
            else:
                print("Login não confirmado pelo usuário.")
                return False
                
        except Exception as e:
            print(f"Erro ao verificar status do login: {e}")
            return False
            
    except Exception as e:
        print(f"Erro durante o login: {e}")
        return False

def navigate_to_vehicles(driver, location="itajuba"):
    """Navega para a seção de veículos no Marketplace com localização específica"""
    try:
        # Link direto para o Marketplace de carros em Itajubá
        marketplace_url = "https://www.facebook.com/marketplace/112981122049206/carros/?exact=false"
        
        print(f"Navegando para veículos no Marketplace de Itajubá usando link direto...")
        driver.get(marketplace_url)
        
        print("Aguardando carregamento dos anúncios...")
    time.sleep(5)
        
        # Verificar se estamos na página correta
        if "marketplace" in driver.current_url and "carros" in driver.current_url:
            print("Página do Marketplace de carros carregada com sucesso!")
            return True
        else:
            print("Aviso: URL atual não parece ser a página de carros do Marketplace.")
            print(f"URL atual: {driver.current_url}")
            
            # Perguntar ao usuário se deseja continuar mesmo assim
            continuar = input("Deseja continuar mesmo assim? (s/n): ").lower()
            return continuar == 's'
            
    except Exception as e:
        print(f"Erro ao navegar para veículos: {e}")
        return False

def scrape_marketplace_vehicles(driver):
    """Extrai os dados de veículos do Marketplace"""
    print("Extraindo informações dos veículos...")
    
    # Rolar a página até encontrar o elemento de "resultados distantes" ou até atingir o limite
    scroll_count = 10  # Número máximo de rolagens
    found_distant_results = False
    
    for i in range(scroll_count):
        print(f"Rolando página ({i+1}/{scroll_count})...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(random.uniform(2, 3))  # Espera carregar o conteúdo
        
        # Verifica se encontrou o elemento que indica resultados distantes
        try:
            # Procura pelo elemento que indica resultados distantes
            distant_element = driver.find_elements(By.XPATH, "//span[contains(text(), 'Resultados um pouco mais distantes')]")
            
            if distant_element:
                print("Encontrado o elemento 'Resultados um pouco mais distantes'. Parando a rolagem.")
                found_distant_results = True
                break
        except Exception as e:
            print(f"Erro ao verificar elemento de resultados distantes: {e}")
            # Continua rolando mesmo se houver erro na verificação
    
    if not found_distant_results:
        print(f"Limite de {scroll_count} rolagens atingido ou elemento não encontrado.")
    
    # Analisar o HTML com BeautifulSoup
    print("Extraindo dados dos anúncios carregados...")
    soup = BeautifulSoup(driver.page_source, "html.parser")
    
    # Encontrar os anúncios com base na estrutura atualizada do Facebook
    # Seletor principal que corresponde ao contêiner do anúncio
    items = soup.select("div.x9f619.x78zum5.x1r8uery.xdt5ytf")
    
    if not items:
        # Tenta outros seletores se o primeiro não funcionar
        items = soup.select("a[href*='/marketplace/item/']")
        
    if not items:
        # Último método: pegar qualquer div que contenha uma imagem e preço
        print("Tentando método alternativo de extração...")
        items = soup.select("div:has(img):has(span:contains('R$'))")
    
    print(f"Encontrados {len(items)} potenciais anúncios para análise")
    
    # Processa cada anúncio
    results = []
    for item in items:
        try:
            # Encontra o link do anúncio (se não for já o próprio link)
            if item.name != 'a':
                link_elem = item.select_one("a[href*='/marketplace/item/']")
                if not link_elem:
                    continue  # Pula se não encontrar link (não é um anúncio)
            else:
                link_elem = item
                
            # Extrai o link completo
            link = "https://www.facebook.com" + link_elem["href"] if link_elem and "href" in link_elem.attrs else "Sem link"
            
            # Navega até o elemento raiz do anúncio se for necessário
            anuncio = link_elem
            if link_elem.select_one("div.x9f619.x78zum5.xdt5ytf.x1qughib"):
                anuncio = link_elem.select_one("div.x9f619.x78zum5.xdt5ytf.x1qughib")
                
            # Extrai preço - procura por texto que começa com R$
            price = 0.0
            price_spans = anuncio.select("span")
            for span in price_spans:
                text = span.get_text().strip()
                if text.startswith("R$"):
                    try:
                        price_text = text.replace("R$", "").replace(".", "").replace(" ", "")
                        if "," in price_text:
                            price_text = price_text.replace(",", ".")
                        price = float(price_text) if price_text.replace(".", "", 1).isdigit() else 0.0
                        break
                    except:
                        pass
            
            # Extrai nome do veículo - usando o seletor específico do estilo
            name = None
            name_spans = anuncio.select("span[style*='-webkit-box-orient: vertical']")
            if not name_spans:
                name_spans = anuncio.select("span[style*='-webkit-box-orient:vertical']")
                
            for span in name_spans:
                text = span.get_text().strip()
                if text and len(text) > 3 and not text.startswith("R$"):
                    name = text
                    break
                    
            # Se não conseguir encontrar o nome, continua para o próximo anúncio
            if not name:
                continue
                
            # Extrai imagem - melhorado para procurar mais profundamente
            image = ""
            # Primeiro tenta encontrar a imagem diretamente no anúncio
            img_elem = anuncio.select_one("img")
            
            # Se não encontrar, busca em todo o item
            if not img_elem or not img_elem.get("src"):
                img_elem = item.select_one("img")
            
            # Se ainda não encontrar, procura em toda a árvore
            if not img_elem or not img_elem.get("src"):
                # Procura especificamente pela estrutura de contêiner de imagem do Facebook
                img_container = item.select_one("div.x9f619.x78zum5.x1iyjqo2.x5yr21d.x4p5aij")
                if img_container:
                    img_elem = img_container.select_one("img")
            
            # Por último, tenta encontrar qualquer img na estrutura do anúncio
            if not img_elem or not img_elem.get("src"):
                # Busca recursiva por todas as tags de imagem
                all_imgs = item.select("img")
                for img in all_imgs:
                    if img.get("src") and "scontent" in img.get("src"):
                        img_elem = img
                        break
            
            # Extrai o URL da imagem
            if img_elem and img_elem.get("src"):
                image = img_elem["src"]
                # Verifica se é uma URL válida
                if not image.startswith("http"):
                    image = ""
            
            # Log debug da imagem
            if image:
                print(f"Imagem encontrada: {image[:60]}...")
            else:
                print(f"Não foi possível encontrar imagem para: {name}")
            
            # Extrai quilometragem e localização
            quilometragem = 0.0
            cidade = "Itajubá"
            estado = "MG"
            
            # Busca spans com texto de quilometragem ou localização
            info_spans = anuncio.select("span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6")
            if not info_spans:
                info_spans = anuncio.select("span.x193iq5w span, span.x1lliihq")
                
            for span in info_spans:
                text = span.get_text().strip().lower()
                
                # Verifica se é quilometragem
                if "km" in text:
                    try:
                        # Trata formatos como "71 mil km"
                        km_text = text.replace("km", "").strip()
                        if "mil" in km_text:
                            km_text = km_text.replace("mil", "").strip()
                            # Multiplica por 1000 se contém "mil"
                            km_parts = km_text.replace(",", ".").split()
                            if km_parts:
                                try:
                                    km_value = float(km_parts[0]) * 1000
                                    quilometragem = km_value
                                except:
                                    pass
                        else:
                            # Formato normal de quilometragem
                            km_text = ''.join(c for c in km_text if c.isdigit() or c == '.' or c == ',')
                            km_text = km_text.replace(",", ".")
                            if km_text:
                                quilometragem = float(km_text)
                    except Exception as e:
                        print(f"Erro ao extrair quilometragem: {e}")
                
                # Verifica se é localização
                elif "itajubá" in text or "itajuba" in text:
                    if "," in text:
                        partes = text.split(",")
                        cidade = partes[0].strip().title()
                        if len(partes) > 1:
                            estado = partes[1].strip().upper()
            
            # Adiciona à lista de resultados apenas se tiver nome e preço
            if name and price > 0:
                results.append({
                    "id": random.randint(1, 10**18),
            "nome": name,
            "preco": price,
                    "quilometragem": quilometragem,
                    "cidade": "Itajubá",
                    "estado": "Minas Gerais",
                    "imagem": image,
            "link": link
        })
    
                # Log para depuração
                print(f"Extraído: {name} - R${price} - {quilometragem}km - {cidade}/{estado}")
            
        except Exception as e:
            print(f"Erro ao processar anúncio: {e}")
    
    print(f"Processados com sucesso: {len(results)} anúncios")
    return results

def save_to_supabase(data):
    """Salva os dados no Supabase"""
    if not data:
        print("Nenhum dado para salvar no Supabase")
        return False
        
    try:
        # Prepara os dados respeitando os tipos corretos do esquema do Supabase
        formatted_data = []
        for item in data:
            formatted_item = item.copy()
            
            # Mantém preço como número (float8 no banco)
            # Não formata o preço, pois o banco espera um valor numérico
            
            # Apenas a quilometragem é formatada como string no formato brasileiro
            formatted_item['quilometragem'] = format_brazilian_number(item['quilometragem'])
            
            formatted_data.append(formatted_item)
            
        print(f"Inserindo {len(formatted_data)} registros no Supabase...")
        response = supabase.table("produtos").insert(formatted_data).execute()
        print("Dados inseridos com sucesso!")
        return True
    except Exception as e:
        print(f"Erro ao inserir dados no Supabase: {e}")
        print("Nota: Verifique se os tipos de dados no Supabase estão corretos: 'preco' como float8 e 'quilometragem' como varchar.")
        return False

def main():
    """Função principal do scraper"""
    # Obtém credenciais
    email, password = get_credentials()
    
    # Configura o driver
    driver = setup_driver()
    
    try:
        # Login no Facebook
        if not login_facebook(driver, email, password):
            print("Falha no login. Encerrando...")
            return
        
        # Navega para a seção de veículos
        if not navigate_to_vehicles(driver, "itajuba"):
            print("Falha ao navegar para anúncios de veículos. Encerrando...")
            return
        
        # Extrai dados
        data = scrape_marketplace_vehicles(driver)
        
        if data:
            # Mostra o total de anúncios encontrados originalmente
            original_count = len(data)
            print(f"\n=== TOTAL DE ANÚNCIOS ENCONTRADOS: {original_count} ===")
            
            # Remove os últimos 29 itens da lista
            if original_count > 29:
                data = data[:-29]
                print(f"Últimos 29 itens removidos. Restaram {len(data)} anúncios.")
            else:
                print(f"Não é possível remover 29 itens pois só foram encontrados {original_count} anúncios.")
                
            # Exibe um resumo dos dados obtidos
            print("\n=== RESUMO DOS DADOS OBTIDOS ===")
            for i, car in enumerate(data[:5], 1):  # Mostra apenas os 5 primeiros
                print(f"{i}. {car['nome']} - R${car['preco']}")
            
            if len(data) > 5:
                print(f"... e mais {len(data) - 5} anúncios")
                
            # Pergunta se quer salvar no Supabase
            save = input("\nSalvar dados no Supabase? (s/n): ").lower()
            if save == 's':
                save_to_supabase(data)
            else:
                print("Dados não foram salvos no Supabase")
                
            # Opção para salvar em arquivo local
            save_local = input("Salvar dados em arquivo local? (s/n): ").lower()
            if save_local == 's':
                # Formata os dados para o padrão brasileiro antes de salvar no JSON
                formatted_data = []
                for item in data:
                    formatted_item = item.copy()
                    # Formata o preço com ponto como separador de milhar e vírgula como decimal
                    formatted_item['preco'] = format_brazilian_number(item['preco'])
                    # Formata a quilometragem da mesma forma
                    formatted_item['quilometragem'] = format_brazilian_number(item['quilometragem'])
                    formatted_data.append(formatted_item)
                
                with open("facebook_marketplace_veiculos.json", "w", encoding="utf-8") as f:
                    json.dump(formatted_data, f, ensure_ascii=False, indent=4)
                print("Dados salvos em 'facebook_marketplace_veiculos.json'")
        else:
            print("Nenhum dado foi obtido")
            
    except Exception as e:
        print(f"Erro durante a execução: {e}")
    finally:
        # Pergunta antes de fechar
        input("\nPressione Enter para fechar o navegador...")
driver.quit()
        print("Navegador fechado. Programa finalizado.")

def format_brazilian_number(value):
    """Formata um número para o padrão brasileiro (ponto como separador de milhar, vírgula como decimal)"""
    # Converte para string e remove a parte decimal
    int_part = int(value)
    decimal_part = int((value - int_part) * 10) if value - int_part > 0 else 0
    
    # Formata a parte inteira com pontos como separadores de milhar
    formatted_int = "{:,}".format(int_part).replace(",", ".")
    
    # Retorna o número formatado com a parte decimal
    if decimal_part > 0:
        return f"{formatted_int},{decimal_part}"
    else:
        return formatted_int

if __name__ == "__main__":
    main()
