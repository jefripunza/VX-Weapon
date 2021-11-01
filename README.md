### GITHUB
#### stater
```bash
git init && git add README.md && git commit -m "first commit" && git branch -M main && git remote add origin https://github.com/jefripunza/VX-Weapon.git && git push -u origin main
```

### ONLY GITHUB
```bash
git add . && git branch -M main  && git commit -m "bismillah" && git push -f origin main
```

### ALL PUSH
```bash
git add . && git branch -M main  && git commit -m "bismillah" && git push -f origin main && git push heroku HEAD:master
```

### ON/OFF SERVER
```bash
heroku ps:scale web=0
```

#### Change User
logout dulu di icon github ~> di kiri bawah user ~> logout ~> sync
```bash
git config --global user.email "jefripunza@gmail.com"
git config --global user.name jefripunza
```