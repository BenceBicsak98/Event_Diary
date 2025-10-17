# ----------------------------
# Python + Oracle Instant Client Dockerfile
# ----------------------------
    FROM python:3.11

    # Proxy beállítás (ha kell)
    ARG HTTP_PROXY
    ARG HTTPS_PROXY
    ENV http_proxy=http://frissit:frissit@172.20.10.6:3128
    ENV https_proxy=http://frissit:frissit@172.20.10.6:3128
    
    # Munkakönyvtár
    WORKDIR /app
    
    # Követelmények telepítése
    COPY requirements.txt .
    RUN pip install --upgrade pip --proxy http://frissit:frissit@172.20.10.6:3128
    RUN pip install --no-cache-dir -r requirements.txt --proxy http://frissit:frissit@172.20.10.6:3128
    
    # Szükséges rendszercsomagok telepítése
    # RUN apt-get update && \
    #     apt-get install -y libaio1t64 && \
    #     rm -rf /var/lib/apt/lists/*
    RUN apt-get update && \
    apt-get install -y libaio1t64 && \
    ln -s /usr/lib/x86_64-linux-gnu/libaio.so.1t64 /usr/lib/x86_64-linux-gnu/libaio.so.1 && \
    rm -rf /var/lib/apt/lists/*
    
    # Oracle Instant Client másolása
    COPY ../instantclient_11_2 /opt/oracle/instantclient
    ENV LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
    RUN ln -s /opt/oracle/instantclient/libclntsh.so.11.1 /opt/oracle/instantclient/libclntsh.so
    
    # App forrás bemásolása
    COPY . .
    
    # Uvicorn indítása
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
    