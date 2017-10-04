<template>
    <li>
        <input v-bind:id="'category' + filter.label" v-bind:value="filter.value" v-model="checked" type="checkbox" @change="categoryFilter" />
        <label v-bind:for="'category' + filter.label" class="checkbox">{{filter.label}}*</label>
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
            }
        },
        methods: {
            categoryFilter: function (event) {
                this.$emit('filter', this.filter.type, this.filter.property, this.filter.value, this.checked)
            }
        }
    }
</script>

<style lang="scss">

</style>