<template>
    <li>
        <input id="allCategories" v-model="checked" type="checkbox" @change="changeAll" />
        <label  for="allCategories" class="checkbox">Все</label>
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
<style lang="scss"> </style>