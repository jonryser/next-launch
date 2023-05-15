#!/bin/bash

# Defined some useful colors for echo outputs.
# Use BLUE for informational.
BLUE="\033[1;34m"
# Use Green for a successful action.
GREEN="\033[0;32m"
# Use YELLOW for warning informational and initiating actions.
YELLOW="\033[1;33m"
# No Color (used to stop or reset a color).
NC='\033[0m'

# The project directory.
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
>&2 echo -e "${BLUE}Current project dir - ${PROJECT_DIR}${NC}"

# .env loading in the shell
DOT_ENV=.env
DOT_ENV_FILE=${PROJECT_DIR}/${DOT_ENV}
function dotenv() {
    if [ -f "${DOT_ENV_FILE}" ]
    then
        set -a
        [ -f ${DOT_ENV_FILE} ] && . ${DOT_ENV_FILE}
        set +a
        >&2 echo -e "${GREEN}* Override environment variables set from the ${DOT_ENV} file.${NC}"
        >&2 echo -e "${GREEN}* DOT_ENV_FILE set to ${DOT_ENV_FILE}${NC}"
    else
        DOT_ENV_FILE=${PROJECT_DIR}/.env-none
        >&2 echo -e "${YELLOW}Not using a ${DOT_ENV} file${NC}"
    fi
}
# Run dotenv
dotenv

# If environment variables are set, use them. If not, use the defaults.
# Only need defaults for `API_ROOT`, `DOT_ENV_FILE`, `SERVER_DOMAIN`, `SERVER_PORT`, and `SERVER_PROTOCOL` as they are used in the scripts.
# All other defaults are set in the `docker-compose.yml` file.
export API_ROOT=${API_ROOT:-/api}
export DOT_ENV_FILE=${DOT_ENV_FILE:-}
export SERVER_DOMAIN=${SERVER_DOMAIN:-localhost}
export SERVER_PORT=${SERVER_PORT:-3000}
export SERVER_PROTOCOL=${SERVER_PROTOCOL:-http}
>&2 echo -e "${GREEN}* Default environment variables set that weren't overridden in the ${DOT_ENV} file or from the command line.${NC}"
