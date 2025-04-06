import json
from supabase import create_client, Client
import random

# Configurações do Supabase
SUPABASE_URL = "https://ansjxhspngkttwsxnwjt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2p4aHNwbmdrdHR3c3hud2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTYxMTcsImV4cCI6MjA1ODQzMjExN30.zXShD_yUtIlz97jZDSsOVfkP3F9OcHlHL0KwoR4pvfg"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def manual_entry():
    print("\n=== ENTRADA MANUAL DE VEÍCULOS ===\n")
    data = []
    
    while True:
        print("\nAdicionar novo veículo (ou digite 'sair' para finalizar):")
        name = input("Nome do veículo: ")
        
        if name.lower() == 'sair':
            break
            
        try:
            price = float(input("Preço (apenas números): "))
            mileage = float(input("Quilometragem (apenas números): "))
            city = input("Cidade: ") or "Itajubá"
            state = input("Estado: ") or "MG"
            image = input("URL da imagem: ")
            link = input("Link do anúncio: ")
            
            data.append({
                "id": random.randint(1, 10**18),
                "nome": name,
                "preco": price,
                "quilometragem": mileage,
                "cidade": city,
                "estado": state,
                "imagem": image,
                "link": link
            })
            
            print("Veículo adicionado com sucesso!")
        except ValueError:
            print("Erro: Certifique-se de inserir valores numéricos para preço e quilometragem.")
    
    return data

# Função principal
def main():
    print("Como não foi possível obter os dados automaticamente, use este programa para entrada manual.")
    
    data = manual_entry()
    
    if data:
        # Insere no Supabase
        response = supabase.table("produtos").insert(data).execute()
        print(f"\nDados inseridos com sucesso: {len(data)} registros")
    else:
        print("\nNenhum dado foi inserido.")

if __name__ == "__main__":
    main()