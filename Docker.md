## Build

bash
npm run build
npm run preview

## Docker build for UAT / production

bash

# MacOS Command build and push

docker build --platform linux/amd64 -t apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.3 .
docker push apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.3

bash DEV

# Windows Command build and push

docker build -t apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.7 .
docker push apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.7

bash PROD

# Windows Command build and push

docker build -t apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.8.1 .

docker push apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.8.1

bash
docker run --platform linux/amd64 -p 7195:80 apb.registry-img.com/app-uat/msp-register-kyc-ui:v1.0.4