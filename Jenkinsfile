node {

    stage('Initialize env'){
        env.PATH = "/usr/local/bin/docker-compose:/usr/bin/mongorestore:${env.PATH}"
        env.NODEJS_HOME = "${tool 'node 8.14'}"
        env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
        env.PATH="${env.NODEJS_HOME};${env.PATH}
        sh 'npm --version'

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
        sh 'docker build -t dkanunik/barnacle-back:latest .'
    }
}
