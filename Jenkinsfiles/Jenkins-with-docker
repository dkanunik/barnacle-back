node {

    stage('Initialize env'){
        env.PATH = "/usr/local/bin/docker-compose:/usr/bin/mongorestore:${env.PATH}"
        env.MONGO_HOST = sh(script: "ip addr ls docker0 | awk '/inet / {print \$2}' | cut -d\"/\" -f1", returnStdout: true).trim()
    }

    stage('git checkout') {
        cleanWs()
        checkout scm
    }

    stage('init') {
        sh 'npm cache clean --force'
        sh 'npm install'
    }

    stage('Initialize containers') {
        sh 'docker/remove.sh'
        sh 'docker network create dev-net || true'

        sh 'docker-compose -f docker/docker-compose.yml up -d --force-recreate --build'

        sh "mongorestore --host ${env.MONGO_HOST} --gzip --drop --nsInclude barnacle.* --archive=$WORKSPACE/db/barnacle.test.gz"
    }

    stage('Run Unit tests') {
        sh 'npm run test:api:list'
    }

    stage('Publish docker image') {
        sh 'docker tag back:latest dkanunik/barnacle-back:latest'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
            sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
            sh 'docker push dkanunik/barnacle-back:latest'
        }
    }
}
