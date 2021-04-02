# micro-frontend-K8s

A kubernetes implementation of this microfronts example: https://github.com/richgo/micro-frontend-basic.  Using NextJs zones and federated Apollo GraphQL

## Architcture

The application we are building is comprised of a Nexts Js app, 2x Next Js zone apps, an Apollo Gateway and 4x Apollo servers (federated). It looks like this:

![image](https://user-images.githubusercontent.com/11230812/113388708-a2bb0b80-9386-11eb-9c50-38e493f7e508.png)

The principles of this architecture are to be decoupled both horizontally and vertically, enabling teams to align around product areas whilst maintaining consistency.

## Pre-reqs

1. K8s running under Docker desktop https://www.docker.com/products/docker-desktop
2. Helm 3 https://helm.sh/docs/intro/install/
3. Ingress https://kubernetes.github.io/ingress-nginx/deploy/
4. Google Skaffold ( > 1.18 for module support) https://skaffold.dev/docs/install/
5. DNS (dnsmasq or hosts file will work)  127.0.0.1  w.fakefurniture.local graph.fakefurniture.local p.fakefurniture.local a.fakefurtniture.local
6. Node https://nodejs.org/en/download/

## Build & Deploy

```sh
skaffold dev
```

That's it! Docker Builkit will now build 8 containers, Helm will deploy them and Skaffold will watch for file changes and give you hot-reloading (build/deploy) whenever you change code.

## Test

You should now see a rather rubbish looking website here:

http://w.fakefurniture.local

and graph QL playground here:

http://graph.fakefurniture.local

individual next zone apps can be found here:

http://p.fakefurniture.local
http://a.fakefurtniture.local



