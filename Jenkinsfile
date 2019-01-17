node {

    stage('Initialize env'){
        env.PATH = "/usr/local/bin/docker-compose:/usr/bin/mongorestore:${env.PATH}"
    }

    stage('git checkout') {
        checkout scm
    }

    stage('init') {
        sh 'npm cache clean --force'
        sh 'npm install'
    }

    stage('Run Unit tests') {
        sh 'npm run test:api:list'
    }

    stage('Build docker image') {
        sh 'docker build -t dkanunik/barnacle-front:latest .'
    }
}
