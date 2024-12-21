./scripts/git-check.sh
if [ $? -eq 1 ]
then
  exit
fi
git stash -k -u
echo 'Running Prettier...'
if npx prettier --config ./.prettierrc --list-different "src/**/*.js" | grep .
then
  echo 'Fixing Indentation'
  git stash pop
  npx prettier --config ./.prettierrc --write "src/**/*.js" 
  git reset
  BLUE='\033[1;36m'
  echo  "${BLUE}INDENTAION FIXED: Please Stage Changes Again ${RESET}"
  exit 1
fi
echo 'Prettier Checks Completed...'
echo 'Running Linter'
npm run lint
if [ $? -ne 0 ]
then
  echo 'Commmit failed - one or more Lint errors found.'
  echo
  git stash pop
  git reset
  exit 1
fi
echo 'Linter Checks Completed...'
echo 'Ready To Commit.'