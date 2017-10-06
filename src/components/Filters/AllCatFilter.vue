<template>
    <li class="all-categories">
        <input id="allCategories" v-model="checked" type="checkbox" @change="changeAll" />
        <label  for="allCategories">Все</label>
    </li>
</template>
<script>
    export default {
        name: 'all-category-filter',
        props: {
            allChecked: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                checked: this.allChecked
            }
        },
        methods: {
            changeAll() {
                if (this.checked) {
                    this.$emit('checkCategories', true);
                } else {
                    this.$emit('checkCategories', false);
                }
            }
        },
        watch: {
            allChecked(check) {
              this.checked = check;
            }
        }

    }
</script>
<style lang="scss">
    .all-categories {
        align-self: flex-start;
        margin-left: 9px;
        text-transform: uppercase;
        text-decoration: underline;
        cursor: pointer;
        padding: 0!important;
        > label {
            padding: 0;
            cursor: pointer;
        }
    }
</style>