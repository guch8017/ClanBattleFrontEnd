import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    makeStyles,
    fade,
    InputBase,
    Tooltip,
    Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import SearchIcon from "@material-ui/icons/Search"
import HistoryIcon from "@material-ui/icons/History"
import {serverNameList} from "./Constant";
import {withRouter} from "react-router"

import React, {useState} from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    githubIcon: {
        marginRight: 0,
        position: 'relative',
    },
    rightSideIcon: {
        marginRight: theme.spacing(1),
        position: 'relative'
    }
}));
const searchMethodText = ['公会名', '排名', '会长ID'];

function AppHeader(props) {
    const classes = useStyles()
    const handleClick = (e) => {
    }
    const [searchKeyword, setKeyword] = useState("");
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {(!props.subpage) ?
                        <Tooltip title={"TODO: 切换服务器"}>
                            <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuButton}>
                                <MenuIcon/>
                            </IconButton>
                        </Tooltip> :
                        <IconButton edge="start" color="inherit" aria-label="return" className={classes.menuButton}
                                    onClick={() => props.history.push('/')}>
                            <ArrowBackIcon/>
                        </IconButton>
                    }
                    <Typography variant="h6" className={classes.title}>
                        {'这里是项目名 - ' + serverNameList[props.serverID] + ((props.subName) ? (' - ' + props.subName) : '')}
                    </Typography>
                    {(!props.subpage) && (
                        <>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    value={searchKeyword}
                                    inputProps={{'aria-label': 'search'}}
                                    onKeyUp={event => {
                                        event.preventDefault();
                                        if (event.keyCode === 13) {
                                            props.doSearchCallback(searchKeyword);
                                        }
                                    }}
                                    onChange={event => setKeyword(event.target.value)}
                                />
                            </div>
                            <Tooltip title="TODO: 搜索方式">
                                <Button onClick={handleClick} color="inherit">
                                    {searchMethodText[props.searchMethod]}
                                </Button>
                            </Tooltip>
                            <Tooltip title="TODO: 历史档线">
                                <IconButton edge="start" color="inherit" aria-label="历史档线"
                                            className={classes.rightSideIcon}>
                                    <HistoryIcon/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title={"仓库还没建"}>
                        <IconButton edge="start" color="inherit" aria-label="GitHub" className={classes.githubIcon}>
                            <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/>
                            </svg>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </div>
    )
}


export default withRouter(AppHeader);