#==>Builder<==
FROM python:3.11 AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
#==>Runner<==
FROM python:3.11-slim AS runner
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=Builder /usr/local/lib/python3.11/site-packages \
                    /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin/gunicorn \
                    /usr/local/bin/gunicorn
#copy from host
COPY app.py .
COPY templates/ templates/

ENV MYSQL_HOST=localhost
ENV MYSQL_DB=appdb

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "app:app"]
