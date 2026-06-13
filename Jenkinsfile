pipeline {
    agent any

    environment {
        IMAGE_NAME = 'simple-node-app'
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Verify Image') {
            steps {
                sh '''
                    docker run -d --name test_${BUILD_NUMBER} -p 3001:3000 ${IMAGE_NAME}:${IMAGE_TAG}
                    sleep 5
                    curl -f http://localhost:3001/health
                    docker rm -f test_${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Cleaning up dangling resources.'
            sh 'docker image prune -f'
        }
        success {
            echo "Build #${BUILD_NUMBER} succeeded!"
        }
        failure {
            echo 'Build failed. Check the stage logs above.'
        }
    }
}