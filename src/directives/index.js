import Mutation from './mutation';
import Expand from './expand';

const Directives = {
  Mutation,
  Expand
};

function install(Vue, ops) {
  for (let key in Directives) {
    if (key !== 'install' && Directives.hasOwnProperty(key)) {
      Vue.directive(key.toLocaleLowerCase(), Directives[key]);
    }
  }
};

export default {
  install,
  Mutation,
  Expand
};
