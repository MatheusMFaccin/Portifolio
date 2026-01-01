# 1. Escolhe a imagem base do Python (leve e rápida)
FROM python:3.11-slim

# 2. Configura variáveis de ambiente para o Python não gerar arquivos .pyc e logs aparecerem na hora
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Define a pasta de trabalho dentro do container
WORKDIR /app

# 4. Instala as dependências do sistema necessárias (opcional, mas bom para prevenir erros com Postgres)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 5. Copia o requirements e instala as bibliotecas
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copia todo o resto do código para dentro do container
COPY . /app/

# 7. Roda o collectstatic para juntar o CSS (graças ao Whitenoise)
RUN python manage.py collectstatic --no-input

# 8. Expõe a porta 8000
EXPOSE 8000

# 9. Comando para rodar o servidor (SUBSTITUA 'nome_do_projeto' PELO SEU)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
