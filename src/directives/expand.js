import Vue from 'vue';
import { isEqual, map } from 'lodash';

const nextTick = Vue.prototype.$nextTick;

class Expand {
  constructor() {
    this.options = {
      height: '44px',
      isExpand: true
    };
    this.el = undefined;
    this.children = undefined;
    this.height = 0;
    this.row = 0;
    this.widthArr = [];
    this.heightArr = [];
    this.marginBottom = 0;
    this.instance = undefined;
  }

  // 格式化配置项
  initOptions(value = false) {
    if (typeof value === 'boolean') {
      this.options.isExpand = value;
    } else {
      this.options = Object.assign(this.options, value);
    }
    return this.options;
  }

  // 初始化height变量
  initHeight() {
    const { height = 'auto' } = this.options;
    if (height === 'auto') {
      this.height = Math.max(...this.heightArr[0]) || 0;
    } else if (typeof height === 'string' && height.indexOf('px') > -1) {
      this.height = parseInt(height);
    } else if (typeof height === 'number') {
      this.height = height;
    } else {
      return false;
    }
  }

  // 切换高度
  updateView(options) {
    if (options) {
      this.options = Object.assign(this.options, options);
    }

    this.instance && this.instance.$emit('update', { row: this.row });

    const height = this.options.isExpand
      ? `${this.resizeHeight()}px`
      : `${this.height}px`;

    if (this.el && height !== this.el.style.height) {
      this.el.style.overflow = 'hidden';
      this.el.style.transition = 'height 0.3s ease';
      this.el.style.height = height;
      this.instance && this.instance.$emit('onHeightChange', parseInt(this.el.style.height));
    }
  }

  // 动态累加子节点高度
  resizeHeight() {
    return this.heightArr.reduce((sum, arr) => {
      return sum + Math.max(...arr);
    }, 0);
  }

  // 动态计算高度，切换视图高度
  resizeView = () => {
    if (this.instance) {
      const { row, heightArr, widthArr } = this.getRow();
      this.instance.$emit('showExpand', row > 1, row, heightArr, widthArr);
      this.instance.$emit('onChange');

      if (this.row !== row) {
        this.instance.$emit('onRowChange', row);
        this.row = row;
      }

      this.heightArr = heightArr;
      this.initHeight();
      this.updateView();
    }
  };
  // 监听页面resize
  handleResize = () => {
    if (this.instance) {
      this.instance.$emit('resize');
      this.resizeView();
    }
  };

  // 计算行数及每行高度
  getRow = () => {
    const arr = map(this.children, node => getWidth(node));
    let rowNum = 1; // 行数
    let total = 0;
    let nodeArr = [];
    let heightArr = [];
    let widthArr = [];
    arr.forEach((item, index) => {
      total = total + item;
      if (this.isOverWidth(total)) {
        total = item;
        rowNum++;
      }
      if (!heightArr[rowNum - 1]) {
        heightArr[rowNum - 1] = [];
      }
      if (!widthArr[rowNum - 1]) {
        widthArr[rowNum - 1] = [];
      }
      if (!nodeArr[rowNum - 1]) {
        nodeArr[rowNum - 1] = [];
      }

      this.children && heightArr[rowNum - 1].push(getHeight(this.children[index]));
      widthArr[rowNum - 1].push(item);
      this.children && nodeArr[rowNum - 1].push(this.children[index]);
    });
    this.marginBottom = Math.max(
      ...nodeArr[rowNum - 1].map(node => {
        return parseInt(getStyle(node).marginBottom || '0');
      })
    );

    return {
      row: rowNum,
      heightArr,
      widthArr
    };
  };

  isOverWidth(width) {
    if (!this.el) {
      return false;
    }
    return width > getWidth(this.el) - 8;
  }

  // 过滤注释节点
  filterNode(nodes) {
    if (!nodes.length) {
      return [];
    }
    const res = [];
    for (const i of nodes) {
      if (i.nodeType === 1) {
        res.push(i);
      }
    }
    return res;
  }

  // 数据变动时更新配置项
  isChange(value) {
    let options = this.initOptions(value);
    let res = isEqual(this.options, options);
    if (!res) {
      this.options = Object.assign({}, options);
    }
    return res;
  }

  inserted = (el, { value }, vnode) => {
    let { height, childEl } = value;

    if (typeof value !== 'boolean') {
      this.el = (value && value.el) ? document.querySelector(value.el) : el;
    } else {
      this.el = el;
    }
    this.el.style.overflow = 'hidden';
    this.el.style.transition = 'height 0.3s ease';

    this.instance = vnode.context;
    if (this.instance) {
      this.instance.getRow = this.getRow;
      this.instance.componentUpdated = this.componentUpdated;
      this.instance.resizeView = this.resizeView;
      this.instance.updateView = this.updateView;
    }

    this.children = childEl ? this.el.querySelectorAll(childEl) : this.filterNode(this.el.childNodes);

    // 收缩状态不做变化
    const hasOptionChange = this.isChange(value);
    if (!this.options.isExpand) {
      // 初始化高度
      this.el.style.height = height || this.options.height;
    }

    if (!this.children || !this.children.length || !hasOptionChange) {
      return false;
    }

    this.resizeView();

    window.addEventListener('resize', this.handleResize, false);
  };

  componentUpdated = (el, { value }, vnode, oldVNode, force = false) => {
    nextTick(() => {
      const { childEl } = value;

      if (typeof value !== 'boolean') {
        this.el = (value && value.el) ? document.querySelector(value.el) : el;
      } else {
        this.el = el;
      }

      if (!this.el) {
        return false;
      }
      // 可自定义选择节点
      // 默认选择根节点的子节点
      const children = childEl ? this.el.querySelectorAll(childEl) : this.filterNode(this.el.childNodes);
      if (!children.length) {
        return false;
      }

      // 子节点数量或者配置项发生变动时，触发更新
      const isChildrenChagne = !this.children || (children.length !== this.children.length);
      const hasOptionChange = this.isChange(value);

      // force：强制更新
      if (isChildrenChagne || hasOptionChange || force) {
        this.children = children;
        this.resizeView();
      }
    });
  };

  unbind = () => {
    this.el = undefined;
    this.children = undefined;
    this.height = 0;
    this.row = 0;
    this.heightArr = [];
    this.marginBottom = 0;
    this.instance = undefined;
    window.removeEventListener('resize', this.resizeView, false);
  };
}

function getHeight(node) {
  const style = getStyle(node);
  if (!style.height || !style.marginTop || !style.marginBottom) {
    return 0;
  }
  return (
    parseInt(style.height) +
    parseInt(style.marginTop) +
    parseInt(style.marginBottom)
  );
}

function getWidth(node) {
  const style = getStyle(node);
  if (!style.width || !style.marginLeft || !style.marginRight) {
    return 0;
  }
  return (
    parseInt(style.width) +
    parseInt(style.marginLeft) +
    parseInt(style.marginRight)
  );
}

function getStyle(node) {
  return window.getComputedStyle(node);
}

function getBox(node) {
  return node.getBoundingClientRect();
}

export default new Expand();
