# ENGR1050

Useful Links for Development
----------------------------


### Particle
* https://docs.particle.io/reference/webhooks/
* https://docs.particle.io/guide/tools-and-features/webhooks/

### Web App
* https://devcenter.heroku.com/articles/mean-apps-restful-api

##### To deploy web app:
- Create remote 'heroku'
    - git remote add heroku https://git.heroku.com/ev-charging.git
- Push only the heroku app folder to the remote
    - git subtree push --prefix webapp\ev-charging heroku master
