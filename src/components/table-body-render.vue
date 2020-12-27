<script>
import { isEmpty, isArray } from 'lodash';
export default {
  name: 'tableBodyRender',
  props: {
    render: Function,
    index: [String, Number],
    row: Object,
    col: Object
  },
  render(h) {
    // 自定义render
    // 只能返回一个Vnode节点
    // h:createElement
    // index:表格当前行下标
    // row: 表格当前行数据
    // 例如 customRender(h, {index, row}){}
    let Vnodes = this.render(h, { index: this.index, row: this.row, col: this.col });
    if (!isEmpty(Vnodes)) {
      return isArray(Vnodes) ? Vnodes.pop() : Vnodes;
    }
    return '';
  }
};
</script>
