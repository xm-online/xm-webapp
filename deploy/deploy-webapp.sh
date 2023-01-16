docker login -u $DOCKER_USER -p $DOCKER_PASS
export DOCKER_REPO=$(echo -n $TRAVIS_REPO_SLUG | sed -e 's/^xm-online\//xmonline\//g')
export IMAGE_BRANCH=$(echo -n $TRAVIS_BRANCH | sed -e 's/\//-/g')
export PROJECT_VERSION="$IMAGE_BRANCH"
# use version as the name of the image
if [ "$IMAGE_BRANCH" == "master" ] || [ "$IMAGE_BRANCH" == "main" ]; then
  PROJECT_VERSION=$(npm run-script get-version | tail -n1)
  TAGS="$PROJECT_VERSION $PROJECT_VERSION-$TRAVIS_BUILD_NUMBER $(echo $PROJECT_VERSION | awk -F '.' '{printf $1"."$2" "$1}') latest"
fi
cp -r dist/ deploy/webapp
docker build -t app-docker-img \
  --label commit_id="$TRAVIS_COMMIT" \
  --label version="$PROJECT_VERSION" \
  --label build_number="$TRAVIS_BUILD_NUMBER" \
  --label build_url="$TRAVIS_BUILD_WEB_URL" \
  --label git_url="$TRAVIS_REPO_SLUG" \
  --label commit_message="$TRAVIS_COMMIT_MESSAGE" deploy/webapp
for TAG in $TAGS; do
  docker tag app-docker-img $DOCKER_REPO:$TAG
  docker push $DOCKER_REPO:$TAG
done
