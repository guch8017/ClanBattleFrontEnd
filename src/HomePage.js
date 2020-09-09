import React from "react";
import Axios from "axios";
import {searchAPI} from "./Constant";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppHeader from "./Appbar";
import ClanRankingTable from "./RankingTable";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        const rankList = []
        this.state = {
            "searchMethod": 0,
            "server": 1,
            "rankList": rankList,
            successOpen: false,
            errorOpen: false,
            errorMsg: "",
            loading: false
        }
        this.handleSearchModeChange = this.handleSearchModeChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFinishLoading = this.handleFinishLoading.bind(this);
        this.handleSuccessClose = this.handleSuccessClose.bind(this);
        this.handleFailClose = this.handleFailClose.bind(this);
    }

    componentDidMount() {
        const _this = this;
        Axios.post(
            searchAPI
        ).then((rep) => {
            _this.updateTable(_this, rep);
        })
    }

    updateTable(_this, rep){
        const js = rep.data;
        if (!js) {
            _this.setState({
                loading: false,
                errorOpen: true,
                errorMsg: "未取得数据"
            })
            return
        }
        if (js['code'] !== 1) {
            _this.setState({
                loading: false,
                errorOpen: true,
                errorMsg: js['msg']
            })
            return
        }
        _this.setState({
            loading: false,
            successOpen: true,
            rankList: js['data']
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

    handleSearch(keyword) {
        const _this = this;
        if(!keyword){
            _this.setState({
                errorOpen: true,
                errorMsg: "查询关键字不能为空"
            })
            return
        }
        _this.setState({loading: true});
        Axios.post(
            searchAPI,
            {"clanName": keyword}
        ).then(rep => {
            _this.updateTable(_this, rep)

        }).catch(error =>
            _this.setState({
                loading: false,
                successOpen: true,
                rankList: error.message
            })
        )
    }

    render() {

        return (
            <React.Fragment>
                <CssBaseline/>
                <div>
                    <AppHeader serverID={this.state.server} searchMethod={this.state.searchMethod}
                               searchModeCallback={this.handleSearchModeChange}
                               doSearchCallback={this.handleSearch}
                    />
                    <ClanRankingTable rankList={this.state.rankList} serverID={this.state.server}/>
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

    handleSearchModeChange(mode) {
        this.setState({
            "searchMethod": mode
        });
    }


}