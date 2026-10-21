// ECharts 统一入口：按需注册图表与组件，控制打包体积，供看板页面复用实例初始化。
import * as echarts from 'echarts/core';
import { BarChart, FunnelChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  FunnelChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

export default echarts;
