# Dockerized Development

Ensure [DEVELOPMENT.md](./DEVELOPMENT.md) has been read, understood, and followed

## Start Script

Use the provided [start.sh](./start.sh) bash script

``` bash
source ./start.sh --docker
```

This will start the app in a docker container at [http://localhost:3000](http://localhost:3000) - the protocol, domain, and port can all be all be changed with environment variables.

### Flags

A number of flags may be passed to the start script to trigger different behaviors.

The `--docker` or `-d` flag can be passed to have the script build and start the app in a docker container. This indicate thats this is a `dockerized` start.

``` bash
source ./start.sh --docker
```

The `--build` or `-b` flag can be passed to have the script rebuild the docker container. This will also indicate that this is a `dockerized` start; no need for the `-d` docker flag.

``` bash
source ./start.sh --build
```

The `--prune` or `-p` flag can be passed to have the script prune all unused containers, networks, and images (both dangling and unreferenced). This can be useful to free up disk space. Please note that cached images will be removed as well.

``` bash
source ./start.sh --prune -d
```

The `--no_auto_start` or `-n` flag can be passed to have the script execute behaviors for any other flags but not start the app.

``` bash
source ./start.sh --no_auto_start -d
```

The `--reset_env` or `-r` flag can be passed to have the script reset the environment variables  from the `.env` file before the app is started.

``` bash
source ./start.sh --reset_env -d
```

### Examples

Reset environment variables, prune images, and rebuild the containers but do not start the app:

``` bash
source ./start.sh -r -p -b -n
```

Reset environment variables and start the app dockerized:

``` bash
source ./start.sh -r -d
```

## Localhost

For the docker container to connect to `localhost` on the host machine, use `host.docker.internal`.

To connect to the local dockerized PostgreSQL DB, ensure there is a `.env` file ([`.env.template`](./.env.template) can be used as a reference.) In the `.env` file, ensure the `DB_HOST` variable has `localhost` replaced with `host.docker.internal`.

``` .env
DB_HOST="host.docker.internal"
```

### Linux ONLY

If you are running on a Linux operating system the default connection to the docker container `host.docker.internal` will not work. To connect to the local dockerized PostgreSQL DB, ensure there is a `.env` file ([`.env.template`](./.env.template) can be used as a reference.) In the `.env` file, ensure the `DB_HOST` variable has `localhost` replaced with `172.17.0.1`.

``` .env
DB_HOST="172.17.0.1"
```
