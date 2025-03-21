const userRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const authguard = require('../services/authguard')
const bcrypt = require('bcrypt')
const hashPasswordExtension = require('../services/extensions/hashPasswordExtension')
const prisma = new PrismaClient().$extends(hashPasswordExtension)

userRouter.post('/register', async (req,res) =>{
    try {
        if (req.body.password != req.body.confirmPassword) {
            throw ({confirmPassword: "Les mots de passe ne correspondent pas"})
        } else {
            const user = await prisma.user.create({
                data: {
                    userName: req.body.userName,
                    email: req.body.email,
                    password: req.body.password

                }
            })
            res.redirect('/login')
        }
    } catch (error) {
        if ((error.code === 'P2002')) {
            error = 'Cette email est déjà utilisé'
        }
        res.render('pages/register.html.twig', { title : 'Incription', error})
    }
})

userRouter.get('/register', async (req, res) => {
    res.render('pages/register.html.twig', { title: 'Inscription' });
});


userRouter.get('/login', async (req, res) => {
    res.render('pages/login.html.twig', { title: 'Connexion' });
});


userRouter.post('/login', async (req, res) => {
    try {
        console.log("test");
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })
        
        if (user) {
            
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user
                res.redirect('/')
            } else {
                throw {password: "Mot de passe incorrect"}
            }
        } else {
            throw {email: "Email non enregisté"}
        }
    } catch (error) {
        res.render('pages/login.html.twig', { title: 'Connexion', error })
    }
})

userRouter.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        try {
            res.redirect('/login')
        } catch (error) {
            error = ("Une erreur c'est produite")
        }
    })
})

// userRouter.get('/', authguard, async (req, res) => {
//     const user = await prisma.user.findUnique({
//         where: {
//             id: req.session.user.id
//         }
//     })
//     res.render('pages/index.html.twig', {title: 'Accueil', user: req.session.user})
// })


userRouter.get('/', async (req, res) => {
    res.render('pages/index.html.twig', { title: 'Accueil' });
});


module.exports = userRouter