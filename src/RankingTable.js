import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';
import TableRow from '@material-ui/core/TableRow';
import {withRouter} from "react-router"
import { Typography, Box } from '@material-ui/core';

const columns = [
    {id: 'clanName', label: '公会名', minWidth: 170},
    {id: 'ranking', label: '排名', minWidth: 80},
    {
        id: 'clanScore',
        label: '分数',
        minWidth: 170,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'leaderName',
        label: '会长名',
        minWidth: 170,
    },
];

// function createData(clanName, ranking, clanScore, clanLeader, clanLeaderID) {
//     return {clanName, ranking, clanScore, clanLeader, clanLeaderID};
// }

// const rows = [
//     createData('HelloWorld', 1, 10000, 'HelloWorld', "12345")
// ];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        height: '100%',
    },
});

function RankingTable(props) {
    const classes = useStyles();
    const [page, setPage] = React.useState(1);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleState = (leaderID, clanName) => {
        props.history.push({
            pathname: '/clan', state:
                {
                    leaderID: leaderID,
                    clanName: clanName,
                    serverID: props.serverID
                }
        });
    }
    console.log("Ranking Table Props")
    console.log(props);
    return (
        <Paper className={classes.root}>
            <Container>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{minWidth: column.minWidth}}
                                    >
                                        <Typography variant='h5' color='textPrimary' gutterBottom>
                                            {column.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.rankList && (props.rankList.slice((page - 1) * 10, page * 10).map((row) => {
                                return (

                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.ranking}
                                              onClick={(e) => handleState(row.leaderID, row.clanName)}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Typography variant='body1' color='textPrimary' gutterBottom>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </Typography>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>

                                );
                            }))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexWrap='wrap'
                m={2}
                >
                    <Pagination 
                    count={page}
                    color='primary'
                    onChange={handleChangePage}
                    showFirstButton showLastButton
                    defaultPage={1} siblingCount={4}
                    />
                </Box>

                {/* <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={props.rankList.length}
                    rowsPerPage={10}
                    page={page}
                    onChangePage={handleChangePage}
                /> */}
            </Container>
        </Paper>
    );
}


export default withRouter(RankingTable);