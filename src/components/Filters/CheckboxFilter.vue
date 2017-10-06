<template>
    <li>
        <input v-bind:id="'filter' + filter.value" v-model="checked" type="checkbox" @change="checkboxFilter" />
        <label v-bind:for="'filter' + filter.value" class="checkbox">{{filter.label}}</label>
    </li>
</template>
<script>
    export default{
        name: 'checkbox-filter',
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
            checkboxFilter: function () {
                this.$emit('filter', this.filter.type, this.filter.property, this.filter.value, this.checked)
            }
        }
    }
</script>
<style lang="scss"></style>