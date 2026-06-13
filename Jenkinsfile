pipeline {
    // Run on any available Jenkins agent (build machine)
    agent any

    // Variables available to every stage
    environment {
        IMAGE_NAME = 'simple-node-app'
        IMAGE_TAG  = "${BUILD_NUMBER}"   // unique tag per Jenkins build, e.g. 1, 2, 3...
    }

    stages {

        stage('Checkout') {
            steps {
                // Pull the source code from the configured Git repo
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Clean, reproducible install based on package-lock.json
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                // No real tests yet — placeholder so the pipeline shape is correct.
                // Replace with 'npm test' once you add tests.
                echo 'No tests defined yet. Skipping.'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build the image and tag it twice: with the build number and 'latest'
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Verify Image') {
            steps {
                // Smoke test: start the container, hit /health, then clean up
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
        // Runs after all stages, regardless of outcome
        always {
            echo 'Pipeline finished. Cleaning up dangling resources.'
            sh 'docker image prune -f'
        }
        success {
            echo "Build #${BUILD_NUMBER} succeeded. Image: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo 'Build failed. Check the stage logs above.'
        }
    }
}
