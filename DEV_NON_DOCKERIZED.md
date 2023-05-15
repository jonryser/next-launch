# Non-Dockerized Development

Ensure [DEVELOPMENT.md](./DEVELOPMENT.md) has been read, understood, and followed

## Start Script

Use the provided [start.sh](./start.sh) bash script

``` bash
source ./start.sh
```

This will start the app at [http://localhost:3000](http://localhost:3000) - the protocol, domain, and port can all be all be changed with environment variables.

### Flags

A number of flags may be passed to the start script to trigger different behaviors.

The `--install` or `-i` flag can be passed to have the script update/install dependencies before the app is started.

``` bash
source ./start.sh --install
```

The `--migrate` or `-m` flag can be passed to have the script run dev migrations before the app is started.

``` bash
source ./start.sh --migrate
```

The `--migrate` or `-m` flag can be passed to have the script run dev migrations before the app is started.

``` bash
source ./start.sh --migrate
```

The `--no_auto_start` or `-n` flag can be passed to have the script execute behaviors for any other flags but not start the app.

``` bash
source ./start.sh --no_auto_start
```

The `--reset_env` or `-r` flag can be passed to have the script reset the environment variables  from the `.env` file before the app is started.

``` bash
source ./start.sh --reset_env
```

### Examples

Reset environment variables, install dependencies, and run migrations but do not start the app:

``` bash
source ./start.sh -r -i -m -n
```

Reset environment variables and start the app:

``` bash
source ./start.sh -r
```
