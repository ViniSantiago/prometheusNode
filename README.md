# HOBB API - Version 0.0.1

# Run:
$ docker-compose up -d --build

# API: 
   *  Headers: Content-Type=application/json
/api/v0/user/signup/     - PUT (name, email, cellphone)
/api/v0/user/getme/      - POST (userid)
/api/v0/user/deletebyid/ - DELETE (userid)
/api/v0/user/listall/    - GET 

# Build:
- docker build -t registry.io.bb.com.br:3389/hobb/api:0.0.1 -t registry.io.bb.com.br:3389/hobb/api:latest .
- docker push registry.io.bb.com.br:3389/hobb/api:0.0.1
- docker push registry.io.bb.com.br:3389/hobb/api:latest

# Local Grafana
http://localhost:3000/

# HOBB App
http://localhost:3443

# HOBB Metrics
http://localhost:3443/metrics/

# Local Swagger UI
http://localhost:8009/

# Local Mongo Express
http://localhost:8081/

# Local Node Exporter
http://localhost:9100/

# Local Mongo Exporter
http://localhost:9001/

# Local Prhometheus
http://localhost:9090/

# Mongo DB
http://localhost:27017/