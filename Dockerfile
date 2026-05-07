FROM python:3.14-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt /app/
# RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt -i https://mirror-pypi.runflare.com/simple
COPY  ./core /app/
