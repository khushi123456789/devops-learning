pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building the full stack...'
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying app + database...'
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }

        stage('Verify') {
            steps {
                echo 'Checking the app is alive...'
                sh 'sleep 10'
                sh 'docker compose exec -T app wget -qO- http://localhost:3000/health'
            }
        }
    }

    post {
        success {
            echo 'Full stack deployed successfully!'
        }
        failure {
            echo 'Deployment failed. Check logs above.'
        }
    }
}