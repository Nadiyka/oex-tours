<template>
    <input v-model="value" class="text-filter" @keyup="textFilter" v-bind:placeholder="filter.placeholder" />
</template>

<script>
    export default {
        name: 'text-filter',
        data: function () {
            return {
                value: ''
            }
        },
        props: {
            filter: {
                type: Object,
                required: true
            }
        },
        methods: {
            textFilter: function () {
                this.$emit('filter', this.filter.type, this.filter.property, this.value)
            }
        }
    }
</script>