import AppHeader from "./Appbar";
import React from "react";
import {withRouter} from "react-router"
import DamageGraph from "./DamageGraph";
import {Grid, Paper, Typography, withStyles, Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import CssBaseline from "@material-ui/core/CssBaseline";
import {detailAPI} from "./Constant";
import Axios from "axios";
import {getClanBattleProgress} from "./Utils";


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme => ({
    container: {
        maxWidth: 1200,
        textAlign: "center",
        marginTop: 40
    },
    mainContainer: {
        flexGrow: 1,
    },
    paperLayout: {
        padding: theme.spacing(3),
        margin: theme.spacing(2),
    },
    childGrid: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    childGrid2: {
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(1),
    },
    loadingState: {
        opacity: 0.5
    },
});

class ClanDetail extends React.Component {
    constructor(props) {
        super(props);
        if (!props.location.state) {
            props.history.push('/')
            return
        }
        this.leaderID = props.location.state.leaderID;
        this.serverID = props.location.state.serverID;
        this.state = {
            clanName: props.location.state.clanName,
            clanScore: "Loading...",
            clanLeader: "Loading...",
            rank: 0,
            progress: "1周目 - 1王",
            loading: false,
            successOpen: false,
            errorOpen: false,
            errorMsg: "",
            historyRank: [],
            historyDmg: []
        }
        this.handleFinishLoading = this.handleFinishLoading.bind(this);
        this.handleSuccessClose = this.handleSuccessClose.bind(this);
        this.handleFailClose = this.handleFailClose.bind(this);
    }

    handleFinishLoading() {
        this.setState({loading: false});
    }

    handleSuccessClose() {
        this.setState({successOpen: false});
    }

    handleFailClose() {
        this.setState({errorOpen: false})
    }

    componentDidMount() {
        const _this = this;
        _this.setState({loading: true});
        Axios.post(
            detailAPI,
            {'leaderID': _this.leaderID},
            {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            }
        ).then((rep) => {
            const js = rep.data;
            if (!js) {
                _this.setState({
                    loading: false,
                    errorMsg: "Empty Response",
                    errorOpen: true,
                })
                return
            }
            if (js['code'] !== 1) {
                _this.setState({
                    loading: false,
                    errorMsg: js['msg'],
                    errorOpen: true,
                })
                return
            }
            const data = js['data']
            const timeList = [];
            const damageList = [];
            const rankList = [];
            const progress = getClanBattleProgress(data['damage']);
            data['history'].forEach((val) => {
                const time = val['t'] * 1000
                damageList.push([time, val['d']]);
                rankList.push([time, val['r']]);
            })
            _this.setState({
                clanName: data['clanName'],
                clanScore: data['damage'],
                clanLeader: data['leader'],
                rank: data['ranking'],
                loading: false,
                successOpen: true,
                historyTime: timeList,
                historyDmg: damageList,
                historyRank: rankList,
                progress: `${progress[0]}周目 - ${progress[1]}王`
            })

        }).catch((error) => {
            _this.setState({
                "loading": false,
                "errorOpen": true,
                "errorMsg": error.message
            })
        })

    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <div className={classes.mainContainer}>
                    <AppHeader subpage={true} subName={this.state.clanName} serverID={this.serverID}/>
                    <div className={(this.state.loading) ? classes.loadingState : ""}>
                        <Grid container justify="center">
                            <Grid
                                container
                                spacing={2}
                                className={classes.container}
                                alignItems="center"
                                justify="center"
                            >
                                <Grid item xs={4}>
                                    <Paper className={classes.paperLayout}>
                                        <Typography gutterBottom variant="h5" component="h2" align={"left"}>
                                            {this.state.clanName}
                                        </Typography>
                                        <Grid container className={classes.childGrid2}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color="textSecondary" component="p"
                                                            align={"left"}>
                                                    伤害
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {this.state.clanScore}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container className={classes.childGrid}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color="textSecondary" component="p"
                                                            align={"left"}>
                                                    排名
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {this.state.rank}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container className={classes.childGrid}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color="textSecondary" component="p"
                                                            align={"left"}>
                                                    会长
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {this.state.clanLeader}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container className={classes.childGrid}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color="textSecondary" component="p"
                                                            align={"left"}>
                                                    会长ID
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {this.leaderID}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container className={classes.childGrid}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color="textSecondary" component="p"
                                                            align={"left"}>
                                                    进度
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {this.state.progress}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs>
                                    <Paper
                                        marginLeft="20"
                                        className={classes.paperLayout}
                                        justify={"center"}
                                    >
                                        <div className={(this.state.loading) ? classes.loadingState : ""}>
                                            <DamageGraph  d={this.state.historyDmg} r={this.state.historyRank}/>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <Snackbar open={this.state.successOpen} autoHideDuration={6000} onClose={this.handleSuccessClose}>
                    <Alert onClose={this.handleSuccessClose} severity="success">
                        加载成功
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.errorOpen} autoHideDuration={6000} onClose={this.handleFailClose}>
                    <Alert onClose={this.handleSuccessClose} severity="error">
                        {"发生异常:\n" + ((this.state.errorMsg) ? this.state.errorMsg : "")}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.loading}>
                    <Alert severity="info">
                        正在加载数据...
                    </Alert>
                </Snackbar>
            </React.Fragment>
        )
    }
}


export default withRouter(withStyles(styles)(ClanDetail))