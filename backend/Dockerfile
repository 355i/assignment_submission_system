FROM python:3.10-slim

# 安装 git 和其他依赖
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

# 复制 requirements.txt 并安装依赖
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 安装 whisper（git clone方式）
RUN pip install --no-cache-dir git+https://github.com/openai/whisper.git
RUN python -m nltk.downloader punkt stopwords wordnet

# 复制应用代码等后续步骤
COPY . .

EXPOSE 5555
CMD ["python3", "app.py"]
