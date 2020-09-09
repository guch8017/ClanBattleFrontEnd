import echarts from 'echarts/lib/echarts'
import "echarts/lib/chart/line"
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import React from "react";
import echartTheme from "./Theme"
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    chart: {
        width: '700px',
        height: '400px'
    }
});

class DamageGraph extends React.Component {
    componentWillMount() {
        echarts.registerTheme('Imooc', echartTheme);
    }

    getOption = () => {
        let option = {
            title: {
                text: 'Clan Battle Data',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'time',
                scale: true,
            },
            yAxis: [
                {
                    type: 'value',
                    position: 'left',
                    name: '伤害',
                    axisLabel: {
                        formatter: function (val) {
                            return (val / (1000 * 1000 * 1000)).toFixed(2) + "M"
                        }
                    }
                },
                {
                    type: 'value',
                    position: 'right',
                    name: '排名'
                }
            ],
            dataZoom: [{
                type: 'slider',//图表下方的伸缩条
                show: true, //是否显示
                realtime: true, //拖动时，是否实时更新系列的视图
                start: 0, //伸缩条开始位置（1-100），可以随时更改
                end: 100, //伸缩条结束位置（1-100），可以随时更改
            }],
            series: [
                {
                    name: '伤害量',
                    type: 'line',   //这块要定义type类型，柱形图是bar,饼图是pie
                    data: this.props.d,
                    smooth: 'true',
                    symbol: 'none',
                    yAxisIndex: 0
                },
                {
                    name: '排名',
                    type: 'line',   //这块要定义type类型，柱形图是bar,饼图是pie
                    data: this.props.r,
                    smooth: 'true',
                    yAxisIndex: 1,
                    symbol: 'none'
                }
            ]
        }
        return option
    }

    render() {
        const chartStyle = {
            width: this.props.width + 'px',
            height: this.props.height + 'px',
        }

        return (
            <div>
                {/* <ReactEcharts option={this.getOption()} theme="Imooc" style={{width: '704px', height: "400px"}}/> */}
                <ReactEcharts option={this.getOption()} theme="Imooc" style={chartStyle} />
            </div>
        )
    }
}

export default withStyles(styles)(DamageGraph);