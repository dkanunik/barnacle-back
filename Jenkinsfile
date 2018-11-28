node {

    stage('git checkout') {
        cleanWs()
        checkout scm
    }

    stage('init') {
        sh 'npm cache clean --force'
        sh 'npm install'
    }

    stage('RUN Unit tests') {
        sh 'npm run test:api:list'
    }

    stage('Build docker image') {
        sh 'docker build -f docker/Dockerfile -t dkanunik/barnacle-back:latest .'
    }

    stage('Publish docker image') {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
            sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
            sh 'docker push dkanunik/barnacle-back:latest'
        }
    }
}
