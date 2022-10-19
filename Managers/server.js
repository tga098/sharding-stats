const Strategy = require("passport-discord");
const passport = require("passport");
const Events = require('events');
const express = require('express');
const path = require('path');
const form = require('../Structures/formdata.js');
const Schema = require("../Structures/schema.js");
const Code = require('./code.js')
const FormData = new form();
const session = require("express-session");
const url = require("url");
const MemoryStore = require("memorystore")(session);

class Server extends Events {
    constructor(app, config = {}) {
        super()
        this.app = app;
        this.totalClusters = 0;
        this.totalShards = 0;
        this.config = config;
        if (typeof config === "object" && typeof config.managerApi === "string") {
            this.managerApi = config.managerApi;
        }
        this.killShard = new Map();
        this.code = new Code(config);
        this._validateOptions();
        this._buildApi();
        if(!this.config?.selfHost) {
            this._applytoApp();
            this._buildRoute();
        }
    }
    
    /**
     * @returns {import("../Structures/jsDocStyles.js").StatsDataReturnData}
     */
    getStatsData() {
        const shardData = FormData.shardData(0, { all: true });
        const totalData = FormData.totalData();
        return {
            raw: {
                shards: shardData,
                total: totalData
            },
            pretty: {
                shards: FormData.humanize(shardData),
                total: FormData.humanize(totalData),
            }
        }
    }
    /**
     * @typedef {import("../Structures/jsDocStyles.js").rawShardsData} rawShardsData
     * @returns { {cluster:number, shards: rawShardsData[] }[]}
     */
    chunkShardsToClusterArrays() {
        /** @type {import("../Structures/jsDocStyles.js").rawShardsData} */
        const shardData = FormData.shardData(0, { all: true });
        let returnData = [];
        if(!shardData?.length || typeof shardData?.[0]?.cluster === "undefined") return returnData;
        for(const element of shardData) {
            const clusterId = typeof element.cluster !== "undefined" && !isNaN(element.cluster) ? Number(element.cluster) : shardData?.filter(x => typeof x.cluster !== "undefined" && !isNaN(x.cluster)).length > 0 ? -1 : undefined;
            const index = returnData.findIndex(x => x.cluster === clusterId);
            if(index < 0) returnData.push({ cluster: clusterId, shards: [element] });
            else returnData[index].shards.push(element);
        }
        returnData = returnData.sort((a,b) => a.cluster - b.cluster);
        returnData.map(x => {
            x.shards = x.shards.sort((a,b) => a.id - b.id)
            return x;
        })
        return returnData;
    }
    _applytoApp() {
        this.app.use(session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4nas`,
            resave: false,
            saveUninitialized: false
        }))

        this.app.use(express.static(path.join(__dirname, `../Frontend`)));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, `../Frontend`));
        passport.serializeUser((user, done) => done(null, user))
        passport.deserializeUser((obj, done) => done(null, obj))
        passport.use(new Strategy({
            clientID: this.config.bot.client_id,
            clientSecret: this.config.bot.client_secret,
            callbackURL: this.config.redirect_uri,
            scope: this.config.scope
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile))
        }))

        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
    _buildApi() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.post('/stats', (req, res) => {
            try {
                if (!req.headers.authorization) return res.status(404).end()
                const authProvided = req.headers.authorization
                const authKey = Buffer.from(this.config.authorizationkey).toString('base64');
                if (authKey !== authProvided) return res.status(404).end();
                
                if(req.body?.totalClusters && !isNaN(req.body.totalClusters)) this.totalClusters = Number(req.body.totalClusters);
                if(req.body?.totalShards && !isNaN(req.body.totalShards)) this.totalShards = Number(req.body.totalShards);
                if(this.totalClusters || this.totalShards) checkShards(this.totalShards, this.totalClusters)

                const rawdata = new Schema(req.body).toObject();
                FormData._patch(rawdata);
                setTimeout(() => {
                    this._checkIfShardAlive(rawdata.id)
                }, this.config.markShardsDeadafter)

                if (this.killShard.has(rawdata.id)) {
                    this.killShard.delete(rawdata.id)
                    res.send({ kill: true, shard: rawdata.id })
                } else {
                    res.send({ status: ` Successfully completed the opration` })
                }
                return res.end();
            } catch (error) {
                this.emit('error', error)
            }
        })
    }
    _buildRoute() {
        // this.app.get(`/${(this.config.login_path || '')}`, (req, res) => {
        //     res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${this.config.bot.client_id}&redirect_uri=${this.config.redirect_uri}&response_type=code&scope=${this.config.scope.join('+')}`)
        // })
        // this.app.get('/login', async (req, res) => {
        //     try {
        //         const code = req.query.code;
        //         if (this.code.checkSession(code)) {
        //             return res.render("starter", { posts: FormData.humanize(FormData.shardData(0, { all: true })), secret: { code: code }, config: this.config, data: FormData.humanize(FormData.totalData()) });
        //         }
        //         if (!code) return res.redirect('/404');
        //         const passport = new Passport({
        //             code: code,
        //             client_id: this.config.bot.client_id,
        //             client_secret: this.config.bot.client_secret,
        //             redirect_uri: this.config.redirect_uri,
        //             scope: this.config.scope
        //         })
        //         await passport.open(); // Trades your code for an access token and gets the basic scopes for you.
        //         if (this.config.owners.includes(passport.user.id)) {
        //             this.code.addSession(code)
        //             res.redirect("/stats")
        //             res.render("starter", { posts: FormData.humanize(FormData.shardData(0, { all: true })), secret: { code: code }, config: this.config, data: FormData.humanize(FormData.totalData()) });
        //         } else {
        //             return res.end(`Access denied!`);
        //         }
        //     } catch (error) {
        //         this.emit('error', error)
        //     }
        // })

        const checkAuth = (req, res, next) => {
            if (req.isAuthenticated()) return next();
            req.session.backURL = req.url;
            res.redirect("/login");
        }

        this.app.get("/login", (req, res, next) => {
            if (req.session.backURL) {
                req.session.backURL = req.session.backURL
            } else if (req.headers.referer) {
                const parsed = url.parse(req.headers.referer);
                if (parsed.hostname == this.app.locals.domain) {
                    req.session.backURL = parsed.path
                }
            } else {
                req.session.backURL = "/"
            }
            next();
        }, passport.authenticate("discord", { prompt: "none" }));

        this.app.get(`/callback`, passport.authenticate(`discord`, { failureRedirect: "/" }), async (req, res) => {
            if (this.config.bannedUsers?.includes?.(req?.user?.id)) {
                req.session.destroy(() => {
                    res.json({ login: false, message: `You have been banned BY The OWNER/DEVLOPER from the Dashboard.`, logout: true })
                    req.logout();
                });
            } else {
                res.redirect(`/`)
            }
        }); 

        this.app.get('/', checkAuth, async (req, res) => {
            const shardData = FormData.shardData(0, { all: true })
            const totalData = FormData.totalData()
            res.render('index', {
                shards: FormData.humanize(shardData),
                total: FormData.humanize(totalData),
                posts: FormData.humanize(FormData.shardData(0, { all: true })),
                config: this.config,
                data: FormData.humanize(FormData.totalData()),
                user: req.user
            })
        })

        this.app.get('/stats', checkAuth, async (req, res) => {
            const shardData = FormData.shardData(0, { all: true })
            const totalData = FormData.totalData()
            if (!this.config.owners.includes(req.user.id)) {
                return res.send(`YOU CAN'T ACCESS IT BECAUSE YOU ARE NOT A OWNER`)
            }
            res.render('starter', {
                shards: FormData.humanize(shardData),
                total: FormData.humanize(totalData),
                posts: FormData.humanize(FormData.shardData(0, { all: true })),
                config: this.config,
                data: FormData.humanize(FormData.totalData()),
                user: req.user
            })
        })
        this.app.get("/status", (req, res) => {
            try {
                const shardData = FormData.shardData(0, { all: true })
                const totalData = FormData.totalData()
                res.send({ shards: FormData.humanize(shardData), total: FormData.humanize(totalData) });
                return;
            } catch (error) {
                this.emit('error', error)
            }
        })

        this.app.get("/api/shard", (req, res) => {
            try {
                const shardid = req.query.shardid;
                let data = FormData.shardData(Number(shardid));
                if (!data) data = new Schema({ id: shardid }).toObject();
                res.send(FormData.humanize(data))
                return res.end();
            } catch (error) {
                this.emit('error', error)
            }
        })

        this.app.get("/api/killShard", (req, res) => {
            try {
                const shardid = req.query.shardid;
                if (req.user)
                    // if (!req.headers.authorization) return res.status(404).end()
                    // const authProvided = req.headers.authorization
                    // const authKey = Buffer.from(this.config.authorizationkey).toString('base64');
                    // if (authKey !== authProvided) return res.status(404).end();
                    // const code = req.query.code;
                    // if (!this.code.checkSession(code)) return res.end(`AUTHENTICATION FAILED | RELOAD & LOGIN AGAIN`);
                    this.killShard.set(Number(shardid), true)
                return res.end();
            } catch (error) {
                this.emit('error', error)
            }
        })

        this.app.post(`/api/deleteShards`, (req, res) => {
            if (!req.headers.authorization) return res.status(404).end()
            const authProvided = req.headers.authorization
            const authKey = Buffer.from(this.config.authorizationkey).toString('base64');
            if (authKey !== authProvided) return res.status(404).end();
            FormData.shard.clear();
        })
    }


    _checkIfShardAlive(shardID) {
        const data = FormData.shardData(Number(shardID));
        if (!data) return;
        const diff = Number(data.lastupdated + this.config.markShardsDeadafter - 1000);
        if (diff > Date.now()) return;
        data.upsince = 0;
        data.status = 5;
        data.message = `Died | No Message Recieved`;
        FormData._patch(data);
        return;
    }

    _validateOptions() {
        if (!this.config.bot) throw new Error(`Missing Bot Parameters such as redirect_uri, client_secret...`)
        if (!this.config.bot.client_id) throw new Error(`Missing Parameter: client_id has not been provided`)
        if (!this.config.bot.client_secret) throw new Error(`Missing Parameter: client_secret has not been provided`)

        if (!this.config.stats_uri) throw new Error(`Missing Parameter: stats_uri has not been provided`)
        //if (!this.config.redirect_uri) throw new Error(`Missing Parameter: redirect_uri has not been provided`)
        if (!this.config.owners?.length) throw new Error(`Missing Parameter: owners["owner-DC-Id"] has not been provided`);
        if (!this.config.scope) this.config.scope = ['identify'];
        if (!this.config.postinterval) this.config.postinterval = 2500;
        if (!this.config.markShardsDeadafter) this.config.markShardsDeadafter = 10000;
        if (!this.config.loginExpire) this.config.loginExpire = 60000 * 15;
        if (!this.config.login_path) this.config.login_path = '';
        if (this.config.postinterval > this.config.markShardsDeadafter) throw new Error(`Post Interval can not be bigger than the "maskShardasDeadafter" Argument`)
    }
}
module.exports = Server;
