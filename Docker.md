## Build

```bash
npm run build
npm run preview
```

## Docker build for UAT / production

If you are on Apple Silicon, build the image for `linux/amd64` so it can run on x86 UAT infrastructure:

```bash
# MacOS Command build and push
docker build --platform linux/amd64 -t apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.1 .
docker push apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.1
```

If you are on a non-Apple Silicon machine or already targeting x86 UAT infrastructure, use:

```bash
# Windows Command build and push
docker build -t apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.1 .
docker push apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.1
```

In Rancher, publish the container port `80` and optionally expose it externally on `7195` via NodePort or service port mapping.

```bash
docker run --platform linux/amd64 -p 7195:80 apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.1
```

If your Rancher workload uses `NodePort`, set the container port to `80` and the listening port to `7195`.

> `exec format error` usually means the image CPU architecture does not match the target host platform. Build with `--platform linux/amd64` from Apple Silicon machines.
