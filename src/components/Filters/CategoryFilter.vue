<template>
    <li>
        <input v-bind:id="'category' + filter.label" v-bind:value="filter.value" v-model="checked" type="checkbox" @change="categoryFilter" />
        <label v-bind:for="'category' + filter.label" class="checkbox">{{filter.label}}</label>
    </li>
</template>
<script>
    export default{
        name: 'category-filter',
        data: function () {
            return {
                checked: false
            }
        },
        props: {
            filter: {
                type: Object,
                required: true
            },
            forceAll: Object
        },
        beforeMount() {
            this.checked = this.filter.initActive;
            this.categoryFilter();
        },
        methods: {
            /**
             * Функция запускает фильтр по категориям
             */
            categoryFilter: function () {
                this.$emit('filter', this.filter.type, {
                    inclusion: this.filter.inclusion,
                    property: this.filter.property,
                }, this.filter.value, this.checked)
            }
        },
        watch: {
            forceAll:{
                handler(forceAll) {
                    this.checked = forceAll.check;
                    this.$emit('filter', this.filter.type, this.filter.inclusion, this.filter.property, this.filter.value, this.checked);
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss">

</style>