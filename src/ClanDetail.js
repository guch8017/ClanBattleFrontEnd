import AppHeader from "./Appbar";
import React from "react";
import {withRouter} from "react-router"
import DamageGraph from "./DamageGraph";
import {Grid, Paper, Typography, withStyles, Snackbar, Table, TableCell, TableBody} from "@material-ui/core";
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
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
        padding: theme.spacing(2),
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
    htmlWrap: {
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'auto'
      }
});

class ClanDetail extends React.Component {
    paperRef = React.createRef();

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
            historyDmg: [],
            chartWidth: 0,
            chartHeight: 0,
        }
        this.handleFinishLoading = this.handleFinishLoading.bind(this);
        this.handleSuccessClose = this.handleSuccessClose.bind(this);
        this.handleFailClose = this.handleFailClose.bind(this);

        window.addEventListener('resize', (ev) => {
            // 更新表格大小
            this.setState({
                chartWidth: (this.paperRef.current == null)? 0 : this.paperRef.current.clientWidth,
                chartHeight: (this.paperRef.current == null)? 0 : this.paperRef.current.clientHeight,
            })
        })
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
        // 更新表格大小
        this.setState({
            chartWidth: (this.paperRef.current == null)? 0 : this.paperRef.current.clientWidth,
            chartHeight: (this.paperRef.current == null)? 0 : this.paperRef.current.clientHeight,
        })

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

        const clanDatas = [
            ['伤害', this.state.clanScore],
            ['排名', this.state.rank],
            ['会长', this.state.clanLeader],
            ['会长ID', this.leaderID],
            ['进度', this.state.progress],
        ]


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
                                {/* 左侧数据 */}
                                <Grid item xs={12} md={4}>
                                    <TableContainer>
                                        <Paper className={classes.paperLayout}>
                                            <Typography gutterBottom variant="h5" component="h2" align={"center"}>
                                                {this.state.clanName}
                                            </Typography>
                                            <Table>
                                                <TableBody>
                                                    {/* 格式化左侧数据 */}
                                                    {clanDatas.map((value, index, array) => {
                                                        return (
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Typography variant="h6" color="textPrimary" component="p">
                                                                        {value[0]}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="h6" color="textSecondary" component="p">
                                                                        {value[1]}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </TableContainer>
                                </Grid>
                                {/* 图表 */}
                                <Grid item xs={12} md={8}>
                                    <Paper
                                        marginLeft="20"
                                        className={classes.paperLayout}
                                        justify={"center"}
                                        ref={this.paperRef}
                                    >
                                        <div className={classes.htmlWrap}>
                                            <DamageGraph  
                                            d={this.state.historyDmg} 
                                            r={this.state.historyRank}
                                            width={Math.max(this.state.chartWidth, 600)}
                                            height={400}
                                            />
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <Snackbar open={this.state.successOpen} autoHideDuration={2000} 
                onClose={this.handleSuccessClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={this.handleSuccessClose} severity="success">
                        加载成功
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.errorOpen} autoHideDuration={2000} 
                onClose={this.handleFailClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
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