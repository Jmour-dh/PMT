# Project Management Tool

PMT est une plateforme de gestion de projet collaboratif destinée aux équipes de développement logiciel. L'objectif est de créer une application qui permettra aux équipes de planifier, suivre et collaborer sur des projets de manière efficace.

## Phase de conception 
Schéma de la base de donnée

<img src="./screenshot\diagramme de classe.png" alt="diagramme de classe" >

## Préréquis

- [Utiliser un éditeur de code](https://www.oracle.com/java/technologies/downloads/)
- [Connaissance en JAVA, SpringBoot](https://docs.spring.io/spring-framework/reference/index.html)
- [Connaissance en de Git et Github](https://docs.github.com/fr)
- [Connaissance en docker](https://docs.docker.com/)

## Environment Variables

- J'ai utilisé VS Code comme éditeur de code pour ce projet. Le projet est développé avec springboot maven et angular, pour cela, vous devez configurer votre environnement de développement.
- Pour configurer votre environnement de développement, vous devez installer les outils suivants:

`Java 17.0.12 ou supérieur` 
`Maven 3.9.9  ou supérieur`
`Node.js 22.12.0 ou supérieur`
`Angular CLI 19.2.0 ou supérieur`
`MySQL 8.0.21 ou supérieur`
`Docker 28.1.1 ou supérieur`
`Docker compose 2.35.1 ou supérieur`

## Installation

1. Télécharger le  [JDK 8 ou 11](https://www.oracle.com/java/technologies/downloads/) et suivre les insctructions d'installation
- Verifiez l'installation avec la commande:

```bash
    java -version
```
2. Télécharger [Maven](https://maven.apache.org/install.html)  et suivre les insctructions d'installation
- Verifiez l'installation avec la commande:

```bash
    mvn --version
```
3. Télécharger Node.js et suivre les insctructions d'installation
- Verifiez l'installation avec la commande:

```bash
    node -v ou node --version
```
4. Installer [Angular](https://angular.dev/installation) avec la ligne de commande suivante:
- Verifiez l'installation avec la commande:

```bash
    npm install -g @angular/cli@19.2.0
    ng --version
```
5. Télécharger [MySQL installer](https://dev.mysql.com/downloads/installe/)  et suivre les insctructions d'installation où bien [Dbeaver 25.0.5](https://dbeaver.io/download/)

6. Installer Docker Desktop

```bash
   wsl --install
```

* Téléchargez Docker Desktop pour Windows depuis https://www.docker.com/products/docker-desktop/

* Double-cliquez sur le fichier .exe téléchargé pour lancer l'installation

* Suivez les instructions de l'assistant d'installation

* Redémarrez votre ordinateur si demandé


## Lancement du projet en local
### Lancement du backend

1. Après avoir installé Dbeaver, crée un serveur sur le port 3306 comme 
        sur l'image suivante :
<img src="./screenshot\step_1.png" alt="Step_1" >


Veillez à bien remplir ces champs:

* Hostname : localhost
* Username : root
* Password : root

Après avoir configuré la connection,clique sur le bouton Test de connection :
<img src="./screenshot\step_2.png" alt="Step_2" >

Une fois accedez à la connection, vous accedez à la page vous permettant de faire des requettes SQL.

La requette suivante permet de créer une nouvelle base des données.

```bash
    CREATE DATABASE pmt_db
```

Après l'exécution de la requette SQL, on observe l'apparition de la base des données "donnees" suite à sa création comme sur l'image suivante :
<img src="./screenshot\step_3.png" alt="Step_3" >

2. Naviguez dans le dossier resources, copiez le code du fichier script.sql comme indiqué sur l'image, 
<img src="./screenshot\step_14.png" alt="Step_14" >

3. Exécutez-le dans DBeaver

4. Créer un répertoire sur le bureau et ouvrez ce répertoire dans VS Code. Cloner le projet avec la commande

```bash
    git clone https://github.com/Jmour-dh/PMT.git
```

5. Naviguez dans le dossier ressouces Backend_PMT
6. Ouvrez un nouveau Terminal à la racine du projet puis naviguez vers le dossier Backend_PMT, et lancez le script suivant:


```bash
   mvn spring-boot:run  
```

Le backend va se lancer sur http://localhost:8080



## Reference API

Pour documenter notre API REST, nous avons utilisé Swagger UI (OpenAPI), qui permet :

Une documentation interactive et automatique des endpoints

* La visualisation des modèles de données (DTOs)

* La possibilité de tester directement les requêtes depuis l'interface

* L'interface Swagger est accessible à cette URL lorsque l'application est en marche :
http://localhost:8080/swagger-ui.html

Pour tester les routes sécurisées par JWT Token, voici la procédure à suivre :

1. Authentification :

Effectuez d'abord une requête de login (POST /api/auth/login) pour obtenir votre token JWT
<img src="./screenshot\step_4.png" alt="Step_4" >

2. Utilisation du Token :

Ajoutez le token reçu dans l'en-tête Authorization de vos requêtes suivantes :
<table>
  <tr>
    <td><img src="./screenshot/step_5.png" alt="Step 5" width="100%"></td>
    <td><img src="./screenshot/step_6.png" alt="Step 6" width="100%"></td>
  </tr>
</table>

Résultat d'une URL sécurisée
<img src="./screenshot\step_7.png" alt="Step_7" >

## Test backend
1. Ouvrez un nouveau Terminal à la racine du projet puis naviguez vers le dossier Backend_PMT, et lancez le script suivant :

```bash
   mvn clean verify -Dtest="IntegrationTestSuite,AuthControllerTest,UserControllerTest,TaskHistoryControllerTest,TaskControllerTest,ProjectControllerTest,ProjectMemberControllerTest"
```

2. Pour voir le résultat, naviguez dans le dossier target comme indiqué sur l'image.
<img src="./screenshot\step_8.png" alt="Step_8" >

3. Voici le lien 
http://localhost:63342/Backend_PMT/target/site/jacoco/index.html?_ijt=3sc916tjg9l329jhb34otj227u&_ij_reload=RELOAD_ON_SAVE

<img src="./screenshot\step_9.png" alt="Step_9" >

## Lancement du frontend

1. Naviguer vers le dossier Frontend_PMT, dans le terminal, puis lancer le script suivant:

```bash
    npm install
```

2. Lancer le server

```bash
    ng serve
```

3. Ouvrez un navigateur et naviguer vers : http://localhost:4200, pour acceder au frontend.


### Test frontend

1. Ouvrez un nouveau Terminal et lancez le script suivant :

```bash
    ng test --code-coverage
```

Résultat: 

<img src="./screenshot\step_10.png" alt="Step_10" >

2. Naviguer vers le dossier couvergae et suivre l'image suivante :

<img src="./screenshot\step_11.png" alt="Step_11" >

3. Résultat du couverture de code 

<img src="./screenshot\step_12.png" alt="Step_12" >

## Lancement docker compose
Naviguer dans le racine du projet pmt

1. Lancer docker desktop 

2. Ouvrez un nouveau Terminal et lancez le script suivant : 

```bash
   docker-compose up --build
```

3. Voila la résultat de lancement du coker compose : 
<img src="./screenshot\step_13.png" alt="Step_13" >

## Queleque interface du projet
<img src="./screenshot\step_15.png" alt="Step_15" >



