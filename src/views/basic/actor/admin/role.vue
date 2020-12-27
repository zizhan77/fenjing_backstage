<template>
  <!-- 角色配置 -->
  <section class="admin-role page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class>
        <template-form
          title="角色配置"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="onChange"
        >
          <template slot-scope="props" v-if="props.item.name === 'role'">
            <el-button class="btn_small" type="primary" @click="createRole">创建</el-button>
            <div class="tag-list mt10">
              <el-tag
                class="admin-role__tag mr10"
                :color="currentIndex === index ? '':'#ffffff'"
                @click="currentIndex = index"
                @close="delRole(index)"
                size="medium"
                closable
                v-for="(tag, index) in roles"
                :key="index"
              >{{tag.name}}</el-tag>
            </div>
          </template>
        </template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>
import TemplateForm from '@components/template-form';
import { get } from 'lodash';
import Message from '@utils/message';
import { isContains } from '@utils/utils';
import API from '@api/basic';

export default {
  name: 'AdminRole',
  components: {
    TemplateForm
  },
  data() {
    return {
      form: {},
      // 角色列表
      roles: [],
      currentIndex: 0,
      menuList: []
    };
  },
  computed: {
    renderData() {
      return [
        {
          type: 'text',
          label: '角色创建:',
          name: 'role',
          value: ''
        },
        {
          type: 'checkboxGroup',
          label: '页面配置:',
          value: [],
          name: 'menuIds',
          required: true,
          options: this.menuList
        }
      ];
    }
  },
  methods: {
    onChange(key, val, form) {      
      if (key === 'menuIds') {
        this.setRoleMenuIds(val);
      }
    },
    setRoleMenuIds(val) {
      this.$set(this.roles[this.currentIndex], 'menuIds', val);
    },
    handleConfirm() {
      if (!this.roles.length) {
        Message.warning('请先创建角色！');
        return false;
      }
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      const params = this.roles.map(item => {
        let { authorityMenuList, menuIds } = item;
        authorityMenuList = authorityMenuList || [];
        const ret = {
          roleId: item.id,
          menuIds: menuIds || authorityMenuList.map(({ id }) => id)
        };
        return ret;
      });
      // const params = {};
      this.$role.post(API.addRoleMenusRel, params, true).then(res => {
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.queryRules();
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    createRole() {
      if (this.form.role && !this.roles.find(({ name }) => name === this.form.role)) {
        this.$service.post(API.addRole, { roleName: this.form.role }, true).then(res => {
          if (res && res.code === 0) {
            Message.success('创建成功');
            this.form.role = '';
            this.queryRules();
          } else {
            Message.error(`${res.message || '创建失败！'}`);
          }
        });
      }
    },
    delRole(index) {
      Message.confirm('删除提示', '确定删除该角色？', () => {
        // this.roles.splice(index, 1);
        this.$service.post(API.deleteRole, { roleId: this.roles[index].id }, true).then(res => {
          if (res && res.code === 0) {
            Message.success('删除成功！');
            this.currentIndex = this.currentIndex === index ? 0 : this.currentIndex;
            this.queryRules();
          } else {
            Message.error(`${res.message || '删除失败！'}`);
          }
        });
      });
    },
    // 查询角色
    queryRules() {
      this.$service.post(API.getRoleList).then(res => {
        if (res) {
          this.roles = res;
          const authorityMenuList = res[this.currentIndex].authorityMenuList || [];
          this.form.menuIds = authorityMenuList.map(item => item.id);
        }
      });
    },
    // 查询菜单列表
    queryMenuList() {
      this.$service.post(API.queryMenuList).then(res => {
        if (res) {
          this.menuList = res.map(({ id, menuName }) => {
            return {
              label: menuName,
              value: id
            };
          });
        }
      });
    }
  },
  created() {
    this.queryRules();
    this.queryMenuList();
    if (this.isEdit) {
      this.queryUserInfo();
    }
  },
  watch: {
    currentIndex(val) {
      if (this.roles && Array.isArray(this.roles) && this.roles.length) {
        let { menuIds, authorityMenuList } = this.roles[val];
        authorityMenuList = authorityMenuList || [];
        this.form.menuIds = menuIds || authorityMenuList.map(item => item.id);
      }
    }
  }
};
</script>
<style lang="scss">
.admin-role {
  &__tag {
    cursor: pointer;
  }
}
</style>
