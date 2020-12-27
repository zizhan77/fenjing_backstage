const MutationDefaultVal = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: false,
  attributeOldValue: true,
  characterDataOldValue: true
};

let Observer;

const MutationDirective = {
  bind(el, binding, vnode) {
    let { value = {} } = binding;
    const options = Object.assign(MutationDefaultVal, value);
    Observer = new MutationObserver(mutations => {
      vnode.context && vnode.context.$emit('onMutation', mutations, el, vnode);
      vnode.componentInstance && vnode.componentInstance.$emit('onMutation', mutations, el, vnode);
    });
    Observer.observe(el, options);
  },
  unbind(el, binding, vnode) {
    Observer.takeRecords();
    Observer.disconnect();
  }
};

export default MutationDirective;
