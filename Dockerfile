# Nightly image needed for Rocket v0.4.7
ARG BUILD_IMAGE=ekidd/rust-musl-builder:nightly-2021-01-01
ARG WEB_IMAGE=node:alpine
ARG RUNNER_IMAGE=scratch

FROM ${BUILD_IMAGE} AS build

RUN USER=rust:rust cargo init --name memedrop
ADD --chown=rust:rust Cargo.toml Cargo.lock ./
RUN USER=rust:rust cargo build --release

ADD --chown=rust:rust src ./src
# cargo requires touching file for recompilation
RUN USER=rust:rust touch src/main.rs
RUN USER=rust:rust cargo build --release

FROM ${WEB_IMAGE} AS web-build
RUN yarn global add postcss-cli
COPY package.json yarn.lock postcss.config.js tailwind.config.js ./
RUN yarn
ADD resources ./resources
ADD templates ./templates
RUN NODE_ENV=production postcss resources/styles.css -o resources/styles.css

FROM ${RUNNER_IMAGE}

#RUN apk --no-cache add ca-certificates
ADD Rocket.toml ./
COPY --from=build \
    /home/rust/src/target/x86_64-unknown-linux-musl/release/server \
    /usr/local/bin/
COPY --from=web-build \
    /templates \
    ./templates
COPY --from=web-build \
    /resources \
    ./resources

ENTRYPOINT [ "/usr/local/bin/server" ] 
