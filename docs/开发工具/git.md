---
date: 2021-06-05 22:14:19
updated: 2021-06-05 22:14:19
md5: 'bb5ba78e8a6c683bf4327bbd907edd45'
---

# git

```bash
git config --list
git config --global user.name "xxx"
git config --global user.email "xxx@pony.ai"
git config --global -e          # edit config file

git clone https://github.com/xxx/yyy.git

git remote add origin https://github.com/xxx/yyy.git
git remote -v                   # list remote lib.
git remote rm xxx               # delete remote lib.

git push -u origin master       # link local lib. to remote lib. & push
git push

git pull                        # usage similar to push

git init
git init xxx

git add xxx                     # add a file
git add -A                      # add all files (with .gitignore)
git add .                       # add all files (with .gitignore)
git add *                       # add all files (without .gitignore)

git rm xxx                      # remove a file

git commit -m 'xxx'
git commit -am 'xxx'            # add & commit
git commit --amend 'xxx'        # update commit message

git status
git status -s               

git branch                      # list braches
git branch -r                   # list remote branches
git branch xxx                  # build a new branch
git branch -d xxx               # delete branch (if merged)
git branch -D xxx               # delete branch (even unmerged)
git branch -f xxx yyy           # force bind branch xxx to yyy (branch name or hash id)

git checkout xxx                # switch to branch name or hash id
git checkout -b xxx             # build & switch

git merge xxx                   # merge xxx to current branch

git rebase xxx                  # rebase current branch to xxx
git rebase xxx yyy              # rebase yyy to xxx
git rebase -i xxx yyy ...       # ...

git reset HEAD -- xxx           # rollback to curr. ver. (for specific file)
git reset HEAD^                 # rollback to last ver. (for whole lib.)
git reset HEAD^^                # rollback to last 2 ver.
git reset HEAD~30               # rollback to last 30 ver.
git reset xxx                   # rollback to specific id
git reset --hard HEAD^          # HARD rollback to last ver.

git revert HEAD                 # ...

git cherry-pick xxx yyy ...     # ...

git diff xxx                    # show diff of file

git log

git reflog                      # ...

git stash                       # ...
git stash list
git stash apply
git stash drop
git stash pop

```
