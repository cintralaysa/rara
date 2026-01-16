"""
Script para recortar as imagens do portfolio
Coloque as 3 imagens originais nesta pasta com os nomes:
- foto1.jpg (ou .png)
- foto2.jpg (ou .png)
- foto3.jpg (ou .png)

Depois execute: python recortar-imagens.py
"""

from PIL import Image
import os

# Diretório de saída
output_dir = "../public/images/portfolio"
os.makedirs(output_dir, exist_ok=True)

# Definição de quais quadrantes usar
# (arquivo_origem, quadrante, nome_saida)
# Quadrantes: 'tl' = top-left, 'tr' = top-right, 'bl' = bottom-left, 'br' = bottom-right
recortes = [
    ("foto1", "tl", "fones-cidade.jpg"),      # Mulher com fones olhando cidade
    ("foto1", "tr", "bebe-fogos.jpg"),         # Sapatinhos de bebê com fogos
    ("foto1", "bl", "casal-carro.jpg"),        # Pés do casal no carro
    ("foto1", "br", "aniversario-bolo.jpg"),   # Criança com bolo aniversário
    ("foto2", "bl", "cafe-cama.jpg"),          # Café da manhã na cama
    ("foto2", "br", "maos-alianca.jpg"),       # Mãos com aliança e flores
]

def encontrar_imagem(nome_base):
    """Procura a imagem com diferentes extensões"""
    for ext in ['.jpg', '.jpeg', '.png', '.webp']:
        caminho = nome_base + ext
        if os.path.exists(caminho):
            return caminho
    return None

def recortar_quadrante(imagem, quadrante):
    """Recorta um quadrante da imagem"""
    largura, altura = imagem.size
    meio_x = largura // 2
    meio_y = altura // 2

    quadrantes = {
        'tl': (0, 0, meio_x, meio_y),           # Top-left
        'tr': (meio_x, 0, largura, meio_y),     # Top-right
        'bl': (0, meio_y, meio_x, altura),      # Bottom-left
        'br': (meio_x, meio_y, largura, altura) # Bottom-right
    }

    return imagem.crop(quadrantes[quadrante])

def main():
    print("=" * 50)
    print("Recortando imagens do portfolio...")
    print("=" * 50)

    sucesso = 0
    erros = 0

    for origem, quadrante, saida in recortes:
        caminho_origem = encontrar_imagem(origem)

        if not caminho_origem:
            print(f"[ERRO] Imagem não encontrada: {origem}.*")
            erros += 1
            continue

        try:
            img = Image.open(caminho_origem)
            img_recortada = recortar_quadrante(img, quadrante)

            # Redimensionar para tamanho otimizado (600x600)
            img_recortada = img_recortada.resize((600, 600), Image.Resampling.LANCZOS)

            # Converter para RGB se necessário (para salvar como JPG)
            if img_recortada.mode in ('RGBA', 'P'):
                img_recortada = img_recortada.convert('RGB')

            caminho_saida = os.path.join(output_dir, saida)
            img_recortada.save(caminho_saida, 'JPEG', quality=85)

            print(f"[OK] {origem} ({quadrante}) -> {saida}")
            sucesso += 1

        except Exception as e:
            print(f"[ERRO] Falha ao processar {origem}: {e}")
            erros += 1

    print("=" * 50)
    print(f"Concluído! {sucesso} imagens salvas, {erros} erros")
    print(f"Imagens salvas em: {os.path.abspath(output_dir)}")
    print("=" * 50)

if __name__ == "__main__":
    main()
