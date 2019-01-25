node {

    stage('Initialize env'){
        env.PATH = "/usr/local/bin/docker-compose:/usr/bin/mongorestore:${env.PATH}"
        env.NODEJS_HOME = "${tool 'node 8.14'}"
        env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
    }

    stage('git checkout') {
        cleanWs()
        checkout scm
    }

    stage('Initialize NodeJS') {
        sh 'npm cache clean --force'
        sh 'npm install'
    }

    stage('Initialize docker containers') {
        sh 'docker network create dev-net || true'

        env.MONGO_HOST = sh(script: "ip addr ls docker0 | awk '/inet / {print \$2}' | cut -d\"/\" -f1", returnStdout: true).trim()

        sh 'docker-compose -f docker/docker-compose.yml up -d'

        sh "mongorestore --host ${env.MONGO_HOST} --gzip --drop --nsInclude barnacle.* --archive=$WORKSPACE/db/barnacle.test.gz"
    }

    stage('Run API tests') {
        sh 'nohup node server.js &'
        sh 'npm run test:api:list'
    }

    stage('Process docker image') {
        sh 'docker build -t dkanunik/barnacle-back:latest .'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
            sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
            sh 'docker push dkanunik/barnacle-back:latest'
        }
    }
}
