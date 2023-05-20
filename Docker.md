### Run Docker

docker build -t nuxt-node-rest .

docker compose -f docker-compose.yml up -d

docker run -it --rm --name nuxt-rest -v `pwd`:/opt/app -d -p 3000:3000 nuxt-node-rest
