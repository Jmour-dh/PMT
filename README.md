# Project Management Tool

PMT est une plateforme de gestion de projet collaboratif destinée aux équipes de développement logiciel. L'objectif est de créer une application qui permettra aux équipes de planifier, suivre et collaborer sur des projets de manière efficace.

# Project Management Tool

PMT est une plateforme de gestion de projet collaboratif destinée aux équipes de développement logiciel. L'objectif est de créer une application qui permettra aux équipes de planifier, suivre et collaborer sur des projets de manière efficace.


## Environment Variables

- J'ai utilisé VS Code comme éditeur de code pour ce projet. Le projet est développé avec springboot maven et angular, pour cela, vous devez configurer votre environnement de développement.
- Pour configurer votre environnement de développement, vous devez installer les outils suivants:

`Java 17.0.12 ou supérieur` 
`Maven 3.9.9  ou supérieur`
`Node.js 22.12.0 ou supérieur`
`Angular CLI 19.2.0 ou supérieur`
`MySQL 8.0.21 ou supérieur`

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
4. Installer [Angular](https://angular.dev/installation)avec la ligne de commande suivante:
- Verifiez l'installation avec la commande:

```bash
    npm install -g @angular/cli@19.2.0
    ng --version
```
5. Télécharger [MySQL installer](https://dev.mysql.com/downloads/installe/)  et suivre les insctructions d'installation où bien [Dbeaver 25.0.5](https://dbeaver.io/download/)


## Documentation
-  Lancement en local

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


2. Créer un répertoire sur le bureau et ouvrez ce répertoire dans VS Code. Cloner le projet avec la commande

```bash
    git clone https://github.com/Jmour-dh/PMT.git
```

